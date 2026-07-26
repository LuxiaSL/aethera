/**
 * smoke.ts — headless life-support check. I can't hear, but I can verify the
 * body holds together: no NaNs, events flow, growth and pruning work, it
 * refuses to die, and a save/restore round-trip preserves the creature.
 */

import { COUPLING_DEFAULT, COUPLING_MAX, Sim, type RhythmMode } from '../src/graph';
import {
  PULSE_MAX,
  PULSE_MIN,
  continuousFreq,
  freqForLength,
  getRoot,
  latticeTones,
  lengthForFreq,
  pulseRateForLength,
} from '../src/tuning';

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error(`✗ ${msg}`);
    throw new Error(`smoke failed: ${msg}`);
  }
  console.log(`✓ ${msg}`);
}

// deterministic rand for reproducibility
let seed = 42;
const rand = (): number => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};

// tuning sanity
assert(latticeTones().length > 8, `lattice has ${latticeTones().length} tones`);
const f = freqForLength(180);
assert(latticeTones().some((l) => Math.abs(l - f) < 1e-6), 'freqForLength lands on the lattice');
const round = continuousFreq(lengthForFreq(220));
assert(Math.abs(round - 220) < 1, `length↔freq round-trip (${round.toFixed(2)} ≈ 220)`);

// genesis + long run
const sim = new Sim(rand);
sim.genesis();
assert(sim.nodes.size === 6 && sim.edges.size === 7, 'genesis body: 6 nodes, 7 strings');

// structure reading: ring + chord = two 4-cycles, and nothing is a bridge
const cycles = sim.cyclesList();
assert(cycles.length === 2, `genesis has ${cycles.length} fundamental cycles (expected 2)`);
assert(cycles.every((c) => c.length >= 3 && c.length <= 8), 'cycle lengths in band');
assert(sim.bridgeEdgeIds().size === 0, 'genesis ring has no bridges');

// a bare chain is all bridges — and a hand-tied link closes it into a cycle
const chain = new Sim(rand);
const c0 = chain.addNode(100, 100, 100);
const c1 = chain.addNode(200, 100, 100);
const c2 = chain.addNode(300, 100, 100);
chain.addEdge(c0, c1);
chain.addEdge(c1, c2);
assert(chain.bridgeEdgeIds().size === 2, 'chain: every string is load-bearing');
assert(chain.cyclesList().length === 0, 'chain has no cycles');
assert(chain.link(c0, c2), 'link ties a string by hand');
assert(!chain.link(c0, c2), 'link refuses duplicates');
assert(chain.cyclesList().length === 1, 'hand-tied link closes a cycle');
assert(chain.bridgeEdgeIds().size === 0, 'the cycle relieves every bridge');
assert(chain.drainEvents().some((ev) => ev.type === 'link'), 'link event emitted');

let plucks = 0;
let badFreqs = 0;
let entrains = 0;
const DT = 1 / 60;
for (let i = 0; i < 60 * 60 * 5; i++) {
  // 5 simulated minutes
  sim.step(DT);
  for (const ev of sim.drainEvents()) {
    if (ev.type === 'pluck') {
      plucks++;
      if (!Number.isFinite(ev.freq) || ev.freq < 20 || ev.freq > 2000) badFreqs++;
    }
    if (ev.type === 'entrain') entrains++;
  }
}
assert(badFreqs === 0, `all pluck freqs sane (${plucks} plucks)`);
assert(entrains > 3, `breaths entrained onto cycles ${entrains} times`);
for (const n of sim.nodes.values()) {
  assert(
    Number.isFinite(n.x) && Number.isFinite(n.y) && Number.isFinite(n.z),
    `node ${n.id} position finite in 3D`,
  );
  break;
}
{
  let spread = 0;
  const c = sim.centroid();
  for (const n of sim.nodes.values()) spread = Math.max(spread, Math.abs(n.z - c.z));
  assert(spread > 5, `body is genuinely 3D (z-spread ${spread.toFixed(1)})`);
}
assert(plucks > 20, `breaths plucked ${plucks} times in 5 minutes`);
assert(sim.nodes.size >= 4 && sim.nodes.size <= 18, `population in band (${sim.nodes.size} nodes)`);

// feeding grows it (eventually)
const before = sim.nodes.size;
for (let round2 = 0; round2 < 12; round2++) {
  const first = [...sim.nodes.values()][0];
  if (first) sim.feed(first.x + 30, first.y + 30, first.z + 30);
  for (let i = 0; i < 60 * 8; i++) sim.step(DT);
  sim.drainEvents();
}
assert(sim.nodes.size >= before, `feeding does not shrink it (${before} → ${sim.nodes.size})`);

