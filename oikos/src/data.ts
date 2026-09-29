/**
 * data.ts — what the room knows, and where it hears it from.
 *
 * The directory itself arrives with the page (aethera/api/oikos.py writes it
 * once, for the <nav> and for us). Everything live is polled from the site's
 * own public endpoints, and every one of them was chosen because it costs the
 * site nothing to be watched:
 *
 *   dreams     /api/dreams/status is a monitoring endpoint: it never wakes the
 *              GPU. The room must NOT open /ws/dreams — a viewer socket is what
 *              starts the dreamer, and a hub left open in a tab would keep a GPU
 *              awake all night.
 *   chronicle  the timeline carries the dream's latest keyframe thumbnail and
 *              its prompt, so the dreams screen shows a real recent frame
 *              without waking anything.
 *   irc        /ws/irc replays a pre-generated bank; one more listener is free.
 *   syrinx     the creature lives in this origin's localStorage, so the room
 *              can show *your* creature, if you have woken one.
 *   apeiron    the grammar ships as two small JSON files; the screen composes
 *              real prompts from it.
 */

export interface Site {
  id: string;
  title: string;
  href: string;
  group: 'here' | 'wired';
  kind: string;
  accent: string;
  tagline: string;
  about: string;
  details: [string, string][];
  /** can be watched live on its own screen: true frames href, a string frames that page */
  tune?: boolean | string;
}

export interface FileEntry {
  id: string;
  title: string;
  href: string;
  about: string;
}

export interface PostEntry {
  title: string;
  href: string;
  date: string;
  author: string;
  excerpt: string;
}

export interface Directory {
  sites: Site[];
  files: FileEntry[];
  posts: PostEntry[];
}

export function readDirectory(): Directory {
  const el = document.getElementById('oikos-data');
  try {
    const parsed = JSON.parse(el?.textContent ?? '{}') as Partial<Directory>;
    return { sites: parsed.sites ?? [], files: parsed.files ?? [], posts: parsed.posts ?? [] };
  } catch {
    return { sites: [], files: [], posts: [] };
  }
}

export const isExternal = (href: string): boolean => /^https?:\/\//.test(href);

// ---- a tiny signal ----------------------------------------------------------

type Listener<T> = (v: T) => void;

export class Signal<T> {
  private listeners = new Set<Listener<T>>();
  constructor(public value: T) {}
  set(v: T): void {
    this.value = v;
    for (const l of this.listeners) l(v);
  }
  on(l: Listener<T>): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }
}

// ---- dreams -----------------------------------------------------------------

export interface DreamStatus {
  known: boolean; // false until the first answer (or if the endpoint is unreachable)
  awake: boolean; // a GPU is connected and dreaming
  frame: number;
  fps: number;
  viewers: number;
  raw: unknown; // the whole answer, for the api screen
}

// ---- chronicle --------------------------------------------------------------

export interface ChronicleEra {
  title: string;
  t0: number;
  t1: number;
  open: boolean;
  kf: number;
}

export interface Chronicle {
  known: boolean;
  thumb: HTMLImageElement | null; // the dream's latest keyframe
  thumbAt: number;
  prompt: string;
  template: string;
  eras: ChronicleEra[];
  eraCount: number;
  strata: HTMLImageElement[]; // hourly strata tiles, newest last
}

// ---- irc --------------------------------------------------------------------

export interface IrcLine {
  nick: string;
  content: string;
  type: string; // message | action | join | part | quit | kick | system
  stamp: string;
  at: number; // performance.now() when it arrived
  /** a kick's victim and reason (the kicker is `nick`) */
  target?: string;
  reason?: string;
}

export interface Irc {
  connected: boolean;
  lines: IrcLine[];
  collapse: { type: string; at: number } | null;
  /** how many fragments have ended since the room started listening */
  fragments: number;
  version: number; // bumps on every change, so screens can tell cheaply
}

// ---- syrinx -----------------------------------------------------------------

