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
    body.append(menubar());
    body.append(
      toolbar({
        back: () => this.shell.home(),
        up: () => this.shell.home(),
        folders: () => tasks.toggleAttribute('hidden'),
      }),
    );
    const addr = addressOf(site);
    body.append(addressBar(icons.tape(site.accent), addr, false, () => this.shell.open(site)).el);

    const main = h('div', { class: 'xp-body' });
    const tasks = h('aside', { class: 'xp-tasks' });
    main.append(tasks);
    const content = h('div', { class: 'xp-content' });
    main.append(content);
    body.append(main);
    const status = statusbar();
    status.set(site.href ? 'Done' : 'This place is on a private network', zoneOf(site));
    body.append(status.el);

    // ---- content ----
    const hero = h('div', { class: 'xp-hero', html: icons.tape(site.accent, site.title) });
    const text = h('div');
    text.append(h('h2', {}, [site.title]), h('p', {}, [site.tagline]));
    hero.append(text);
    content.append(hero);

    const preview = h('button', { class: 'xp-preview', type: 'button', 'aria-label': site.href ? `Open ${site.title}` : `${site.title} (private)` });
    const screen = this.shell.screens.get(site.id);
    if (screen) preview.append(screen.canvas);
    preview.append(h('span', { class: 'xp-play' }, [site.href ? `▶  open ${site.title}` : '🔒  private network']));
    preview.addEventListener('click', (e) => this.shell.open(site, e));
    content.append(preview);

    content.append(h('p', { class: 'xp-about' }, [site.about]));
    const note = this.note();
    if (note) content.append(h('div', { class: 'xp-note' }, [note]));

    const actions = h('div', { class: 'xp-actions' });
    const openBtn = h('button', { class: 'xp-btn default', type: 'button' }, [site.href ? `Open ${site.title}` : 'Restricted']);
    if (!site.href) openBtn.disabled = true;
    openBtn.addEventListener('click', (e) => this.shell.open(site, e));
    const homeBtn = h('button', { class: 'xp-btn', type: 'button' }, ['~ Home directory']);
    homeBtn.addEventListener('click', () => this.shell.home());
    actions.append(openBtn, homeBtn);
    content.append(actions);

    // ---- tasks ----
    const tapeTasks: TaskItem[] = [
      site.href
        ? { icon: icons.play(), label: `Open ${site.title}`, run: () => this.shell.open(site) }
        : { icon: icons.lock(), label: 'Restricted: private network' },
      { icon: icons.look(), label: 'Look at its screen', run: () => this.shell.look(site.id) },
    ];
    if (site.href) {
      tapeTasks.push({
        icon: icons.copy(),
        label: 'Copy address',
        run: () => {
          void navigator.clipboard?.writeText(addr).then(
            () => this.shell.balloon('Copied', addr),
            () => this.shell.balloon('Could not copy', addr),
          );
        },
      });
    }
    tapeTasks.push({ icon: icons.eject(), label: 'Eject tape', run: () => this.win.close() });

    const places: TaskItem[] = [{ icon: icons.folderHome(), label: '~ (home directory)', run: () => this.shell.home() }];
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

    tasks.append(taskGroup('Tape Tasks', tapeTasks, true), taskGroup('Other Places', places), taskGroup('Details', details));

    this.win = wm.open({
      id: `site:${site.id}`,
      title: `${site.title} — ${addr.replace(/^https?:\/\//, '')}`,
      icon: icons.tape(site.accent),
      body,
      width: 760,
      dock: 'right',
      onClose: () => {
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
    if (!s.href) return 'Heimdall has no public face. The screen in the room and the preview here are a replica with invented numbers; nothing on this page talks to the cluster.';
    if (s.id === 'dreams') return 'Opening dreams wakes the dreamer: a GPU starts up while anyone is watching and goes back to sleep after. The frame here is the last one the chronicle kept.';
    if (s.id === 'syrinx') return 'Syrinx makes sound once you wake it. The creature here is read from this browser; nobody else sees yours.';
    if (s.group === 'wired') return `${s.title} is not on this server; it opens in a new window.`;
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
        text = !d.known ? 'status unknown' : d.awake ? `awake · frame ${d.frame.toLocaleString('en-US')}${d.viewers ? ` · ${d.viewers} watching` : ''}` : 'asleep';
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
      case 'heimdall':
        text = 'replica · no uplink';
        break;
      default:
        return;
    }
    this.statusLine.className = `status${on ? ' on' : ''}`;
    this.statusLine.innerHTML = `<i></i><span></span>`;
    const span = this.statusLine.querySelector('span');
    if (span) span.textContent = text;
  }
}
