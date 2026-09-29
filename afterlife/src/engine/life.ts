/**
 * life.ts — the universe.
 *
 * An infinite, self-sustaining Game of Life with zoom, ported from
 * afterlife's InfiniteLife (life.py) method for method. The simulation grid
 * extends well beyond the viewport. A camera tracks the centre of activity,
 * and life is periodically injected from beyond the visible edge. Zoom lets
 * you pull back to see the macro structure or push in to watch individual
 * interactions.
 *
 * Nothing in here touches the DOM: the page (main.ts) and oikos's screen
 * both drive this same class, and scripts/ drive it from node.
 *
 * Where numpy did a whole-array expression, this does one pass over typed
 * arrays. The one structural change is in step(): life.py has two code paths
 * (a zero-padded bounding box, and a toroidal full-world roll) that compute
 * the same physics; here they are one loop over either region, with toroidal
 * indexing throughout (inside a padded box that fits, the wrapped neighbours
 * it reads are dead anyway, which is exactly the padding's promise).
 */

import { census } from './census';
import {
  ACTIVITY_DECAY_BATCH,
  ACTIVITY_DECAY_EVERY,
  GARDENS,
  GHOST_FRAMES,
  GLIDER_DIR,
  HAUNT_FRAMES,
  MAX_ZOOM,
  METHUSELAHS,
  MIN_ZOOM,
  OSCILLATORS,
  PATTERNS,
  SPARKS,
  TRAVELLERS,
} from './constants';
import { EPOCHS, SIGHTING_MIN_COUNT, SIGHTING_MUSINGS, SIGHTING_RARITY } from './musings';
import { NewsTicker } from './ticker';

// ── python's random, as used by life.py ────────────────────────────────
/** random.randint: inclusive at both ends */
export const randint = (a: number, b: number): number => a + Math.floor(Math.random() * (b - a + 1));
export const choice = <T>(xs: readonly T[]): T => xs[Math.floor(Math.random() * xs.length)] as T;
/** python's // (floor division), which rounds toward -inf */
const fdiv = (a: number, b: number): number => Math.floor(a / b);
const clampi = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(v, hi));

const F85 = Math.fround(0.85);
const F15 = Math.fround(0.15);

/** np.percentile's default (linear) on a sorted array, then int() */
function percentileInt(sorted: ArrayLike<number>, p: number): number {
  const n = sorted.length;
  const pos = (p / 100) * (n - 1);
  const lo = Math.floor(pos);
  const hi = Math.min(n - 1, lo + 1);
  const a = sorted[lo] ?? 0;
  const b = sorted[hi] ?? 0;
  return Math.trunc(a + (b - a) * (pos - lo));
}

/** A view-sized map: rows × cols, row-major. */
export interface Plane<T extends Uint8Array | Int32Array> {
  h: number;
  w: number;
  data: T;
}

/** What an adopted or saved universe carries (life.py's universe.npz). */
export interface UniverseState {
  h: number;
  w: number;
  /** ages: > 0 alive, < 0 ghost, 0 empty. The grid is exactly age > 0. */
  age: Int32Array;
  generation: number;
  totalInjections: number;
}

/** The smallest world an InfiniteLife may have (see its constructor). */
export interface WorldFloor {
  minH?: number;
  minW?: number;
}

export class InfiniteLife {
  // view_h/view_w = the display grid at zoom 0 (half-block doubles vertical)
  readonly viewH: number;
  readonly viewW: number;
  // World must accommodate max zoom-out (4× in each axis)
  readonly worldH: number;
  readonly worldW: number;

  grid: Uint8Array;
  age: Int32Array;
  /** Smoothed age for rendering — breaks coherent oscillation stripes */
  ageSmooth: Float32Array;
  /** Activity field: decaying map of recent change (see ACTIVITY_DECAY) */
  activity: Float32Array;
  private nextRow: Uint8Array;
  private colSum: Uint8Array;

  // Camera: top-left of viewport (at zoom 0) in world coordinates
  camY: number;
  camX: number;
  autoCam = true;
  zoomLevel = 0;
  private zoomCooldown = 0; // frames until next zoom change allowed

  generation = 0;
  paused = false;
  delay = 50;

  // Population tracking
  popHistory: number[] = []; // maxlen 500
  hashHistory: number[] = []; // maxlen 60
  private cachedPop = 0;

  // ── Engine telemetry (readable by stats overlay + logger) ───
  spread = 0; // pop spread over last 150 gens
  popFloor = 0; // current minimum pop threshold
  cyclePeriod = 0; // detected cycle period (0 = none)
  lastEvent = ''; // last injection event
  lastEventGen = 0; // generation of last event
  totalInjections = 0;

  ticker = new NewsTicker();

  // Auto-focus mode: when true, autoFocus() runs every other frame
  autoFocusMode = false;
  autoFocusFrame = 0;

  // Cached display grid/age (invalidated each step, lazily recomputed)
  private dispGridCache: Plane<Uint8Array> | null = null;
  private dispAgeCache: Plane<Int32Array> | null = null;

  // Cached mood (computed once per generation)
  private cachedMood = '';
  private cachedMoodGen = -1;

  /** Bounding box from last step() — reused by calculateTargetZoom() */
  private stepBbox: [number, number, number, number] | null = null;

  /** Haunted mode: resurrects the historical ghost-decay bug. Toggled with 'g'. */
  haunted = false;

  // Pattern census: sightings of known patterns in the viewport
  lastCensus = new Map<string, number>();
  lastCensusSites: [string, number, number][] = []; // (name, wy, wx)
  private sightingGen = new Map<string, number>(); // per-pattern last announce
  private sightingCount = new Map<string, number>(); // per-pattern musing rotation
  private lastSightingGen = -1e9;

  // Dramaturge: while a staged plot (aimed gliders) is in flight,
  // cycle/stagnation injections hold their breath until this generation.
  // The population floor stays armed — it's life support.
  private dramaUntil = 0;

  // Time dilation: activity baseline (EMA) and smoothed tempo factor
  private actBaseline = 0;
  dilation = 1;

  /**
   * `world` bounds the world from below. life.py's floor (400×800) is the
   * default; a resize passes the old world so shrinking the window never
   * crops the universe, and a small screen (oikos) can pass 0 to keep only
   * 5× its view.
   */
  constructor(termRows: number, termCols: number, seed = true, world: WorldFloor = {}) {
    this.viewH = termRows * 2;
    this.viewW = termCols;
    this.worldH = Math.max(this.viewH * 5, world.minH ?? 400);
    this.worldW = Math.max(this.viewW * 5, world.minW ?? 800);
    const n = this.worldH * this.worldW;
    this.grid = new Uint8Array(n);
    this.age = new Int32Array(n);
    this.ageSmooth = new Float32Array(n);
    this.activity = new Float32Array(n);
    this.nextRow = new Uint8Array(this.worldW);
    this.colSum = new Uint8Array(this.worldW);
    this.camY = fdiv(this.worldH - this.viewH, 2);
    this.camX = fdiv(this.worldW - this.viewW, 2);
    if (seed) this.seedInitial();
  }

  // ── Seeding ─────────────────────────────────────────────────────

