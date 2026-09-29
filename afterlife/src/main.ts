/**
 * afterlife — the game of life, after hours.
 *
 * A web port of afterlife (github.com/LuxiaSL/afterlife), the terminal
 * screensaver: Conway's Life on an infinite toroidal world far larger than
 * the screen, with a camera that steers toward the drama, a dramaturge that
 * stages collisions, a ticker of musings, a census that greets famous
 * citizens, generative music, and haunted mode. This file is life.py's
 * main(): the loop, the keys, and the vessel (a <canvas> drawn as a
 * terminal, which is what afterlife was painted on).
 *
 * The loop keeps the terminal's timing: one frame is input → step → music →
 * auto-focus → census → autosave → log → render, and the next one comes
 * `delay × time_dilation` ms after it. Frames run on requestAnimationFrame,
 * so a hidden tab stops the universe instead of stepping it blind.
 */

import './style.css';
import { AUTOSAVE_EVERY, GHOST_FRAMES } from './engine/constants';
import { InfiniteLife } from './engine/life';
import { KEY, load, save } from './engine/persist';
import { StatsLogger } from './engine/stats';
import { Music } from './music/audio';
import type { SimulationSnapshot } from './music/engine';
import { Terminal } from './term/render';

const root = document.getElementById('afterlife-root');
const canvas = document.getElementById('term') as HTMLCanvasElement | null;
const splash = document.getElementById('splash');
const keysPanel = document.getElementById('keys');
const ctx = canvas?.getContext('2d', { alpha: false });
if (!root || !canvas || !ctx) throw new Error('afterlife: the page is missing its terminal');

// Inside an oikos screen the page shows your universe but never writes it:
// the /afterlife tab (or nobody) is its keeper.
const embedded = window.top !== window;
const term = new Terminal(ctx);
const music = new Music();
const logger = new StatsLogger();

let life: InfiniteLife;
let bornAt = Date.now();
let showStats = false;

// Playhead state for music scanning
let playheadCol = 0;

// Snapshot recording state (toggled with 'd'): kept in memory, downloaded on stop.
// Capped (~20 min at 15 snapshots/s) so a forgotten recording can't eat the tab.
const MAX_RECORDED = 18_000;
let recording = false;
let recorded: string[] = [];

// ── The vessel ───────────────────────────────────────────────────────────

/** CSS pixels per column: a terminal's cell, give or take the screen. */
function cellCss(): number {
  const w = window.innerWidth;
  if (w >= 1100) return 8;
  if (w >= 700) return 7;
  return 6;
}

function fitTerminal(): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cw = Math.max(2, Math.round(cellCss() * dpr));
  term.resize(Math.floor(window.innerWidth * dpr), Math.floor(window.innerHeight * dpr), cw);
  const pw = term.cols * term.cw;
  const ph = term.rows * term.cw * 2;
  canvas!.width = pw;
  canvas!.height = ph;
  canvas!.style.width = `${pw / dpr}px`;
  canvas!.style.height = `${ph / dpr}px`;
}

/** Refit the canvas; a new world only when the grid itself changed. */
function refit(): void {
  const rows = term.gridRows;
  const cols = term.cols;
  fitTerminal();
  // a phone's URL bar nudges the height by a few pixels as it scrolls away;
  // that's not a resize the universe needs to hear about
  if (term.gridRows !== rows || term.cols !== cols) rebuild();
}

/**
 * Resize the vessel, keep the universe (life.py's KEY_RESIZE). The old
 * world is the new one's floor, so a smaller window never crops it, and the
 * session (pause, speed, zoom, camera, modes, ticker) carries across.
 */
function rebuild(): void {
  const old = life;
  const [cy, cx] = old.viewCenter();
  life = new InfiniteLife(term.gridRows, term.cols, false, { minH: old.worldH, minW: old.worldW });
  life.adopt(old.snapshot());
  // adopt() centres the old world in the new; the camera follows it there
  const dy = Math.floor((life.worldH - old.worldH) / 2);
  const dx = Math.floor((life.worldW - old.worldW) / 2);
  if (old.haunted) {
    // adopt() retires ghosts deeper than normal decay reaches; in haunted
    // mode those are the point, and a resize shouldn't exorcise them
    for (let y = 0; y < old.worldH; y++) {
      for (let x = 0; x < old.worldW; x++) {
        const a = old.age[y * old.worldW + x] ?? 0;
        if (a < -GHOST_FRAMES) life.age[(dy + y) * life.worldW + dx + x] = a;
      }
    }
  }
  life.camY = Math.max(0, Math.min(cy + dy - Math.floor(life.viewH / 2), life.worldH - life.viewH));
  life.camX = Math.max(0, Math.min(cx + dx - Math.floor(life.viewW / 2), life.worldW - life.viewW));
  life.haunted = old.haunted;
  life.paused = old.paused;
  life.delay = old.delay;
  life.zoomLevel = old.zoomLevel;
  life.autoCam = old.autoCam;
  life.autoFocusMode = old.autoFocusMode;
  life.autoFocusFrame = old.autoFocusFrame;
  life.dilation = old.dilation;
  life.ticker = old.ticker;
  // world-wide telemetry: nothing was cropped, so it's all still true
  life.popHistory = old.popHistory.slice();
  life.spread = old.spread;
  life.popFloor = old.popFloor;
  life.cyclePeriod = old.cyclePeriod;
  life.lastEvent = old.lastEvent;
  life.lastEventGen = old.lastEventGen;
  playheadCol = 0;
}

