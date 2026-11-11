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
import { Mirc } from './xp/mirc';
import * as icons from './xp/icons';
import { isSheet } from './xp/env';
import { bindContextMenu, closeMenus, menuOpen, setMenuHost, type MenuEntry } from './xp/menu';
import { siteMenu } from './xp/menus';
import { Pane } from './xp/pane';
import type { Shell } from './xp/shell';
import { Taskbar } from './xp/taskbar';
import { WindowManager, type XPWindow } from './xp/wm';

const root = document.getElementById('oikos');
if (root) {
  try {
    boot(root);
  } catch (err) {
    // whatever broke, don't leave the visitor on an endless boot screen with
    // the plain <nav> hidden under it
    console.error('oikos: boot failed; falling back to the plain directory', err);
    root.classList.remove('oikos-live');
    document.getElementById('oikos-boot')?.remove();
  }
}

function webgl(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    // a probe, not a renderer: hand the context straight back
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

/** the page's own URL minus the hash (keeps ?look, ?drive, ?speed) */
function here(): string {
  return location.pathname + location.search;
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
  setMenuHost(root);

  // ---- routes: the hash names a place on the desk ----
  //
  // #~ is the home directory, #mirc the chat, #<tape> a tape's pane. Opening
  // one pushes it onto the browser's history, so Back and Forward walk the
  // desk (bringing each place forward, reopening it if it was closed) instead
  // of leaving the page; a hash typed or linked opens its place; closing a
  // window takes its hash off the address. Explorer's own Back and Forward
  // are the browser's, and grey out at the ends of this visit.
  const routeOf = (w: XPWindow): string | null => {
    const id = w.opts.id;
    if (id === 'home') return '~';
    if (id === 'mirc') return 'mirc';
    return id.startsWith('site:') ? id.slice(5) : null;
  };
  const currentRoute = (): string => {
    try {
      return decodeURIComponent(location.hash.slice(1));
    } catch {
      return ''; // a malformed hash is no place
    }
  };
  const urlFor = (route: string) => (route ? `${here()}#${encodeURIComponent(route)}` : here());
  // where this visit stands in the history: steps we pushed, and how far forward there is
  const nav = { i: 0, top: 0, listeners: new Set<() => void>() };
  const navChanged = () => {
    for (const fn of nav.listeners) fn();
  };
  try {
    history.replaceState({ oikos: 0 }, '', location.href);
  } catch {
    /* a sandboxed frame: the desk still works, without the history */
  }
  let lastRoute = currentRoute();
  const pushRoute = (route: string) => {
    if (currentRoute() === route) return;
    nav.i += 1;
    nav.top = nav.i;
    try {
      history.pushState({ oikos: nav.i }, '', urlFor(route));
    } catch {
      /* as above */
    }
    lastRoute = route;
    navChanged();
  };
  const clearRoute = (route: string) => {
    if (currentRoute() !== route) return;
    try {
      history.replaceState({ oikos: nav.i }, '', here());
    } catch {
      /* as above */
    }
    lastRoute = '';
  };
  /** the browser moved (Back, Forward, a hash typed into the address bar): follow it */
  const followHistory = () => {
    const route = currentRoute();
    const st = history.state as { oikos?: unknown } | null;
    if (typeof st?.oikos === 'number') nav.i = Math.max(0, Math.min(st.oikos, nav.top));
    else {
      // a hash typed by hand is a new step of its own
      nav.i = nav.top + 1;
      nav.top = nav.i;
      try {
        history.replaceState({ oikos: nav.i }, '', location.href);
      } catch {
        /* as above */
      }
    }
    navChanged();
    if (route === lastRoute) return; // popstate and hashchange both report one move
    lastRoute = route;
    go(route, false);
  };
  addEventListener('popstate', followHistory);
  addEventListener('hashchange', followHistory);
  /** open (or bring forward) the place a route names */
  function go(route: string, push: boolean): void {
    if (route === '~' || route === 'home') openHome(push);
    else if (route === 'mirc') openChat(undefined, push);
    else if (byId.has(route)) playTape(route, push);
    else if (route === '') {
      // back to before any place was opened: the desk stays, the room has the keyboard
      tuneOut(false);
      wm.deactivate();
    }
  }

  let room: Room | null = null;
  /** every tape's pane that's open, by tape: as many as you like, as on any desktop */
  const panes = new Map<string, Pane>();
  /** the tape in the VCR (its pane is open, or it's on its way in) */
  let inVcr: string | null = null;
  /** the screen kept painting off camera: the pane in front's */
  let kept: string | null = null;
  let mirc: Mirc | null = null;
  let leaving = false;
  /** tuned in: what it folded away (in stacking order) and which window was active, to put back exactly */
  let tuned: { id: string; bar: HTMLElement; hidden: XPWindow[]; active: XPWindow | null; tube: HTMLElement } | null = null;
  let playSeq = 0; // the latest tape asked for; a slower one arriving late is ignored

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
      playTape(id, true);
    },
    open(site, e) {
      e?.preventDefault();
      if (leaving) return;
      if (isExternal(site.href)) {
        // synchronously, inside the click, or the popup blocker has it
        window.open(site.href, '_blank', 'noopener');
        taskbar.balloon(`${site.title} opened`, 'It opened in a new window. The room is still here.');
        return;
      }
      const href = site.href;
      leaving = true;
      taskbar.balloon(`Opening ${site.title}`, 'tuning in…', undefined, 2000);
      let gone = false;
      const go = () => {
        if (gone) return;
        gone = true;
        location.assign(href);
      };
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
      if (!room || !site?.tune) return;
      const src = typeof site.tune === 'string' ? site.tune : site.href;
      tuneOut(false);
      // step back from the desk: the windows fold away until you step out,
      // and come back as they were (order and the active one) however you do
      const active = wm.activeWindow;
      const z = (w: XPWindow) => Number(w.el.style.zIndex) || 0;
      const hidden = wm.list.filter((w) => !w.minimized && !w.opts.dialog).sort((a, b) => z(a) - z(b));
      for (const w of hidden) w.minimize();
      taskbar.hideBalloon();
      const tube = h('div', { class: 'oikos-tube' });
      tube.style.setProperty('--glow', site.accent);
      const frame = h('iframe', { src, title: `${site.title}, live`, allow: 'autoplay; fullscreen; clipboard-write' });
      tube.append(frame, h('i', { class: 'roll' }), h('i', { class: 'glass' }));
      // once you click into the page, keys go to it, not to us: listen in there
      // too (same origin), so Esc still steps back out. Not from a text field,
      // and not when the page has already used the key itself.
      frame.addEventListener('load', () => {
        try {
          frame.contentWindow?.addEventListener('keydown', (e) => {
            const el = e.target as HTMLElement | null;
            if (e.key !== 'Escape' || e.defaultPrevented || el?.closest?.('input, textarea, [contenteditable]')) return;
            tuneOut(true);
          });
        } catch {
          /* a page on another origin: the Eject button is still there */
        }
      });
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
      tuned = { id, bar, hidden, active, tube };
      // the page lays out at a 4:3 size near the glass's own (1024 wide on a
      // desktop, phone-sized on a phone, so the site uses its own small-screen
      // layout) and is scaled onto the glass
      const place = (r: DOMRectReadOnly) => {
        const w = Math.round(Math.min(1024, Math.max(420, r.width * 1.15)));
        const h = Math.round(w * 0.75);
        tube.style.width = `${w}px`;
        tube.style.height = `${h}px`;
        tube.style.transform = `translate(${r.left}px, ${r.top}px) scale(${r.width / w}, ${r.height / h})`;
      };
      void room.tuneIn(id, place).then(() => {
        if (tuned?.bar !== bar) return;
        root.append(tube, bar);
        frame.focus();
      });
    },
    chat(channel) {
      openChat(channel, true);
    },
    home() {
      openHome(true);
    },
    eject() {
      tuneOut(false);
      // the tape in the VCR comes out, and its pane with it
      const id = inVcr;
      if (id) panes.get(id)?.win.close();
      inVcr = null;
      room?.eject();
      room?.focus(null);
    },
    balloon(title, text, at) {
      taskbar.balloon(title, text, at);
    },
    // the browser's own Back and Forward, but never out of the page from here
    back: () => {
      if (nav.i > 0) history.back();
    },
    forward: () => {
      if (nav.i < nav.top) history.forward();
    },
    get canBack() {
      return nav.i > 0;
    },
    get canForward() {
      return nav.i < nav.top;
    },
    onNav(fn) {
      nav.listeners.add(fn);
      return () => nav.listeners.delete(fn);
    },
    about: () => aboutBox(),
  };

  const explorer = new Explorer(shell, wm);
  const taskbar = new Taskbar(root, shell, wm, {
    standby: (on) => setStandby(on),
    turnOff() {
      root.classList.add('off');
      setTimeout(() => location.assign('/'), reduced ? 50 : 750);
    },
    logOff() {
      // clear the desk: every window closed, the tape out, the camera home
      tuneOut(false);
      for (const w of [...wm.list]) w.close();
      inVcr = null;
      room?.eject();
      room?.focus(null);
      try {
        history.replaceState({ oikos: nav.i }, '', here());
      } catch {
        /* fine */
      }
      lastRoute = '';
      taskbar.balloon('Logged off', 'The desk is clear. Click the VCR to begin again.', room?.anchor('vcr') ?? undefined);
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

  // a window closed by any path (its ✕, a menu, Log Off) takes its hash off the address
  wm.onClose((w) => {
    const r = routeOf(w);
    if (r) {
      clearRoute(r);
      if (lastRoute === r) lastRoute = '';
    }
  });
  wm.on(() => keepPainting());

  /**
   * Step out of a tuned-in screen, whichever way (Eject, Esc, another tape,
   * ~, a hidden tab): the windows it folded away come back as they were.
   * `look` also turns the camera back to that screen (when nothing else is
   * about to take it).
   */
  function tuneOut(look: boolean): void {
    if (!tuned) return;
    const { id, bar, hidden, active, tube } = tuned;
    tuned = null;
    bar.remove();
    tube.remove();
    room?.tuneOut();
    for (const w of hidden) if (!w.closed && w.minimized) w.restore();
    if (active && !active.closed && !active.minimized) active.focus();
    else if (!active) wm.deactivate();
    if (look) room?.focus(id);
  }

  /** the tape's pane: open it (after watching the tape go in), or bring it forward */
  function playTape(id: string, push: boolean): void {
    const site = byId.get(id);
    if (!site) return;
    // anything that moves the camera steps out of a tuned-in screen first
    tuneOut(false);
    explorer.select(id);
    const open = panes.get(id);
    if (open) {
      inVcr = id;
      void room?.play(id);
      if (open.win.minimized) open.win.restore();
      else open.win.focus();
      if (push) pushRoute(id);
      return;
    }
    const token = ++playSeq;
    const opened = (arrived: boolean) => {
      if (token !== playSeq) return; // another tape went in meanwhile
      if (!arrived) {
        // called off on the way (a click on the floor, a key): take the tape back out
        room?.eject();
        inVcr = null;
        return;
      }
      const again = panes.get(id); // opened meanwhile, by another way in
      if (again) {
        again.win.focus();
        return;
      }
      inVcr = id;
      const pane = new Pane(site, shell, wm, () => {
        panes.delete(id);
        if (inVcr === id) {
          inVcr = null;
          room?.eject();
        }
        if (room?.focusedId === id) room.focus(null);
        keepPainting();
      });
      panes.set(id, pane);
      keepPainting();
      if (push) pushRoute(id);
    };
    // watch the tape go in, the cable light up, the channel change; then the pane
    if (room) {
      inVcr = id;
      void room.play(id).then(opened);
    } else opened(true);
  }

  /** the pane in front shows its screen's canvas: keep that one painting off camera too */
  function keepPainting(): void {
    const a = wm.activeWindow;
    const r = a ? routeOf(a) : null;
    let id = r && panes.has(r) ? r : kept && panes.has(kept) ? kept : null;
    if (!id) id = [...panes.keys()].at(-1) ?? null;
    if (id === kept) return;
    kept = id;
    room?.keepAlive(id);
  }

  function openHome(push: boolean): void {
    tuneOut(false);
    explorer.open();
    // the keyboard goes to the tapes, so Enter plays one straight away
    explorer.focusTiles();
    room?.scroll('~ home');
    if (push) pushRoute('~');
  }

  function openChat(channel: string | undefined, push: boolean): void {
    tuneOut(false);
    if (!mirc) mirc = new Mirc(shell, wm, () => (mirc = null));
    mirc.focus(channel);
    if (push) pushRoute('mirc');
  }

  function aboutBox(): void {
    wm.get('about')?.close();
    const body = h('div', { class: 'xp-about-box' });
    const band = h('div', { class: 'band', html: icons.markImg(44, true) });
    band.append(h('b', {}, ['æthera']), h('span', {}, ['oikos']));
    const text = h('div', { class: 'xp-dialog-body' });
    const lines = h('div');
    lines.append(
      h('p', {}, ['æthera · the home directory']),
      h('p', {}, ['Version 1998 (Build 2026.present_day)']),
      h('p', {}, ['A room of screens wired to one VCR, and every part of the site playing at once.']),
      h('p', { class: 'lic' }, ['This product is licensed under CC BY 4.0 to:']),
      h('p', {}, ['guest']),
    );
    text.append(lines);
    const actions = h('div', { class: 'xp-actions' });
    const ok = h('button', { class: 'xp-btn default', type: 'button' }, ['OK']);
    actions.append(ok);
    body.append(band, text, actions);
    const w = wm.open({ id: 'about', title: 'About æthera', icon: icons.info(), body, width: 400, dialog: true });
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
          taskbar.showTip(null, null, 0, 0);
          if (id === 'vcr') shell.home();
          else if (id) shell.play(id);
          else if (room?.focusedId && !panes.size && !room.busy) room.focus(null);
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

  // a press out in the room takes focus from the windows: they all go pale
  room?.renderer.domElement.addEventListener('pointerdown', () => wm.deactivate());

  // ---- right-click: tapes (tiles, screens), the VCR, the room, the folder ----
  bindContextMenu(root, (t, e): MenuEntry[] | null => {
    const tile = t.closest('.xp-tile') as HTMLElement | null;
    if (tile) return tile.dataset.id ? explorer.contextFor(tile.dataset.id) : null; // file tiles are links
    if (t.closest('a')) return null; // a link: the browser's menu (open in new tab) is the useful one
    if (t.closest('.xp-content') && t.closest('.xp-window')?.getAttribute('aria-label')?.startsWith('~')) return explorer.blankMenu();
    if (t.closest('.xp-window, .xp-startmenu, .xp-shutdown, .xp-menu, .xp-balloon')) return [];
    if (!room || t !== room.renderer.domElement) return [];
    const id = room.pickFromPoint(e.clientX, e.clientY);
    if (id === 'vcr') {
      return [
        { label: 'Open ~', bold: true, run: () => shell.home() },
        { label: 'Eject', run: () => shell.eject(), disabled: !inVcr },
        'sep',
        { label: 'Properties', disabled: true },
      ];
    }
    const site = id ? byId.get(id) : undefined;
    if (site) return siteMenu(shell, site);
    // the empty room is the desktop
    return [
      { label: 'Arrange Icons By', disabled: true, submenu: () => [] },
      { label: 'Refresh', run: () => room?.focus(null) },
      'sep',
      { label: 'Paste', disabled: true },
      { label: 'Paste Shortcut', disabled: true },
      'sep',
      { label: 'New', disabled: true, submenu: () => [] },
      'sep',
      { label: '~ Home directory', run: () => shell.home() },
      { label: 'Properties', disabled: true },
    ];
  });

  // screens tick inside the room's loop; with no room, the open pane's tube
  // still needs painting
  if (!room) {
    let last = performance.now();
    const loop = (now: number) => {
      requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      for (const id of panes.keys()) screens.get(id)?.tick(now / 1000, dt, true);
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
    // keys typed into a field are the field's; only Esc still closes what's
    // transient (a menu, a dialog), unless the field used it itself
    const typing = !!t.closest('input, textarea, [contenteditable]');
    if (typing && (e.key !== 'Escape' || e.defaultPrevented)) return;
    if (e.key === 'Escape' && tuned) {
      tuneOut(true);
      return;
    }
    if (tuned) return;
    if (e.key === 'Escape') {
      // Esc dismisses what's transient (menus, dialogs), as in XP; it never
      // closes an ordinary window. With nothing left, it steps the camera back.
      if (closeMenus()) return;
      if (taskbar.dismiss()) return;
      if (taskbar.startOpen) {
        taskbar.toggleMenu(false, true);
        return;
      }
      // the topmost dialog, whichever window is active
      const dlg = wm.topDialog();
      if (dlg) {
        dlg.close();
        return;
      }
      if (room?.focusedId && !wm.activeWindow && !typing) room.focus(null);
      return;
    }
    if (typing) return;
    // Alt+← / Alt+→: Back and Forward through the desk, never out of the page
    if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      if (e.key === 'ArrowLeft') shell.back();
      else shell.forward();
      return;
    }
    // F10: the active window's menu bar
    if (e.key === 'F10' && !e.shiftKey) {
      const title = wm.activeWindow?.el.querySelector('.xp-menutitle') as HTMLElement | null;
      if (title) {
        e.preventDefault();
        title.focus();
      }
      return;
    }
    // F6: between the active window and the taskbar (Tab never leaves a window)
    if (e.key === 'F6') {
      e.preventDefault();
      const w = wm.activeWindow;
      if (w && !w.el.contains(t)) w.el.focus();
      else (root.querySelector('.xp-start') as HTMLElement | null)?.focus();
      return;
    }
    // the room's own keys, only when nothing on the desk has the keyboard: no
    // active window, no menu, no dialog, and focus not on some control
    if (wm.activeWindow || menuOpen() || taskbar.startOpen || taskbar.dialogUp) return;
    if (t.closest('.xp-window, .xp-startmenu, .xp-menu, .xp-shutdown, .xp-taskbar, .xp-balloon, .oikos-tuned')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === '~' || e.key === 'Home') {
      shell.home();
      return;
    }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !room?.busy) {
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

  // ---- visibility: nothing runs, polls or listens in a hidden tab ----
  let booted = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      room?.stop();
      feeds.stop();
      // a tuned-in page runs its own sockets (/dreams holds /ws/dreams, which
      // keeps the dreamer's GPU awake): a hidden tab lets go of it too
      if (tuned) tuneOut(true);
    } else if (booted) {
      room?.start();
      feeds.start();
    }
  });

  // Back after diving into a site restores this page from the bfcache with
  // the camera still inside the glass, and `leaving` / `off` still set
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    leaving = false;
    root.classList.remove('off');
    room?.reset();
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
    Promise.all([
      document.fonts?.load('16px "Libertinus Mono"'),
      document.fonts?.load('16px "Love Letter Typewriter"'),
    ]).then(() => undefined, () => undefined),
    new Promise<void>((r) => setTimeout(r, 1500)),
  ]);
  const warmed = room?.warm() ?? Promise.resolve();
  void Promise.race([Promise.all([fonts, warmed, new Promise<void>((r) => setTimeout(r, minBoot))]), skipped]).then(() => {
    booted = true;
    // opened in a background tab: visibilitychange starts these when it's shown
    if (!document.hidden) {
      feeds.start();
      room?.start();
    }
    room?.powerOn();
    bootEl?.classList.add('gone');
    setTimeout(() => bootEl?.remove(), 800);

    const look = new URLSearchParams(location.search).get('look');
    if (look && room && (look === 'vcr' || byId.has(look))) setTimeout(() => room?.focus(look), 300);
    // a linked place (#~, #mirc, #<tape>) opens as if it had been clicked to
    const route = currentRoute();
    if (route && (route === '~' || route === 'home' || route === 'mirc' || byId.has(route))) {
      setTimeout(() => go(route, false), route === 'mirc' || route === '~' || route === 'home' ? 600 : 900);
      return;
    }
    if (!room) {
      openHome(false); // the place the visit starts at: not a step of its own
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
