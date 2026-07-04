/**
 * Palette derivation — the prompt's color_logic words become the actual
 * light of the page. "molten gold on obsidian" should RENDER as molten
 * gold on obsidian, not as whichever canned palette the template drew.
 *
 * Pipeline: phrase → anchor colors (lexicon + modifiers) → scheme rules
 * fill gaps → normalize for phosphor-on-black legibility → Palette.
 *
 * Never throws: any failure falls back to the template palette.
 */

import type { Palette } from './types';
import { paletteForTemplate } from './palettes';
import { fnv1a } from './hash';

// ---------------------------------------------------------------------------
// color math (HSL, h in [0,360), s/l in [0,1])
// ---------------------------------------------------------------------------

interface Hsl { h: number; s: number; l: number; }

function hexToHsl(hex: string): Hsl {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: h * 60, s, l };
}

function hslToHex(c: Hsl): string {
  const h = ((c.h % 360) + 360) % 360 / 360;
  const s = clamp01(c.s), l = clamp01(c.l);
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t: number): number => {
    t = ((t % 1) + 1) % 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const to = (v: number): string => Math.round(clamp01(v) * 255).toString(16).padStart(2, '0');
  return `#${to(f(h + 1 / 3))}${to(f(h))}${to(f(h - 1 / 3))}`;
}

function clamp01(v: number): number { return v < 0 ? 0 : v > 1 ? 1 : v; }
function clamp(v: number, lo: number, hi: number): number { return v < lo ? lo : v > hi ? hi : v; }

// ---------------------------------------------------------------------------
// lexicon
// ---------------------------------------------------------------------------

/** Multi-word entries must precede their single-word substrings. */
const LEXICON: Array<[string, string]> = [
  ['ice blue', '#A5D8E6'], ['arctic blue', '#9FD8DF'], ['laser yellow', '#EFFF33'],
  ['lemon yellow', '#FFF44F'], ['neon green', '#39FF14'], ['burnt orange', '#CC5500'],
  ['iron oxide', '#A14A2A'], ['bone white', '#F2F2E9'], ['pitch black', '#0A0C10'],
  ['cadmium red', '#E30022'], ['raw sienna', '#C46A3D'],
  ['absinthe', '#8FD14F'], ['purple', '#8A4FBF'], ['terracotta', '#C96F4A'],
  ['azure', '#3F8FD2'], ['sandstone', '#D9B98A'], ['permafrost', '#BFE3E8'],
  ['alabaster', '#EDE7DC'], ['fuchsia', '#E040C0'], ['moss', '#6B8F3D'],
  ['verdigris', '#43B3A0'], ['rust', '#B4532A'], ['celadon', '#A8D8B9'],
  ['lavender', '#B57EDC'], ['ochre', '#CC7722'], ['umber', '#826644'],
  ['oxblood', '#76282C'], ['cinnabar', '#E34234'], ['cadmium', '#E30022'],
  ['jade', '#00A86B'], ['lilac', '#C8A2C8'], ['ember', '#F0662D'],
  ['cerulean', '#2A8FBD'], ['ashen', '#9AA0A6'], ['olive', '#8A8A3A'],
  ['vermillion', '#D9381E'], ['vermilion', '#D9381E'], ['gold', '#E8C547'],
  ['obsidian', '#15151E'], ['graphite', '#53565A'], ['slate', '#708090'],
  ['saffron', '#F4C430'], ['bone', '#E3DAC9'], ['navy', '#2A4470'],
  ['orange', '#E87B39'], ['sepia', '#8A6240'], ['glacier', '#C9E4E7'],
  ['violet', '#8F5FE8'], ['copper', '#B87333'], ['malachite', '#2FAE66'],
  ['ivory', '#F2EFE1'], ['periwinkle', '#9FA8DA'], ['bronze', '#CD7F32'],
  ['marigold', '#EAA221'], ['indigo', '#5C4B9B'], ['azurite', '#2E5090'],
  ['cocoa', '#8B5A3C'], ['mint', '#7FD8A8'], ['cedar', '#A05A3C'],
  ['cream', '#F5F0DC'], ['burgundy', '#8C2138'], ['sienna', '#A0522D'],
  ['ultramarine', '#2F52C8'], ['kelp', '#4A5D23'], ['woad', '#4E7DA6'],
  ['madder', '#B5443C'], ['goldenrod', '#DAA520'], ['peach', '#F5B98E'],
  ['apricot', '#F0A868'], ['pewter', '#8E9294'], ['amber', '#E8A317'],
  ['nicotine', '#C9A86A'], ['emerald', '#3EB489'], ['crimson', '#DC143C'],
  ['zinc', '#A8AAAD'], ['barnwood', '#8A7060'], ['charcoal', '#3A3F44'],
  ['desert', '#C19A6B'], ['parchment', '#E8DCC0'],
  ['turquoise', '#30C9C9'], ['black', '#101418'], ['white', '#F2F2E9'],
  ['blue', '#4A90D9'], ['green', '#4CAF50'], ['red', '#D9382E'],
  ['yellow', '#E8D93A'], ['lemon', '#FFF44F'],
];

