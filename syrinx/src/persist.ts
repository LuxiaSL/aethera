/**
 * persist.ts — it's a place, not a session.
 */

import type { CreatureState, RhythmMode } from './graph';

const KEY = 'syrinx-creature-v1';

export interface SaveFile {
  name: string;
  bornAt: number; // epoch ms
  state: CreatureState;
  root?: number; // lattice root frequency (the key it was last in)
  coupling?: number; // how strongly its nodes listen to each other
  rhythm?: RhythmMode; // which engines were audible
}

export function load(): SaveFile | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveFile;
    if (typeof parsed.name !== 'string' || typeof parsed.bornAt !== 'number' || !parsed.state) {
      return null;
    }
    return parsed;
  } catch (err) {
    console.warn('syrinx: could not load save, starting fresh', err);
    return null;
  }
}

export function save(file: SaveFile): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(file));
  } catch (err) {
    console.warn('syrinx: could not save', err);
  }
}

export function clear(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* fine */
  }
}

export function formatAge(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}
