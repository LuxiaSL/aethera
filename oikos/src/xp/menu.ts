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

let host: HTMLElement | null = null;
let top: Open | null = null;
let onCloseTop: (() => void) | null = null;

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
}

export function menuOpen(): boolean {
  return top !== null;
}

/** close every open menu; true if there was one */
export function closeMenus(): boolean {
  if (!top) return false;
  let m: Open | null = top;
  while (m) {
    m.el.remove();
    m = m.child;
  }
  top = null;
  const cb = onCloseTop;
  onCloseTop = null;
  cb?.();
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
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      ev.stopPropagation();
      const n = live[(i + (ev.key === 'ArrowDown' ? 1 : -1) + live.length) % live.length];
      n?.focus();
    } else if (ev.key === 'ArrowRight' && live[i]?.classList.contains('has-sub')) {
      ev.preventDefault();
      ev.stopPropagation();
      live[i]?.click();
    } else if (ev.key === 'ArrowLeft' && level) {
      ev.preventDefault();
      ev.stopPropagation();
      closeChildren(level);
      (level.el.querySelector('button.has-sub') as HTMLElement | null)?.focus();
    }
  });
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
 * Open a menu at a page point. `onClose` runs when it closes for any reason
 * (the menu bar uses it to un-press its title).
 */
export function openMenu(entries: MenuEntry[], x: number, y: number, onClose?: () => void, focusFirst = false): void {
  closeMenus();
  const el = build(entries, null);
  top = { el, child: null };
  place(el, x, y);
  onCloseTop = onClose ?? null;
  if (focusFirst) (el.querySelector('button:not([aria-disabled])') as HTMLElement | null)?.focus();
}

/** Open a menu as a cascade to the side of an element (start menu flyouts). */
export function openCascade(entries: MenuEntry[], beside: HTMLElement, onClose?: () => void): void {
  const r = beside.getBoundingClientRect();
  openMenu(entries, r.right - 2, r.top - 3, onClose);
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
    openMenu(entries, e.clientX, e.clientY);
  });
}
