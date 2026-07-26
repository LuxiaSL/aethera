/**
 * materials.ts — how the creature is drawn.
 *
 * Two shaders, and one idea behind both: **hue is identity, light is state.**
 *
 * A star's colour is its tempo — the same length→pitch map the strings are
 * tuned by, read as colour temperature (short strings are high, fast and blue;
 * long ones low, slow and amber). That never changes unless the body deforms,
 * so you learn the constellation. Everything that *moves* — phase, sync,
 * firing — moves the brightness and the length of the diffraction spikes
 * instead. Two channels, never fighting for the same pixel.
 */

import * as THREE from 'three';

import { PULSE_MAX, PULSE_MIN } from './tuning';

// ---- stars -------------------------------------------------------------------

const STAR_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const STAR_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec3 uColor;
uniform float uCore;   // overall brightness
uniform float uFlare;  // 0..1: how far the spikes reach (sync + firing)
uniform float uHalo;

void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float d = length(p);

  // a tight core — the spikes have to be the silhouette, not a fuzzy ball
  float core = exp(-d * d * 90.0);
  float halo = exp(-d * 5.0) * uHalo;

  // The four-point cross every real lens gives a bright point. The two
  // exponents do different jobs: the big one sets how *thin* the ray is, the
  // small one how *far* it reaches. Getting these the wrong way round (the
  // first attempt) produces a blurry plus sign that reads as a round dot.
  float reach = 8.5 - 5.2 * uFlare;
  float sx = exp(-abs(p.y) * 62.0) * exp(-abs(p.x) * reach);
  float sy = exp(-abs(p.x) * 62.0) * exp(-abs(p.y) * reach);
  // a fainter diagonal pair that only shows when the star is really going
  vec2 q = vec2(p.x + p.y, p.x - p.y) * 0.70711;
  float sd1 = exp(-abs(q.y) * 105.0) * exp(-abs(q.x) * (14.0 - 6.0 * uFlare));
  float sd2 = exp(-abs(q.x) * 105.0) * exp(-abs(q.y) * (14.0 - 6.0 * uFlare));

  float spikes = (sx + sy) * (0.30 + 0.80 * uFlare) + (sd1 + sd2) * 0.45 * uFlare;
  float i = core * uCore + halo + spikes * (0.35 + 0.65 * uCore);

  // fade before the quad's edge so the billboard never shows as a square
  i *= smoothstep(1.0, 0.72, d);
  if (i < 0.002) discard;
  gl_FragColor = vec4(uColor * i, i);
}
`;

export interface StarMaterial extends THREE.ShaderMaterial {
  uniforms: {
    uColor: { value: THREE.Color };
    uCore: { value: number };
    uFlare: { value: number };
    uHalo: { value: number };
  };
}

export function makeStarMaterial(): StarMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: STAR_VERT,
    fragmentShader: STAR_FRAG,
    uniforms: {
      uColor: { value: new THREE.Color(0xffffff) },
      uCore: { value: 1 },
      uFlare: { value: 0 },
      uHalo: { value: 0.3 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }) as StarMaterial;
}

// hoisted: these were being allocated per star per frame
const STAR_SLOW = new THREE.Color(0xffb877); // amber
const STAR_FAST = new THREE.Color(0xbcd6ff); // blue-white
const STAR_ELDER = new THREE.Color(0xff7a3c); // deep orange
/** Seconds for a node to count as fully old, for colour purposes. */
export const STAR_ELDER_AGE = 320;

/**
 * Stellar colour. Two ingredients, both true of real stars and both true here:
 *
 * - **rate → temperature.** Fast nodes run blue-white, slow ones amber. Hot
 *   stars are blue and short-lived, and the fast nodes here are the ones on
 *   short strings. The rhyme is a coincidence and a good one.
 * - **age → red.** Old stars redden as they leave the main sequence, and old
 *   strings are the ones that couple hardest in the rhythm engine. So a mature
 *   creature has warm elders at its core and blue-white new growth at the
 *   edges, and you can see its history the same way you can hear it.
 */
export function starColor(rateHz: number, ageSeconds = 0, out = new THREE.Color()): THREE.Color {
  const t = Math.max(0, Math.min(1, (rateHz - PULSE_MIN) / (PULSE_MAX - PULSE_MIN)));
  out.lerpColors(STAR_SLOW, STAR_FAST, t ** 0.75);
  const old = Math.max(0, Math.min(1, ageSeconds / STAR_ELDER_AGE));
  return out.lerp(STAR_ELDER, old * 0.45);
}

// ---- strings -----------------------------------------------------------------

const STRING_VERT = /* glsl */ `
varying float vT;
void main() {
  // the unit cylinder runs -0.5..0.5 in y; vT is 0 at end A, 1 at end B
  vT = position.y + 0.5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const STRING_FRAG = /* glsl */ `
precision highp float;
varying float vT;
uniform vec3 uBase;
uniform vec3 uGlow;
uniform float uBright;  // steady lift (a string being held / flashed)
uniform float uWave;    // 0..1 position of the travelling light, or <0 for none
uniform float uWaveAmp;
uniform float uAlpha;

void main() {
  float lit = uBright;
  if (uWave >= 0.0) {
    // tight: this wants to be a travelling *dash*, not a glowing bar. At 8.0
    // the pulse covered a quarter of the string and read as the whole thing
    // lighting up.
    float x = (vT - uWave) * 15.0;
    lit += uWaveAmp * exp(-x * x);
  }
  lit = clamp(lit, 0.0, 1.4);
  vec3 col = mix(uBase, uGlow, min(1.0, lit));
  float a = uAlpha * (0.5 + 0.85 * lit);
  gl_FragColor = vec4(col * (0.45 + 0.75 * lit), a);
}
`;

export interface StringMaterial extends THREE.ShaderMaterial {
  uniforms: {
    uBase: { value: THREE.Color };
    uGlow: { value: THREE.Color };
    uBright: { value: number };
    uWave: { value: number };
    uWaveAmp: { value: number };
    uAlpha: { value: number };
  };
}

export function makeStringMaterial(): StringMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: STRING_VERT,
    fragmentShader: STRING_FRAG,
    uniforms: {
      uBase: { value: new THREE.Color(0x2c4256) },
      uGlow: { value: new THREE.Color(0x9fe8ff) },
      uBright: { value: 0 },
      uWave: { value: -1 },
      uWaveAmp: { value: 0 },
      uAlpha: { value: 0.75 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }) as StringMaterial;
}
