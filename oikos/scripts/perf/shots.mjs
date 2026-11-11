// Deterministic GL-canvas captures from ?drive, for before/after comparisons.
// Math.random is seeded, the live feeds are blocked (every screen shows its
// stand-in), and the canvas is read back in the same task it was rendered in.
// Compare two labels with diff.py.
//   node shots.mjs --label before --bundle base [--size 960x600] [--out DIR] [--gpu]
// Writes <out>/shots/<label>/{home-f60,home-f120,focused-f60,focused2-f60}.png.
import { mkdirSync, writeFileSync } from 'fs';
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
const SHOTS = join(OUT, 'shots', LABEL);
mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch({ args: CHROME_ARGS });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.addInitScript(() => {
  let a = 12345;
  Math.random = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  try { sessionStorage.setItem('oikos-booted', '1'); } catch {}
});
await page.route(/\/api\/|\/ws\//, (r) => r.abort());
if (args.bundle) {
  const js = (await import('fs')).readFileSync(join(BUNDLES, args.bundle, 'oikos.js'));
  await page.route(/\/static\/oikos\/oikos\.js/, (r) => r.fulfill({ body: js, contentType: 'text/javascript' }));
}
await page.goto(`${BASE}/oikos?drive`, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForFunction(() => window.__oikos?.step, null, { timeout: 180000, polling: 250 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1500);

async function grab(name, frames) {
  const url = await page.evaluate((n) => {
    window.__oikos.step(n, 1 / 30);
    return document.getElementById('oikos-gl').toDataURL('image/png');
  }, frames);
  writeFileSync(`${SHOTS}/${name}.png`, Buffer.from(url.split(',')[1], 'base64'));
  console.log('shot', name);
}
await grab('home-f60', 60);
await grab('home-f120', 60);
await page.keyboard.press('ArrowRight');
await grab('focused-f60', 60);
await page.keyboard.press('ArrowRight');
await grab('focused2-f60', 60);
console.log('errors:', JSON.stringify(errors));
await browser.close();
