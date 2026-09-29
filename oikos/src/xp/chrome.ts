/**
 * chrome.ts — the parts every Explorer window has.
 *
 * Menu bar (with the throbber corner holding æthera's mark instead of a
 * flag), the big toolbar, the address bar, the blue task pane and the status
 * bar with its security zone. Builders return elements; windows assemble.
 */

import * as icons from './icons';

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

export function menubar(): HTMLElement {
  const bar = h('div', { class: 'xp-menubar', 'aria-hidden': 'true' });
  for (const m of ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help']) bar.append(h('span', {}, [m]));
  bar.append(h('span', { class: 'xp-throbber', html: icons.markImg(18, true) }));
  return bar;
}

export interface ToolbarHandlers {
  back?: () => void;
  forward?: () => void;
  up?: () => void;
  search?: () => void;
  folders?: () => void;
}

export function toolbar(on: ToolbarHandlers): HTMLElement {
  const bar = h('div', { class: 'xp-toolbar' });
  const btn = (icon: string, label: string, fn: (() => void) | undefined, showLabel = true) => {
    const b = h('button', { class: 'xp-tb', type: 'button', title: label, html: `${icon}${showLabel ? `<span>${label}</span>` : ''}` });
    if (fn) b.addEventListener('click', fn);
    else b.disabled = true;
    bar.append(b);
  };
  btn(icons.back(), 'Back', on.back);
  btn(icons.forward(), 'Forward', on.forward, false);
  btn(icons.up(), 'Up', on.up, false);
  bar.append(h('span', { class: 'xp-tb-sep' }));
  btn(icons.search(), 'Search', on.search);
  btn(icons.folders(), 'Folders', on.folders);
  return bar;
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
      e.stopPropagation();
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
  const head = h('header', { role: 'button', tabindex: '0', 'aria-expanded': 'true' }, [title]);
  const toggle = () => {
    g.classList.toggle('collapsed');
    head.setAttribute('aria-expanded', String(!g.classList.contains('collapsed')));
  };
  head.addEventListener('click', toggle);
  head.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
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
      const [icon, label] = zone === 'computer' ? [icons.computer(), 'My Computer'] : [icons.globe(), 'Internet'];
      right.innerHTML = `${icon}<span>${label}</span>`;
    },
  };
}
