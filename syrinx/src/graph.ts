/**
 * graph.ts — the creature's body. DOM-free so it can be smoke-tested headless.
 *
 * A small spring-graph organism in 3D world coordinates (a 1000³ world,
 * rendered by whoever cares to look). Nodes drift; edges are strings. Breaths
 * (wanderers) walk the body and pluck the strings they cross — and entrain
 * onto cycles, lapping them in strict time. Feeding grows it; old strings
 * fall silent; it refuses to fully die.
 */

import {
  continuousFreq,
  foldToRootRange,
  freqForLength,
  getRoot,
  LEN_MAX,
  lengthForFreq,
  pulseRateForLength,
  randomLatticeFreq,
  setRoot,
  snapToLattice,
} from './tuning';

export const WORLD = 1000;
const CENTER = WORLD / 2;
const TAU = Math.PI * 2;

export interface BodyNode {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  // runtime-only drift direction (regenerated on restore)
  wx: number;
  wy: number;
  wz: number;
  nourishment: number;
  age: number; // seconds
  // Kuramoto layer: the node's own oscillation. `phase` is state and is kept
  // across sessions; the *rate* is not stored at all — it is re-read from the
  // node's strings every step, so a deforming body retunes its own tempo.
  // `detune` is the one fixed thing: a small personal bias, born with the node.
  phase: number; // radians, [0, 2π)
  detune: number; // multiplier on the natural rate, ~1
}

export interface BodyEdge {
  id: number;
  a: number;
  b: number;
  restLen: number;
  age: number; // seconds
}

export interface Mote {
  x: number;
  y: number;
  z: number;
  targetNode: number;
}

export interface Orbit {
  cycle: number[]; // node ids, in ring order (snapshot; validated per hop)
  idx: number; // index of the breath's current node within cycle
  hopsLeft: number;
}

export interface Breath {
  from: number;
  to: number;
  progress: number; // 0..1 along current edge
  restUntil: number; // sim-time when it next moves
  orbit: Orbit | null; // entrained to a cycle: laps it in strict time
}

export type SimEvent =
  // `from` is the node the breath crossed *from*, so the light can travel the
  // way the breath did
  | {
      type: 'pluck';
      edgeId: number;
      from: number;
      freq: number;
      pan: number;
      gain: number;
      brightness: number;
    }
  | { type: 'birth'; nodeId: number }
  | { type: 'death'; freq: number; pan: number }
  | { type: 'fed'; nodeId: number }
  | { type: 'link'; edgeId: number } // a string tied by hand
  | { type: 'entrain'; beats: number } // a breath locked onto a cycle
  | { type: 'pulse'; nodeId: number; sync: number; tones: PulseTone[] } // a node fired
  | { type: 'modulation'; root: number } // the eldest died; the key moved
  | { type: 'refusal' }; // the body refused to end

/** One string of a node's strum. */
export interface PulseTone {
  edgeId: number;
  freq: number;
  pan: number;
}

/** One string, seen from a node: who it reaches, how hard, how late. */
interface Link {
  j: number; // neighbour index
  w: number; // coupling weight (age)
  alpha: number; // phase lag (length)
}

export interface CreatureState {
  nodes: BodyNode[];
  edges: BodyEdge[];
  nextNodeId: number;
  nextEdgeId: number;
  lifetime: number; // total seconds alive, across sessions
}

/** Which rhythm engines are audible. Each can be heard alone. */
export type RhythmMode = 'both' | 'pulse' | 'breath';

const MAX_NODES = 18;
const MIN_NODES = 4;
const SPRING_K = 3.0;
const REPULSE_DIST = 130;
const DAMPING = 2.2;
const MAX_SPEED = 60;
const NOURISH_TO_GROW = 2;
const EDGE_ELDER_AGE = 150; // seconds before a string may fall silent
const AMBIENT_FEED_INTERVAL = 24; // seconds
const WANDER_TRANSIT = 0.75; // seconds to cross an edge while wandering
const LAP_SECONDS = 3.6; // an orbit lap always takes this long → k-cycle = k evenly spaced beats
const ENTRAIN_PROB = 0.45;
const CYCLE_MIN = 3;
const CYCLE_MAX = 8;
const MAX_CYCLES = 6;
export const PRUNE_RADIUS = 12; // world units: how close a cut must pass to a string

// ---- Kuramoto layer ---------------------------------------------------------
/**
 * The chaos↔unison knob, in rad/s. 0 = every node alone; high = one body.
 *
 * These numbers are measured, not guessed — see `npm run sweep`. On a grown
 * body (~14 nodes) the transition is narrow: below ~0.6 the order parameter
 * sits at the incoherent floor, above ~1.6 it locks *rigidly* (r > 0.8 with
 * zero variance — one animal, but a metronome). The default sits mid-crossing,
 * where clusters lock and come apart and r wanders 0.45–0.81. Past 3 there is
 * nothing new to hear, so the knob stops at 6.
 */
export const COUPLING_DEFAULT = 1.0;
export const COUPLING_MAX = 6;
export const COUPLING_STEP = 0.1;
const DETUNE_SPREAD = 0.16; // ±8% personal bias, drawn at birth
const PHASE_MAX_STEP = 1 / 30; // substep so a long frame can't destabilise it
const PULSE_OCTAVE = 2; // strums sit an octave above the melody
const REFRACTORY = 0.4; // a node won't re-fire within this fraction of its period

/**
 * Phase lag (Sakaguchi): a long string takes longer to carry the news, so
 * neighbours don't lock *together*, they lock in *sequence* — which is what a
 * travelling wave is. Radians, at the longest string.
 */