  private seedInitial(): void {
    const cy = fdiv(this.worldH, 2);
    const cx = fdiv(this.worldW, 2);
    const vh = this.viewH;
    const vw = this.viewW;

    for (const name of METHUSELAHS) {
      for (let i = 0; i < 2; i++) {
        this.place(name, cy + randint(-fdiv(vh, 3), fdiv(vh, 3)), cx + randint(-fdiv(vw, 3), fdiv(vw, 3)));
      }
    }
    for (let i = 0; i < 2; i++) {
      this.place('gosper_gun', cy + randint(-fdiv(vh, 4), fdiv(vh, 4)), cx + randint(-fdiv(vw, 4), fdiv(vw, 4)));
    }
    for (let i = 0; i < 20; i++) {
      const y = clampi(cy + randint(-vh, vh), 10, this.worldH - 10);
      const x = clampi(cx + randint(-vw, vw), 10, this.worldW - 10);
      this.place(choice(TRAVELLERS), y, x);
    }
    for (let i = 0; i < 4; i++) {
      this.place(choice(OSCILLATORS), cy + randint(-fdiv(vh, 3), fdiv(vh, 3)), cx + randint(-fdiv(vw, 3), fdiv(vw, 3)));
    }

    const y0 = cy - fdiv(vh, 2);
    const x0 = cx - fdiv(vw, 2);
    for (let y = 0; y < vh; y++) {
      for (let x = 0; x < vw; x++) {
        if (Math.random() < 0.035) this.grid[(y0 + y) * this.worldW + x0 + x] = 1;
      }
    }

    for (let i = 0; i < this.grid.length; i++) {
      this.age[i] = this.grid[i] ? 1 : 0;
      this.ageSmooth[i] = this.age[i] ?? 0;
    }
  }

  place(name: string, y: number, x: number, rotation?: number): void {
    const cells = PATTERNS[name];
    if (!cells) return;
    const rot = rotation ?? randint(0, 3);
    for (let [dy, dx] of cells) {
      for (let r = 0; r < rot; r++) [dy, dx] = [dx, -dy];
      const ny = y + dy;
      const nx = x + dx;
      if (ny >= 0 && ny < this.worldH && nx >= 0 && nx < this.worldW) {
        const i = ny * this.worldW + nx;
        this.grid[i] = 1;
        this.age[i] = Math.max(this.age[i] ?? 0, 1);
      }
    }
    this.invalidate();
  }

  private invalidate(): void {
    this.dispGridCache = null;
    this.dispAgeCache = null;
  }

  // ── Simulation ──────────────────────────────────────────────────

  /** Advance one generation. Returns event string (empty if none). */
  step(): string {
    if (this.paused) return '';
    this.invalidate();

    const H = this.worldH;
    const W = this.worldW;
    const g = this.grid;
    const age = this.age;

    // ── Bounding box of all active cells (alive + ghosts) ──
    let by0 = H;
    let by1 = -1;
    let bx0 = W;
    let bx1 = -1;
    for (let y = 0; y < H; y++) {
      const row = y * W;
      let first = -1;
      let last = -1;
      for (let x = 0; x < W; x++) {
        if (age[row + x] !== 0) {
          if (first < 0) first = x;
          last = x;
        }
      }
      if (first < 0) continue;
      if (y < by0) by0 = y;
      by1 = y + 1;
      if (first < bx0) bx0 = first;
      if (last + 1 > bx1) bx1 = last + 1;
    }
    const hasActivity = by1 > 0;

    // Expand by 2 cells (kernel radius 1 + birth margin 1). If the padded
    // box would spill past a world edge, toroidal wrap-around comes into
    // play — fall back to the full world instead.
    let useBbox = false;
    if (hasActivity) {
      const pad = 2;
      const fits = by0 - pad >= 0 && by1 + pad <= H && bx0 - pad >= 0 && bx1 + pad <= W;
      if (fits) {
        by0 -= pad;
        by1 += pad;
        bx0 -= pad;
        bx1 += pad;
        useBbox = (by1 - by0) * (bx1 - bx0) <= fdiv(H * W, 2);
      }
    }
    // Haunted mode keeps (nearly) every cell's age in motion — the bbox path
    // would freeze ages outside the box, so always take the full world.
    useBbox = useBbox && !this.haunted;
    this.stepBbox = hasActivity && useBbox ? [by0, by1, bx0, bx1] : null;
    if (!useBbox) {
      by0 = 0;
      by1 = H;
      bx0 = 0;
      bx1 = W;
    }

    // Temporal smoothing decays the whole world; the region adds its ages below
    const sm = this.ageSmooth;
    for (let i = 0; i < sm.length; i++) sm[i] = (sm[i] ?? 0) * F85;

    const act = this.activity;
    const next = this.nextRow;
    const cs = this.colSum;
    const ghostFloor = this.haunted ? -HAUNT_FRAMES : -GHOST_FRAMES;
    const haunted = this.haunted;
    // rows are written one behind, so the row above is still the old one
    // when the row below reads it: keep the old row y-1 and row by0 aside
    const prevOld = new Uint8Array(W);
    const firstOld = g.slice(by0 * W, by0 * W + W);
    let pop = 0;

    for (let y = by0; y < by1; y++) {
      const rowUp = y === 0 ? H - 1 : y - 1;
      const rowDn = y === H - 1 ? 0 : y + 1;
      const up = y === by0 ? null : prevOld; // old row y-1 (already overwritten in g)
      const base = y * W;
      const upBase = rowUp * W;
      // the row below is never written yet, unless it wrapped round to by0
      const dnIsFirst = rowDn === by0 && y !== by0;
      const dnBase = rowDn * W;
      // column sums over the three old rows, for this region's columns ±1
      const xa = bx0 === 0 ? 0 : bx0 - 1;
      const xb = bx1 === W ? W : bx1 + 1;
      for (let x = xa; x < xb; x++) {
        const u = up ? (up[x] ?? 0) : (g[upBase + x] ?? 0);
        const d = dnIsFirst ? (firstOld[x] ?? 0) : (g[dnBase + x] ?? 0);
        cs[x] = u + (g[base + x] ?? 0) + d;
      }
      if (bx0 === 0 && bx1 === W) {
        // full-width rows wrap left↔right
        for (let x = 0; x < W; x++) {
          const l = x === 0 ? W - 1 : x - 1;
          const r = x === W - 1 ? 0 : x + 1;
          next[x] = (cs[l] ?? 0) + (cs[x] ?? 0) + (cs[r] ?? 0) - (g[base + x] ?? 0);
        }
      } else {
        for (let x = bx0; x < bx1; x++) {
          next[x] = (cs[x - 1] ?? 0) + (cs[x] ?? 0) + (cs[x + 1] ?? 0) - (g[base + x] ?? 0);
        }
      }
      // keep this row's old state for the row below, then write the new one
      prevOld.set(g.subarray(base + xa, base + xb), xa);
      for (let x = bx0; x < bx1; x++) {
        const i = base + x;
        const n = next[x] ?? 0;
        const alive = g[i] === 1;
        const birth = !alive && n === 3;
        const survive = alive && (n === 3 || n === 2);
        if (birth || (alive && !survive)) act[i] = (act[i] ?? 0) + 1;
        const a = age[i] ?? 0;
        let na: number;
        if (survive) na = a + 1;
        else if (birth) na = 1;
        else if (a > 0) na = -1;
        // the resurrected bug: no `age < 0` guard in haunted mode, so
        // never-alive cells (age 0) fall into the decay branch too and the
        // whole empty universe cycles 0 → -1 → … → -HAUNT_FRAMES → 0
        else if ((haunted || a < 0) && a > ghostFloor) na = a - 1;
        else na = 0;
        age[i] = na;
        sm[i] = (sm[i] ?? 0) + Math.fround(Math.fround(na) * F15); // float32, as numpy rounds it
        const v = birth || survive ? 1 : 0;
        g[i] = v;
        pop += v;
      }
    }

    this.generation += 1;

    // Batched activity decay (see ACTIVITY_DECAY_EVERY)
    if (this.generation % ACTIVITY_DECAY_EVERY === 0) {
      for (let i = 0; i < act.length; i++) act[i] = (act[i] ?? 0) * ACTIVITY_DECAY_BATCH;
    }

    this.cachedPop = pop;
    this.popHistory.push(pop);
    if (this.popHistory.length > 500) this.popHistory.shift();

    this.hashHistory.push(this.viewportHash());
    if (this.hashHistory.length > 60) this.hashHistory.shift();

    const event = this.ensureLife(pop);
    this.updateCamera();
    return event;
  }

