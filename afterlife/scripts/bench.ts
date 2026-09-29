/**
 * bench.ts — how long a frame costs, headless (life_bench.py's job).
 *
 *     npx tsx scripts/bench.ts [frames] [cols] [rows] [--haunted]
 *
 * Defaults to a 1920×1080 screen at 8px cells (240×67). Times the same
 * per-frame work main.ts does, minus painting: step, the display maps,
 * dilation, the activity centroid, and a census every 150 generations.
 */

import { InfiniteLife } from '../src/engine/life';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const frames = Number(args[0] ?? 500);
const cols = Number(args[1] ?? 240);
const rows = Number(args[2] ?? 66);
const life = new InfiniteLife(rows, cols);
if (process.argv.includes('--haunted')) life.toggleHaunted();

const t = { step: 0, display: 0, dilation: 0, census: 0 };
const times: number[] = [];
const events: string[] = [];
for (let f = 0; f < frames; f++) {
  const a = performance.now();
  const ev = life.step();
  const b = performance.now();
  life.displayGrid();
  life.displayAge();
  const c = performance.now();
  life.timeDilation();
  life.activityCenterX();
  const d = performance.now();
  if (life.generation % 150 === 0) life.takeCensus();
  const e = performance.now();
  t.step += b - a;
  t.display += c - b;
  t.dilation += d - c;
  t.census += e - d;
  times.push(e - a);
  if (ev) events.push(`${life.generation}:${ev}`);
}
times.sort((x, y) => x - y);
const total = times.reduce((s, x) => s + x, 0);
console.log(`${cols}×${rows} terminal → world ${life.worldH}×${life.worldW}, ${frames} frames${life.haunted ? ', haunted' : ''}`);
console.log(`per frame: mean ${(total / frames).toFixed(2)} ms · p50 ${times[Math.floor(frames / 2)]?.toFixed(2)} · p95 ${times[Math.floor(frames * 0.95)]?.toFixed(2)} ms`);
for (const [k, v] of Object.entries(t)) console.log(`  ${k.padEnd(9)} ${(v / frames).toFixed(2)} ms`);
console.log(`gen ${life.generation} · pop ${life.population()} · ${events.length} events · census ${JSON.stringify(Object.fromEntries(life.lastCensus))}`);
console.log(`last events: ${events.slice(-5).join('  ')}`);
