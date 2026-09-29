/**
 * field.ts — the rest of the Wired.
 *
 * Out past the site screens, the room is made of other monitors: piled in
 * stacks, tipped over, hanging, most of them showing nothing in particular —
 * snow, bars, NO SIGNAL, a prompt, the old line. Two instanced meshes (bodies
 * and glass) and one small atlas, however many of them there are.
 */

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const TILES = 8; // 4 × 2 atlas; tile 0 is snow and never sampled

function makeAtlas(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 384;
  const ctx = c.getContext('2d');
  const tw = 256;
  const th = 192;
  if (ctx) {
    const at = (i: number) => [(i % 4) * tw, Math.floor(i / 4) * th] as const;
    const text = (i: number, lines: string[], color: string, bg: string, size = 26) => {
      const [x, y] = at(i);
      ctx.fillStyle = bg;
      ctx.fillRect(x, y, tw, th);
      ctx.fillStyle = color;
      ctx.font = `${size}px "Libertinus Mono", ui-monospace, monospace`;
      ctx.textAlign = 'center';
      lines.forEach((l, k) => ctx.fillText(l, x + tw / 2, y + th / 2 + (k - (lines.length - 1) / 2) * size * 1.3 + size * 0.35));
      ctx.textAlign = 'left';
    };
    text(1, ['NO SIGNAL'], '#ffffff', '#1432c8', 30);
    {
      const [x, y] = at(2);
      ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'].forEach((col, k) => {
        ctx.fillStyle = col;
        ctx.fillRect(x + (k * tw) / 7, y, tw / 7 + 1, th * 0.7);
      });
      ctx.fillStyle = '#0b0b0b';
      ctx.fillRect(x, y + th * 0.7, tw, th * 0.3);
    }
    text(3, ['PRESENT DAY', 'PRESENT TIME'], '#e8e8e8', '#050505', 22);
    {
      const [x, y] = at(4);
      ctx.fillStyle = '#000';
      ctx.fillRect(x, y, tw, th);
      ctx.fillStyle = '#b8b8b8';
      ctx.font = '18px ui-monospace, monospace';
      ctx.fillText('C:\\>_', x + 16, y + 34);
    }
    text(5, ['▶ PLAY'], '#ffffff', '#0a1a7a', 30);
    text(6, ['æ'], '#f4f1ea', '#000000', 110);
    text(7, ['CLOSE THE WORLD', 'OPEN THE nExT'], '#ff4a4a', '#070000', 18);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class Field {
  readonly group = new THREE.Group();
  private screens: THREE.InstancedMesh;
  private uniforms = {
    uTime: { value: 0 },
    uAtlas: { value: null as THREE.Texture | null },
    uFogColor: { value: new THREE.Color() },
    uFogDensity: { value: 0 },
  };

  constructor(count: number, rand: () => number, fog: THREE.FogExp2) {
    this.uniforms.uFogColor.value.copy(fog.color);
    this.uniforms.uFogDensity.value = fog.density;
    const bodyGeo = new RoundedBoxGeometry(1.26, 1.1, 0.95, 2, 0.05);
    bodyGeo.translate(0, 0.55, -0.475);
    const bodies = new THREE.InstancedMesh(
      bodyGeo,
      new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.05 }),
      count,
    );
    const glassGeo = new THREE.PlaneGeometry(1.0, 0.75);
    glassGeo.translate(0, 0.62, 0.004);
    this.uniforms.uAtlas.value = makeAtlas();
    const glassMat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: /* glsl */ `
        attribute float aTile;
        attribute float aSeed;
        attribute float aOn;
        varying vec2 vUv;
        varying float vTile, vSeed, vOn, vDepth;
        void main() {
          vUv = uv; vTile = aTile; vSeed = aSeed; vOn = aOn;
          vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          vDepth = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform sampler2D uAtlas;
        uniform vec3 uFogColor;
        uniform float uFogDensity;
        varying vec2 vUv;
        varying float vTile, vSeed, vOn, vDepth;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        void main() {
          vec2 c = vUv * 2.0 - 1.0;
          vec2 uv = c * (1.0 + dot(c, c) * 0.06) * 0.5 + 0.5;
          float snow = hash(floor(uv * vec2(160.0, 120.0)) + fract(uTime * 9.0 + vSeed) * 91.0);
          vec3 col = vec3(snow * 0.55);
          if (vTile > 0.5) {
            vec2 tile = vec2(mod(vTile, 4.0), floor(vTile / 4.0));
            vec2 a = (tile + clamp(uv, 0.0, 1.0)) / vec2(4.0, 2.0);
            a.y = 1.0 - ((tile.y + (1.0 - clamp(uv.y, 0.0, 1.0))) / 2.0);
            col = texture2D(uAtlas, a).rgb + (snow - 0.5) * 0.12;
          }
          col *= 0.75 + 0.25 * sin(uv.y * 240.0);
          // flicker, and the odd set dying and coming back
          float f = 0.75 + 0.25 * sin(uTime * (2.0 + vSeed * 3.0) + vSeed * 40.0);
          float drop = step(0.985, hash(vec2(floor(uTime * 2.0), vSeed * 100.0)));
          col *= f * (1.0 - drop * 0.9) * vOn * 0.9;
          col *= smoothstep(1.3, 0.5, length(c));
          col *= 1.0 - smoothstep(0.98, 1.02, max(abs(c.x), abs(c.y)) * (1.0 + dot(c, c) * 0.06));
          col += vec3(0.01, 0.012, 0.015);
          // glow through the haze rather than vanish into it
          float fogK = 1.0 - exp(-pow(uFogDensity * vDepth, 2.0));
          col = mix(col, uFogColor, fogK * 0.7);
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`,
    });
    this.screens = new THREE.InstancedMesh(glassGeo, glassMat, count);
    const tiles = new Float32Array(count);
    const seeds = new Float32Array(count);
    const ons = new Float32Array(count);

    const shells = [0xb9ae94, 0x17171a, 0x6d7076, 0x0d0d0f, 0x8f8a7c];
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const color = new THREE.Color();
    // piles: pick an anchor, stack a few, lean some
    let i = 0;
    while (i < count) {
      const a = rand() * Math.PI * 2;
      // nothing between you and the room: keep the near side (toward the camera) clear
      if (-Math.cos(a) > 0.3) continue;
      const r = 9 + rand() * 13;
      const x = Math.sin(a) * r;
      const z = -Math.cos(a) * r;
      const facing = Math.atan2(-x, -z) + (rand() - 0.5) * 0.9;
      const hanging = rand() < 0.14;
      const height = Math.min(count - i, hanging ? 1 : 1 + Math.floor(rand() * 4));
      let y = hanging ? 4 + rand() * 5 : 0;
      for (let k = 0; k < height; k++, i++) {
        const s = 0.8 + rand() * 0.9;
        const tipped = !hanging && k === 0 && rand() < 0.12;
        e.set(tipped ? -Math.PI / 2 + 0.1 : (rand() - 0.5) * 0.12, facing + (rand() - 0.5) * 0.35, tipped ? 0 : (rand() - 0.5) * 0.08);
        q.setFromEuler(e);
        m.compose(new THREE.Vector3(x + (rand() - 0.5) * 0.3, y, z + (rand() - 0.5) * 0.3), q, new THREE.Vector3(s, s, s));
        bodies.setMatrixAt(i, m);
        this.screens.setMatrixAt(i, m);
        bodies.setColorAt(i, color.setHex(shells[Math.floor(rand() * shells.length)] ?? 0x333333));
        tiles[i] = rand() < 0.45 ? 0 : 1 + Math.floor(rand() * (TILES - 1));
        seeds[i] = rand();
        ons[i] = rand() < 0.22 ? 0 : 0.35 + rand() * 0.65;
        y += 1.1 * s * (tipped ? 0.85 : 1);
      }
    }
    this.screens.geometry.setAttribute('aTile', new THREE.InstancedBufferAttribute(tiles, 1));
    this.screens.geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
    this.screens.geometry.setAttribute('aOn', new THREE.InstancedBufferAttribute(ons, 1));
    this.group.add(bodies, this.screens);
  }

  update(t: number): void {
    this.uniforms.uTime.value = t;
  }
}
