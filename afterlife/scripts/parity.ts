/**
 * parity.ts — is the port the same universe?
 *
 * Replays every case recorded by scripts/parity.py (life.py's own
 * InfiniteLife) through the port and compares each step's read-outs, a
 * checksum of every age, the smoothed ages and activity, the display maps,
 * the census and its sites, then the final ages, the display maps at every
 * zoom, the sparkline, the epoch and auto-focus.
 *
 * "still" cases load the recorded genesis and take the dice out, as
 * parity.py did. "live" cases keep the dice: Math.random becomes the same
 * mulberry32 stream parity.py fed life.py, so genesis, injections and the
 * dramaturge's shots must draw the same numbers in the same order (the draw
 * count is checked after every step).
 *
 * "focus" cases load hundreds of small worlds of repeated clumps and compare
 * where auto-focus lands (the hotspot's exact-tie breaking, the percentiles).
 *
 * Exits 1 if anything differs, after listing the first mismatches.
 *
 *     uv run --with scipy python scripts/parity.py /path/to/afterlife > /tmp/parity.json
 *     npx tsx scripts/parity.ts /tmp/parity.json
 */

import { readFileSync } from 'node:fs';
import { InfiniteLife } from '../src/engine/life';

type Sparse = [number, number][];
type Action = [string, ...number[]];
interface Step {
  event: string;
  pop: number;
  floor: number;
  spread: number;
  cycle: number;
  cam: [number, number];
  zoom: number;
  mood: string;
  dilation: number;
  ax: number;
  ack: number;
  sm: number;
  act: number;
  dg?: number;
  da?: number;
  dshape?: [number, number];
  census?: Record<string, number>;
  sites?: [string, number, number][];
  rng?: number;
  acted?: string[];
}
/** the port's private injectors, called on cue by the live cases */
interface Dramaturge {
  injectProvoke(): string;
  injectCollide(): boolean;
  injectGarden(): void;
  inject(intensity: string): void;
}
interface FocusCase {
  name: string;
  mode: 'focus';
  seed: number;
  rows: number;
  cols: number;
  worlds: { age: Sparse; focus: { zoom: number; cam: [number, number] } }[];
}
interface Case {
  name: string;
  mode: 'still' | 'live';
  seed: number;
  rows: number;
  cols: number;
  cam: [number, number];
  actions: Record<string, Action[]>;
  initial?: Sparse;
  rng_init?: number;
  initial_cks?: number;
  steps: Step[];
  final_age: Sparse;
  sparkline: string;
  epoch: string;
  display: Record<string, { g_shape: [number, number]; a_shape: [number, number]; g: number; a: number }>;
  focus: { zoom: number; cam: [number, number] };
}

const file = process.argv[2];
if (!file) {
  console.error('usage: tsx scripts/parity.ts parity.json');
  process.exit(2);
}
let cases: (Case | FocusCase)[];
try {
  const doc = JSON.parse(readFileSync(file, 'utf8')) as unknown;
  if (!Array.isArray(doc) || !doc.every((c) => c && typeof c === 'object' && ('steps' in c || 'worlds' in c))) {
    throw new Error('not a parity.py recording (re-record it: the format grew "mode", "ack" and live cases)');
  }
  cases = doc as (Case | FocusCase)[];
} catch (e) {
  console.error(`parity.ts: can't read ${file}: ${(e as Error).message}`);
  process.exit(2);
}

// ── the shared dice: mulberry32, as parity.py has it ──────────────────
let rngState = 0;
let draws = 0;
const nativeRandom = Math.random;
function mulberry32(): number {
  draws++;
  rngState = (rngState + 0x6d2b79f5) | 0;
  let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function dice(live: boolean, seed: number): void {
  rngState = seed | 0;
  draws = 0;
  Math.random = live ? mulberry32 : nativeRandom;
}

let failures = 0;
const fail = (what: string): void => {
  failures++;
  if (failures <= 60) console.log(`  ✗ ${what}`);
};
const close = (a: number, b: number, tol: number): boolean => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
/** parity.py's cks: sum of value × ((index mod 9973) + 1) */
function cks(a: ArrayLike<number>): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) if (a[i]) s += (a[i] as number) * ((i % 9973) + 1);
  return s;
}
function sparse(a: ArrayLike<number>): Sparse {
  const out: Sparse = [];
  for (let i = 0; i < a.length; i++) if (a[i]) out.push([i, a[i] ?? 0]);
  return out;
}
function sameSparse(a: Sparse, b: Sparse): string | null {
  if (a.length !== b.length) return `${a.length} vs ${b.length} nonzero`;
  for (let i = 0; i < a.length; i++) {
    if (a[i]?.[0] !== b[i]?.[0] || a[i]?.[1] !== b[i]?.[1]) return `first difference at ${JSON.stringify(a[i])} vs ${JSON.stringify(b[i])}`;
  }
  return null;
}
/** the dice, taken out the same way parity.py takes them out */
function still(life: InfiniteLife): void {
  const l = life as unknown as Record<string, unknown>;
  l.inject = () => undefined;
  l.injectFromEdge = () => undefined;
  l.injectGarden = () => undefined;
  l.injectProvoke = () => '';
  l.injectCollide = () => false;
}
function resetDisplayCaches(life: InfiniteLife): void {
  const l = life as unknown as { dispGridCache: unknown; dispAgeCache: unknown };
  l.dispGridCache = null;
  l.dispAgeCache = null;
}

