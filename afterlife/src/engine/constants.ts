/**
 * constants.ts — the physics and the palette, as life.py has them.
 *
 * Numbers here are afterlife's own and are not tuned for the web: the port's
 * promise is that the universe behaves the way it does in a terminal.
 */

// ── Palette ─────────────────────────────────────────────────────────────
// Birth (cool indigo) → youth (violet) → maturity (claude amber) → ancient (white).
// xterm-256 colour numbers; term/palette.ts turns them into RGB.
export const GRADIENT: readonly number[] = [
  17, 19, 21, // deep indigo → blue
  57, 93, // blue-violet → violet
  165, 163, // magenta
  204, 209, // salmon → orange
  214, 220, 231, // amber → gold → white
];

/** Ghost trail colours (very dim, nearly black — just a hint of motion) */
export const GHOST_COLORS: readonly number[] = [236, 234];
export const GHOST_FRAMES = GHOST_COLORS.length;

// ── Haunted mode: a resurrected bug ─────────────────────────────────────
// An early version of afterlife had no `age < 0` guard on ghost decay, so
// every never-alive cell cycled 0 → -1 → … → -6 → 0 forever: the entire
// empty universe pulsed as synchronized ghosts. On terminals with extended
// colour pairs, the ghost pair ids (463–504) then overflowed the 8-bit pair
// field in the curses attr word and aliased into the gradient dual-pair
// table — painting the void magenta and orange, and leaving every glider's
// path visible forever as a phase-shifted trail. The tables below encode
// the exact colours that aliasing produced, on purpose this time.
export const HAUNT_FRAMES = 6;
/** The 21-colour gradient of the era, needed to decode the aliased pairs */
const HAUNT_ERA_GRADIENT: readonly number[] = [
  17, 18, 19, 20, 21, 57, 56, 93, 129, 165, 164,
  163, 198, 204, 203, 209, 208, 214, 220, 229, 231,
];
const era = (i: number): number => HAUNT_ERA_GRADIENT[i] ?? 0;
/** Single ghost over true emptiness: pairs 463–468 → dual table idx 185+i. [fg, bg] */
export const HAUNT_SINGLE: readonly (readonly [number, number])[] = Array.from(
  { length: HAUNT_FRAMES },
  (_, i) => [era(Math.floor((185 + i) / 21)), era((185 + i) % 21)] as const,
);
/** Ghost over ghost (top phase i, bottom phase j): pairs 469–504 → idx 191+i*6+j. [fg, bg] */
export const HAUNT_DUAL: readonly (readonly [number, number])[] = Array.from(
  { length: HAUNT_FRAMES * HAUNT_FRAMES },
  (_, k) => [era(Math.floor((191 + k) / 21)), era((191 + k) % 21)] as const,
);

// ── Activity field ──────────────────────────────────────────────────────
// A decaying map of recent change (births + deaths). This is how the
// universe senses itself: the camera steers toward it, injections read it
// to find dead zones and living targets, the music pans with it, and time
// dilation listens for its spikes. Half-life ≈ 34 steps at 0.98/step.
// The decay multiply touches the whole world, so it's batched: applied
// every ACTIVITY_DECAY_EVERY steps at DECAY^EVERY (same integral, 1/4 the
// memory traffic).
export const ACTIVITY_DECAY = 0.98;
export const ACTIVITY_DECAY_EVERY = 4;
export const ACTIVITY_DECAY_BATCH = Math.fround(ACTIVITY_DECAY ** ACTIVITY_DECAY_EVERY);

/** Sparkline characters */
export const SPARKS = '▁▂▃▄▅▆▇█';

// ── Zoom ────────────────────────────────────────────────────────────────
export const MIN_ZOOM = -2; // 4× zoom out  (each terminal pixel = 4×4 grid cells)
export const MAX_ZOOM = 2; // 4× zoom in   (each grid cell = 4×4 terminal pixels)
export const ZOOM_LABELS: Readonly<Record<number, string>> = {
  [-2]: '0.25x', [-1]: '0.50x', 0: ' 1.0x', 1: ' 2.0x', 2: ' 4.0x',
};

// ── Pattern library ─────────────────────────────────────────────────────
export type Cells = readonly (readonly [number, number])[];

