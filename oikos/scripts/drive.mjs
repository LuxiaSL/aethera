/**
 * drive.mjs — take the room for a walk, one frame at a time.
 *
 * shot.mjs photographs a few states. This drives the real page through every
 * interaction a visitor has (hover, orbit, the VCR, a tape going in, tuning
 * in, eject, the start menu, walking the screens, a channel typed like a
 * remote, the dive through the glass) and steps the room at a true 30 fps via
 * ?drive, so the animations can be watched even on a machine with no GPU,
 * where WebGL runs in software at a couple of frames a second.
 *
 *   uv run python -m aethera.main          # repo root
 *   npm run drive -- [--browser chromium|firefox|webkit] [--out drive] [--size 1280x800] [--phone]
 *
 * Writes <out>/<browser>/: key.<name>.jpg at each beat, tour.webm (every
 * frame, when an ffmpeg is at hand), and prints per-frame timings (painting
 * the screens vs rendering) and any page errors. Exits 1 on errors.
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { createRequire } from 'module';
import { join, resolve } from 'path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const base = args.base ?? 'http://localhost:2222';
const which = args.browser ?? 'chromium';
const phone = 'phone' in args;
const out = resolve(args.out ?? 'drive', phone ? `${which}-phone` : which);
const [W, H] = (args.size ?? (phone ? '390x844' : '1280x800')).split('x').map(Number);
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
    throw new Error('playwright not found');
  }
}

const pw = await loadPlaywright();
const launchArgs = which === 'chromium' ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] : [];
const browser = await pw[which].launch({ args: launchArgs });
const page = await browser.newPage(
  phone ? { viewport: { width: W, height: H }, isMobile: which !== 'firefox', hasTouch: true } : { viewport: { width: W, height: H } },
);

const errors = [];
page.on('pageerror', (e) => {
  if (!/hljs/.test(e.message)) errors.push(`pageerror: ${e.message}`);
});
page.on('console', (m) => {
  if (m.type() === 'error' && !/favicon|Failed to load resource|hljs|net::ERR/.test(m.text())) errors.push(`console: ${m.text()}`);
});

// ---- frames -----------------------------------------------------------------

let n = 0;
const frames = join(out, 'frames');
mkdirSync(frames, { recursive: true });
const perf = { frames: 0, paint: 0, render: 0 };

async function frame() {
  await page.screenshot({ path: join(frames, `${String(n++).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 82 });
}

/** advance `count` frames at 30 fps, photographing every `every`th */
async function run(count, every = 1) {
  for (let i = 0; i < count; i++) {
    const p = await page.evaluate(() => window.__oikos.step(1, 1 / 30));
    perf.frames += p.frames;
    perf.paint += p.paint;
    perf.render += p.render;
    if (i % every === 0) await frame();
  }
}

async function key(name) {
  await page.screenshot({ path: join(out, `key.${name}.jpg`), type: 'jpeg', quality: 88 });
  console.log(`  · ${name}`);
}

const anchor = (id) => page.evaluate((i) => window.__oikos.anchor(i), id);

// ---- the tour -----------------------------------------------------------------

await page.goto(`${base}/oikos?drive`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__oikos && !document.getElementById('oikos-boot'), null, { timeout: 60000 });
console.log(`${which}: booted`);

// the tubes warm up, one after another
await run(90, 2);
await key('powered');

if (phone) await phoneTour();
else await desktopTour();

async function phoneTour() {
  // tap a screen: its tape goes in and its pane comes up as a sheet
  let p = await anchor('transmissions');
  await page.touchscreen.tap(p.x, p.y + 30);
  await run(90, 2);
  await key('tap-screen');
  // Watch it here, on a phone
  const watch = page.getByRole('button', { name: '▣ Watch it here' });
  if (await watch.count()) {
    await watch.tap();
    await run(45, 1);
    await page.waitForTimeout(1200);
    await run(4, 1);
    await key('tuned');
    await page.getByRole('button', { name: '⏏ Eject' }).tap();
    await run(45, 2);
  }
  // close the sheet, tap the VCR: the directory as a sheet
  await page.locator('.xp-window .xp-close').first().tap();
  await run(30, 2);
  p = await anchor('vcr');
  await page.touchscreen.tap(p.x, p.y - 10);
  await run(30, 2);
  await key('tap-vcr');
  // one tap selects a tape, a second plays it
  const tile = page.locator('.xp-tile[data-id="irc"]');
  await tile.tap();
  await run(20, 2);
  await tile.tap();
  await run(90, 2);
  await key('tap-tap');
  await page.locator('.xp-start').tap();
  await run(4, 1);
  await key('start');
}

