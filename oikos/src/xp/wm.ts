/**
 * wm.ts — windows: open, focus, drag, minimise, maximise, close.
 *
 * Deliberately small. One window per id (opening an open window focuses it);
 * the most recently focused is active and the rest go pale. The active window
 * has the keyboard: focusing a window moves focus into it, and Tab wraps
 * inside it. The taskbar subscribes to changes and keeps a button per window.
 * Ordinary windows resize from any edge or corner; dialogs, as in XP, don't,
 * and they float above every ordinary window so they can't be lost behind one.
 * New windows take their docked spot if it's free, and otherwise cascade
 * down and right from the last one opened.
 */

import { closeMenus, menuOwnedBy, openMenu, type MenuEntry } from './menu';
import { focusables, isSheet, viaKeyboard } from './env';

/**
 * The smallest a window can be made by hand: enough for an Explorer window's
 * tab, menu bar, toolbar, address bar and status bar, with a row of tiles
 * still showing under them. xp.css's .xp-window min-width matches MIN_W.
 */
export const MIN_W = 340;
export const MIN_H = 260;
/** how far each new window steps down and right from the last */
const CASCADE = 28;
/** dialogs stack above every ordinary window */
const DIALOG_Z = 100_000;
/** how much of a window stays on the desk when it's dragged off an edge */
const KEEP = 140;

type Edge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
const EDGES: Edge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

export interface WindowOpts {
  id: string;
  title: string;
  icon: string; // svg markup
  body: HTMLElement;
  width: number;
  x?: number;
  y?: number;
  dock?: 'left' | 'right' | 'center';
  dialog?: boolean;
  onClose?: () => void;
  onFocus?: () => void;
}

export class XPWindow {
  readonly el: HTMLElement;
  minimized = false;
  closed = false;

