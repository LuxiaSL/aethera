import { Vec3 } from './math/vec';
import { fnv1a } from './hash';
import { Light } from './render/rasterizer';
import { Camera } from './render/transform';
import { GeomKind, Scene, type LightMotion } from './scene/scene';
import { shaderForWord, DEFAULT_SHADER } from './shaders';
import { particleSystemForWord } from './fx/particles';
import { effectForWord } from './fx/postfx';
import { ProcessInstance, processForWords } from './fx/process';
import { BackdropInstance, backdropForWord } from './scene/backdrop';

export const TEMPLATE_GEOM: Record<string, GeomKind> = {
  material_study: GeomKind.MESH_FILLED,
  textural_macro: GeomKind.HEIGHTMAP,
  environmental: GeomKind.HEIGHTMAP,
  atmospheric_depth: GeomKind.POINT_CLOUD,
  process_state: GeomKind.MESH_FILLED,
  material_collision: GeomKind.DUAL_MESH,
  specimen: GeomKind.MESH_WIREFRAME,
  minimal_object: GeomKind.SURFACE_DIRECT,
  abstract_field: GeomKind.POINT_CLOUD,
  temporal_diptych: GeomKind.DUAL_MESH,
  liminal: GeomKind.MESH_WIREFRAME,
  ruin_state: GeomKind.MESH_FILLED,
  essence: GeomKind.SURFACE_DIRECT,
  site_decay: GeomKind.VOXEL_GRID,
};

const LIGHT_PRESETS: Light[] = [
  new Light(new Vec3(0, -1, 0.3).normalized(), 1.2),
  new Light(new Vec3(-0.8, -0.4, 0.4).normalized(), 1.3),
  new Light(new Vec3(-0.5, -0.3, -0.8).normalized(), 1.2),
  new Light(new Vec3(0.3, -0.7, 0.5).normalized(), 1.0, 0.4),
  new Light(new Vec3(0.2, -0.5, 0.6).normalized(), 0.9, 0.6),
  new Light(new Vec3(0, -1, 0.1).normalized(), 1.2),
  new Light(new Vec3(0.3, -0.3, 0.7).normalized(), 1.3),
  new Light(new Vec3(0.1, -0.3, -1).normalized(), 0.9, 0.3),
];

const CAMERA_PRESETS: Camera[] = [
  new Camera(new Vec3(0, 0, 2.5), new Vec3(0, 0, 0)),
  new Camera(new Vec3(0, 1, 2.2), new Vec3(0, 0, 0)),
  new Camera(new Vec3(2.2, 0.3, 0.8), new Vec3(0, 0, 0)),
  new Camera(new Vec3(1.8, 1.4, 1.8), new Vec3(0, 0, 0)),
  new Camera(new Vec3(0, 0.2, 1.8), new Vec3(0, 0, 0)),
  new Camera(new Vec3(0, 0.3, 3.5), new Vec3(0, 0, 0)),
  new Camera(new Vec3(0, -0.3, 2.5), new Vec3(0, 0.2, 0)),
  new Camera(new Vec3(1.8, 0.3, 1.8), new Vec3(0, 0, 0)),
];

const SPEED_PRESETS = [0.3, 0.5, 0.7, 1.0, 1.3, 1.6, 2.0, 0.8];
const ZOOM_OFFSETS = [-0.8, -0.5, -0.3, 0, 0.3, 0.5, 0.8, 1.2];

function wordHash(word: string, n: number): number {
  return fnv1a(word.toLowerCase()) % n;
}

function interpretLight(words: string[]): Light {
  if (!words.length) return new Light(new Vec3(0.3, -0.8, 0.5).normalized(), 1.2);
  return LIGHT_PRESETS[wordHash(words[0], LIGHT_PRESETS.length)];
}

function interpretCamera(words: string[]): Camera {
  if (!words.length) return new Camera(new Vec3(0, 0.3, 2.5), new Vec3(0, 0, 0));
  return CAMERA_PRESETS[wordHash(words[0], CAMERA_PRESETS.length)];
}

function interpretSpeed(words: string[]): number {
  if (!words.length) return 1.0;
  return SPEED_PRESETS[wordHash(words[0], SPEED_PRESETS.length)];
}

function interpretZoom(words: string[], camera: Camera): Camera {
  if (!words.length) return camera;
  const offset = ZOOM_OFFSETS[wordHash(words[0], ZOOM_OFFSETS.length)];
  const direction = camera.position.sub(camera.target).normalized();
  return new Camera(camera.position.add(direction.scale(offset)), camera.target, camera.fov);
}