export interface Creature {
  name: string;
  bornAt: number;
  lifetime: number;
  nodes: { id: number; x: number; y: number; z: number; age: number }[];
  edges: { a: number; b: number; age: number }[];
}

export function readCreature(): Creature | null {
  try {
    const raw = localStorage.getItem('syrinx-creature-v1');
    if (!raw) return null;
    const s = JSON.parse(raw) as {
      name?: unknown;
      bornAt?: unknown;
      state?: { nodes?: unknown; edges?: unknown; lifetime?: unknown };
    };
    if (typeof s.name !== 'string' || typeof s.bornAt !== 'number' || !s.state) return null;
    const nodes = Array.isArray(s.state.nodes) ? (s.state.nodes as Creature['nodes']) : [];
    const edges = Array.isArray(s.state.edges) ? (s.state.edges as Creature['edges']) : [];
    if (!nodes.length) return null;
    return {
      name: s.name,
      bornAt: s.bornAt,
      lifetime: typeof s.state.lifetime === 'number' ? s.state.lifetime : 0,
      nodes: nodes.map((n) => ({ id: n.id, x: n.x, y: n.y, z: n.z ?? 500, age: n.age ?? 0 })),
      edges: edges.map((e) => ({ a: e.a, b: e.b, age: e.age ?? 0 })),
    };
  } catch {
    return null;
  }
}

// ---- apeiron ----------------------------------------------------------------

export interface ApeironGrammar {
  templates: { id: string; structure: string }[];
  components: Record<string, { word: string }[]>;
}

// ---- the feeds --------------------------------------------------------------

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function getJSON<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

export class Feeds {
  readonly dreams = new Signal<DreamStatus>({
    known: false, awake: false, frame: 0, fps: 0, viewers: 0, raw: null,
  });
  readonly chronicle = new Signal<Chronicle>({
    known: false, thumb: null, thumbAt: 0, prompt: '', template: '', eras: [], eraCount: 0, strata: [],
  });
  readonly irc = new Signal<Irc>({ connected: false, lines: [], collapse: null, fragments: 0, version: 0 });
  readonly creature = new Signal<Creature | null>(readCreature());
  readonly apeiron = new Signal<ApeironGrammar | null>(null);

  private timers: number[] = [];
  private ws: WebSocket | null = null;
  private wsBackoff = 2000;
  private wsTimer = 0;
  private running = false;

  start(): void {
    if (this.running) return;
    this.running = true;
    const every = (fn: () => void, ms: number) => {
      fn();
      this.timers.push(window.setInterval(fn, ms));
    };
    every(() => void this.pollDreams(), 20_000);
    every(() => void this.pollChronicle(), 120_000);
    // a creature woken in another tab should appear without a reload
    every(() => this.creature.set(readCreature()), 15_000);
    this.openIrc();
    if (!this.apeiron.value) void this.loadApeiron();
  }

  /** Hidden tab: stop listening. Nothing here should cost the site anything
   *  while nobody is looking. */
  stop(): void {
    this.running = false;
    for (const t of this.timers) clearInterval(t);
    this.timers = [];
    clearTimeout(this.wsTimer);
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.irc.set({ ...this.irc.value, connected: false, version: this.irc.value.version + 1 });
  }

  private async pollDreams(): Promise<void> {
    const s = await getJSON<{
      status?: string;
      gpu?: { active?: boolean };
      generation?: { frame_count?: number; current_frame?: number; fps?: number };
      viewers?: { websocket_count?: number };
    }>('/api/dreams/status');
    if (!s) {
      this.dreams.set({ ...this.dreams.value, known: false });
      return;
    }
    this.dreams.set({
      known: true,
      awake: !!s.gpu?.active,
      frame: s.generation?.current_frame ?? s.generation?.frame_count ?? 0,
      fps: s.generation?.fps ?? 0,
      viewers: s.viewers?.websocket_count ?? 0,
      raw: s,
    });
  }

