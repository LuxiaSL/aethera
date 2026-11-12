// Real-loop rate check under a fake clock: the page's own rAF loop runs on
// Playwright's clock (16 ms vsyncs), so we can count how many frames the room
// renders per fake second whatever the GPU's speed. framesPerSec = draws per
// second / --dpf, the draws in one home frame (145 after this branch, 177
// before; drive-count.mjs prints it). States: idle at home, dragging, just
// after input, idle again, flying to a screen, focused idle, a maximised
// window (glimpsed), restored, WebGL context lost, context restored.
//   node cap-test.mjs --bundle all --dpf 145 [--size 480x300] [--out DIR] [--gpu]
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []));
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(args.out ?? join(HERE, 'out'));
// a bundle under <bundles>/<name>/oikos.js is served in place of the page's own (see variant.sh)
const BUNDLES = resolve(args.bundles ?? join(OUT, 'bundles'));
// software GL by default (no GPU); --gpu for a real one (add --chrome-args for its flags)
const CHROME_ARGS = 'gpu' in args
  ? ['--ignore-gpu-blocklist', '--enable-gpu', ...(args['chrome-args'] ?? '').split(' ').filter(Boolean)]
  : ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
mkdirSync(OUT, { recursive: true });
const [W, H] = (args.size ?? '480x300').split('x').map(Number);
const browser = await chromium.launch({ args: CHROME_ARGS });
const ctx = await browser.newContext({ viewport: { width: W, height: H } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (/oikos/.test(m.text())) console.log('console:', m.text()); });
await page.clock.install({ time: new Date('2026-11-11T12:00:00Z') });
await page.addInitScript(readFileSync(join(HERE, 'instrument.js'), 'utf8'));
await page.addInitScript(() => { try { sessionStorage.setItem('oikos-booted', '1'); } catch {} });
await page.route(/\/api\/|\/ws\//, (r) => r.abort());
if (args.bundle) {
  const js = readFileSync(join(BUNDLES, args.bundle, 'oikos.js'));
  await page.route(/\/static\/oikos\/oikos\.js/, (r) => r.fulfill({ body: js, contentType: 'text/javascript' }));
}
await page.goto(`${args.base ?? 'http://127.0.0.1:8079'}/`, { waitUntil: 'load', timeout: 120000 });
for (let i = 0; i < 300; i++) {
  await page.clock.runFor(100);
  if (await page.evaluate(() => !!window.__perf.marks.bootGone)) break;
}
console.log('booted:', await page.evaluate(() => !!window.__perf.marks.bootGone));
// from here fake time moves only when we say (install() lets it flow with the wall clock)
await page.clock.pauseAt(new Date((await page.evaluate(() => Date.now())) + 1000));
await page.clock.runFor(4000); // power-on and the first balloon settle
const frames = () => page.evaluate(() => { const g = window.__perf.snapshot().gl["oikos-gl"] ?? {}; return g.screenBinds ?? 0; });
const draws = () => page.evaluate(() => window.__perf.snapshot().gl["oikos-gl"]?.draws ?? 0);
async function rate(name, ms, during) {
  const f0 = await frames();
  const d0 = await draws();
  if (during) await during();
  else await page.clock.runFor(ms);
  const f1 = await frames();
  const d1 = await draws();
  const r = { name, fakeMs: ms, framesPerSec: Math.round(((d1 - d0) / ms) * 1000 / DPF), screenBinds: f1 - f0, bindsPerSec: +(((f1 - f0) / ms) * 1000).toFixed(1), drawsPerSec: Math.round(((d1 - d0) / ms) * 1000) };
  console.log(JSON.stringify(r));
  return r;
}
const DPF = Number(args.dpf ?? 145); // draws per rendered frame at home (binds-per-frame.mjs)
const results = [];
results.push(await rate('idle at home', 2000));
// a drag: pointer moves every 16 ms (fake) for 1 s
results.push(await rate('dragging', 1000, async () => {
  await page.mouse.move(W / 2, H / 2);
  await page.mouse.down();
  for (let i = 0; i < 31; i++) {
    await page.mouse.move(W / 2 + i * 3, H / 2);
    await page.clock.runFor(32);
  }
  await page.mouse.up();
}));
results.push(await rate('just after input (grace)', 1000));
results.push(await rate('idle again', 2000));
// a flight: → focuses the next screen (a 1.15 s tween)
await page.keyboard.press('ArrowRight');
results.push(await rate('flying to a screen', 1000));
await page.clock.runFor(2500);
results.push(await rate('focused, idle', 2000));
// maximise a window over the room: ~ (home) then its max button
await page.keyboard.press('Home');
await page.clock.runFor(1500);
await page.evaluate(() => document.querySelector('.xp-window .xp-max')?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
await page.clock.runFor(2500);
results.push(await rate('maximised window (glimpsed)', 2000));
await page.evaluate(() => document.querySelector('.xp-window.maximized .xp-max')?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
await page.clock.runFor(500);
results.push(await rate('restored', 2000));
// a GPU reset: lose the context, then give it back
const lost = await page.evaluate(() => {
  const gl = document.getElementById('oikos-gl').getContext('webgl2');
  const ext = gl.getExtension('WEBGL_lose_context');
  window.__lose = ext;
  ext.loseContext();
  return !!ext;
});
await page.clock.runFor(500);
const dark = await page.evaluate(() => ({ canvas: getComputedStyle(document.getElementById('oikos-gl')).visibility, balloon: document.querySelector('.xp-balloon')?.textContent ?? null }));
console.log('lost:', lost, JSON.stringify(dark));
results.push(await rate('context lost', 2000));
await page.evaluate(() => window.__lose.restoreContext());
await page.clock.runFor(1500);
results.push(await rate('context restored', 2000));
const back = await page.evaluate(() => getComputedStyle(document.getElementById('oikos-gl')).visibility);
const shot = await page.evaluate(() => { window.__perf; return null; });
await page.screenshot({ path: `${OUT}/cap-test-${args.bundle ?? 'served'}-after-restore.png` });
console.log('canvas after restore:', back, 'errors:', JSON.stringify(errors));
writeFileSync(`${OUT}/cap-test-${args.bundle ?? 'served'}.json`, JSON.stringify({ results, errors }, null, 1));
await browser.close();
