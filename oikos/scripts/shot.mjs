/**
 * shot.mjs — photograph the room, the way `syrinx`'s shot does: a real browser
 * against the real server, so "does it look right" is looked at, not guessed.
 *
 *   uv run python -m aethera.main            # in the repo root
 *   npm run shot -- [--base http://localhost:2222] [--out shots] [--size 1440x900]
 *
 * Writes: room.png (after power-on), home.png (the VCR's directory), pane.png
 * (a tape playing), and phone.png. Fails on any page error.
 */

import { createRequire } from 'module';
import { mkdirSync } from 'fs';
import { resolve } from 'path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const base = args.base ?? 'http://localhost:2222';
const out = resolve(args.out ?? 'shots');
const [w, h] = (args.size ?? '1440x900').split('x').map(Number);
const play = args.play ?? 'dreams';
mkdirSync(out, { recursive: true });

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    const require = createRequire(import.meta.url);
    for (const p of ['/opt/node22/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright', '/usr/lib/node_modules/playwright']) {
      try {
        return require(p);
      } catch {
        /* next */
      }
    }
    throw new Error('playwright not found (npm i -D playwright, or install it globally)');
  }
}

const { chromium } = await loadPlaywright();
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const errors = [];
const watch = (page) => {
  page.on('pageerror', (e) => {
    if (!/hljs/.test(e.message)) errors.push(`pageerror: ${e.message}`);
  });
  page.on('console', (m) => {
    // base.html's CDN highlight.js is not ours to judge (and is blocked in some sandboxes)
    if (m.type() === 'error' && !/favicon|Failed to load resource|hljs/.test(m.text())) errors.push(`console: ${m.text()}`);
  });
};

const page = await browser.newPage({ viewport: { width: w, height: h } });
watch(page);
const q = args.speed ? `?speed=${args.speed}` : '';
await page.goto(`${base}/oikos${q}`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(Number(args.settle ?? 14000));
await page.screenshot({ path: `${out}/room.png` });
const fps = await page.evaluate(
  () => new Promise((done) => {
    let n = 0;
    const t0 = performance.now();
    const f = () => (performance.now() - t0 < 2000 ? (n++, requestAnimationFrame(f)) : done(n / 2));
    requestAnimationFrame(f);
  }),
);
console.log(`fps ≈ ${fps}`);

await page.keyboard.press('Home');
await page.waitForTimeout(1500);
const tile = page.locator(`.xp-tile[data-id="${play}"]`);
await tile.click();
await page.waitForTimeout(1600);
await page.screenshot({ path: `${out}/home.png` });

await tile.dblclick();
await page.waitForTimeout(4500);
await page.screenshot({ path: `${out}/pane.png` });

await page.keyboard.press('Escape');
await page.keyboard.press('Escape');
await page.locator('.xp-start').click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/start.png` });

// one software-rendered room at a time, or neither finishes a frame
await page.close();
const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
watch(phone);
await phone.goto(`${base}/oikos${q}#syrinx`, { waitUntil: 'domcontentloaded' });
await phone.waitForTimeout(Number(args.settle ?? 9000));
await phone.screenshot({ path: `${out}/phone.png` });

await browser.close();
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`ok → ${out}`);
