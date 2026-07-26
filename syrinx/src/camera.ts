/**
 * camera.ts — the flywheel, on a quaternion.
 *
 * This replaces OrbitControls, for one reason: OrbitControls stores its
 * orientation as spherical coordinates around a fixed world up-vector, so the
 * poles are a genuine coordinate singularity. You cannot tumble through them,
 * only clamp at them — and a clamp that the momentum decays into is an
 * *attractor*, which is exactly what it felt like. That isn't a tuning
 * problem; a fixed up-vector cannot express free rotation.
 *
 * So orientation is a quaternion and angular velocity is an axis-angle vector.
 * There is no pole, no up, no clamp. You can roll it over the top and it keeps
 * going, because "over the top" isn't a special place any more.
 *
 * The camera sits at `target + q·(0,0,distance)` and is oriented by `q`, so it
 * always looks at the target and its own up tumbles with it.
 */

import * as THREE from 'three';

export interface FlywheelOptions {
  minDistance: number;
  maxDistance: number;
  /** The pace it always returns to, rad/s about world Y. Sign sets direction. */
  restRate: number;
  /** Seconds to ease back to the resting spin. */
  settle: number;
  /** Ceiling on a fling, rad/s. */
  maxRate: number;
  /** Radians of rotation per pixel dragged. */
  sensitivity: number;
}

/** Radians of accumulated rotation below which a press counts as a bare click. */
const DRAG_THRESHOLD = 0.02;

const DEFAULTS: FlywheelOptions = {
  minDistance: 250,
  maxDistance: 2500,
  restRate: -(0.35 * (2 * Math.PI)) / 60, // what OrbitControls' autoRotateSpeed 0.35 gave
  settle: 3.4,
  maxRate: 3.2,
  sensitivity: 0.005,
};

export class Flywheel {
  readonly target = new THREE.Vector3();
  distance: number;
  readonly options: FlywheelOptions;

  /** Orientation. Camera position and facing are both derived from this. */
  private readonly q = new THREE.Quaternion();
  /** World-space angular velocity: direction = axis, length = rad/s. */
  private readonly omega = new THREE.Vector3();
  private readonly restOmega = new THREE.Vector3();

  private dragging = false;
  private pendingX = 0;
  private pendingY = 0;
  private dragArc = 0;
  private readonly observed = new THREE.Vector3();

  // scratch — this runs every frame, so nothing here allocates
  private readonly dq = new THREE.Quaternion();
  private readonly axis = new THREE.Vector3();
  private readonly up = new THREE.Vector3();
  private readonly right = new THREE.Vector3();
  private readonly instant = new THREE.Vector3();
  private readonly offset = new THREE.Vector3();

  constructor(camera: THREE.Camera, target: THREE.Vector3, opts: Partial<FlywheelOptions> = {}) {
    this.options = { ...DEFAULTS, ...opts };
    this.target.copy(target);
    this.offset.copy(camera.position).sub(target);
    this.distance = THREE.MathUtils.clamp(
      this.offset.length() || this.options.maxDistance * 0.5,
      this.options.minDistance,
      this.options.maxDistance,
    );
    // seed the orientation from wherever the camera already is
    camera.lookAt(target);
    this.q.copy(camera.quaternion);
    this.restOmega.set(0, this.options.restRate, 0);
    this.omega.copy(this.restOmega);
  }

  // ---- input ---------------------------------------------------------------

  /**
   * Pressing the button **stops the world**. Holding it with no drag is how you
   * hold the creature still to aim at it — and it also fixes the momentum
   * fighting your hand, which it did when the spin was still being applied
   * underneath an active drag.
   */
  beginDrag(): void {
    this.dragging = true;
    this.dragArc = 0;
    this.pendingX = 0;
    this.pendingY = 0;
    this.observed.set(0, 0, 0);
    this.omega.set(0, 0, 0);
  }