const LAG_MAX = 0.55;
/**
 * A string's coupling grows as it ages. A newborn body is a scatter of
 * unrelated clocks and learns to keep time as it gets older; cutting an elder
 * scatters the pulse in a way cutting a fresh string does not. The body's
 * history is its rhythm.
 */
const EDGE_COUPLE_MIN = 0.4;
/**
 * Being fed pulls the body together for a while, then it drifts apart again.
 * The chaos↔unison axis stops being purely a knob you turn and becomes partly
 * something the creature does in response to you.
 */
const TENSION_PER_FEED = 0.55;
const TENSION_MAX = 1.6;
/**
 * Seconds to fall by 1/e. Must be well under AMBIENT_FEED_INTERVAL or the
 * creature's own upkeep keeps it permanently tense and the response to *you*
 * stops being legible — measured at 22s, a small growing body sat at +50%
 * coupling forever instead of gathering and letting go.
 */
const TENSION_TAU = 9;

export class Sim {
  nodes = new Map<number, BodyNode>();
  edges = new Map<number, BodyEdge>();
  motes: Mote[] = [];
  breaths: Breath[] = [];
  lifetime = 0;
  time = 0; // seconds this session
  /** Kuramoto coupling. Tune by ear; it is the one number that changes everything. */
  coupling = COUPLING_DEFAULT;
  pulseEnabled = true;
  breathEnabled = true;
  /** Transient tightening from being fed; decays back to 0 on its own. */
  tension = 0;
  private nextNodeId = 0;
  private nextEdgeId = 0;
  private events: SimEvent[] = [];
  private ambientTimer = AMBIENT_FEED_INTERVAL * 0.5;
  private silenceTimer = 0; // time spent with no edges
  private rand: () => number;
  private structureDirty = true;
  private cycleCache: number[][] = [];
  private bridgeCache = new Set<number>();
  private lastFire = new Map<number, number>(); // transient: refractory bookkeeping

  constructor(rand: () => number = Math.random) {
    this.rand = rand;
  }

  // ---- genesis / persistence -------------------------------------------

