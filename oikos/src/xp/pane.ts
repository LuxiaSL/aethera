/**
 * pane.ts — one site, in its own window.
 *
 * The preview is the very canvas its screen in the room is painted on, so
 * what you watched in the dark is what you're shown here, only closer. Click
 * it (or Open) to go. The Details group carries whatever the room knows live
 * about the place: whether the dream is awake, whether the channel is up,
 * whose creature it is.
 */

import type { Site } from '../data';
import { addressBar, h, menubar, statusbar, taskGroup, toolbar, type TaskItem } from './chrome';
import * as icons from './icons';
import { copyAddress, editMenu, favoritesMenu, goLabel, helpMenu, siteMenu, viewMenu } from './menus';
import { RELATED, addressOf, zoneOf, type Shell } from './shell';
import type { WindowManager, XPWindow } from './wm';

export class Pane {
  readonly win: XPWindow;
  private statusLine: HTMLElement;
  private timer = 0;

  constructor(
    private readonly site: Site,
    private readonly shell: Shell,
    wm: WindowManager,
    onClose: () => void,
  ) {
    const body = h('div');
    body.style.cssText = 'display:flex;flex-direction:column;min-height:0;flex:1;';
    const tb = toolbar({
      back: () => this.shell.back(),
      forward: () => this.shell.forward(),
      can: () => ({ back: this.shell.canBack, forward: this.shell.canForward }),
      up: () => this.shell.home(),
      folders: () => tasks.toggleAttribute('hidden'),
    });
    const addr = addressOf(site);
    const address = addressBar(icons.tape(site.accent), addr, false, () => this.shell.open(site)).el;
    const status = statusbar();
    body.append(
      menubar({
        File: () => [...siteMenu(this.shell, site, true), 'sep', { label: 'Close', run: () => this.win.close() }],
        Edit: () => editMenu(this.shell, site),
        View: () =>
          viewMenu(this.shell, {
            toolbar: tb.el,
            address,
            status: status.el,
            up: () => this.shell.home(),
            refresh: () => this.refresh(),
          }),
        Favorites: () => favoritesMenu(this.shell),
        Help: () => helpMenu(this.shell),
      }),
      tb.el,
      address,
    );
    const offNav = this.shell.onNav(() => tb.refresh());

    const main = h('div', { class: 'xp-body' });
    const tasks = h('aside', { class: 'xp-tasks' });
    main.append(tasks);
    const content = h('div', { class: 'xp-content' });
    main.append(content);
    body.append(main);
    status.set('Done', zoneOf(site));
    body.append(status.el);

    // ---- content ----
    const hero = h('div', { class: 'xp-hero', html: icons.tape(site.accent, site.title) });
    const text = h('div');
    text.append(h('h2', {}, [site.title]), h('p', {}, [site.tagline]));
    hero.append(text);
    content.append(hero);

    const preview = h('button', { class: 'xp-preview', type: 'button', 'aria-label': goLabel(site) });
    const screen = this.shell.screens.get(site.id);
    if (screen) preview.append(screen.canvas);
    preview.addEventListener('click', (e) => this.shell.open(site, e));
    content.append(preview);

    content.append(h('p', { class: 'xp-about' }, [site.about]));
    const note = this.note();
    if (note) content.append(h('div', { class: 'xp-note' }, [note]));

    const actions = h('div', { class: 'xp-actions' });
    const openBtn = h('button', { class: 'xp-btn default', type: 'button' }, [goLabel(site)]);
    openBtn.addEventListener('click', (e) => this.shell.open(site, e));
    actions.append(openBtn);
    if (site.tune && this.shell.canTune) {
      const tune = h('button', { class: 'xp-btn', type: 'button' }, ['Tune In']);
      tune.addEventListener('click', () => this.shell.tuneIn(site.id));
      actions.append(tune);
    }
    if (site.id === 'irc') {
      const join = h('button', { class: 'xp-btn', type: 'button' }, ['Join #aethera']);
      join.addEventListener('click', () => this.shell.chat('#aethera'));
      actions.append(join);
    }
    content.append(actions);

    // ---- tasks ----
    const tapeTasks: TaskItem[] = [
      { icon: icons.globe(), label: goLabel(site), run: () => this.shell.open(site) },
      { icon: icons.look(), label: 'Show in Room', run: () => this.shell.look(site.id) },
    ];
    if (site.tune && this.shell.canTune) {
      tapeTasks.splice(1, 0, { icon: icons.tv(), label: 'Tune In', run: () => this.shell.tuneIn(site.id) });
    }
    if (site.id === 'irc') tapeTasks.splice(1, 0, { icon: icons.chat('channel'), label: 'Join #aethera', run: () => this.shell.chat('#aethera') });
    tapeTasks.push({ icon: icons.copy(), label: 'Copy Address', run: () => copyAddress(this.shell, site) });

    const places: TaskItem[] = [{ icon: icons.folderHome(), label: '~', run: () => this.shell.home() }];
    for (const rid of RELATED[site.id] ?? []) {
      const r = this.shell.site(rid);
      if (r) places.push({ icon: icons.tape(r.accent), label: r.title, run: () => this.shell.play(r.id) });
    }

    const details = h('div', { class: 'xp-details' });
    details.append(h('b', {}, [site.title]));
    const dl = h('dl');
    for (const [k, v] of site.details) dl.append(h('dt', {}, [k]), h('dd', {}, [v]));
    details.append(dl);
    this.statusLine = h('div', { class: 'status' });
    details.append(this.statusLine);

    tasks.append(taskGroup('tasks', tapeTasks, true), taskGroup('places', places), taskGroup('details', details));

    this.win = wm.open({
      id: `site:${site.id}`,
      title: `${site.title} — ${addr.replace(/^https?:\/\//, '')}`,
      icon: icons.tape(site.accent),
      body,
      // leave the room at least half the page, beside it
      width: Math.round(Math.min(760, Math.max(440, innerWidth * 0.5))),
      dock: 'right',
      onClose: () => {
        offNav();
        clearInterval(this.timer);
        screen?.canvas.remove();
        onClose();
      },
    });
    this.win.el.style.height = 'min(640px, calc(100% - 24px))';
    this.refresh();
    this.timer = window.setInterval(() => this.refresh(), 2000);
  }

