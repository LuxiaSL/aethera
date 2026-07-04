/**
 * setting_location → a whispered environment in the far depth band.
 * Never louder than the object: sparse glyphs in the dimmest style,
 * sitting at depth ~0.9995 so all geometry draws over them.
 */

import type { CharGrid } from '../render/chargrid';
import { fnv1a } from '../hash';
import { mulberry32 } from '../math/rng';
import { fastSin } from '../math/lut';

export type BackdropKind = 'horizon' | 'columns' | 'grid' | 'starfield' | 'aquatic' | 'strata';

export interface BackdropSpec {
  kind: BackdropKind;
  seed: number;
}

const KINDS: BackdropKind[] = ['horizon', 'columns', 'grid', 'starfield', 'aquatic', 'strata'];

const TAGS: Array<[RegExp, BackdropKind]> = [
  [/interior|cathedral|library|hall|museum|station|tower|room|chamber|vault|corridor|mall|theat|church|temple|court|attic|basement|silo/, 'columns'],
  [/server|farm|lab|factory|facility|plant|warehouse|reactor|substation|depot|terminal|airport|data/, 'grid'],
  [/void|orbit|space|cosmos|star|nebula|lunar|astral|observat/, 'starfield'],
  [/sea|ocean|flood|tide|underwater|lagoon|reef|harbor|brine|submerg|aquar|pool|shore/, 'aquatic'],
  [/aerial|cloud|canyon|cliff|strat|mesa|atmosph|summit|ridge/, 'strata'],
  [/field|desert|tundra|plain|ruin|beach|salt|marsh|forest|steppe|quarry|orchard|graveyard|highway/, 'horizon'],
];

export function backdropForWord(word: string): BackdropSpec {
  const key = (word ?? '').toLowerCase();
  let kind: BackdropKind | undefined;
  for (const [re, k] of TAGS) { if (re.test(key)) { kind = k; break; } }
  const seed = fnv1a(key);
  return { kind: kind ?? KINDS[seed % KINDS.length], seed };
}

const FAR = 0.9995;

interface Star { col: number; row: number; twinkle: number; }

export class BackdropInstance {
  private stars: Star[] = [];
  private columnXs: number[] = [];
  private cachedW = 0;
  private cachedH = 0;

  constructor(public spec: BackdropSpec) {}

  private rebuild(w: number, h: number): void {
    const rng = mulberry32(this.spec.seed);
    this.cachedW = w;
    this.cachedH = h;

    this.stars = [];
    const starDensity = this.spec.kind === 'starfield' ? 0.008 : 0.003;
    const starRegion = this.spec.kind === 'starfield' ? h : Math.floor(h * 0.62);
    for (let row = 0; row < starRegion; row++) {
      for (let col = 0; col < w; col++) {
        if (rng() < starDensity) this.stars.push({ col, row, twinkle: rng() * 6.28 });
      }
    }

    this.columnXs = [];
    const nCols = 5 + ((this.spec.seed >>> 6) % 4);
    for (let i = 0; i < nCols; i++) {
      this.columnXs.push(Math.floor(rng() * w));
    }
  }

  draw(grid: CharGrid, time: number, style: string): void {
    const w = grid.width, h = grid.height;
    if (w !== this.cachedW || h !== this.cachedH) this.rebuild(w, h);
    const horizonRow = Math.floor(h * 0.64);

    switch (this.spec.kind) {
      case 'horizon': {
        for (let col = 0; col < w; col++) {
          if ((col + this.spec.seed) % 7 < 4) grid.write(col, horizonRow, '─', style, FAR);
        }
        for (const s of this.stars) grid.write(s.col, s.row, '·', style, FAR);
        break;
      }
      case 'columns': {
        const top = Math.floor(h * 0.16);
        const bottom = Math.floor(h * 0.88);
        for (const x of this.columnXs) {
          for (let row = top; row < bottom; row++) {
            if (row % 3 !== 0) grid.write(x, row, '│', style, FAR);
          }
        }
        break;
      }
      case 'grid': {
        for (let col = 0; col < w; col++) {
          if ((col + this.spec.seed) % 5 < 3) grid.write(col, horizonRow, '─', style, FAR);
        }
        // receding floor: dot spacing tightens toward the horizon
        for (let r = 1; horizonRow + r * 2 < h; r++) {
          const row = horizonRow + r * 2;
          const spacing = Math.max(3, 13 - r * 2);
          for (let col = (this.spec.seed + r) % spacing; col < w; col += spacing) {
            grid.write(col, row, '·', style, FAR);
          }
        }
        break;
      }
      case 'starfield': {
        for (const s of this.stars) {
          const tw = fastSin(time * 0.8 + s.twinkle);
          grid.write(s.col, s.row, tw > 0.55 ? '∙' : '·', style, FAR);
        }
        break;
      }
      case 'aquatic': {
        const drift = Math.floor(time * 1.5);
        for (let row = Math.floor(h * 0.5); row < h; row += 4) {
          for (let col = 0; col < w; col++) {
            if ((col + drift + row * 3) % 11 < 3) grid.write(col, row, '~', style, FAR);
          }
        }
        break;
      }
      case 'strata': {
        for (let row = Math.floor(h * 0.2); row < h; row += 5) {
          for (let col = 0; col < w; col++) {
            if ((col + this.spec.seed + row * 7) % 9 < 4) grid.write(col, row, '·', style, FAR);
          }
        }
        break;
      }
    }
  }
}
