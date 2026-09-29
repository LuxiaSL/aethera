/**
 * taskbar.ts — start, the running windows, the tray.
 *
 * The start menu is the second way in (the VCR is the first): pinned tapes on
 * the left, places on the right, and at the bottom the two buttons everyone
 * remembers. "Turn Off Computer" gets the real dialog: Stand By dims the
 * house and lets the room drift, Turn Off switches the tube off and goes back
 * to the blog, Restart boots it again.
 *
 * The tray keeps two lamps: the network (you are connected to the Wired) and
 * a moon that is lit when the dream is awake.
 */

import type { Site } from '../data';
import { h } from './chrome';
import * as icons from './icons';
import type { Shell } from './shell';
import type { WindowManager } from './wm';

export interface TaskbarHooks {
  standby(on: boolean): void;
  turnOff(): void;
  restart(): void;
}

export class Taskbar {
  readonly el: HTMLElement;
  private menu: HTMLElement;
  private buttons: HTMLElement;
  private clock: HTMLElement;
  private moonEl: HTMLElement;
  private start: HTMLButtonElement;
  private tip: HTMLElement;
  private balloonEl: HTMLElement;
  private balloonTimer = 0;

  constructor(
    private readonly root: HTMLElement,
    private readonly shell: Shell,
    private readonly wm: WindowManager,
    private readonly hooks: TaskbarHooks,
  ) {
    this.el = h('nav', { class: 'xp-taskbar', 'aria-label': 'taskbar' });
    this.start = h('button', { class: 'xp-start', type: 'button', 'aria-haspopup': 'menu', 'aria-expanded': 'false', html: `${icons.markImg(22, false)}<span>start</span>` });
    this.buttons = h('div', { class: 'xp-taskbuttons' });
    const tray = h('div', { class: 'xp-tray' });
    const net = h('span', { class: 'tray-icon net', title: 'Connected to the Wired', html: icons.network() });
    this.moonEl = h('span', { class: 'tray-icon dream', title: 'dreams', html: icons.moon(false) });
    this.clock = h('span', { class: 'clock' });
    tray.append(net, this.moonEl, this.clock);
    this.el.append(this.start, this.buttons, tray);
    root.append(this.el);

    this.menu = this.buildMenu();
    root.append(this.menu);
    this.start.addEventListener('click', () => this.toggleMenu());
    root.addEventListener('pointerdown', (e) => {
      const t = e.target as HTMLElement;
      if (!this.menu.hidden && !t.closest('.xp-startmenu') && !t.closest('.xp-start')) this.toggleMenu(false);
    });
    net.addEventListener('click', () => this.balloon('Connected to the Wired', `${shell.dir.sites.length} screens · 1 VCR · signal: present day, present time`, this.trayAnchor()));

    this.tip = h('div', { class: 'xp-tip', role: 'tooltip', hidden: '' });
    this.balloonEl = h('div', { class: 'xp-balloon', role: 'status', hidden: '' });
    root.append(this.tip, this.balloonEl);

    wm.on(() => this.renderButtons());
    shell.feeds.dreams.on((d) => {
      this.moonEl.innerHTML = icons.moon(d.awake);
      this.moonEl.title = !d.known ? 'dreams: no answer' : d.awake ? `dreams: awake · frame ${d.frame.toLocaleString('en-US')}` : 'dreams: asleep';
    });
    this.tick();
    setInterval(() => this.tick(), 15_000);
  }

