/**
 * main.ts — the house.
 *
 * oikos (οἶκος): a household, a home. æthera's home directory as a room in the
 * Wired: screens in the dark, one per site, every cable running into a VCR in
 * the middle, and a Windows XP desktop over it all for the parts you click.
 *
 * Two ways in, on purpose: the VCR (or the start button) opens ~, the home
 * directory, where every site is a tape; or click a screen in the room. Either
 * way a tape goes into the VCR, its screen changes channel, and its pane opens
 * with the very canvas that screen is painted on. Open it and you dive through
 * the glass to the site.
 *
 * Without WebGL there is no room, and the desktop runs on its own over black:
 * the directory, the panes and their live previews all still work. Without
 * JavaScript there is the plain <nav> the template renders.
 */

import './xp/xp.css';

import { Feeds, isExternal, readDirectory, type Site } from './data';
import { makeScreen, type Screen } from './screens';
import { PLACEMENTS } from './world/layout';
import { Room, type Pickable } from './world/room';
import { h } from './xp/chrome';
import { Explorer } from './xp/explorer';
import * as icons from './xp/icons';
import { Pane } from './xp/pane';
import type { Shell } from './xp/shell';
import { Taskbar } from './xp/taskbar';
import { WindowManager, type XPWindow } from './xp/wm';

const root = document.getElementById('oikos');
if (root) boot(root);