  /** Accumulate pointer movement; it is consumed once per frame, not per event. */
  drag(dx: number, dy: number): void {
    if (!this.dragging) return;
    this.pendingX += dx;
    this.pendingY += dy;
  }

  /**
   * Letting go either throws it or releases it. A drag hands over whatever
   * velocity you were turning it at; a bare click — no rotation at all — lets
   * it resume at the resting pace rather than at whatever it happened to be
   * doing before you grabbed it. Clean split: motion comes from moving.
   */
  endDrag(): void {
    if (!this.dragging) return;
    this.dragging = false;
    if (this.dragArc < DRAG_THRESHOLD) {
      this.omega.copy(this.restOmega);
      return;
    }
    this.omega.copy(this.observed).clampLength(0, this.options.maxRate);
  }

  dolly(deltaY: number): void {
    this.distance = THREE.MathUtils.clamp(
      this.distance * Math.exp(deltaY * 0.0012),
      this.options.minDistance,
      this.options.maxDistance,
    );
  }

  // ---- per frame -----------------------------------------------------------

  update(camera: THREE.Camera, dt: number): void {
    if (!Number.isFinite(dt) || dt <= 0) {
      this.place(camera);
      return;
    }

    if (this.dragging) {
      // Held means held. The spin is not applied at all here — leaving it
      // running underneath an active drag is what made the inertia fight your
      // hand instead of yielding to it.
      this.applyDrag(dt);
      this.place(camera);
      return;
    }

    // ease the whole velocity vector home — because it's a vector and not an
    // angle, a fling about any axis unwinds smoothly into the resting spin
    // without ever passing through a special orientation
    const ease = 1 - Math.exp(-dt / this.options.settle);
    this.omega.lerp(this.restOmega, ease);

    const rate = this.omega.length();
    if (rate > 1e-7) {
      this.axis.copy(this.omega).divideScalar(rate);
      this.dq.setFromAxisAngle(this.axis, rate * dt);
      this.q.premultiply(this.dq).normalize();
    }
    this.place(camera);
  }

  private applyDrag(dt: number): void {
    const s = this.options.sensitivity;
    const ax = -this.pendingX * s;
    const ay = -this.pendingY * s;
    this.pendingX = 0;
    this.pendingY = 0;
    if (ax === 0 && ay === 0) return;

    // horizontal drag turns about the camera's *own* up, vertical about its own
    // right. Both tumble with it, which is what makes this gimbal-free.
    this.up.set(0, 1, 0).applyQuaternion(this.q);
    this.right.set(1, 0, 0).applyQuaternion(this.q);
    this.dq.setFromAxisAngle(this.up, ax);
    this.q.premultiply(this.dq);
    this.dq.setFromAxisAngle(this.right, ay);
    this.q.premultiply(this.dq).normalize();

    // smoothed: one frame of pointer delta is far too noisy to fling on
    this.instant.copy(this.up).multiplyScalar(ax / dt).addScaledVector(this.right, ay / dt);
    this.observed.lerp(this.instant, Math.min(1, dt * 10));
    this.dragArc += Math.abs(ax) + Math.abs(ay);
  }

  private place(camera: THREE.Camera): void {
    this.offset.set(0, 0, this.distance).applyQuaternion(this.q);
    camera.position.copy(this.target).add(this.offset);
    camera.quaternion.copy(this.q);
  }

  // ---- read-only, for the HUD and the headless behaviour check --------------

  /** Signed spin about world Y — the component the resting pace lives on. */
  get spinY(): number {
    return this.omega.y;
  }

  /** Total angular speed, rad/s, whatever axis it's about. */
  get rate(): number {
    return this.omega.length();
  }

  /** An azimuth, purely so the spin can be measured from outside. */
  azimuth(): number {
    return Math.atan2(this.offset.x, this.offset.z);
  }

  /** Height of the eye above the target's horizontal plane, normalised. */
  elevation(): number {
    const len = this.offset.length() || 1;
    return this.offset.y / len;
  }
}