  private tick(): void {
    this.clock.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  private trayAnchor(): { x: number; y: number } {
    const r = this.el.getBoundingClientRect();
    return { x: r.right - 60, y: r.top };
  }

  toggleMenu(force?: boolean): void {
    const open = force ?? this.menu.hidden;
    this.menu.hidden = !open;
    this.start.classList.toggle('open', open);
    this.start.setAttribute('aria-expanded', String(open));
    if (open) (this.menu.querySelector('a,button') as HTMLElement | null)?.focus();
  }

  private buildMenu(): HTMLElement {
    const m = h('div', { class: 'xp-startmenu', role: 'menu', hidden: '' });
    const head = h('header');
    head.append(h('span', { class: 'avatar', html: icons.markImg(34) }), h('span', {}, ['guest']));
    m.append(head);

    const cols = h('div', { class: 'cols' });
    const left = h('ul', { class: 'left' });
    const right = h('ul', { class: 'right' });
    const item = (ul: HTMLElement, icon: string, title: string, sub: string | null, run: () => void) => {
      const b = h('button', { type: 'button', role: 'menuitem', html: `${icon}<span><span class="tt"></span>${sub !== null ? '<small></small>' : ''}</span>` });
      (b.querySelector('.tt') as HTMLElement).textContent = title;
      const small = b.querySelector('small');
      if (small && sub) small.textContent = sub;
      b.addEventListener('click', () => {
        this.toggleMenu(false);
        run();
      });
      const li = h('li');
      li.append(b);
      ul.append(li);
    };
    const link = (ul: HTMLElement, icon: string, title: string, href: string) => {
      const a = h('a', { href, role: 'menuitem', html: `${icon}<span></span>` });
      (a.querySelector('span') as HTMLElement).textContent = title;
      const li = h('li');
      li.append(a);
      ul.append(li);
    };
    const sep = (ul: HTMLElement) => ul.append(h('li', { class: 'sep', role: 'separator' }));

    const here = this.shell.dir.sites.filter((s) => s.group === 'here');
    for (const s of here) item(left, icons.tape(s.accent, s.title), s.title, s.kind, () => this.shell.play(s.id));
    sep(left);
    item(left, icons.folderHome(), 'All Tapes', null, () => this.shell.home());

    item(right, icons.folderHome(), 'My Tapes', null, () => this.shell.home());
    const posts = this.shell.dir.posts.slice(0, 4);
    if (posts.length) {
      sep(right);
      for (const p of posts) link(right, icons.textFile('txt'), p.title.length > 26 ? `${p.title.slice(0, 25)}…` : p.title, p.href);
    }
    sep(right);
    const wired = this.shell.dir.sites.filter((s: Site) => s.group === 'wired');
    for (const s of wired) item(right, icons.tape(s.accent), s.title, null, () => this.shell.play(s.id));
    sep(right);
    for (const f of this.shell.dir.files) link(right, icons.textFile(f.title.split('.').pop() ?? 'txt'), f.title, f.href);
    cols.append(left, right);
    m.append(cols);

    const foot = h('div', { class: 'foot' });
    const standby = h('button', { type: 'button', html: `${icons.standby()}<span>Stand By</span>` });
    standby.addEventListener('click', () => {
      this.toggleMenu(false);
      this.hooks.standby(true);
    });
    const off = h('button', { type: 'button', html: `${icons.power()}<span>Turn Off Computer</span>` });
    off.addEventListener('click', () => {
      this.toggleMenu(false);
      this.shutdownDialog();
    });
    foot.append(standby, off);
    m.append(foot);
    return m;
  }

  private shutdownDialog(): void {
    const wrap = h('div', { class: 'xp-shutdown', role: 'dialog', 'aria-label': 'Turn off computer' });
    const panel = h('div', { class: 'panel' });
    panel.append(h('header', { html: `<span>Turn off computer</span>${icons.markImg(28, false)}` }));
    const choices = h('div', { class: 'choices' });
    const choice = (cls: string, icon: string, label: string, run: () => void) => {
      const b = h('button', { type: 'button', class: cls, html: `<i>${icon}</i><span>${label}</span>` });
      b.addEventListener('click', () => {
        wrap.remove();
        run();
      });
      choices.append(b);
    };
    choice('standby', icons.standby(), 'Stand By', () => this.hooks.standby(true));
    choice('off', icons.power(), 'Turn Off', () => this.hooks.turnOff());
    choice('restart', icons.restart(), 'Restart', () => this.hooks.restart());
    panel.append(choices);
    const foot = h('div', { class: 'foot' });
    const cancel = h('button', { class: 'xp-btn', type: 'button' }, ['Cancel']);
    cancel.addEventListener('click', () => wrap.remove());
    foot.append(cancel);
    panel.append(foot);
    wrap.append(panel);
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) wrap.remove();
    });
    this.root.append(wrap);
    (choices.querySelector('.off') as HTMLElement | null)?.focus();
  }

  private renderButtons(): void {
    this.buttons.replaceChildren();
    for (const w of this.wm.list) {
      if (w.opts.dialog) continue;
      const b = h('button', { class: `xp-taskbtn${this.wm.activeWindow === w && !w.minimized ? ' active' : ''}`, type: 'button', html: `${w.opts.icon}<span></span>` });
      (b.querySelector('span') as HTMLElement).textContent = w.opts.title;
      b.title = w.opts.title;
      b.addEventListener('click', () => {
        if (w.minimized) w.restore();
        else if (this.wm.activeWindow === w) w.minimize();
        else w.focus();
      });
      this.buttons.append(b);
    }
  }

  // ---- tooltips and balloons ----

  showTip(site: Site | null, label: { title: string; text: string } | null, x: number, y: number): void {
    const content = site ? { title: site.title, text: site.tagline } : label;
    if (!content) {
      this.tip.hidden = true;
      return;
    }
    this.tip.innerHTML = '<b></b><span></span>';
    (this.tip.querySelector('b') as HTMLElement).textContent = content.title;
    (this.tip.querySelector('span') as HTMLElement).textContent = content.text;
    this.tip.hidden = false;
    const r = this.root.getBoundingClientRect();
    const w = this.tip.offsetWidth;
    this.tip.style.left = `${Math.min(x + 14, r.width - w - 6)}px`;
    this.tip.style.top = `${Math.min(y + 20, r.height - 70)}px`;
  }

  balloon(title: string, text: string, at?: { x: number; y: number }, ms = 7000, below = false): void {
    const b = this.balloonEl;
    b.innerHTML = `<b>${icons.info()}<span></span></b><span class="msg"></span><button class="x" type="button" aria-label="Close">✕</button>`;
    (b.querySelector('b span') as HTMLElement).textContent = title;
    (b.querySelector('.msg') as HTMLElement).textContent = text;
    b.querySelector('.x')?.addEventListener('click', () => (b.hidden = true));
    b.hidden = false;
    const r = this.root.getBoundingClientRect();
    const anchor = at ?? this.trayAnchor();
    const w = b.offsetWidth;
    const hgt = b.offsetHeight;
    const left = Math.max(6, Math.min(anchor.x - 30, r.width - w - 6));
    const above = below ? anchor.y + hgt + 24 > r.height - 30 : anchor.y - hgt - 20 > 0;
    b.classList.toggle('above', above);
    b.classList.toggle('below', !above);
    b.style.left = `${left}px`;
    b.style.top = `${above ? anchor.y - hgt - 18 : anchor.y + 18}px`;
    b.style.setProperty('--tail', `${Math.max(12, Math.min(w - 30, anchor.x - left))}px`);
    clearTimeout(this.balloonTimer);
    this.balloonTimer = window.setTimeout(() => (b.hidden = true), ms);
  }

  hideBalloon(): void {
    this.balloonEl.hidden = true;
  }
}
