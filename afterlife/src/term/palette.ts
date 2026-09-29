/**
 * palette.ts — xterm's 256 colours, which is what afterlife was painted in.
 *
 * 0–15 are the terminal's own ANSI colours (xterm defaults here), 16–231 a
 * 6×6×6 cube, 232–255 a grey ramp. Every colour the port draws goes through
 * this, so the gradient, the ghosts and the haunted aliasing are exactly the
 * numbers life.py asks curses for.
 */

const ANSI: readonly (readonly [number, number, number])[] = [
  [0, 0, 0], [205, 0, 0], [0, 205, 0], [205, 205, 0], [0, 0, 238], [205, 0, 205], [0, 205, 205], [229, 229, 229],
  [127, 127, 127], [255, 0, 0], [0, 255, 0], [255, 255, 0], [92, 92, 255], [255, 0, 255], [0, 255, 255], [255, 255, 255],
];
const CUBE = [0, 95, 135, 175, 215, 255];

export function xterm(n: number): [number, number, number] {
  if (n < 16) return [...(ANSI[n] ?? [0, 0, 0])] as [number, number, number];
  if (n < 232) {
    const i = n - 16;
    return [CUBE[Math.floor(i / 36)] ?? 0, CUBE[Math.floor(i / 6) % 6] ?? 0, CUBE[i % 6] ?? 0];
  }
  const v = 8 + (n - 232) * 10;
  return [v, v, v];
}

/** Packed little-endian RGBA (for a Uint32Array view over ImageData). */
export function packed(rgb: readonly [number, number, number]): number {
  return ((255 << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0]) >>> 0;
}

export function css(rgb: readonly [number, number, number]): string {
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}
