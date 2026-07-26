/**
 * sky.ts — the deep field the creature hangs in.
 *
 * A skybox that follows the camera, so it never clips and never parallaxes:
 * it is *far away*, the way a sky is. Four star layers at different densities
 * give the field depth without any geometry, and a band of dust runs across it
 * at an angle so the frame has a diagonal to sit against.
 *
 * Everything here is deliberately dim. The creature has to be the brightest
 * thing in the picture, or it stops being a constellation and becomes a mess.
 */

import * as THREE from 'three';

const VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  // the sky rides along with the camera; only rotation should matter
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
}
`;

/** The runtime sky only needs the hashes — for stars and for dithering. */
const NOISE_HASH = /* glsl */ `
float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

/**
 * Three decorrelated randoms for the price of about one. Each star needs four
 * of them (a jitter in x/y/z plus a colour), and calling hash13 four times per
 * layer per pixel was most of what the sky shader actually did.
 */
vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}
`;

/**
 * Lifted verbatim from `~/.config/ghostty/shaders/starfield-depth.glsl`.
 *
 * Not a coincidence worth hiding: that shader and this one converged on the
 * same vocabulary independently — the same icy-blue/warm-amber star axis,
 * ridged noise for gas filaments, per-object twinkle, a hard-black boot
 * window. Syrinx was the only thing in the house that wasn't in the violet
 * family. Sharing the actual function is the cheapest way to make the two
 * skies demonstrably the same sky.
 */
const NEB_PALETTE = /* glsl */ `
const float TAU = 6.28318530718;
vec3 nebPalette(float t) {
  return vec3(0.45, 0.38, 0.62)
       + vec3(0.25, 0.18, 0.20) * cos(TAU * (t + vec3(0.00, 0.33, 0.58)));
}
`;

/** The full stack, wanted only by the one-off nebula bake. */
const NOISE_BODY = /* glsl */ `
${NOISE_HASH}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i + vec3(0,0,0)), hash13(i + vec3(1,0,0)), f.x),
        mix(hash13(i + vec3(0,1,0)), hash13(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash13(i + vec3(0,0,1)), hash13(i + vec3(1,0,1)), f.x),
        mix(hash13(i + vec3(0,1,1)), hash13(i + vec3(1,1,1)), f.x), f.y),
    f.z);
}

/**
 * Four octaves. It was five (wasteful), then three (too smooth — the band came
 * out as a featureless wash, which is the opposite of what a dark sky looks
 * like). Deleting the old full-sky haze freed the budget for this one to have
 * some structure, which is where it actually shows.
 */
float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

`;

/**
 * The nebula, rendered **once** into a cubemap at startup.
 *
 * This is the expensive half of the sky — two fbm calls, four octaves each,
 * about 64 hashes a pixel — and it is a pure function of direction. Paying for
 * it every frame was paying for the same answer over and over. Baked, it costs
 * one texture fetch, and because it is genuinely low-frequency a 256-per-face
 * cube is indistinguishable from evaluating it live. The stars stay procedural:
 * they are cheap, and they are exactly the high-frequency detail a cubemap of
 * this size would smear.
 *
 * R = dust density · G = the raw band, which the star layers still want.
 */
const NEBULA_FRAG = /* glsl */ `
precision highp float;
varying vec3 vDir;
${NOISE_BODY}

/**
 * One discrete cloud, the way a real sky has a handful of named ones rather
 * than only the band. Warped silhouette and a ridged interior so it reads as
 * gas — the same trick the ghostty wisps use. All of this is baked, so the
 * eight extra fbm calls in here are paid once and cost nothing per frame.
 */