  genesis(): void {
    const n = 6;
    const radius = 150;
    const ring: number[] = [];
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      ring.push(
        this.addNode(
          CENTER + Math.cos(angle) * radius,
          CENTER + Math.sin(angle) * radius,
          CENTER + (this.rand() - 0.5) * 80, // off-plane so the body is born 3D
        ),
      );
    }
    for (let i = 0; i < n; i++) {
      const a = ring[i];
      const b = ring[(i + 1) % n];
      if (a !== undefined && b !== undefined) this.addEdge(a, b);
    }
    // one chord across the ring so genesis already holds an interval
    const a = ring[0];
    const b = ring[3];
    if (a !== undefined && b !== undefined) this.addEdge(a, b);
    this.spawnBreath();
    this.spawnBreath();
  }

  serialize(): CreatureState {
    return {
      nodes: [...this.nodes.values()].map((n) => ({ ...n })),
      edges: [...this.edges.values()].map((e) => ({ ...e })),
      nextNodeId: this.nextNodeId,
      nextEdgeId: this.nextEdgeId,
      lifetime: this.lifetime,
    };
  }

  restore(state: CreatureState): boolean {
    try {
      if (!Array.isArray(state.nodes) || !Array.isArray(state.edges) || state.nodes.length === 0) {
        return false;
      }
      this.nodes.clear();
      this.edges.clear();
      for (const n of state.nodes) {
        if (!Number.isFinite(n.x) || !Number.isFinite(n.y)) return false;
        // migrate flat (pre-3D) creatures: give them a little depth
        const z = Number.isFinite(n.z) ? n.z : CENTER + (this.rand() - 0.5) * 80;
        // migrate pre-pulse creatures: they wake with a phase and a character
        const phase = Number.isFinite(n.phase) ? n.phase : this.rand() * TAU;
        const detune = Number.isFinite(n.detune) && n.detune > 0
          ? n.detune
          : 1 + (this.rand() - 0.5) * DETUNE_SPREAD;
        this.nodes.set(n.id, {
          ...n,
          z,
          vx: 0,
          vy: 0,
          vz: 0,
          ...this.freshWander(),
          phase,
          detune,
        });
      }
      for (const e of state.edges) {
        if (this.nodes.has(e.a) && this.nodes.has(e.b)) this.edges.set(e.id, { ...e });
      }
      this.nextNodeId = state.nextNodeId;
      this.nextEdgeId = state.nextEdgeId;
      this.lifetime = Number.isFinite(state.lifetime) ? state.lifetime : 0;
      this.breaths = [];
      this.structureDirty = true;
      this.spawnBreath();
      this.spawnBreath();
      return this.nodes.size > 0;
    } catch {
      return false;
    }
  }

  private freshWander(): { wx: number; wy: number; wz: number } {
    const theta = this.rand() * Math.PI * 2;
    const phi = Math.acos(2 * this.rand() - 1);
    return {
      wx: Math.sin(phi) * Math.cos(theta),
      wy: Math.sin(phi) * Math.sin(theta),
      wz: Math.cos(phi),
    };
  }

  // ---- structure ---------------------------------------------------------

  addNode(x: number, y: number, z: number): number {
    const id = this.nextNodeId++;
    this.nodes.set(id, {
      id,
      x,
      y,
      z,
      vx: 0,
      vy: 0,
      vz: 0,
      ...this.freshWander(),
      nourishment: 0,
      age: 0,
      phase: this.rand() * TAU,
      detune: 1 + (this.rand() - 0.5) * DETUNE_SPREAD,
    });
    return id;
  }

  /** Which rhythm engines run. Silencing one leaves the other audible alone. */
  setRhythm(mode: RhythmMode): void {
    this.pulseEnabled = mode === 'both' || mode === 'pulse';
    this.breathEnabled = mode === 'both' || mode === 'breath';
  }

  setCoupling(k: number): void {
    if (!Number.isFinite(k)) return;
    this.coupling = Math.max(0, Math.min(COUPLING_MAX, k));
  }

  /** What the body is actually coupled at right now: the knob, plus feeding. */
  get effectiveCoupling(): number {
    return this.coupling * (1 + this.tension);
  }

  /**
   * A node's natural pulse rate in Hz, read off its strings right now. Nothing
   * in the sim needs this (stepPhases computes it inline) — it's for the eyes:
   * a star's colour temperature is its tempo.
   */
  naturalRate(nodeId: number): number {
    const node = this.nodes.get(nodeId);
    if (!node) return 0;
    const edges = this.edgesAt(nodeId);
    if (edges.length === 0) return 0;
    let total = 0;
    for (const e of edges) total += this.edgeLength(e);
    return pulseRateForLength(total / edges.length) * node.detune;
  }

  /** The node least in step with its neighbours — the one that needs company. */
  leastLockedNode(): number | null {
    let worst: number | null = null;
    let worstSync = Infinity;
    for (const n of this.nodes.values()) {
      if (this.neighbors(n.id).length === 0) continue;
      const s = this.localSync(n.id);
      if (s < worstSync) {
        worstSync = s;
        worst = n.id;
      }
    }
    return worst;
  }

  /** Send a mote to one particular node, from somewhere out in the dark. */
  private feedNode(nodeId: number): void {
    const n = this.nodes.get(nodeId);
    if (!n) return;
    const dir = this.freshWander();
    this.motes.push({
      x: n.x + dir.wx * 260,
      y: n.y + dir.wy * 260,
      z: n.z + dir.wz * 260,
      targetNode: nodeId,
    });
  }

  addEdge(a: number, b: number): number | null {
    if (a === b || this.edgeBetween(a, b)) return null;
    const id = this.nextEdgeId++;
    // rest length quantized to the lattice: born in tune
    const restLen = lengthForFreq(randomLatticeFreq(this.rand));
    this.edges.set(id, { id, a, b, restLen, age: 0 });
    this.structureDirty = true;
    return id;
  }

  edgeBetween(a: number, b: number): BodyEdge | undefined {
    for (const e of this.edges.values()) {
      if ((e.a === a && e.b === b) || (e.a === b && e.b === a)) return e;
    }
    return undefined;
  }

  neighbors(nodeId: number): number[] {
    const out: number[] = [];
    for (const e of this.edges.values()) {
      if (e.a === nodeId) out.push(e.b);
      else if (e.b === nodeId) out.push(e.a);
    }
    return out;
  }

  edgesAt(nodeId: number): BodyEdge[] {
    return [...this.edges.values()].filter((e) => e.a === nodeId || e.b === nodeId);
  }

  edgeLength(e: BodyEdge): number {
    const a = this.nodes.get(e.a);
    const b = this.nodes.get(e.b);
    if (!a || !b) return e.restLen;
    return Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
  }

  edgePan(e: BodyEdge): number {
    const a = this.nodes.get(e.a);
    const b = this.nodes.get(e.b);
    if (!a || !b) return 0;
    const mx = (a.x + b.x) / 2;
    return ((mx - CENTER) / CENTER) * 0.6;
  }

  centroid(): { x: number; y: number; z: number } {
    let x = 0;
    let y = 0;
    let z = 0;
    const count = this.nodes.size;
    if (count === 0) return { x: CENTER, y: CENTER, z: CENTER };
    for (const n of this.nodes.values()) {
      x += n.x;
      y += n.y;
      z += n.z;
    }
    return { x: x / count, y: y / count, z: z / count };
  }

  /** Tie a string between two nodes by hand. False if impossible/redundant. */
  link(a: number, b: number): boolean {
    if (!this.nodes.has(a) || !this.nodes.has(b)) return false;
    const id = this.addEdge(a, b);
    if (id === null) return false;
    this.events.push({ type: 'link', edgeId: id });
    return true;
  }

  /** Feed the creature at a point: a mote drifts toward the nearest node. */
  feed(x: number, y: number, z: number): void {
    const target = this.nearestNode(x, y, z);
    if (target === null) return;
    this.motes.push({ x, y, z, targetNode: target });
  }

  /**
   * Cut every string the blade passes near: a capsule sweep from p to q.
   * Returns the number of strings cut.
   */
  pruneSegment(
    px: number, py: number, pz: number,
    qx: number, qy: number, qz: number,
    radius: number = PRUNE_RADIUS,
  ): number {
    let cut = 0;
    for (const e of [...this.edges.values()]) {
      const a = this.nodes.get(e.a);
      const b = this.nodes.get(e.b);
      if (!a || !b) continue;
      const d = segSegDistance(px, py, pz, qx, qy, qz, a.x, a.y, a.z, b.x, b.y, b.z);
      if (d <= radius) {
        this.killEdge(e, true);
        cut++;
      }
    }
    return cut;
  }

  private killEdge(e: BodyEdge, pruned: boolean): void {
    const freq = freqForLength(this.edgeLength(e));
    this.edges.delete(e.id);
    this.structureDirty = true;
    this.events.push({ type: 'death', freq: pruned ? freq * 2 : freq, pan: this.edgePan(e) });
    // orphaned nodes dissolve — and if the eldest dies, the key dies with it
    for (const nodeId of [e.a, e.b]) {
      if (this.neighbors(nodeId).length === 0 && this.nodes.size > MIN_NODES) {
        const wasEldest = this.isEldest(nodeId);
        this.nodes.delete(nodeId);
        if (wasEldest) this.modulate();
      }
    }
    // breaths standing on removed structure re-perch
    this.breaths = this.breaths.filter((br) => this.nodes.has(br.to));
    while (this.breaths.length < 2 && this.nodes.size > 0) this.spawnBreath();
  }

  private isEldest(nodeId: number): boolean {
    const node = this.nodes.get(nodeId);
    if (!node) return false;
    for (const other of this.nodes.values()) {
      if (other.age > node.age) return false;
    }
    return true;
  }

  /**
   * The eldest node owned the tonic. It is gone. The lattice re-roots to the
   * pitch of the new elder's longest string (folded into register); if that
   * lands where we already are, fall to the dominant instead.
   */
  private modulate(): void {
    let elder: BodyNode | null = null;
    for (const n of this.nodes.values()) {
      if (this.neighbors(n.id).length === 0) continue;
      if (!elder || n.age > elder.age) elder = n;
    }
    if (!elder) return; // no strung nodes left; keep the old key for the regrowth
    let longest = 0;
    for (const e of this.edgesAt(elder.id)) {
      longest = Math.max(longest, this.edgeLength(e));
    }
    if (longest <= 0) return;
    let newRoot = foldToRootRange(snapToLattice(continuousFreq(longest)));
    if (Math.abs(newRoot - getRoot()) < 0.5) newRoot = foldToRootRange(getRoot() * 1.5);
    setRoot(newRoot);
    this.events.push({ type: 'modulation', root: newRoot });
  }

  private nearestNode(x: number, y: number, z: number): number | null {
    let best: number | null = null;
    let bestDist = Infinity;
    for (const n of this.nodes.values()) {
      const d = Math.hypot(n.x - x, n.y - y, n.z - z);
      if (d < bestDist) {
        bestDist = d;
        best = n.id;
      }
    }
    return best;
  }

  private spawnBreath(): void {
    const ids = [...this.nodes.keys()];
    const id = ids[Math.floor(this.rand() * ids.length)];
    if (id === undefined) return;
    this.breaths.push({
      from: id,
      to: id,
      progress: 1,
      restUntil: this.time + 1 + this.rand() * 2,
      orbit: null,
    });
  }

  drainEvents(): SimEvent[] {
    const out = this.events;
    this.events = [];
    return out;
  }

  // ---- structure reading (cycles = clocks, bridges = load-bearing) --------

  /** Fundamental cycles (3..8 nodes), recomputed lazily on structure change. */
  cyclesList(): readonly number[][] {
    this.refreshStructure();
    return this.cycleCache;
  }

  /** Edge ids whose loss would disconnect the body. */
  bridgeEdgeIds(): ReadonlySet<number> {
    this.refreshStructure();
    return this.bridgeCache;
  }

  private refreshStructure(): void {
    if (!this.structureDirty) return;
    this.structureDirty = false;
    this.cycleCache = this.computeCycles();
    this.bridgeCache = this.computeBridges();
  }

  private computeCycles(): number[][] {
    // BFS spanning forest, then one fundamental cycle per non-tree edge
    const parent = new Map<number, number | null>();
    const treeEdges = new Set<string>();
    const key = (a: number, b: number): string => (a < b ? `${a}-${b}` : `${b}-${a}`);
    for (const start of this.nodes.keys()) {
      if (parent.has(start)) continue;
      parent.set(start, null);
      const queue = [start];
      while (queue.length > 0) {
        const cur = queue.shift();
        if (cur === undefined) break;
        for (const nb of this.neighbors(cur)) {
          if (!parent.has(nb)) {
            parent.set(nb, cur);
            treeEdges.add(key(cur, nb));
            queue.push(nb);
          }
        }
      }
    }
    const ancestry = (id: number): number[] => {
      const path: number[] = [];
      let cur: number | null | undefined = id;
      while (cur !== null && cur !== undefined && path.length <= this.nodes.size) {
        path.push(cur);
        cur = parent.get(cur);
      }
      return path;
    };
    const seen = new Set<string>();
    const cycles: number[][] = [];
    for (const e of this.edges.values()) {
      if (treeEdges.has(key(e.a, e.b))) continue;
      const pathA = ancestry(e.a);
      const pathB = ancestry(e.b);
      const inA = new Set(pathA);
      const lcaIdx = pathB.findIndex((n) => inA.has(n));
      if (lcaIdx < 0) continue; // different components (shouldn't happen)
      const lca = pathB[lcaIdx];
      if (lca === undefined) continue;
      const upA = pathA.slice(0, pathA.indexOf(lca) + 1); // a → lca
      const upB = pathB.slice(0, lcaIdx).reverse(); // (lca..] → b
      const cycle = [...upA, ...upB]; // a → lca → b, plus edge b→a closes it
      if (cycle.length < CYCLE_MIN || cycle.length > CYCLE_MAX) continue;
      const sig = [...cycle].sort((x, y) => x - y).join(',');
      if (seen.has(sig)) continue;
      seen.add(sig);
      cycles.push(cycle);
    }
    cycles.sort((a, b) => a.length - b.length);
    return cycles.slice(0, MAX_CYCLES);
  }

  private computeBridges(): Set<number> {
    const bridges = new Set<number>();
    for (const e of this.edges.values()) {
      // BFS from e.a with e removed; if e.b is unreachable, e is a bridge
      const visited = new Set<number>([e.a]);
      const queue = [e.a];
      let reached = false;
      while (queue.length > 0 && !reached) {
        const cur = queue.shift();
        if (cur === undefined) break;
        for (const other of this.edges.values()) {
          if (other.id === e.id) continue;
          let nb: number | null = null;
          if (other.a === cur) nb = other.b;
          else if (other.b === cur) nb = other.a;
          if (nb === null || visited.has(nb)) continue;
          if (nb === e.b) {
            reached = true;
            break;
          }
          visited.add(nb);
          queue.push(nb);
        }
      }
      if (!reached) bridges.add(e.id);
    }
    return bridges;
  }

  // ---- dynamics ------------------------------------------------------------

  step(dt: number): void {
    this.time += dt;
    this.lifetime += dt;
    this.stepPhysics(dt);
    this.stepMotes(dt);
    this.stepBreaths(dt);
    this.stepPhases(dt);
    this.stepLife(dt);
  }

  // ---- the Kuramoto layer ---------------------------------------------------

  /**
   * Every node is a phase oscillator running at a rate read off its own
   * strings; every string is a coupling. Nothing here schedules anything —
   * θ̇ᵢ = ωᵢ + (K/degᵢ)·Σⱼ sin(θⱼ − θᵢ), and when a phase comes round it fires,
   * strumming the strings it holds. Rhythm is whatever that settles into:
   * near K=0 the body is a scatter of unrelated clocks, high K and it beats as
   * one animal, and in between — where it is worth living — clusters lock,
   * drift apart, and pass waves of strums along the strings.
   */
  private stepPhases(dt: number): void {
    if (!this.pulseEnabled || this.nodes.size === 0) return;

    // index the body once: geometry is fixed for the whole frame
    const ids = [...this.nodes.keys()];
    const index = new Map<number, number>();
    ids.forEach((id, i) => index.set(id, i));
    const links: Link[][] = ids.map(() => []);
    const spanLen: number[] = ids.map(() => 0);
    const degree: number[] = ids.map(() => 0);
    for (const e of this.edges.values()) {
      const ia = index.get(e.a);
      const ib = index.get(e.b);
      if (ia === undefined || ib === undefined) continue;
      const len = this.edgeLength(e);
      // every string carries its own coupling strength and its own delay
      const w = edgeCoupling(e);
      const alpha = LAG_MAX * clamp01(len / LEN_MAX);
      links[ia]?.push({ j: ib, w, alpha });
      links[ib]?.push({ j: ia, w, alpha });
      spanLen[ia] = (spanLen[ia] ?? 0) + len;
      spanLen[ib] = (spanLen[ib] ?? 0) + len;
      degree[ia] = (degree[ia] ?? 0) + 1;
      degree[ib] = (degree[ib] ?? 0) + 1;
    }
    const K = this.effectiveCoupling;

    // natural rates, re-read from the body as it stands right now
    const omega: number[] = ids.map((id, i) => {
      const node = this.nodes.get(id);
      const deg = degree[i] ?? 0;
      if (!node || deg === 0) return 0; // an unstrung node has nothing to keep time for
      const mean = (spanLen[i] ?? 0) / deg;
      return TAU * pulseRateForLength(mean) * node.detune;
    });

    const fired: number[] = [];
    let remaining = dt;
    let guard = 0;
    while (remaining > 1e-9 && guard++ < 64) {
      const h = Math.min(remaining, PHASE_MAX_STEP);
      remaining -= h;
      // every derivative reads the same snapshot — stepping in place would let
      // map iteration order decide who leads whom, which is not a rhythm, it's
      // an artefact
      const snapshot = ids.map((id) => this.nodes.get(id)?.phase ?? 0);
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        if (id === undefined) continue;
        const node = this.nodes.get(id);
        if (!node) continue;
        const mine = snapshot[i] ?? 0;
        const neighbours = links[i] ?? [];
        let pull = 0;
        if (neighbours.length > 0) {
          let sum = 0;
          for (const l of neighbours) {
            const d = (snapshot[l.j] ?? 0) - mine;
            // Sakaguchi lag, DC-compensated: `+ sin(α)` makes the bracket vanish
            // when the pair is in phase. Plain `sin(d − α)` carries a constant
            // −sin(α) that scales with K, so turning the coupling up would drag
            // the whole body slower and eventually stall it — an instrument
            // that stops when you turn a knob up is a broken instrument. This
            // keeps the symmetry-breaking (waves) and drops the brake.
            sum += l.w * (Math.sin(d - l.alpha) + Math.sin(l.alpha));
          }
          pull = (K / neighbours.length) * sum;
        }
        const next = mine + ((omega[i] ?? 0) + pull) * h;
        if (!Number.isFinite(next)) {
          node.phase = 0;
          continue;
        }
        // The dynamics stay pure Kuramoto — strong coupling really can haul a
        // slow node backwards, and it should. Only the *firing* is gated: a
        // phase shoved to and fro across the line would otherwise chatter at
        // frame rate, which is a rendering artefact, not a rhythm.
        const cameRound = next >= TAU;
        node.phase = ((next % TAU) + TAU) % TAU;
        if (!cameRound || (degree[i] ?? 0) === 0) continue;
        const period = TAU / Math.max(0.05, omega[i] ?? 0);
        const last = this.lastFire.get(id);
        if (last !== undefined && this.time - last < period * REFRACTORY) continue;
        this.lastFire.set(id, this.time);
        fired.push(id);
      }
    }

    for (const id of fired) this.emitPulse(id);
  }

  /** A node has come round: strum every string it holds. */
  private emitPulse(nodeId: number): void {
    const edges = this.edgesAt(nodeId);
    if (edges.length === 0) return;
    const tones: PulseTone[] = [];
    for (const e of edges) {
      const freq = freqForLength(this.edgeLength(e)) * PULSE_OCTAVE;
      if (!Number.isFinite(freq) || freq <= 0) continue;
      tones.push({ edgeId: e.id, freq, pan: this.edgePan(e) });
    }
    if (tones.length === 0) return;
    this.events.push({ type: 'pulse', nodeId, sync: this.localSync(nodeId), tones });
  }

  /**
   * How locked a node is with the nodes it can reach along its strings: 1 when
   * every neighbour is exactly in phase with it, 0 when they are scattered.
   * This is what the ear is being asked to hear, so it is what drives the sound.
   */
  localSync(nodeId: number): number {
    const node = this.nodes.get(nodeId);
    if (!node) return 0;
    const neighbours = this.neighbors(nodeId);
    if (neighbours.length === 0) return 0;
    let re = 0;
    let im = 0;
    for (const j of neighbours) {
      const other = this.nodes.get(j);
      if (!other) continue;
      const d = other.phase - node.phase;
      re += Math.cos(d);
      im += Math.sin(d);
    }
    return Math.hypot(re, im) / neighbours.length;
  }

  /** Local sync for every node at once — one pass, for the renderer. */
  syncMap(): Map<number, number> {
    const out = new Map<number, number>();
    for (const id of this.nodes.keys()) out.set(id, this.localSync(id));
    return out;
  }

  /**
   * The Kuramoto order parameter r = |⟨e^{iθ}⟩| over the whole body.
   * 0 = incoherent, 1 = one pulse. The number the coupling knob is moving.
   */
  order(): number {
    if (this.nodes.size === 0) return 0;
    let re = 0;
    let im = 0;
    for (const n of this.nodes.values()) {
      re += Math.cos(n.phase);
      im += Math.sin(n.phase);
    }
    return Math.hypot(re, im) / this.nodes.size;
  }

  private stepPhysics(dt: number): void {
    // springs
    for (const e of this.edges.values()) {
      const a = this.nodes.get(e.a);
      const b = this.nodes.get(e.b);
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dz = b.z - a.z;
      const len = Math.hypot(dx, dy, dz) || 1e-6;
      const f = SPRING_K * (len - e.restLen);
      const fx = (dx / len) * f;
      const fy = (dy / len) * f;
      const fz = (dz / len) * f;
      a.vx += fx * dt;
      a.vy += fy * dt;
      a.vz += fz * dt;
      b.vx -= fx * dt;
      b.vy -= fy * dt;
      b.vz -= fz * dt;
      e.age += dt;
    }
    // repulsion + integration
    const all = [...this.nodes.values()];
    for (let i = 0; i < all.length; i++) {
      const a = all[i];
      if (!a) continue;
      for (let j = i + 1; j < all.length; j++) {
        const b = all[j];
        if (!b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        const d = Math.hypot(dx, dy, dz) || 1e-6;
        if (d < REPULSE_DIST) {
          const f = ((REPULSE_DIST - d) / REPULSE_DIST) * 40;
          a.vx -= (dx / d) * f * dt;
          a.vy -= (dy / d) * f * dt;
          a.vz -= (dz / d) * f * dt;
          b.vx += (dx / d) * f * dt;
          b.vy += (dy / d) * f * dt;
          b.vz += (dz / d) * f * dt;
        }
      }
    }
    for (const n of all) {
      if (!n) continue;
      n.age += dt;
      // slow personal drift: the wander direction random-walks on the sphere
      n.wx += (this.rand() - 0.5) * dt * 3;
      n.wy += (this.rand() - 0.5) * dt * 3;
      n.wz += (this.rand() - 0.5) * dt * 3;
      const wlen = Math.hypot(n.wx, n.wy, n.wz) || 1e-6;
      n.wx /= wlen;
      n.wy /= wlen;
      n.wz /= wlen;
      n.vx += n.wx * 4 * dt;
      n.vy += n.wy * 4 * dt;
      n.vz += n.wz * 4 * dt;
      // gentle homing to keep the body on stage
      n.vx += (CENTER - n.x) * 0.02 * dt;
      n.vy += (CENTER - n.y) * 0.02 * dt;
      n.vz += (CENTER - n.z) * 0.02 * dt;
      const damp = Math.max(0, 1 - DAMPING * dt);
      n.vx *= damp;
      n.vy *= damp;
      n.vz *= damp;
      const speed = Math.hypot(n.vx, n.vy, n.vz);
      if (speed > MAX_SPEED) {
        n.vx = (n.vx / speed) * MAX_SPEED;
        n.vy = (n.vy / speed) * MAX_SPEED;
        n.vz = (n.vz / speed) * MAX_SPEED;
      }
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      n.z += n.vz * dt;
      if (!Number.isFinite(n.x) || !Number.isFinite(n.y) || !Number.isFinite(n.z)) {
        n.x = CENTER;
        n.y = CENTER;
        n.z = CENTER;
        n.vx = 0;
        n.vy = 0;
        n.vz = 0;
      }
    }
  }

  private stepMotes(dt: number): void {
    const arrived: Mote[] = [];
    for (const m of this.motes) {
      const target = this.nodes.get(m.targetNode);
      if (!target) {
        arrived.push(m); // target dissolved; the offering dissipates
        continue;
      }
      const dx = target.x - m.x;
      const dy = target.y - m.y;
      const dz = target.z - m.z;
      const d = Math.hypot(dx, dy, dz) || 1e-6;
      const speed = 55;
      m.x += (dx / d) * speed * dt;
      m.y += (dy / d) * speed * dt;
      m.z += (dz / d) * speed * dt;
      if (d < 10) {
        arrived.push(m);
        target.nourishment += 1;
        // being fed pulls the body together for a minute or so
        this.tension = Math.min(TENSION_MAX, this.tension + TENSION_PER_FEED);
        this.events.push({ type: 'fed', nodeId: target.id });
        this.maybeGrow(target);
      }
    }
    if (arrived.length > 0) this.motes = this.motes.filter((m) => !arrived.includes(m));
  }

  private maybeGrow(parent: BodyNode): void {
    if (parent.nourishment < NOURISH_TO_GROW || this.nodes.size >= MAX_NODES) return;
    parent.nourishment = 0;
    const dir = this.freshWander(); // uniform direction on the sphere
    const dist = 70 + this.rand() * 40;
    const childId = this.addNode(
      parent.x + dir.wx * dist,
      parent.y + dir.wy * dist,
      parent.z + dir.wz * dist,
    );
    // a child arrives on its parent's timing, not out of nowhere — a new limb
    // joins the pulse already half in step, and drifts from there
    const child = this.nodes.get(childId);
    if (child) {
      child.phase = (parent.phase + (this.rand() - 0.5) * 0.6 + TAU) % TAU;
    }
    this.addEdge(parent.id, childId);
    // sometimes close a cycle — cycles are chords, and clocks
    const others = this.neighbors(parent.id).filter((id) => id !== childId);
    const cycleMate = others[Math.floor(this.rand() * others.length)];
    if (cycleMate !== undefined && this.rand() < 0.4) this.addEdge(childId, cycleMate);
    this.events.push({ type: 'birth', nodeId: childId });
  }

  private stepBreaths(dt: number): void {
    if (!this.breathEnabled) return;
    for (const br of this.breaths) {
      const transit = br.orbit ? LAP_SECONDS / br.orbit.cycle.length : WANDER_TRANSIT;
      if (br.progress < 1) {
        br.progress = Math.min(1, br.progress + dt / transit);
        if (br.progress >= 1) {
          this.pluckEdgeBetween(br.from, br.to);
          this.onBreathArrive(br);
        }
        continue;
      }
      if (br.orbit) continue; // orbit hops are chained in onBreathArrive
      if (this.time < br.restUntil) continue;
      const options = this.neighbors(br.to);
      const next = options[Math.floor(this.rand() * options.length)];
      if (next === undefined) {
        // stranded — re-perch somewhere connected
        const withEdges = [...this.nodes.keys()].filter((id) => this.neighbors(id).length > 0);
        const perch = withEdges[Math.floor(this.rand() * withEdges.length)];
        if (perch !== undefined) {
          br.from = perch;
          br.to = perch;
        }
        br.restUntil = this.time + 2;
        continue;
      }
      br.from = br.to;
      br.to = next;
      br.progress = 0;
      br.restUntil = this.time + 0.9 + this.rand() * 2.2;
    }
  }

  /**
   * A breath has just landed on br.to. In orbit: take the next hop of the lap
   * immediately (strict time — one lap of a k-cycle is always LAP_SECONDS, so
   * a 3-cycle against a 5-cycle is a true 3:5 polyrhythm). Wandering: maybe
   * entrain onto a cycle passing through this node, else rest.
   */
  private onBreathArrive(br: Breath): void {
    if (br.orbit) {
      if (br.orbit.hopsLeft <= 0 || !this.orbitHop(br)) {
        br.orbit = null;
        br.restUntil = this.time + 1 + this.rand() * 2;
      }
      return;
    }
    const here = br.to;
    const cycles = this.cyclesList().filter((c) => c.includes(here));
    const chosen = cycles[Math.floor(this.rand() * cycles.length)];
    if (chosen && this.rand() < ENTRAIN_PROB) {
      const laps = 2 + Math.floor(this.rand() * 3);
      br.orbit = {
        cycle: [...chosen],
        idx: chosen.indexOf(here),
        hopsLeft: chosen.length * laps,
      };
      this.events.push({ type: 'entrain', beats: chosen.length });
      if (!this.orbitHop(br)) {
        br.orbit = null;
        br.restUntil = this.time + 1 + this.rand() * 2;
      }
      return;
    }
    br.restUntil = this.time + 0.9 + this.rand() * 2.2;
  }

  /** Advance one hop around the orbit. False if the loop no longer exists. */
  private orbitHop(br: Breath): boolean {
    const orbit = br.orbit;
    if (!orbit) return false;
    const k = orbit.cycle.length;
    const nextIdx = (orbit.idx + 1) % k;
    const next = orbit.cycle[nextIdx];
    if (next === undefined || !this.nodes.has(next) || !this.edgeBetween(br.to, next)) {
      return false; // pruned out from under it
    }
    br.from = br.to;
    br.to = next;
    br.progress = 0;
    orbit.idx = nextIdx;
    orbit.hopsLeft--;
    return true;
  }

  private pluckEdgeBetween(a: number, b: number): void {
    const e = this.edgeBetween(a, b);
    if (!e) return;
    const len = this.edgeLength(e);
    const freq = snapToLattice(continuousFreq(len));
    const brightness = e.age < 40 ? 1 : Math.max(0.25, 1 - (e.age - 40) / 200);
    this.events.push({
      type: 'pluck',
      edgeId: e.id,
      from: a,
      freq,
      pan: this.edgePan(e),
      gain: 0.18 + this.rand() * 0.08,
      brightness,
    });
  }

  private stepLife(dt: number): void {
    // the tightening from being fed relaxes on its own
    this.tension *= Math.exp(-dt / TENSION_TAU);
    if (this.tension < 1e-4) this.tension = 0;

    // ambient feeding keeps a neglected creature slowly changing
    this.ambientTimer -= dt;
    if (this.ambientTimer <= 0) {
      this.ambientTimer = AMBIENT_FEED_INTERVAL * (0.7 + this.rand() * 0.6);
      if (this.nodes.size < MAX_NODES * 0.75 && this.rand() < 0.7) {
        // the body's own upkeep goes to whichever node is least in step —
        // it grows a limb, gains a neighbour, couples harder. Rhythm stops
        // merely reading the body and starts shaping it.
        const lonely = this.pulseEnabled ? this.leastLockedNode() : null;
        if (lonely !== null) {
          this.feedNode(lonely);
        } else {
          const dir = this.freshWander();
          this.feed(CENTER + dir.wx * 380, CENTER + dir.wy * 380, CENTER + dir.wz * 380);
        }
      }
    }
    // elder strings fall silent when the body is dense
    if (this.edges.size > this.nodes.size * 1.35) {
      for (const e of this.edges.values()) {
        if (e.age > EDGE_ELDER_AGE && this.rand() < dt * 0.02) {
          this.killEdge(e, false);
          break;
        }
      }
    }
    // it refuses to end
    if (this.edges.size === 0) {
      this.silenceTimer += dt;
      if (this.silenceTimer > 4) {
        this.silenceTimer = 0;
        this.regrow();
      }
    } else {
      this.silenceTimer = 0;
    }
  }

  private regrow(): void {
    if (this.nodes.size < 2) {
      const a = this.addNode(CENTER - 60, CENTER, CENTER);
      const b = this.addNode(CENTER + 60, CENTER, CENTER);
      this.addEdge(a, b);
    } else {
      const ids = [...this.nodes.keys()];
      const a = ids[Math.floor(this.rand() * ids.length)];
      if (a === undefined) return;
      const nodeA = this.nodes.get(a);
      if (!nodeA) return;
      const bId = this.nearestOther(nodeA);
      if (bId !== null) this.addEdge(a, bId);
    }
    this.events.push({ type: 'refusal' });
    while (this.breaths.length < 2) this.spawnBreath();
  }

  private nearestOther(node: BodyNode): number | null {
    let best: number | null = null;
    let bestDist = Infinity;
    for (const other of this.nodes.values()) {
      if (other.id === node.id) continue;
      const d = Math.hypot(other.x - node.x, other.y - node.y, other.z - node.z);
      if (d < bestDist) {
        bestDist = d;
        best = other.id;
      }
    }
    return best;
  }
}

