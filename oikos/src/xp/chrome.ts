/**
 * chrome.ts — the parts every Explorer window has.
 *
 * Menu bar (with the throbber corner holding æthera's mark instead of a
 * flag), the big toolbar, the address bar, the blue task pane and the status
 * bar with its security zone. Builders return elements; windows assemble.
 */

import * as icons from './icons';
import { closeMenus, menuOpen, openMenu, type MenuEntry } from './menu';

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v);
  }
  for (const c of children) el.append(c);
  return el;
}

export type MenuSpec = Record<string, () => MenuEntry[]>;

/**
 * The menu bar. Click a title to drop its menu; while one is down, moving
 * across the bar swaps to the menu under the pointer, as XP's did. From the
 * keyboard: ↓, Enter or Space drops a menu onto its first item, ← and → walk
 * the titles (or, with a menu down, the neighbouring menus), Esc comes back
 * to the title.
 */
export function menubar(menus: MenuSpec): HTMLElement {
  const bar = h('div', { class: 'xp-menubar', role: 'menubar' });
  let openTitle: HTMLElement | null = null;
  const titles: HTMLButtonElement[] = [];
  const names = Object.keys(menus);
  const drop = (i: number, focusFirst: boolean, takeFocus = true) => {
    const title = titles[i];
    const name = names[i];
    if (!title || name === undefined) return;
    const entries = menus[name]?.();
    if (!entries) return;
    const r = title.getBoundingClientRect();
    openMenu(entries, r.left, r.bottom, {
      onClose: () => {
        title.classList.remove('open');
        title.setAttribute('aria-expanded', 'false');
        if (openTitle === title) openTitle = null;
      },
      focusFirst,
      takeFocus,
      returnTo: title,
      owner: title,
      onNav: (d) => {
        const j = (i + d + titles.length) % titles.length;
        titles[j]?.focus({ preventScroll: true });
        drop(j, true);
      },
    });
    title.classList.add('open');
    title.setAttribute('aria-expanded', 'true');
    openTitle = title;
  };
  names.forEach((name, i) => {
    const title = h('button', { type: 'button', class: 'xp-menutitle', role: 'menuitem', 'aria-haspopup': 'menu', 'aria-expanded': 'false', 'data-menu-owner': '' }, [name]);
    // one stop in the tab order for the whole bar; the arrows walk it
    if (i > 0) title.tabIndex = -1;
    title.addEventListener('click', () => {
      if (openTitle === title) closeMenus();
      else drop(i, false);
    });
    title.addEventListener('pointerenter', () => {
      if (openTitle && openTitle !== title && menuOpen()) {
        // the keyboard moves with the pointer, so ↓ opens this menu, not the last one
        title.focus({ preventScroll: true });
        drop(i, false);
      }
    });
    title.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        drop(i, true);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        const j = (i + (e.key === 'ArrowRight' ? 1 : -1) + titles.length) % titles.length;
        titles[j]?.focus();
      }
    });
    titles.push(title);
    bar.append(title);
  });
  bar.append(h('span', { class: 'xp-throbber', 'aria-hidden': 'true', html: icons.markImg(18, true) }));
  return bar;
}

export interface ToolbarHandlers {
  back?: () => void;
  forward?: () => void;
  up?: () => void;
  search?: () => void;
  folders?: () => void;
  /** which of back/forward can go anywhere right now (re-read on refresh()) */
  can?: () => { back: boolean; forward: boolean };
}

export function toolbar(on: ToolbarHandlers): { el: HTMLElement; refresh(): void } {
  const bar = h('div', { class: 'xp-toolbar' });
  const btn = (icon: string, label: string, fn: (() => void) | undefined, showLabel = true) => {
    const b = h('button', { class: 'xp-tb', type: 'button', title: label, html: `${icon}${showLabel ? `<span>${label}</span>` : ''}` });
    if (fn) b.addEventListener('click', fn);
    else b.disabled = true;
    bar.append(b);
    return b;
  };
  const back = btn(icons.back(), 'Back', on.back);
  const forward = btn(icons.forward(), 'Forward', on.forward, false);
  btn(icons.up(), 'Up', on.up, false);
  bar.append(h('span', { class: 'xp-tb-sep' }));
  btn(icons.search(), 'Search', on.search);
  btn(icons.folders(), 'Folders', on.folders);
  const refresh = () => {
    if (!on.can) return;
    const c = on.can();
    back.disabled = !on.back || !c.back;
    forward.disabled = !on.forward || !c.forward;
  };
  refresh();
  return { el: bar, refresh };
}

