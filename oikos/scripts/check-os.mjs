/**
 * check-os.mjs — does the desktop behave like an OS?
 *
 * Drives the real page and asserts the window manager, taskbar, menus,
 * keyboard, history and touch behave the way a desktop does: keys go to the
 * window that has focus, a restored window comes back on screen, menus work
 * from the keyboard, Back walks the desk, several tapes open at once, a tap
 * opens one thing and only one.
 *
 *   uv run uvicorn aethera.main:app --port 8078        # repo root
 *   node scripts/check-os.mjs --base http://127.0.0.1:8078 [--no-gl] [--only name,name] [--shots dir]
 *
 * Most checks run with WebGL off (the desktop over black: deterministic and
 * quick). The ones that need the room (the VCR tap, room keys, tuning in)
 * run on software GL with ?drive, stepping frames by hand; --no-gl skips them.
 * Exits 1 if any check fails.
 */

import { mkdirSync } from 'fs';
import { createRequire } from 'module';
import { join } from 'path';

const argv = process.argv.slice(2);
const opt = (k, d) => {
  const i = argv.indexOf(`--${k}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const base = opt('base', 'http://127.0.0.1:8078');
const noGl = argv.includes('--no-gl');
const only = opt('only', '')?.split(',').filter(Boolean) ?? [];
const shots = opt('shots', null);
if (shots) mkdirSync(shots, { recursive: true });

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    const require = createRequire(import.meta.url);
    return require('playwright');
  }
}
const pw = await loadPlaywright();

// ---- the harness ---------------------------------------------------------------

const results = [];
function expect(name, ok, detail = '') {
  results.push({ name, ok: !!ok, detail });
  console.log(`${ok ? '  ok  ' : '  FAIL'} ${name}${detail ? `  (${detail})` : ''}`);
}

const glArgs = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const plain = await pw.chromium.launch({ args: ['--disable-webgl', '--disable-webgl2'] });
const gl = noGl ? null : await pw.chromium.launch({ args: glArgs });

const errors = [];
async function newPage(browser, ctxOpts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, ...ctxOpts });
  const page = await ctx.newPage();
  page.setDefaultTimeout(30000);
  page.on('pageerror', (e) => {
    if (!/hljs/.test(e.message)) errors.push(`pageerror: ${e.message}`);
  });
  return page;
}

/** load the page and wait for the desk (no WebGL: ~ opens by itself) */
async function boot(page, path = '/') {
  await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.getElementById('oikos-boot'), null, { timeout: 60000 });
}

const W = (id) => `.xp-window[data-win="${id}"]`;
const rect = (page, sel) => page.locator(sel).first().evaluate((el) => el.getBoundingClientRect().toJSON());
const isActive = (page, id) => page.locator(W(id)).evaluate((el) => !el.classList.contains('inactive') && !el.classList.contains('minimized'));
const focusIn = (page, sel) => page.evaluate((s) => !!document.activeElement?.closest(s), sel);
const z = (page, id) => page.locator(W(id)).evaluate((el) => Number(el.style.zIndex));
const hash = (page) => page.evaluate(() => location.hash);
const menus = (page) => page.locator('.xp-menu').count();
const settle = (page, ms = 120) => page.waitForTimeout(ms);

async function dragBy(page, sel, dx, dy) {
  const r = await rect(page, sel);
  const x = r.left + Math.min(30, r.width / 2);
  const y = r.top + r.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx / 2, y + dy / 2, { steps: 4 });
  await page.mouse.move(x + dx, y + dy, { steps: 4 });
  await page.mouse.up();
  return { x: x + dx, y: y + dy };
}

async function shot(page, name) {
  if (!shots) return;
  // a picture for a person to look at, not a check: software GL may never finish one
  await page.screenshot({ path: join(shots, `${name}.jpg`), type: 'jpeg', quality: 80, timeout: 60000 }).catch((err) => console.log(`  (no shot ${name}: ${String(err?.message ?? err).split('\n')[0]})`));
}

async function section(name, fn) {
  if (only.length && !only.includes(name)) return;
  console.log(`\n[${name}]`);
  try {
    await fn();
  } catch (err) {
    expect(`${name}: ran to the end`, false, String(err?.message ?? err).split("\n").slice(0, 8).join(" / "));
  }
}

// ---- desktop, no WebGL ---------------------------------------------------------

await section('keys', async () => {
  const page = await newPage(plain);
  await boot(page);
  await page.waitForSelector(W('home'));
  expect('~ open at boot has the keyboard on a tile', await focusIn(page, `${W('home')} .xp-tile`));
  // a click on a part of the window that can't take focus still gives it the keyboard
  await page.locator(`${W('home')} .xp-title`).click();
  expect('clicking the title bar moves focus into the window', await focusIn(page, W('home')));
  await page.keyboard.press('3');
  await page.waitForTimeout(1100);
  expect('a digit typed into the active window does not play a tape', (await page.locator(W('site:chronicle')).count()) === 0);
  await page.keyboard.press('Home');
  await settle(page);
  // Tab goes round the window and never leaves it
  let escaped = 0;
  for (let i = 0; i < 45; i++) {
    await page.keyboard.press('Tab');
    if (!(await focusIn(page, W('home')))) escaped++;
  }
  expect('Tab stays inside the active window', escaped === 0, `${escaped} of 45 presses left it`);
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Shift+Tab');
    if (!(await focusIn(page, W('home')))) escaped++;
  }
  expect('Shift+Tab stays inside too', escaped === 0);
  // F6 reaches the taskbar (the way out Tab no longer gives)
  await page.keyboard.press('F6');
  expect('F6 moves from the window to the taskbar', await focusIn(page, '.xp-taskbar'));
  // with no window active the room has the keys again
  await page.locator(`${W('home')} .xp-min`).click();
  await settle(page);
  await page.keyboard.press('3');
  await page.waitForSelector(W('site:chronicle'), { timeout: 4000 }).catch(() => {});
  expect('with no active window, 3 plays channel 3', (await page.locator(W('site:chronicle')).count()) === 1);
  expect('…and focus is in its new window', await focusIn(page, W('site:chronicle')));
  await page.context().close();
});

await section('wm', async () => {
  const page = await newPage(plain);
  await boot(page);
  await page.waitForSelector(W('home'));
  const bar = `${W('home')} .xp-title`;

  // restore after the browser shrank, from maximised
  const r0 = await rect(page, W('home'));
  await dragBy(page, bar, 1100 - r0.left, 0);
  await page.locator(`${W('home')} .xp-max`).click();
  await page.setViewportSize({ width: 900, height: 600 });
  await settle(page);
  await page.locator(`${W('home')} .xp-max`).click();
  await settle(page);
  let r = await rect(page, W('home'));
  expect('un-maximising after the page shrank lands on screen', r.left <= 900 - 60 && r.right > 60 && r.top >= 0 && r.top < 600 - 30, `left ${Math.round(r.left)}`);

  // restore from minimised after the page shrank
  await page.setViewportSize({ width: 1280, height: 800 });
  await settle(page);
  r = await rect(page, W('home'));
  await dragBy(page, bar, 1100 - r.left, 0);
  await page.locator(`${W('home')} .xp-min`).click();
  await page.setViewportSize({ width: 900, height: 600 });
  await settle(page);
  await page.locator('.xp-taskbtn[data-win="home"]').click();
  await settle(page);
  r = await rect(page, W('home'));
  expect('restoring from the taskbar after the page shrank lands on screen', r.left <= 900 - 60 && r.right > 60, `left ${Math.round(r.left)}`);
  await page.setViewportSize({ width: 1280, height: 800 });
  await settle(page);

  // the system menu: no Alt+F4, and it goes with its window
  await page.locator(bar).click({ button: 'right' });
  const text = await page.locator('.xp-menu').innerText();
  expect('the system menu has no Alt+F4 it cannot honour', !/Alt\+F4/.test(text));
  await page.keyboard.press('ArrowDown');
  expect('ArrowDown in a right-click menu moves into it', await focusIn(page, '.xp-menu'));
  await page.keyboard.press('Escape');
  expect('Esc closes it', (await menus(page)) === 0);

  // double-click the title icon: the window closes, its system menu with it
  await page.keyboard.press('Control+Home'); // nothing; keeps the page awake
  await page.locator('.xp-start').click();
  await page.locator('.xp-startmenu button', { hasText: 'mIRC' }).first().click();
  await page.waitForSelector(W('mirc'));
  await page.locator(`${W('mirc')} .xp-title-icon`).dblclick();
  await settle(page);
  expect('double-clicking the title icon closes the window', (await page.locator(W('mirc')).count()) === 0);
  expect('…and leaves no orphaned system menu', (await menus(page)) === 0);

  // Maximize from the taskbar menu of a window behind brings it forward
  await page.locator('.xp-start').click();
  await page.locator('.xp-startmenu button', { hasText: 'mIRC' }).first().click();
  await page.waitForSelector(W('mirc'));
  await page.locator(`${W('home')} .xp-title`).click();
  await page.locator('.xp-taskbtn[data-win="mirc"]').click({ button: 'right' });
  await page.locator('.xp-menu button', { hasText: 'Maximize' }).click();
  await settle(page);
  expect('Maximize from the taskbar menu brings the window forward', (await isActive(page, 'mirc')) && (await z(page, 'mirc')) > (await z(page, 'home')));
  await page.locator(`${W('mirc')} .xp-close`).click();

  // dragging a maximised window restores it and keeps dragging (XP)
  await page.locator(`${W('home')} .xp-max`).click();
  const t = await rect(page, `${W('home')} .xp-title`);
  const end = await dragBy(page, `${W('home')} .xp-title`, 160, 140);
  r = await rect(page, W('home'));
  const tb = await rect(page, `${W('home')} .xp-titlebar`);
  const maxed = await page.locator(W('home')).evaluate((el) => el.classList.contains('maximized'));
  expect('dragging a maximised window restores it', !maxed && r.width < 1200, `width ${Math.round(r.width)}`);
  expect('…and it stays under the pointer', end.y >= tb.top - 2 && end.y <= tb.bottom + 2 && end.x >= r.left && end.x <= r.right, `pointer ${end.x},${end.y} bar ${Math.round(tb.left)}-${Math.round(tb.right)},${Math.round(tb.top)}-${Math.round(tb.bottom)} from ${Math.round(t.left)}`);

  // the minimum size: enough of Explorer left to use, and CSS agrees with the script
  const se = await rect(page, `${W('home')} .xp-grip-se`);
  await page.mouse.move(se.left + 4, se.top + 4);
  await page.mouse.down();
  await page.mouse.move(se.left - 900, se.top - 700, { steps: 6 });
  await page.mouse.up();
  r = await rect(page, W('home'));
  const content = await page.locator(`${W('home')} .xp-content`).evaluate((el) => el.clientHeight);
  const cssMin = await page.locator(W('home')).evaluate((el) => parseFloat(getComputedStyle(el).minWidth));
  expect('a window shrinks no smaller than 340×260', r.width >= 339 && r.height >= 259, `${Math.round(r.width)}×${Math.round(r.height)}`);
  expect('…which still shows Explorer content', content >= 60, `content ${content}px tall`);
  expect('CSS min-width matches the window manager', cssMin === 340, `${cssMin}px`);
  await page.context().close();
});

await section('menus', async () => {
  const page = await newPage(plain);
  await boot(page);
  await page.waitForSelector(W('home'));
  await page.locator(`${W('home')} .xp-title`).click();
  await page.keyboard.press('F10');
  const active = () => page.evaluate(() => document.activeElement?.textContent?.trim() ?? '');
  expect('F10 reaches the menu bar', (await active()) === 'File');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  expect('→ on the menu bar walks its titles', (await active()) === 'View');
  await page.keyboard.press('ArrowDown');
  expect('↓ on a title drops its menu onto the first item', (await focusIn(page, '.xp-menu')) && (await menus(page)) === 1 && (await active()) === 'Toolbars');
  await page.keyboard.press('ArrowDown');
  expect('↓ moves through the items', (await active()) === 'Status Bar');
  await page.keyboard.press('Escape');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
  const open = () => page.evaluate(() => document.querySelector('.xp-menutitle.open')?.textContent ?? '');
  expect('→ moves to the next menu', (await open()) === 'Edit' && (await focusIn(page, '.xp-menu')));
  await page.keyboard.press('ArrowLeft');
  expect('← moves back', (await open()) === 'File');
  await page.keyboard.press('Escape');
  expect('Esc closes the menu and returns focus to its title', (await menus(page)) === 0 && (await active()) === 'File');
  // into and out of a cascade
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown'); // View, onto Toolbars
  await page.keyboard.press('ArrowRight');
  expect('→ on a cascade opens it, focused', (await menus(page)) === 2 && (await active()).startsWith('Standard'));
  await page.keyboard.press('ArrowLeft');
  expect('← leaves the cascade, back on its item', (await menus(page)) === 1 && (await active()) === 'Toolbars');
  await page.keyboard.press('Escape');
  expect('…and Esc lands back on View', (await active()) === 'View');
  // a hover-swap carries the keyboard with it
  await page.locator(`${W('home')} .xp-menutitle`, { hasText: 'File' }).click();
  await page.locator(`${W('home')} .xp-menutitle`, { hasText: 'Favorites' }).hover();
  await page.keyboard.press('ArrowDown');
  expect('after hovering across to another menu, ↓ works in that one', (await open()) === 'Favorites' && (await focusIn(page, '.xp-menu')));
  await page.keyboard.press('Escape');
  // a wheel elsewhere dismisses an open menu
  await page.locator(`${W('home')} .xp-title`).click({ button: 'right' });
  const c = await rect(page, `${W('home')} .xp-content`);
  await page.mouse.move(c.left + c.width / 2, c.top + c.height / 2);
  await page.mouse.wheel(0, 200);
  await settle(page);
  expect('scrolling elsewhere dismisses the menu', (await menus(page)) === 0);

  // the start menu
  await page.locator('.xp-start').focus();
  await page.keyboard.press('Enter');
  expect('Enter on start opens it, focused', await focusIn(page, '.xp-startmenu'));
  const s0 = await active();
  await page.keyboard.press('ArrowDown');
  expect('↓ moves in the start menu', (await active()) !== s0 && (await focusIn(page, '.xp-startmenu')));
  await page.keyboard.press('End');
  expect('End reaches all places', (await active()) === 'all places');
  await page.keyboard.press('ArrowRight');
  expect('→ opens all places, focused', (await menus(page)) === 1 && (await focusIn(page, '.xp-menu')));
  await page.keyboard.press('ArrowLeft');
  expect('← closes it, back on all places', (await menus(page)) === 0 && (await active()) === 'all places');
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  expect('→ in the left column crosses to the right', (await active()) !== 'all places' && (await focusIn(page, '.xp-startmenu .right')));
  await page.keyboard.press('Escape');
  expect('Esc closes the start menu and returns focus to start', (await page.locator('.xp-startmenu').isHidden()) && (await focusIn(page, '.xp-start')));
  await page.context().close();
});

await section('taskbar', async () => {
  const page = await newPage(plain);
  await boot(page);
  await page.waitForSelector(W('home'));
  await page.locator('.xp-start').click();
  await page.locator('.xp-startmenu button', { hasText: 'mIRC' }).first().click();
  await page.waitForSelector(W('mirc'));
  await page.evaluate(() => document.querySelectorAll('.xp-taskbtn[data-win]').forEach((b) => (b.dataset.tag = 'kept')));
  await page.locator('.xp-taskbtn[data-win="home"]').click();
  await page.locator('.xp-taskbtn[data-win="mirc"]').click();
  await dragBy(page, `${W('mirc')} .xp-title`, 20, 10);
  expect('taskbar buttons are updated in place, not rebuilt', (await page.locator('.xp-taskbtn[data-tag="kept"]').count()) === 2);
  // the keyboard: Enter on the active window's button minimises it, and focus stays put
  await page.locator('.xp-taskbtn[data-win="home"]').focus();
  await page.keyboard.press('Enter');
  expect('Enter on a button activates its window', await isActive(page, 'home'));
  await page.locator('.xp-taskbtn[data-win="home"]').focus();
  await page.keyboard.press('Enter');
  // as on Windows, the next window comes forward with the keyboard; nothing drops it on the floor
  expect(
    'Enter again minimises it, and the keyboard goes to the next window, not to nowhere',
    (await page.locator(W('home')).evaluate((el) => el.classList.contains('minimized'))) && (await focusIn(page, W('mirc'))) && (await page.locator('.xp-taskbtn[data-tag="kept"]').count()) === 2,
  );
  await page.locator('.xp-taskbtn[data-win="home"]').focus();
  await page.evaluate(() => document.querySelector('[data-win="mirc"] .xp-title')?.dispatchEvent(new Event('noop')));
  await dragBy(page, `${W('mirc')} .xp-title`, 5, 5);
  await page.locator('.xp-taskbtn[data-win="home"]').focus();
  await page.keyboard.press('ArrowLeft');
  expect('← and → walk the taskbar', await focusIn(page, '.xp-start'));
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  // Show the Desktop, twice
  const visible = () => page.evaluate(() => [...document.querySelectorAll('.xp-window:not(.xp-dialog):not(.minimized)')].map((w) => w.dataset.win).sort().join(','));
  const before = await visible();
  const activeBefore = await page.evaluate(() => document.querySelector('.xp-window:not(.inactive)')?.dataset.win);
  await page.locator('.xp-tray .clock').click({ button: 'right' });
  await page.locator('.xp-menu button', { hasText: 'Show the Desktop' }).click();
  expect('Show the Desktop folds every window', (await visible()) === '');
  await page.locator('.xp-tray .clock').click({ button: 'right' });
  await page.locator('.xp-menu button', { hasText: 'Show the Desktop' }).click();
  await settle(page);
  const activeAfter = await page.evaluate(() => document.querySelector('.xp-window:not(.inactive)')?.dataset.win);
  expect('a second Show the Desktop puts them back, the same one active', (await visible()) === before && activeAfter === activeBefore, `${await visible()} / ${activeAfter}`);
  await page.context().close();

  // many windows on a narrow desk: buttons shrink, then the rest wait behind »
  const narrow = await newPage(plain, { viewport: { width: 480, height: 800 } });
  await boot(narrow);
  await narrow.waitForSelector(W('home'));
  const ids = await narrow.evaluate(() => [...document.querySelectorAll('#oikos-directory a[data-id], .xp-tile[data-id]')].map((a) => a.dataset.id));
  for (const id of [...new Set(ids)]) {
    await narrow.evaluate((i) => (location.hash = `#${i}`), id);
    await narrow.waitForSelector(W(`site:${id}`), { timeout: 4000 }).catch(() => {});
  }
  const n = await narrow.locator('.xp-taskbtn[data-win]').count();
  const more = narrow.locator('.xp-taskmore');
  const tray = await rect(narrow, '.xp-tray');
  const box = await rect(narrow, '.xp-taskbuttons');
  expect('with many windows the » button appears', await more.isVisible(), `${n} windows`);
  expect('…and nothing spills over the tray', box.right <= tray.left + 1 && tray.right <= 481, `buttons end ${Math.round(box.right)}, tray ${Math.round(tray.left)}-${Math.round(tray.right)}`);
  await more.click();
  expect('» lists every window', (await narrow.locator('.xp-menu button').count()) === n);
  await shot(narrow, 'taskbar-overflow-480');
  await narrow.context().close();
});

