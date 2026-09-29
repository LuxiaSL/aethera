/**
 * explorer.ts — ~, the home directory.
 *
 * What the VCR opens: every tape in the house, in Tiles view, grouped the way
 * Explorer grouped a drive ("Files Stored on This Computer"). One click
 * selects a tape and turns the room to its screen; a double click (or Enter,
 * or "Play this tape") puts it in the VCR. The address bar filters.
 */

import type { Site } from '../data';
import { addressBar, h, menubar, statusbar, taskGroup, toolbar, type TaskItem } from './chrome';
import * as icons from './icons';
import type { MenuEntry } from './menu';
import { editMenu, favoritesMenu, helpMenu, siteMenu, toolsMenu, viewMenu } from './menus';
import { zoneOf, type Shell } from './shell';
import type { WindowManager, XPWindow } from './wm';

export class Explorer {
  private win: XPWindow | null = null;
  private selected: string | null = null;
  private tiles = new Map<string, HTMLButtonElement>();
  private tasks: HTMLElement | null = null;
  private status: ReturnType<typeof statusbar> | null = null;
  private content: HTMLElement | null = null;
  private view: 'tiles' | 'icons' | 'list' = 'tiles';

  constructor(
    private readonly shell: Shell,
    private readonly wm: WindowManager,
  ) {}

  get isOpen(): boolean {
    return !!this.win && !this.win.closed;
  }

  open(): void {
    if (this.isOpen && this.win) {
      if (this.win.minimized) this.win.restore();
      else this.win.focus();
      return;
    }
    this.tiles.clear();
    const body = h('div');
    body.style.cssText = 'display:flex;flex-direction:column;min-height:0;flex:1;';
    const { dir } = this.shell;

    const tb = toolbar({
      back: () => this.shell.back(),
      forward: () => this.shell.forward(),
      can: () => ({ back: this.shell.canBack, forward: this.shell.canForward }),
      search: () => address.input?.focus(),
      folders: () => this.tasks?.toggleAttribute('hidden'),
    });
    const address = addressBar(icons.folderHome(), '~/æthera', true, (v) => this.go(v));
    address.input?.addEventListener('input', () => this.filter(address.input?.value ?? ''));
    this.status = statusbar();
    const sel = () => (this.selected ? this.shell.site(this.selected) ?? null : null);
    body.append(
      menubar({
        File: () => this.fileMenu(),
        Edit: () => editMenu(this.shell, sel()),
        View: () =>
          viewMenu(this.shell, {
            toolbar: tb.el,
            address: address.el,
            status: this.status?.el ?? h('div'),
            views: this.viewItems(),
            refresh: () => {
              if (address.input) address.input.value = '~/æthera';
              this.filter('');
            },
          }),
        Favorites: () => favoritesMenu(this.shell),
        Tools: () => toolsMenu(),
        Help: () => helpMenu(this.shell),
      }),
      tb.el,
      address.el,
    );
    const offNav = this.shell.onNav(() => tb.refresh());

    const main = h('div', { class: 'xp-body' });
    this.tasks = h('aside', { class: 'xp-tasks' });
    main.append(this.tasks);

    const content = h('div', { class: `xp-content view-${this.view}`, role: 'listbox', 'aria-label': 'tapes' });
    this.content = content;
    // a click on the folder's blank space clears the selection (the camera stays put)
    content.addEventListener('pointerdown', (e) => {
      if (e.button === 0 && !(e.target as HTMLElement).closest('.xp-tile')) this.select(null);
    });
    const group = (title: string, sites: Site[]) => {
      if (!sites.length) return;
      content.append(h('h3', { class: 'xp-group-head' }, [title]));
      const grid = h('div', { class: 'xp-tiles' });
      for (const s of sites) grid.append(this.tile(s));
      content.append(grid);
    };
    group('Tapes Stored on This Server', dir.sites.filter((s) => s.group === 'here'));
    group('Other Places on the Wired', dir.sites.filter((s) => s.group === 'wired'));
    if (dir.files.length) {
      content.append(h('h3', { class: 'xp-group-head' }, ['Files']));
      const grid = h('div', { class: 'xp-tiles' });
      for (const f of dir.files) {
        const ext = f.title.split('.').pop() ?? 'txt';
        const a = h('a', { class: 'xp-tile', href: f.href, html: `${icons.textFile(ext)}<span><span class="t"></span><span class="k"></span></span>` });
        (a.querySelector('.t') as HTMLElement).textContent = f.title;
        (a.querySelector('.k') as HTMLElement).textContent = f.about;
        grid.append(a);
      }
      content.append(grid);
    }
    main.append(content);
    body.append(main);

    body.append(this.status.el);

    this.win = this.wm.open({
      id: 'home',
      title: '~  (home directory)',
      icon: icons.folderHome(),
      body,
      width: Math.round(Math.min(680, Math.max(420, innerWidth * 0.46))),
      dock: 'left',
      onClose: () => {
        offNav();
        this.win = null;
        this.content = null;
        this.selected = null;
      },
    });
    this.win.el.style.height = 'min(560px, calc(100% - 40px))';
    this.renderTasks();
    this.renderStatus();
  }

