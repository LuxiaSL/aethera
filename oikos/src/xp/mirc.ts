/**
 * mirc.ts — the channels, the way you'd have sat in them.
 *
 * Two channels on one network, and the Status window for the server itself:
 *
 *   #aethera  the haunted broadcast. The room already listens to /ws/irc for
 *             the irc screen; this reads the same feed and dresses it as the
 *             client of the era. It is +m and nobody alive has voice, so what
 *             you type there is echoed and refused.
 *   #oikos    where people talk (/ws/chat, see ../chat.ts). You join it on
 *             purpose, with a nick and, if you like, the password that gives
 *             your blog comments their tripcode: the same trip shows here, as
 *             your host.
 *
 * The broadcast sends no history, so a fresh listener would see an empty
 * #aethera; the room has been listening since it booted, and that tail is
 * played back first, as a bouncer would ("Buffer Playback"). #oikos plays
 * back what the server kept of it (its last hundred lines; nothing is stored).
 *
 * When #aethera collapses the window stops answering: its title says
 * "(Not Responding)" and it washes out, as XP's ghosted windows did, until
 * the fragment ends and you rejoin.
 */

import { ChatLink, type ChatEvent, type Welcome, type WhoisReply } from '../chat';
import type { Irc, IrcLine } from '../data';
import { hash01 } from '../screens/screen';
import { h, menubar } from './chrome';
import * as icons from './icons';
import type { MenuEntry } from './menu';
import type { Shell } from './shell';
import type { WindowManager, XPWindow } from './wm';

const HAUNTED = '#aethera';
const LIVING = '#oikos';
const SERVER = 'irc.aetherawi.red';
const PORT = 6667;
const GUEST = 'guest';
const HAUNTED_TOPIC = 'always falling apart';
/** rows kept per window before the oldest scroll away for good */
const MAX_ROWS = 600;
/** how long the window stays hung after the channel dies, before you rejoin
 *  (XP ghosted a window after 5 s without an answer; fragments are 15–30 s apart) */
const HANG_MS = 6000;
/** the nick you last joined #oikos as (the password is never kept) */
const NICK_KEY = 'oikos-mirc-nick';
/** the server's own rule (aethera/chat/hub.py NICK_RE), so a bad nick is caught before the door */
const NICK_RE = /^[A-Za-z[\]\\`_^{|}][A-Za-z0-9[\]\\`_^{|}-]{0,15}$/;

/** mIRC's default event colours, by what happened */
type Tone = 'text' | 'own' | 'action' | 'join' | 'part' | 'quit' | 'kick' | 'mode' | 'topic' | 'info' | 'notice' | 'error';

/** channel-mode prefixes, highest first, as a nick list sorts them */
const RANKS = ['~', '&', '@', '%', '+'];

type WinId = 'status' | typeof HAUNTED | typeof LIVING;

function stamp(epochMs: number): string {
  const d = new Date(epochMs);
  return `[${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}]`;
}

/** a line from the feed happened at performance.now() `at`; when was that on the wall? */
function wall(at: number): number {
  return Date.now() - (performance.now() - at);
}

/** a believable ident@host for a ghost, the same one every time */
function ghostMask(nick: string): string {
  const n = bare(nick) || 'anon';
  const r = hash01(n);
  const isps = ['dialup.wired.net', 'cable.aether.org', 'dsl.lain.jp', 'adsl.nowhere.nu', 'res.navi.co'];
  const isp = isps[Math.floor(r * isps.length)] ?? isps[0];
  const a = Math.floor(r * 251) + 2;
  const b = Math.floor(hash01(`${n}.`) * 251) + 2;
  return `~${n.slice(0, 9).toLowerCase()}@ppp-${a}-${b}.${isp}`;
}

/** a nick without its channel-mode prefix */
function bare(nick: string): string {
  return nick.replace(/^[~&@%+]+/, '');
}

function prefixOf(nick: string): string {
  const c = nick.charAt(0);
  return RANKS.includes(c) ? c : '';
}

function readNick(): string {
  try {
    return localStorage.getItem(NICK_KEY) ?? '';
  } catch {
    return '';
  }
}

function saveNick(n: string): void {
  try {
    localStorage.setItem(NICK_KEY, n);
  } catch {
    /* private window: it just won't be remembered */
  }
}

