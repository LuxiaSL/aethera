/**
 * parity-music.ts — does the port's music engine play the same evening?
 * See scripts/parity_music.py, which records the original: the stereo mix
 * buffer by buffer, then a longer evening as its PyAudio callback played it
 * (volume, mute, soft clip), which the port answers with renderBlock().
 */

import { readFileSync } from 'node:fs';
import { BUFFER_SIZE, LifeMusicEngine, SAMPLE_RATE, type SimulationSnapshot } from '../src/music/engine';

type Buffers = [number[], number[]][];

const file = process.argv[2];
if (!file) {
  console.error('usage: tsx scripts/parity-music.ts music.json');
  process.exit(2);
}
const want = JSON.parse(readFileSync(file, 'utf8')) as { stereo?: Buffers; callback?: Buffers };
if (!Array.isArray(want.stereo) || !Array.isArray(want.callback)) {
  console.error(`${file}: not a recording from scripts/parity_music.py (rerun it; the format has a callback evening now)`);
  process.exit(2);
}

const pool = new Float32Array(SAMPLE_RATE);
for (let i = 0; i < pool.length; i++) {
  // numpy: (sin(i·12.9898)·43758.5453 % 1.0)·2 − 1, with python's floored %
  const v = Math.sin(i * 12.9898) * 43758.5453;
  pool[i] = (((v % 1) + 1) % 1) * 2 - 1;
}

const moods = ['', 'booming', 'booming', 'cycle', 'cycle', 'injection', 'declining', 'sparse', 'dense', 'stagnant', 'haunted'];
const epochs = ['genesis', 'genesis', 'primordial', 'emergence', 'expansion', 'deep time', 'eternity'];

function snapshot(b: number): SimulationSnapshot {
  const rows = 60;
  return {
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
    event: b === 12 || b === 40 || b === 480 ? 'inject:heavy(cycle=3)' : b === 20 ? 'inject:edge' : '',
    activity_x: 0.5 + 0.4 * Math.sin(b * 0.3),
  };
}

function newEngine(): LifeMusicEngine {
  const eng = new LifeMusicEngine();
  (eng as unknown as { noisePool: Float32Array }).noisePool = pool;
  return eng;
}

/** Compare every rendered sample with the recording; true if they agree. */
function compare(label: string, recorded: Buffers, render: (b: number) => [Float32Array, Float32Array]): boolean {
  let worst = 0;
  let worstAt = '';
  let rms = 0;
  let count = 0;
  for (let b = 0; b < recorded.length; b++) {
    const [l, r] = render(b);
    const [wl, wr] = recorded[b] ?? [[], []];
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
  rms = Math.sqrt(rms / Math.max(1, count));
  console.log(`${label}: ${recorded.length} stereo buffers · signal rms ${rms.toFixed(4)} · worst |Δ| ${worst.toExponential(2)} (${worstAt})`);
  return worst <= 1e-4;
}

// The stereo mix
let eng = newEngine();
const mixOk = compare('mix', want.stereo, (b) => {
  if (b === 30 || b === 70) eng.cycleStyle();
  eng.update(snapshot(b));
  return eng.renderStereo(BUFFER_SIZE);
});

// The callback evening, through renderBlock
eng = newEngine();
const left = new Float32Array(BUFFER_SIZE);
const right = new Float32Array(BUFFER_SIZE);
const blockOk = compare('callback', want.callback, (b) => {
  if (b === 30 || b === 70 || b === 300 || b === 301) eng.cycleStyle();
  eng.masterVolume = b < 400 ? 0.7 : 1.0;
  eng.muted = b >= 350 && b < 360;
  eng.update(snapshot(b));
  eng.renderBlock(left, right, BUFFER_SIZE);
  return [left, right];
});

if (!mixOk || !blockOk) {
  console.log('the evening sounds different ✗');
  process.exit(1);
}
console.log('the same music ✓');