float nebulaPatch(vec3 sd, vec3 dir, float radius, float seed) {
  float d = 1.0 - dot(sd, normalize(dir)); // 0 at the centre
  if (d > radius * 3.0) return 0.0;
  float warp = fbm(sd * 6.0 + seed) - 0.5;
  float r = radius * (1.0 + warp * 0.7);
  float a = smoothstep(r, r * 0.12, d);
  float n = fbm(sd * 15.0 + seed * 2.0);
  float ridge = 1.0 - abs(n * 2.0 - 1.0);
  return a * (0.25 + 1.1 * ridge * ridge);
}

void main() {
  vec3 sd = normalize(vDir);

  // The dust band: a great circle tilted off the horizontal. Deliberately
  // *thin* — a wide soft band reads as haze, and a real dark sky is a narrow
  // structured strip standing on black.
  vec3 bandNormal = normalize(vec3(0.38, 0.86, -0.34));
  float band = exp(-pow(abs(dot(sd, bandNormal)) * 7.0, 2.0));

  float clouds = fbm(sd * 8.5 + 11.0);
  // The Great Rift. A second, slower noise that *removes* dust rather than
  // adding it — a real dark sky reads as a bright strip with black lanes torn
  // through it, and subtractive structure is what makes it look like dust in
  // front of stars instead of a painted smear.
  float rift = smoothstep(0.32, 0.62, fbm(sd * 1.6 + 40.0));

  // The exponent is the whole game. At 3 the band came out as one smooth blue
  // cloud filling half the frame; naked-eye Milky Way is mostly *nothing*, with
  // a few brighter knots, and that distribution is what a high power gives.
  float dust = band * pow(clamp(clouds, 0.0, 1.0), 4.2) * rift;

  // Four fixed clouds. Because the sky drifts, they come round and leave again
  // over an evening rather than sitting in the frame forever. Two sit near the
  // band (where gas belongs) and two out in the dark, so the empty sky has
  // somewhere to arrive.
  float neb = nebulaPatch(sd, vec3( 0.62,  0.30, -0.72), 0.014,  3.0)
            + nebulaPatch(sd, vec3(-0.44, -0.62,  0.65), 0.009, 11.0)
            + nebulaPatch(sd, vec3( 0.15, -0.86, -0.49), 0.006, 23.0)
            + nebulaPatch(sd, vec3(-0.80,  0.42,  0.43), 0.011, 37.0);

  gl_FragColor = vec4(dust, band, min(neb, 2.0), 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
varying vec3 vDir;
uniform samplerCube uNebula;
uniform float uTime;
uniform float uDrift;    // how far the whole sky has slid, in radians
uniform vec3 uDeep;      // the black it fades to
uniform vec3 uDust;      // the nebula's colour
uniform float uWarm;     // 0..1, the body's coherence — nudges the hue
uniform float uTense;    // 0..1, brightens the field as feeding tightens the body
uniform float uKey;      // 0..1, the creature's key. One octave = one full loop
uniform float uQuality;  // 1 = full sky, 0 = cheap sky for a struggling GPU
${NOISE_HASH}
${NEB_PALETTE}

/**
 * One layer of stars. Cheap on purpose: a single cell lookup rather than the
 * 3x3x3 neighbourhood, with a tight falloff so a star never reaches the cell
 * wall and the seam never shows.
 */
vec3 starLayer(vec3 dir, float scale, float sparsity, float sharp, float twinkle) {
  vec3 p = dir * scale;
  vec3 cell = floor(p);
  vec3 f = fract(p) - 0.5;
  float h = hash13(cell);
  if (h < sparsity) return vec3(0.0);
  float bright = (h - sparsity) / max(1e-4, 1.0 - sparsity);
  vec3 r = hash33(cell + 11.3);
  float d = length(f - (r - 0.5) * 0.62);
  float core = exp(-d * d * sharp);
  // slow, per-star breathing so the field isn't frozen
  float tw = 0.75 + 0.25 * sin(uTime * (0.25 + bright * 0.5) + h * 40.0);
  core *= mix(1.0, tw, twinkle);
  // hotter stars bluer, older ones amber — the same rule the creature uses
  vec3 tint = mix(vec3(1.0, 0.82, 0.62), vec3(0.72, 0.84, 1.0), fract(r.x + r.z));
  return tint * core * bright;
}

void main() {
  vec3 dir = normalize(vDir);

  // a very slow rotation of the whole sky, so leaving it open all evening is
  // never quite the same picture twice
  float c = cos(uDrift), s = sin(uDrift);
  vec3 sd = vec3(dir.x * c - dir.z * s, dir.y, dir.x * s + dir.z * c);

  // one fetch instead of ~64 hashes. Tension used to narrow the band as well as
  // brighten it; width is baked now, so it brightens only — the read is the
  // same and the frame is a great deal cheaper.
  vec3 nebSample = textureCube(uNebula, sd).rgb;
  float dust = nebSample.r;
  float band = nebSample.g;
  float cloud = nebSample.b;   // "patch" is a GLSL reserved word

  // NOTE: everything here is written in *linear* light and then lifted hard by
  // the sRGB conversion on the way to the screen — 0.03 linear lands around
  // 0.19 on screen. Values that look absurdly small here are correct; the
  // first pass at this used numbers 5x larger and the whole sky came out as
  // milky grey with no black left to hang stars against.
  // Empty sky is *empty*. There used to be a broad low-frequency haze here to
  // "keep the corners from going flat black" — it filled a third of the frame
  // with navy, flattened the contrast between void / stars / band, and was the
  // single biggest source of the contour banding. Black is the point.
  //
  // COLOUR IS THE KEY. uKey is log2(root / ROOT_MIN) — the lattice root
  // spans exactly one octave, so one octave of key is one full loop of the
  // palette. When the eldest node dies and the creature re-roots, the sky
  // re-hues with it: the modulation is a grief event you can *see*. Nothing
  // here is chosen; it is read off the body, like everything else.
  //
  // Only the dense parts take colour. Faint dust stays the pale grey of a
  // naked-eye Milky Way, so the vividness arrives without spending the
  // contrast the dark sky is built on.
  vec3 col = uDeep;
  float hue = uKey + uWarm * 0.06 + uTime * 0.0012;
  float vivid = smoothstep(0.012, 0.11, dust);
  vec3 dustCol = mix(uDust, nebPalette(hue + dust * 0.20), vivid);
  col += dustCol * dust * 0.28 * (1.0 + uTense * 0.85);

  // the discrete clouds sit a third of a loop off the band, so they read as
  // their own thing rather than a brighter piece of it
  if (cloud > 0.001) {
    vec3 cloudCol = nebPalette(hue + 0.33 + cloud * 0.12);
    col += cloudCol * cloud * 0.055 * (1.0 + uTense * 0.5);
  }

  // five star layers: a few bright ones, a great many faint ones
  col += starLayer(sd,  20.0, 0.972, 300.0, 0.9) * 0.90;
  col += starLayer(sd,  44.0, 0.958, 430.0, 0.7) * 0.60;
  col += starLayer(sd,  96.0, 0.944, 620.0, 0.4) * 0.40;
  if (uQuality > 0.5) {
    col += starLayer(sd, 190.0, 0.930, 850.0, 0.2) * 0.26;
    col += starLayer(sd, 330.0, 0.922, 1100.0, 0.1) * 0.17;
    // the band is crowded — extra stars only where the dust is
    col += starLayer(sd, 140.0, 0.905, 700.0, 0.3) * 0.30 * band;
  }

  // Dither. An 8-bit framebuffer quantises a gradient this shallow into visible
  // contour rings — they showed up as topographic arcs across the empty sky.
  // A little screen-space noise under one quantisation step destroys the
  // banding and is far too small to read as grain. The magnitude is set in
  // *linear* light for the dark end, where one 8-bit sRGB step is ~3e-4.
  float d = hash13(vec3(gl_FragCoord.xy, 7.0)) - 0.5;
  col += d * 0.0009;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

// ---- the near field -----------------------------------------------------------

/**
 * The one thing the skybox cannot do: parallax. These sit at real distances
 * around the creature, so orbiting slides them against the fixed sky and the
 * space reads as deep rather than painted. Each one drifts and twinkles on its
 * own clock — a still near field looks like dust on the lens.
 */
const DUST_VERT = /* glsl */ `
attribute float aPhase;
attribute float aRate;
attribute float aSize;
attribute float aTint;
uniform float uTime;
uniform float uScale;
varying float vTw;
varying float vTint;
void main() {
  float t = uTime * aRate;
  vec3 p = position + vec3(
    sin(t * 0.13 + aPhase),
    cos(t * 0.11 + aPhase * 1.7),
    sin(t * 0.09 + aPhase * 2.3)
  ) * 38.0;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float tw = 0.5 + 0.5 * sin(t * 1.6 + aPhase * 6.0);
  vTw = 0.22 + 0.78 * tw * tw; // squared: mostly dim, briefly bright
  vTint = aTint;
  gl_PointSize = aSize * uScale / max(1.0, -mv.z) * (0.7 + 0.5 * vTw);
  gl_Position = projectionMatrix * mv;
}
`;

const DUST_FRAG = /* glsl */ `
precision highp float;
varying float vTw;
varying float vTint;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float d = dot(p, p);
  if (d > 1.0) discard;
  float core = exp(-d * 6.5);
  vec3 c = mix(vec3(1.0, 0.85, 0.70), vec3(0.76, 0.87, 1.0), vTint);
  float i = core * vTw;
  gl_FragColor = vec4(c * i, i);
}
`;

export interface Dust {
  points: THREE.Points;
  update(dt: number, viewportHeight: number): void;
  dispose(): void;
}

export function makeDust(centre: number, count = 520): Dust {
  const positions = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const rate = new Float32Array(count);
  const size = new Float32Array(count);
  const tint = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 420 + Math.random() ** 0.7 * 1250;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = centre + r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = centre + r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = centre + r * Math.cos(phi);
    phase[i] = Math.random() * Math.PI * 2;
    rate[i] = 0.25 + Math.random() * 0.85;
    // a few bright ones carry the near field; the rest are a sprinkle
    size[i] = Math.random() < 0.12 ? 5 + Math.random() * 5 : 1.6 + Math.random() * 2.4;
    tint[i] = Math.random();
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
  geo.setAttribute('aRate', new THREE.BufferAttribute(rate, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  geo.setAttribute('aTint', new THREE.BufferAttribute(tint, 1));

  const uniforms = { uTime: { value: 0 }, uScale: { value: 450 } };
  const material = new THREE.ShaderMaterial({
    vertexShader: DUST_VERT,
    fragmentShader: DUST_FRAG,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, material);
  points.frustumCulled = false;
  let time = 0;
  return {
    points,
    update(dt, viewportHeight) {
      if (!Number.isFinite(dt)) return;
      time += dt;
      uniforms.uTime.value = time;
      uniforms.uScale.value = viewportHeight * 0.5;
    },
    dispose() {
      geo.dispose();
      material.dispose();
    },
  };
}

/**
 * Render the nebula into a cubemap, once. 256 per face is 393k pixels total —
 * a single frame's worth of work, paid at startup instead of sixty times a
 * second forever.
 */
function bakeNebula(renderer: THREE.WebGLRenderer, size = 256): THREE.CubeTexture | null {
  try {
    const target = new THREE.WebGLCubeRenderTarget(size, {
      type: THREE.HalfFloatType,
      generateMipmaps: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });
    const cam = new THREE.CubeCamera(0.5, 60, target);
    const scene = new THREE.Scene();
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: NEBULA_FRAG,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
    });
    const geometry = new THREE.SphereGeometry(10, 48, 32);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);

    const previous = renderer.getRenderTarget();
    cam.update(renderer, scene);
    renderer.setRenderTarget(previous);

    geometry.dispose();
    material.dispose();
    return target.texture;
  } catch (err) {
    // a missing float-cube extension shouldn't cost anyone the whole sky
    console.warn('syrinx: could not bake the nebula, sky will be stars only', err);
    return null;
  }
}

export interface SkyState {
  /** 0..1 — the body's coherence. Warms the dust. */
  warmth: number;
  /** 0..1 — feeding tension. Brightens the field. */
  tension: number;
  /** rad/s — the shared flywheel spin, so the field drifts with everything else. */
  drift: number;
  /** 0..1 — the creature's key, as a fraction of an octave. Sets the hue. */
  key: number;
}

export interface Sky {
  mesh: THREE.Mesh;
  /** Call every frame: keeps the sky centred on the eye and drifting. */
  update(dt: number, camera: THREE.Camera, state: SkyState): void;
  /** Drop the expensive terms. One-way — we never flap back and forth. */
  degrade(): void;
  readonly degraded: boolean;
  dispose(): void;
}

export function makeSky(renderer: THREE.WebGLRenderer): Sky {
  const nebula = bakeNebula(renderer);
  const uniforms = {
    uNebula: { value: nebula },
    uTime: { value: 0 },
    uDrift: { value: 0 },
    // true black — the void is meant to be void, not navy
    uDeep: { value: new THREE.Color(0x000000) },
    // pale and barely blue. To the naked eye the Milky Way is a grey-white
    // glow, not the saturated blue a long-exposure photograph renders it as —
    // and saturated blue is exactly what made the sky read as washed.
    uDust: { value: new THREE.Color(0x8890a8) },
    uWarm: { value: 0 },
    uTense: { value: 0 },
    uKey: { value: 0 },
    uQuality: { value: 1 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    fog: false,
  });

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1000, 32, 24), material);
  mesh.renderOrder = -1000; // always first, always behind
  mesh.frustumCulled = false;

  let time = 0;
  let drift = 0;
  let warm = 0;
  let tense = 0;
  let key = Number.NaN; // first frame snaps; after that the hue slides
  let degraded = false;
  return {
    mesh,
    get degraded() {
      return degraded;
    },
    degrade() {
      if (degraded) return;
      degraded = true;
      uniforms.uQuality.value = 0;
      console.info('syrinx: sky running cheap — this machine was struggling with the full one');
    },
    update(dt, camera, state) {
      if (!Number.isFinite(dt)) return;
      time += dt;
      // integrated, not `time * rate` — the rate changes now, and multiplying
      // by the *current* rate would make the whole sky jump whenever you flung
      // the camera
      if (Number.isFinite(state.drift)) drift += state.drift * dt;
      // ease both, so a brief lock or a single mote doesn't flash the sky
      warm += (state.warmth - warm) * Math.min(1, dt * 0.4);
      tense += (state.tension - tense) * Math.min(1, dt * 1.4);

      // The key slides rather than snapping, so a modulation *sweeps* the sky
      // instead of cutting it — and it takes the short way round the loop, or
      // a semitone up would drag the hue backwards through the whole palette.
      if (Number.isFinite(state.key)) {
        if (!Number.isFinite(key)) {
          key = state.key;
        } else {
          let d = state.key - key;
          d -= Math.round(d); // shortest path on a 0..1 circle
          key = (((key + d * Math.min(1, dt * 0.25)) % 1) + 1) % 1;
        }
      }

      uniforms.uTime.value = time;
      uniforms.uDrift.value = drift;
      uniforms.uWarm.value = warm;
      uniforms.uTense.value = tense;
      uniforms.uKey.value = Number.isFinite(key) ? key : 0;
      // riding the camera makes it infinitely far away for free
      mesh.position.copy(camera.position);
    },
    dispose() {
      mesh.geometry.dispose();
      material.dispose();
    },
  };
}
