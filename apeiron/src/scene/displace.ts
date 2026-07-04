/**
 * texture_density → surface. Words displace mesh vertices along their
 * normals so "karst limestone" is actually rough and "polished" actually
 * smooth. Deterministic per word.
 */

import { Mesh, noise3 } from './geometry';
import { fnv1a } from '../hash';

export type TextureKind = 'smooth' | 'noise' | 'ripple' | 'pits' | 'fuzz';

export interface TextureSpec {
  kind: TextureKind;
  amp: number;
  freq: number;
  /** multiplier applied to heightmap amplitude for terrain templates */
  heightScale: number;
  seed: number;
}

const TAGS: Array<[RegExp, TextureKind]> = [
  [/polish|smooth|satin|silk|glass|mirror|sleek|lacquer/, 'smooth'],
  [/ripple|wave|ribbing|corrugat|pleat|dune|striat|grain/, 'ripple'],
  [/pit|crater|barnacle|karst|crust|porous|pocked|erod|acid|sponge/, 'pits'],
  [/flock|velvet|fuzz|felt|moss|fur|bristl|nap|down/, 'fuzz'],
  [/rough|coarse|rugged|gnarl|crumbl|nodul|wrinkl|crack/, 'noise'],
];

const PROFILES: Record<TextureKind, { amp: number; freq: number; heightScale: number }> = {
  smooth: { amp: 0.015, freq: 2.0, heightScale: 0.6 },
  noise:  { amp: 0.13,  freq: 3.2, heightScale: 1.35 },
  ripple: { amp: 0.09,  freq: 5.0, heightScale: 1.1 },
  pits:   { amp: 0.11,  freq: 4.2, heightScale: 1.2 },
  fuzz:   { amp: 0.045, freq: 9.0, heightScale: 0.85 },
};

const FALLBACK_KINDS: TextureKind[] = ['noise', 'ripple', 'pits', 'fuzz', 'smooth', 'noise'];

export function textureForWord(word: string): TextureSpec {
  const key = (word ?? '').toLowerCase();
  let kind: TextureKind | undefined;
  for (const [re, k] of TAGS) { if (re.test(key)) { kind = k; break; } }
  const h = fnv1a(key);
  kind = kind ?? FALLBACK_KINDS[h % FALLBACK_KINDS.length];
  const p = PROFILES[kind];
  // per-word variation within the profile, deterministic
  const jitter = 0.75 + ((h >>> 8) % 128) / 256;
  return { kind, amp: p.amp * jitter, freq: p.freq * (0.85 + ((h >>> 16) % 64) / 213), heightScale: p.heightScale, seed: h };
}

export const DEFAULT_TEXTURE: TextureSpec = { kind: 'smooth', amp: 0, freq: 1, heightScale: 1, seed: 0 };

/** Displace vertices along vertex normals. Recomputes normals afterward. */
export function displaceMesh(mesh: Mesh, spec: TextureSpec): void {
  if (spec.amp <= 0.001 || mesh.vertices.length === 0) return;
  if (mesh.vertexNormals.length < mesh.vertices.length) mesh.computeNormals();

  const so = (spec.seed % 997) * 0.173;
  const f = spec.freq;

  for (let i = 0; i < mesh.vertices.length; i++) {
    const v = mesh.vertices[i];
    const n = mesh.vertexNormals[i];
    let d: number;
    switch (spec.kind) {
      case 'ripple':
        d = Math.sin(v.y * f * 2.4 + v.x * f * 0.7 + so) * spec.amp;
        break;
      case 'pits': {
        // only dig in, never bulge out
        const raw = noise3(v.x * f + so, v.y * f, v.z * f + so);
        d = raw > 0.18 ? -(raw - 0.18) * spec.amp * 2.2 : 0;
        break;
      }
      case 'fuzz':
        d = noise3(v.x * f + so, v.y * f + so, v.z * f) * spec.amp;
        break;
      case 'smooth':
      case 'noise':
      default:
        d = noise3(v.x * f + so, v.y * f, v.z * f - so) * spec.amp;
        break;
    }
    v.x += n.x * d;
    v.y += n.y * d;
    v.z += n.z * d;
  }
  mesh.computeNormals();
}
