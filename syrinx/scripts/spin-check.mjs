/**
 * spin-check.mjs — does the flywheel actually behave like a flywheel?
 *
 * The camera's momentum is a feel feature, and feel is exactly what a headless
 * agent cannot check. So measure it instead: sample the azimuth over time and
 * assert the four things the behaviour is supposed to have —
 *
 *   1. at rest it turns at the old constant pace, unchanged
 *   2. a fling leaves it turning much faster, in the direction you threw it
 *   3. it eases back to the resting pace rather than snapping
 *   4. flung backwards it really does reverse, then comes back around
 *
 * Usage: node scripts/spin-check.mjs
 */

import { chromium } from 'playwright';

const URL = 'http://localhost:5199';
const REST = -(0.35 * (2 * Math.PI)) / 60; // rad/s — what autoRotateSpeed 0.35 gave

let failures = 0;
function check(ok, msg) {
  console.log(`${ok ? '✓' : '✗'} ${msg}`);
  if (!ok) failures++;
}

/** Average azimuthal rate (rad/s) over `ms`, unwrapped. */
async function rate(page, ms) {
  return page.evaluate(
    (dur) =>
      new Promise((resolve) => {
        const p = window.syrinxSpin;
        const TAU = Math.PI * 2;
        let last = p.azimuth();
        let total = 0;
        const t0 = performance.now();
        const tick = () => {
          const now = p.azimuth();
          let d = now - last;
          while (d > Math.PI) d -= TAU;
          while (d < -Math.PI) d += TAU;
          total += d;
          last = now;
          if (performance.now() - t0 < dur) requestAnimationFrame(tick);
          else resolve((total * 1000) / (performance.now() - t0));
        };
        requestAnimationFrame(tick);
      }),
    ms,
  );
}

/** Right-drag by (dx, dy), slow enough that several frames see it. */
async function fling(page, dx, dy = 0) {
  const x0 = 800 - dx / 2;
  const y0 = 450 - dy / 2;
  await page.mouse.move(x0, y0);
  await page.mouse.down({ button: 'right' });
  for (let i = 1; i <= 10; i++) {
    await page.mouse.move(x0 + (dx * i) / 10, y0 + (dy * i) / 10);
    await page.waitForTimeout(35);
  }
  await page.mouse.up({ button: 'right' });
}

/** Sample the eye's height above the target plane, -1..1, over `ms`. */
async function elevations(page, ms, every = 200) {
  const out = [];
  const until = Date.now() + ms;
  while (Date.now() < until) {
    out.push(await page.evaluate(() => window.syrinxSpin.elevation()));
    await page.waitForTimeout(every);
  }
  return out;
}

