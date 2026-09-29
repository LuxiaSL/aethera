/**
 * compare-irc.mjs — the channel in its three places, photographed side by
 * side: the standalone page, its embed, and the room (the screen looked at,
 * the pane, and the page tuned in on the glass).
 *
 *   npm run compare-irc -- [--base http://localhost:2222] [--out shots/irc]
 */

import { mkdirSync } from 'fs';
import { resolve } from 'path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const base = args.base ?? 'http://localhost:2222';
const out = resolve(args.out ?? 'shots/irc');
const settle = Number(args.settle ?? 20000);
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

async function shoot(tag, url, size, after) {
  const page = await browser.newPage({ viewport: size });
  watch(page, tag);
  await page.goto(`${base}${url}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(settle);
  if (after) await after(page);
  await page.screenshot({ path: `${out}/${tag}.png` });
  console.log(`shot ${tag}`);
  await page.close();
}

const desk = { width: 1440, height: 900 };
await shoot('page', '/irc', desk);
await shoot('embed', '/irc?embed=1', { width: 900, height: 675 });
await shoot('page-phone', '/irc', { width: 390, height: 844 });
await shoot('room-look', '/oikos?look=irc', desk);
await shoot('room-pane', '/oikos#irc', desk);
await shoot('room-tuned', '/oikos#irc', desk, async (page) => {
  await page.getByRole('button', { name: '▣ Watch it here' }).click();
  await page.waitForTimeout(10000);
});

await browser.close();
if (errors.length) console.error(errors.join('\n'));
console.log(`→ ${out}`);