await section('dialogs', async () => {
  const page = await newPage(plain);
  await boot(page);
  await page.waitForSelector(W('home'));
  await page.locator(`${W('home')} .xp-menutitle`, { hasText: 'Help' }).click();
  await page.locator('.xp-menu button', { hasText: 'About' }).click();
  await page.waitForSelector(W('about'));
  let escaped = 0;
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    if (!(await focusIn(page, W('about')))) escaped++;
  }
  expect('Tab stays inside the dialog', escaped === 0);
  await page.locator(`${W('home')} .xp-tile`).first().click();
  const a = await rect(page, W('about'));
  const onTop = await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('[data-win="about"]'), [a.left + a.width / 2, a.top + a.height / 2]);
  expect('a click on another window does not bury the dialog', onTop);
  await page.keyboard.press('Escape');
  expect('Esc closes the topmost dialog, whichever window is active', (await page.locator(W('about')).count()) === 0);
  await page.context().close();
});

await section('router', async () => {
  const page = await newPage(plain);
  await boot(page);
  await page.waitForSelector(W('home'));
  const L0 = await page.evaluate(() => history.length);
  await page.locator('.xp-start').click();
  await page.locator('.xp-startmenu button', { hasText: 'mIRC' }).first().click();
  await page.waitForSelector(W('mirc'));
  expect('opening mIRC writes #mirc as a new step', (await hash(page)) === '#mirc' && (await page.evaluate(() => history.length)) === L0 + 1);
  // mIRC cascaded over ~: bring ~ forward first, as anyone would
  await page.locator('.xp-taskbtn[data-win="home"]').click();
  await page.locator(`${W('home')} .xp-tile[data-id="dreams"]`).dblclick();
  await page.waitForSelector(W('site:dreams'));
  expect('playing a tape writes its hash as a new step', (await hash(page)) === '#dreams' && (await page.evaluate(() => history.length)) === L0 + 2);
  await page.goBack({ waitUntil: 'commit' }).catch(() => {});
  await settle(page, 300);
  expect('Back brings mIRC forward', (await hash(page)) === '#mirc' && (await isActive(page, 'mirc')));
  await page.goBack({ waitUntil: 'commit' }).catch(() => {});
  await settle(page, 300);
  expect('Back again stays on the page', (await hash(page)) === '' && (await page.evaluate(() => location.pathname)) === '/' && (await page.locator(W('home')).count()) === 1);
  await page.goForward({ waitUntil: 'commit' }).catch(() => {});
  await settle(page, 300);
  expect('Forward walks the desk too', (await hash(page)) === '#mirc' && (await isActive(page, 'mirc')));
  await page.locator(`${W('mirc')} .xp-close`).click();
  expect('closing a window clears its hash', (await hash(page)) === '');
  await page.evaluate(() => (location.hash = '#syrinx'));
  await page.waitForSelector(W('site:syrinx'), { timeout: 4000 }).catch(() => {});
  expect('a hash typed after load opens its place', (await page.locator(W('site:syrinx')).count()) === 1);
  await page.goBack({ waitUntil: 'commit' }).catch(() => {});
  await settle(page, 300);
  expect('Back never closes a window, nor leaves the page', (await hash(page)) === '' && (await page.locator(W('site:syrinx')).count()) === 1 && (await page.evaluate(() => location.pathname)) === '/');
  await page.context().close();

  const fresh = await newPage(plain);
  await boot(fresh, '/#mirc');
  await fresh.waitForSelector(W('mirc'));
  await fresh.locator(`${W('mirc')} .xp-close`).click();
  expect('loaded at #mirc, closing mIRC clears the hash', (await hash(fresh)) === '');
  await fresh.reload({ waitUntil: 'domcontentloaded' });
  await fresh.waitForFunction(() => !document.getElementById('oikos-boot'), null, { timeout: 60000 });
  await fresh.waitForTimeout(1200);
  expect('…so a reload does not reopen it', (await fresh.locator(W('mirc')).count()) === 0);
  await fresh.locator('#oikos-desktop').click({ position: { x: 1200, y: 600 } }).catch(() => {});
  await fresh.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  await fresh.keyboard.press('Alt+ArrowLeft');
  await settle(fresh, 400);
  expect('Alt+← at the start of the visit does not leave the page', (await fresh.evaluate(() => location.pathname)) === '/');
  await fresh.context().close();
});

