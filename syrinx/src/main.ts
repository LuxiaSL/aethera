/**
 * main.ts — window, breath, and light.
 *
 * The creature is drawn as a constellation: a procedural deep field behind it
 * (`sky.ts`), its nodes as stars with diffraction spikes and its strings as the
 * thin drawn lines of a star chart (`materials.ts`). That reading was chosen
 * because the Kuramoto layer had already made the nodes the protagonists — a
 * star chart puts the stars first and the lines second, which is exactly the
 * hierarchy the instrument now has.
 *
 * The sound engine is untouched — the eyes are a guest in the ears' house.
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import './style.css';

import { AudioEngine, type DroneTarget } from './audio';
import { Flywheel } from './camera';
import {
  COUPLING_MAX,
  COUPLING_STEP,
  PRUNE_RADIUS,
  Sim,
  WORLD,
  type RhythmMode,
  type SimEvent,
} from './graph';
import {
  makeStarMaterial,
  makeStringMaterial,
  starColor,
  type StarMaterial,
  type StringMaterial,
} from './materials';
import { genesisName } from './names';
import { clear as clearSave, formatAge, load, save } from './persist';
import { makeDust, makeSky } from './sky';
import { continuousFreq, getRoot, ROOT_MIN, setRoot, snapToLattice } from './tuning';

const CENTER = WORLD / 2;
const TAU = Math.PI * 2;

// ---- DOM scaffolding ---------------------------------------------------------

const stage = document.getElementById('stage');
const slashEl = document.getElementById('slash') as HTMLCanvasElement | null;
const overlay = document.getElementById('overlay');
const hud = document.getElementById('hud');
const murmur = document.getElementById('murmur');
if (!stage || !slashEl || !overlay || !hud || !murmur) {
  throw new Error('syrinx: missing DOM scaffolding');
}
const slashCanvas = slashEl;
const slashG = slashCanvas.getContext('2d');
if (!slashG) throw new Error('syrinx: no 2d context for slash overlay');
const slashCtx = slashG;

// ---- creature ------------------------------------------------------------------

const engine = new AudioEngine();
const sim = new Sim();

const existing = load();
let creatureName: string;
let bornAt: number;
let rhythm: RhythmMode = 'both';
if (existing && sim.restore(existing.state)) {
  creatureName = existing.name;
  bornAt = existing.bornAt;
  if (existing.root !== undefined) setRoot(existing.root); // wake in the key it fell asleep in
  if (existing.coupling !== undefined) sim.setCoupling(existing.coupling);
  if (existing.rhythm === 'both' || existing.rhythm === 'pulse' || existing.rhythm === 'breath') {
    rhythm = existing.rhythm;
  }
} else {
  sim.genesis();
  creatureName = genesisName();
  bornAt = Date.now();
}
sim.setRhythm(rhythm);

const wakeText = overlay.querySelector('.wake-text');
if (wakeText) {
  wakeText.textContent = existing
    ? `${creatureName} is sleeping — click to wake`
    : `something stirs — click to wake it`;
}

// ---- three.js stage --------------------------------------------------------------

// note: the composer chain lifts the clear color once (linear buffer → screen),
// so these are set darker than the black we actually want on screen
const BG = 0x010204;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(BG, 0.0004);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 8000);
camera.position.set(CENTER + 560, CENTER + 240, CENTER + 560);

const renderer = new THREE.WebGLRenderer({ antialias: true });
/**
 * Capped at 1.5, not 2. This scene is entirely fill-rate bound, so pixel ratio
 * is the single most expensive setting in it — a 2x display at ratio 2 renders
 * *four times* the pixels of ratio 1. At 1.5 the stars are still crisp (they
 * have hard spikes, which is where aliasing would show) and the cost is 1.8x
 * instead of 4x.
 */
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(BG);
stage.appendChild(renderer.domElement);

// dev affordance: `?perf=nosky` / `?perf=nobloom` isolate what a frame costs.
// The whole workflow here is iterating by eye through a headless browser, and
// guessing which full-screen pass is expensive wastes more time than the flag.
const perfFlag = new URLSearchParams(location.search).get('perf') ?? '';

// the deep field the creature hangs in
const sky = makeSky(renderer);
if (perfFlag !== 'nosky') scene.add(sky.mesh);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

/**
 * Bloom is measurably the most expensive thing in the frame — turning it off
 * is worth 3x, far more than the whole procedural sky. But it is a *blur*, so
 * computing it at full resolution is buying detail that is then deliberately
 * thrown away. Half res is visually near-identical and costs a quarter.
 */
let bloomScale = 0.5;
const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth * bloomScale, window.innerHeight * bloomScale),
  0.55, // strength
  0.40, // radius
  0.50, // threshold — lifted, or the whole starfield blooms into soup
);
if (perfFlag !== 'nobloom') composer.addPass(bloom);