/** word immediately preceding an anchor bends it: {Δlightness, Δsaturation, Δhue} */
const MODIFIERS: Record<string, { dl: number; ds: number; dh: number }> = {
  icy: { dl: 0.15, ds: -0.15, dh: 0 },
  ice: { dl: 0.15, ds: -0.15, dh: 0 },
  frosted: { dl: 0.15, ds: -0.15, dh: 0 },
  burnt: { dl: -0.12, ds: 0.05, dh: 0 },
  deep: { dl: -0.18, ds: 0.05, dh: 0 },
  molten: { dl: 0.08, ds: 0.25, dh: 0 },
  hot: { dl: 0.06, ds: 0.22, dh: 0 },
  neon: { dl: 0.08, ds: 0.30, dh: 0 },
  laser: { dl: 0.08, ds: 0.30, dh: 0 },
  bruised: { dl: -0.15, ds: -0.15, dh: 15 },
  pale: { dl: 0.10, ds: -0.25, dh: 0 },
  faded: { dl: 0.05, ds: -0.25, dh: 0 },
  aged: { dl: -0.02, ds: -0.22, dh: 0 },
  dusty: { dl: 0.02, ds: -0.25, dh: 0 },
  weathered: { dl: 0.0, ds: -0.25, dh: 0 },
  fogbound: { dl: 0.08, ds: -0.30, dh: 0 },
  ancient: { dl: -0.05, ds: -0.18, dh: 0 },
  patinated: { dl: 0.0, ds: -0.12, dh: 12 },
  oxidized: { dl: -0.04, ds: -0.10, dh: 12 },
  raw: { dl: -0.02, ds: 0.05, dh: 0 },
  warm: { dl: 0.02, ds: 0.05, dh: -6 },
  cool: { dl: 0.02, ds: 0.0, dh: 6 },
  sunbaked: { dl: 0.04, ds: 0.10, dh: -6 },
  'nicotine-stained': { dl: -0.05, ds: -0.10, dh: -8 },
};

type SchemeId = 'split' | 'complementary' | 'analogous' | 'monochromatic'
  | 'duotone' | 'polarized' | 'high-contrast';

const SCHEME_TESTS: Array<[SchemeId, RegExp]> = [
  ['split', /split\s+complementary/],
  ['complementary', /complementary/],
  ['analogous', /analogous/],
  ['monochromatic', /monochromatic/],
  ['duotone', /duotone/],
  ['polarized', /polarized/],
  ['high-contrast', /high\s+contrast/],
];

// ---------------------------------------------------------------------------
// parsing
// ---------------------------------------------------------------------------

interface Anchor { name: string; hsl: Hsl; at: number; }

