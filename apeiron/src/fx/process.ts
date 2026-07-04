/**
 * The process layer: phenomenon_pattern × temporal_state.
 *
 * phenomenon_pattern picks a spatial pattern — the order in which cells of
 * the render are touched (voronoi patches, etch pits, a crystallization
 * front, radial dispersal, concentric rings, blobby growth zones).
 *
 * temporal_state picks the arrow of time — decay (slowly eaten, quickly
 * regrown), growth (slowly revealed), oscillation, or stasis (a faint
 * shimmer at the edges of the pattern).
 *
 * Runs in grid space so it composes with every geometry kind, the same
 * visual language as the transitions. Deterministic per prompt.
 */

import type { CharGrid } from '../render/chargrid';
import { fnv1a } from '../hash';
import { mulberry32 } from '../math/rng';
import { noise3 } from '../scene/geometry';

export type ProcessPattern = 'voronoi' | 'pits' | 'front' | 'radial' | 'rings' | 'blobs';
export type ProcessMode = 'decay' | 'growth' | 'oscillate' | 'stasis';

export interface ProcessSpec {
  pattern: ProcessPattern;
  mode: ProcessMode;
  /** seconds per full cycle */
  period: number;
  seed: number;
}

const PATTERNS: ProcessPattern[] = ['voronoi', 'pits', 'front', 'radial', 'rings', 'blobs'];
const MODES: ProcessMode[] = ['decay', 'growth', 'oscillate', 'stasis'];

/** substring → pattern; hash fallback covers the tail */
const PATTERN_TAGS: Array<[RegExp, ProcessPattern]> = [
  [/voronoi|cell|tessellat|crack|shatter/, 'voronoi'],
  [/pit|etch|corro|erosion|acid|rust|weather|moth|nibbl/, 'pits'],
  [/crystal|front|creep|sinter|freez|advanc|sweep|migrat/, 'front'],
  [/dispers|dandelion|scatter|radiat|bloom|spor|emanat/, 'radial'],
  [/ring|ripple|wave|interference|moir|concentric|halo/, 'rings'],
  [/growth|ruffle|branch|lichen|colony|spread|differential|tendril/, 'blobs'],
];

const MODE_TAGS: Array<[RegExp, ProcessMode]> = [
  [/suspend|stasis|frozen|static|held|arrest|preserv/, 'stasis'],
  [/oscillat|tidal|puls|breath|flicker|cycl|alternat/, 'oscillate'],
  [/bloom|grow|sinter|heal|cur(e|ing)|form|accret|condens|crystalliz/, 'growth'],
  [/decay|etch|nibbl|erod|dissolv|collaps|rot|rust|burn|split|shed|melt/, 'decay'],
];

export function processForWords(phenomenonWord: string, temporalWord: string, promptHash: string): ProcessSpec {
  const pkey = (phenomenonWord ?? '').toLowerCase();
  const tkey = (temporalWord ?? '').toLowerCase();

  let pattern: ProcessPattern | undefined;
  for (const [re, p] of PATTERN_TAGS) { if (re.test(pkey)) { pattern = p; break; } }
  pattern = pattern ?? PATTERNS[fnv1a(pkey) % PATTERNS.length];

  let mode: ProcessMode | undefined;
  for (const [re, m] of MODE_TAGS) { if (re.test(tkey)) { mode = m; break; } }
  mode = mode ?? MODES[fnv1a(tkey) % MODES.length];

  return {
    pattern,
    mode,
    period: 11 + (fnv1a(tkey + pkey) % 8),
    seed: (fnv1a(pkey) ^ fnv1a(promptHash)) >>> 0,
  };
}

/** Holds the lazily-built rank field and applies the process each frame. */
export class ProcessInstance {
  private rank: Float32Array | null = null;
  private rankW = 0;
  private rankH = 0;

  constructor(public spec: ProcessSpec) {}

