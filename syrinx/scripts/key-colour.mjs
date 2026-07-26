/**
 * key-colour.mjs — is the sky's hue really the creature's key?
 *
 * The claim is that colour is read off the substrate rather than chosen: the
 * lattice root spans exactly one octave (80–160Hz), which maps to exactly one
 * loop of the nebula palette. If that's true, waking the *same* creature in
 * different keys must give measurably different skies — and a modulation, which
 * is just the root moving, must slide the whole field.
 *
 * Seeds the save with a series of roots, wakes it, and samples the sky.
 *
 * Usage: node scripts/key-colour.mjs <outdir>
 */

import { chromium } from 'playwright';

const outdir = process.argv[2] ?? '.';
const URL = 'http://localhost:5199';
const KEY = 'syrinx-creature-v1';
const ROOTS = [80, 95, 110, 128, 145, 158];

/**
 * Mean *chroma* of the nebula, ignoring both the void and the stars.
 *
 * Averaging the whole frame washes the signal out completely — the sky is
 * mostly black with fixed-colour stars in it, so the nebula's hue disappears
 * into the mean. Only mid-luminance pixels are gas, and normalising by
 * brightness measures hue rather than how bright the gas happens to be.
 */
async function skyColour(page) {
  const shot = await page.screenshot({ type: 'png' });
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    const { data, width, height } = g.getImageData(0, 0, img.width, img.height);
    let r = 0;
    let gg = 0;
    let b = 0;
    let n = 0;
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        // skip the middle, where the constellation lives
        if (x > width * 0.3 && x < width * 0.7 && y > height * 0.15 && y < height * 0.85) continue;
        const i = (y * width + x) * 4;
        const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (lum < 7 || lum > 70) continue; // < 7 is void, > 70 is a star
        const s = data[i] + data[i + 1] + data[i + 2];
        r += data[i] / s;
        gg += data[i + 1] / s;
        b += data[i + 2] / s;
        n++;
      }
    }
    if (n === 0) return { r: 0, g: 0, b: 0, n: 0 };
    return { r: r / n, g: gg / n, b: b / n, n };
  }, shot.toString('base64'));
}

const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--mute-audio'],
});
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 700 } });
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));

  // grow one creature, then re-key that same body so nothing but the key differs
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate((k) => localStorage.removeItem(k), KEY);
  await page.reload({ waitUntil: 'networkidle' });
  await page.click('#overlay');
  for (const [x, y] of [[520, 300], [640, 360], [560, 420]]) {
    await page.mouse.click(x, y);
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(7000);
  const save = await page.evaluate((k) => localStorage.getItem(k), KEY);
  if (!save) throw new Error('no save to re-key');

  console.log('  root      sky r,g,b            hue reading');
  console.log('  ' + '─'.repeat(56));
  await page.close();

  const seen = [];
  for (const root of ROOTS) {
    // A fresh page seeded via addInitScript, which runs *before* any page
    // script. Reloading in place does not work: the app persists on
    // `beforeunload`, so the live root is written straight back over the seed
    // and every run comes out in the same key.
    const p = await browser.newPage({ viewport: { width: 1200, height: 700 } });
    const file = JSON.stringify({ ...JSON.parse(save), root });
    await p.addInitScript(([k, s]) => localStorage.setItem(k, s), [KEY, file]);
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.click('#overlay');
    await p.waitForTimeout(4500);

    const shown = await p.textContent('#hud');
    const c = await skyColour(p);
    await p.screenshot({ path: `${outdir}/key-${root}hz.png` });
    await p.close();
    if (!shown?.includes(`key ${Math.round(root)}hz`)) {
      console.log(`  ! seeded ${root}hz but the HUD says: ${shown?.trim()}`);
    }
    // which channel leads tells you where on the loop it is
    const lead = c.r > c.g && c.r > c.b ? 'warm' : c.b > c.r && c.b > c.g ? 'cool' : 'green';
    seen.push({ root, ...c });
    console.log(
      `  ${String(root).padStart(4)}hz   ` +
        `${c.r.toFixed(2).padStart(5)} ${c.g.toFixed(2).padStart(5)} ${c.b.toFixed(2).padStart(5)}   ` +
        `${lead}  r-b ${(c.r - c.b).toFixed(2)}`,
    );
  }

  // the loop should visit genuinely different places, not wobble around one
  // These are *normalised* chroma, so the three channels sum to 1 — a spread of
  // 0.10 here is a large, obvious hue change, not a subtle one. (Calibrating
  // this against raw 0-255 values first made a working mapping look broken.)
  const rb = seen.map((s) => s.r - s.b);
  const spread = Math.max(...rb) - Math.min(...rb);
  console.log(`\n  red-minus-blue spread across the octave: ${spread.toFixed(3)}`);

  // one octave is one loop, so the ends must land back where they started
  const wrap = Math.abs(rb[0] - rb[rb.length - 1]);
  console.log(`  distance from ${ROOTS[0]}hz to ${ROOTS[ROOTS.length - 1]}hz: ${wrap.toFixed(3)}`);
  console.log(
    spread > 0.06
      ? '  ✓ the key visibly changes the sky'
      : '  ✗ the octave barely moves the hue — the mapping is not reading',
  );
  console.log(
    wrap < spread * 0.4
      ? '  ✓ and an octave closes the loop, arriving back at the same hue'
      : '  ✗ the octave does not close the loop — the mapping is off',
  );
} finally {
  await browser.close();
}