/** keys typed into a field belong to the field, not to the room behind it */
function keepKeys(el: HTMLElement): void {
  el.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') e.stopPropagation();
  });
}

/** one MDI child: its switchbar button, its transcript and, for a channel, its nick list */
class Win {
  readonly tab: HTMLButtonElement;
  readonly pane: HTMLElement;
  readonly log: HTMLElement;
  readonly nicksEl: HTMLElement | null;
  /** bare nick (lowercased) → display name and mode prefix */
  readonly nicks = new Map<string, { name: string; mode: string }>();
  topic = '';
  joined = false;

  constructor(
    readonly id: WinId,
    icon: string,
    channel: boolean,
  ) {
    this.tab = h('button', { type: 'button', role: 'tab', html: `${icon}<span></span>` });
    (this.tab.querySelector('span') as HTMLElement).textContent = id === 'status' ? 'Status' : id;
    this.log = h('div', { class: 'mirc-log', role: 'log', 'aria-label': id === 'status' ? 'Status' : id });
    if (channel) {
      this.log.setAttribute('aria-live', 'polite');
      this.nicksEl = h('ul', { class: 'mirc-nicks', 'aria-label': `Nicknames in ${id}` });
      this.pane = h('div', { class: 'mirc-pane' }, [h('div', { class: 'mirc-split' }, [this.log, this.nicksEl])]);
    } else {
      this.nicksEl = null;
      this.pane = h('div', { class: 'mirc-pane' }, [this.log]);
    }
  }

  setNick(nick: string, mode = prefixOf(nick)): void {
    const name = bare(nick);
    if (name) this.nicks.set(name.toLowerCase(), { name, mode });
  }

  /** seen talking: in the list, keeping any mode it already had */
  seen(nick: string): boolean {
    const name = bare(nick);
    if (!name) return false;
    const key = name.toLowerCase();
    const had = this.nicks.get(key);
    const mode = prefixOf(nick) || had?.mode || '';
    if (had && had.mode === mode && had.name === name) return false;
    this.nicks.set(key, { name, mode });
    return true;
  }

  drop(nick: string): boolean {
    return this.nicks.delete(bare(nick).toLowerCase());
  }

  rename(from: string, to: string): void {
    const had = this.nicks.get(bare(from).toLowerCase());
    this.drop(from);
    this.setNick(to, had?.mode ?? '');
  }

  render(): void {
    if (!this.nicksEl) return;
    const rank = (m: string) => (m ? RANKS.indexOf(m) : RANKS.length);
    const list = [...this.nicks.values()].sort(
      (a, b) => rank(a.mode) - rank(b.mode) || a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    );
    this.nicksEl.replaceChildren(...list.map((n) => h('li', {}, [`${n.mode}${n.name}`])));
  }
}

export class Mirc {
  readonly win: XPWindow;
  private wins: Record<WinId, Win>;
  private view: WinId = HAUNTED;
  private input: HTMLInputElement;
  /** who you are: a guest until #oikos gives you a name */
  private me = GUEST;
  private link: ChatLink | null = null;
  private hintedOikos = false;

  // #aethera's feed state
  private hung = false;
  private lastAt = -1;
  private seenFragments: number;
  private seenCollapse: number | null = null;
  private wasConnected = false;
  private rejoinTimer = 0;
  private off: () => void;

