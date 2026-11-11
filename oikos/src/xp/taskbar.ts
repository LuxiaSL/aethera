/**
 * taskbar.ts — start, the running windows, the tray.
 *
 * The start menu is the second way in (the VCR is the first), laid out as
 * XP's was: pinned tapes (bold, with a subtitle) at the top of the white
 * column and the rest below them plain, "All Programs ▸" cascading every tape
 * at its foot; the "My …" places bold at the top of the blue column; and at
 * the bottom Log Off and Turn Off Computer. "Turn Off Computer" gets the real
 * dialog: Stand By dims the house and lets the room drift, Turn Off switches
 * the tube off and goes back to the blog, Restart boots it again. Log Off
 * clears the desk and ejects the tape.
 *
 * The tray keeps two lamps: the network (you are connected to the Wired) and
 * a moon that is lit when the dream is awake.
 */

import type { Site } from '../data';
import { h } from './chrome';
import * as icons from './icons';
import { viaKeyboard } from './env';
import { closeMenus, menuOpen, openCascade, openMenu, type MenuEntry } from './menu';
import type { Shell } from './shell';
import type { WindowManager, XPWindow } from './wm';

export interface TaskbarHooks {
  standby(on: boolean): void;
  turnOff(): void;
  restart(): void;
  logOff(): void;
}

/** how many tapes are pinned (bold, with a subtitle) above the plain list */
const PINNED = 2;

export class Taskbar {
  readonly el: HTMLElement;
  private menu: HTMLElement;
  private buttons: HTMLElement;
  /** one button per window, kept and updated in place (so a focused one keeps focus) */
  private btns = new Map<XPWindow, HTMLButtonElement>();
  /** » at the end of the buttons when they no longer fit: every window, as a menu */
  private more: HTMLButtonElement;
  /** what Show the Desktop folded away, to unfold on its second use */
  private shown: { windows: XPWindow[]; active: XPWindow | null } | null = null;
  private clock: HTMLElement;
  private moonEl: HTMLElement;
  private start: HTMLButtonElement;
  private tip: HTMLElement;
  private balloonEl: HTMLElement;
  private balloonTimer = 0;
  private dialogEl: HTMLElement | null = null;