/** (row, col) offsets, verbatim from life.py */
export const PATTERNS: Readonly<Record<string, Cells>> = {
  glider: [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
  lwss: [[0, 1], [0, 4], [1, 0], [2, 0], [2, 4], [3, 0], [3, 1], [3, 2], [3, 3]],
  hwss: [[0, 3], [0, 4], [1, 1], [1, 6], [2, 0], [3, 0], [3, 6], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5]],
  r_pentomino: [[0, 1], [0, 2], [1, 0], [1, 1], [2, 1]],
  acorn: [[0, 1], [1, 3], [2, 0], [2, 1], [2, 4], [2, 5], [2, 6]],
  diehard: [[0, 6], [1, 0], [1, 1], [2, 1], [2, 5], [2, 6], [2, 7]],
  pi_heptomino: [[0, 0], [0, 1], [0, 2], [1, 1], [2, 1], [3, 0], [3, 2]],
  b_heptomino: [[0, 1], [1, 0], [1, 2], [1, 3], [2, 0], [2, 1], [3, 1]],
  gosper_gun: [[0, 24], [1, 22], [1, 24], [2, 12], [2, 13], [2, 20], [2, 21], [2, 34], [2, 35], [3, 11], [3, 15], [3, 20], [3, 21], [3, 34], [3, 35], [4, 0], [4, 1], [4, 10], [4, 16], [4, 20], [4, 21], [5, 0], [5, 1], [5, 10], [5, 14], [5, 16], [5, 17], [5, 22], [5, 24], [6, 10], [6, 16], [6, 24], [7, 11], [7, 15], [8, 12], [8, 13]],
  pulsar: [[0, 2], [0, 3], [0, 4], [0, 8], [0, 9], [0, 10], [2, 0], [2, 5], [2, 7], [2, 12], [3, 0], [3, 5], [3, 7], [3, 12], [4, 0], [4, 5], [4, 7], [4, 12], [5, 2], [5, 3], [5, 4], [5, 8], [5, 9], [5, 10], [7, 2], [7, 3], [7, 4], [7, 8], [7, 9], [7, 10], [8, 0], [8, 5], [8, 7], [8, 12], [9, 0], [9, 5], [9, 7], [9, 12], [10, 0], [10, 5], [10, 7], [10, 12], [12, 2], [12, 3], [12, 4], [12, 8], [12, 9], [12, 10]],
  pentadecathlon: [[0, 1], [1, 1], [2, 0], [2, 2], [3, 1], [4, 1], [5, 1], [6, 1], [7, 0], [7, 2], [8, 1], [9, 1]],
};

export const TRAVELLERS: readonly string[] = ['glider', 'lwss', 'hwss'];
export const METHUSELAHS: readonly string[] = ['r_pentomino', 'acorn', 'diehard', 'pi_heptomino', 'b_heptomino'];
export const OSCILLATORS: readonly string[] = ['pulsar', 'pentadecathlon'];

/**
 * Glider travel direction per place() rotation (verified empirically: one
 * cell diagonally per 4 generations). [dy, dx]
 */
export const GLIDER_DIR: readonly (readonly [number, number])[] = [
  [1, 1], [1, -1], [-1, -1], [-1, 1],
];

// ── Symmetric garden patterns ──────────────────────────────────────────
// Beautiful hand-crafted symmetric structures for rare special injections.

/** Reflect a quadrant pattern into full 4-fold symmetry around (0,0). */
function mirror4(cells: Cells): [number, number][] {
  const full = new Map<string, [number, number]>();
  for (const [r, c] of cells) {
    for (const [y, x] of [[r, c], [r, -c], [-r, c], [-r, -c]] as const) full.set(`${y},${x}`, [y, x]);
  }
  return [...full.values()];
}

export const GARDENS: readonly Cells[] = [
  // "Diamond pulsar" — a radially symmetric oscillator seed
  mirror4([
    [0, 1], [0, 2], [0, 3],
    [1, 0], [1, 4],
    [2, 0], [2, 5],
    [3, 0], [3, 5],
    [4, 1], [4, 5],
    [5, 2], [5, 3], [5, 4],
  ]),
  // "Cross bloom" — explodes outward from a cross shape
  mirror4([
    [0, 1], [0, 2], [0, 3], [0, 4],
    [1, 0], [2, 0], [3, 0], [4, 0],
    [2, 2], [3, 3],
  ]),
  // "Ring of life" — a hollow circle that breaks into travelers
  mirror4([
    [0, 3], [0, 4],
    [1, 2], [1, 5],
    [2, 1], [2, 6],
    [3, 0], [3, 7],
    [4, 0], [4, 7],
    [5, 1], [5, 6],
    [6, 2], [6, 5],
    [7, 3], [7, 4],
  ]),
];

/** generations between autosaves (plus a save whenever the page is left) */
export const AUTOSAVE_EVERY = 5000;
