const LUT_SIZE = 4096;
const TWO_PI = 2.0 * Math.PI;
const LUT_SCALE = LUT_SIZE / TWO_PI;

const SIN_LUT = new Float64Array(LUT_SIZE);
const COS_LUT = new Float64Array(LUT_SIZE);
for (let i = 0; i < LUT_SIZE; i++) {
  SIN_LUT[i] = Math.sin(i / LUT_SCALE);
  COS_LUT[i] = Math.cos(i / LUT_SCALE);
}

export function fastSin(angle: number): number {
  return SIN_LUT[((angle * LUT_SCALE) | 0) % LUT_SIZE + (angle < 0 ? LUT_SIZE : 0)] ?? Math.sin(angle);
}

export function fastCos(angle: number): number {
  return COS_LUT[((angle * LUT_SCALE) | 0) % LUT_SIZE + (angle < 0 ? LUT_SIZE : 0)] ?? Math.cos(angle);
}

export function clamp(value: number, lo: number, hi: number): number {
  if (value < lo) return lo;
  if (value > hi) return hi;
  return value;
}

export function lerpF(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}