  constructor(
    private readonly root: HTMLElement,
    private readonly shell: Shell,
    private readonly wm: WindowManager,
    private readonly hooks: TaskbarHooks,
  ) {
    this.el = h('nav', { class: 'xp-taskbar', 'aria-label': 'taskbar' });
    // the start button is the system's own letter; its name is for whoever can't see it
    this.start = h('button', { class: 'xp-start', type: 'button', 'aria-label': 'æthera', 'aria-haspopup': 'menu', 'aria-expanded': 'false', html: '<span aria-hidden="true">æ</span>' });
    this.buttons = h('div', { class: 'xp-taskbuttons', role: 'group', 'aria-label': 'windows' });
    this.more = h('button', { class: 'xp-taskbtn xp-taskmore', type: 'button', 'aria-label': 'More windows', title: 'More windows', 'aria-haspopup': 'menu', hidden: '' }, ['»']);
    this.more.addEventListener('click', () => {
      const r = this.more.getBoundingClientRect();
      openMenu(this.windowsMenu(), r.left, r.top - 4, { returnTo: this.more, owner: this.more });
    });
    const tray = h('div', { class: 'xp-tray' });
    const net = h('span', { class: 'tray-icon net', title: 'Connected to the Wired', html: icons.network() });
    this.moonEl = h('span', { class: 'tray-icon dream', title: 'dreams', html: icons.moon(false) });
    this.clock = h('span', { class: 'clock' });
    tray.append(net, this.moonEl, this.clock);
    this.el.append(this.start, this.buttons, this.more, tray);
    root.append(this.el);

    this.menu = this.buildMenu();
    root.append(this.menu);
    this.start.addEventListener('click', () => this.toggleMenu());
    // the taskbar is one row: ← and → walk start and the window buttons
    this.el.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const t = e.target as HTMLElement;
      if (!t.closest('.xp-start, .xp-taskbtn')) return;
      e.preventDefault();
      e.stopPropagation();
      const row = [this.start, ...this.btns.values(), ...(this.more.hidden ? [] : [this.more])];
      const i = row.indexOf(t as HTMLButtonElement);
      row[(i + (e.key === 'ArrowRight' ? 1 : -1) + row.length) % row.length]?.focus();
    });
    root.addEventListener('pointerdown', (e) => {
      const t = e.target as HTMLElement;
      // a cascade (All Programs) is a .xp-menu outside the start menu's box but part of it
      if (!this.menu.hidden && !t.closest('.xp-startmenu') && !t.closest('.xp-start') && !t.closest('.xp-menu')) this.toggleMenu(false);
    });
    // the taskbar's own right-click menu (a button's is its window's system menu)
    this.el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const btn = (e.target as HTMLElement).closest('.xp-taskbtn') as HTMLElement | null;
      const w = btn ? this.wm.list.find((x) => x.opts.id === btn.dataset.win) : undefined;
      // a window's menu goes with its window (closing it from here closes the menu)
      openMenu(w ? w.systemMenu() : this.barMenu(), e.clientX, e.clientY, { owner: w?.el ?? null, returnTo: btn });
    });
    net.addEventListener('click', () => this.balloon('Connected to the Wired', `${shell.dir.sites.length} places`, this.trayAnchor()));

    this.tip = h('div', { class: 'xp-tip', role: 'tooltip', hidden: '' });
    this.balloonEl = h('div', { class: 'xp-balloon', role: 'status', hidden: '' });
    root.append(this.tip, this.balloonEl);

    wm.on(() => this.renderButtons());
    addEventListener('resize', () => this.fitButtons());
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

  get startOpen(): boolean {
    return !this.menu.hidden;
  }

  /**
   * Open or close the start menu. Opening focuses its first item; closing it
   * with `refocus` (Esc) gives the keyboard back to the start button.
   */
  toggleMenu(force?: boolean, refocus = false): void {
    const open = force ?? this.menu.hidden;
    if (!open) closeMenus(); // and any cascade hanging off it
    this.menu.hidden = !open;
    this.start.classList.toggle('open', open);
    this.start.setAttribute('aria-expanded', String(open));
    if (open) (this.menu.querySelector('a,button') as HTMLElement | null)?.focus();
    else if (refocus) this.start.focus({ preventScroll: true });
  }

  private barMenu(): MenuEntry[] {
    return [
      { label: 'Toolbars', disabled: true, submenu: () => [] },
      'sep',
      { label: 'Cascade Windows', disabled: true },
      { label: 'Tile Windows Horizontally', disabled: true },
      { label: 'Tile Windows Vertically', disabled: true },
      { label: 'Show the Desktop', run: () => this.showDesktop(), disabled: !this.wm.list.some((w) => !w.minimized && !w.opts.dialog) && !this.shown },
      'sep',
      { label: 'Task Manager', disabled: true },
      'sep',
      { label: 'Lock the Taskbar', checked: true, disabled: true },
      { label: 'Properties', disabled: true },
    ];
  }

  /**
   * Show the Desktop folds every window away; used again (with nothing put
   * back meanwhile) it unfolds exactly those, in their order, as XP's did.
   */
  showDesktop(): void {
    const visible = this.wm.list.filter((w) => !w.opts.dialog && !w.minimized);
    if (!visible.length && this.shown) {
      const { windows, active } = this.shown;
      this.shown = null;
      for (const w of windows) if (!w.closed && w.minimized) w.restore();
      if (active && !active.closed && !active.minimized) active.focus();
      return;
    }
    const z = (w: XPWindow) => Number(w.el.style.zIndex) || 0;
    const shown = { windows: [...visible].sort((a, b) => z(a) - z(b)), active: this.wm.activeWindow };
    for (const w of visible) w.minimize();
    // after folding: each minimise above re-renders the buttons, which spends any undo
    this.shown = shown;
  }

  /** the » menu: every window, the active one checked */
  private windowsMenu(): MenuEntry[] {
    return this.wm.list
      .filter((w) => !w.opts.dialog)
      .map((w): MenuEntry => ({
        label: w.el.getAttribute('aria-label') ?? w.opts.title,
        icon: w.opts.icon,
        checked: this.wm.activeWindow === w && !w.minimized,
        run: () => (w.minimized ? w.restore() : w.focus()),
      }));
  }

  private buildMenu(): HTMLElement {
    const m = h('div', { class: 'xp-startmenu', role: 'menu', 'aria-label': 'Start', hidden: '' });
    // who's logged in: a picture and a name, nothing to choose
    const head = h('header', { 'aria-hidden': 'true' });
    head.append(h('span', { class: 'avatar', html: icons.markImg(40) }), h('span', {}, ['guest']));
    m.append(head, h('div', { class: 'orange', 'aria-hidden': 'true' }));

    // a menu's children must be items, groups or separators: the columns are
    // groups, and the list markup under them is only layout (role=none)
    const cols = h('div', { class: 'cols', role: 'none' });
    const left = h('ul', { class: 'left', role: 'group', 'aria-label': 'Programs' });
    const right = h('ul', { class: 'right', role: 'group', 'aria-label': 'Places' });
    const li = (ul: HTMLElement, el: HTMLElement) => {
      const l = h('li', { role: 'none' });
      l.append(el);
      ul.append(l);
      return el;
    };
    const item = (ul: HTMLElement, icon: string, title: string, sub: string | null, run: () => void, cls = '') => {
      const b = h('button', { type: 'button', role: 'menuitem', class: cls, html: `${icon}<span><span class="tt"></span>${sub !== null ? '<small></small>' : ''}</span>` });
      (b.querySelector('.tt') as HTMLElement).textContent = title;
      const small = b.querySelector('small');
      if (small && sub) small.textContent = sub;
      b.addEventListener('click', () => {
        this.toggleMenu(false);
        run();
      });
      return li(ul, b);
    };
    const link = (ul: HTMLElement, icon: string, title: string, href: string) => {
      const a = h('a', { href, role: 'menuitem', html: `${icon}<span></span>` });
      (a.querySelector('span') as HTMLElement).textContent = title;
      li(ul, a);
    };
    // a start-menu item that cascades, XP-style: hover (or click) opens it beside
    const cascade = (ul: HTMLElement, icon: string, title: string, cls: string, entries: () => MenuEntry[]) => {
      const b = h('button', { type: 'button', role: 'menuitem', class: `cascade ${cls}`, 'aria-haspopup': 'menu', 'aria-expanded': 'false', 'data-menu-owner': '', html: `${icon}<span class="tt"></span><i class="arrow"></i>` });
      (b.querySelector('.tt') as HTMLElement).textContent = title;
      const open = (hover: boolean) => {
        b.classList.add('open');
        b.setAttribute('aria-expanded', 'true');
        openCascade(entries(), b, { onClose: () => close(b), takeFocus: !hover, focusFirst: !hover && viaKeyboard() });
      };
      b.addEventListener('click', () => open(false));
      b.addEventListener('pointerenter', () => open(true));
      return li(ul, b);
    };
    const sep = (ul: HTMLElement) => ul.append(h('li', { class: 'sep', role: 'separator' }));
    const close = (b: HTMLElement) => {
      b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
    };
    // hovering a plain item closes any cascade that's out, as XP's did
    m.addEventListener('pointerover', (e) => {
      const t = (e.target as HTMLElement).closest('li > a, li > button');
      if (t && !t.classList.contains('cascade')) closeMenus();
    });

    const tapeEntry = (s: Site): MenuEntry => ({ label: s.title, icon: icons.tape(s.accent), run: () => { this.toggleMenu(false); this.shell.play(s.id); } });

    // left: pinned (bold, subtitled), then the rest plain, then All Programs
    // the one program on this desk that isn't a tape: pinned above them, as XP pinned the browser
    item(left, icons.chat(), 'mIRC', '#aethera', () => this.shell.chat(), 'pinned');
    const here = this.shell.dir.sites.filter((s) => s.group === 'here');
    here.slice(0, PINNED).forEach((s) => item(left, icons.tape(s.accent, s.title), s.title, s.kind, () => this.shell.play(s.id), 'pinned'));
    sep(left);
    here.slice(PINNED).forEach((s) => item(left, icons.tape(s.accent, s.title), s.title, null, () => this.shell.play(s.id)));
    const all = h('li', { class: 'allprog', role: 'none' });
    left.append(h('li', { class: 'sep', role: 'separator' }), all);
    const allBtn = h('button', { type: 'button', role: 'menuitem', class: 'cascade', 'aria-haspopup': 'menu', 'aria-expanded': 'false', 'data-menu-owner': '', html: `<span class="tt">all places</span>${icons.allPrograms()}` });
    const openAll = (hover: boolean) => {
      allBtn.classList.add('open');
      allBtn.setAttribute('aria-expanded', 'true');
      openCascade(
        [
          ...this.shell.dir.sites.filter((s) => s.group === 'here').map(tapeEntry),
          'sep',
          ...this.shell.dir.sites.filter((s) => s.group === 'wired').map(tapeEntry),
          'sep',
          { label: '~ (home directory)', icon: icons.folderHome(), run: () => { this.toggleMenu(false); this.shell.home(); } },
        ],
        allBtn,
        { onClose: () => close(allBtn), takeFocus: !hover, focusFirst: !hover && viaKeyboard() },
      );
    };
    allBtn.addEventListener('click', () => openAll(false));
    allBtn.addEventListener('pointerenter', () => openAll(true));
    all.append(allBtn);

    // right: the "My …" places bold, then everything else in plain weight
    item(right, icons.folderHome(), '~', null, () => this.shell.home(), 'strong');
    const posts = this.shell.dir.posts.slice(0, 8);
    if (posts.length) {
      cascade(right, icons.textFile('txt'), 'recent transmissions', 'strong', () =>
        posts.map((p): MenuEntry => ({ label: p.title, icon: icons.textFile('txt'), run: () => location.assign(p.href) })),
      );
    }
    sep(right);
    const wired = this.shell.dir.sites.filter((s: Site) => s.group === 'wired');
    for (const s of wired) item(right, icons.tape(s.accent), s.title, null, () => this.shell.play(s.id));
    sep(right);
    for (const f of this.shell.dir.files) link(right, icons.textFile(f.title.split('.').pop() ?? 'txt'), f.title, f.href);
    cols.append(left, right);
    m.append(cols);

    const foot = h('div', { class: 'foot', role: 'group', 'aria-label': 'Session' });
    const logoff = h('button', { type: 'button', role: 'menuitem', html: `${icons.logoff()}<span>Log Off</span>` });
    logoff.addEventListener('click', () => {
      this.toggleMenu(false);
      this.logOffDialog();
    });
    const off = h('button', { type: 'button', role: 'menuitem', html: `${icons.power()}<span>Turn Off</span>` });
    off.addEventListener('click', () => {
      this.toggleMenu(false);
      this.shutdownDialog();
    });
    foot.append(logoff, off);
    m.append(foot);
    m.addEventListener('keydown', (e) => this.startKeys(e, [left, right, foot]));
    return m;
  }

  /**
   * The start menu from the keyboard: ↑ ↓ (Home, End) within a column, ← →
   * between the columns, → (or Enter) into a cascade, Esc out to the start
   * button. Enter and Space on an item are the button's own.
   */
  private startKeys(e: KeyboardEvent, cols: HTMLElement[]): void {
    const itemsOf = (col: HTMLElement) => [...col.querySelectorAll<HTMLElement>(':scope > li > a, :scope > li > button, :scope > button')];
    const a = document.activeElement as HTMLElement | null;
    const c = cols.findIndex((col) => !!a && col.contains(a));
    const stop = () => {
      e.preventDefault();
      e.stopPropagation();
    };
    if (e.key === 'Escape') {
      stop();
      if (menuOpen()) closeMenus();
      else this.toggleMenu(false, true);
      return;
    }
    if (e.key === 'Tab') {
      // Tab goes round the start menu, not out under it
      stop();
      const all = cols.flatMap(itemsOf);
      const i = all.indexOf(a as HTMLElement);
      all[(i + (e.shiftKey ? -1 : 1) + all.length) % all.length]?.focus();
      return;
    }
    if (c < 0 || !a) return;
    const col = cols[c] as HTMLElement;
    const items = itemsOf(col);
    const i = items.indexOf(a);
    const foot = c === cols.length - 1;
    const vertical = foot ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
    if (vertical.includes(e.key) || e.key === 'Home' || e.key === 'End') {
      stop();
      const n = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (i + (e.key === vertical[1] ? 1 : -1) + items.length) % items.length;
      items[n]?.focus();
    } else if (e.key === 'ArrowRight' && a.classList.contains('cascade')) {
      stop();
      a.click();
    } else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !foot) {
      // across to the other column, about level with where we were
      stop();
      const other = itemsOf(cols[c === 0 ? 1 : 0] as HTMLElement);
      const at = a.getBoundingClientRect().top;
      const near = other.reduce<HTMLElement | null>((best, el) => (!best || Math.abs(el.getBoundingClientRect().top - at) < Math.abs(best.getBoundingClientRect().top - at) ? el : best), null);
      near?.focus();
    } else if (e.key === 'ArrowDown' && foot) {
      stop();
    } else if (e.key === 'ArrowUp' && foot) {
      stop();
      itemsOf(cols[0] as HTMLElement).at(-1)?.focus();
    }
  }

  /** Esc: close the Turn Off / Log Off dialog if one is up. True when there was one. */
  dismiss(): boolean {
    if (!this.dialogEl) return false;
    this.dialogEl.remove();
    this.dialogEl = null;
    this.start.focus();
    return true;
  }

  get dialogUp(): boolean {
    return !!this.dialogEl;
  }

  /**
   * The full-screen XP dialog (greyed desktop behind, a blue panel, big
   * square choices). Modal: nothing behind it takes a click, and only a
   * choice, Cancel or Esc closes it.
   */
  private bigDialog(title: string, choices: { cls: string; icon: string; label: string; run?: () => void }[]): void {
    this.dialogEl?.remove();
    const wrap = h('div', { class: 'xp-shutdown', role: 'dialog', 'aria-modal': 'true', 'aria-label': title });
    this.dialogEl = wrap;
    const panel = h('div', { class: 'panel' });
    panel.append(h('header', { html: `<span></span>${icons.markImg(28, false)}` }));
    (panel.querySelector('header span') as HTMLElement).textContent = title;
    const row = h('div', { class: 'choices' });
    for (const c of choices) {
      const b = h('button', { type: 'button', class: c.cls, html: `<i>${c.icon}</i><span>${c.label}</span>` });
      const run = c.run;
      if (!run) b.disabled = true;
      else
        b.addEventListener('click', () => {
          wrap.remove();
          this.dialogEl = null;
          run();
        });
      row.append(b);
    }
    panel.append(row);
    const foot = h('div', { class: 'foot' });
    const cancel = h('button', { class: 'xp-btn', type: 'button' }, ['Cancel']);
    cancel.addEventListener('click', () => this.dismiss());
    foot.append(cancel);
    panel.append(foot);
    wrap.append(panel);
    this.root.append(wrap);
    (row.querySelector('button:not(:disabled):last-of-type, button:not(:disabled)') as HTMLElement | null)?.focus();
  }

  private logOffDialog(): void {
    this.bigDialog('Log Off æthera', [
      // Fast User Switching is off in this house: XP greyed it out just like this
      { cls: 'switch', icon: icons.restart(), label: 'Switch User' },
      { cls: 'logoff', icon: icons.logoff(), label: 'Log Off', run: () => this.hooks.logOff() },
    ]);
  }

  private shutdownDialog(): void {
    this.bigDialog('Turn off æthera', [
      { cls: 'standby', icon: icons.standby(), label: 'Stand By', run: () => this.hooks.standby(true) },
      { cls: 'off', icon: icons.power(), label: 'Turn Off', run: () => this.hooks.turnOff() },
      { cls: 'restart', icon: icons.restart(), label: 'Restart', run: () => this.hooks.restart() },
    ]);
    (this.dialogEl?.querySelector('.off') as HTMLElement | null)?.focus();
  }

  /**
   * Bring the buttons in line with the windows, in place: a new window gets a
   * button at the end, a closed one loses its own, and the rest are only
   * updated. Rebuilding them all on every change (a focus, a drag) threw away
   * the one that had the keyboard.
   */
  private renderButtons(): void {
    const live = this.wm.list.filter((w) => !w.opts.dialog);
    for (const [w, b] of this.btns) {
      if (live.includes(w)) continue;
      b.remove();
      this.btns.delete(w);
    }
    for (const w of live) {
      let b = this.btns.get(w);
      if (!b) {
        b = h('button', { class: 'xp-taskbtn', type: 'button', 'data-win': w.opts.id, html: `${w.opts.icon}<span></span>` });
        b.addEventListener('click', () => {
          if (w.minimized) w.restore();
          else if (this.wm.activeWindow === w) w.minimize();
          else w.focus();
        });
        this.btns.set(w, b);
        this.buttons.append(b);
      }
      const active = this.wm.activeWindow === w && !w.minimized;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
      const span = b.querySelector('span') as HTMLElement;
      // the window's title as it is now (mIRC's changes with the channel)
      const title = w.el.getAttribute('aria-label') ?? w.opts.title;
      if (span.textContent !== title) span.textContent = title;
      b.title = title;
    }
    // a window put back by hand since Show the Desktop: its undo is spent
    if (this.shown && live.some((w) => !w.minimized)) this.shown = null;
    this.fitButtons();
  }

  /** the buttons shrink to their icons; past that, the ones that don't fit wait behind » */
  private fitButtons(): void {
    const box = this.buttons;
    this.more.hidden = true;
    const over = box.scrollWidth > box.clientWidth + 1;
    this.more.hidden = !over;
    if (!over) {
      box.scrollLeft = 0;
      return;
    }
    // keep the active window's button in sight
    const active = [...this.btns.values()].find((b) => b.classList.contains('active'));
    if (!active) return;
    const l = active.offsetLeft - box.offsetLeft;
    if (l < box.scrollLeft) box.scrollLeft = l;
    else if (l + active.offsetWidth > box.scrollLeft + box.clientWidth) box.scrollLeft = l + active.offsetWidth - box.clientWidth;
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
