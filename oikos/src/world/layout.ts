/**
 * layout.ts — where everything stands.
 *
 * The room is arranged, not generated. æthera's own sites stand on the floor
 * in an arc facing the VCR, dreams in the middle on a crate, a couple of them
 * stacked the way monitors get stacked. The places past æthera (other hosts,
 * other repos) hang from wires above, fed from the power
 * lines. A site with no placement here still gets a screen, on the outer arc.
 *
 * Angles are degrees round the VCR: 0 is straight behind it (away from you),
 * positive is to your right.
 */

import type { MonitorStyle } from './monitor';

export interface Placement {
  angle: number;
  r: number;
  y: number; // base height: a crate under it, or the height it hangs at
  style: MonitorStyle;
  screenW: number;
  stand?: boolean;
  on?: string; // stacked on this site's monitor
  hang?: boolean;
  feeds?: string; // its cable runs into this site's screen, not the VCR
  channel: number;
}

export const PLACEMENTS: Record<string, Placement> = {
  // the dreams family is one cluster: the big set in the middle, and the two
  // that only exist because of it raised on crates at its shoulders (the TV's
  // bezel spans about ±14° from here, so they stand clear of it), their cables
  // running into it rather than to the machine
  dreams: { angle: 0, r: 4.9, y: 0.5, style: 'tv', screenW: 2.0, channel: 1 },
  chronicle: { angle: -19.5, r: 5.35, y: 1.25, style: 'black', screenW: 1.0, feeds: 'dreams', channel: 3 },
  'dreams-api': { angle: 19.5, r: 5.35, y: 1.25, style: 'grey', screenW: 0.85, feeds: 'dreams', channel: 4 },
  // the arc, even either side of it
  transmissions: { angle: -30, r: 4.5, y: 0.34, style: 'beige', screenW: 1.22, stand: true, channel: 2 },
  afterlife: { angle: 30, r: 4.5, y: 0, style: 'black', screenW: 1.08, channel: 10 },
  apeiron: { angle: -56, r: 4.2, y: 0, style: 'black', screenW: 1.15, channel: 5 },
  irc: { angle: -56, r: 4.2, y: 0, style: 'beige', screenW: 0.95, on: 'apeiron', channel: 6 },
  syrinx: { angle: 56, r: 4.2, y: 0.28, style: 'grey', screenW: 1.08, channel: 7 },
  // past æthera: hung from the power lines
  parlor: { angle: -18, r: 6.8, y: 3.9, style: 'beige', screenW: 1.1, hang: true, channel: 9 },
};

export function placementFor(id: string, index: number): Placement {
  const p = PLACEMENTS[id];
  if (p) return p;
  // unknown sites: out on the far arc, alternating sides
  const k = Math.floor(index / 2) + 1;
  const side = index % 2 ? 1 : -1;
  return { angle: side * (68 + k * 10), r: 5.4, y: 0, style: 'grey', screenW: 1.0, channel: 12 + index };
}
