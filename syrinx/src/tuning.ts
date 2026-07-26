/**
 * tuning.ts — geometry → harmony, consonant by construction.
 *
 * Edge lengths map onto a just-intonation pentatonic lattice, so any body the
 * creature grows is in tune with itself without ever being told about music.
 * Longer strings are lower, like real ones.
 *
 * The lattice ROOT is movable: it belongs to the eldest node, and when the
 * elder dies the key modulates (see graph.ts). Root is always folded into
 * [ROOT_MIN, ROOT_MAX) so the register stays put while the key wanders.
 */

export const OCTAVE_SPAN = 2.5;
export const LEN_MIN = 50;
export const LEN_MAX = 300;
export const ROOT_MIN = 80;
export const ROOT_MAX = 160;

/**
 * The same map, transposed down into tempo. A node's pulse rate is read off
 * its own strings exactly the way a string's pitch is read off its length:
 * long = low = slow. Deliberately *not* quantized — pitch is snapped to the
 * lattice because consonance should be free, but rhythm must be *earned* by
 * coupling. If we snapped rates to rational ratios the sequencer would be
 * back, wearing a physics costume.
 */
export const PULSE_MIN = 0.11; // Hz — the slowest a node breathes
export const PULSE_MAX = 0.52; // Hz — the fastest

/** Just-intonation major pentatonic: 1/1, 9/8, 5/4, 3/2, 5/3 */
const RATIOS = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3];

let root = 110; // A2 at genesis
let lattice: number[] = buildLattice(root);

function buildLattice(rootFreq: number): number[] {
  const freqs: number[] = [];
  const top = rootFreq * 2 ** OCTAVE_SPAN;
  for (let octave = 0; octave < Math.ceil(OCTAVE_SPAN) + 1; octave++) {
    for (const r of RATIOS) {
      const f = rootFreq * r * 2 ** octave;
      if (f <= top + 1e-6) freqs.push(f);
    }
  }
  return freqs.sort((a, b) => a - b);
}

export function getRoot(): number {
  return root;
}

/** Fold any frequency into the root register by octaves. */
export function foldToRootRange(freq: number): number {
  let f = freq;
  if (!Number.isFinite(f) || f <= 0) return root;
  while (f >= ROOT_MAX) f /= 2;
  while (f < ROOT_MIN) f *= 2;
  return f;
}

/** Re-root the whole lattice (modulation). Input is folded into register. */
export function setRoot(freq: number): void {
  if (!Number.isFinite(freq) || freq <= 0) return;
  root = foldToRootRange(freq);
  lattice = buildLattice(root);
}

/** Current lattice tones, ascending. */
export function latticeTones(): readonly number[] {
  return lattice;
}

function clamp01(t: number): number {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

/** Continuous (unsnapped) frequency for a string of this length. */
export function continuousFreq(length: number): number {
  const t = clamp01((length - LEN_MIN) / (LEN_MAX - LEN_MIN));
  return root * 2 ** ((1 - t) * OCTAVE_SPAN);
}

/** Nearest lattice tone (compared in log-space so octaves weigh evenly). */
export function snapToLattice(freq: number): number {
  let best = lattice[0] ?? root;
  let bestDist = Infinity;
  for (const f of lattice) {
    const d = Math.abs(Math.log2(f) - Math.log2(freq));
    if (d < bestDist) {
      bestDist = d;
      best = f;
    }
  }
  return best;
}

/** Snapped frequency for a string of this length. */
export function freqForLength(length: number): number {
  return snapToLattice(continuousFreq(length));
}

/** Inverse mapping: the length whose continuous pitch is exactly `freq`. */
export function lengthForFreq(freq: number): number {
  const exp = Math.log2(freq / root);
  const t = 1 - exp / OCTAVE_SPAN;
  return LEN_MIN + clamp01(t) * (LEN_MAX - LEN_MIN);
}

/**
 * Pulse rate (Hz) for a node whose strings average `length`. Geometric, so the
 * spread is even in log-space — tempo is heard in ratios, like pitch.
 */
export function pulseRateForLength(length: number): number {
  if (!Number.isFinite(length)) return PULSE_MIN;
  const t = clamp01((length - LEN_MIN) / (LEN_MAX - LEN_MIN));
  return PULSE_MAX * (PULSE_MIN / PULSE_MAX) ** t;
}

/** A random lattice tone — used to quantize rest lengths at birth. */
export function randomLatticeFreq(rand: () => number = Math.random): number {
  const i = Math.min(lattice.length - 1, Math.floor(rand() * lattice.length));
  return lattice[i] ?? root;
}