const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--mute-audio'],
});
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  page.on('pageerror', (e) => check(false, `page error: ${e.message}`));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.click('#overlay');
  await page.waitForTimeout(3000);

  // Assert on the spin *state*, not the observed rate. `frame()` clamps dt to
  // 0.1s, so anything under 10fps (i.e. the software rasteriser this runs on)
  // advances in slow motion and the observed rate reads about half. The state
  // is frame-rate independent; the rate is only used for direction and ratios.
  const spin = () => page.evaluate(() => window.syrinxSpin.spin());

  const restingSpin = await spin();
  const resting = await rate(page, 3000);
  console.log(`  resting spin ${restingSpin.toFixed(4)} rad/s (expected ${REST.toFixed(4)})`);
  check(
    Math.abs(restingSpin - REST) < Math.abs(REST) * 0.05,
    'at rest it turns at the pace it always did',
  );

  // Press-and-hold with no rotation is the "hold still so I can aim at it"
  // gesture: it must stop the world dead, and letting go without having turned
  // anything must resume the resting pace rather than whatever it was doing.
  const azBefore = await page.evaluate(() => window.syrinxSpin.azimuth());
  await page.mouse.move(800, 450);
  await page.mouse.down({ button: 'right' });
  await page.waitForTimeout(1500);
  const heldSpin = await spin();
  const azHeld = await page.evaluate(() => window.syrinxSpin.azimuth());
  await page.mouse.up({ button: 'right' });
  await page.waitForTimeout(700);
  const releasedSpin = await spin();
  console.log(
    `  held: spin ${heldSpin.toFixed(4)}, azimuth moved ${Math.abs(azHeld - azBefore).toFixed(4)} rad`,
  );
  check(heldSpin === 0 && Math.abs(azHeld - azBefore) < 0.01, 'a bare right-click halts it dead');
  check(
    Math.abs(releasedSpin - REST) < Math.abs(REST) * 0.05,
    'and letting go without turning resumes the resting pace',
  );

  // right-drag decreases theta, which is the same direction rest already turns
  await fling(page, 700);
  const flungSpin = await spin();
  const flung = await rate(page, 900);
  console.log(`  after a right-fling: spin ${flungSpin.toFixed(3)}, rate ${flung.toFixed(3)}`);
  check(Math.abs(flung) > Math.abs(resting) * 2.5, 'a fling leaves it turning much faster');
  check(flung < 0 && flungSpin < REST, 'and in the direction it was thrown');

  // Test the *shape* of the return, not a wall-clock deadline: the dt clamp
  // means a slow machine gets through less sim-time than real time, so "is it
  // home after N seconds" is a question about the frame rate, not the easing.
  // Monotonic approach with no overshoot is the property that actually matters.
  const excess = [Math.abs(flungSpin - REST)];
  for (const wait of [5000, 10000]) {
    await page.waitForTimeout(wait);
    excess.push(Math.abs((await spin()) - REST));
  }
  console.log(`  distance from rest: ${excess.map((e) => e.toFixed(3)).join(' → ')}`);
  check(
    excess[1] < excess[0] && excess[2] < excess[1],
    'and it eases back toward the resting pace, never away from it',
  );
  check(excess[2] < excess[0] * 0.3, 'covering most of the distance home');

  // left-drag runs *against* the resting direction — the real test, since it
  // has to reverse and then come back around through zero
  await fling(page, -700);
  const back = await rate(page, 900);
  console.log(`  after a left-fling: rate ${back.toFixed(3)} rad/s`);
  check(
    back > 0 && Math.abs(back) > Math.abs(resting) * 2.5,
    'flung against the resting direction, it really does reverse',
  );

  // The one the spherical camera could never pass. A vertical fling has to roll
  // straight over the top and keep going — if there is a pole, elevation pins
  // near ±1 and the motion dies there instead of coming back down the far side.
  await page.waitForTimeout(6000);
  await fling(page, 0, -620);
  const arc = await elevations(page, 11000);
  const hi = Math.max(...arc);
  const lo = Math.min(...arc);
  console.log(`  vertical fling swept elevation ${lo.toFixed(2)} … ${hi.toFixed(2)}`);
  check(hi > 0.8 && lo < -0.8, 'a vertical fling tumbles clean over both poles');
  const stuck = arc.filter((e) => Math.abs(e) > 0.97).length;
  check(stuck < arc.length * 0.3, 'and does not stall at the top');

  // A scroll must not brake it. Measure from a *settled* state: run this while
  // the spin is still easing home and the natural decay looks exactly like a
  // brake, which is what made this read as a failure the first time.
  await page.waitForTimeout(22000);
  const beforeScroll = await spin();
  await page.mouse.move(800, 450);
  await page.mouse.wheel(0, -220);
  await page.waitForTimeout(400);
  const afterScroll = await spin();
  console.log(`  scroll: spin ${beforeScroll.toFixed(4)} → ${afterScroll.toFixed(4)} rad/s`);
  check(
    Math.abs(afterScroll - REST) < Math.abs(REST) * 0.3,
    'zooming does not read as a fling of zero and brake it',
  );
} finally {
  await browser.close();
}

console.log(failures === 0 ? '\nthe flywheel spins true.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
