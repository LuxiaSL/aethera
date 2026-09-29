/**
 * post.ts — the look.
 *
 * Bloom first (so the tubes and the cable pulses bleed), then one pass of our
 * own: Lain's shadows. In the show, shade is drawn with specks of red; here the
 * penumbra — not the void, not the lit — gets a rotated dot screen in blood
 * red, so light falling off a screen reads as the Wired rather than as
 * darkness. Then grain, a vignette, a breath of chromatic aberration, and a
 * tear across the frame whenever the VCR changes channel.
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const WiredShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uTear: { value: 0 },
    uDot: { value: 3.0 },
    uHalftone: { value: 1.0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uRes;
    uniform float uTime, uTear, uDot, uHalftone;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec2 uv = vUv;
      // a tear: bands of the frame slip sideways
      float band = floor(uv.y * 24.0 + uTime * 30.0);
      uv.x += uTear * (hash(vec2(band, floor(uTime * 20.0))) - 0.5) * 0.06 * step(0.6, hash(vec2(band, 3.0)));

      vec2 d = uv - 0.5;
      float ca = 0.0012 + dot(d, d) * 0.004 + uTear * 0.006;
      vec3 col = vec3(
        texture2D(tDiffuse, uv + d * ca * 4.0).r,
        texture2D(tDiffuse, uv).g,
        texture2D(tDiffuse, uv - d * ca * 4.0).b
      );

      // Lain's red shade: a 45° dot screen, only in the penumbra
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      float pen = smoothstep(0.006, 0.03, lum) * (1.0 - smoothstep(0.05, 0.13, lum));
      vec2 px = gl_FragCoord.xy / uDot;
      vec2 r = vec2(px.x + px.y, px.x - px.y) * 0.7071;
      float cell = length(fract(r) - 0.5);
      float dotR = 0.12 + 0.2 * pen;
      float speck = 1.0 - smoothstep(dotR - 0.06, dotR + 0.06, cell);
      col = mix(col, max(col, vec3(0.22, 0.01, 0.025)), speck * pen * 0.55 * uHalftone);

      // grain and a vignette
      float g = hash(gl_FragCoord.xy + fract(uTime) * 311.0);
      col += (g - 0.5) * 0.035;
      col *= smoothstep(1.05, 0.35, length(d * vec2(1.0, 0.8)));
      gl_FragColor = vec4(col, 1.0);
    }`,
};

export class Post {
  readonly composer: EffectComposer;
  readonly bloom: UnrealBloomPass;
  private wired: ShaderPass;
  private tear = 0;

  /** ShaderPass clones the uniforms it is given; these are its copies */
  private get u(): typeof WiredShader.uniforms {
    return this.wired.uniforms as unknown as typeof WiredShader.uniforms;
  }

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.7, 0.5, 0.78);
    this.composer.addPass(this.bloom);
    this.wired = new ShaderPass(WiredShader);
    this.composer.addPass(this.wired);
    this.composer.addPass(new OutputPass());
  }

  setSize(w: number, h: number, pixelRatio: number): void {
    this.composer.setPixelRatio(pixelRatio);
    this.composer.setSize(w, h);
    this.u.uRes.value.set(w * pixelRatio, h * pixelRatio);
    this.u.uDot.value = Math.max(2.5, 3 * pixelRatio);
  }

  /** a channel change tears the frame for a moment */
  kick(amount = 1): void {
    this.tear = Math.max(this.tear, amount);
  }

  setHalftone(on: boolean): void {
    this.u.uHalftone.value = on ? 1 : 0;
  }

  render(t: number, dt: number): void {
    this.tear = Math.max(0, this.tear - dt * 2.2);
    this.u.uTime.value = t;
    this.u.uTear.value = this.tear * this.tear;
    this.composer.render(dt);
  }
}