  private note(): string | null {
    const s = this.site;
    if (s.id === 'dreams') return 'Going in wakes the dreamer; it sleeps again when everyone leaves. The frame here is the last one the chronicle kept.';
    if (s.id === 'syrinx') return 'It sings once woken. Yours lives in this browser alone.';
    if (s.id === 'afterlife') return 'It plays once woken. Yours lives in this browser alone.';
    return null;
  }

  private refresh(): void {
    const { feeds } = this.shell;
    let on = false;
    let text = '';
    switch (this.site.id) {
      case 'dreams':
      case 'dreams-api': {
        const d = feeds.dreams.value;
        on = d.known && d.awake;
        text = !d.known ? 'no answer' : d.awake ? `awake · frame ${d.frame.toLocaleString('en-US')}${d.viewers ? ` · ${d.viewers} watching` : ''}` : 'asleep';
        break;
      }
      case 'chronicle': {
        const c = feeds.chronicle.value;
        on = c.known && c.eras.some((e) => e.open);
        text = c.known ? `${c.eraCount || c.eras.length} eras recorded` : 'reading the core…';
        break;
      }
      case 'irc': {
        const i = feeds.irc.value;
        on = i.connected;
        text = i.connected ? 'live on #aethera' : 'connecting…';
        break;
      }
      case 'syrinx': {
        const c = feeds.creature.value;
        on = !!c;
        text = c ? `yours: ${c.name}` : 'not woken in this browser';
        break;
      }
      case 'afterlife': {
        const u = feeds.universe.value;
        on = !!u;
        text = u ? `yours: generation ${u.generation.toLocaleString('en-US')}` : 'no universe in this browser yet';
        break;
      }
      default:
        return;
    }
    this.statusLine.className = `status${on ? ' on' : ''}`;
    this.statusLine.innerHTML = `<i></i><span></span>`;
    const span = this.statusLine.querySelector('span');
    if (span) span.textContent = text;
  }
}