  /** hash(raw viewport bytes): two FNV-1a lanes folded into one safe integer */
  private viewportHash(): number {
    const [y0, x0] = this.clampCam();
    let h1 = 0x811c9dc5;
    let h2 = 0x01000193;
    for (let y = 0; y < this.viewH; y++) {
      const row = (y0 + y) * this.worldW + x0;
      for (let x = 0; x < this.viewW; x++) {
        const v = this.grid[row + x] ?? 0;
        h1 = Math.imul(h1 ^ v, 16777619);
        h2 = Math.imul(h2 ^ (v + 0x9e), 2246822519);
      }
    }
    return (h1 >>> 0) * 2097152 + ((h2 >>> 0) & 0x1fffff);
  }

  // ── Infinity engine ─────────────────────────────────────────────

  /**
   * The core 'infinite' mechanic. Returns event name if triggered.
   *
   * Tunable parameters (visible in stats):
   *   - pop_floor: ~2.5% of default viewport area
   *   - stagnation window: 150 generations
   *   - stagnation threshold: spread < max(8, floor/8)
   *   - cycle detection: periods 1-30
   *   - edge spawn interval: every 300 generations
   */
  private ensureLife(population: number): string {
    const viewportArea = this.viewH * this.viewW;
    const baseFloor = fdiv(viewportArea, 40);
    // Adaptive floor: rises to ~20% of recent average population, so the
    // simulation faces real challenges at higher pop counts too. Clamped to
    // base_floor minimum so bootstrap still works.
    const ph = this.popHistory;
    const phLen = ph.length;
    if (phLen >= 100) {
      let recentSum = 0;
      for (let i = phLen - 100; i < phLen; i++) recentSum += ph[i] ?? 0;
      this.popFloor = Math.max(baseFloor, Math.trunc(recentSum * 0.002)); // /100 * 0.20
    } else {
      this.popFloor = baseFloor;
    }

    // ── Stagnation spread ──
    this.spread = 0;
    if (phLen >= 150) {
      let lo = ph[phLen - 1] ?? 0;
      let hi = lo;
      for (let i = phLen - 150; i < phLen; i++) {
        const v = ph[i] ?? 0;
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
      this.spread = hi - lo;
    }
    const stagnant = phLen >= 150 && this.spread < Math.max(8, fdiv(this.popFloor, 8));

    // ── Cycle detection ──
    this.cyclePeriod = 0;
    const hh = this.hashHistory;
    const hhLen = hh.length;
    if (hhLen >= 4) {
      const latest = hh[hhLen - 1];
      for (let period = 1; period < Math.min(31, hhLen); period++) {
        if (hh[hhLen - 1 - period] === latest) {
          this.cyclePeriod = period;
          break;
        }
      }
    }

    // ── Act ──
    // While a staged plot is in flight (aimed gliders travelling),
    // cycle/stagnation responses hold their breath and let it arrive.
    // The population floor stays armed — it's life support, not drama.
    const dramaPending = this.generation < this.dramaUntil;

    let event = '';
    if (population < fdiv(this.popFloor, 3)) {
      event = 'inject:massive';
      this.inject('massive');
    } else if (population < this.popFloor) {
      event = 'inject:heavy(low_pop)';
      this.inject('heavy');
    } else if (this.cyclePeriod > 0 && !dramaPending) {
      // An attractor: prefer assassination over carpet-bombing.
      const target = Math.random() < 0.65 ? this.injectProvoke() : '';
      if (target) {
        event = `inject:provoke(cycle=${this.cyclePeriod},${target})`;
      } else {
        event = `inject:heavy(cycle=${this.cyclePeriod})`;
        this.inject('heavy');
      }
    } else if (stagnant && !dramaPending) {
      // Quiet stretch: stage a collision instead of dumping mass.
      if (Math.random() < 0.7 && this.injectCollide()) {
        event = 'inject:collide(stagnant)';
      } else {
        event = 'inject:medium(stagnant)';
        this.inject('medium');
      }
    } else if (this.generation % 5000 === 0 && this.generation > 0) {
      // Rare garden event — a beautiful symmetric pattern appears
      event = 'inject:garden';
      this.injectGarden();
    } else if (this.generation % 300 === 0 && this.generation > 0) {
      event = 'inject:edge';
      this.injectFromEdge();
      this.injectFromEdge();
    }

    if (event) {
      this.lastEvent = event;
      this.lastEventGen = this.generation;
      this.totalInjections += 1;
    }
    return event;
  }

  private inject(intensity: 'massive' | 'heavy' | 'medium' = 'medium'): void {
    const n = { massive: 8, heavy: 5, medium: 3 }[intensity];
    for (let i = 0; i < n; i++) {
      let name: string;
      if (intensity === 'massive' && Math.random() < 0.3) name = 'gosper_gun';
      else if (Math.random() < 0.4) name = choice(METHUSELAHS);
      else name = choice([...TRAVELLERS, ...OSCILLATORS]);

      // New life blooms where it's darkest (jitter breaks the block-grid
      // regularity of the void finder)
      const [y, x] = this.findQuietSpot();
      this.place(name, y + randint(-6, 6), x + randint(-6, 6));
    }
    if (intensity === 'massive' || intensity === 'heavy') {
      const [y, x] = this.findQuietSpot();
      this.place('gosper_gun', y, x);
    }
  }

  private injectFromEdge(): void {
    const cy = this.camY + fdiv(this.viewH, 2);
    const cx = this.camX + fdiv(this.viewW, 2);
    const vh3 = fdiv(this.viewH, 3);
    const vw3 = fdiv(this.viewW, 3);
    const edge = choice(['top', 'bottom', 'left', 'right'] as const);
    let y: number;
    let x: number;
    let rot: number;
    if (edge === 'top') [y, x, rot] = [this.camY + 2, cx + randint(-vw3, vw3), 2];
    else if (edge === 'bottom') [y, x, rot] = [this.camY + this.viewH - 5, cx + randint(-vw3, vw3), 0];
    else if (edge === 'left') [y, x, rot] = [cy + randint(-vh3, vh3), this.camX + 2, 1];
    else [y, x, rot] = [cy + randint(-vh3, vh3), this.camX + this.viewW - 10, 3];
    this.place(choice(TRAVELLERS), y, x, rot);
  }

  /** Place a symmetric garden pattern near the camera center. */
  private injectGarden(): void {
    const cy = this.camY + fdiv(this.viewH, 2);
    const cx = this.camX + fdiv(this.viewW, 2);
    const garden = choice(GARDENS);
    // Offset slightly from dead center for visual interest
    const oy = randint(-fdiv(this.viewH, 6), fdiv(this.viewH, 6));
    const ox = randint(-fdiv(this.viewW, 6), fdiv(this.viewW, 6));
    for (const [dy, dx] of garden) {
      const ny = cy + oy + dy;
      const nx = cx + ox + dx;
      if (ny >= 0 && ny < this.worldH && nx >= 0 && nx < this.worldW) {
        this.grid[ny * this.worldW + nx] = 1;
        this.age[ny * this.worldW + nx] = 1;
      }
    }
    this.invalidate();
  }

  // ── Dramaturge ──────────────────────────────────────────────────
  // Injections with intention. The engine reads the activity field and the
  // census, then composes events instead of rolling dice: new life blooms in
  // the darkest visible void, assassins are aimed at named citizens,
  // collisions are scheduled in the quiet.

  /**
   * Pick a low-occupancy, low-activity spot in the visible region.
   *
   * Block-reduces occupancy + activity over the current zoom cover and
   * chooses randomly among the darkest quintile, so revivals bloom in the
   * void where there's room to watch them grow.
   */
  findQuietSpot(): [number, number] {
    const [cy, cx] = this.viewCenter();
    const factor = this.zoomLevel < 0 ? 1 << -this.zoomLevel : 1;
    const coverH = Math.min(this.worldH, this.viewH * factor);
    const coverW = Math.min(this.worldW, this.viewW * factor);
    const y0 = Math.max(0, Math.min(cy - fdiv(coverH, 2), this.worldH - coverH));
    const x0 = Math.max(0, Math.min(cx - fdiv(coverW, 2), this.worldW - coverW));

    const B = 16;
    const bh = fdiv(coverH, B);
    const bw = fdiv(coverW, B);
    if (bh < 2 || bw < 2) return [cy, cx];

    const score = new Float64Array(bh * bw);
    for (let y = 0; y < bh * B; y++) {
      const row = (y0 + y) * this.worldW + x0;
      const sr = fdiv(y, B) * bw;
      for (let x = 0; x < bw * B; x++) {
        const k = sr + fdiv(x, B);
        score[k] = (score[k] ?? 0) + (this.grid[row + x] ?? 0) * 2 + (this.activity[row + x] ?? 0);
      }
    }
    const k = Math.max(1, fdiv(score.length, 5));
    const order = Array.from(score.keys()).sort((a, b) => (score[a] ?? 0) - (score[b] ?? 0));
    const pick = choice(order.slice(0, k));
    const by = fdiv(pick, bw);
    const bx = pick % bw;
    return [y0 + by * B + fdiv(B, 2), x0 + bx * B + fdiv(B, 2)];
  }

  /**
   * Place a glider `dist` cells out, aimed to pass through (ty, tx).
   *
   * The origin must sit inside the raw viewport (so the staging itself breaks
   * any viewport-hash cycle) with a clear launch pad. Returns true on
   * placement; ETA is dist * 4 generations.
   */
  private aimGlider(ty: number, tx: number, dist: number, rot: number): boolean {
    const [dy, dx] = GLIDER_DIR[rot] ?? [1, 1];
    const oy = ty - dy * dist;
    const ox = tx - dx * dist;
    const [vy0, vx0] = this.clampCam();
    if (!(vy0 + 2 <= oy && oy < vy0 + this.viewH - 5 && vx0 + 2 <= ox && ox < vx0 + this.viewW - 5)) return false;
    for (let y = Math.max(0, oy - 2); y < Math.min(this.worldH, oy + 5); y++) {
      for (let x = Math.max(0, ox - 2); x < Math.min(this.worldW, ox + 5); x++) {
        if (this.grid[y * this.worldW + x]) return false;
      }
    }
    this.place('glider', oy, ox, rot);
    return true;
  }

  /** Aim a glider at a named citizen (rarest first). Returns the target's
   *  name, or '' if no shot lined up. */
  private injectProvoke(): string {
    const sites = [...this.lastCensusSites];
    if (!sites.length) return '';
    sites.sort((a, b) => (SIGHTING_RARITY[b[0]] ?? 0) - (SIGHTING_RARITY[a[0]] ?? 0));
    // Consider the most notable few, in order
    for (const [name, ty, tx] of sites.slice(0, 6)) {
      const dist = randint(35, 60);
      const rots = [0, 1, 2, 3];
      for (let i = rots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rots[i], rots[j]] = [rots[j] ?? 0, rots[i] ?? 0];
      }
      for (const rot of rots) {
        if (this.aimGlider(ty, tx, dist, rot)) {
          this.dramaUntil = this.generation + dist * 4 + 150;
          this.ticker.queueSpecial('the cosmos takes aim');
          return name;
        }
      }
    }
    return '';
  }