  close(): void {
    this.win?.close();
  }

  private fileMenu(): MenuEntry[] {
    const sel = this.selected ? this.shell.site(this.selected) : undefined;
    const items: MenuEntry[] = sel ? siteMenu(this.shell, sel) : [{ label: 'Play', bold: true, disabled: true }];
    return [
      ...items,
      'sep',
      { label: 'New', disabled: true, submenu: () => [] },
      'sep',
      { label: 'Create Shortcut', disabled: true },
      { label: 'Delete', disabled: true },
      { label: 'Rename', disabled: true },
      'sep',
      { label: 'Close', run: () => this.close() },
    ];
  }

  private viewItems(): MenuEntry[] {
    const set = (v: 'tiles' | 'icons' | 'list') => () => {
      this.view = v;
      if (this.content) this.content.className = `xp-content view-${v}`;
    };
    return [
      { label: 'Tiles', checked: this.view === 'tiles', run: set('tiles') },
      { label: 'Icons', checked: this.view === 'icons', run: set('icons') },
      { label: 'List', checked: this.view === 'list', run: set('list') },
    ];
  }

  /** a tile's right-click menu (main.ts routes contextmenu here) */
  contextFor(id: string): MenuEntry[] | null {
    const site = this.shell.site(id);
    if (!site) return null;
    this.select(id, true);
    return siteMenu(this.shell, site);
  }

  /** right-click on the folder's blank space: the view, as in XP */
  blankMenu(): MenuEntry[] {
    return [
      { label: 'View', submenu: () => this.viewItems() },
      { label: 'Arrange Icons By', disabled: true, submenu: () => [] },
      'sep',
      { label: 'Refresh', run: () => this.filter('') },
      'sep',
      { label: 'Paste', disabled: true },
      { label: 'Paste Shortcut', disabled: true },
      'sep',
      { label: 'New', disabled: true, submenu: () => [] },
      'sep',
      { label: 'Properties', disabled: true },
    ];
  }