let resizeTimer = 0;
function scheduleRefit(): void {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    refit();
    paint();
  }, 200);
}

// ── Keeping the universe, politely ───────────────────────────────────────
// Every tab on this origin saves to the same key. The savedAt of the save we
// loaded or last wrote is our mark: a stored save with another mark and a
// later generation was written by someone else, and isn't ours to clobber.

let ourSavedAt = 0;
let yielded = false;

/** savedAt + generation of the stored save, without decoding its cells. */
function storedHeader(raw: string | null): { savedAt: number; generation: number } | null {
  if (!raw) return null;
  // the small fields come before `cells` (see persist.ts's Stored), so the
  // head of the string is enough
  const head = raw.slice(0, 400);
  const savedAt = /"savedAt":(\d+)/.exec(head)?.[1];
  const generation = /"generation":(\d+)/.exec(head)?.[1];
  if (savedAt === undefined || generation === undefined) return null;
  return { savedAt: Number(savedAt), generation: Number(generation) };
}

function someoneElsesIsNewer(raw: string | null): boolean {
  const h = storedHeader(raw);
  return h !== null && h.savedAt !== ourSavedAt && h.generation > life.generation;
}

function yieldTo(): void {
  if (yielded) return;
  yielded = true;
  console.info('afterlife: another window has saved a later universe; this one will not overwrite it');
  life.ticker.queueSpecial('another window keeps this universe now');
}

function persist(): void {
  if (!life || embedded) return;
  try {
    if (someoneElsesIsNewer(localStorage.getItem(KEY))) {
      yieldTo();
      return;
    }
  } catch {
    // storage blocked: save() will say so
  }
  const savedAt = Date.now();
  if (save({ ...life.snapshot(), bornAt, savedAt })) ourSavedAt = savedAt;
}

window.addEventListener('storage', (e) => {
  if (e.key === KEY && !embedded && someoneElsesIsNewer(e.newValue)) yieldTo();
});

// ── Genesis, or the universe remembers ───────────────────────────────────

fitTerminal();
const saved = load();
if (saved) {
  // the saved world is the floor: a smaller screen than last time never crops it
  life = new InfiniteLife(term.gridRows, term.cols, false, { minH: saved.h, minW: saved.w });
  life.adopt(saved);
  bornAt = saved.bornAt;
  ourSavedAt = saved.savedAt;
  life.ticker.queueSpecial(`the universe remembers generation ${life.generation.toLocaleString('en-US')}`);
} else {
  life = new InfiniteLife(term.gridRows, term.cols);
}

// ── One frame of the terminal's loop ─────────────────────────────────────