await section('multi', async () => {
  const page = await newPage(plain);
  await boot(page);
  await page.waitForSelector(W('home'));
  await page.locator(`${W('home')} .xp-tile[data-id="dreams"]`).dblclick();
  await page.waitForSelector(W('site:dreams'));
  await page.locator(`${W('home')} .xp-tile[data-id="chronicle"]`).dblclick();
  await page.waitForSelector(W('site:chronicle'));
  expect('two tapes open at once', (await page.locator(W('site:dreams')).count()) === 1 && (await page.locator(W('site:chronicle')).count()) === 1);
  expect('playing a tape leaves ~ where it was', !(await page.locator(W('home')).evaluate((el) => el.classList.contains('minimized'))));
  const d = await rect(page, W('site:dreams'));
  const c = await rect(page, W('site:chronicle'));
  expect('the second cascades off the first', Math.abs(Math.abs(c.left - d.left) - 28) <= 1 && (Math.abs(c.top - d.top - 28) <= 1 || c.top <= 9), `Δ ${Math.round(c.left - d.left)},${Math.round(c.top - d.top)}`);
  await page.locator('.xp-start').click();
  await page.locator('.xp-startmenu button', { hasText: 'mIRC' }).first().click();
  await page.waitForSelector(W('mirc'));
  await page.locator('.xp-taskbtn[data-win="home"]').click();
  await page.locator(`${W('home')} .xp-tile[data-id="syrinx"]`).dblclick().catch(() => {});
  await page.waitForSelector(W('site:syrinx')).catch(() => {});
  await shot(page, 'desk-four-windows');
  // focus moves into a tape's window when Enter plays it from a tile
  await page.locator(`${W('home')} .xp-tile[data-id="apeiron"]`).focus();
  await page.keyboard.press('Enter');
  await page.waitForSelector(W('site:apeiron'));
  expect('Enter on a tile opens the tape with the keyboard in its window', await focusIn(page, W('site:apeiron')));
  await page.context().close();
});

