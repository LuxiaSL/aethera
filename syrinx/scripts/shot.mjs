/**
 * shot.mjs — headless screenshot harness so the renderer can be iterated by
 * eye without a human in the loop. Wakes the creature, lets it live a little,
 * pokes it, and captures frames.
 *
 * Usage: node scripts/shot.mjs <outdir> [label]
 */

import { chromium } from 'playwright';

const outdir = process.argv[2] ?? '.';
const label = process.argv[3] ?? 'shot';
const URL = 'http://localhost:5199';

const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--disable-gpu-sandbox'],
});
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error('[page]', msg.text());
  });
  page.on('pageerror', (err) => console.error('[pageerror]', err.message));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.click('#overlay'); // wake it
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${outdir}/${label}-a-early.png` });

  // feed it a few times so there are motes and growth to look at
  for (const [x, y] of [[700, 380], [950, 500], [820, 300]]) {
    await page.mouse.click(x, y);
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(6000);
  await page.screenshot({ path: `${outdir}/${label}-b-lived.png` });

  await page.waitForTimeout(6000);
  await page.screenshot({ path: `${outdir}/${label}-c-later.png` });
  console.log('done');
} finally {
  await browser.close();
}