  constructor(
    readonly opts: WindowOpts,
    private readonly wm: WindowManager,
  ) {
    const el = document.createElement('section');
    el.className = `xp-window${opts.dialog ? ' xp-dialog' : ''}`;
    el.setAttribute('role', opts.dialog ? 'alertdialog' : 'dialog');
    el.setAttribute('aria-label', opts.title);
    el.dataset.win = opts.id;
    // focusable itself (not in the tab order), so a click anywhere on it takes the keyboard
    el.tabIndex = -1;
    el.innerHTML = `
      <header class="xp-titlebar">
        <span class="xp-title-icon">${opts.icon}</span>
        <span class="xp-title"></span>
        <span class="xp-controls">
          ${opts.dialog ? '' : '<button class="xp-min" aria-label="Minimize" title="Minimize"></button><button class="xp-max" aria-label="Maximize" title="Maximize"></button>'}
          <button class="xp-close" aria-label="Close" title="Close"></button>
        </span>
      </header>`;
    const title = el.querySelector('.xp-title');
    if (title) title.textContent = opts.title;
    el.append(opts.body);
    el.style.width = `${opts.width}px`;
    this.el = el;

    el.querySelector('.xp-close')?.addEventListener('click', () => this.close());
    el.querySelector('.xp-min')?.addEventListener('click', () => this.minimize());
    el.querySelector('.xp-max')?.addEventListener('click', () => this.toggleMax());
    el.addEventListener('pointerdown', () => this.focus(), true);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !e.altKey && !e.ctrlKey && !e.metaKey) this.wm.trapTab(this, e);
      // Alt+Space: the system menu, as Windows had it
      else if (e.key === ' ' && e.altKey) {
        e.preventDefault();
        this.openSystemMenu(true);
      }
    });
    this.bindDrag(el.querySelector('.xp-titlebar') as HTMLElement);
    if (!opts.dialog) this.bindResize();
    el.querySelector('.xp-titlebar')?.addEventListener('dblclick', (e) => {
      const t = e.target as HTMLElement;
      if (t.closest('.xp-controls') || opts.dialog) return;
      // double-clicking the icon closes, as it always has; the bar maximises
      if (t.closest('.xp-title-icon')) this.close();
      else this.toggleMax();
    });
    // the system menu: from the icon, or a right click anywhere on the bar
    const icon = el.querySelector('.xp-title-icon') as HTMLElement | null;
    icon?.setAttribute('data-menu-owner', '');
    icon?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openSystemMenu(false);
    });
    el.querySelector('.xp-titlebar')?.addEventListener('contextmenu', (e) => {
      const me = e as MouseEvent;
      if ((me.target as HTMLElement).closest('.xp-controls')) return;
      me.preventDefault();
      me.stopPropagation();
      openMenu(this.systemMenu(), me.clientX, me.clientY, { owner: this.el });
    });
  }

  get maximized(): boolean {
    return this.el.classList.contains('maximized');
  }

  private openSystemMenu(keyboard: boolean): void {
    const r = this.el.getBoundingClientRect();
    openMenu(this.systemMenu(), r.left + 3, r.top + 29, { owner: this.el, focusFirst: keyboard || viaKeyboard(), returnTo: this.el });
  }

  /** Restore / Move / Size / Minimize / Maximize / Close, greyed where they don't apply */
  systemMenu(): MenuEntry[] {
    const d = !!this.opts.dialog;
    return [
      { label: 'Restore', run: () => (this.minimized ? this.restore() : this.toggleMax()), disabled: d || (!this.maximized && !this.minimized) },
      { label: 'Move', disabled: true },
      { label: 'Size', disabled: true },
      { label: 'Minimize', run: () => this.minimize(), disabled: d || this.minimized },
      {
        label: 'Maximize',
        run: () => {
          if (this.minimized) this.restore();
          if (!this.maximized) this.toggleMax();
        },
        disabled: d || this.maximized,
      },
      'sep',
      // no Alt+F4 beside it: the browser owns that key, and it closes the browser
      { label: 'Close', run: () => this.close(), bold: true },
    ];
  }

  setTitle(t: string): void {
    const title = this.el.querySelector('.xp-title');
    if (title) title.textContent = t;
    this.el.setAttribute('aria-label', t);
    this.wm.changed();
  }

  /** first placement: the docked spot if it's free, else a step on from the last window opened */
  place(desk: HTMLElement, after: XPWindow | null): void {
    const W = desk.clientWidth;
    const H = desk.clientHeight;
    const w = Math.min(this.opts.width, W - 16);
    this.el.style.width = `${w}px`;
    desk.append(this.el);
    const h = Math.min(this.el.offsetHeight, H - 16);
    let x = this.opts.x ?? 0;
    let y = this.opts.y ?? 0;
    if (this.opts.x === undefined) {
      if (this.opts.dock === 'left') x = 18;
      else if (this.opts.dock === 'right') x = W - w - 18;
      else x = (W - w) / 2;
    }
    if (this.opts.y === undefined) y = this.opts.dialog ? (H - h) / 2.4 : Math.max(8, Math.min(60, (H - h) / 2));
    if (after && !this.opts.dialog && this.wm.crowded(this, x, y, w, h)) {
      x = after.el.offsetLeft + CASCADE;
      y = after.el.offsetTop + CASCADE;
      // off the right edge (a window docked flush right): step down and left instead
      if (x + w > W - 8) x = Math.max(8, after.el.offsetLeft - CASCADE);
      // off the bottom: wrap back up to the top, as XP's cascade did
      if (y + h > H - 8) y = 8;
    }
    this.moveTo(x, y);
  }

  moveTo(x: number, y: number): void {
    const desk = this.el.parentElement;
    if (!desk) return;
    const maxX = desk.clientWidth - 60;
    const maxY = desk.clientHeight - 30;
    this.el.style.left = `${Math.round(Math.max(-this.el.offsetWidth + KEEP, Math.min(maxX, x)))}px`;
    this.el.style.top = `${Math.round(Math.max(0, Math.min(maxY, y)))}px`;
  }

  private bindDrag(bar: HTMLElement): void {
    let start: { x: number; y: number; left: number; top: number } | null = null;
    // a press on a maximised window's bar: once it moves, the window comes
    // back to its own size under the pointer and keeps following it (XP)
    let fromMax: { x: number; y: number } | null = null;
    bar.addEventListener('pointerdown', (e) => {
      // not from the buttons or the icon: capturing the pointer would steal their clicks
      if ((e.target as HTMLElement).closest('.xp-controls, .xp-title-icon')) return;
      if (e.button !== 0 || isSheet()) return;
      if (this.maximized) {
        fromMax = { x: e.clientX, y: e.clientY };
        start = null;
      } else {
        start = { x: e.clientX, y: e.clientY, left: this.el.offsetLeft, top: this.el.offsetTop };
      }
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener('pointermove', (e) => {
      if (fromMax) {
        if (Math.hypot(e.clientX - fromMax.x, e.clientY - fromMax.y) < 6) return;
        const desk = this.el.parentElement;
        if (!desk) return;
        const d = desk.getBoundingClientRect();
        // where on the bar it was held, from the window's left (the tab sits at the left)
        const grabX = fromMax.x - d.left;
        const grabY = fromMax.y - d.top;
        fromMax = null;
        this.toggleMax();
        const w = this.el.offsetWidth;
        const left = e.clientX - d.left - Math.min(grabX, Math.max(40, w - 90));
        const top = e.clientY - d.top - grabY;
        this.moveTo(left, top);
        start = { x: e.clientX, y: e.clientY, left: this.el.offsetLeft, top: this.el.offsetTop };
        return;
      }
      if (!start) return;
      this.moveTo(start.left + e.clientX - start.x, start.top + e.clientY - start.y);
    });
    const end = () => {
      if (start) this.wm.changed();
      start = null;
      fromMax = null;
    };
    bar.addEventListener('pointerup', end);
    bar.addEventListener('pointercancel', end);
  }

  /** invisible grips over the frame's edges and corners */
  private bindResize(): void {
    for (const edge of EDGES) {
      const grip = document.createElement('div');
      grip.className = `xp-grip xp-grip-${edge}`;
      grip.setAttribute('aria-hidden', 'true');
      this.el.append(grip);
      let start: { x: number; y: number; left: number; top: number; w: number; h: number } | null = null;
      grip.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || this.maximized || isSheet()) return;
        e.preventDefault();
        start = { x: e.clientX, y: e.clientY, left: this.el.offsetLeft, top: this.el.offsetTop, w: this.el.offsetWidth, h: this.el.offsetHeight };
        grip.setPointerCapture(e.pointerId);
        this.focus();
      });
      grip.addEventListener('pointermove', (e) => {
        if (!start) return;
        const desk = this.el.parentElement;
        if (!desk) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        let { left, top, w, h } = start;
        if (edge.includes('e')) w = Math.min(desk.clientWidth - left, Math.max(MIN_W, start.w + dx));
        if (edge.includes('s')) h = Math.min(desk.clientHeight - top, Math.max(MIN_H, start.h + dy));
        if (edge.includes('w')) {
          w = Math.max(MIN_W, Math.min(start.left + start.w, start.w - dx));
          left = start.left + start.w - w;
        }
        if (edge.includes('n')) {
          h = Math.max(MIN_H, Math.min(start.top + start.h, start.h - dy));
          top = start.top + start.h - h;
        }
        this.el.style.left = `${Math.round(left)}px`;
        this.el.style.top = `${Math.round(top)}px`;
        this.el.style.width = `${Math.round(w)}px`;
        this.el.style.height = `${Math.round(h)}px`;
        // sized by hand now: the opening size limits no longer apply
        this.el.style.maxHeight = 'none';
      });
      const end = () => {
        if (start) this.wm.changed();
        start = null;
      };
      grip.addEventListener('pointerup', end);
      grip.addEventListener('pointercancel', end);
    }
  }

  /**
   * After the page shrinks, or on the way back from minimised or maximised:
   * keep the window where it can still be grabbed. Not while windows are
   * sheets: the sheet's CSS owns the position then, and writing its
   * geometry into the inline style would strand the window when the page
   * turns back (a phone rotated and rotated back).
   */
  clamp(): void {
    if (this.maximized || this.minimized || isSheet()) return;
    const desk = this.el.parentElement;
    if (!desk) return;
    if (this.el.offsetWidth > desk.clientWidth) this.el.style.width = `${Math.max(Math.min(MIN_W, desk.clientWidth), desk.clientWidth - 8)}px`;
    if (this.el.offsetHeight > desk.clientHeight) this.el.style.height = `${Math.max(Math.min(MIN_H, desk.clientHeight), desk.clientHeight - 8)}px`;
    this.moveTo(this.el.offsetLeft, this.el.offsetTop);
  }

  focus(): void {
    this.wm.focus(this);
  }

  minimize(): void {
    if (this.closed) return;
    this.minimized = true;
    this.el.classList.add('minimized');
    if (menuOwnedBy(this.el)) closeMenus();
    this.wm.focusTop();
    this.wm.changed();
  }

  restore(): void {
    if (this.closed) return;
    this.minimized = false;
    this.el.classList.remove('minimized');
    this.clamp();
    this.focus();
  }

  toggleMax(): void {
    if (this.closed) return;
    const max = this.el.classList.toggle('maximized');
    // the button becomes Restore while maximised (its glyph is CSS: .maximized .xp-max)
    const b = this.el.querySelector('.xp-max');
    b?.setAttribute('aria-label', max ? 'Restore' : 'Maximize');
    b?.setAttribute('title', max ? 'Restore' : 'Maximize');
    if (!max) this.clamp();
    // from the taskbar's menu on a window behind: it comes forward too
    this.focus();
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    // its system menu (or any menu out of it) goes with it
    if (menuOwnedBy(this.el)) closeMenus();
    this.el.remove();
    this.wm.remove(this);
    this.opts.onClose?.();
    this.wm.closed(this);
  }
}