  private buildRank(w: number, h: number): Float32Array {
    const rank = new Float32Array(w * h);
    const rng = mulberry32(this.spec.seed);
    const cx = w / 2, cy = h / 2;
    const so = (this.spec.seed % 977) * 0.61;

    switch (this.spec.pattern) {
      case 'voronoi': {
        const nSites = 5 + ((this.spec.seed >>> 4) % 5);
        const sites: Array<[number, number]> = [];
        for (let i = 0; i < nSites; i++) sites.push([rng() * w, rng() * h]);
        let maxD = 1e-6;
        for (let i = 0; i < rank.length; i++) {
          const x = i % w, y = (i / w) | 0;
          let best = Infinity;
          for (const [sx, sy] of sites) {
            // ×2 on y: character cells are ~half as wide as tall
            const dx = x - sx, dy = (y - sy) * 2;
            const d = dx * dx + dy * dy;
            if (d < best) best = d;
          }
          rank[i] = Math.sqrt(best);
          if (rank[i] > maxD) maxD = rank[i];
        }
        for (let i = 0; i < rank.length; i++) rank[i] /= maxD;
        break;
      }
      case 'pits':
        for (let i = 0; i < rank.length; i++) rank[i] = rng();
        break;
      case 'front': {
        const theta = rng() * Math.PI * 2;
        const dx = Math.cos(theta), dy = Math.sin(theta);
        const diag = Math.sqrt(w * w + h * h * 4);
        for (let i = 0; i < rank.length; i++) {
          const x = i % w, y = (i / w) | 0;
          const proj = ((x - cx) * dx + (y - cy) * 2 * dy) / diag + 0.5;
          rank[i] = Math.min(Math.max(proj + noise3(x * 0.15 + so, y * 0.3, so) * 0.12, 0), 1);
        }
        break;
      }
      case 'radial': {
        const maxD = Math.sqrt(cx * cx + cy * cy * 4);
        for (let i = 0; i < rank.length; i++) {
          const x = i % w, y = (i / w) | 0;
          const dx = x - cx, dy = (y - cy) * 2;
          rank[i] = Math.sqrt(dx * dx + dy * dy) / maxD;
        }
        break;
      }
      case 'rings': {
        const maxD = Math.sqrt(cx * cx + cy * cy * 4);
        const freq = 4 + ((this.spec.seed >>> 8) % 4);
        for (let i = 0; i < rank.length; i++) {
          const x = i % w, y = (i / w) | 0;
          const dx = x - cx, dy = (y - cy) * 2;
          const d = Math.sqrt(dx * dx + dy * dy) / maxD;
          rank[i] = (Math.sin(d * freq * Math.PI * 2 + so) * 0.5 + 0.5) * 0.7 + d * 0.3;
        }
        break;
      }
      case 'blobs':
      default:
        for (let i = 0; i < rank.length; i++) {
          const x = i % w, y = (i / w) | 0;
          rank[i] = noise3(x * 0.09 + so, y * 0.18, so * 1.7) * 0.5 + 0.5;
        }
        break;
    }
    return rank;
  }

  /** Cycle position → how much of the pattern is currently consumed. */
  private threshold(time: number): number {
    const p = (time / this.spec.period) % 1;
    switch (this.spec.mode) {
      case 'decay':
        // slow eat, quick regrowth
        return p < 0.82 ? (p / 0.82) * 0.9 : ((1 - p) / 0.18) * 0.9;
      case 'growth':
        // start consumed, slowly reveal, quick re-consume
        return p < 0.82 ? (1 - p / 0.82) * 0.9 : ((p - 0.82) / 0.18) * 0.9;
      case 'oscillate':
        return (Math.sin(p * Math.PI * 2) * 0.5 + 0.5) * 0.75;
      case 'stasis':
      default:
        return 0.12 + (Math.sin(p * Math.PI * 2) * 0.5 + 0.5) * 0.13;
    }
  }

  apply(grid: CharGrid, time: number): void {
    const w = grid.width, h = grid.height;
    if (!this.rank || this.rankW !== w || this.rankH !== h) {
      this.rank = this.buildRank(w, h);
      this.rankW = w;
      this.rankH = h;
    }
    const t = this.threshold(time);
    if (t <= 0.001) return;
    const edge = Math.min(t + 0.08, 1.0);
    const rank = this.rank;
    const cells = grid.cells;

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      if (cell.char === ' ') continue;
      const r = rank[i];
      if (r < t) {
        cell.char = ' ';
        cell.style = '';
      } else if (r < edge) {
        // eroding edge of the pattern
        cell.char = '·';
      }
    }
  }
}
