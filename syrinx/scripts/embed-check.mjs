/**
 * embed-check.mjs — does the creature actually live at its æthera route?
 *
 * The standalone page and the embedded one are two different environments: on
 * the site, syrinx loads as a built iife inside base.html, alongside tailwind
 * and branding.css, with the site's own header/footer/background-video in the
 * document. Everything that could go wrong there is invisible from `npm run dev`
 * — a 404 on the stylesheet, site chrome eating the viewport, an id collision,
 * a bundle that inlines its CSS instead of emitting it.
 *
 * So assert it against a running server:
 *
 *   1. the page serves and the bundle boots with no console errors
 *   2. the stylesheet is a real file that actually applied (not JS-injected)
 *   3. it wakes on click and renders to a sized canvas
 *   4. the HUD is live, so the sim loop is running
 *   5. the site chrome is silenced and syrinx owns the viewport
 *   6. it persists — the creature is a place, not a session
 *
 * Usage: node scripts/embed-check.mjs [url]
 *   (start the blog first; default assumes it is on :2222)
 */

import { chromium } from 'playwright';

const URL = process.argv[2] ?? 'http://127.0.0.1:2222/syrinx';

let failures = 0;
function check(ok, msg, detail) {
  console.log(`${ok ? '✓' : '✗'} ${msg}${ok || detail === undefined ? '' : `  — got ${JSON.stringify(detail)}`}`);
  if (!ok) failures++;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('requestfailed', (r) => {
  // the site's background video is display:none'd on this page; a browser that
  // abandons its fetch is expected and not syrinx's problem
  if (!r.url().endsWith('.mp4')) errors.push(`requestfailed: ${r.url()}`);
});

try {
  const res = await page.goto(URL, { waitUntil: 'networkidle' });
  check(res?.status() === 200, `page serves 200 at ${URL}`, res?.status());

  // the stylesheet must be a real, separately-served file — base.html links it
  // in <head>, which is the only way it can arrive
  const cssStatus = await page.evaluate(async () => {
    const r = await fetch('/static/syrinx/syrinx.css');
    return { status: r.status, len: (await r.text()).length };
  });
  check(cssStatus.status === 200 && cssStatus.len > 200, 'syrinx.css is served as a real file', cssStatus);

  await page.click('#overlay');
  await page.waitForTimeout(4000);

  const probe = await page.evaluate(() => {
    const css = (sel, prop) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el).getPropertyValue(prop) : 'NO-ELEMENT';
    };
    const canvas = document.querySelector('#stage canvas');
    return {
      canvas: canvas ? { w: canvas.width, h: canvas.height } : null,
      hud: (document.getElementById('hud')?.textContent ?? '').trim(),
      overlayHidden: document.getElementById('overlay')?.classList.contains('hidden'),
      rootPosition: css('#syrinx-root', 'position'),
      hintSize: css('#hint', 'font-size'),
      headerDisplay: css('body > header', 'display'),
      footerDisplay: css('body > footer', 'display'),
      videoDisplay: css('.video-bg', 'display'),
      mainMaxWidth: css('main', 'max-width'),
      homeBoost: document.getElementById('syrinx-home')?.getAttribute('hx-boost'),
      saved: !!localStorage.getItem('syrinx-creature-v1'),
    };
  });

  check(probe.rootPosition === 'fixed', 'syrinx.css applied (#syrinx-root is fixed)', probe.rootPosition);
  check(probe.hintSize === '11px', 'creature styles survive tailwind + branding.css', probe.hintSize);
  check(!!probe.canvas && probe.canvas.w > 0 && probe.canvas.h > 0, 'renders to a sized canvas', probe.canvas);
  check(probe.overlayHidden === true, 'wakes on click');
  check(probe.hud.length > 0, 'HUD is live (sim loop running)', probe.hud);
  check(probe.headerDisplay === 'none', 'site header silenced', probe.headerDisplay);
  check(probe.footerDisplay === 'none', 'site footer silenced', probe.footerDisplay);
  check(probe.videoDisplay === 'none', 'background video silenced', probe.videoDisplay);
  check(probe.mainMaxWidth === 'none', 'main unclamped — syrinx owns the viewport', probe.mainMaxWidth);
  check(probe.homeBoost === 'false', 'the way out is unboosted (no orphaned audio/WebGL)', probe.homeBoost);
  check(probe.saved === true, 'persisted to localStorage');

  // it should be drawing an actual sky, not a black rectangle
  const shot = await page.screenshot();
  const lit = shot.length > 20000; // a uniformly black png compresses far smaller
  check(lit, 'frame has real content (png is not a flat fill)', shot.length);

  check(errors.length === 0, 'no console errors', errors);
} finally {
  await browser.close();
}

console.log(failures === 0 ? '\nembed-check: PASS' : `\nembed-check: ${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
