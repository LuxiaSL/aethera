/**
 * parity.ts — is the port the same universe?
 *
 * Replays the genesis recorded by scripts/parity.py (life.py's own
 * InfiniteLife, dice taken out) through the port and compares every step's
 * read-outs, the final state, the display maps at every zoom, the census,
 * auto-focus and haunted mode. Exits 1 on the first kind of mismatch it
 * finds, after listing them.
 *
 *     python scripts/parity.py /path/to/afterlife > /tmp/parity.json
 *     npx tsx scripts/parity.ts /tmp/parity.json
 */

import { readFileSync } from 'node:fs';
import { InfiniteLife } from '../src/engine/life';

type Sparse = [number, number][];
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
  census?: Record<string, number>;
  sites?: [string, number, number][];
}
interface Case {
  rows: number;
  cols: number;
  cam: [number, number];
  initial: Sparse;
  steps: Step[];
  final_age: Sparse;
  smooth_sum: number;
  activity_sum: number;
  sparkline: string;
  epoch: string;
  display: Record<string, { g_shape: [number, number]; a_shape: [number, number]; g: Sparse; a: Sparse }>;
  focus: { zoom: number; cam: [number, number] };
}

const file = process.argv[2];
if (!file) {
  console.error('usage: tsx scripts/parity.ts parity.json');
  process.exit(2);
}
const cases = JSON.parse(readFileSync(file, 'utf8')) as Case[];
let failures = 0;
const fail = (what: string): void => {
  failures++;
  if (failures <= 40) console.log(`  ✗ ${what}`);
};
const close = (a: number, b: number, tol: number): boolean => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

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

cases.forEach((c, k) => {
  console.log(`case ${k + 1}: ${c.cols}×${c.rows} terminal, ${c.steps.length} steps`);
  const life = new InfiniteLife(c.rows, c.cols, false);
  for (const [i, a] of c.initial) {
    life.age[i] = a;
    life.grid[i] = a > 0 ? 1 : 0;
    life.ageSmooth[i] = a;
  }
  [life.camY, life.camX] = c.cam;
  // the dice, taken out the same way parity.py takes them out
  const l = life as unknown as Record<string, unknown>;
  l.inject = () => undefined;
  l.injectFromEdge = () => undefined;
  l.injectGarden = () => undefined;
  l.injectProvoke = () => '';
  l.injectCollide = () => false;

  const hauntAt = k === 2 ? 60 : -1;
  const panAt = k === 1 ? 120 : -1;
  c.steps.forEach((want, s) => {
    if (s === hauntAt) life.toggleHaunted();
    if (s === panAt) {
      life.pan(7, -12);
      life.zoomOut();
    }
    const event = life.step();
    const dil = life.timeDilation();
    const got = {
      event, pop: life.population(), floor: life.popFloor, spread: life.spread, cycle: life.cyclePeriod,
      cam: [life.camY, life.camX], zoom: life.zoomLevel, mood: life.detectMood(),
    };
    for (const key of ['event', 'pop', 'floor', 'spread', 'cycle', 'zoom', 'mood'] as const) {
      if (got[key] !== want[key]) fail(`step ${s + 1} ${key}: ${JSON.stringify(got[key])} vs ${JSON.stringify(want[key])}`);
    }
    if (got.cam[0] !== want.cam[0] || got.cam[1] !== want.cam[1]) fail(`step ${s + 1} cam: ${got.cam} vs ${want.cam}`);
    if (!close(dil, want.dilation, 1e-6)) fail(`step ${s + 1} dilation: ${dil} vs ${want.dilation}`);
    if (!close(life.activityCenterX(), want.ax, 1e-4)) fail(`step ${s + 1} activity_x: ${life.activityCenterX()} vs ${want.ax}`);
    if (want.census) {
      life.takeCensus();
      const gotCensus = Object.fromEntries([...life.lastCensus.entries()].sort());
      if (JSON.stringify(gotCensus) !== JSON.stringify(want.census)) fail(`step ${s + 1} census: ${JSON.stringify(gotCensus)} vs ${JSON.stringify(want.census)}`);
      const gotSites = life.lastCensusSites.map((x) => [...x]).sort();
      const wantSites = (want.sites ?? []).map((x) => [...x]).sort();
      if (JSON.stringify(gotSites) !== JSON.stringify(wantSites)) fail(`step ${s + 1} census sites differ`);
      else console.log(`  census at ${s + 1}: ${JSON.stringify(want.census)}`);
    }
  });

  const d = sameSparse(sparse(life.age), c.final_age);
  if (d) fail(`final ages: ${d}`);
  let smooth = 0;
  for (const v of life.ageSmooth) smooth += v;
  let act = 0;
  for (const v of life.activity) act += v;
  if (!close(smooth, c.smooth_sum, 1e-5)) fail(`age_smooth sum ${smooth} vs ${c.smooth_sum}`);
  if (!close(act, c.activity_sum, 1e-5)) fail(`activity sum ${act} vs ${c.activity_sum}`);
  if (life.sparkline() !== c.sparkline) fail(`sparkline ${life.sparkline()} vs ${c.sparkline}`);
  if (life.epoch() !== c.epoch) fail(`epoch ${life.epoch()} vs ${c.epoch}`);

  for (const [z, want] of Object.entries(c.display)) {
    life.zoomLevel = Number(z);
    (l as { dispGridCache: unknown }).dispGridCache = null;
    (l as { dispAgeCache: unknown }).dispAgeCache = null;
    const g = life.displayGrid();
    const a = life.displayAge();
    if (g.h !== want.g_shape[0] || g.w !== want.g_shape[1]) fail(`zoom ${z} grid shape ${g.h}×${g.w} vs ${want.g_shape}`);
    if (a.h !== want.a_shape[0] || a.w !== want.a_shape[1]) fail(`zoom ${z} age shape ${a.h}×${a.w} vs ${want.a_shape}`);
    const dg = sameSparse(sparse(g.data), want.g);
    if (dg) fail(`zoom ${z} display grid: ${dg}`);
    const da = sameSparse(sparse(a.data), want.a);
    if (da) fail(`zoom ${z} display age: ${da}`);
  }

  life.autoFocus();
  if (life.zoomLevel !== c.focus.zoom || life.camY !== c.focus.cam[0] || life.camX !== c.focus.cam[1]) {
    fail(`auto_focus: zoom ${life.zoomLevel} cam ${life.camY},${life.camX} vs ${JSON.stringify(c.focus)}`);
  }
  const pops = c.steps.map((s) => s.pop);
  const events = c.steps.filter((s) => s.event).length;
  const cycles = c.steps.filter((s) => s.cycle).length;
  console.log(`  pop ${pops[0]} → ${pops[pops.length - 1]}, ${events} engine events, ${cycles} steps in a detected cycle`);
});

if (failures) {
  console.log(`\n${failures} mismatch${failures === 1 ? '' : 'es'}`);
  process.exit(1);
}
console.log('\nthe same universe ✓');