export function addressBar(icon: string, value: string, editable: boolean, onGo?: (v: string) => void): { el: HTMLElement; input: HTMLInputElement | null } {
  const el = h('div', { class: 'xp-address' });
  el.append(h('span', { class: 'lbl' }, ['Address']));
  const field = h('label', { class: 'field', html: icon });
  let input: HTMLInputElement | null = null;
  if (editable) {
    input = h('input', { type: 'text', value, 'aria-label': 'Address', spellcheck: 'false' });
    input.style.cssText = 'flex:1;min-width:0;border:0;outline:0;font:inherit;background:transparent;';
    field.append(input);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input) onGo?.(input.value);
      // Tab goes on to the window, which keeps it inside
      if (e.key !== 'Tab') e.stopPropagation();
    });
  } else {
    field.append(h('span', {}, [value]));
  }
  el.append(field);
  const go = h('button', { class: 'go', type: 'button', html: `${icons.go()}<span>Go</span>` });
  go.addEventListener('click', () => onGo?.(input?.value ?? value));
  el.append(go);
  return { el, input };
}

export interface TaskItem {
  icon: string;
  label: string;
  run?: () => void;
  href?: string;
  external?: boolean;
}

export function taskGroup(title: string, items: TaskItem[] | HTMLElement, primary = false): HTMLElement {
  const g = h('section', { class: `xp-taskgroup${primary ? ' primary' : ''}` });
  // the header is a heading; the control in it is a real button (it was a <header role=button>)
  const head = h('header');
  const btn = h('button', { type: 'button', class: 'xp-taskgroup-toggle', 'aria-expanded': 'true' }, [title]);
  head.append(btn);
  const toggle = () => {
    g.classList.toggle('collapsed');
    btn.setAttribute('aria-expanded', String(!g.classList.contains('collapsed')));
  };
  // the whole header is the target (its ▴ too), the button carries the keyboard and the name
  head.addEventListener('click', toggle);
  g.append(head);
  const body = h('div', { class: 'xp-taskbody' });
  if (items instanceof HTMLElement) body.append(items);
  else {
    const ul = h('ul');
    for (const it of items) {
      const li = h('li');
      let el: HTMLElement;
      if (it.href) {
        el = h('a', { class: 'xp-link', href: it.href, html: `${it.icon}<span></span>` });
        if (it.external) {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener');
        }
      } else {
        el = h('button', { class: 'xp-link', type: 'button', html: `${it.icon}<span></span>` });
        const run = it.run;
        if (run) el.addEventListener('click', run);
        else el.setAttribute('aria-disabled', 'true');
      }
      const span = el.querySelector('span');
      if (span) span.textContent = it.label;
      li.append(el);
      ul.append(li);
    }
    body.append(ul);
  }
  g.append(body);
  return g;
}

export type Zone = 'computer' | 'internet';

export function statusbar(): { el: HTMLElement; set(text: string, zone: Zone): void } {
  // a div, not a footer: branding.css paints every footer with padding and a white glow
  const el = h('div', { class: 'xp-statusbar', role: 'status' });
  const left = h('span');
  const right = h('span', { class: 'zone' });
  el.append(left, right);
  return {
    el,
    set(text: string, zone: Zone) {
      left.textContent = text;
      const [icon, label] = zone === 'computer' ? [icons.computer(), 'æthera'] : [icons.globe(), 'elsewhere'];
      right.innerHTML = `${icon}<span>${label}</span>`;
    },
  };
}
