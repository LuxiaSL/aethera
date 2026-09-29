/**
 * shot-mirc.mjs — sit in #aethera in the room's mIRC and photograph it:
 * joined (with the buffer played back), after speaking into a +m channel,
 * during a collapse (Not Responding), after the rejoin, and on a phone.
 *
 *   npm run shot-mirc -- [--base http://localhost:2222] [--out shots/mirc] [--wait 300]
 *
 * --wait is how many seconds to wait for a collapse before giving up on it.
 */

import { mkdirSync } from 'fs';
import { resolve } from 'path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const base = args.base ?? 'http://localhost:2222';
const out = resolve(args.out ?? 'shots/mirc');
const waitCollapse = Number(args.wait ?? 300) * 1000;
mkdirSync(out, { recursive: true });

const { chromium } = await import('playwright');
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const errors = [];
const watch = (page, tag) => {
  page.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/favicon|Failed to load resource|hljs/.test(m.text())) errors.push(`${tag} console: ${m.text()}`);
  });
};
const title = (page) => page.locator('.mirc-window .xp-title').textContent();

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
watch(page, 'desk');
// the room first, so it has been listening a while before mIRC opens (the playback)
await page.goto(`${base}/oikos`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(25000);
await page.locator('.xp-start').click();
await page.waitForTimeout(400);
await page.getByRole('menuitem', { name: /mIRC/ }).click();
await page.waitForTimeout(3000);
await page.screenshot({ path: `${out}/joined.png` });
console.log(`joined: ${await title(page)}`);

const input = page.locator('.mirc-input');
await input.click();
await input.fill('hello? is anyone real here');
await input.press('Enter');
await input.fill('/nick celeste');
await input.press('Enter');
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/spoke.png` });

const t0 = Date.now();
let hung = false;
while (Date.now() - t0 < waitCollapse) {
  if ((await title(page))?.includes('Not Responding')) {
    hung = true;
    break;
  }
  await page.waitForTimeout(1500);
}
if (hung) {
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${out}/hung.png` });
  console.log(`hung: ${await title(page)}`);
  const t1 = Date.now();
  while (Date.now() - t1 < 60000 && (await title(page))?.includes('Not Responding')) await page.waitForTimeout(1000);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/rejoined.png` });
  console.log(`rejoined: ${await title(page)}`);
  await page.getByRole('tab', { name: 'Status' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/status.png` });
} else {
  console.log(`no collapse within ${waitCollapse / 1000}s`);
}
await page.close();

const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
watch(phone, 'phone');
await phone.goto(`${base}/oikos#mirc`, { waitUntil: 'domcontentloaded' });
await phone.waitForTimeout(20000);
await phone.screenshot({ path: `${out}/phone.png` });

await browser.close();
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`ok → ${out}`);