async function desktopTour() {
  // hover a screen: tooltip, the tube brightens
  let a = await anchor('dreams');
  await page.mouse.move(a.x, a.y + 40, { steps: 4 });
  await run(12, 2);
  await key('hover');

  // orbit: drag the room round
  await page.mouse.move(W / 2, H * 0.7);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) {
    await page.mouse.move(W / 2 + i * 30, H * 0.7, { steps: 2 });
    await run(2, 1);
  }
  await page.mouse.up();
  await run(20, 2);
  await key('orbit');

  // the VCR: the home directory opens
  a = await anchor('vcr');
  await page.mouse.click(a.x, a.y - 12);
  await run(24, 2);
  await key('vcr');

  // select a tape: the room turns to its screen
  await page.locator('.xp-tile[data-id="apeiron"]').click();
  await run(45, 2);
  await key('selected');

  // play it: the directory folds away, the camera stops by the VCR as the tape
  // goes in, follows the cable, arrives as the channel changes; then the pane
  await page.locator('.xp-tile[data-id="apeiron"]').dblclick();
  await run(30, 1);
  await key('tape-in');
  await run(50, 1);
  await key('playing');

  // tune in: the live page on the glass
  const watch = page.getByRole('button', { name: '▣ Watch it here' });
  if (await watch.count()) {
    await watch.click();
    await run(45, 1);
    await page.waitForTimeout(1200); // the tube's power-on is CSS, on the wall clock
    await run(6, 1);
    await key('tuned');
    await page.getByRole('button', { name: '⏏ Eject' }).click();
    await run(45, 2);
    await key('ejected');
  }

  // close the pane: the tape comes back out
  await page.keyboard.press('Escape');
  await run(40, 1);
  await key('tape-out');
  await page.keyboard.press('Escape');
  await run(10, 2);

  // start menu, and the dialog everyone remembers
  await page.locator('.xp-start').click();
  await run(4, 1);
  await key('start');
  await page.getByRole('button', { name: 'Turn Off Computer' }).click();
  await run(4, 1);
  await key('turn-off');
  await page.getByRole('button', { name: 'Cancel' }).click();

  // walk the screens with the arrows
  await page.mouse.click(W / 2, H * 0.92); // focus the room (empty floor)
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowRight');
    await run(38, 2);
  }
  await key('walked');

  // a channel, typed like a remote: 7 is syrinx
  await page.keyboard.press('7');
  await page.waitForTimeout(900);
  await run(85, 2);
  await key('channel-7');

  // open it: the dive through the glass (then the page leaves)
  const open = page.locator('.xp-window .xp-btn.default').first();
  if (await open.count()) {
    const bound = await page.evaluate(() => location.origin);
    await open.click();
    // step through the dive until the page leaves (a wall-clock fallback also
    // sends it after 1.5 s, which on a slow machine comes first)
    try {
      for (let i = 0; i < 30; i++) {
        await run(1, 1);
        if (i === 10) await key('dive');
      }
    } catch (err) {
      if (!/Execution context was destroyed|navigation/.test(String(err))) throw err;
    }
    await page.waitForURL((u) => !u.pathname.startsWith('/oikos'), { timeout: 20000 }).catch(() => {});
    await page.waitForLoadState('domcontentloaded');
    const landed = page.url();
    console.log(`  · dove through the glass to ${landed.replace(bound, '')}`);
    if (!/\/syrinx$/.test(landed)) errors.push(`dive landed on ${landed}, expected /syrinx`);
    await page.waitForTimeout(1500);
    await key('landed');
  }
}

await browser.close();

// ---- report ---------------------------------------------------------------------

const f = Math.max(1, perf.frames);
console.log(`frames stepped: ${perf.frames}; per frame: paint ${(perf.paint / f).toFixed(1)} ms, render ${(perf.render / f).toFixed(1)} ms`);

const ffmpeg = ['/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux', process.env.FFMPEG].find((p) => p && existsSync(p));
if (ffmpeg) {
  const list = readdirSync(frames).filter((x) => x.endsWith('.jpg')).sort();
  const enc = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '24', '-c:v', 'mjpeg', '-i', 'pipe:0', '-c:v', 'libvpx', '-b:v', '3M', join(out, 'tour.webm')]);
  const { readFileSync } = await import('fs');
  for (const x of list) enc.stdin.write(readFileSync(join(frames, x)));
  enc.stdin.end();
  await new Promise((r) => enc.on('close', r));
  console.log(`video: ${join(out, 'tour.webm')} (${list.length} frames)`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`ok → ${out}`);
