/**
 * monitor.ts — a CRT, built from boxes.
 *
 * Four housings, one silhouette: a bezel, the fat tube housing behind it, the
 * neck behind that. The glass is a bulged plane under the CRT shader, and a
 * strip of masking tape on the bezel says which channel it is, in marker.
 * The group's origin is the bottom-centre of the bezel, so monitors stack.
 */

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import { makeCrtMaterial, makeTubeGeometry, type CrtMaterial } from './crt';

export type MonitorStyle = 'beige' | 'tv' | 'grey' | 'black';

const BODY: Record<MonitorStyle, { color: number; rough: number }> = {
  beige: { color: 0xb9ae94, rough: 0.62 },
  tv: { color: 0x17171a, rough: 0.42 },
  grey: { color: 0x6d7076, rough: 0.55 },
  black: { color: 0x0d0d0f, rough: 0.5 },
};

const materials = new Map<MonitorStyle, THREE.MeshStandardMaterial>();
function bodyMaterial(style: MonitorStyle): THREE.MeshStandardMaterial {
  let m = materials.get(style);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color: BODY[style].color, roughness: BODY[style].rough, metalness: 0.05 });
    materials.set(style, m);
  }
  return m;
}

const recessMat = new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.35, metalness: 0.2 });

function tapeTexture(text: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 56;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#d8cfae';
    ctx.fillRect(0, 0, 256, 56);
    // torn ends and a little grime
    ctx.fillStyle = 'rgba(120,100,60,0.18)';
    for (let i = 0; i < 40; i++) ctx.fillRect(Math.random() * 256, Math.random() * 56, 2, 1);
    ctx.globalCompositeOperation = 'destination-out';
    for (let y = 0; y < 56; y += 4) {
      ctx.fillRect(0, y, Math.random() * 5, 4);
      ctx.fillRect(256 - Math.random() * 5, y, 5, 4);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#16161c';
    ctx.font = 'bold 30px "Libertinus Mono", "Comic Sans MS", "Marker Felt", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.save();
    ctx.translate(128, 30);
    ctx.rotate(-0.02);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export interface MonitorOpts {
  style: MonitorStyle;
  screenW: number;
  screen: HTMLCanvasElement;
  label: string;
  accent: string;
  seed: number;
  stand?: boolean;
}

export class Monitor {
  readonly group = new THREE.Group();
  readonly texture: THREE.CanvasTexture;
  readonly crt: CrtMaterial;
  readonly glass: THREE.Mesh;
  readonly hit: THREE.Mesh;
  readonly height: number;
  readonly width: number;
  readonly depth: number;
  readonly screenH: number;
  /** local-space centre of the glass, and the local rear port the cable leaves from */
  readonly screenLocal: THREE.Vector3;
  readonly portLocal: THREE.Vector3;
  readonly topLocal: THREE.Vector3;
  private led: THREE.Mesh;

  constructor(opts: MonitorOpts) {
    const sw = opts.screenW;
    const sh = sw * 0.75;
    this.screenH = sh;
    const bw = sw * 1.26;
    const bh = sh + sw * 0.34;
    const bd = sw * 0.2;
    this.width = bw;
    this.height = bh + (opts.stand ? sw * 0.08 : 0);
    const lift = opts.stand ? sw * 0.08 : 0;
    const body = bodyMaterial(opts.style);

    const bezel = new THREE.Mesh(new RoundedBoxGeometry(bw, bh, bd, 3, sw * 0.045), body);
    bezel.position.set(0, lift + bh / 2, -bd / 2);
    this.group.add(bezel);

    const hd = sw * 0.62;
    const housing = new THREE.Mesh(new RoundedBoxGeometry(bw * 0.84, bh * 0.86, hd, 3, sw * 0.08), body);
    housing.position.set(0, lift + bh * 0.52, -bd - hd / 2 + sw * 0.04);
    this.group.add(housing);

    const nd = sw * 0.3;
    const neck = new THREE.Mesh(new RoundedBoxGeometry(bw * 0.46, bh * 0.46, nd, 2, sw * 0.05), body);
    neck.position.set(0, lift + bh * 0.54, -bd - hd - nd / 2 + sw * 0.1);
    this.group.add(neck);
    this.depth = bd + hd + nd - sw * 0.14;

    if (opts.stand) {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(sw * 0.34, sw * 0.4, lift, 24), body);
      base.position.set(0, lift / 2, -bd - hd * 0.4);
      this.group.add(base);
    }

    const screenY = lift + bh / 2 + sw * 0.07;
    this.screenLocal = new THREE.Vector3(0, screenY, 0.02);
    this.portLocal = new THREE.Vector3(sw * 0.1, lift + bh * 0.25, -this.depth + sw * 0.05);
    this.topLocal = new THREE.Vector3(0, lift + bh, -bd - hd * 0.45);

    const recess = new THREE.Mesh(new THREE.PlaneGeometry(sw * 1.05, sh * 1.05), recessMat);
    recess.position.set(0, screenY, 0.002);
    this.group.add(recess);

    this.texture = new THREE.CanvasTexture(opts.screen);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;
    this.crt = makeCrtMaterial(this.texture, opts.seed);
    this.glass = new THREE.Mesh(makeTubeGeometry(sw, sh, sw * 0.035), this.crt);
    this.glass.position.set(0, screenY, 0.004);
    this.group.add(this.glass);

    const tape = new THREE.Mesh(
      new THREE.PlaneGeometry(sw * 0.4, sw * 0.088),
      new THREE.MeshStandardMaterial({ map: tapeTexture(opts.label), transparent: true, roughness: 0.9 }),
    );
    tape.position.set(-sw * 0.18, lift + sw * 0.075, 0.003);
    tape.rotation.z = (opts.seed % 7) * 0.012 - 0.03;
    this.group.add(tape);

    this.led = new THREE.Mesh(
      new THREE.SphereGeometry(sw * 0.014, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0x1a2a1a }),
    );
    this.led.position.set(bw / 2 - sw * 0.12, lift + sw * 0.08, 0.004);
    this.group.add(this.led);

    // knobs, on the sets that would have had them
    if (opts.style === 'tv' || opts.style === 'grey') {
      const knobMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2e, roughness: 0.4 });
      for (let k = 0; k < 2; k++) {
        const knob = new THREE.Mesh(new THREE.CylinderGeometry(sw * 0.028, sw * 0.028, sw * 0.03, 16), knobMat);
        knob.rotation.x = Math.PI / 2;
        knob.position.set(bw / 2 - sw * 0.24 - k * sw * 0.09, lift + sw * 0.08, 0.012);
        this.group.add(knob);
      }
    }

    this.hit = new THREE.Mesh(
      new THREE.BoxGeometry(bw, bh, this.depth),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    this.hit.position.set(0, lift + bh / 2, -this.depth / 2);
    this.group.add(this.hit);
  }

  setLed(on: boolean, color: string): void {
    (this.led.material as THREE.MeshBasicMaterial).color.set(on ? color : '#1a2a1a');
  }

  /** world position of a local point */
  world(local: THREE.Vector3): THREE.Vector3 {
    this.group.updateMatrixWorld(true);
    return local.clone().applyMatrix4(this.group.matrixWorld);
  }

  /** world-space outward normal of the glass */
  normal(): THREE.Vector3 {
    const q = new THREE.Quaternion();
    this.group.getWorldQuaternion(q);
    return new THREE.Vector3(0, 0, 1).applyQuaternion(q);
  }
}