function findAnchors(phrase: string): Anchor[] {
  const lower = phrase.toLowerCase();
  const tokens = lower.split(/[^a-z-]+/).filter(Boolean);
  const anchors: Anchor[] = [];
  const claimed = new Array<boolean>(tokens.length).fill(false);

  for (const [name, hex] of LEXICON) {
    const parts = name.split(' ');
    for (let i = 0; i + parts.length <= tokens.length; i++) {
      if (claimed[i]) continue;
      let hit = true;
      for (let j = 0; j < parts.length; j++) {
        if (claimed[i + j] || tokens[i + j] !== parts[j]) { hit = false; break; }
      }
      if (!hit) continue;
      for (let j = 0; j < parts.length; j++) claimed[i + j] = true;

      const hsl = { ...hexToHsl(hex) };
      const prev = i > 0 ? tokens[i - 1] : '';
      const mod = MODIFIERS[prev];
      if (mod) {
        hsl.l = clamp01(hsl.l + mod.dl);
        hsl.s = clamp01(hsl.s + mod.ds);
        hsl.h = ((hsl.h + mod.dh) % 360 + 360) % 360;
      }
      anchors.push({ name: mod ? `${prev} ${name}` : name, hsl, at: i });
    }
  }
  // lexicon scan yields lexicon order; restore phrase order
  anchors.sort((a, b) => a.at - b.at);
  return anchors;
}

function detectScheme(phrase: string): SchemeId | null {
  const lower = phrase.toLowerCase();
  for (const [id, re] of SCHEME_TESTS) {
    if (re.test(lower)) return id;
  }
  return null;
}

function schemeAccent(primary: Hsl, scheme: SchemeId | null): Hsl {
  switch (scheme) {
    case 'monochromatic': return { h: primary.h, s: clamp01(primary.s - 0.15), l: clamp01(primary.l + 0.2) };
    case 'analogous': return { h: primary.h + 32, s: primary.s, l: primary.l };
    case 'complementary': return { h: primary.h + 180, s: primary.s, l: primary.l };
    case 'split': return { h: primary.h + 150, s: primary.s, l: primary.l };
    case 'duotone': return { h: primary.h + 180, s: clamp01(primary.s - 0.2), l: primary.l };
    case 'polarized': return { h: primary.h + 180, s: clamp01(primary.s + 0.25), l: primary.l };
    case 'high-contrast': return { h: 46, s: 0.75, l: 0.72 };
    default: return { h: primary.h + 40, s: primary.s, l: primary.l };
  }
}

// ---------------------------------------------------------------------------
// palette assembly
// ---------------------------------------------------------------------------

function buildPalette(name: string, primary: Hsl, accent: Hsl, darkTint: Hsl | null, brightTint: Hsl | null): Palette {
  // normalize for legibility on near-black
  const p: Hsl = {
    h: primary.h,
    s: clamp(primary.s, 0.35, 0.95),
    l: clamp(primary.l, 0.52, 0.70),
  };
  const a: Hsl = {
    h: accent.h,
    s: clamp(accent.s, 0.40, 1.0),
    l: clamp(accent.l, 0.55, 0.78),
  };
  const bright: Hsl = brightTint
    ? { h: brightTint.h, s: clamp(brightTint.s, 0.10, 0.65), l: clamp(brightTint.l, 0.80, 0.92) }
    : { h: p.h, s: clamp01(p.s - 0.05), l: clamp01(p.l + 0.18) };
  const dimHue = darkTint ? darkTint.h : p.h;
  const dimSat = darkTint ? clamp(darkTint.s, 0.10, 0.55) : p.s * 0.8;
  const dim: Hsl = { h: dimHue, s: dimSat, l: clamp(p.l * 0.52, 0.24, 0.36) };

  const negative: Hsl = { h: p.h + 180, s: 0.30, l: 0.48 };

  return {
    name,
    primary: hslToHex(p),
    bright: hslToHex(bright),
    dim: hslToHex(dim),
    accent: hslToHex(a),
    border: hslToHex({ h: p.h, s: p.s, l: clamp01(p.l - 0.10) }),
    borderDim: hslToHex({ h: dimHue, s: dimSat, l: 0.27 }),
    negative: hslToHex(negative),
    negativeBorder: hslToHex({ h: negative.h, s: negative.s, l: 0.26 }),
    rainHead: hslToHex({ h: p.h, s: 0.20, l: 0.95 }),
    rainBright: hslToHex(bright),
    rainMid: hslToHex({ h: p.h, s: p.s * 0.9, l: 0.42 }),
    rainDim: hslToHex(dim),
  };
}