// prune everything → refusal
for (let attempts = 0; attempts < 50 && sim.edges.size > 0; attempts++) {
  for (const e of [...sim.edges.values()]) {
    const a = sim.nodes.get(e.a);
    const b = sim.nodes.get(e.b);
    if (!a || !b) continue;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const mz = (a.z + b.z) / 2;
    sim.pruneSegment(mx - 5, my - 5, mz, mx + 5, my + 5, mz);
  }
}
assert(sim.edges.size === 0, 'total pruning possible');
let refused = false;
for (let i = 0; i < 60 * 10 && !refused; i++) {
  sim.step(DT);
  refused = sim.drainEvents().some((ev) => ev.type === 'refusal');
}
assert(refused, 'it refuses to end');
assert(sim.edges.size > 0, 'strings regrown after refusal');

// modulation: kill the eldest node (fresh creature), the key must move
const mod = new Sim(rand);
mod.genesis();
for (let i = 0; i < 60 * 10; i++) mod.step(DT); // age the body
mod.drainEvents();
const rootBefore = getRoot();
// orphan one genesis node (all tie as eldest) by cutting its strings
const victim = [...mod.nodes.values()][0];
let modulated = false;
if (victim) {
  for (const e of mod.edgesAt(victim.id)) {
    const a = mod.nodes.get(e.a);
    const b = mod.nodes.get(e.b);
    if (!a || !b) continue;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const mz = (a.z + b.z) / 2;
    mod.pruneSegment(mx - 6, my - 6, mz, mx + 6, my + 6, mz);
  }
  modulated = mod.drainEvents().some((ev) => ev.type === 'modulation');
}
assert(modulated, 'elder death fires modulation');
assert(Math.abs(getRoot() - rootBefore) > 0.5, `root moved (${rootBefore.toFixed(1)} → ${getRoot().toFixed(1)})`);

// save / restore round-trip
const state = sim.serialize();
const sim2 = new Sim(rand);
assert(sim2.restore(state), 'restore accepts serialized state');
assert(sim2.nodes.size === sim.nodes.size && sim2.edges.size === sim.edges.size, 'round-trip preserves body');
assert(Math.abs(sim2.lifetime - sim.lifetime) < 1e-6, 'round-trip preserves age');
for (let i = 0; i < 60 * 30; i++) sim2.step(DT);
for (const n of sim2.nodes.values()) {
  assert(Number.isFinite(n.x), 'restored body still integrates');
  break;
}

// ---- the Kuramoto layer ------------------------------------------------------
// I can't hear it, but sync is a number: r = |⟨e^{iθ}⟩| over the body. These
// checks pin the *regimes* (scatter / partial / lock), not the exact tuning —
// the tuning is `npm run sweep`'s job and belongs to the ear.

console.log('');
assert(pulseRateForLength(0) > pulseRateForLength(10_000), 'short strings pulse faster than long');
{
  const r = pulseRateForLength(150);
  assert(r >= PULSE_MIN && r <= PULSE_MAX, `pulse rate in band (${r.toFixed(3)} Hz)`);
}

/** Grow a body big enough to have a rhythm, then measure it at coupling k. */
function pulseBody(k: number, mode: RhythmMode = 'both'): {
  sim: Sim;
  meanOrder: number;
  sdOrder: number;
  pulses: number;
  plucks: number;
  badTones: number;
} {
  const body = new Sim(rand);
  body.genesis();
  body.setRhythm(mode);
  body.setCoupling(k);
  for (let round2 = 0; round2 < 14; round2++) {
    const first = [...body.nodes.values()][0];
    if (first) body.feed(first.x + 20, first.y + 20, first.z + 20);
    for (let i = 0; i < 60 * 6; i++) body.step(DT);
    body.drainEvents();
  }
  for (let i = 0; i < 60 * 25; i++) {
    body.step(DT); // settle out of the transient
    body.drainEvents();
  }
  const samples: number[] = [];
  let pulses = 0;
  let plucks2 = 0;
  let badTones = 0;
  for (let i = 0; i < 60 * 70; i++) {
    body.step(DT);
    for (const ev of body.drainEvents()) {
      if (ev.type === 'pulse') {
        pulses++;
        if (!Number.isFinite(ev.sync) || ev.sync < 0 || ev.sync > 1.0001) badTones++;
        for (const tone of ev.tones) {
          if (!Number.isFinite(tone.freq) || tone.freq < 20 || tone.freq > 2000) badTones++;
        }
      }
      if (ev.type === 'pluck') plucks2++;
    }
    if (i % 6 === 0) samples.push(body.order());
  }
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const sd = Math.sqrt(samples.reduce((a, b) => a + (b - mean) ** 2, 0) / samples.length);
  return { sim: body, meanOrder: mean, sdOrder: sd, pulses, plucks: plucks2, badTones };
}

