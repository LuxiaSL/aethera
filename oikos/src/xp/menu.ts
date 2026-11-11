/**
 * menu.ts — the one popup menu everything shares.
 *
 * Menu bar dropdowns, right-click menus, the system menu behind a title-bar
 * icon, and the start menu's cascades ("All Programs ▸") are all this: a
 * white Luna menu with a blue highlight, grey disabled items, checkmarks,
 * separators and submenus that open to the side on hover.
 *
 * One menu (with its cascade) is open at a time. It closes on a pick, on a
 * click anywhere outside it, and on Esc (see main.ts: close() reports whether
 * there was one, so Esc isn't also spent on something behind it).
 */

import { h } from './chrome';
import { viaKeyboard } from './env';

export interface MenuItem {
  label: string;
  icon?: string;
  run?: () => void;
  /** greyed out, as XP shows what exists but can't be done here */
  disabled?: boolean;
  checked?: boolean;
  bold?: boolean;
  shortcut?: string;
  submenu?: () => MenuEntry[];
}

export type MenuEntry = MenuItem | 'sep';

interface Open {
  el: HTMLElement;
  child: Open | null;
}

export interface MenuOpts {
  /** runs when the menu closes for any reason (the menu bar un-presses its title) */
  onClose?: () => void;
  /** focus the first item (default: when it was opened from the keyboard) */
  focusFirst?: boolean;
  /** take the keyboard at all; a cascade that opens on hover leaves it where it is */
  takeFocus?: boolean;
  /** what the menu belongs to: closing it (a window) closes the menu too */
  owner?: HTMLElement | null;
  /** where focus goes back to when the menu closes holding it (default: whatever had it at opening) */
  returnTo?: HTMLElement | null;
  /** ← / → at the top level with nowhere to go inside: the menu bar's neighbours, a cascade's way back */
  onNav?: (dir: -1 | 1) => void;
}

let host: HTMLElement | null = null;
let top: Open | null = null;
let topOpts: MenuOpts = {};

/** where menus are attached (the #oikos root, so nothing clips them) */
export function setMenuHost(el: HTMLElement): void {
  host = el;
  // a press anywhere outside every open menu closes them all
  el.addEventListener(
    'pointerdown',
    (e) => {
      if (!top) return;
      const t = e.target as HTMLElement;
      if (t.closest('.xp-menu') || t.closest('[data-menu-owner]')) return;
      closeMenus();
    },
    true,
  );
  // scrolling anything else (a window's content, the room's zoom) takes the menu away, as a desktop does
  el.addEventListener(
    'wheel',
    (e) => {
      if (top && !(e.target as HTMLElement).closest('.xp-menu')) closeMenus();
    },
    { capture: true, passive: true },
  );
  // a menu placed for the old page width is in the wrong place now (not on a
  // height change alone: a phone's toolbar or keyboard sliding in is one)
  let lastW = innerWidth;
  addEventListener('resize', () => {
    if (innerWidth !== lastW) closeMenus();
    lastW = innerWidth;
  });
}

export function menuOpen(): boolean {
  return top !== null;
}

/** a menu is open that belongs to `el` (or to something inside it) */
export function menuOwnedBy(el: HTMLElement): boolean {
  const o = topOpts.owner;
  return !!top && !!o && (o === el || el.contains(o));
}

function holdsFocus(): boolean {
  const a = document.activeElement;
  let m = top;
  while (m) {
    if (a && m.el.contains(a)) return true;
    m = m.child;
  }
  return false;
}

/** close every open menu; true if there was one. Focus held by the menu goes back to its opener. */
export function closeMenus(): boolean {
  if (!top) return false;
  const hadFocus = holdsFocus();
  let m: Open | null = top;
  while (m) {
    m.el.remove();
    m = m.child;
  }
  top = null;
  const { onClose, returnTo } = topOpts;
  topOpts = {};
  onClose?.();
  if (hadFocus && returnTo?.isConnected && returnTo.getClientRects().length) returnTo.focus({ preventScroll: true });
  return true;
}

