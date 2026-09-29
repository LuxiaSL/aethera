/**
 * wires.ts — everything in the room is plugged into everything else.
 *
 * Cables are tubes along Catmull-Rom paths, and every one of them carries
 * light: pulses run down its length (a patch on the standard material, so the
 * rubber still takes the room's light). A cable brightens when its screen is
 * chosen, and surges when the VCR sends a tape down it.
 *
 * Above the room, power lines: poles standing in the fog with wire strung
 * between them, black against a low red horizon. Present day, present time.
 */

import * as THREE from 'three';

const rubber = { color: 0x0b0b0c, roughness: 0.55, metalness: 0.0 };

export class Cable {
  readonly mesh: THREE.Mesh;
  readonly uniforms = {
    uPulseColor: { value: new THREE.Color() },
    uPulseTime: { value: 0 },
    uPulseGain: { value: 0.35 },
    uPulseCount: { value: 3 },
    uPulseSpeed: { value: 0.35 },
  };
  private base = 0.35;
  private surgeLeft = 0;
  private lit = 0;

  /** Pulses run from the VCR out to the screen (it is playing them). */
  constructor(points: THREE.Vector3[], radius: number, accent: string) {
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
    const length = curve.getLength();
    const geo = new THREE.TubeGeometry(curve, Math.max(40, Math.round(length * 18)), radius, 6, false);
    // our own copy of the along-the-length coordinate; don't lean on uv plumbing
    const uv = geo.attributes.uv as THREE.BufferAttribute;
    const along = new Float32Array(uv.count);
    for (let i = 0; i < uv.count; i++) along[i] = uv.getX(i);
    geo.setAttribute('aAlong', new THREE.BufferAttribute(along, 1));

    this.uniforms.uPulseColor.value.set(accent);
    this.uniforms.uPulseCount.value = Math.max(1, Math.round(length / 2.2));
    this.uniforms.uPulseSpeed.value = 0.18 + Math.random() * 0.12;
    const mat = new THREE.MeshStandardMaterial(rubber);
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float aAlong;\nvarying float vAlong;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvAlong = aAlong;');
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
uniform vec3 uPulseColor;
uniform float uPulseTime, uPulseGain, uPulseCount, uPulseSpeed;
varying float vAlong;`,
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
float ph = fract(vAlong * uPulseCount + uPulseTime * uPulseSpeed);
float pulse = smoothstep(0.0, 0.03, ph) * (1.0 - smoothstep(0.03, 0.14, ph));
totalEmissiveRadiance += uPulseColor * (pulse * uPulseGain + 0.012 * uPulseGain);`,
        );
    };
    mat.customProgramCacheKey = () => 'oikos-cable';
    this.mesh = new THREE.Mesh(geo, mat);
  }

  setLit(v: number): void {
    this.lit = v;
  }

  surge(): void {
    this.surgeLeft = 2.2;
  }

  update(t: number, dt: number): void {
    this.surgeLeft = Math.max(0, this.surgeLeft - dt);
    const surge = this.surgeLeft > 0 ? Math.sin((this.surgeLeft / 2.2) * Math.PI) * 5 : 0;
    const target = this.base + this.lit * 1.2 + surge;
    this.uniforms.uPulseGain.value += (target - this.uniforms.uPulseGain.value) * Math.min(1, dt * 6);
    this.uniforms.uPulseTime.value = t * (1 + this.lit * 1.5 + surge * 0.8);
  }
}

/** The floor route from a port on some screen to the back of the VCR. */
export function floorRoute(
  from: THREE.Vector3,
  back: THREE.Vector3, // outward direction behind the source
  vcrPort: THREE.Vector3,
  plinthBackZ: number,
  plinthTop: number,
  rand: () => number,
): THREE.Vector3[] {
  const floorY = 0.022;
  const pts: THREE.Vector3[] = [from.clone()];
  const out = from.clone().addScaledVector(back, 0.18);
  pts.push(out);
  const down = new THREE.Vector3(out.x, floorY, out.z).addScaledVector(back, 0.22);
  if (from.y > 0.3) pts.push(new THREE.Vector3(out.x, (from.y + floorY) * 0.4, out.z).addScaledVector(back, 0.2));
  pts.push(down);

  const end = new THREE.Vector3(vcrPort.x, floorY, plinthBackZ - 0.14);
  // round the plinth rather than through it
  const side = Math.sign(down.x || 1);
  if (down.z > plinthBackZ - 0.1) pts.push(new THREE.Vector3(side * 1.15, floorY, plinthBackZ - 0.25));
  const n = 2;
  for (let i = 1; i <= n; i++) {
    const k = i / (n + 1);
    const p = new THREE.Vector3().lerpVectors(down, end, k);
    const perp = new THREE.Vector3(end.z - down.z, 0, down.x - end.x).normalize();
    p.addScaledVector(perp, (rand() - 0.5) * 0.9);
    p.y = floorY;
    pts.push(p);
  }
  pts.push(end);
  pts.push(new THREE.Vector3(vcrPort.x, plinthTop - 0.04, plinthBackZ - 0.035));
  pts.push(new THREE.Vector3(vcrPort.x, plinthTop + 0.03, plinthBackZ + 0.01));
  pts.push(vcrPort.clone());
  return pts;
}