  /** Stage a head-on glider collision at a quiet visible spot. */
  private injectCollide(): boolean {
    let [ty, tx] = this.findQuietSpot();
    const [vy0, vx0] = this.clampCam();

    for (let attempt = 0; attempt < 6; attempt++) {
      // Pick the throw distance first, then clamp the meeting point into the
      // band where both launch pads provably fit inside the viewport
      // (origins sit at target ∓ dist on each axis).
      const dist = randint(16, 34);
      const loY = vy0 + dist + 3;
      const hiY = vy0 + this.viewH - dist - 6;
      const loX = vx0 + dist + 3;
      const hiX = vx0 + this.viewW - dist - 6;
      if (loY >= hiY || loX >= hiX) continue; // viewport too small for this throw
      ty = Math.max(loY, Math.min(ty, hiY));
      tx = Math.max(loX, Math.min(tx, hiX));
      const rot = randint(0, 3);
      // Jitter varies the collision outcome; right-angle approaches (rot ± 1)
      // explode far more often than head-on (rot + 2), which mostly
      // annihilates quietly — measured 14/49 vs 1/49 explosion geometries.
      const jy = randint(-3, 3);
      const jx = randint(-3, 3);
      if (!this.aimGlider(ty, tx, dist, rot)) continue;
      // First glider is in flight; try to give it a partner. (If none fits,
      // a lone glider crossing the quiet is still a scene — keep the
      // appointment either way.)
      const partnerRot = (rot + choice([1, 3])) % 4;
      const paired = this.aimGlider(ty + jy, tx + jx, dist, partnerRot);
      this.dramaUntil = this.generation + dist * 4 + 150;
      this.ticker.queueSpecial(paired ? 'two gliders, one appointment' : 'a lone glider, sent into the dark');
      return true;
    }
    return false;
  }