export class WindowManager {
  private windows: XPWindow[] = [];
  private active: XPWindow | null = null;
  private last: XPWindow | null = null;
  private z = 30;
  private listeners = new Set<() => void>();
  private closeListeners = new Set<(w: XPWindow) => void>();

  constructor(readonly desk: HTMLElement) {
    addEventListener('resize', () => {
      for (const w of this.windows) w.clamp();
    });
  }

  get list(): readonly XPWindow[] {
    return this.windows;
  }

  get activeWindow(): XPWindow | null {
    return this.active;
  }

  get(id: string): XPWindow | undefined {
    return this.windows.find((w) => w.opts.id === id);
  }

  open(opts: WindowOpts): XPWindow {
    const existing = this.get(opts.id);
    if (existing) {
      if (existing.minimized) existing.restore();
      else existing.focus();
      return existing;
    }
    const w = new XPWindow(opts, this);
    const after = this.last && !this.last.closed && !this.last.minimized ? this.last : this.topmost();
    this.windows.push(w);
    w.place(this.desk, after);
    if (!opts.dialog) this.last = w;
    this.focus(w);
    return w;
  }

  /** the visible ordinary window highest in the stack */
  private topmost(): XPWindow | null {
    return this.windows.filter((w) => !w.minimized && !w.opts.dialog).sort((a, b) => Number(b.el.style.zIndex) - Number(a.el.style.zIndex))[0] ?? null;
  }

