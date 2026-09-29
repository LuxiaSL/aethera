/**
 * shot.mjs — headless screenshots, so the terminal can be looked at by eye
 * without a human in the loop: the splash, the universe a little later, the
 * stats overlay, haunted mode, the keys panel, a phone, and a resume.
 *
 *     npm run dev &                       # or the real server
 *     node scripts/shot.mjs <outdir> [url]
 *
 * `url` defaults to the dev page; pass http://localhost:8000/afterlife to
 * shoot the site's own page.
 */

import { chromium } from 'playwright';

const outdir = process.argv[2] ?? '.';
const URL = process.argv[3] ?? 'http://localhost:5198/';

// CHROMIUM=/path/to/chrome when playwright's own download doesn't match its version
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || undefined,
  args: ['--autoplay-policy=no-user-gesture-required'],
});
const errors = [];
const watch = (page) => {
  page.on('console', (m) => m.type() === 'error' && errors.push(`[console] ${m.text()}`));
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
};
const status = (page) =>
  page.evaluate(() => {
    const a = window.afterlife;
    const l = a.life;
    return { gen: l.generation, pop: l.population(), zoom: l.zoomLevel, mood: l.detectMood(), haunted: l.haunted, cols: a.term.cols, rows: a.term.rows, ticker: l.ticker.messages.map((m) => m.text) };
  });
try {
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  watch(page);
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outdir}/a-splash.png` });
  await page.click('#splash');
  await page.waitForTimeout(9000);
  await page.screenshot({ path: `${outdir}/b-lived.png` });
  console.log('lived', await status(page));

  await page.keyboard.press('s');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${outdir}/c-stats.png` });
  await page.keyboard.press('s');

  await page.keyboard.press('g');
  await page.waitForTimeout(6000);
  await page.screenshot({ path: `${outdir}/d-haunted.png` });
  console.log('haunted', await status(page));
  await page.keyboard.press('g');

  await page.keyboard.press('z');
  await page.keyboard.press('z');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${outdir}/e-zoomed-out.png` });
  await page.keyboard.press('h');

  await page.keyboard.press('?');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outdir}/f-keys.png` });
  await page.keyboard.press('Escape');

  // leave and come back: the universe remembers
  const gen = (await status(page)).gen;
  await page.evaluate(() => window.afterlife.persist());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  const back = await status(page);
  console.log(`resumed: saved at gen ${gen}, back at gen ${back.gen}; ticker ${JSON.stringify(back.ticker)}`);
  await page.screenshot({ path: `${outdir}/g-resumed.png` });

  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p2 = await phone.newPage();
  watch(p2);
  await p2.goto(URL, { waitUntil: 'networkidle' });
  await p2.tap('#splash');
  await p2.waitForTimeout(6000);
  await p2.screenshot({ path: `${outdir}/h-phone.png` });
  console.log('phone', await status(p2));
} finally {
  await browser.close();
}
if (errors.length) {
  console.log(errors.join('\n'));
  process.exitCode = 1;
}