// ---- phones, no WebGL ----------------------------------------------------------

const phone = { viewport: { width: 390, height: 664 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };

await section('touch', async () => {
  const page = await newPage(plain, phone);
  await boot(page);
  await page.waitForSelector(W('home'));
  const tile = page.locator(`${W('home')} .xp-tile[data-id="dreams"]`);
  await tile.tap();
  await settle(page, 200);
  await tile.tap();
  await page.waitForSelector(W('site:dreams'), { timeout: 4000 }).catch(() => {});
  await settle(page, 600);
  expect('tap-tap on a tape opens its pane', (await page.locator(W('site:dreams')).count()) === 1);
  expect('…and the follow-up click does not leave the page', (await page.evaluate(() => location.pathname)) === '/');
  await page.locator(`${W('site:dreams')} .xp-max`).tap();
  await settle(page);
  const r = await rect(page, W('site:dreams'));
  const desk = await rect(page, '#oikos-desktop');
  expect('maximise works on a phone', r.top <= desk.top + 1 && r.height >= desk.height - 2, `top ${Math.round(r.top)}, ${Math.round(r.height)} of ${Math.round(desk.height)}`);
  await page.context().close();

  const land = await newPage(plain, { ...phone, viewport: { width: 750, height: 340 } });
  await boot(land);
  await land.waitForSelector(W('home'));
  const lr = await rect(land, W('home'));
  expect('a phone on its side gets sheets', lr.left === 0 && Math.round(lr.width) === 750, `${Math.round(lr.left)}, ${Math.round(lr.width)} wide`);
  await shot(land, 'phone-landscape-sheet');
  await land.context().close();

  // a turn to a sheet and back must not strand a window (the sheet's spot was written into it)
  const turn = await newPage(plain, { viewport: { width: 1000, height: 700 } });
  await boot(turn);
  await turn.waitForSelector(W('home'));
  await dragBy(turn, `${W('home')} .xp-title`, 40, 30);
  const before = await rect(turn, W('home'));
  await turn.setViewportSize({ width: 600, height: 700 });
  await settle(turn, 250);
  await turn.setViewportSize({ width: 1000, height: 700 });
  await settle(turn, 250);
  const after = await rect(turn, W('home'));
  expect('a window comes back from sheet mode where it was', Math.abs(after.left - before.left) <= 1 && Math.abs(after.top - before.top) <= 1, `${Math.round(before.left)},${Math.round(before.top)} → ${Math.round(after.left)},${Math.round(after.top)}`);
  await turn.context().close();
});

await section('aria', async () => {
  const page = await newPage(plain);
  await boot(page);
  await page.waitForSelector(W('home'));
  const bad = await page.evaluate(() => {
    const out = [];
    // a menu's children: items, groups, separators (through role=none wrappers)
    const ok = new Set(['menuitem', 'menuitemcheckbox', 'menuitemradio', 'group', 'separator']);
    const walk = (el, inMenu) => {
      for (const c of el.children) {
        const role = c.getAttribute('role');
        if (c.getAttribute('aria-hidden') === 'true') continue;
        if (role === 'none' || role === 'presentation' || (!role && inMenu && ['DIV', 'UL', 'LI'].includes(c.tagName))) {
          if (!role && inMenu) out.push(`menu child <${c.tagName.toLowerCase()} class=${c.className}> has no role`);
          walk(c, inMenu);
        } else if (role === 'group') walk(c, inMenu);
        else if (inMenu && !ok.has(role)) out.push(`menu child ${c.tagName.toLowerCase()}[role=${role}] .${c.className}`);
      }
    };
    walk(document.querySelector('.xp-startmenu'), true);
    for (const lb of document.querySelectorAll('[role=listbox]')) for (const c of lb.children) if (c.getAttribute('role') !== 'option') out.push(`listbox child ${c.tagName.toLowerCase()}`);
    for (const h of document.querySelectorAll('header[role]')) out.push(`header[role=${h.getAttribute('role')}]`);
    return out;
  });
  expect('start menu, listboxes and task groups have valid roles', bad.length === 0, bad.slice(0, 4).join('; '));
  await page.context().close();
});

// ---- with the room (software GL, stepped) ---------------------------------------

async function bootGl(page, path = '/?drive') {
  await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__oikos && !document.getElementById('oikos-boot'), null, { timeout: 120000 });
  await step(page, 24);
}
const step = (page, n) => page.evaluate((k) => window.__oikos.step(k, 1 / 30), n);
/** step the room until `sel` shows up (a window opened at the end of an animation) */
async function stepUntil(page, sel, max = 150) {
  for (let i = 0; i < max && !(await page.locator(sel).count()); i += 6) await step(page, 6);
  return (await page.locator(sel).count()) > 0;
}
// software GL on a shared machine: keep the frames small
const glDesk = { viewport: { width: 860, height: 560 } };
const glPhone = { ...phone, deviceScaleFactor: 1 };