export function interpretMeshDetail(words: string[]): number {
  if (!words.length) return 1;
  return wordHash(words[0], 3);
}

function interpretShader(words: string[]): string {
  if (!words.length) return DEFAULT_SHADER.chars;
  return shaderForWord(words[0]).chars;
}

/** light_behavior → how the light moves, not just where it sits */
const LIGHT_MOTION_TAGS: Array<[RegExp, LightMotion]> = [
  [/shimmer|caustic|dapple|glint|sparkle|refract/, { orbitSpeed: 0.05, breatheAmp: 0.22, breatheSpeed: 5.5, flicker: 0 }],
  [/flicker|strobe|sputter|arc-|neon|fluoresc|failing/, { orbitSpeed: 0.02, breatheAmp: 0.08, breatheSpeed: 2.0, flicker: 0.8 }],
  [/sweep|scan|lighthouse|rotat|beacon|searchlight/, { orbitSpeed: 0.45, breatheAmp: 0.05, breatheSpeed: 1.0, flicker: 0 }],
  [/airglow|ambient|glow|diffus|overcast|fog|hazy|soft/, { orbitSpeed: 0.03, breatheAmp: 0.12, breatheSpeed: 0.7, flicker: 0 }],
  [/raking|kicker|slash|hard|louver|key grip|spotlight/, { orbitSpeed: 0, breatheAmp: 0.04, breatheSpeed: 1.2, flicker: 0 }],
];

function interpretLightMotion(words: string[]): LightMotion | null {
  if (!words.length) return null;
  const key = words[0].toLowerCase();
  for (const [re, motion] of LIGHT_MOTION_TAGS) {
    if (re.test(key)) return { ...motion };
  }
  // untagged words still drift a little — everything breathes
  const h = fnv1a(key);
  return {
    orbitSpeed: ((h >>> 2) % 64) / 420,
    breatheAmp: ((h >>> 8) % 48) / 320,
    breatheSpeed: 0.5 + ((h >>> 14) % 32) / 14,
    flicker: 0,
  };
}

const GLINT_RE = /mercury|glass|chrome|mirror|opal|abalone|nacre|crystal|diamond|foil|pearl|silver|quartz|gem|prism|isinglass|ice\b/;

function interpretGlint(words: string[]): boolean {
  return words.some(w => GLINT_RE.test(w.toLowerCase()));
}

export function configureScene(
  scene: Scene,
  visualState: Record<string, string[]>,
  templateId: string,
  promptHash = '',
): void {
  scene.geomKind = TEMPLATE_GEOM[templateId] ?? GeomKind.MESH_FILLED;

  // the scene owns a private Light copy — presets are shared and the
  // motion system mutates direction/intensity every frame
  const lightWords = visualState['light_behavior'] ?? [];
  const preset = interpretLight(lightWords);
  scene.light = new Light(
    new Vec3(preset.direction.x, preset.direction.y, preset.direction.z),
    preset.intensity, preset.wrap, preset.ambient,
  );
  scene.lightBase = {
    x: preset.direction.x, y: preset.direction.y, z: preset.direction.z,
    intensity: preset.intensity,
  };
  scene.lightMotion = interpretLightMotion(lightWords);

  let camera = interpretCamera(visualState['spatial_logic'] ?? []);
  camera = interpretZoom(visualState['scale_perspective'] ?? [], camera);
  scene.camera = camera;

  scene.anim.speedScale = interpretSpeed(visualState['temporal_state'] ?? []);
  scene.shaderChars = interpretShader(visualState['material_substance'] ?? []);

  const renderWords = visualState['medium_render'] ?? [];
  scene.postfxNames = renderWords.length > 0 ? effectForWord(renderWords[0]) : [];

  const atmosWords = visualState['atmosphere_field'] ?? [];
  scene.particleSystem = atmosWords.length > 0 ? particleSystemForWord(atmosWords[0]) : null;

  // phenomenon × temporal: the process running on the object
  const phenWord = (visualState['phenomenon_pattern'] ?? [])[0];
  const tempWord = (visualState['temporal_state'] ?? [])[0] ?? '';
  scene.processInst = phenWord
    ? new ProcessInstance(processForWords(phenWord, tempWord, promptHash))
    : null;

  // setting_location: a whispered environment behind everything
  const settingWord = (visualState['setting_location'] ?? [])[0];
  scene.backdropInst = settingWord ? new BackdropInstance(backdropForWord(settingWord)) : null;

  // reflective materials sparkle
  scene.glint = interpretGlint(visualState['material_substance'] ?? []);
}