// left button belongs to tending (feed/prune/link); camera lives on the right
const flywheel = new Flywheel(camera, new THREE.Vector3(CENTER, CENTER, CENTER));
let rotating = false;

renderer.domElement.addEventListener('contextmenu', (ev) => ev.preventDefault());
renderer.domElement.addEventListener(
  'wheel',
  (ev) => {
    ev.preventDefault();
    flywheel.dolly(ev.deltaY);
  },
  { passive: false },
);

/**
 * How much of the spin the star field takes on as its own slow drift. Tuned so
 * that at the resting pace this reproduces the old constant 0.004 rad/s exactly
 * — the idle sky is unchanged, it just has somewhere to go now.
 */
const SKY_FOLLOW = 0.004 / -flywheel.options.restRate;

// A small read-only probe. The flywheel is a *feel* feature, which means the
// only way to know it works is to measure it from outside — see
// `scripts/spin-check.mjs`.
(window as unknown as { syrinxSpin?: unknown }).syrinxSpin = {
  azimuth: (): number => flywheel.azimuth(),
  elevation: (): number => flywheel.elevation(),
  spin: (): number => flywheel.spinY,
  rate: (): number => flywheel.rate,
  rest: flywheel.options.restRate,
};

// ---- textures -----------------------------------------------------------------

function makeGlowTexture(): THREE.Texture {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d');
  if (g) {
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.45)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(c);
}