if (gl) {
  await section('room-touch', async () => {
    const page = await newPage(gl, glPhone);
    await bootGl(page);
    const a = await page.evaluate(() => window.__oikos.anchor('vcr'));
    await page.touchscreen.tap(a.x, a.y - 8);
    await stepUntil(page, W('home'), 30);
    expect('a tap on the VCR opens ~', (await page.locator(W('home')).count()) === 1);
    expect('…and its click does not land on a tile under the finger', (await page.locator('.xp-tile.selected').count()) === 0);
    await step(page, 10);
    expect('…and leaves no tooltip stuck up', await page.locator('.xp-tip').isHidden());
    await page.context().close();
  });

  await section('room-keys', async () => {
    const page = await newPage(gl, glDesk);
    await bootGl(page);
    const a = await page.evaluate(() => window.__oikos.anchor('vcr'));
    await page.mouse.click(a.x, a.y - 12);
    expect('a click on the VCR opens ~', await stepUntil(page, W('home'), 30));
    // the window, not a tile (a tile's own arrows select tapes, and turn the camera to them)
    await page.locator(`${W('home')} .xp-title`).click({ force: true });
    const f0 = (await step(page, 1)).focused;
    await page.keyboard.press('ArrowRight');
    expect('→ with a window active does not walk the room', (await step(page, 1)).focused === f0, `${f0}`);
    // a click on the empty floor (beside ~, under the screens) gives the room the keyboard back
    await page.mouse.click(860 * 0.8, 560 * 0.93);
    await step(page, 1);
    await page.keyboard.press('ArrowRight');
    const f1 = (await step(page, 1)).focused;
    expect('…and with none active, → walks to a screen', f1 && f1 !== f0, `${f0} → ${f1}`);
    await page.context().close();
  });

  await section('tune', async () => {
    const page = await newPage(gl, glDesk);
    await bootGl(page);
    await page.evaluate(() => (location.hash = '#apeiron'));
    expect('a tape linked by hash plays into its pane', await stepUntil(page, W('site:apeiron'), 240));
    await page.locator('.xp-start').click({ force: true });
    await page.locator('.xp-startmenu button', { hasText: 'mIRC' }).first().click({ force: true });
    await page.waitForSelector(W('mirc'));
    await page.locator('.xp-taskbtn[data-win="site:apeiron"]').click({ force: true });
    const shown = () => page.evaluate(() => [...document.querySelectorAll('.xp-window:not(.minimized)')].map((w) => w.dataset.win).sort().join(','));
    const before = await shown();
    await page.locator(`${W('site:apeiron')} .xp-btn`, { hasText: 'Tune In' }).click({ force: true });
    await step(page, 6);
    expect('tuning in folds the windows away', (await shown()) === '');
    // a way out that is not Eject: Start ▸ mIRC
    await page.locator('.xp-start').click({ force: true });
    await page.locator('.xp-startmenu button', { hasText: 'mIRC' }).first().click({ force: true });
    await step(page, 5);
    expect('stepping out any other way puts back exactly what it hid', (await shown()) === before, `${before} → ${await shown()}`);
    await shot(page, 'room-after-tune-out');
    await page.context().close();
  });
}

// ---- report ---------------------------------------------------------------------

await plain.close();
await gl?.close();
const failed = results.filter((r) => !r.ok);
for (const e of errors) console.log(`  page: ${e}`);
console.log(`\n${results.length - failed.length}/${results.length} checks passed${errors.length ? `, ${errors.length} page errors` : ''}`);
process.exit(failed.length || errors.length ? 1 : 0);
