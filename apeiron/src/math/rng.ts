/**
 * Deterministic PRNG utilities. A prompt's seed is its address:
 * the same seed always reconstructs the same point in the space.
 */

export type Rng = () => number;

/** mulberry32 — small, fast, good-enough 32-bit PRNG. */
export function mulberry32(seed: number): Rng {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fresh random 32-bit seed (crypto if available, Math.random fallback). */
export function randomSeed(): number {
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0] >>> 0;
    }
  } catch { /* fall through */ }
  return (Math.random() * 0x100000000) >>> 0;
}

/** Integer in [0, n). */
export function rngInt(rng: Rng, n: number): number {
  return (rng() * n) | 0;
}

/** Gaussian via Box-Muller. */
export function rngGauss(rng: Rng): number {
  const u1 = rng() || 1e-10;
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