  private tile(site: Site): HTMLButtonElement {
    const b = h('button', {
      class: 'xp-tile',
      type: 'button',
      role: 'option',
      'data-id': site.id,
      html: `${icons.tape(site.accent, site.title)}<span><span class="t"></span><span class="k"></span><span class="d"></span></span>`,
    });
    (b.querySelector('.t') as HTMLElement).textContent = site.title;
    (b.querySelector('.k') as HTMLElement).textContent = site.kind;
    (b.querySelector('.d') as HTMLElement).textContent = site.tagline;
    b.title = site.tagline;
    b.addEventListener('click', () => this.select(site.id, true));
    b.addEventListener('dblclick', () => this.shell.play(site.id));
    b.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.shell.play(site.id);
      if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        const order = [...this.tiles.values()].filter((t) => !t.hidden);
        const i = order.indexOf(b);
        const next = order[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + order.length) % order.length];
        next?.focus();
        if (next?.dataset.id) this.select(next.dataset.id, true);
      }
    });
    // touch has no double click: a second tap on the selected tape plays it
    b.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch' && this.selected === site.id && b.dataset.armed) this.shell.play(site.id);
      b.dataset.armed = '1';
    });
    this.tiles.set(site.id, b);
    return b;
  }

  /** selection, from a click here or from the room */
  select(id: string | null, fromHere = false): void {
    if (id === this.selected) return;
    this.selected = id;
    for (const [tid, t] of this.tiles) {
      t.classList.toggle('selected', tid === id);
      t.setAttribute('aria-selected', String(tid === id));
      if (tid !== id) delete t.dataset.armed;
    }
    if (fromHere) this.shell.select(id);
    this.renderTasks();
    this.renderStatus();
  }

  private filter(q: string): void {
    const needle = q.replace(/^~\/?(æthera)?\/?/i, '').trim().toLowerCase();
    for (const [id, t] of this.tiles) {
      const s = this.shell.site(id);
      t.hidden = !!needle && !`${s?.title} ${s?.kind} ${s?.tagline}`.toLowerCase().includes(needle);
    }
  }

  private go(v: string): void {
    const needle = v.replace(/^~\/?(æthera)?\/?/i, '').trim().toLowerCase();
    if (!needle) return;
    const hit = this.shell.dir.sites.find((s) => s.title.toLowerCase() === needle) ??
      this.shell.dir.sites.find((s) => `${s.title} ${s.kind} ${s.tagline}`.toLowerCase().includes(needle));
    if (hit) this.shell.play(hit.id);
    else this.shell.balloon('Cannot find it', `There is no tape called “${v}” in ~.`);
  }

  private renderTasks(): void {
    if (!this.tasks) return;
    const sel = this.selected ? this.shell.site(this.selected) : undefined;
    const tapeTasks: TaskItem[] = sel
      ? [
          { icon: icons.play(), label: 'Play this tape', run: () => this.shell.play(sel.id) },
          { icon: icons.look(), label: 'Look at its screen', run: () => this.shell.look(sel.id) },
          { icon: icons.globe(), label: `Go to ${sel.title}`, run: () => this.shell.open(sel) },
        ]
      : [
          { icon: icons.play(), label: 'Select a tape to play it' },
          { icon: icons.eject(), label: 'Eject the tape', run: () => this.shell.eject() },
        ];
    const places: TaskItem[] = [
      { icon: icons.computer(), label: 'æthera', href: '/' },
      { icon: icons.textFile('xml'), label: 'feed.xml', href: '/feed.xml' },
      { icon: icons.textFile('txt'), label: 'llms.txt', href: '/llms.txt' },
    ];
    const details = h('div', { class: 'xp-details' });
    if (sel) {
      details.append(h('b', {}, [sel.title]));
      const dl = h('dl');
      for (const [k, v] of sel.details) dl.append(h('dt', {}, [k]), h('dd', {}, [v]));
      details.append(dl);
    } else {
      const here = this.shell.dir.sites.filter((s) => s.group === 'here').length;
      details.append(h('b', {}, ['~']), h('span', {}, [`home directory · ${here} tapes here, ${this.shell.dir.sites.length - here} elsewhere on the Wired`]));
    }
    this.tasks.replaceChildren(
      taskGroup(sel ? 'Tape Tasks' : 'System Tasks', tapeTasks, true),
      taskGroup('Other Places', places),
      taskGroup('Details', details),
    );
  }

  private renderStatus(): void {
    const sel = this.selected ? this.shell.site(this.selected) : undefined;
    const count = this.shell.dir.sites.length + this.shell.dir.files.length;
    this.status?.set(sel ? `${sel.title} — ${sel.tagline}` : `${count} objects`, sel ? zoneOf(sel) : 'computer');
  }
}
