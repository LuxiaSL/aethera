/**
 * coupling-sweep.ts — map the chaos↔unison knob.
 *
 * I can't hear the creature, but the Kuramoto order parameter r = |⟨e^{iθ}⟩|
 * says exactly what the ear would be listening for: ~1/√N is a scatter of
 * unrelated clocks, ~1 is one animal beating together, and the interesting
 * music is the band in between where clusters lock and come apart again.
 *
 * This sweeps K over a grown body and reports, per K: mean r, how much r
 * *moves* (a body frozen at high coherence is as dead as one at none), and the
 * strum rate. Use it to pick COUPLING_DEFAULT, then trust your ears over it.
 *
 * Usage: npx tsx scripts/coupling-sweep.ts [nodes]
 */

import { COUPLING_MAX, Sim, type CreatureState } from '../src/graph';

// the repo has no @types/node and the build typechecks everything; this is all
// of node we need
declare const process: { argv: string[] };

const DT = 1 / 60;
const SETTLE = 25; // seconds discarded so we measure the regime, not the transient
const MEASURE = 75; // seconds of measurement

let seed = 7;
const rand = (): number => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};

/** Grow a body worth measuring: genesis is only 6 nodes. */
function grownBody(targetNodes: number): Sim {
  const sim = new Sim(rand);
  sim.genesis();
  for (let round = 0; round < 40 && sim.nodes.size < targetNodes; round++) {
    const first = [...sim.nodes.values()][0];
    if (first) sim.feed(first.x + 20, first.y + 20, first.z + 20);
    for (let i = 0; i < 60 * 6; i++) sim.step(DT);
    sim.drainEvents();
  }
  return sim;
}

interface Row {
  k: number;
  meanOrder: number;
  sdOrder: number;
  minOrder: number;
  maxOrder: number;
  strumsPerSec: number;
  meanSync: number;
  meanFelt: number; // K actually applied, i.e. including feeding tension
}

function measure(sim: Sim, k: number, body: CreatureState): Row {
  // every K must be measured on the *same* creature — the body goes on growing
  // and shedding while it runs, so without this the later rows are a different
  // animal and the sweep compares two things at once
  sim.restore(body);
  sim.setCoupling(k);
  // fresh scatter of phases each time, so no K inherits the previous one's lock
  for (const n of sim.nodes.values()) n.phase = rand() * Math.PI * 2;

  for (let i = 0; i < SETTLE / DT; i++) {
    sim.step(DT);
    sim.drainEvents();
  }

  const samples: number[] = [];
  const syncs: number[] = [];
  const felt: number[] = [];
  let strums = 0;
  for (let i = 0; i < MEASURE / DT; i++) {
    sim.step(DT);
    for (const ev of sim.drainEvents()) {
      if (ev.type === 'pulse') {
        strums++;
        syncs.push(ev.sync);
      }
    }
    if (i % 6 === 0) {
      samples.push(sim.order());
      felt.push(sim.effectiveCoupling);
    }
  }

  const mean = samples.reduce((a, b) => a + b, 0) / Math.max(1, samples.length);
  const variance =
    samples.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, samples.length);
  return {
    k,
    meanOrder: mean,
    sdOrder: Math.sqrt(variance),
    minOrder: Math.min(...samples),
    maxOrder: Math.max(...samples),
    strumsPerSec: strums / MEASURE,
    meanSync: syncs.reduce((a, b) => a + b, 0) / Math.max(1, syncs.length),
    meanFelt: felt.reduce((a, b) => a + b, 0) / Math.max(1, felt.length),
  };
}

const target = Number(process.argv[2] ?? 14);
const sim = grownBody(Number.isFinite(target) ? target : 14);
const frozen = sim.serialize(); // the one creature every K is measured on
// with no coupling at all, r still floats near 1/√N by chance alone — that is
// the floor to compare everything against, not zero
const floor = 1 / Math.sqrt(sim.nodes.size);

// strings couple harder as they age, so the same K means different things to a
// newborn and an elder — report what this particular body is actually carrying
const ages = [...sim.edges.values()].map((e) => e.age);
const meanAge = ages.reduce((a, b) => a + b, 0) / Math.max(1, ages.length);
console.log(
  `body: ${sim.nodes.size} nodes, ${sim.edges.size} strings · ` +
    `mean string age ${meanAge.toFixed(0)}s · ` +
    `incoherent floor ≈ ${floor.toFixed(2)} · ${SETTLE}s settle + ${MEASURE}s measured\n`,
);
console.log('    K   felt   mean r     sd    range        strums/s   sync   regime');
console.log('  ' + '─'.repeat(74));

// dense through the transition (0.4–1.8), sparse past it — above ~2 the body
// is locked and the only thing that changes is how hard it is locked
const ks = [0, 0.2, 0.4, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.3, 1.5, 1.8, 2.2, 3.0, 4.0, COUPLING_MAX];
const rows: Row[] = [];
for (const k of ks) {
  const row = measure(sim, k, frozen);
  rows.push(row);
  // rigidity first: a high, *motionless* r is a metronome, whatever its value
  const regime =
    row.sdOrder < 0.02
      ? 'locked (rigid)'
      : row.meanOrder < floor + 0.1
        ? 'scattered'
        : row.meanOrder > 0.82
          ? 'locked'
          : 'partial ←';
  const bar = '█'.repeat(Math.round(row.meanOrder * 20));
  console.log(
    `  ${row.k.toFixed(1).padStart(4)}  ${row.meanFelt.toFixed(2).padStart(5)}   ` +
      `${row.meanOrder.toFixed(3)}  ${row.sdOrder.toFixed(3)}  ` +
      `${row.minOrder.toFixed(2)}–${row.maxOrder.toFixed(2)}   ` +
      `${row.strumsPerSec.toFixed(2).padStart(7)}   ${row.meanSync.toFixed(2)}   ${regime}`,
  );
  console.log(`         ${bar}`);
}

// the sweet spot: coherent enough to hear structure, loose enough to keep moving
const live = rows.filter((r) => r.meanOrder > floor + 0.12 && r.meanOrder < 0.88 && r.sdOrder > 0.05);
const best = live.sort((a, b) => b.sdOrder - a.sdOrder)[0];
console.log(
  `\n  most alive (partial sync, most movement in r): ` +
    (best ? `K = ${best.k} (r ${best.meanOrder.toFixed(2)} ± ${best.sdOrder.toFixed(2)})` : 'none found'),
);