  // ── Camera ──────────────────────────────────────────────────────

  /** Calculate optimal zoom level based on activity spread. */
  private calculateTargetZoom(): number {
    // Every nonzero age lives inside the bbox recorded by step(), so restrict
    // the scan to it. Falls back to the full world otherwise.
    const [by0, by1, bx0, bx1] = this.stepBbox ?? [0, this.worldH, 0, this.worldW];
    const W = this.worldW;

    // Find recent activity (age 1-10) or fall back to all living cells
    let nActive = 0;
    for (let y = by0; y < by1 && nActive < 5; y++) {
      for (let x = bx0; x < bx1; x++) {
        const a = this.age[y * W + x] ?? 0;
        if (a >= 1 && a <= 10 && ++nActive >= 5) break;
      }
    }
    const recent = nActive >= 5;
    const ys: number[] = [];
    const xs: number[] = [];
    for (let y = by0; y < by1; y++) {
      for (let x = bx0; x < bx1; x++) {
        const i = y * W + x;
        const hit = recent ? (this.age[i] ?? 0) >= 1 && (this.age[i] ?? 0) <= 10 : this.grid[i] !== 0;
        if (hit) {
          ys.push(y);
          xs.push(x);
        }
      }
    }
    if (ys.length < 2) return this.zoomLevel;

    // Use a percentile range for a tight bbox that ignores outliers
    const sx = Int32Array.from(xs).sort();
    const yLo = percentileInt(ys, 15);
    const yHi = percentileInt(ys, 85);
    const xLo = percentileInt(sx, 15);
    const xHi = percentileInt(sx, 85);
    const bboxH = Math.max(4, yHi - yLo + 1);
    const bboxW = Math.max(4, xHi - xLo + 1);

    // Choose zoom to fit the core activity in ~50% of viewport
    let best = MIN_ZOOM;
    for (let z = MAX_ZOOM; z >= MIN_ZOOM; z--) {
      const mag = 2 ** z;
      if (bboxH <= (this.viewH / mag) * 0.5 && bboxW <= (this.viewW / mag) * 0.5) {
        best = z;
        break;
      }
    }
    return clampi(best, MIN_ZOOM, MAX_ZOOM);
  }