const loose = pulseBody(0);
const floorR = 1 / Math.sqrt(loose.sim.nodes.size); // r floats near 1/√N by chance alone
assert(loose.badTones === 0, `uncoupled: ${loose.pulses} strums, all tones sane`);
assert(loose.pulses > 40, `uncoupled body still fires (${loose.pulses} strums)`);
assert(
  loose.meanOrder < floorR + 0.15,
  `K=0 stays incoherent (r ${loose.meanOrder.toFixed(2)}, floor ${floorR.toFixed(2)})`,
);

const welded = pulseBody(COUPLING_MAX);
assert(welded.badTones === 0, `welded: ${welded.pulses} strums, all tones sane`);
assert(
  welded.meanOrder > 0.9,
  `K=${COUPLING_MAX} locks the body into one pulse (r ${welded.meanOrder.toFixed(2)})`,
);
assert(
  welded.sdOrder < 0.05,
  `a welded body stops wandering (sd ${welded.sdOrder.toFixed(3)})`,
);

const living = pulseBody(COUPLING_DEFAULT);
assert(living.badTones === 0, `default K: ${living.pulses} strums, all tones sane`);
assert(
  living.meanOrder > floorR + 0.12 && living.meanOrder < 0.88,
  `default K=${COUPLING_DEFAULT} sits in partial sync (r ${living.meanOrder.toFixed(2)})`,
);
assert(
  living.sdOrder > 0.04,
  `and keeps moving — clusters lock and come apart (sd ${living.sdOrder.toFixed(3)})`,
);
assert(
  living.meanOrder > loose.meanOrder && welded.meanOrder > living.meanOrder,
  `the knob is monotone: ${loose.meanOrder.toFixed(2)} < ${living.meanOrder.toFixed(2)} < ${welded.meanOrder.toFixed(2)}`,
);

for (const n of living.sim.nodes.values()) {
  assert(
    Number.isFinite(n.phase) && n.phase >= 0 && n.phase < Math.PI * 2,
    `phases stay finite and wrapped (node ${n.id}: ${n.phase.toFixed(3)})`,
  );
  break;
}

// each engine can be heard alone — the whole point of building it as a layer
const pulseOnly = pulseBody(COUPLING_DEFAULT, 'pulse');
assert(pulseOnly.plucks === 0, 'pulse-only: the breaths are silent');
assert(pulseOnly.pulses > 40, `pulse-only: the body still strums (${pulseOnly.pulses})`);
const breathOnly = pulseBody(COUPLING_DEFAULT, 'breath');
assert(breathOnly.pulses === 0, 'breath-only: no strums');
assert(breathOnly.plucks > 20, `breath-only: the breaths still play (${breathOnly.plucks})`);

// phase is part of the creature, like the key it sleeps in
{
  const before = living.sim.serialize();
  const woken = new Sim(rand);
  assert(woken.restore(before), 'restore accepts a body with phases');
  const a = [...living.sim.nodes.values()][0];
  const b = woken.nodes.get(a?.id ?? -1);
  assert(
    !!a && !!b && Math.abs(a.phase - b.phase) < 1e-9 && Math.abs(a.detune - b.detune) < 1e-9,
    'it wakes mid-breath, on the phase it fell asleep on',
  );
}