  constructor(
    private readonly shell: Shell,
    private readonly wm: WindowManager,
    onClose: () => void,
  ) {
    const body = h('div', { class: 'mirc' });

    body.append(
      menubar({
        File: () => [
          { label: 'Connect...', run: () => this.joinLiving(), disabled: !!this.link },
          { label: 'Disconnect', run: () => this.partLiving(), disabled: !this.link },
          'sep',
          { label: 'Select Server...', disabled: true },
          'sep',
          { label: 'Exit', run: () => this.win.close() },
        ],
        Tools: () => [
          { label: 'Address Book...', disabled: true },
          { label: 'Options...', shortcut: 'Alt+O', disabled: true },
        ],
        Commands: () => [
          { label: `Join ${LIVING}`, run: () => this.joinLiving() },
          { label: `Part ${LIVING}`, run: () => this.partLiving(), disabled: !this.link },
          'sep',
          { label: 'Clear buffer', run: () => this.wins[this.view].log.replaceChildren() },
        ],
        Window: () =>
          (['status', HAUNTED, LIVING] as const)
            .filter((id) => !this.wins[id].tab.hidden)
            .map((id): MenuEntry => ({ label: id === 'status' ? 'Status' : id, checked: this.view === id, run: () => this.show(id) })),
        Help: () => [
          { label: 'Commands', shortcut: 'F1', run: () => this.help() },
          'sep',
          { label: 'About æthera', run: () => this.shell.about() },
        ],
      }),
    );

    // the switchbar: one button per open window
    const bar = h('div', { class: 'mirc-switch', role: 'tablist' });
    this.wins = {
      status: new Win('status', icons.chat('status'), false),
      [HAUNTED]: new Win(HAUNTED, icons.chat('channel'), true),
      [LIVING]: new Win(LIVING, icons.chat('channel'), true),
    };
    this.wins[HAUNTED].topic = HAUNTED_TOPIC;
    this.wins[LIVING].tab.hidden = true; // until you join it
    const mdi = h('div', { class: 'mirc-mdi' });
    for (const w of Object.values(this.wins)) {
      w.tab.addEventListener('click', () => this.show(w.id));
      bar.append(w.tab);
      mdi.append(w.pane);
    }

    this.input = h('input', { class: 'mirc-input', type: 'text', spellcheck: 'false', autocomplete: 'off', maxlength: '400', 'aria-label': 'Message' });
    keepKeys(this.input);
    this.input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      // or this Enter goes on to submit whatever it opens (the Connect dialog,
      // focused and already holding your last nick)
      e.preventDefault();
      const v = this.input.value;
      this.input.value = '';
      this.say(v);
    });
    body.append(bar, mdi, this.input);

    this.win = wm.open({
      id: 'mirc',
      title: 'mIRC',
      icon: icons.chat('app'),
      body,
      width: Math.round(Math.min(760, Math.max(460, innerWidth * 0.52))),
      dock: 'center',
      onClose: () => {
        clearTimeout(this.rejoinTimer);
        this.off();
        this.link?.close();
        this.link = null;
        this.wm.get('mirc-connect')?.close();
        onClose();
      },
      onFocus: () => {
        if (innerWidth > 720) this.input.focus({ preventScroll: true });
      },
    });
    this.win.el.classList.add('mirc-window');
    this.win.el.style.height = 'min(540px, calc(100% - 24px))';

    const irc = this.shell.feeds.irc.value;
    this.seenFragments = irc.fragments;
    this.seenCollapse = irc.collapse?.at ?? null;
    this.show(HAUNTED);
    if (irc.connected) this.connect(irc);
    else this.push('status', 'info', `* Connecting to ${SERVER} (${PORT})`);
    this.off = this.shell.feeds.irc.on((v) => this.update(v));
  }

  focus(): void {
    if (this.win.minimized) this.win.restore();
    else this.win.focus();
  }

  // ---- #aethera: the feed -------------------------------------------------------

  private update(irc: Irc): void {
    if (irc.connected && !this.wasConnected) this.connect(irc);
    else if (!irc.connected && this.wasConnected) this.disconnect();
    if (!irc.connected) return;

    for (const l of irc.lines) {
      if (l.at <= this.lastAt) continue;
      // the next fragment began before the hang was over: rejoin first
      if (this.rejoinTimer) this.rejoin();
      this.lastAt = l.at;
      this.line(l);
    }

    const collapseAt = irc.collapse?.at ?? null;
    if (collapseAt !== null && collapseAt !== this.seenCollapse && irc.collapse) this.collapse(irc.collapse.type);
    this.seenCollapse = collapseAt;

    if (irc.fragments !== this.seenFragments) {
      this.seenFragments = irc.fragments;
      clearTimeout(this.rejoinTimer);
      if (this.hung) this.rejoinTimer = window.setTimeout(() => this.rejoin(), HANG_MS);
      else this.rejoin();
    }
  }

  /** the handshake, the MOTD, the join — and whatever the room already heard */
  private connect(irc: Irc): void {
    this.wasConnected = true;
    const s = (tone: Tone, text: string) => this.push('status', tone, text);
    s('info', `* Connecting to ${SERVER} (${PORT})`);
    s('notice', `-${SERVER}- *** Looking up your hostname...`);
    s('notice', `-${SERVER}- *** Found your hostname`);
    s('text', `Welcome to the æthera IRC Network ${this.me}!${this.me}@oikos`);
    s('text', `Your host is ${SERVER}, running version hauntd-2.8.21`);
    s('text', `- ${SERVER} Message of the Day -`);
    s('text', '- nobody here is who they were.');
    s('text', '- every line is a replay; every replay is live.');
    s('text', `- ${HAUNTED} is moderated: the living listen.`);
    s('text', `- the living talk in ${LIVING}. /join ${LIVING}`);
    s('text', 'End of /MOTD command.');
    s('mode', `* ${this.me} sets mode: +i`);

    this.joinHaunted();
    const tail = irc.lines.filter((l) => l.at > this.lastAt);
    if (tail.length) {
      this.push(HAUNTED, 'info', '*** Buffer Playback...');
      for (const l of tail) this.line(l);
      this.push(HAUNTED, 'info', '*** Playback Complete.');
    }
    this.lastAt = Math.max(this.lastAt, ...irc.lines.map((l) => l.at));
    if (irc.collapse) this.collapse(irc.collapse.type);
  }

  private joinHaunted(): void {
    const c = this.wins[HAUNTED];
    c.joined = true;
    c.nicks.clear();
    c.setNick(this.me, '');
    this.push(HAUNTED, 'join', `* Now talking in ${HAUNTED}`);
    this.push(HAUNTED, 'topic', `* Topic is '${c.topic}'`);
    this.push(HAUNTED, 'topic', '* Set by ChanServ');
    this.nicksChanged(HAUNTED);
  }

  private disconnect(): void {
    clearTimeout(this.rejoinTimer);
    this.rejoinTimer = 0;
    this.wasConnected = false;
    const c = this.wins[HAUNTED];
    c.joined = false;
    this.setHung(false);
    this.push('status', 'info', `* Disconnected from ${HAUNTED}`);
    this.push(HAUNTED, 'info', '* Disconnected');
    c.nicks.clear();
    this.nicksChanged(HAUNTED);
  }

  private collapse(type: string): void {
    const what = type.replace(/_/g, ' ');
    this.push('status', 'notice', `-${SERVER}- *** Notice -- ${what} on ${HAUNTED}`);
    this.setHung(true);
  }

  /** the fragment ended: everyone's gone; you come back to an empty room */
  private rejoin(): void {
    clearTimeout(this.rejoinTimer);
    this.rejoinTimer = 0;
    this.setHung(false);
    this.push(HAUNTED, 'info', `* Attempting to rejoin channel ${HAUNTED}`);
    this.wins[HAUNTED].topic = HAUNTED_TOPIC;
    this.joinHaunted();
  }

  private line(l: IrcLine): void {
    const c = this.wins[HAUNTED];
    const nk = l.nick;
    const who = bare(nk);
    const ct = l.content;
    const at = wall(l.at);
    const put = (tone: Tone, text: string) => this.push(HAUNTED, tone, text, at);
    let changed = false;
    switch (l.type) {
      case 'message':
        changed = c.seen(nk);
        put('text', `<${nk}> ${ct}`);
        break;
      case 'action': {
        // the bank writes some events as actions: modes and quits among them
        const mode = /^sets mode: ([+-])([a-z]+) (.+)$/i.exec(ct);
        if (mode) {
          c.seen(nk);
          this.applyMode(mode[1] ?? '+', mode[2] ?? '', (mode[3] ?? '').split(/\s+/));
          changed = true;
          put('mode', `* ${nk} ${ct}`);
        } else if (/^has quit\b/i.test(ct)) {
          changed = c.drop(nk);
          put('quit', `* ${who} ${ct.replace(/^has quit\b/i, 'has quit IRC')}`);
        } else {
          changed = c.seen(nk);
          put('action', `* ${nk} ${ct}`);
        }
        break;
      }
      case 'join':
        changed = c.seen(nk);
        put('join', `* ${who} (${ghostMask(nk)}) has joined ${HAUNTED}`);
        break;
      case 'part':
        changed = c.drop(nk);
        put('part', `* ${who} (${ghostMask(nk)}) has left ${HAUNTED}${ct ? ` (${ct})` : ''}`);
        break;
      case 'quit':
        changed = c.drop(nk);
        put('quit', `* ${who} (${ghostMask(nk)}) Quit (${ct || 'Client exited'})`);
        break;
      case 'kick': {
        const why = l.reason || ct;
        if (l.target) {
          changed = c.drop(l.target);
          put('kick', `* ${bare(l.target)} was kicked by ${who}${why ? ` (${why})` : ''}`);
        } else {
          put('kick', `* ${who} kicks${why ? ` (${why})` : ''}`);
        }
        break;
      }
      default: {
        const topic = /changes topic to '(.*)'$/i.exec(ct);
        if (topic) {
          c.topic = topic[1] ?? c.topic;
          put('topic', `* ${ct}`);
          this.retitle();
          break;
        }
        // erasure and corruption write half-lines as system notices: leave them raw
        const raw = ct || nk;
        put('info', /^[*<]/.test(raw) || raw.length < 6 ? raw : `* ${raw}`);
      }
    }
    // a ghost may not remove you from the list, whoever it thinks it is
    if (!c.nicks.has(this.me.toLowerCase()) && c.joined) {
      c.setNick(this.me, '');
      changed = true;
    }
    if (changed) this.nicksChanged(HAUNTED);
  }

  private applyMode(sign: string, letters: string, targets: string[]): void {
    const c = this.wins[HAUNTED];
    const symbol: Record<string, string> = { q: '~', a: '&', o: '@', h: '%', v: '+' };
    [...letters].forEach((ch, i) => {
      const t = targets[i];
      const sym = symbol[ch];
      if (!t || !sym) return;
      const had = c.nicks.get(bare(t).toLowerCase());
      c.setNick(had?.name ?? bare(t), sign === '+' ? sym : had?.mode === sym ? '' : (had?.mode ?? ''));
    });
  }

  // ---- #oikos: the living -------------------------------------------------------

  /** /join #oikos: straight there if we're in, else the Connect dialog */
  private joinLiving(): void {
    if (this.link && this.wins[LIVING].joined) {
      this.show(LIVING);
      return;
    }
    if (this.link) {
      this.push(this.view, 'info', `* Still connecting to ${LIVING}...`);
      return;
    }
    this.connectDialog();
  }

  private partLiving(): void {
    if (!this.link) return;
    this.link.close();
    this.link = null;
    const o = this.wins[LIVING];
    o.joined = false;
    o.nicks.clear();
    this.nicksChanged(LIVING);
    this.push(LIVING, 'part', `* You have left ${LIVING}`);
    this.push('status', 'info', `* Disconnected from ${LIVING}`);
    this.renameMe(GUEST);
  }

  private connectDialog(problem?: string): void {
    this.wm.get('mirc-connect')?.close();
    const form = h('form', { class: 'mirc-connect' });
    const nick = h('input', { type: 'text', value: readNick(), maxlength: '16', spellcheck: 'false', autocomplete: 'nickname', required: '' });
    const pass = h('input', { type: 'password', maxlength: '256', autocomplete: 'current-password' });
    keepKeys(nick);
    keepKeys(pass);
    const err = h('p', { class: 'err', role: 'alert' });
    err.textContent = problem ?? '';
    err.hidden = !problem;
    form.append(
      h('div', { class: 'xp-dialog-body' }, [
        h('span', { html: icons.chat('app') }),
        h('div', {}, [
          h('p', {}, [`Join ${LIVING}, where the living talk.`]),
          h('label', {}, ['Nickname:', nick]),
          h('label', {}, ['Password (optional):', pass]),
          h('p', { class: 'hint' }, ['A password gives you a tripcode, the same one your blog comments carry. It is never stored.']),
          err,
        ]),
      ]),
    );
    const actions = h('div', { class: 'xp-actions' });
    const ok = h('button', { class: 'xp-btn default', type: 'submit' }, ['Connect']);
    const cancel = h('button', { class: 'xp-btn', type: 'button' }, ['Cancel']);
    actions.append(ok, cancel);
    form.append(actions);
    const dlg = this.wm.open({ id: 'mirc-connect', title: 'mIRC Connect', icon: icons.chat('app'), body: form, width: 360, dialog: true });
    cancel.addEventListener('click', () => dlg.close());
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const n = nick.value.trim();
      if (!NICK_RE.test(n)) {
        err.textContent = 'A nickname starts with a letter and has at most 16 letters, digits or - _ [ ] { } | ^ `';
        err.hidden = false;
        nick.focus();
        return;
      }
      saveNick(n);
      dlg.close();
      this.dial(n, pass.value || null);
    });
    nick.focus();
    nick.select();
  }

  private dial(nick: string, password: string | null): void {
    this.push('status', 'info', `* Connecting to ${LIVING} as ${nick}${password ? ' (with a tripcode)' : ''}`);
    const link = new ChatLink(nick, password, {
      welcome: (w) => this.welcomed(w),
      event: (e) => this.event(e),
      whois: (w) => this.whoisReply(w),
      error: (code, text) => this.chatError(code, text),
      closed: (retrying, kicked) => this.dropped(retrying, kicked),
    });
    this.link = link;
    link.connect();
  }

  private welcomed(w: Welcome): void {
    const o = this.wins[LIVING];
    o.tab.hidden = false;
    o.joined = true;
    o.topic = w.topic;
    o.nicks.clear();
    for (const n of w.names) o.setNick(n.nick, n.op ? '@' : '');
    this.renameMe(w.nick);
    this.push('status', 'text', `* You are now known as ${w.nick} (${w.mask})`);
    if (w.op) this.push('status', 'mode', `* ${SERVER} sets mode: +o ${w.nick}`);
    this.push(LIVING, 'join', `* Now talking in ${LIVING}`);
    this.push(LIVING, 'topic', `* Topic is '${w.topic}'`);
    if (w.backlog.length) {
      this.push(LIVING, 'info', '*** Buffer Playback...');
      for (const e of w.backlog) this.event(e, true);
      this.push(LIVING, 'info', '*** Playback Complete.');
    }
    this.nicksChanged(LIVING);
    this.show(LIVING);
  }

  /** one thing that happened in #oikos; `past` for playback (it changes nobody) */
  private event(e: ChatEvent, past = false): void {
    const o = this.wins[LIVING];
    const put = (tone: Tone, text: string) => this.push(LIVING, tone, text, e.at);
    const mine = e.nick === this.me;
    switch (e.kind) {
      case 'message':
        put(mine ? 'own' : 'text', `<${e.nick}> ${e.text}`);
        return;
      case 'action':
        put('action', `* ${e.nick} ${e.text}`);
        return;
      case 'join':
        put('join', `* ${e.nick} (${e.mask ?? ''}) has joined ${LIVING}`);
        if (!past) o.setNick(e.nick, '');
        break;
      case 'part':
      case 'quit':
        put('quit', `* ${e.nick} (${e.mask ?? ''}) Quit (${e.text || 'Client exited'})`);
        if (!past) o.drop(e.nick);
        break;
      case 'kick':
        if (e.target === this.me && !past) {
          put('kick', `* You were kicked from ${LIVING} by ${e.nick} (${e.text})`);
          o.joined = false;
          o.nicks.clear();
        } else {
          put('kick', `* ${e.target ?? '?'} was kicked by ${e.nick} (${e.text})`);
          if (!past && e.target) o.drop(e.target);
        }
        break;
      case 'nick':
        if (mine && !past && e.target) {
          put('text', `* Your nick is now ${e.target}`);
          this.renameMe(e.target);
          saveNick(e.target);
        } else {
          put('text', `* ${e.nick} is now known as ${e.target ?? '?'}`);
        }
        if (!past && e.target) o.rename(e.nick, e.target);
        break;
      case 'topic':
        put('topic', `* ${e.nick} changes topic to '${e.text}'`);
        if (!past) o.topic = e.text;
        break;
    }
    if (!past) this.nicksChanged(LIVING);
  }

  private whoisReply(w: WhoisReply): void {
    const put = (text: string) => this.push(this.view, 'text', text);
    put(`${w.nick} is ${w.mask} * ${w.nick}`);
    if (w.trip) put(`${w.nick} is identified by tripcode ${w.trip}`);
    if (w.op) put(`${w.nick} is a channel operator on ${LIVING}`);
    put(`${w.nick} signed on ${new Date(w.signon).toLocaleString()}`);
    put(`${w.nick} End of /WHOIS list.`);
  }

  private chatError(code: string, raw: string): void {
    const o = this.wins[LIVING];
    // IRC's numerics read "<subject> :<reason>"; mIRC showed them without the colon
    const text = raw.replace(/^(\S+) :/, '$1 ');
    this.push(o.joined ? LIVING : 'status', 'error', `* ${text}`);
    // turned away at the door over the nick: ask again
    if (!o.joined && (code === '432' || code === '433')) {
      this.link?.close();
      this.link = null;
      this.connectDialog(raw.replace(/^\S+ :/, ''));
    }
  }

  private dropped(retrying: boolean, kicked: boolean): void {
    const o = this.wins[LIVING];
    const was = o.joined;
    o.joined = false;
    o.nicks.clear();
    this.nicksChanged(LIVING);
    if (was && !kicked) this.push(LIVING, 'info', `* Disconnected${retrying ? ' (reconnecting...)' : ''}`);
    this.push('status', 'info', `* Disconnected from ${LIVING}${retrying ? ' (reconnecting...)' : ''}`);
    if (!retrying) {
      this.link = null;
      this.renameMe(GUEST);
    }
  }

  /** your name changed: every list you're in follows */
  private renameMe(nick: string): void {
    if (nick === this.me) return;
    const c = this.wins[HAUNTED];
    if (c.joined) {
      c.rename(this.me, nick);
      this.nicksChanged(HAUNTED);
    }
    this.me = nick;
    this.retitle();
  }

  // ---- you ------------------------------------------------------------------------

  private say(raw: string): void {
    const text = raw.trim();
    if (!text) return;
    const here = this.view;
    const living = here === LIVING && this.wins[LIVING].joined && !!this.link;
    const err = (t: string) => this.push(here, 'error', `* ${t}`);
    if (text.startsWith('/') && !text.startsWith('//')) {
      const [cmd = '', ...rest] = text.slice(1).split(/\s+/);
      const arg = rest.join(' ');
      switch (cmd.toLowerCase()) {
        case 'help':
          this.help();
          return;
        case 'clear':
          this.wins[here].log.replaceChildren();
          return;
        case 'quit':
        case 'exit':
          this.win.close();
          return;
        case 'join': {
          const chan = (rest[0] ?? '').toLowerCase().replace(/^#?/, '#');
          if (chan === LIVING || (chan === '#' && here === 'status')) this.joinLiving();
          else if (chan === HAUNTED) {
            this.show(HAUNTED);
            this.push(HAUNTED, 'error', `* You are already on ${HAUNTED}`);
          } else err(`${rest[0] ?? '#'} Cannot join channel (this network has ${HAUNTED} and ${LIVING})`);
          return;
        }
        case 'part':
        case 'leave':
          if (here === LIVING && this.link) this.partLiving();
          else err(here === HAUNTED ? `${HAUNTED} will not let you go` : 'You are not on a channel');
          return;
        case 'nick':
          if (!rest[0]) err('Usage: /nick <newnick>');
          else if (!this.link?.send({ type: 'nick', nick: rest[0] })) err(`Join ${LIVING} first to have a name (/join ${LIVING})`);
          return;
        case 'whois':
          if (!rest[0]) err('Usage: /whois <nick>');
          else if (!this.link?.send({ type: 'whois', nick: rest[0] })) err(`${rest[0]} :No such nick`);
          return;
        case 'me':
          if (!arg) return;
          if (living) this.link?.send({ type: 'say', text: arg, action: true });
          else if (here === HAUNTED) this.refused(`* ${this.me} ${arg}`, 'action');
          else err('You are not on a channel');
          return;
        case 'topic':
          if (living && arg) this.link?.send({ type: 'topic', text: arg });
          else if (living) this.push(LIVING, 'topic', `* Topic is '${this.wins[LIVING].topic}'`);
          else err(`${here === 'status' ? '' : `${here} `}You're not channel operator`);
          return;
        case 'kick':
          if (living && rest[0]) this.link?.send({ type: 'kick', nick: rest[0], reason: rest.slice(1).join(' ') });
          else err(living ? 'Usage: /kick <nick> [reason]' : "You're not channel operator");
          return;
        default:
          err(`${cmd.toUpperCase()} Unknown command`);
          return;
      }
    }
    const line = text.startsWith('//') ? text.slice(1) : text;
    if (living) {
      // the server echoes it back to everyone, us included: that's when it shows
      if (!this.link?.send({ type: 'say', text: line })) err('Not connected');
    } else if (here === HAUNTED && this.wins[HAUNTED].joined) {
      this.refused(`<${this.me}> ${line}`, 'own');
    } else {
      err('You are not on a channel');
    }
  }

  /** speaking into +m: echoed, and refused */
  private refused(echo: string, tone: Tone): void {
    this.push(HAUNTED, tone, echo);
    this.push(HAUNTED, 'error', `* ${HAUNTED} Cannot send to channel`);
    if (!this.hintedOikos) {
      this.hintedOikos = true;
      this.push(HAUNTED, 'info', `* (the living talk in ${LIVING}: /join ${LIVING})`);
    }
  }

  private help(): void {
    const put = (t: string) => this.push(this.view, 'info', t);
    put('* Commands:');
    put(`*   /join ${LIVING}           join the living (a nick, and a password for a tripcode if you like)`);
    put('*   /nick <name>           change your nick');
    put('*   /me <does something>   an action');
    put('*   /whois <nick>          who someone is (their tripcode, if they have one)');
    put(`*   /part                  leave ${LIVING}`);
    put('*   /topic, /kick          for channel operators');
    put('*   /clear  /quit');
  }

  // ---- drawing ------------------------------------------------------------------

  /** `at` is epoch ms; absent means now */
  private push(id: WinId, tone: Tone, text: string, at = Date.now()): void {
    const w = this.wins[id];
    const log = w.log;
    const stick = log.scrollHeight - log.scrollTop - log.clientHeight < 24;
    const el = h('div', { class: `mirc-row t-${tone}` });
    el.append(h('span', { class: 'ts' }, [stamp(at)]), ` ${text}`);
    log.append(el);
    while (log.childElementCount > MAX_ROWS) log.firstElementChild?.remove();
    if (stick) log.scrollTop = log.scrollHeight;
    // the switchbar lights a hidden window: red for talk, blue for events
    if (id !== this.view) {
      // only people talk; the server's own window only ever has events
      const talk = id !== 'status' && (tone === 'text' || tone === 'action' || tone === 'own');
      if (talk) w.tab.classList.add('said');
      else if (!w.tab.classList.contains('said')) w.tab.classList.add('event');
    }
  }

  private show(id: WinId): void {
    this.view = id;
    for (const w of Object.values(this.wins)) {
      const on = w.id === id;
      w.pane.hidden = !on;
      w.tab.classList.toggle('on', on);
      w.tab.setAttribute('aria-selected', String(on));
      if (on) w.tab.classList.remove('said', 'event');
    }
    const log = this.wins[id].log;
    log.scrollTop = log.scrollHeight;
    this.input.setAttribute('aria-label', id === 'status' ? 'Command' : `Message ${id}`);
    this.retitle();
  }

  private nicksChanged(id: WinId): void {
    this.wins[id].render();
    this.retitle();
  }

  private setHung(on: boolean): void {
    if (this.hung === on) return;
    this.hung = on;
    this.win.el.classList.toggle('mirc-hung', on);
    this.retitle();
  }

  private retitle(): void {
    const w = this.wins[this.view];
    const modes = w.id === HAUNTED ? '+mnt' : '+nt';
    const t =
      w.id === 'status'
        ? `mIRC - [Status: ${this.me} on ${SERVER} (${PORT})]`
        : w.joined
          ? `mIRC - [${w.id} [${w.nicks.size}] [${modes}]: ${w.topic}]`
          : `mIRC - [${w.id} (not on channel)]`;
    // #aethera's collapse hangs the whole program, whichever window you're in
    this.win.setTitle(this.hung ? `${t} (Not Responding)` : t);
  }
}