  private updateCamera(): void {
    if (!this.autoCam) return;

    const pad = 30;
    const y0 = Math.max(0, this.camY - pad);
    const y1 = Math.min(this.worldH, this.camY + this.viewH + pad);
    const x0 = Math.max(0, this.camX - pad);
    const x1 = Math.min(this.worldW, this.camX + this.viewW + pad);
    const W = this.worldW;

    // Steer toward drama: centroid of squared activity (squaring emphasizes
    // hotspots — an explosion outweighs a blinker farm). Falls back to the
    // population centroid when the region is calm.
    let total = 0;
    let wy = 0;
    let wx = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const a = this.activity[y * W + x] ?? 0;
        if (a === 0) continue;
        const a2 = a * a;
        total += a2;
        wy += a2 * (y - y0);
        wx += a2 * (x - x0);
      }
    }
    if (total > 25) {
      this.steer(Math.trunc(wy / total) + y0, Math.trunc(wx / total) + x0);
      this.advanceAutoZoom();
      return;
    }

    let n = 0;
    let sy = 0;
    let sx = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        if (this.grid[y * W + x]) {
          n++;
          sy += y - y0;
          sx += x - x0;
        }
      }
    }
    if (n > 0) this.steer(Math.trunc(sy / n) + y0, Math.trunc(sx / n) + x0);
    this.advanceAutoZoom();
  }

  private steer(cy: number, cx: number): void {
    const ty = clampi(cy - fdiv(this.viewH, 2), 0, this.worldH - this.viewH);
    const tx = clampi(cx - fdiv(this.viewW, 2), 0, this.worldW - this.viewW);
    this.camY = Math.trunc(this.camY + (ty - this.camY) * 0.04);
    this.camX = Math.trunc(this.camX + (tx - this.camX) * 0.04);
  }

  /** Auto-zoom: gradually step toward optimal zoom level.
   *  Throttled: only recalculates every 4th frame when cooldown is 0. */
  private advanceAutoZoom(): void {
    this.zoomCooldown = Math.max(0, this.zoomCooldown - 1);
    if (this.zoomCooldown !== 0 || this.generation % 4 !== 0) return;
    const target = this.calculateTargetZoom();
    if (target > this.zoomLevel && this.zoomLevel < MAX_ZOOM) {
      this.zoomLevel += 1;
      this.zoomCooldown = 45; // ~1.5 sec at 30fps before next change
    } else if (target < this.zoomLevel && this.zoomLevel > MIN_ZOOM) {
      // Verify zoom out is safe (world can fit the expanded view)
      const nz = this.zoomLevel - 1;
      const factor = nz >= 0 ? 1 : 1 << -nz;
      if (this.viewH * factor <= this.worldH && this.viewW * factor <= this.worldW) {
        this.zoomLevel = nz;
        this.zoomCooldown = 45;
      }
    }
  }

  // ── Viewport access (raw = zoom 0, display = current zoom) ─────

  clampCam(): [number, number] {
    return [clampi(this.camY, 0, this.worldH - this.viewH), clampi(this.camX, 0, this.worldW - this.viewW)];
  }

  viewCenter(): [number, number] {
    const [y0, x0] = this.clampCam();
    return [y0 + fdiv(this.viewH, 2), x0 + fdiv(this.viewW, 2)];
  }

  /** The raw viewport (zoom 0) as a view_h × view_w occupancy map. */
  rawViewGrid(): Plane<Uint8Array> {
    const [y0, x0] = this.clampCam();
    const out = new Uint8Array(this.viewH * this.viewW);
    for (let y = 0; y < this.viewH; y++) {
      const src = (y0 + y) * this.worldW + x0;
      out.set(this.grid.subarray(src, src + this.viewW), y * this.viewW);
    }
    return { h: this.viewH, w: this.viewW, data: out };
  }

  /** The region the current zoom shows: [y0, x0, h, w, factor, zoomedIn]. */
  private cover(): [number, number, number, number, number, boolean] | null {
    const [cy, cx] = this.viewCenter();
    if (this.zoomLevel < 0) {
      const factor = 1 << -this.zoomLevel; // 2 or 4
      const ch = this.viewH * factor;
      const cw = this.viewW * factor;
      if (ch > this.worldH || cw > this.worldW) return null;
      const y0 = Math.max(0, Math.min(cy - fdiv(ch, 2), this.worldH - ch));
      const x0 = Math.max(0, Math.min(cx - fdiv(cw, 2), this.worldW - cw));
      return [y0, x0, ch, cw, factor, false];
    }
    const factor = 1 << this.zoomLevel; // 2 or 4
    const ch = Math.max(2, fdiv(this.viewH, factor));
    const cw = Math.max(2, fdiv(this.viewW, factor));
    const y0 = Math.max(0, Math.min(cy - fdiv(ch, 2), this.worldH - ch));
    const x0 = Math.max(0, Math.min(cx - fdiv(cw, 2), this.worldW - cw));
    return [y0, x0, ch, cw, factor, true];
  }

  /** Grid scaled for the current zoom level, sized (about) view_h × view_w. */
  displayGrid(): Plane<Uint8Array> {
    if (!this.dispGridCache) this.dispGridCache = this.computeDisplayGrid();
    return this.dispGridCache;
  }

  private computeDisplayGrid(): Plane<Uint8Array> {
    if (this.zoomLevel === 0) return this.rawViewGrid();
    const c = this.cover();
    if (!c) return this.rawViewGrid();
    const [y0, x0, ch, cw, f, zoomedIn] = c;
    const W = this.worldW;
    if (!zoomedIn) {
      const bh = fdiv(ch, f);
      const bw = fdiv(cw, f);
      const out = new Uint8Array(bh * bw);
      for (let y = 0; y < bh * f; y++) {
        const src = (y0 + y) * W + x0;
        const dst = fdiv(y, f) * bw;
        for (let x = 0; x < bw * f; x++) if (this.grid[src + x]) out[dst + fdiv(x, f)] = 1;
      }
      return { h: bh, w: bw, data: out };
    }
    const h = Math.min(ch * f, this.viewH);
    const w = Math.min(cw * f, this.viewW);
    const out = new Uint8Array(h * w);
    for (let y = 0; y < h; y++) {
      const src = (y0 + fdiv(y, f)) * W + x0;
      for (let x = 0; x < w; x++) out[y * w + x] = this.grid[src + fdiv(x, f)] ?? 0;
    }
    return { h, w, data: out };
  }

  /**
   * Age map scaled for the current zoom level.
   *
   * Handles ghost trails: positive ages = alive, negative = ghost (recently
   * dead). When downsampling, prioritizes living cells; shows the brightest
   * ghost otherwise.
   */
  displayAge(): Plane<Int32Array> {
    if (!this.dispAgeCache) this.dispAgeCache = this.computeDisplayAge();
    return this.dispAgeCache;
  }

  private computeDisplayAge(): Plane<Int32Array> {
    // Haunted mode renders raw ages: the ghost phase cycle IS the visual —
    // temporal smoothing would blur the strobe into mush.
    const src: Int32Array | Float32Array = this.haunted ? this.age : this.ageSmooth;
    const W = this.worldW;
    const at = (i: number): number => Math.trunc(src[i] ?? 0); // astype(int32)

    const c = this.zoomLevel === 0 ? null : this.cover();
    if (!c) {
      const [y0, x0] = this.clampCam();
      const out = new Int32Array(this.viewH * this.viewW);
      for (let y = 0; y < this.viewH; y++) {
        const s = (y0 + y) * W + x0;
        for (let x = 0; x < this.viewW; x++) out[y * this.viewW + x] = at(s + x);
      }
      return { h: this.viewH, w: this.viewW, data: out };
    }
    const [y0, x0, ch, cw, f, zoomedIn] = c;
    if (!zoomedIn) {
      const bh = fdiv(ch, f);
      const bw = fdiv(cw, f);
      // Smart aggregation: prioritize alive (positive), then the brightest
      // ghost (least negative)
      const sentinel = -(this.haunted ? HAUNT_FRAMES : GHOST_FRAMES) - 1;
      const maxv = new Int32Array(bh * bw).fill(-2147483648);
      const ghost = new Int32Array(bh * bw).fill(sentinel);
      for (let y = 0; y < bh * f; y++) {
        const s = (y0 + y) * W + x0;
        const d = fdiv(y, f) * bw;
        for (let x = 0; x < bw * f; x++) {
          const v = at(s + x);
          const k = d + fdiv(x, f);
          if (v > (maxv[k] ?? 0)) maxv[k] = v;
          const m = v !== 0 ? v : sentinel;
          if (m > (ghost[k] ?? 0)) ghost[k] = m;
        }
      }
      const out = new Int32Array(bh * bw);
      for (let k = 0; k < out.length; k++) {
        const mv = maxv[k] ?? 0;
        const gm = ghost[k] ?? 0;
        out[k] = mv > 0 ? mv : gm > sentinel ? gm : 0;
      }
      return { h: bh, w: bw, data: out };
    }
    const h = Math.min(ch * f, this.viewH);
    const w = Math.min(cw * f, this.viewW);
    const out = new Int32Array(h * w);
    for (let y = 0; y < h; y++) {
      const s = (y0 + fdiv(y, f)) * W + x0;
      for (let x = 0; x < w; x++) out[y * w + x] = at(s + fdiv(x, f));
    }
    return { h, w, data: out };
  }

  // ── Zoom ────────────────────────────────────────────────────────

  zoomIn(): void {
    if (this.zoomLevel < MAX_ZOOM) this.zoomLevel += 1;
    this.invalidate();
  }

  zoomOut(): void {
    if (this.zoomLevel > MIN_ZOOM) {
      const nz = this.zoomLevel - 1;
      const factor = nz >= 0 ? 1 : 1 << -nz;
      // Zooming past default into negative — verify the world fits
      if (nz >= 0 || (this.viewH * factor <= this.worldH && this.viewW * factor <= this.worldW)) {
        this.zoomLevel = nz;
      }
    }
    this.invalidate();
  }

  /**
   * Zoom + pan to the densest cluster of recent activity.
   *
   * Strategy: build a coarse heat map, find the hottest spot, then use the
   * 10th–90th percentile range (not the full bounding box) of nearby active
   * cells to size the zoom — this ignores sparse outliers and focuses on the
   * tight core of the action.
   */
  autoFocus(): void {
    const H = this.worldH;
    const W = this.worldW;
    let recentCount = 0;
    let aliveCount = 0;
    for (let i = 0; i < this.age.length; i++) {
      const a = this.age[i] ?? 0;
      if (a >= 1 && a <= 10) recentCount++;
      if (this.grid[i]) aliveCount++;
    }
    const recent = recentCount >= 5;
    if ((recent ? recentCount : aliveCount) === 0) return;
    const active = (i: number): boolean => {
      const a = this.age[i] ?? 0;
      return recent ? a >= 1 && a <= 10 : this.grid[i] !== 0;
    };

    // Coarse heat map: 16×16 cell blocks
    const block = 16;
    const bh = fdiv(H, block);
    const bw = fdiv(W, block);
    if (bh < 1 || bw < 1) return;
    const heat = new Float64Array(bh * bw);
    for (let y = 0; y < bh * block; y++) {
      for (let x = 0; x < bw * block; x++) {
        if (!active(y * W + x)) continue;
        const k = fdiv(y, block) * bw + fdiv(x, block);
        heat[k] = (heat[k] ?? 0) + 1;
      }
    }

    // Find the hottest 3×3 neighbourhood (not just one block)
    let best = -1;
    let hot = 0;
    for (let by = 0; by < bh; by++) {
      for (let bx = 0; bx < bw; bx++) {
        let s = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const yy = by + dy;
            const xx = bx + dx;
            if (yy >= 0 && yy < bh && xx >= 0 && xx < bw) s += heat[yy * bw + xx] ?? 0;
          }
        }
        if (s / 9 > best) {
          best = s / 9;
          hot = by * bw + bx;
        }
      }
    }
    const focusCy = fdiv(hot, bw) * block + fdiv(block, 2);
    const focusCx = (hot % bw) * block + fdiv(block, 2);

    // Tight search region around hotspot (±2 blocks)
    const r = block * 2;
    const ry0 = Math.max(0, focusCy - r);
    const ry1 = Math.min(H, focusCy + r);
    const rx0 = Math.max(0, focusCx - r);
    const rx1 = Math.min(W, focusCx + r);
    const ys: number[] = [];
    const xs: number[] = [];
    for (let y = ry0; y < ry1; y++) {
      for (let x = rx0; x < rx1; x++) {
        if (active(y * W + x)) {
          ys.push(y - ry0);
          xs.push(x - rx0);
        }
      }
    }
    if (!ys.length) return;
    const sx = Int32Array.from(xs).sort();
    const yLo = percentileInt(ys, 10);
    const yHi = percentileInt(ys, 90);
    const xLo = percentileInt(sx, 10);
    const xHi = percentileInt(sx, 90);
    const bboxH = Math.max(4, yHi - yLo + 1);
    const bboxW = Math.max(4, xHi - xLo + 1);
    const centerY = ry0 + fdiv(yLo + yHi, 2);
    const centerX = rx0 + fdiv(xLo + xHi, 2);

    // Choose zoom to fit the core cluster in ~60% of viewport
    let bestZ = MIN_ZOOM;
    for (let z = MAX_ZOOM; z >= MIN_ZOOM; z--) {
      const mag = 2 ** z;
      if (bboxH <= (this.viewH / mag) * 0.6 && bboxW <= (this.viewW / mag) * 0.6) {
        bestZ = z;
        break;
      }
    }
    this.zoomLevel = clampi(bestZ, MIN_ZOOM, MAX_ZOOM);
    this.camY = clampi(centerY - fdiv(this.viewH, 2), 0, this.worldH - this.viewH);
    this.camX = clampi(centerX - fdiv(this.viewW, 2), 0, this.worldW - this.viewW);
    this.autoCam = false;
    this.invalidate();
  }

  // ── Controls ────────────────────────────────────────────────────

  pan(dy: number, dx: number): void {
    this.autoCam = false;
    // Scale pan speed with zoom: faster when zoomed out, slower when in
    const factor = 2 ** -this.zoomLevel;
    const sy = dy !== 0 ? Math.max(1, Math.trunc(Math.abs(dy) * factor)) * Math.sign(dy) : 0;
    const sx = dx !== 0 ? Math.max(1, Math.trunc(Math.abs(dx) * factor)) * Math.sign(dx) : 0;
    this.camY = clampi(this.camY + sy, 0, this.worldH - this.viewH);
    this.camX = clampi(this.camX + sx, 0, this.worldW - this.viewW);
    this.invalidate();
  }

  home(): void {
    this.autoCam = true;
    this.zoomLevel = 0;
    this.invalidate();
  }

  clear(): void {
    this.grid.fill(0);
    this.age.fill(0);
    this.ageSmooth.fill(0);
    this.generation = 0;
    this.popHistory = [];
    this.hashHistory = [];
    this.invalidate();
  }

  /** Run the pattern census and maybe queue a ticker sighting. */
  takeCensus(): void {
    const vg = this.rawViewGrid();
    let any = false;
    for (let i = 0; i < vg.data.length; i++) {
      if (vg.data[i]) {
        any = true;
        break;
      }
    }
    let counts = new Map<string, number>();
    if (!any) {
      this.lastCensusSites = [];
    } else {
      try {
        const res = census(vg.data, vg.h, vg.w);
        if (!res) {
          this.lastCensusSites = [];
        } else {
          const [vy0, vx0] = this.clampCam(); // viewport origin in world coords
          this.lastCensusSites = res.sites.map(([n, y, x]) => [n, vy0 + y, vx0 + x]);
          counts = res.counts;
        }
      } catch {
        // the census must never crash the sim
      }
    }
    this.lastCensus = counts;
    if (!counts.size) return;

    // Global cadence: at most one sighting per ~600 generations
    if (this.generation - this.lastSightingGen < 600) return;

    let bestName = '';
    let bestScore = 0;
    for (const [name, count] of counts) {
      if (count < (SIGHTING_MIN_COUNT[name] ?? 1)) continue;
      // Don't greet the same citizen again too soon
      if (this.generation - (this.sightingGen.get(name) ?? -1e9) < 1800) continue;
      const score = SIGHTING_RARITY[name] ?? 0;
      if (score > bestScore) {
        bestScore = score;
        bestName = name;
      }
    }
    if (!bestName) return;

    const pool = SIGHTING_MUSINGS[bestName] ?? [];
    const idx = this.sightingCount.get(bestName) ?? 0;
    this.sightingCount.set(bestName, idx + 1);
    this.ticker.queueSpecial(pool[idx % pool.length] ?? bestName);
    this.sightingGen.set(bestName, this.generation);
    this.lastSightingGen = this.generation;
  }

  // ── Persistence ─────────────────────────────────────────────────
  // The universe is a place, not a session: state survives leaving.

  snapshot(): UniverseState {
    return {
      h: this.worldH,
      w: this.worldW,
      age: this.age.slice(),
      generation: this.generation,
      totalInjections: this.totalInjections,
    };
  }

  /**
   * Adopt a prior universe's state (resume or window resize).
   *
   * The old world is embedded centered; whatever doesn't fit is cropped.
   * Derived state (smoothing, activity, histories) warms back up within a
   * few dozen generations.
   */
  adopt(s: UniverseState): void {
    const h = Math.min(this.worldH, s.h);
    const w = Math.min(this.worldW, s.w);
    const sy = fdiv(s.h - h, 2);
    const sx = fdiv(s.w - w, 2);
    const dy = fdiv(this.worldH - h, 2);
    const dx = fdiv(this.worldW - w, 2);

    this.grid.fill(0);
    this.age.fill(0);
    let pop = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let a = s.age[(sy + y) * s.w + sx + x] ?? 0;
        // Retire ghosts deeper than normal decay can reach (haunted-mode
        // ages, or a future format change) — they'd be stuck forever
        if (a < -GHOST_FRAMES) a = 0;
        const i = (dy + y) * this.worldW + dx + x;
        this.age[i] = a;
        if (a > 0) {
          this.grid[i] = 1;
          pop++;
        }
      }
    }
    this.generation = Math.max(0, Math.trunc(s.generation));
    this.totalInjections = Math.max(0, Math.trunc(s.totalInjections));
    this.ageSmooth.fill(0);
    this.activity.fill(0);
    this.hashHistory = [];
    this.cachedPop = pop;
    this.popHistory = [pop];
    this.stepBbox = null;
    this.dramaUntil = 0;
    this.invalidate();
  }

  /** Toggle haunted mode (the resurrected ghost-decay bug). */
  toggleHaunted(): void {
    this.haunted = !this.haunted;
    this.invalidate();
    if (!this.haunted) {
      // Exorcism: normal-mode decay can't retire ghosts older than
      // -GHOST_FRAMES (they'd be stuck forever), so clear them all.
      for (let i = 0; i < this.age.length; i++) {
        if ((this.age[i] ?? 0) < 0) this.age[i] = 0;
        if ((this.ageSmooth[i] ?? 0) < 0) this.ageSmooth[i] = 0;
      }
    }
  }

  /** Map a terminal cell (row, col) to world coordinates, accounting for zoom.
   *  `half` picks the bottom pixel of the half-block cell. */
  termToWorld(termY: number, termX: number, half = 0): [number, number] {
    const [cy, cx] = this.viewCenter();
    const dy = termY * 2 + half; // half-block: each term row = 2 display rows
    const dx = termX;
    if (this.zoomLevel <= 0) {
      const factor = 1 << -this.zoomLevel; // 1, 2, 4
      const baseY = cy - fdiv(this.viewH * factor, 2);
      const baseX = cx - fdiv(this.viewW * factor, 2);
      return [baseY + dy * factor, baseX + dx * factor];
    }
    const factor = 1 << this.zoomLevel; // 2, 4
    const baseY = cy - fdiv(Math.max(2, fdiv(this.viewH, factor)), 2);
    const baseX = cx - fdiv(Math.max(2, fdiv(this.viewW, factor)), 2);
    return [baseY + fdiv(dy, factor), baseX + fdiv(dx, factor)];
  }

  /** Toggle a cell at terminal coordinates, accounting for zoom. */
  toggleCell(termY: number, termX: number, half = 0): void {
    const [gy, gx] = this.termToWorld(termY, termX, half);
    this.setCell(gy, gx, this.grid[gy * this.worldW + gx] ? 0 : 1);
  }

  /** Set a world cell alive (1) or dead (0), as a toggle would leave it. */
  setCell(gy: number, gx: number, v: 0 | 1): void {
    if (gy < 0 || gy >= this.worldH || gx < 0 || gx >= this.worldW) return;
    const i = gy * this.worldW + gx;
    this.grid[i] = v;
    this.age[i] = v ? 1 : 0;
    this.invalidate();
  }

  /** Advance the news ticker by one frame. */
  tickTicker(tickerWidth: number): void {
    this.ticker.tick(tickerWidth, this.detectMood(), this.generation);
  }

  /** Classify current simulation mood for context-aware musings.
   *  Cached per generation — safe to call multiple times per frame. */
  detectMood(): string {
    if (this.cachedMoodGen === this.generation) return this.cachedMood;
    this.cachedMood = this.computeMood();
    this.cachedMoodGen = this.generation;
    return this.cachedMood;
  }

  private computeMood(): string {
    // Haunted mode possesses everything, including the ticker
    if (this.haunted) return 'haunted';

    // Recent injection gets priority (show for ~90 frames after event)
    if (this.lastEvent && this.generation - this.lastEventGen < 90) return 'injection';

    // Cycle detected
    if (this.cyclePeriod > 0) return 'cycle';

    // Milestone (every 10,000 generations, show for 120 frames)
    if (this.generation >= 10_000 && this.generation % 10_000 < 120) return 'milestone';

    // Population trends (need enough history)
    const ph = this.popHistory;
    const phLen = ph.length;
    if (phLen >= 30) {
      let first = 0;
      let second = 0;
      for (let i = phLen - 30; i < phLen - 15; i++) first += ph[i] ?? 0;
      for (let i = phLen - 15; i < phLen; i++) second += ph[i] ?? 0;
      const ratio = second / 15 / Math.max(first / 15, 1);
      if (ratio > 1.15) return 'booming';
      if (ratio < 0.85) return 'declining';
    }

    // Density
    const pop = phLen ? (ph[phLen - 1] ?? 0) : 0;
    const density = pop / Math.max(this.viewH * this.viewW, 1);
    if (density > 0.15) return 'dense';
    if (pop < this.popFloor && pop > 0) return 'sparse';

    // Stagnation
    if (this.spread < Math.max(8, fdiv(this.popFloor, 8)) && phLen >= 150) return 'stagnant';

    return '';
  }

  /** The current epoch name based on generation count. */
  epoch(): string {
    let name = EPOCHS[0]?.[1] ?? 'genesis';
    for (const [threshold, label] of EPOCHS) if (this.generation >= threshold) name = label;
    return name;
  }

  population(): number {
    return this.cachedPop;
  }

  /**
   * Horizontal centroid of viewport activity, 0.0 (left) – 1.0 (right).
   * Feeds the music engine's stereo field: the arpeggio pans toward where
   * the universe is actually changing. 0.5 when calm.
   */
  activityCenterX(): number {
    const [y0, x0] = this.clampCam();
    let total = 0;
    let idx = 0;
    for (let y = 0; y < this.viewH; y++) {
      const row = (y0 + y) * this.worldW + x0;
      for (let x = 0; x < this.viewW; x++) {
        const a = this.activity[row + x] ?? 0;
        total += a;
        idx += a * x;
      }
    }
    if (total < 1 || this.viewW < 2) return 0.5;
    return idx / total / (this.viewW - 1);
  }

  /** Total activity in the viewport (drama meter for time dilation). */
  viewportActivity(): number {
    const [y0, x0] = this.clampCam();
    let total = 0;
    for (let y = 0; y < this.viewH; y++) {
      const row = (y0 + y) * this.worldW + x0;
      for (let x = 0; x < this.viewW; x++) total += this.activity[row + x] ?? 0;
    }
    return total;
  }

  /**
   * Frame-delay factor: > 1 savors drama, < 1 hurries the calm.
   *
   * Compares viewport activity against its own long-run baseline (EMA), so
   * "dramatic" is always relative to this universe's normal. Call once per
   * frame; disabled while the user drives the camera.
   */
  timeDilation(): number {
    if (!this.autoCam) return 1;
    const act = this.viewportActivity();
    if (this.actBaseline <= 0) {
      this.actBaseline = Math.max(act, 1);
      return 1;
    }
    // Asymmetric baseline: rises fast (a burst is savored briefly, then
    // absorbed as the new normal), decays slow (a lull reads as fast-forward
    // until it becomes the new normal). Drama is always a *change*, relative
    // to this universe's own recent history.
    const alpha = act > this.actBaseline ? 0.015 : 0.003;
    this.actBaseline = this.actBaseline * (1 - alpha) + act * alpha;
    const ratio = act / Math.max(this.actBaseline, 1);
    let target = ratio > 1 ? Math.min(1.6, 1 + (ratio - 1) * 0.7) : 0.7 + ratio * 0.3;
    if (act < 60) target = Math.min(target, 0.7); // near-dead viewport: don't linger
    // Smooth the factor itself so tempo never jitters
    this.dilation = this.dilation * 0.85 + target * 0.15;
    return this.dilation;
  }

  sparkline(width = 24): string {
    const ph = this.popHistory;
    if (ph.length < 2) return '';
    const start = Math.max(0, ph.length - width);
    let lo = ph[start] ?? 0;
    let hi = lo;
    for (let i = start; i < ph.length; i++) {
      const v = ph[i] ?? 0;
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    const n = SPARKS.length - 1;
    const mid = SPARKS[Math.floor(SPARKS.length / 2)] ?? '▅';
    let out = '';
    for (let i = start; i < ph.length; i++) {
      const v = ph[i] ?? 0;
      out += hi === lo ? mid : (SPARKS[Math.trunc(((v - lo) / (hi - lo)) * n)] ?? '');
    }
    return out;
  }
}