function clamp01(t: number): number {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

/**
 * How strongly a string couples the nodes it joins: young strings barely talk,
 * elders insist. A newborn body can't hold a pulse; an old one can.
 */
function edgeCoupling(e: BodyEdge): number {
  return EDGE_COUPLE_MIN + (1 - EDGE_COUPLE_MIN) * clamp01(e.age / EDGE_ELDER_AGE);
}

/** Minimum distance between segments P1Q1 and P2Q2 (Ericson, RTC 5.1.9). */
function segSegDistance(
  p1x: number, p1y: number, p1z: number,
  q1x: number, q1y: number, q1z: number,
  p2x: number, p2y: number, p2z: number,
  q2x: number, q2y: number, q2z: number,
): number {
  const d1x = q1x - p1x, d1y = q1y - p1y, d1z = q1z - p1z;
  const d2x = q2x - p2x, d2y = q2y - p2y, d2z = q2z - p2z;
  const rx = p1x - p2x, ry = p1y - p2y, rz = p1z - p2z;
  const a = d1x * d1x + d1y * d1y + d1z * d1z;
  const e = d2x * d2x + d2y * d2y + d2z * d2z;
  const f = d2x * rx + d2y * ry + d2z * rz;
  const EPS = 1e-9;
  const clamp = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
  let s = 0;
  let t = 0;
  if (a <= EPS && e <= EPS) {
    return Math.hypot(rx, ry, rz);
  }
  if (a <= EPS) {
    t = clamp(f / e);
  } else {
    const c = d1x * rx + d1y * ry + d1z * rz;
    if (e <= EPS) {
      s = clamp(-c / a);
    } else {
      const b = d1x * d2x + d1y * d2y + d1z * d2z;
      const denom = a * e - b * b;
      s = denom > EPS ? clamp((b * f - c * e) / denom) : 0;
      t = (b * s + f) / e;
      if (t < 0) {
        t = 0;
        s = clamp(-c / a);
      } else if (t > 1) {
        t = 1;
        s = clamp((b - c) / a);
      }
    }
  }
  const c1x = p1x + d1x * s, c1y = p1y + d1y * s, c1z = p1z + d1z * s;
  const c2x = p2x + d2x * t, c2y = p2y + d2y * t, c2z = p2z + d2z * t;
  return Math.hypot(c1x - c2x, c1y - c2y, c1z - c2z);
}