  /** would a window at (x, y, w, h) sit mostly on top of one already open? */
  crowded(self: XPWindow, x: number, y: number, w: number, h: number): boolean {
    for (const o of this.windows) {
      if (o === self || o.minimized || o.opts.dialog || o.maximized) continue;
      const ox = Math.max(0, Math.min(x + w, o.el.offsetLeft + o.el.offsetWidth) - Math.max(x, o.el.offsetLeft));
      const oy = Math.max(0, Math.min(y + h, o.el.offsetTop + o.el.offsetHeight) - Math.max(y, o.el.offsetTop));
      if (ox * oy > 0.25 * w * h) return true;
    }
    return false;
  }

  focus(w: XPWindow): void {
    if (w.closed) return;
    const changed = this.active !== w;
    this.active = w;
    w.el.style.zIndex = String(++this.z + (w.opts.dialog ? DIALOG_Z : 0));
    for (const other of this.windows) other.el.classList.toggle('inactive', other !== w);
    // the keyboard follows: into the window, unless something in it has it already
    if (!w.minimized && !w.el.contains(document.activeElement)) w.el.focus({ preventScroll: true });
    if (changed) w.opts.onFocus?.();
    this.changed();
  }

  /** a click out in the room: no window has focus, and they all go pale */
  deactivate(): void {
    if (!this.active) return;
    const was = this.active;
    this.active = null;
    for (const w of this.windows) w.el.classList.add('inactive');
    if (was.el.contains(document.activeElement)) (document.activeElement as HTMLElement | null)?.blur();
    this.changed();
  }

  focusTop(): void {
    const visible = this.windows.filter((w) => !w.minimized);
    const top = visible.sort((a, b) => Number(b.el.style.zIndex) - Number(a.el.style.zIndex))[0];
    if (top) this.focus(top);
    else {
      this.active = null;
      // nothing left on the desk: none of them is the active one now
      for (const w of this.windows) w.el.classList.add('inactive');
      this.changed();
    }
  }

  /** the open dialog highest in the stack (Esc closes it, whichever window is active) */
  topDialog(): XPWindow | null {
    return this.windows.filter((w) => w.opts.dialog && !w.minimized).sort((a, b) => Number(b.el.style.zIndex) - Number(a.el.style.zIndex))[0] ?? null;
  }

  /** Tab and Shift+Tab go round the active window's controls and never leave it */
  trapTab(w: XPWindow, e: KeyboardEvent): void {
    const f = focusables(w.el);
    e.preventDefault();
    if (!f.length) {
      w.el.focus({ preventScroll: true });
      return;
    }
    const i = f.indexOf(document.activeElement as HTMLElement);
    const next = i < 0 ? (e.shiftKey ? f.length - 1 : 0) : (i + (e.shiftKey ? -1 : 1) + f.length) % f.length;
    f[next]?.focus();
  }

  remove(w: XPWindow): void {
    this.windows = this.windows.filter((x) => x !== w);
    if (this.last === w) this.last = null;
    if (this.active === w) {
      this.active = null;
      this.focusTop();
    }
    this.changed();
  }

  closeTop(): boolean {
    const top = this.active && !this.active.minimized ? this.active : null;
    if (!top) return false;
    top.close();
    return true;
  }

  on(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /** after any window closes, by any path (its ✕, a menu, Log Off) */
  onClose(fn: (w: XPWindow) => void): () => void {
    this.closeListeners.add(fn);
    return () => this.closeListeners.delete(fn);
  }

  closed(w: XPWindow): void {
    for (const fn of this.closeListeners) fn(w);
  }

  changed(): void {
    for (const fn of this.listeners) fn();
  }
}
