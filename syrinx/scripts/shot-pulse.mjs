/**
 * shot-pulse.mjs — look at the Kuramoto layer with the eyes, in a real browser.
 *
 * The sweep proves the dynamics; this proves the *rendering* of them: that a
 * scattered body and a locked one actually look different, that nothing throws
 * when a whole body strums at once, and that the HUD agrees with the sim.
 *
 * Usage: node scripts/shot-pulse.mjs <outdir>
 */

import { chromium } from 'playwright';

const outdir = process.argv[2] ?? '.';
const URL = 'http://localhost:5199';

const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--mute-audio'],
});
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`);
  });
  page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`));

  // start from a fresh creature so the run is comparable to itself
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.removeItem('syrinx-creature-v1'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.click('#overlay');

  // feed it up to a body worth listening to
  for (const [x, y] of [[760, 400], [900, 460], [820, 340], [700, 520], [880, 380]]) {
    await page.mouse.click(x, y);
    await page.waitForTimeout(700);
  }
  await page.waitForTimeout(9000);

  const hud = async () => (await page.textContent('#hud'))?.trim() ?? '';
  const press = async (key, times) => {
    for (let i = 0; i < times; i++) {
      await page.keyboard.press(key);
      await page.waitForTimeout(40);
    }
  };

  const shots = [];
  const capture = async (label) => {
    await page.screenshot({ path: `${outdir}/pulse-${label}.png` });
    shots.push(`${label.padEnd(12)} ${await hud()}`);
  };

  await capture('a-default');

  await press('BracketLeft', 20); // down to K = 0
  await page.waitForTimeout(14000);
  await capture('b-scattered');

  await press('BracketRight', 60); // up to the ceiling
  await page.waitForTimeout(14000);
  await capture('c-locked');

  await press('BracketLeft', 50); // back to the living band
  await page.waitForTimeout(12000);
  await capture('d-partial');

  await page.keyboard.press('k'); // pulse alone
  await page.waitForTimeout(3000);
  await capture('e-pulse-only');
  await page.keyboard.press('k'); // breath alone
  await page.waitForTimeout(3000);
  await capture('f-breath-only');

  // this is meant to be left open in a tab, so the frame cost matters as much
  // as the picture. Software GL in CI is far slower than a real GPU — this is a
  // regression tripwire, not an absolute number.
  const fps = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let frames = 0;
        const t0 = performance.now();
        const tick = () => {
          frames++;
          if (performance.now() - t0 < 4000) requestAnimationFrame(tick);
          else resolve(Math.round((frames * 1000) / (performance.now() - t0)));
        };
        requestAnimationFrame(tick);
      }),
  );

  console.log(shots.join('\n'));
  console.log(`\nframe rate (swiftshader, software): ${fps} fps`);
  console.log(errors.length ? `\nERRORS:\n${errors.join('\n')}` : '\nno page errors');
} finally {
  await browser.close();
}
