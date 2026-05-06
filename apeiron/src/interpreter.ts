import { Vec3 } from './math/vec';
import { fnv1a } from './hash';
import { Light } from './render/rasterizer';
import { Camera } from './render/transform';
import { GeomKind, Scene } from './scene/scene';
import { shaderForWord, DEFAULT_SHADER } from './shaders';
import { particleSystemForWord } from './fx/particles';
import { effectForWord } from './fx/postfx';

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

export function configureScene(
  scene: Scene,
  visualState: Record<string, string[]>,
  templateId: string,
): void {
  scene.geomKind = TEMPLATE_GEOM[templateId] ?? GeomKind.MESH_FILLED;
  scene.light = interpretLight(visualState['light_behavior'] ?? []);

  let camera = interpretCamera(visualState['spatial_logic'] ?? []);
  camera = interpretZoom(visualState['scale_perspective'] ?? [], camera);
  scene.camera = camera;

  scene.anim.speedScale = interpretSpeed(visualState['temporal_state'] ?? []);
  scene.shaderChars = interpretShader(visualState['material_substance'] ?? []);

  const renderWords = visualState['medium_render'] ?? [];
  scene.postfxNames = renderWords.length > 0 ? effectForWord(renderWords[0]) : [];

  const atmosWords = visualState['atmosphere_field'] ?? [];
  scene.particleSystem = atmosWords.length > 0 ? particleSystemForWord(atmosWords[0]) : null;
}