// ---- phase lag: they lock in *sequence*, not together -----------------------
// The wave signature. Without lag a fully coupled body collapses to one phase
// and every neighbour pair differs by ~0; with it, a locked body still carries
// a phase gradient along its strings, which is what makes a strum travel.
{
  const body = pulseBody(4.0).sim;
  assert(body.order() > 0.85, `at K=4 the body locks (r ${body.order().toFixed(2)})`);
  let spread = 0;
  let pairs = 0;
  for (const e of body.edges.values()) {
    const a = body.nodes.get(e.a);
    const b = body.nodes.get(e.b);
    if (!a || !b) continue;
    const d = Math.abs(((b.phase - a.phase + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    spread += d;
    pairs++;
  }
  const meanGap = spread / Math.max(1, pairs);
  assert(
    meanGap > 0.03,
    `and still locks in sequence, not together (mean neighbour gap ${meanGap.toFixed(3)} rad)`,
  );
}

// ---- coupling from string age: the body's history is its rhythm -------------
{
  const grown = pulseBody(COUPLING_DEFAULT).sim.serialize();
  const measureAged = (edgeAge: number): number => {
    const body = new Sim(rand);
    body.restore(grown);
    body.setCoupling(COUPLING_DEFAULT);
    for (const e of body.edges.values()) e.age = edgeAge;
    for (const n of body.nodes.values()) n.phase = rand() * Math.PI * 2;
    let sum = 0;
    let count = 0;
    for (let i = 0; i < 60 * 90; i++) {
      body.step(DT);
      body.drainEvents();
      // hold the ages fixed: we are asking what age *does*, not watching it change
      if (i % 30 === 0) for (const e of body.edges.values()) e.age = edgeAge;
      if (i > 60 * 20 && i % 6 === 0) {
        sum += body.order();
        count++;
      }
    }
    return sum / Math.max(1, count);
  };
  const young = measureAged(2);
  const old = measureAged(400);
  assert(
    old > young + 0.05,
    `an old body keeps time better than a young one (r ${young.toFixed(2)} → ${old.toFixed(2)})`,
  );
}

// ---- feeding tightens it, then it lets go -----------------------------------
{
  const body = new Sim(rand);
  body.genesis();
  body.setCoupling(COUPLING_DEFAULT);
  for (let i = 0; i < 60 * 4; i++) body.step(DT);
  body.tension = 0;
  const restingK = body.effectiveCoupling;
  const first = [...body.nodes.values()][0];
  if (first) {
    for (let f = 0; f < 3; f++) body.feed(first.x + 12, first.y + 12, first.z + 12);
  }
  for (let i = 0; i < 60 * 3; i++) body.step(DT);
  const fedK = body.effectiveCoupling;
  assert(fedK > restingK * 1.2, `feeding tightens the body (K ${restingK.toFixed(2)} → ${fedK.toFixed(2)})`);
  // it lets go — but the creature also feeds *itself* every ~24s, so the right
  // claim is that it comes back down between feeds, not that it ends down
  let floorK = Infinity;
  for (let i = 0; i < 60 * 60; i++) {
    body.step(DT);
    if (i > 60 * 5) floorK = Math.min(floorK, body.effectiveCoupling);
  }
  assert(
    floorK < restingK * 1.06,
    `and it lets go again between feeds (K falls back to ${floorK.toFixed(2)})`,
  );
}

// ---- sync as fitness: the upkeep goes to whoever is out of step -------------
{
  const body = pulseBody(COUPLING_DEFAULT).sim;
  const lonely = body.leastLockedNode();
  assert(lonely !== null, 'the body can name its least-locked node');
  if (lonely !== null) {
    const mine = body.localSync(lonely);
    let worseExists = false;
    for (const n of body.nodes.values()) {
      if (body.neighbors(n.id).length === 0) continue;
      if (body.localSync(n.id) < mine - 1e-9) worseExists = true;
    }
    assert(!worseExists, `and it is genuinely the loneliest (sync ${mine.toFixed(2)})`);
  }
}

// ---- a child arrives on its parent's timing ---------------------------------
{
  const body = new Sim(rand);
  body.genesis();
  for (let i = 0; i < 60 * 3; i++) body.step(DT);
  body.drainEvents();
  const parent = [...body.nodes.values()][0];
  let gap: number | null = null;
  if (parent) {
    for (let f = 0; f < 4; f++) body.feed(parent.x + 12, parent.y + 12, parent.z + 12);
    for (let i = 0; i < 60 * 12 && gap === null; i++) {
      body.step(DT);
      for (const ev of body.drainEvents()) {
        if (ev.type !== 'birth') continue;
        const child = body.nodes.get(ev.nodeId);
        const p = body.nodes.get(parent.id);
        if (!child || !p) continue;
        gap = Math.abs(((child.phase - p.phase + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      }
    }
  }
  assert(gap !== null && gap < 0.5, `a new limb joins the pulse in step (gap ${gap?.toFixed(3)} rad)`);
}

// a creature from before the pulse existed must still wake up
{
  const old = living.sim.serialize();
  for (const n of old.nodes) {
    delete (n as Partial<typeof n>).phase;
    delete (n as Partial<typeof n>).detune;
  }
  const migrated = new Sim(rand);
  assert(migrated.restore(old), 'restore accepts a pre-pulse save');
  for (const n of migrated.nodes.values()) {
    assert(
      Number.isFinite(n.phase) && Number.isFinite(n.detune) && n.detune > 0,
      'pre-pulse creatures wake with a phase and a character',
    );
    break;
  }
  for (let i = 0; i < 60 * 20; i++) migrated.step(DT);
  assert(migrated.drainEvents().some((ev) => ev.type === 'pulse'), 'and they start pulsing');
}

console.log('\nsyrinx breathes. all checks passed.');