const summary: string[] = [];

/** auto-focus on each recorded world, from the home camera at zoom 0 */
function focusProbes(c: FocusCase): void {
  dice(false, c.seed);
  const life = new InfiniteLife(c.rows, c.cols, false);
  const home = [life.camY, life.camX] as const;
  let wrong = 0;
  c.worlds.forEach((w, i) => {
    life.age.fill(0);
    life.grid.fill(0);
    for (const [j, a] of w.age) {
      life.age[j] = a;
      life.grid[j] = a > 0 ? 1 : 0;
    }
    life.zoomLevel = 0;
    [life.camY, life.camX] = home;
    life.autoFocus();
    if (life.zoomLevel !== w.focus.zoom || life.camY !== w.focus.cam[0] || life.camX !== w.focus.cam[1]) {
      wrong++;
      fail(`world ${i + 1}: zoom ${life.zoomLevel} cam ${life.camY},${life.camX} vs ${JSON.stringify(w.focus)}`);
    }
  });
  console.log(`  ${c.worlds.length - wrong}/${c.worlds.length} worlds focus alike`);
}

cases.forEach((c, k) => {
  if (c.mode === 'focus') {
    const before = failures;
    console.log(`case ${k + 1}, ${c.name}: ${c.cols}×${c.rows} terminal, ${c.worlds.length} worlds`);
    focusProbes(c);
    summary.push(`${failures === before ? '✓' : '✗'} ${c.name}`);
    return;
  }
  const live = c.mode === 'live';
  const before = failures;
  console.log(`case ${k + 1}, ${c.name} (${c.mode}): ${c.cols}×${c.rows} terminal, ${c.steps.length} steps`);
  dice(live, c.seed);
  let life: InfiniteLife;
  if (live) {
    life = new InfiniteLife(c.rows, c.cols, true);
    if (draws !== c.rng_init) fail(`genesis drew ${draws} numbers vs ${c.rng_init}`);
    if (cks(life.age) !== c.initial_cks) fail('genesis: a different soup');
  } else {
    life = new InfiniteLife(c.rows, c.cols, false);
    for (const [i, a] of c.initial ?? []) {
      life.age[i] = a;
      life.grid[i] = a > 0 ? 1 : 0;
      life.ageSmooth[i] = a;
    }
    still(life);
  }
  if (life.camY !== c.cam[0] || life.camX !== c.cam[1]) fail(`genesis cam ${life.camY},${life.camX} vs ${c.cam}`);
  // the camera is the recorded one either way (a still case's genesis is loaded, not grown)
  [life.camY, life.camX] = c.cam;

  let firstDivergence = -1;
  c.steps.forEach((want, s) => {
    const stepBefore = failures;
    const acted: string[] = [];
    // (read through `life` each time: a resize earlier in the step replaces it)
    const dramaturge = (): Dramaturge => life as unknown as Dramaturge;
    for (const act of c.actions[String(s)] ?? []) {
      const [op, a = 0, b = 0] = act;
      if (op === 'haunt') life.toggleHaunted();
      else if (op === 'pan') life.pan(a, b);
      else if (op === 'zin') life.zoomIn();
      else if (op === 'zout') life.zoomOut();
      else if (op === 'toggle') life.toggleCell(a, b);
      else if (op === 'focus') life.autoFocus();
      else if (op === 'home') life.home();
      else if (op === 'resize') {
        // KEY_RESIZE: life.py builds (and seeds) a new world, then adopts the old
        const old = life;
        life = new InfiniteLife(a, b, live);
        if (!live) still(life);
        life.haunted = old.haunted;
        life.adopt(old.snapshot());
      }
      // the dramaturge on cue (live cases: these roll dice)
      else if (op === 'provoke') acted.push(dramaturge().injectProvoke());
      else if (op === 'collide') acted.push(dramaturge().injectCollide() ? '1' : '0');
      else if (op === 'garden') dramaturge().injectGarden();
      else if (op.startsWith('inject:')) dramaturge().inject(op.slice('inject:'.length));
      else fail(`unknown action ${op}`);
    }
    const event = life.step();
    const dil = life.timeDilation();
    const got = {
      event, pop: life.population(), floor: life.popFloor, spread: life.spread, cycle: life.cyclePeriod,
      zoom: life.zoomLevel, mood: life.detectMood(), ack: cks(life.age),
    };
    const at = `step ${s + 1}`;
    if (live && draws !== want.rng) fail(`${at} rng draws ${draws} vs ${want.rng}`);
    if (JSON.stringify(acted) !== JSON.stringify(want.acted ?? [])) fail(`${at} dramaturge: ${JSON.stringify(acted)} vs ${JSON.stringify(want.acted ?? [])}`);
    for (const key of ['event', 'pop', 'floor', 'spread', 'cycle', 'zoom', 'mood', 'ack'] as const) {
      if (got[key] !== want[key]) fail(`${at} ${key}: ${JSON.stringify(got[key])} vs ${JSON.stringify(want[key])}`);
    }
    if (life.camY !== want.cam[0] || life.camX !== want.cam[1]) fail(`${at} cam: ${life.camY},${life.camX} vs ${want.cam}`);
    if (!close(dil, want.dilation, 1e-6)) fail(`${at} dilation: ${dil} vs ${want.dilation}`);
    if (!close(life.activityCenterX(), want.ax, 1e-4)) fail(`${at} activity_x: ${life.activityCenterX()} vs ${want.ax}`);
    let sm = 0;
    for (const v of life.ageSmooth) sm += v;
    let act = 0;
    for (const v of life.activity) act += v;
    if (!close(sm, want.sm, 1e-9)) fail(`${at} age_smooth sum ${sm} vs ${want.sm}`);
    if (!close(act, want.act, 1e-9)) fail(`${at} activity sum ${act} vs ${want.act}`);
    if (want.dg !== undefined) {
      const g = life.displayGrid();
      const a = life.displayAge();
      if (cks(g.data) !== want.dg) fail(`${at} display grid (zoom ${life.zoomLevel})`);
      if (cks(a.data) !== want.da) fail(`${at} display age (zoom ${life.zoomLevel})`);
      if (a.h !== want.dshape?.[0] || a.w !== want.dshape?.[1]) fail(`${at} display shape ${a.h}×${a.w} vs ${want.dshape}`);
    }
    if (want.census) {
      life.takeCensus();
      const gotCensus = Object.fromEntries([...life.lastCensus.entries()].sort());
      if (JSON.stringify(gotCensus) !== JSON.stringify(want.census)) fail(`${at} census: ${JSON.stringify(gotCensus)} vs ${JSON.stringify(want.census)}`);
      const gs = JSON.stringify(life.lastCensusSites);
      const ws = JSON.stringify(want.sites ?? []);
      if (gs !== ws) {
        const set = (xs: readonly (readonly unknown[])[]): string => JSON.stringify(xs.map((x) => [...x]).sort());
        const sameSet = set(life.lastCensusSites) === set(want.sites ?? []);
        fail(`${at} census sites ${sameSet ? 'in a different order' : 'differ'}`);
      }
    }
    if (failures > stepBefore && firstDivergence < 0) firstDivergence = s + 1;
  });

  const d = sameSparse(sparse(life.age), c.final_age);
  if (d) fail(`final ages: ${d}`);
  if (life.sparkline() !== c.sparkline) fail(`sparkline ${life.sparkline()} vs ${c.sparkline}`);
  if (life.epoch() !== c.epoch) fail(`epoch ${life.epoch()} vs ${c.epoch}`);
  for (const [z, want] of Object.entries(c.display)) {
    life.zoomLevel = Number(z);
    resetDisplayCaches(life);
    const g = life.displayGrid();
    const a = life.displayAge();
    if (g.h !== want.g_shape[0] || g.w !== want.g_shape[1]) fail(`zoom ${z} grid shape ${g.h}×${g.w} vs ${want.g_shape}`);
    if (a.h !== want.a_shape[0] || a.w !== want.a_shape[1]) fail(`zoom ${z} age shape ${a.h}×${a.w} vs ${want.a_shape}`);
    if (cks(g.data) !== want.g) fail(`zoom ${z} display grid`);
    if (cks(a.data) !== want.a) fail(`zoom ${z} display age`);
  }
  life.autoFocus();
  if (life.zoomLevel !== c.focus.zoom || life.camY !== c.focus.cam[0] || life.camX !== c.focus.cam[1]) {
    fail(`auto_focus: zoom ${life.zoomLevel} cam ${life.camY},${life.camX} vs ${JSON.stringify(c.focus)}`);
  }

  const pops = c.steps.map((s) => s.pop);
  const events = c.steps.filter((s) => s.event).length;
  const cycles = c.steps.filter((s) => s.cycle).length;
  const censuses = c.steps.filter((s) => s.census).length;
  const drew = live ? `, ${draws} draws` : '';
  console.log(
    `  pop ${pops[0]} → ${pops[pops.length - 1]}, ${events} events, ${cycles} steps in a detected cycle, ${censuses} censuses${drew}` +
      (firstDivergence > 0 ? ` — first divergence at step ${firstDivergence}` : ''),
  );
  summary.push(`${failures === before ? '✓' : '✗'} ${c.name}`);
});

Math.random = nativeRandom;
console.log(`\n${summary.join('  ')}`);
if (failures) {
  console.log(`\n${failures} mismatch${failures === 1 ? '' : 'es'}`);
  process.exit(1);
}
console.log('\nthe same universe ✓');
