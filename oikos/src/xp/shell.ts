/**
 * shell.ts — what the windows may ask of the house.
 *
 * Windows never touch the room or each other directly; main.ts implements
 * this and decides what "play" or "open" means (a tape, a camera move, a
 * navigation, a new tab, an error box).
 */

import type { Directory, Feeds, Site } from '../data';
import type { Screen } from '../screens';

export interface Shell {
  readonly dir: Directory;
  readonly feeds: Feeds;
  readonly screens: Map<string, Screen>;
  site(id: string): Site | undefined;
  /** highlight a site and turn the camera to its screen, no window */
  select(id: string | null): void;
  /** put its tape in the VCR and open its pane */
  play(id: string): void;
  /** leave for the site itself */
  open(site: Site, e?: Event): void;
  /** just look at its screen */
  look(id: string): void;
  /** open the home directory */
  home(): void;
  eject(): void;
  balloon(title: string, text: string, at?: { x: number; y: number }): void;
}

/** which tapes belong on each other's shelves */
export const RELATED: Record<string, string[]> = {
  dreams: ['chronicle', 'dreams-api', 'dream_gen'],
  chronicle: ['dreams', 'dream_gen'],
  'dreams-api': ['dreams', 'chronicle'],
  dream_gen: ['dreams', 'chronicle'],
  transmissions: ['irc', 'syrinx'],
  apeiron: ['dreams', 'syrinx'],
  syrinx: ['apeiron', 'transmissions'],
  irc: ['transmissions', 'parlor'],
  parlor: ['irc', 'loom'],
  loom: ['heimdall', 'parlor'],
  heimdall: ['loom', 'dream_gen'],
};

export function addressOf(site: Site): string {
  if (!site.href) return `\\\\wired\\private\\${site.id}`;
  if (/^https?:/.test(site.href)) return site.href;
  return `${location.origin}${site.href}`;
}

export function zoneOf(site: Site): 'computer' | 'internet' | 'restricted' {
  if (!site.href) return 'restricted';
  return site.group === 'here' ? 'computer' : 'internet';
}