function frame(): void {
  // ── Simulate ──
  const event = life.step();

  // ── Music update (every 2nd frame — audio smooths transitions) ──
  if (music.running && !life.paused && life.generation % 2 === 0) {
    try {
      const viewW = life.viewW;
      // Sweep speed: one full scan in ~8 seconds at ~30fps
      playheadCol = (playheadCol + Math.max(1, Math.floor(viewW / 240))) % Math.max(1, viewW);
      const disp = life.displayGrid();
      const column: boolean[] = [];
      if (playheadCol < disp.w) for (let y = 0; y < disp.h; y++) column.push(disp.data[y * disp.w + playheadCol] === 1);
      const ph = life.popHistory;
      const pop = life.population();
      const snap: SimulationSnapshot = {
        generation: life.generation,
        population: pop,
        pop_floor: life.popFloor,
        density: pop / Math.max(1, life.viewH * life.viewW),
        spread: life.spread,
        cycle_period: life.cyclePeriod,
        mood: life.detectMood(),
        epoch: life.epoch(),
        pop_delta: ph.length >= 2 ? (ph[ph.length - 1] ?? 0) - (ph[ph.length - 2] ?? 0) : 0,
        playhead_column: column,
        playhead_position: playheadCol / Math.max(1, viewW),
        viewport_rows: disp.h,
        event,
        activity_x: life.activityCenterX(),
      };
      music.update(snap);
      if (recording) {
        recorded.push(JSON.stringify({ ...snap, playhead_column: column.map((b) => (b ? 1 : 0)) }));
        if (recorded.length > MAX_RECORDED) {
          // keep the latest stretch; the oldest go
          if (recorded.length === MAX_RECORDED + 1) life.ticker.queueSpecial('the recording is full; its oldest moments are letting go');
          recorded.splice(0, recorded.length - MAX_RECORDED);
        }
      }
    } catch {
      // Never let music crash the sim
    }
  }

  // ── Auto-focus mode (every other frame) ──
  if (life.autoFocusMode && ++life.autoFocusFrame >= 2) {
    life.autoFocusFrame = 0;
    life.autoFocus();
  }

  const running = !life.paused && life.generation > 0;
  // ── Pattern census (periodic, cheap, never critical) ──
  if (running && life.generation % 150 === 0) life.takeCensus();
  // ── Autosave (insurance; the main save happens on the way out) ──
  if (running && life.generation % AUTOSAVE_EVERY === 0) persist();

  // ── Log ──
  if (event || life.generation % 10 === 0) {
    logger.log({
      gen: life.generation, pop: life.population(), spread: life.spread, floor: life.popFloor,
      cycle: life.cyclePeriod, zoom: life.zoomLevel, camY: life.camY, camX: life.camX, event,
    });
  }

  // ── The ticker moves once a frame, as render() moves it ──
  const st = term.status(life, musicStatus());
  if (st.tickerWidth >= 10) life.tickTicker(st.tickerWidth);
}

function musicStatus(): string {
  let s = music.statusString();
  if (recording) s += ` REC(${recorded.length})`;
  return s;
}

function paint(): void {
  term.render(life, term.status(life, musicStatus()), showStats);
}

let nextAt = 0;
let raf = 0;

/** Past this much work in one paint, stop and let input and the paint through. */
const FRAME_BUDGET_MS = 12;

function loop(now: number): void {
  raf = requestAnimationFrame(loop);
  const started = performance.now();
  let ran = 0;
  // Time breathes: savor catastrophes, hurry through the calm. A frame is due
  // delay × dilation after the last one; a fast setting may owe a few per paint.
  // Half a vsync early counts as on time, or a 35 ms frame would wait for 50.
  while (now >= nextAt - 8) {
    frame();
    ran++;
    nextAt = Math.max(nextAt, now - 100) + life.delay * life.timeDilation();
    if (ran >= 4 || performance.now() - started > FRAME_BUDGET_MS) {
      // a big screen can't keep this pace: drop what's owed rather than catch
      // up, or every paint would stall the keys for the whole backlog
      nextAt = Math.max(nextAt, now);
      break;
    }
  }
  if (ran) paint();
}

function startLoop(): void {
  if (raf) return;
  nextAt = performance.now();
  raf = requestAnimationFrame(loop);
}

function stopLoop(): void {
  cancelAnimationFrame(raf);
  raf = 0;
}

// ── Keys ─────────────────────────────────────────────────────────────────

function download(name: string, text: string, type: string): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function leave(): void {
  if (embedded) {
    // there is no leaving from inside a screen in oikos; ⏏ is out there
    life.ticker.queueSpecial('the glass holds; eject from the other side');
    return;
  }
  persist();
  const ref = document.referrer;
  const back = ref && new URL(ref, location.href).origin === location.origin && !ref.includes('/afterlife') ? ref : '/';
  location.href = back;
}