  private async pollChronicle(): Promise<void> {
    const t = await getJSON<{
      tiles?: { t: number; url: string }[];
      eras?: { title?: string; t0: number; t1: number; open?: boolean; kf?: number }[];
      era_count?: number;
      live?: { t: number; thumb: string; prompt?: string; template?: string } | null;
    }>('/api/dreams/chronicle/timeline?hours=3');
    if (!t) return;
    const prev = this.chronicle.value;
    let thumb = prev.thumb;
    if (t.live?.thumb && t.live.thumb !== thumb?.dataset.src) {
      thumb = await loadImage(t.live.thumb).catch(() => prev.thumb);
      if (thumb) thumb.dataset.src = t.live.thumb;
    }
    const tiles = (t.tiles ?? []).slice(-3);
    const strata = (
      await Promise.all(tiles.map((tile) => loadImage(tile.url).catch(() => null)))
    ).filter((i): i is HTMLImageElement => !!i);
    this.chronicle.set({
      known: true,
      thumb,
      thumbAt: t.live?.t ?? 0,
      prompt: t.live?.prompt ?? '',
      template: t.live?.template ?? '',
      eras: (t.eras ?? []).map((e) => ({
        title: e.title ?? '', t0: e.t0, t1: e.t1, open: !!e.open, kf: e.kf ?? 0,
      })),
      eraCount: t.era_count ?? 0,
      strata: strata.length ? strata : prev.strata,
    });
  }

  private openIrc(): void {
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    let ws: WebSocket;
    try {
      ws = new WebSocket(`${proto}://${location.host}/ws/irc`);
    } catch {
      return;
    }
    this.ws = ws;
    const bump = (patch: Partial<Irc>) => {
      const v = this.irc.value;
      this.irc.set({ ...v, ...patch, version: v.version + 1 });
    };
    ws.onopen = () => {
      this.wsBackoff = 2000;
      // whatever was collapsing when we last heard is old news; the server's
      // replay says what's happening now
      bump({ connected: true, collapse: null });
    };
    ws.onmessage = (ev) => {
      let msg: { type?: string; data?: Record<string, unknown>; collapseType?: string; replay?: boolean };
      try {
        msg = JSON.parse(String(ev.data));
      } catch {
        return;
      }
      if (msg.type === 'message' && msg.data) {
        const d = msg.data;
        const meta = (d.meta ?? {}) as { target?: unknown; reason?: unknown };
        const line: IrcLine = {
          nick: String(d.nick ?? ''),
          content: String(d.content ?? ''),
          type: String(d.type ?? 'message'),
          stamp: String(d.timestamp ?? ''),
          at: performance.now(),
        };
        if (typeof meta.target === 'string') line.target = meta.target;
        if (typeof meta.reason === 'string') line.reason = meta.reason;
        // a replay after a reconnect repeats lines we already have: keep ours
        if (msg.replay && this.irc.value.lines.some((l) => l.stamp === line.stamp && l.nick === line.nick && l.content === line.content)) return;
        bump({ lines: [...this.irc.value.lines, line].slice(-60) });
      } else if (msg.type === 'collapse_start') {
        bump({ collapse: { type: msg.collapseType ?? 'collapse', at: performance.now() } });
      } else if (msg.type === 'fragment_end') {
        // the channel empties between fragments; keep the tail as an afterimage.
        // a replayed end is one that already happened: not a new fragment ending
        if (msg.replay) bump({ collapse: null });
        else bump({ collapse: null, lines: this.irc.value.lines.slice(-6), fragments: this.irc.value.fragments + 1 });
      }
    };
    ws.onclose = () => {
      bump({ connected: false });
      if (!this.running) return;
      this.wsTimer = window.setTimeout(() => this.openIrc(), this.wsBackoff);
      this.wsBackoff = Math.min(this.wsBackoff * 2, 60_000);
    };
  }

  private async loadApeiron(): Promise<void> {
    const [templates, components] = await Promise.all([
      getJSON<ApeironGrammar['templates']>('/static/apeiron/data/templates.json'),
      getJSON<ApeironGrammar['components']>('/static/apeiron/data/components.json'),
    ]);
    if (templates && components) this.apeiron.set({ templates, components });
  }
}
