import { clamp } from './math/lut';
import { fnv1a } from './hash';

export interface ShaderRamp {
  chars: string;
}

export const SHADER_PRESETS: Record<string, ShaderRamp> = {
  donut:      { chars: ' .,-~:;=!*#$@' },
  block:      { chars: ' ░░▒▒▓▓███' },
  ascii:      { chars: ' .·:-=+*#@' },
  circuit:    { chars: ' ·─│┌┐└┘┼║' },
  organic:    { chars: ' .·°oO@8&#' },
  minimal:    { chars: '    ··∙∙•●' },
  glass:      { chars: '   ·.:░▒▓█' },
  bone:       { chars: ' .·:;+=≡#█' },
  ferrofluid: { chars: ' ~∼≈≋∽∿⌇⌇█' },
  silk:       { chars: '     ··..░' },
  ceramic:    { chars: ' ·.:○◌◍◉●█' },
};

const PRESET_NAMES = Object.keys(SHADER_PRESETS).sort();
const PRESET_COUNT = PRESET_NAMES.length;

export const DEFAULT_SHADER: ShaderRamp = SHADER_PRESETS['donut'];
export const DONUT_LUMINANCE_RAMP = ' .,-~:;=!*#$@';

export function shade(brightness: number, ramp: ShaderRamp): string {
  const clamped = clamp(brightness, 0.0, 1.0);
  const n = ramp.chars.length;
  let idx = (clamped * (n - 1) + 0.5) | 0;
  if (idx >= n) idx = n - 1;
  return ramp.chars[idx];
}

export function shaderForWord(word: string): ShaderRamp {
  if (!word) return DEFAULT_SHADER;
  const idx = fnv1a(word.toLowerCase().trim()) % PRESET_COUNT;
  return SHADER_PRESETS[PRESET_NAMES[idx]];
}