/** Every key the terminal knew, by name; the keys panel calls these too. */
const ACTIONS: Record<string, () => void> = {
  quit: leave,
  reseed: () => {
    const wasHaunted = life.haunted;
    life = new InfiniteLife(term.gridRows, term.cols);
    life.haunted = wasHaunted;
    bornAt = Date.now();
    playheadCol = 0;
  },
  pause: () => {
    life.paused = !life.paused;
  },
  faster: () => {
    life.delay = Math.max(10, life.delay - 10);
  },
  slower: () => {
    life.delay = Math.min(500, life.delay + 10);
  },
  home: () => life.home(),
  clear: () => life.clear(),
  zoomOut: () => life.zoomOut(),
  zoomIn: () => life.zoomIn(),
  focus: () => {
    life.autoFocusMode = !life.autoFocusMode;
    if (life.autoFocusMode) life.autoFocus(); // Immediate first focus
  },
  haunt: () => life.toggleHaunted(),
  stats: () => {
    showStats = !showStats;
  },
  record: () => {
    // Snapshot recording for music diagnostics (life_music_diag.py --replay)
    if (!music.running) {
      life.ticker.queueSpecial('nothing to record without the music');
      return;
    }
    recording = !recording;
    if (recording) recorded = [];
    else if (recorded.length) download('snapshots.jsonl', `${recorded.join('\n')}\n`, 'application/x-ndjson');
    // snapshots come every other generation, and none while paused
    else life.ticker.queueSpecial('the recording caught nothing; no snapshots to keep');
  },
  mute: () => music.running && music.toggleMute(),
  style: () => music.running && music.cycleStyle(),
  volDown: () => music.running && music.adjustVolume(-0.1),
  volUp: () => music.running && music.adjustVolume(0.1),
  up: () => life.pan(-5, 0),
  down: () => life.pan(5, 0),
  left: () => life.pan(0, -10),
  right: () => life.pan(0, 10),
  statsCsv: () => download('life_stats.csv', logger.csv(), 'text/csv'),
  help: () => toggleKeys(),
};

const KEYMAP: Record<string, keyof typeof ACTIONS> = {
  q: 'quit', r: 'reseed', ' ': 'pause', '+': 'faster', '=': 'faster', '-': 'slower', _: 'slower',
  h: 'home', c: 'clear', z: 'zoomOut', x: 'zoomIn', f: 'focus', g: 'haunt', s: 'stats', d: 'record',
  m: 'mute', v: 'style', '[': 'volDown', ']': 'volUp',
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', '?': 'help',
};

/** Held keys repeat only where more of the same is the point (speed, volume, pan, zoom). */
const REPEATS = new Set<string>(['faster', 'slower', 'volDown', 'volUp', 'up', 'down', 'left', 'right', 'zoomOut', 'zoomIn']);

function act(name: string): void {
  ACTIONS[name]?.();
  paint();
}

window.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'Escape') {
    // closing a panel isn't entering: no music for it
    if (keysPanel && !keysPanel.hidden) toggleKeys(false);
    return;
  }
  const name = KEYMAP[e.key.length === 1 ? e.key.toLowerCase() : e.key] ?? KEYMAP[e.key];
  if (!name) return;
  e.preventDefault();
  if (e.repeat && !REPEATS.has(name)) return;
  // reading the keys isn't entering either
  if (name !== 'help') wake();
  act(name);
});

// ── The splash, and the gesture that lets the music start ──────────────

let awake = false;
function wake(): void {
  if (!awake) {
    awake = true;
    splash?.classList.add('gone');
    setTimeout(() => splash?.remove(), 1600);
  }
  void music.start();
}
splash?.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  e.stopPropagation();
  wake();
});
splash?.addEventListener('keydown', (e) => {
  // it's a button: Enter or Space on it enters, and doesn't also pause
  if (e.key !== 'Enter' && e.key !== ' ') return;
  e.preventDefault();
  e.stopPropagation();
  if (!e.repeat) wake();
});
// iOS may unlock audio only as a gesture ends, not as it starts; once the
// visitor is in, every tap's end gets a chance to (re)start the music
for (const type of ['pointerup', 'click'] as const) {
  root.addEventListener(type, () => {
    if (awake) void music.start();
  });
}

function toggleKeys(show = keysPanel?.hidden ?? false): void {
  if (!keysPanel) return;
  keysPanel.hidden = !show;
  document.getElementById('keys-toggle')?.setAttribute('aria-expanded', String(show));
}
keysPanel?.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-act]');
  if (!el) return;
  e.preventDefault();
  wake();
  act(el.dataset.act ?? '');
});
document.getElementById('keys-toggle')?.addEventListener('click', (e) => {
  // like ?, opening the keys doesn't start the music
  e.preventDefault();
  toggleKeys();
});

// ── Mouse and touch: toggle cells, and a little more than a terminal had ─

/** canvas point → [terminal row, column, bottom half?] */
function cellAt(e: { clientX: number; clientY: number }): [number, number, number] {
  const r = canvas!.getBoundingClientRect();
  const cssCw = r.width / term.cols;
  const col = Math.floor((e.clientX - r.left) / cssCw);
  const px = Math.floor((e.clientY - r.top) / cssCw); // half-block pixel row
  return [Math.floor(px / 2), col, px % 2];
}