function makeRingTexture(): THREE.Texture {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d');
  if (g) {
    // a soft annulus, not a stroked circle: a crisp ring on a starfield reads
    // as interface chrome laid over the sky instead of an event inside it
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.68, 'rgba(255,255,255,0)');
    grad.addColorStop(0.85, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(c);
}

const glowTex = makeGlowTexture();
const ringTex = makeRingTexture();

// ---- palette ---------------------------------------------------------------------

// the drawn lines of a star chart: present, but never competing with the stars
const COL_EDGE = new THREE.Color(0x24384e);
const COL_BRIDGE = new THREE.Color(0x4a3a24);
const COL_BRIDGE_GLOW = new THREE.Color(0xffc98a);
const COL_ACCENT = new THREE.Color(0x9fe8ff);
const COL_BREATH = new THREE.Color(0xfff4d6);
const COL_ORBIT = new THREE.Color(0x96ebe6);
// what a star goes toward when you touch it — white-hot, not a new hue
const COL_TOUCH = new THREE.Color(0xffffff);

// ---- the near field ------------------------------------------------------------------

// the only thing with parallax — it's what makes orbiting feel like depth
const dust = makeDust(CENTER);
scene.add(dust.points);

// ---- scene object pools --------------------------------------------------------------

const unitCylinder = new THREE.CylinderGeometry(1, 1, 1, 6, 1, true);
const UP = new THREE.Vector3(0, 1, 0);

const unitStar = new THREE.PlaneGeometry(1, 1);

interface EdgeView {
  mesh: THREE.Mesh;
  mat: StringMaterial;
}
interface StarView {
  mesh: THREE.Mesh;
  mat: StarMaterial;
}
const edgeViews = new Map<number, EdgeView>();
const nodeViews = new Map<number, StarView>();

/** Light running along a string, away from whatever set it off. */
interface Wave {
  t: number; // 0..1 along the run
  dir: number; // +1 = from end A, -1 = from end B
  amp: number;
  rate: number; // 1/seconds
}
const edgeWaves = new Map<number, Wave>();

/** Send light down a string, starting at `fromNode`. */
function sendWave(edgeId: number, fromNode: number, amp: number, seconds: number): void {
  const e = sim.edges.get(edgeId);
  if (!e) return;
  edgeWaves.set(edgeId, {
    t: 0,
    dir: e.a === fromNode ? 1 : -1,
    amp,
    rate: 1 / Math.max(0.05, seconds),
  });
}
const breathViews: THREE.Sprite[] = [];
const moteViews: THREE.Sprite[] = [];
interface RippleView {
  sprite: THREE.Sprite;
  mat: THREE.SpriteMaterial;
  scale: number;
  alpha: number;
}
const ripples: RippleView[] = [];

function makeSprite(color: THREE.Color, scale: number, opacity: number, tex: THREE.Texture): THREE.Sprite {
  const mat = new THREE.SpriteMaterial({
    map: tex,
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.setScalar(scale);
  return sprite;
}

function spawnRipple(x: number, y: number, z: number, alpha = 0.5): void {
  // kept faint: at full strength a crisp ring reads as interface chrome sitting
  // on top of the sky rather than as something happening in it
  const sprite = makeSprite(COL_ACCENT, 12, alpha * 0.22, ringTex);
  sprite.position.set(x, y, z);
  scene.add(sprite);
  ripples.push({ sprite, mat: sprite.material, scale: 12, alpha });
}

// ghost line while linking
const ghostGeo = new THREE.BufferGeometry();
ghostGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
const ghostMat = new THREE.LineBasicMaterial({
  color: COL_ACCENT,
  transparent: true,
  opacity: 0.6,
});
const ghostLine = new THREE.Line(ghostGeo, ghostMat);
ghostLine.visible = false;
ghostLine.frustumCulled = false;
scene.add(ghostLine);

// ---- visual state ---------------------------------------------------------------------

const edgeFlash = new Map<number, number>();
const nodeGlow = new Map<number, number>();
const nodePulse = new Map<number, number>(); // gold flash when a node fires
let coherent = false; // hysteretic: has the body found one pulse?
let tense = false; // hysteretic: has feeding pulled it together?
let awake = false;
let droneTimer = 0;
let saveTimer = 0;
let letGoArmedUntil = 0;
let pruneRecent = 0;
let elapsed = 0;

// ---- murmurs -----------------------------------------------------------------

const MURMURS: Record<string, string[]> = {
  birth: [
    'a new limb finds its note',
    'the body reaches',
    'growth, tuned on arrival',
    'it adds a string to itself',
  ],
  death: [
    'an old string falls silent',
    'a tone lets go',
    'the chord thins',
  ],
  pruned: [
    'cut — the chord rebalances',
    'you take a string; it keeps the song',
    'severed, gently',
  ],
  fed: [
    'it notices the offering',
    'the offering is taken',
    'warmth, absorbed',
  ],
  link: [
    'a string, tied by hand',
    'you close the distance',
    'two points; one interval',
  ],
  refusal: [
    'it refuses to end',
    'silence, declined',
  ],
  modulation: [
    'the eldest lets go — the key follows',
    'a new elder; a new root',
    'the chord grieves into a new key',
  ],
  gather: [
    'the body finds one pulse',
    'they fall into step',
    'one heart, for a while',
  ],
  scatter: [
    'the pulse comes apart',
    'each string keeps its own time again',
    'the step is lost',
  ],
  tighten: [
    'it gathers around the offering',
    'fed, it draws itself together',
    'the body tightens toward you',
  ],
};

const NUMBER_WORDS = ['', '', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
const ENTRAIN_TEMPLATES = [
  (n: string) => `it counts to ${n}`,
  (n: string) => `a loop of ${n}, kept`,
  (n: string) => `${n} beats, round and round`,
];

let murmurFade = 0;
function speak(kind: keyof typeof MURMURS): void {
  const pool = MURMURS[kind];
  if (!pool || pool.length === 0) return;
  const line = pool[Math.floor(Math.random() * pool.length)];
  if (line) speak_raw(line);
}
function speak_raw(line: string): void {
  if (!murmur) return;
  murmur.textContent = line;
  murmurFade = 6;
}

// ---- events → sound + light --------------------------------------------------

function edgeMidpoint(edgeId: number): THREE.Vector3 | null {
  const e = sim.edges.get(edgeId);
  if (!e) return null;
  const a = sim.nodes.get(e.a);
  const b = sim.nodes.get(e.b);
  if (!a || !b) return null;
  return new THREE.Vector3((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
}

function handleEvents(events: SimEvent[]): void {
  for (const ev of events) {
    switch (ev.type) {
      case 'pluck': {
        engine.pluck(ev.freq, ev.pan, ev.gain, ev.brightness);
        edgeFlash.set(ev.edgeId, 0.7);
        // the light runs the way the breath ran. No ripple here any more — a
        // ring on every pluck put four or five of them on screen at once, and
        // the travelling light already says a string was struck.
        sendWave(ev.edgeId, ev.from, 0.85, 0.5);
        break;
      }
      case 'birth': {
        nodeGlow.set(ev.nodeId, 1);
        const around = sim.edgesAt(ev.nodeId);
        around.forEach((e, i) => {
          const freq = snapToLattice(continuousFreq(sim.edgeLength(e)));
          setTimeout(() => engine.pluck(freq, sim.edgePan(e), 0.14, 1), i * 140);
          edgeFlash.set(e.id, 1);
        });
        speak('birth');
        break;
      }
      case 'death':
        engine.fall(ev.freq, ev.pan);
        speak(pruneRecent > 0 ? 'pruned' : 'death');
        break;
      case 'fed': {
        nodeGlow.set(ev.nodeId, 1);
        if (Math.random() < 0.4) speak('fed');
        break;
      }
      case 'link': {
        const e = sim.edges.get(ev.edgeId);
        if (e) {
          const freq = snapToLattice(continuousFreq(sim.edgeLength(e)));
          engine.pluck(freq, sim.edgePan(e), 0.22, 1);
          edgeFlash.set(e.id, 1);
          nodeGlow.set(e.a, 1);
          nodeGlow.set(e.b, 1);
        }
        speak('link');
        break;
      }
      case 'entrain': {
        const word = NUMBER_WORDS[ev.beats] ?? String(ev.beats);
        const template = ENTRAIN_TEMPLATES[Math.floor(Math.random() * ENTRAIN_TEMPLATES.length)];
        if (template && Math.random() < 0.6) speak_raw(template(word));
        break;
      }
      case 'pulse': {
        // a locked node strikes its strings as one chord; a loose one rolls
        // them — so coherence is heard in the articulation, not just the tone
        const spread = 0.055 * (1 - ev.sync);
        ev.tones.forEach((tone, i) => {
          engine.pulse(tone.freq, tone.pan, 0.075, ev.sync, i * spread);
          edgeFlash.set(tone.edgeId, Math.max(edgeFlash.get(tone.edgeId) ?? 0, 0.28));
          // light leaves the star along every string it holds — the strum you
          // hear and the wave you watch are the same event
          sendWave(tone.edgeId, ev.nodeId, 0.45 + ev.sync * 0.4, 0.62);
        });
        nodePulse.set(ev.nodeId, Math.max(nodePulse.get(ev.nodeId) ?? 0, 0.4 + ev.sync * 0.6));
        break;
      }
      case 'modulation': {
        speak('modulation');
        const c = sim.centroid();
        spawnRipple(c.x, c.y, c.z, 0.5);
        break;
      }
      case 'refusal':
        speak('refusal');
        break;
    }
  }
}

// ---- drones -------------------------------------------------------------------

const BRIDGE_DRONE_OFFSET = 1_000_000; // keep bridge voice ids clear of elder voice ids

function updateDrones(): void {
  const elders = [...sim.edges.values()].sort((a, b) => b.age - a.age).slice(0, 3);
  const targets: DroneTarget[] = elders.map((e) => ({
    id: e.id,
    freq: snapToLattice(continuousFreq(sim.edgeLength(e))),
    pan: sim.edgePan(e),
    level: 0.04,
  }));
  // bridges — load-bearing strings hum a sub-octave pedal so you can hear
  // the body's fragility before you cut it
  const bridgeIds = sim.bridgeEdgeIds();
  const bridges = [...sim.edges.values()]
    .filter((e) => bridgeIds.has(e.id))
    .sort((a, b) => sim.edgeLength(b) - sim.edgeLength(a))
    .slice(0, 2);
  for (const e of bridges) {
    targets.push({
      id: e.id + BRIDGE_DRONE_OFFSET,
      freq: Math.max(40, snapToLattice(continuousFreq(sim.edgeLength(e))) / 2),
      pan: sim.edgePan(e),
      level: 0.05,
    });
  }
  engine.updateDrones(targets);
}

// ---- picking / interaction -------------------------------------------------------

const raycaster = new THREE.Raycaster();

function pointerRay(clientX: number, clientY: number): THREE.Ray {
  const ndc = new THREE.Vector2(
    (clientX / window.innerWidth) * 2 - 1,
    -(clientY / window.innerHeight) * 2 + 1,
  );
  raycaster.setFromCamera(ndc, camera);
  return raycaster.ray.clone();
}

/** Nearest node within a screen-space radius, or null. */
function pickNode(clientX: number, clientY: number, radiusPx = 28): number | null {
  let best: number | null = null;
  let bestDist = radiusPx;
  const v = new THREE.Vector3();
  for (const n of sim.nodes.values()) {
    v.set(n.x, n.y, n.z).project(camera);
    if (v.z > 1) continue; // behind the camera
    const sx = ((v.x + 1) / 2) * window.innerWidth;
    const sy = ((-v.y + 1) / 2) * window.innerHeight;
    const d = Math.hypot(sx - clientX, sy - clientY);
    if (d < bestDist) {
      bestDist = d;
      best = n.id;
    }
  }
  return best;
}

/** Where a pointer ray meets the camera-facing plane through `anchor`. */
function rayOnPlane(ray: THREE.Ray, anchor: THREE.Vector3): THREE.Vector3 | null {
  const normal = new THREE.Vector3();
  camera.getWorldDirection(normal);
  const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, anchor);
  const out = new THREE.Vector3();
  return ray.intersectPlane(plane, out);
}

type PointerAction = 'idle' | 'maybe' | 'prune' | 'link';
let action: PointerAction = 'idle';
let downAt = { x: 0, y: 0 };
let linkFrom: number | null = null;
interface SlashPoint {
  x: number;
  y: number;
  age: number;
}
let slashTrail: SlashPoint[] = [];

overlay.addEventListener('click', () => {
  void engine.start().then(() => {
    awake = true;
    overlay.classList.add('hidden');
  });
});

renderer.domElement.addEventListener('pointerdown', (ev) => {
  if (ev.button === 2) {
    rotating = true;
    flywheel.beginDrag();
    renderer.domElement.setPointerCapture(ev.pointerId);
    return;
  }
  if (!awake || ev.button !== 0) return;
  downAt = { x: ev.clientX, y: ev.clientY };
  const picked = pickNode(ev.clientX, ev.clientY);
  if (picked !== null) {
    action = 'link';
    linkFrom = picked;
    ghostLine.visible = true;
  } else {
    action = 'maybe';
  }
});

renderer.domElement.addEventListener('pointermove', (ev) => {
  if (rotating) {
    flywheel.drag(ev.movementX, ev.movementY);
    return;
  }
  if (!awake) return;
  if (action === 'maybe' && Math.hypot(ev.clientX - downAt.x, ev.clientY - downAt.y) > 8) {
    action = 'prune';
    slashTrail.push({ x: downAt.x, y: downAt.y, age: 0 });
  }
  if (action === 'prune') {
    slashTrail.push({ x: ev.clientX, y: ev.clientY, age: 0 });
    const ray = pointerRay(ev.clientX, ev.clientY);
    const far = ray.origin.clone().addScaledVector(ray.direction, 4000);
    const cut = sim.pruneSegment(
      ray.origin.x, ray.origin.y, ray.origin.z,
      far.x, far.y, far.z,
      PRUNE_RADIUS,
    );
    if (cut > 0) pruneRecent = 1;
  }
  if (action === 'link' && linkFrom !== null) {
    const from = sim.nodes.get(linkFrom);
    if (!from) {
      action = 'idle';
      ghostLine.visible = false;
      return;
    }
    const anchor = new THREE.Vector3(from.x, from.y, from.z);
    const hit = rayOnPlane(pointerRay(ev.clientX, ev.clientY), anchor);
    const positions = ghostGeo.getAttribute('position');
    positions.setXYZ(0, from.x, from.y, from.z);
    if (hit) positions.setXYZ(1, hit.x, hit.y, hit.z);
    positions.needsUpdate = true;
  }
});

window.addEventListener('pointerup', (ev) => {
  if (ev.button === 2 && rotating) {
    rotating = false;
    flywheel.endDrag();
    return;
  }
  if (!awake) return;
  if (ev.button !== 0) return;
  if (action === 'link' && linkFrom !== null) {
    const target = pickNode(ev.clientX, ev.clientY);
    if (target !== null && target !== linkFrom) {
      sim.link(linkFrom, target);
    }
  } else if (action === 'maybe') {
    // a clean click: feed on the camera-facing plane through the centroid
    const c = sim.centroid();
    const hit = rayOnPlane(pointerRay(ev.clientX, ev.clientY), new THREE.Vector3(c.x, c.y, c.z));
    if (hit) {
      sim.feed(hit.x, hit.y, hit.z);
      spawnRipple(hit.x, hit.y, hit.z, 0.3);
    }
  }
  action = 'idle';
  linkFrom = null;
  ghostLine.visible = false;
});

const RHYTHM_CYCLE: RhythmMode[] = ['both', 'pulse', 'breath'];
const RHYTHM_SAID: Record<RhythmMode, string> = {
  both: 'both clocks — pulse and breath',
  pulse: 'pulse alone — the body keeps its own time',
  breath: 'breath alone — only the loops count',
};

window.addEventListener('keydown', (ev) => {
  if (ev.key === 'm') {
    engine.setMuted(!engine.isMuted);
    speak_raw(engine.isMuted ? 'muted' : 'listening again');
  }
  if (ev.key === 'k') {
    const next = RHYTHM_CYCLE[(RHYTHM_CYCLE.indexOf(rhythm) + 1) % RHYTHM_CYCLE.length];
    if (next) {
      rhythm = next;
      sim.setRhythm(rhythm);
      speak_raw(RHYTHM_SAID[rhythm]);
    }
  }
  // the chaos↔unison knob, live: this is the one to turn by ear
  if (ev.key === '[' || ev.key === ']') {
    sim.setCoupling(sim.coupling + (ev.key === ']' ? COUPLING_STEP : -COUPLING_STEP));
    const k = sim.coupling;
    speak_raw(
      k <= 0.001
        ? 'coupling 0 — every node alone'
        : k >= COUPLING_MAX - 0.001
          ? `coupling ${k.toFixed(1)} — one animal`
          : `coupling ${k.toFixed(1)}`,
    );
  }
  if (ev.key === 'r') {
    const now = performance.now();
    if (now < letGoArmedUntil) {
      clearSave();
      location.reload();
    } else {
      letGoArmedUntil = now + 3000;
      speak_raw('press r again to let this one go');
    }
  }
});

// ---- persistence loop -----------------------------------------------------------

function persist(): void {
  save({
    name: creatureName,
    bornAt,
    state: sim.serialize(),
    root: getRoot(),
    coupling: sim.coupling,
    rhythm,
  });
}
window.addEventListener('beforeunload', persist);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') persist();
});

// ---- scene sync ----------------------------------------------------------------

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpDir = new THREE.Vector3();
const tmpQuat = new THREE.Quaternion();
const tmpColor = new THREE.Color();

function syncScene(dt: number): void {
  const bridgeIds = sim.bridgeEdgeIds();
  const syncs = sim.pulseEnabled ? sim.syncMap() : null;
  // magnitude: a star that holds more strings is a brighter star. Real charts
  // have a hierarchy and a flat one reads as a diagram.
  const degree = new Map<number, number>();
  for (const e of sim.edges.values()) {
    degree.set(e.a, (degree.get(e.a) ?? 0) + 1);
    degree.set(e.b, (degree.get(e.b) ?? 0) + 1);
  }

  // edges: thin glowing cylinders
  for (const e of sim.edges.values()) {
    let view = edgeViews.get(e.id);
    if (!view) {
      const mat = makeStringMaterial();
      const mesh = new THREE.Mesh(unitCylinder, mat);
      scene.add(mesh);
      view = { mesh, mat };
      edgeViews.set(e.id, view);
    }
    const a = sim.nodes.get(e.a);
    const b = sim.nodes.get(e.b);
    if (!a || !b) continue;
    tmpA.set(a.x, a.y, a.z);
    tmpB.set(b.x, b.y, b.z);
    const len = Math.max(1e-3, tmpA.distanceTo(tmpB));
    tmpDir.subVectors(tmpB, tmpA).normalize();
    view.mesh.position.lerpVectors(tmpA, tmpB, 0.5);
    tmpQuat.setFromUnitVectors(UP, tmpDir);
    view.mesh.quaternion.copy(tmpQuat);

    let flash = edgeFlash.get(e.id) ?? 0;
    if (flash > 0.005) {
      flash *= Math.exp(-2.2 * dt);
      edgeFlash.set(e.id, flash);
    } else if (flash !== 0) {
      edgeFlash.delete(e.id);
      flash = 0;
    }
    // travelling light
    const wave = edgeWaves.get(e.id);
    if (wave) {
      wave.t += wave.rate * dt;
      if (wave.t >= 1) {
        edgeWaves.delete(e.id);
        view.mat.uniforms.uWave.value = -1;
        view.mat.uniforms.uWaveAmp.value = 0;
      } else {
        // the light fades as it runs, so a long string swallows it
        view.mat.uniforms.uWave.value = wave.dir > 0 ? wave.t : 1 - wave.t;
        view.mat.uniforms.uWaveAmp.value = wave.amp * (1 - wave.t * 0.55);
      }
    } else {
      view.mat.uniforms.uWave.value = -1;
    }

    const isBridge = bridgeIds.has(e.id);
    view.mat.uniforms.uBase.value.copy(isBridge ? COL_BRIDGE : COL_EDGE);
    view.mat.uniforms.uGlow.value.copy(isBridge ? COL_BRIDGE_GLOW : COL_ACCENT);
    view.mat.uniforms.uBright.value = flash;
    view.mat.uniforms.uAlpha.value = isBridge ? 0.85 : 0.62;
    // the wave barely thickens the string — radius is uniform along the whole
    // cylinder, so leaning on it here inflates the entire run instead of the
    // travelling point. Brightness carries the wave; geometry stays a hairline.
    const radius = 1.15 + flash * 1.2 + (wave ? wave.amp * 0.22 : 0);
    view.mesh.scale.set(radius, len, radius);
  }
  for (const [id, view] of edgeViews) {
    if (!sim.edges.has(id)) {
      scene.remove(view.mesh);
      view.mat.dispose();
      edgeViews.delete(id);
      edgeWaves.delete(id);
    }
  }

  // nodes: stars. Hue is the node's tempo and barely moves; everything that
  // changes moment to moment is carried by brightness and spike length.
  for (const n of sim.nodes.values()) {
    let view = nodeViews.get(n.id);
    if (!view) {
      const mat = makeStarMaterial();
      const mesh = new THREE.Mesh(unitStar, mat);
      mesh.frustumCulled = false;
      scene.add(mesh);
      view = { mesh, mat };
      nodeViews.set(n.id, view);
    }
    view.mesh.position.set(n.x, n.y, n.z);
    view.mesh.quaternion.copy(camera.quaternion); // billboard
    let glow = nodeGlow.get(n.id) ?? 0;
    if (glow > 0.005) {
      glow *= Math.exp(-2 * dt);
      nodeGlow.set(n.id, glow);
    } else if (glow !== 0) {
      nodeGlow.delete(n.id);
      glow = 0;
    }
    let fire = nodePulse.get(n.id) ?? 0;
    if (fire > 0.005) {
      fire *= Math.exp(-3.4 * dt);
      nodePulse.set(n.id, fire);
    } else if (fire !== 0) {
      nodePulse.delete(n.id);
      fire = 0;
    }
    const locked = syncs?.get(n.id) ?? 0;
    const swell = syncs ? (n.phase / TAU) ** 2 : 0; // filling up toward its next fire

    // colour = tempo. Being touched pulls it briefly toward white, which reads
    // as an event rather than a change of identity.
    starColor(sim.naturalRate(n.id), n.age, tmpColor);
    view.mat.uniforms.uColor.value.lerpColors(tmpColor, COL_TOUCH, glow * 0.7);
    // a locked star flares; a lonely one is a plain point of light
    view.mat.uniforms.uFlare.value = Math.min(1, locked * 0.75 + fire * 0.8);
    // capped: uncapped, a star that was fed *and* fired blew out into a white
    // ball the size of the constellation
    view.mat.uniforms.uCore.value = Math.min(
      1.45,
      0.42 + swell * 0.22 + glow * 0.5 + fire * 0.7,
    );
    view.mat.uniforms.uHalo.value = 0.10 + locked * 0.12 + fire * 0.18;
    const mag = Math.min(4, degree.get(n.id) ?? 0);
    view.mesh.scale.setScalar(52 + mag * 8 + fire * 22 + glow * 14);
  }
  for (const [id, view] of nodeViews) {
    if (!sim.nodes.has(id)) {
      scene.remove(view.mesh);
      view.mat.dispose();
      nodeViews.delete(id);
    }
  }

  // breaths: fireflies; entrained ones turn cyan
  while (breathViews.length < sim.breaths.length) {
    // deliberately soft against the stars' hard points: a breath is a passing
    // thing, the body is not
    const sprite = makeSprite(COL_BREATH.clone(), 18, 0.8, glowTex);
    scene.add(sprite);
    breathViews.push(sprite);
  }
  while (breathViews.length > sim.breaths.length) {
    const sprite = breathViews.pop();
    if (sprite) {
      scene.remove(sprite);
      sprite.material.dispose();
    }
  }
  sim.breaths.forEach((br, i) => {
    const sprite = breathViews[i];
    const from = sim.nodes.get(br.from);
    const to = sim.nodes.get(br.to);
    if (!sprite || !from || !to) return;
    sprite.visible = sim.breathEnabled;
    const t = br.progress;
    sprite.position.set(
      from.x + (to.x - from.x) * t,
      from.y + (to.y - from.y) * t,
      from.z + (to.z - from.z) * t,
    );
    sprite.material.color.copy(br.orbit ? COL_ORBIT : COL_BREATH);
    sprite.scale.setScalar(13 * (1 + 0.12 * Math.sin(elapsed * 4 + i * 2)));
  });

  // motes
  while (moteViews.length < sim.motes.length) {
    const sprite = makeSprite(COL_ACCENT.clone(), 8, 0.6, glowTex);
    scene.add(sprite);
    moteViews.push(sprite);
  }
  while (moteViews.length > sim.motes.length) {
    const sprite = moteViews.pop();
    if (sprite) {
      scene.remove(sprite);
      sprite.material.dispose();
    }
  }
  sim.motes.forEach((m, i) => {
    moteViews[i]?.position.set(m.x, m.y, m.z);
  });

  // ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    if (!r) continue;
    r.scale += 68 * dt;
    r.alpha *= Math.exp(-2.6 * dt); // out fast: several lingering rings read as clutter
    r.sprite.scale.setScalar(r.scale);
    r.mat.opacity = r.alpha;
    if (r.alpha < 0.02) {
      scene.remove(r.sprite);
      r.mat.dispose();
      ripples.splice(i, 1);
    }
  }

  // camera slowly re-centers on the body
  const c = sim.centroid();
  flywheel.target.lerp(tmpA.set(c.x, c.y, c.z), Math.min(1, dt * 0.5));
}

// ---- slash overlay ----------------------------------------------------------------

function drawSlash(dt: number): void {
  const g: CanvasRenderingContext2D = slashCtx;
  slashCanvas.width = window.innerWidth * devicePixelRatio;
  slashCanvas.height = window.innerHeight * devicePixelRatio;
  g.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  g.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const p of slashTrail) p.age += dt;
  slashTrail = slashTrail.filter((p) => p.age < 0.5);
  if (slashTrail.length >= 2) {
    g.beginPath();
    const first = slashTrail[0];
    if (first) g.moveTo(first.x, first.y);
    for (const p of slashTrail) g.lineTo(p.x, p.y);
    g.strokeStyle = 'rgba(235, 150, 150, 0.55)';
    g.lineWidth = 1.5;
    g.stroke();
  }
}

// ---- resize ----------------------------------------------------------------------

function applyViewport(): void {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setPixelRatio(renderer.getPixelRatio());
  composer.setSize(w, h);
  // must come *after* composer.setSize — that loops every pass and resets them
  // to full resolution, which would silently undo the half-res bloom
  bloom.setSize(w * bloomScale, h * bloomScale);
}
applyViewport();
window.addEventListener('resize', applyViewport);

// ---- main loop ---------------------------------------------------------------------

const clock = new THREE.Clock();

/**
 * The sky is by far the most expensive thing on screen (it is a full-screen
 * procedural shader). Rather than guess what hardware this is running on, watch
 * the first few seconds of real frames and drop to the cheap sky if the machine
 * is visibly struggling. One-way, and only after enough samples to be sure.
 */
let perfFrames = 0;
let perfTime = 0;
let degradeTier = 0;
function watchFrameRate(dt: number): void {
  if (degradeTier >= 2 || !awake) return;
  perfFrames++;
  perfTime += dt;
  // seconds, not frames: gating on a frame count means the slower the machine
  // is, the longer it waits to be rescued — exactly backwards
  if (perfTime < 3 || perfFrames < 6) return;
  const fps = perfFrames / perfTime;
  perfFrames = 0;
  perfTime = 0;
  if (fps >= 24) return;

  // Ordered by measured cost per unit of ugliness. Pixels first — it's a pure
  // multiplier on everything and the scene is fill-rate bound end to end. Then
  // bloom, which is ~3x the sky. The sky's own detail goes last because since
  // the nebula was baked it barely costs anything.
  degradeTier++;
  if (degradeTier === 1) {
    renderer.setPixelRatio(1);
    bloomScale = 0.35;
    applyViewport();
    console.info(`syrinx: ${fps.toFixed(1)}fps — dropping to 1x pixels and softer bloom`);
  } else {
    bloomScale = 0.25;
    applyViewport();
    sky.degrade();
  }
}

function frame(): void {
  const dt = Math.min(0.1, clock.getDelta());
  elapsed += dt;
  watchFrameRate(dt);

  if (awake) {
    sim.step(dt);
    handleEvents(sim.drainEvents());
    pruneRecent = Math.max(0, pruneRecent - dt);

    droneTimer -= dt;
    if (droneTimer <= 0) {
      droneTimer = 0.25;
      updateDrones();
    }
    saveTimer -= dt;
    if (saveTimer <= 0) {
      saveTimer = 5;
      persist();
    }

    // the body finding (or losing) one pulse is an event worth naming — wide
    // hysteresis so it can't flicker on a body hovering at the threshold
    if (sim.pulseEnabled) {
      // being fed hard enough to visibly tighten is worth naming once, not
      // every time a mote lands
      if (!tense && sim.tension > 0.85) {
        tense = true;
        speak('tighten');
      } else if (tense && sim.tension < 0.3) {
        tense = false;
      }
      const r = sim.order();
      if (!coherent && r > 0.75) {
        coherent = true;
        speak('gather');
      } else if (coherent && r < 0.45) {
        coherent = false;
        speak('scatter');
      }
    } else {
      coherent = false;
      tense = false;
    }
  }

  syncScene(dt);
  // the field warms as the body coheres and draws itself in as feeding tightens
  // it — the same two numbers the ears are getting, very slow, mostly felt
  sky.update(dt, camera, {
    warmth: sim.pulseEnabled && awake ? sim.order() : 0,
    tension: awake ? Math.min(1, sim.tension / 1.2) : 0,
    // the star field takes on the flywheel's spin as its own drift
    drift: -flywheel.spinY * SKY_FOLLOW,
    // the root spans exactly one octave, so this lands in [0,1) and one octave
    // of key is one full turn of the palette
    key: Math.log2(Math.max(1, getRoot()) / ROOT_MIN) % 1,
  });
  dust.update(dt, window.innerHeight);
  flywheel.update(camera, dt);
  composer.render();
  drawSlash(dt);

  if (hud) {
    // show the knob, and what the body is *actually* coupled at when feeding
    // has tightened it — otherwise the HUD would contradict what you hear
    const felt = sim.effectiveCoupling;
    const kText =
      felt > sim.coupling + 0.05
        ? `K ${sim.coupling.toFixed(1)}→${felt.toFixed(1)}`
        : `K ${sim.coupling.toFixed(1)}`;
    const pulseHud = sim.pulseEnabled
      ? ` · ${kText} · sync ${sim.order().toFixed(2)}`
      : ' · pulse off';
    hud.textContent =
      `${creatureName} · age ${formatAge(sim.lifetime)} · ` +
      `${sim.nodes.size} nodes · ${sim.edges.size} strings · ` +
      `key ${Math.round(getRoot())}hz` +
      pulseHud +
      (sim.breathEnabled ? '' : ' · breath off');
  }
  if (murmur) {
    murmurFade = Math.max(0, murmurFade - dt);
    murmur.style.opacity = String(Math.min(1, murmurFade / 2));
  }

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