function webgl(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

function boot(root: HTMLElement): void {
  root.classList.add('oikos-live');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dir = readDirectory();
  const feeds = new Feeds();
  const screens = new Map<string, Screen>(dir.sites.map((s) => [s.id, makeScreen(s, { dir, feeds })]));
  const byId = new Map(dir.sites.map((s) => [s.id, s]));

  // /oikos?contact — every tube side by side, no room: for working on painters
  if (new URLSearchParams(location.search).has('contact')) {
    contactSheet(root, dir.sites, screens, feeds);
    return;
  }

  const desk = h('div', { id: 'oikos-desktop' });
  root.append(desk);
  const wm = new WindowManager(desk);

  let room: Room | null = null;
  let pane: Pane | null = null;
  let paneId: string | null = null;
  let leaving = false;
  let tuned: { id: string; bar: HTMLElement; hidden: XPWindow[]; tube: HTMLElement } | null = null;

  // ---- the shell: what windows may ask for ----
  const shell: Shell = {
    dir,
    feeds,
    screens,
    site: (id) => byId.get(id),
    select(id) {
      tuneOut(false);
      room?.focus(id);
    },
    play(id) {
      const site = byId.get(id);
      if (!site) return;
      // anything that moves the camera steps out of a tuned-in screen first
      tuneOut(false);
      explorer.select(id);
      room?.play(id);
      if (paneId === id && pane) {
        if (pane.win.minimized) pane.win.restore();
        else pane.win.focus();
        return;
      }
      const old = pane;
      pane = null;
      paneId = null;
      old?.win.close();
      paneId = id;
      pane = new Pane(site, shell, wm, () => {
        if (paneId !== id) return;
        pane = null;
        paneId = null;
        room?.eject();
        if (room?.focusedId === id) room.focus(null);
        history.replaceState(null, '', location.pathname);
      });
      history.replaceState(null, '', `#${id}`);
    },
    open(site, e) {
      e?.preventDefault();
      if (leaving) return;
      if (!site.href) {
        errorBox(site);
        return;
      }
      if (isExternal(site.href)) {
        // synchronously, inside the click, or the popup blocker has it
        window.open(site.href, '_blank', 'noopener');
        taskbar.balloon(`${site.title} opened`, 'It opened in a new window. The room is still here.');
        return;
      }
      const href = site.href;
      leaving = true;
      taskbar.balloon(`Opening ${site.title}`, 'tuning in…', undefined, 2000);
      const go = () => location.assign(href);
      if (room) void room.dive(site.id).then(go);
      else go();
      setTimeout(go, 1500); // whatever happens to the dive, leave
    },
    look(id) {
      tuneOut(false);
      room?.focus(id);
    },
    get canTune() {
      return !!room;
    },
    tuneIn(id) {
      const site = byId.get(id);
      if (!room || !site?.tune || !site.href) return;
      const src = typeof site.tune === 'string' ? site.tune : site.href;
      tuneOut(false);
      // step back from the desk: the windows fold away until you eject
      const hidden = wm.list.filter((w) => !w.minimized && !w.opts.dialog);
      for (const w of hidden) w.minimize();
      taskbar.hideBalloon();
      const tube = h('div', { class: 'oikos-tube' });
      tube.style.setProperty('--glow', site.accent);
      const frame = h('iframe', { src, title: `${site.title}, live`, allow: 'autoplay; fullscreen; clipboard-write' });
      tube.append(frame, h('i', { class: 'roll' }), h('i', { class: 'glass' }));
      const bar = h('div', { class: 'oikos-tuned', role: 'toolbar', 'aria-label': 'tuned in' });
      bar.innerHTML = `${icons.tape(site.accent)}<b></b><span>tuned in · live on its screen</span>`;
      (bar.querySelector('b') as HTMLElement).textContent = site.title;
      const eject = h('button', { class: 'xp-btn', type: 'button' }, ['⏏ Eject']);
      eject.addEventListener('click', () => tuneOut(true));
      const full = h('a', { class: 'xp-btn', href: site.href }, ['Open full ↗']);
      if (isExternal(site.href)) {
        full.setAttribute('target', '_blank');
        full.setAttribute('rel', 'noopener');
      }
      bar.append(eject, full);
      tuned = { id, bar, hidden, tube };
      // the page lays out at 1024×768 and is scaled onto the glass
      const place = (r: DOMRectReadOnly) => {
        tube.style.transform = `translate(${r.left}px, ${r.top}px) scale(${r.width / 1024}, ${r.height / 768})`;
      };
      void room.tuneIn(id, place).then(() => {
        if (tuned?.bar !== bar) return;
        root.append(tube, bar);
        frame.focus();
      });
    },
    home() {
      tuneOut(false);
      explorer.open();
      room?.scroll('~ home');
    },
    eject() {
      tuneOut(false);
      pane?.win.close();
      room?.eject();
      room?.focus(null);
    },
    balloon(title, text, at) {
      taskbar.balloon(title, text, at);
    },
  };

  const explorer = new Explorer(shell, wm);
  const taskbar = new Taskbar(root, shell, wm, {
    standby: (on) => setStandby(on),
    turnOff() {
      root.classList.add('off');
      setTimeout(() => location.assign('/'), reduced ? 50 : 750);
    },
    restart() {
      try {
        sessionStorage.removeItem('oikos-booted');
      } catch {
        /* fine */
      }
      location.reload();
    },
  });

  function tuneOut(restore: boolean): void {
    if (!tuned) return;
    const { id, bar, hidden, tube } = tuned;
    tuned = null;
    bar.remove();
    tube.remove();
    room?.tuneOut();
    if (!restore) return;
    for (const w of hidden) if (!w.closed) w.restore();
    room?.focus(id);
  }

  function errorBox(site: Site): void {
    const body = h('div');
    const msg = h('div', { class: 'xp-dialog-body', html: icons.error() });
    const text = h('div');
    text.append(
      h('p', {}, [`The Wired cannot reach '${site.title}'.`]),
      h('p', {}, ['It lives on a private network, and this computer cannot follow it there. The screen in the room is a replica.']),
    );
    msg.append(text);
    const actions = h('div', { class: 'xp-actions' });
    const ok = h('button', { class: 'xp-btn default', type: 'button' }, ['OK']);
    actions.append(ok);
    body.append(msg, actions);
    const w = wm.open({ id: 'error', title: site.title, icon: icons.error(), body, width: 360, dialog: true });
    ok.addEventListener('click', () => w.close());
    ok.focus();
  }

  // ---- the room ----
  if (webgl()) {
    try {
      room = new Room(root, dir.sites, screens, {
        pick(id: Pickable | null) {
          exitStandby();
          taskbar.hideBalloon();
          if (id === 'vcr') shell.home();
          else if (id) shell.play(id);
          else if (room?.focusedId && !pane) room.focus(null);
        },
        hover(id, x, y) {
          if (id === 'vcr') taskbar.showTip(null, { title: 'VCR', text: 'your home directory · click to open ~' }, x, y);
          else taskbar.showTip(id ? (byId.get(id) ?? null) : null, null, x, y);
        },
      });
    } catch (err) {
      console.warn('oikos: the room would not build; running the desktop alone', err);
      room?.stop();
      room = null;
    }
  }

  // screens tick inside the room's loop; with no room, the open pane's tube
  // still needs painting
  if (!room) {
    let last = performance.now();
    const loop = (now: number) => {
      requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (paneId) screens.get(paneId)?.tick(now / 1000, dt, true);
    };
    requestAnimationFrame(loop);
  }

  // keep the focused screen out from under the windows
  const reframe = () => {
    if (!room) return;
    const W = innerWidth;
    const H = innerHeight - 30;
    const open = wm.list.filter((w) => !w.minimized && !w.opts.dialog && !w.el.classList.contains('maximized'));
    if (W <= 720) {
      room.setShift(0, open.length ? H * 0.3 : 0);
      return;
    }
    let left = 0;
    let right = W;
    for (const w of open) {
      const r = w.el.getBoundingClientRect();
      if (r.left + r.width / 2 < W / 2) left = Math.max(left, r.right);
      else right = Math.min(right, r.left);
    }
    if (right - left < W * 0.22) {
      left = 0;
      right = W;
    }
    room.setShift(W / 2 - (left + right) / 2, 0);
  };
  wm.on(reframe);
  addEventListener('resize', reframe);

  // ---- stand by ----
  let standby = false;
  function setStandby(on: boolean): void {
    standby = on;
    root?.classList.toggle('standby', on);
    if (on) room?.focus(null);
  }
  function exitStandby(): void {
    if (standby) setStandby(false);
  }
  root.addEventListener('pointerdown', exitStandby, true);

  // ---- keys ----
  const channels = new Map(Object.entries(PLACEMENTS).map(([id, p]) => [p.channel, id]));
  const order = dir.sites
    .map((s) => s.id)
    .sort((a, b) => (PLACEMENTS[a]?.channel ?? 99) - (PLACEMENTS[b]?.channel ?? 99));
  let digits = '';
  let digitTimer = 0;
  addEventListener('keydown', (e) => {
    if (standby) {
      exitStandby();
      return;
    }
    const t = e.target as HTMLElement;
    if (t.closest('input, textarea')) return;
    if (e.key === 'Escape' && tuned) {
      tuneOut(true);
      return;
    }
    if (tuned) return;
    if (e.key === 'Escape') {
      if (!taskbarMenuClosed()) return;
      if (wm.closeTop()) return;
      if (room?.focusedId) room.focus(null);
      return;
    }
    if (t.closest('.xp-window, .xp-startmenu')) return;
    if (e.key === '~' || e.key === 'Home') {
      shell.home();
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const cur = room?.focusedId && room.focusedId !== 'vcr' ? order.indexOf(room.focusedId) : -1;
      const next = order[(cur + (e.key === 'ArrowRight' ? 1 : -1) + order.length) % order.length];
      if (next) {
        room?.focus(next);
        explorer.select(next);
        const at = room?.anchor(next);
        const site = byId.get(next);
        if (at && site) taskbar.showTip(site, null, at.x - 40, at.y - 50);
      }
      return;
    }
    if (e.key === 'Enter' && room?.focusedId && room.focusedId !== 'vcr') {
      shell.play(room.focusedId);
      return;
    }
    if (/^[0-9]$/.test(e.key)) {
      // punch the channel in, like a remote
      digits = (digits + e.key).slice(-2);
      clearTimeout(digitTimer);
      room?.scroll(`ch ${digits}`);
      digitTimer = window.setTimeout(() => {
        const id = channels.get(Number(digits));
        digits = '';
        if (id && byId.has(id)) shell.play(id);
      }, 700);
    }
  });
  function taskbarMenuClosed(): boolean {
    const menu = root?.querySelector('.xp-startmenu') as HTMLElement | null;
    if (menu && !menu.hidden) {
      taskbar.toggleMenu(false);
      return false;
    }
    return true;
  }

  // ---- visibility: nothing runs, polls or listens in a hidden tab ----
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      room?.stop();
      feeds.stop();
    } else {
      room?.start();
      feeds.start();
    }
  });

  // ---- boot ----
  const bootEl = document.getElementById('oikos-boot');
  let seen = false;
  try {
    seen = !!sessionStorage.getItem('oikos-booted');
    sessionStorage.setItem('oikos-booted', '1');
  } catch {
    /* fine */
  }
  const minBoot = reduced || seen ? 250 : 1900;
  let skip: () => void = () => {};
  const skipped = new Promise<void>((r) => (skip = r));
  bootEl?.addEventListener('click', () => skip());
  const fonts = Promise.race([
    document.fonts?.load('16px "Libertinus Mono"').then(() => undefined) ?? Promise.resolve(),
    new Promise<void>((r) => setTimeout(r, 1500)),
  ]);
  void Promise.race([Promise.all([fonts, new Promise<void>((r) => setTimeout(r, minBoot))]), skipped]).then(() => {
    feeds.start();
    room?.start();
    room?.powerOn();
    bootEl?.classList.add('gone');
    setTimeout(() => bootEl?.remove(), 800);

    const look = new URLSearchParams(location.search).get('look');
    if (look && room && (look === 'vcr' || byId.has(look))) setTimeout(() => room?.focus(look), 300);
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash && byId.has(hash)) {
      setTimeout(() => shell.play(hash), 900);
      return;
    }
    if (!room) {
      explorer.open();
      taskbar.balloon('No room tonight', 'This browser has no WebGL, so the room of screens is dark. The tapes all still play.');
      return;
    }
    setTimeout(() => {
      if (wm.list.length) return;
      const at = room?.anchor('vcr') ?? undefined;
      taskbar.balloon(
        'This is the way in',
        innerWidth <= 720
          ? 'Tap the VCR for the home directory, or any screen to tune in. Drag to look around.'
          : 'Click the VCR for your home directory, or any screen to tune in. Drag to look around; ← → walk the screens.',
        at,
        11000,
        true,
      );
    }, seen ? 900 : 2600);
  });
}

function contactSheet(root: HTMLElement, sites: Site[], screens: Map<string, Screen>, feeds: Feeds): void {
  document.getElementById('oikos-boot')?.remove();
  const sheet = h('div');
  sheet.style.cssText =
    'position:absolute;inset:0;overflow:auto;padding:16px;display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));background:#0a0a0a;';
  for (const s of sites) {
    const screen = screens.get(s.id);
    if (!screen) continue;
    const cell = h('figure');
    cell.style.cssText = 'margin:0;color:#aaa;font:12px ui-monospace,monospace;';
    screen.canvas.style.cssText = 'width:100%;display:block;border:1px solid #333;';
    const cap = h('figcaption', {}, [`${s.title} · ${s.kind}`]);
    cap.style.padding = '4px 0';
    cell.append(screen.canvas, cap);
    sheet.append(cell);
  }
  root.append(sheet);
  feeds.start();
  let last = performance.now();
  const loop = (now: number) => {
    requestAnimationFrame(loop);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    for (const s of screens.values()) s.tick(now / 1000, dt, false);
  };
  requestAnimationFrame(loop);
}