/** Pointer capture keeps a drag coming from outside the canvas; those aren't cells on screen. */
function onGrid(row: number, col: number): boolean {
  return row >= 0 && row < term.gridRows && col >= 0 && col < term.cols;
}

interface Drag {
  id: number;
  kind: 'paint' | 'pan';
  x: number;
  y: number;
  last: string;
  moved: boolean;
}
let drag: Drag | null = null;
const touches = new Map<number, { x: number; y: number }>();
let pinch = 0;

canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('pointerdown', (e) => {
  wake();
  touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (touches.size >= 2) {
    // two fingers: pinch to zoom, never paint (nor does a third)
    if (touches.size === 2) {
      const [a, b] = [...touches.values()];
      pinch = a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
    }
    drag = null;
    return;
  }
  canvas.setPointerCapture(e.pointerId);
  const pan = e.button === 1 || e.button === 2 || e.shiftKey;
  const [row, col, half] = cellAt(e);
  drag = { id: e.pointerId, kind: pan ? 'pan' : 'paint', x: e.clientX, y: e.clientY, last: '', moved: false };
  // a mouse click toggles at once (as a terminal click did); a touch waits to
  // see whether it's a tap or a drag across the universe
  if (!pan && e.pointerType === 'mouse' && onGrid(row, col)) {
    life.toggleCell(row, col, half);
    drag.last = `${row},${col},${half}`;
    paint();
  }
});
canvas.addEventListener('pointermove', (e) => {
  if (touches.has(e.pointerId)) touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (touches.size === 2 && pinch) {
    const [a, b] = [...touches.values()];
    const d = a && b ? Math.hypot(a.x - b.x, a.y - b.y) : pinch;
    if (d / pinch > 1.35) {
      act('zoomIn');
      pinch = d;
    } else if (d / pinch < 0.74) {
      act('zoomOut');
      pinch = d;
    }
    return;
  }
  if (!drag || drag.id !== e.pointerId) return;
  const touch = e.pointerType !== 'mouse';
  if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < (touch ? 10 : 2)) return;
  drag.moved = true;
  if (drag.kind === 'pan' || touch) {
    // pan in terminal cells, like the arrow keys (scaled by zoom inside pan())
    const r = canvas.getBoundingClientRect();
    const cssCw = r.width / term.cols;
    const dc = Math.trunc((drag.x - e.clientX) / cssCw);
    const dr = Math.trunc((drag.y - e.clientY) / cssCw);
    if (dc || dr) {
      life.pan(dr, dc);
      drag.x -= (dc * cssCw);
      drag.y -= (dr * cssCw);
      paint();
    }
    return;
  }
  // mouse drag: draw living cells along the way
  const [row, col, half] = cellAt(e);
  const key = `${row},${col},${half}`;
  if (key === drag.last || !onGrid(row, col)) return;
  drag.last = key;
  const [gy, gx] = life.termToWorld(row, col, half);
  life.setCell(gy, gx, 1);
  paint();
});
const endPointer = (e: PointerEvent): void => {
  touches.delete(e.pointerId);
  if (touches.size < 2) pinch = 0;
  if (!drag || drag.id !== e.pointerId) return;
  if (e.type === 'pointerup' && e.pointerType !== 'mouse' && !drag.moved) {
    const [row, col, half] = cellAt(e);
    if (onGrid(row, col)) {
      life.toggleCell(row, col, half);
      paint();
    }
  }
  drag = null;
};
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);

let wheel = 0;
canvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    wheel += e.deltaY * (e.deltaMode === 1 ? 33 : 1);
    if (Math.abs(wheel) < 120) return;
    act(wheel > 0 ? 'zoomOut' : 'zoomIn');
    wheel = 0;
  },
  { passive: false },
);

// ── Resizes, and leaving ─────────────────────────────────────────────────

window.addEventListener('resize', scheduleRefit);

// Moving the window to another screen (or browser zoom) changes the pixel
// ratio, sometimes without a resize; the query has to be re-made each time
function watchPixelRatio(): void {
  try {
    const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    mq.addEventListener(
      'change',
      () => {
        scheduleRefit();
        watchPixelRatio();
      },
      { once: true },
    );
  } catch {
    // no matchMedia listeners here: resize alone will do
  }
}
watchPixelRatio();

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    persist();
    stopLoop();
    music.suspend();
  } else {
    music.resume();
    startLoop();
  }
});
window.addEventListener('pagehide', persist);

// for scripts/shot.mjs and the curious
(window as unknown as { afterlife: unknown }).afterlife = {
  get life() {
    return life;
  },
  term,
  frame,
  paint,
  act,
  persist,
};

paint();
if (document.visibilityState !== 'hidden') startLoop();
