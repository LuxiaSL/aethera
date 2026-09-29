/**
 * parity-music.ts — does the port's music engine play the same evening?
 * See scripts/parity_music.py, which records the original.
 */

import { readFileSync } from 'node:fs';
import { BUFFER_SIZE, LifeMusicEngine, SAMPLE_RATE, type SimulationSnapshot } from '../src/music/engine';

const file = process.argv[2];
if (!file) {
  console.error('usage: tsx scripts/parity-music.ts music.json');
  process.exit(2);
}
const want = JSON.parse(readFileSync(file, 'utf8')) as [number[], number[]][];

const pool = new Float32Array(SAMPLE_RATE);
for (let i = 0; i < pool.length; i++) {
  // numpy: (sin(i·12.9898)·43758.5453 % 1.0)·2 − 1, with python's floored %
  const v = Math.sin(i * 12.9898) * 43758.5453;
  pool[i] = (((v % 1) + 1) % 1) * 2 - 1;
}

const moods = ['', 'booming', 'booming', 'cycle', 'cycle', 'injection', 'declining', 'sparse', 'dense', 'stagnant', 'haunted'];
const epochs = ['genesis', 'genesis', 'primordial', 'emergence', 'expansion', 'deep time', 'eternity'];

const eng = new LifeMusicEngine();
(eng as unknown as { noisePool: Float32Array }).noisePool = pool;
let worst = 0;
let worstAt = '';
let rms = 0;
let count = 0;
for (let b = 0; b < want.length; b++) {
  if (b === 30 || b === 70) eng.cycleStyle();
  const rows = 60;
  const snap: SimulationSnapshot = {
    generation: b * 4,
    population: 400 + 40 * b,
    pop_floor: 300,
    density: 0.01 + 0.002 * b,
    spread: (b * 13) % 250,
    cycle_period: moods[b % moods.length] === 'cycle' ? 3 : 0,
    mood: moods[Math.floor(b / 3) % moods.length] ?? '',
    epoch: epochs[Math.floor(b / 13) % epochs.length] ?? 'genesis',
    pop_delta: [0, 5, 35, -60, 120, 0, -25][b % 7] ?? 0,
    playhead_column: Array.from({ length: rows }, (_, r) => (r * 7 + b * 3) % 11 < 2),
    playhead_position: (b % 30) / 30,
    viewport_rows: rows,
    event: b === 12 || b === 40 ? 'inject:heavy(cycle=3)' : b === 20 ? 'inject:edge' : '',
    activity_x: 0.5 + 0.4 * Math.sin(b * 0.3),
  };
  eng.update(snap);
  const [l, r] = eng.renderStereo(BUFFER_SIZE);
  const [wl, wr] = want[b] ?? [[], []];
  for (let i = 0; i < BUFFER_SIZE; i++) {
    for (const [got, exp, ch] of [[l[i] ?? 0, wl[i] ?? 0, 'L'], [r[i] ?? 0, wr[i] ?? 0, 'R']] as const) {
      const d = Math.abs(got - exp);
      rms += exp * exp;
      count++;
      if (d > worst) {
        worst = d;
        worstAt = `buffer ${b} sample ${i} ${ch}: ${got} vs ${exp}`;
      }
    }
  }
}
rms = Math.sqrt(rms / count);
console.log(`${want.length} stereo buffers · signal rms ${rms.toFixed(4)} · worst |Δ| ${worst.toExponential(2)} (${worstAt})`);
if (worst > 1e-4) {
  console.log('the evening sounds different ✗');
  process.exit(1);
}
console.log('the same music ✓');