function build(entries: MenuEntry[], level: Open | null): HTMLElement {
  const el = h('div', { class: 'xp-menu', role: 'menu' });
  const buttons: HTMLButtonElement[] = [];
  for (const e of entries) {
    if (e === 'sep') {
      el.append(h('div', { class: 'xp-menu-sep', role: 'separator' }));
      continue;
    }
    const b = h('button', {
      type: 'button',
      role: e.checked !== undefined ? 'menuitemcheckbox' : 'menuitem',
      class: `${e.bold ? 'bold ' : ''}${e.submenu ? 'has-sub' : ''}`.trim(),
      html: `<i class="ic">${e.icon ?? ''}</i><span class="lb"></span><span class="sc"></span>`,
    });
    (b.querySelector('.lb') as HTMLElement).textContent = e.label;
    (b.querySelector('.sc') as HTMLElement).textContent = e.shortcut ?? '';
    if (e.checked !== undefined) {
      b.setAttribute('aria-checked', String(e.checked));
      if (e.checked) b.classList.add('checked');
    }
    if (e.disabled) {
      b.setAttribute('aria-disabled', 'true');
      b.tabIndex = -1;
    }
    const openSub = () => {
      if (!e.submenu || e.disabled) return;
      const self = findLevel(el);
      if (!self) return;
      if (self.child?.el.dataset.for === e.label) return;
      closeChildren(self);
      const r = b.getBoundingClientRect();
      const sub = place(build(e.submenu(), self), r.right - 3, r.top - 3, r.left + 3);
      sub.dataset.for = e.label;
      self.child = { el: sub, child: null };
    };
    b.addEventListener('pointerenter', () => {
      const self = findLevel(el);
      if (e.submenu) openSub();
      else if (self) closeChildren(self);
      // the highlight and the keyboard stay on the same item
      if (!e.disabled && holdsFocus()) b.focus({ preventScroll: true });
    });
    b.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (e.disabled) return;
      if (e.submenu) {
        openSub();
        (findLevel(el)?.child?.el.querySelector('button:not([aria-disabled])') as HTMLElement | null)?.focus();
        return;
      }
      closeMenus();
      e.run?.();
    });
    el.append(b);
    buttons.push(b);
  }
  el.addEventListener('keydown', (ev) => {
    const live = buttons.filter((b) => b.getAttribute('aria-disabled') !== 'true');
    const i = live.indexOf(document.activeElement as HTMLButtonElement);
    const stop = () => {
      ev.preventDefault();
      ev.stopPropagation();
    };
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      stop();
      const down = ev.key === 'ArrowDown';
      // nothing focused yet (opened by a click): the first or the last
      const n = i < 0 ? live[down ? 0 : live.length - 1] : live[(i + (down ? 1 : -1) + live.length) % live.length];
      n?.focus();
    } else if (ev.key === 'Home' || ev.key === 'End') {
      stop();
      live[ev.key === 'Home' ? 0 : live.length - 1]?.focus();
    } else if (ev.key === 'ArrowRight') {
      stop();
      if (live[i]?.classList.contains('has-sub')) live[i]?.click();
      else if (!level) topOpts.onNav?.(1);
    } else if (ev.key === 'ArrowLeft') {
      stop();
      if (level) back(level);
      else topOpts.onNav?.(-1);
    } else if (ev.key === 'Escape') {
      // one level at a time, as XP did; the last one hands focus back to the opener
      stop();
      if (level) back(level);
      else closeMenus();
    } else if (ev.key === 'Tab') {
      // a menu is not in the tab order: Tab leaves it, closed
      stop();
      closeMenus();
    }
  });
  // back out of a cascade to the item it hangs from
  const back = (parent: Open) => {
    const forLabel = parent.child?.el.dataset.for;
    closeChildren(parent);
    const owner = [...parent.el.querySelectorAll<HTMLElement>('button.has-sub')].find((b) => b.querySelector('.lb')?.textContent === forLabel);
    owner?.focus();
  };
  return el;
}

function findLevel(el: HTMLElement): Open | null {
  let m = top;
  while (m) {
    if (m.el === el) return m;
    m = m.child;
  }
  return null;
}

function closeChildren(level: Open): void {
  let c = level.child;
  while (c) {
    c.el.remove();
    c = c.child;
  }
  level.child = null;
}

/** put a menu on the page at (x, y), flipped to stay inside it */
function place(el: HTMLElement, x: number, y: number, flipX = x): HTMLElement {
  if (!host) throw new Error('menu host not set');
  el.style.left = '0px';
  el.style.top = '0px';
  host.append(el);
  const r = host.getBoundingClientRect();
  const w = el.offsetWidth;
  const hgt = el.offsetHeight;
  let left = x - r.left;
  let topPx = y - r.top;
  if (left + w > r.width - 2) left = Math.max(2, flipX - r.left - w);
  if (topPx + hgt > r.height - 32) topPx = Math.max(2, r.height - 32 - hgt);
  el.style.left = `${Math.round(left)}px`;
  el.style.top = `${Math.round(topPx)}px`;
  return el;
}

/**
 * Open a menu at a page point. Opened from the keyboard it focuses its first
 * item; opened by a click it holds the keyboard itself, so the arrows reach
 * it rather than the room.
 */
export function openMenu(entries: MenuEntry[], x: number, y: number, opts: MenuOpts = {}): void {
  closeMenus();
  const opener = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
  const el = build(entries, null);
  el.tabIndex = -1;
  top = { el, child: null };
  topOpts = { ...opts, returnTo: opts.returnTo ?? opener };
  place(el, x, y);
  if (opts.takeFocus === false) return;
  const first = el.querySelector('button:not([aria-disabled])') as HTMLElement | null;
  if ((opts.focusFirst ?? viaKeyboard()) && first) first.focus({ preventScroll: true });
  else el.focus({ preventScroll: true });
}

/** Open a menu as a cascade to the side of an element (start menu flyouts); ← comes back to it. */
export function openCascade(entries: MenuEntry[], beside: HTMLElement, opts: MenuOpts = {}): void {
  const r = beside.getBoundingClientRect();
  openMenu(entries, r.right - 2, r.top - 3, { returnTo: beside, onNav: (d) => d < 0 && closeMenus(), ...opts });
  if (top) {
    // flip left if there's no room on the right (a phone)
    const hr = host?.getBoundingClientRect();
    if (hr && r.right + top.el.offsetWidth > hr.right) top.el.style.left = `${Math.max(2, r.left - hr.left - top.el.offsetWidth + 2)}px`;
  }
}

/**
 * Right-click menus: `resolve` maps the element right-clicked to a menu, or
 * null to let the browser have it (text fields, links you'd want to copy).
 */
export function bindContextMenu(root: HTMLElement, resolve: (target: HTMLElement, e: MouseEvent) => MenuEntry[] | null): void {
  root.addEventListener('contextmenu', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('input, textarea, [contenteditable], .oikos-tube')) return;
    const entries = resolve(t, e);
    if (entries === null) return;
    e.preventDefault();
    if (!entries.length) {
      closeMenus();
      return;
    }
    // the menu key or Shift+F10 fires this too, at the focused element
    openMenu(entries, e.clientX, e.clientY, { owner: t });
  });
}
