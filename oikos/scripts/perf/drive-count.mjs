// Work per second in each UI state, stepping the room's own clock (?drive):
// home, one screen focused, pane open, pane maximised, back home, stand by.
// Counts (draws, renders, texture uploads, 2D calls) are what to compare; ms
// depend on the machine. --hz is the step rate: 30 is the new idle cap, 60 a
// 60 Hz display rendering every vsync (what the old loop did at home).
//   node drive-count.mjs --label before --bundle base --hz 60 [--secs 2]
//     [--size 960x600] [--base http://127.0.0.1:8079] [--out DIR] [--gpu]
// Writes <out>/drive-count-<label>@<hz>.json.
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
const BASE = args.base ?? 'http://127.0.0.1:8079';
mkdirSync(OUT, { recursive: true });
const LABEL = args.label ?? 'run';
const [W, H] = (args.size ?? '960x600').split('x').map(Number);
const instrument = readFileSync(join(HERE, 'instrument.js'), 'utf8');

const browser = await chromium.launch({
  args: CHROME_ARGS,
});
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.addInitScript(instrument);
if (args.bundle) {
  const js = readFileSync(join(BUNDLES, args.bundle, 'oikos.js'));
  await page.route(/\/static\/oikos\/oikos\.js/, (r) => r.fulfill({ body: js, contentType: 'text/javascript' }));
}
const HZ = Number(args.hz ?? 30);
await page.goto(`${BASE}/oikos?drive`, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForFunction(() => window.__oikos?.step, null, { timeout: 180000, polling: 250 });
await page.waitForTimeout(3000); // feeds land

const results = [];
async function sample(name, frames = 60) {
  const r = await page.evaluate(([n, hz]) => {
    const s0 = window.__perf.snapshot();
    const p = window.__oikos.step(n, 1 / hz);
    const s1 = window.__perf.snapshot();
    const g0 = s0.gl['oikos-gl'] ?? {};
    const g1 = s1.gl['oikos-gl'] ?? {};
    const d = (k) => ((g1[k] ?? 0) - (g0[k] ?? 0)) / n;
    const c = Object.fromEntries(Object.keys(s1.c2d).map((k) => [k, +((s1.c2d[k] - s0.c2d[k]) / n).toFixed(1)]));
    return {
      draws: +d('draws').toFixed(1), tris: Math.round(d('tris')), fbBinds: +d('fbBinds').toFixed(1),
      programSwitches: +d('programs').toFixed(1),
      uploadsPerSec: +(d('texUploads') * hz).toFixed(1), texMBPerSec: +((d('texBytes') * hz) / 1e6).toFixed(1),
      screenUploadsPerSec: +((p.uploads / n) * hz).toFixed(1),
      renderedPerSec: +(((p.rendered ?? n) / n) * hz).toFixed(1),
      drawsPerSec: Math.round(d('draws') * hz),
      fillTextPerSec: +(c.fillText * hz).toFixed(0), c2dPerFrame: c, focused: p.focused,
    };
  }, [frames, HZ]);
  r.name = name;
  results.push(r);
  console.log(JSON.stringify(r));
}
const step = (n) => page.evaluate(([k, hz]) => window.__oikos.step(k, 1 / hz), [Math.round((n * HZ) / 30), HZ]);

await step(30); // past power-on
await sample('home', Math.round(Number(args.secs ?? 2) * HZ));
await page.mouse.move(W / 2, H / 2);
await page.keyboard.press('ArrowRight');
await step(45);
await sample('one screen focused', Math.round(Number(args.secs ?? 2) * HZ));
await page.keyboard.press('Enter');
for (let i = 0; i < 6; i++) await step(15);
await page.waitForTimeout(500);
const paneOpen = await page.evaluate(() => !!document.querySelector('.xp-window[aria-label*="—"]'));
console.log('pane open:', paneOpen);
await sample('pane open', Math.round(Number(args.secs ?? 2) * HZ));
await page.evaluate(() => {
  const w = [...document.querySelectorAll('.xp-window')].find((x) => x.getAttribute('aria-label')?.includes('—'));
  w?.querySelector('.xp-max')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});
await step(10);
console.log('maximised:', await page.evaluate(() => !!document.querySelector('.xp-window.maximized')));
await sample('pane maximised', Math.round(Number(args.secs ?? 2) * HZ));
await page.evaluate(() => document.querySelectorAll('.xp-window .xp-close').forEach((b) => b.dispatchEvent(new MouseEvent('click', { bubbles: true }))));
await page.keyboard.press('Escape');
await step(45);
await sample('back home', Math.round(Number(args.secs ?? 2) * HZ));
const sb = await page.evaluate(async () => {
  document.querySelector('.xp-start')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 300));
  const off = [...document.querySelectorAll('.xp-startmenu button, .xp-startmenu a')].find((b) => /turn off/i.test(b.textContent ?? ''));
  off?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 300));
  const stand = [...document.querySelectorAll('.xp-shutdown button')].find((b) => /stand ?by/i.test(b.textContent ?? ''));
  stand?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  return document.getElementById('oikos')?.classList.contains('standby') ?? false;
});
console.log('standby:', sb);
await step(45);
await sample('stand by', Math.round(Number(args.secs ?? 2) * HZ));
console.log('errors:', JSON.stringify(errors));
writeFileSync(`${OUT}/drive-count-${LABEL}@${HZ}.json`, JSON.stringify({ results, errors }, null, 1));
await browser.close();