// ---- overhead ---------------------------------------------------------------

function catenary(a: THREE.Vector3, b: THREE.Vector3, sag: number, segs = 32): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segs; i++) {
    const k = i / segs;
    const p = new THREE.Vector3().lerpVectors(a, b, k);
    p.y -= sag * 4 * k * (1 - k);
    pts.push(p);
  }
  return pts;
}

export function makePowerLines(): THREE.Group {
  const g = new THREE.Group();
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x0d0b0b, roughness: 0.9 });
  const lineMat = new THREE.LineBasicMaterial({ color: 0x050404 });
  const poles = [
    new THREE.Vector3(-26, 0, -18),
    new THREE.Vector3(-9, 0, -24),
    new THREE.Vector3(8, 0, -23),
    new THREE.Vector3(24, 0, -15),
    new THREE.Vector3(33, 0, 2),
  ];
  const H = 12.5;
  const arms: THREE.Vector3[][] = [];
  poles.forEach((p, i) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.17, H, 8), poleMat);
    pole.position.set(p.x, H / 2, p.z);
    g.add(pole);
    const next = poles[i + 1] ?? poles[i - 1] ?? p;
    const dir = new THREE.Vector3().subVectors(next, p).setY(0).normalize();
    const across = new THREE.Vector3(-dir.z, 0, dir.x);
    const tips: THREE.Vector3[] = [];
    for (const [y, span] of [[H - 0.4, 1.9], [H - 1.5, 1.4]] as const) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(span * 2, 0.12, 0.12), poleMat);
      arm.position.set(p.x, y, p.z);
      arm.rotation.y = Math.atan2(-across.z, across.x);
      g.add(arm);
      for (const s of [-1, -0.45, 0.45, 1]) {
        tips.push(new THREE.Vector3(p.x, y + 0.08, p.z).addScaledVector(across, s * span * 0.95));
      }
    }
    // insulators: a little glint on each arm
    arms.push(tips);
  });
  for (let i = 0; i < arms.length - 1; i++) {
    const a = arms[i] ?? [];
    const b = arms[i + 1] ?? [];
    a.forEach((pa, k) => {
      const pb = b[k];
      if (!pb) return;
      const geo = new THREE.BufferGeometry().setFromPoints(catenary(pa, pb, 1.4 + (k % 3) * 0.25));
      g.add(new THREE.Line(geo, lineMat));
    });
  }
  // and a few that come down toward the room, where the hanging screens are
  // (over dream_gen at -20° and parlor at +20°; see layout.ts)
  const drops = [
    [arms[1]?.[0], new THREE.Vector3(-2.4, 9, -6.6)],
    [arms[2]?.[3], new THREE.Vector3(2.2, 9, -6.1)],
    [arms[3]?.[1], new THREE.Vector3(6, 8.5, -3)],
  ] as const;
  for (const [a, b] of drops) {
    if (!a) continue;
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(catenary(a, b, 2.2)), lineMat));
  }
  return g;
}

/** A dark dome with a low red horizon, for the wires to stand against. */
export function makeSky(): THREE.Mesh {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      varying vec3 vDir;
      void main() {
        float h = vDir.y;
        // an ember along the skyline, uneven, strongest right at the horizon —
        // where it equals HORIZON_FOG, so the far floor fogs into it seamlessly
        float az = atan(vDir.x, vDir.z);
        float uneven = 0.62 + 0.38 * sin(az * 2.0 + 0.6) * sin(az * 5.0 + 2.1);
        vec3 ember = vec3(0.045, 0.0055, 0.0075);
        vec3 col = ember * mix(1.0, uneven, smoothstep(0.0, 0.02, h)) * exp(-pow(max(h, 0.0) * 16.0, 1.6));
        col += vec3(0.004, 0.0008, 0.0014) * (1.0 - smoothstep(0.0, 0.5, h));
        if (h < 0.0) col = ember + vec3(0.004, 0.0008, 0.0014);
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(70, 32, 16), mat);
  sky.renderOrder = -1;
  return sky;
}