/**
 * Derive a palette from the prompt's color_logic words.
 * Falls back to the template palette if the phrase yields nothing usable.
 */
export function derivePalette(colorWords: string[], templateId: string): Palette {
  try {
    const phrase = (colorWords ?? []).join(' ').trim();
    if (!phrase) return paletteForTemplate(templateId);

    const anchors = findAnchors(phrase);
    const scheme = detectScheme(phrase);

    const vivid = anchors.filter(x => x.hsl.l >= 0.18 && x.hsl.l <= 0.85 && x.hsl.s >= 0.08);
    const dark = anchors.find(x => x.hsl.l < 0.18 || (x.hsl.s < 0.08 && x.hsl.l < 0.35)) ?? null;
    const light = anchors.find(x => x.hsl.l > 0.85 || (x.hsl.s < 0.15 && x.hsl.l > 0.7)) ?? null;

    let primary: Hsl, accent: Hsl;
    let nameBits: string[];

    if (vivid.length >= 2) {
      primary = vivid[0].hsl;
      // prefer an accent hue-distinct from primary
      const distinct = vivid.slice(1).find(x => hueDelta(x.hsl.h, primary.h) > 24) ?? vivid[1];
      accent = distinct.hsl;
      nameBits = [vivid[0].name, distinct.name];
    } else if (vivid.length === 1) {
      primary = vivid[0].hsl;
      accent = schemeAccent(primary, scheme);
      nameBits = [vivid[0].name, scheme ?? 'drift'];
    } else if (light || dark || anchors.length > 0) {
      // phrases like "bone white and oxblood" where both ends parsed as
      // tints, or anchors that modifiers desaturated out of the vivid band
      const base = (light ?? dark ?? anchors[0]).hsl;
      primary = { h: base.h, s: Math.max(base.s, 0.25), l: 0.6 };
      accent = schemeAccent(primary, scheme);
      nameBits = [(light ?? dark ?? anchors[0]).name, scheme ?? 'drift'];
    } else {
      // pure scheme language ("split complementary") — hue from the phrase itself
      const hue = fnv1a(phrase) % 360;
      primary = { h: hue, s: 0.62, l: 0.60 };
      accent = schemeAccent(primary, scheme);
      nameBits = [scheme ?? 'unmapped', `${Math.round(hue)}°`];
    }

    return buildPalette(nameBits.join(' / '), primary, accent,
      dark ? dark.hsl : null, light ? light.hsl : null);
  } catch {
    return paletteForTemplate(templateId);
  }
}

function hueDelta(a: number, b: number): number {
  const d = Math.abs(((a - b) % 360 + 360) % 360);
  return d > 180 ? 360 - d : d;
}

/**
 * Category tints derived from the active palette — a hue walk from primary
 * toward accent and back, alternating lightness so neighbors separate.
 * subject_form always gets the bright tone: the subject is the protagonist.
 */
export function categoryTints(palette: Palette, categories: string[]): Record<string, string> {
  const tints: Record<string, string> = {};
  try {
    const p = hexToHsl(palette.primary);
    const a = hexToHsl(palette.accent);
    let span = ((a.h - p.h) % 360 + 360) % 360;
    if (span > 180) span -= 360;           // take the short way around
    if (Math.abs(span) < 40) span = span >= 0 ? 60 : -60;  // widen narrow palettes

    const n = Math.max(categories.length, 1);
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      if (cat === 'subject_form') { tints[cat] = palette.bright; continue; }
      const t = n > 1 ? i / (n - 1) : 0;
      const wave = t <= 0.5 ? t * 2 : (1 - t) * 2;   // out and back
      tints[cat] = hslToHex({
        h: p.h + span * wave,
        s: clamp(p.s * 0.9, 0.35, 0.8),
        l: i % 2 === 0 ? 0.68 : 0.58,
      });
    }
  } catch {
    for (const cat of categories) tints[cat] = palette.primary;
  }
  return tints;
}
