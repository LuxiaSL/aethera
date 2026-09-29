/**
 * persist.ts — the universe is a place, not a session.
 *
 * life.py saves universe.npz on quit (and every AUTOSAVE_EVERY generations)
 * and resumes it on launch. Here the place is this origin's localStorage,
 * which is also how oikos's screen can show *your* universe.
 *
 * The npz held grid + age; the grid is exactly `age > 0`, so only ages are
 * kept, sparsely: a varint gap to the next living-or-ghost cell, then its
 * age (zigzag). Saving has to be synchronous — the page is often already on
 * its way out when it happens — so it can't lean on CompressionStream; a
 * busy universe of ~20k cells comes to ~70 kB of text.
 */

import { GHOST_FRAMES } from './constants';
import type { UniverseState } from './life';

export const KEY = 'afterlife-universe-v1';

export interface SaveFile extends UniverseState {
  /** epoch ms of this universe's genesis */
  bornAt: number;
  /** epoch ms of the save */
  savedAt: number;
}

interface Stored {
  v: 1;
  h: number;
  w: number;
  generation: number;
  totalInjections: number;
  bornAt: number;
  savedAt: number;
  cells: string;
}

/** Past this, a save is skipped rather than risk the origin's quota (syrinx lives here too). */
const MAX_CHARS = 1_500_000;

export function encodeAges(age: Int32Array): string {
  const bytes: number[] = [];
  const varint = (v: number): void => {
    while (v > 0x7f) {
      bytes.push((v & 0x7f) | 0x80);
      v = Math.floor(v / 128);
    }
    bytes.push(v);
  };
  let prev = -1;
  for (let i = 0; i < age.length; i++) {
    const a = age[i] ?? 0;
    // ghosts deeper than normal decay reaches are retired on adopt anyway;
    // haunted mode makes nearly every cell one, and would blow the cap
    if (a === 0 || a < -GHOST_FRAMES) continue;
    varint(i - prev - 1);
    varint(a >= 0 ? a * 2 : -a * 2 - 1);
    prev = i;
  }
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.slice(i, i + 0x8000));
  }
  return btoa(bin);
}

export function decodeAges(b64: string, n: number): Int32Array {
  const bin = atob(b64);
  const age = new Int32Array(n);
  let p = 0;
  const varint = (): number => {
    let v = 0;
    let mul = 1;
    for (;;) {
      if (p >= bin.length) throw new Error('afterlife: truncated save');
      const b = bin.charCodeAt(p++);
      v += (b & 0x7f) * mul;
      if (b < 0x80) return v;
      mul *= 128;
    }
  };
  let i = -1;
  while (p < bin.length) {
    i += varint() + 1;
    const z = varint();
    if (i >= n) throw new Error('afterlife: save does not fit its own world');
    age[i] = z % 2 ? -(z + 1) / 2 : z / 2;
  }
  return age;
}

export function load(storage?: Storage): SaveFile | null {
  try {
    // reading localStorage itself throws where site data is blocked
    const raw = (storage ?? globalThis.localStorage)?.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<Stored>;
    if (s.v !== 1 || !Number.isInteger(s.h) || !Number.isInteger(s.w) || typeof s.cells !== 'string') return null;
    const h = s.h as number;
    const w = s.w as number;
    if (h <= 0 || w <= 0 || h * w > 16_000_000) return null;
    const generation = Number(s.generation);
    if (!Number.isSafeInteger(generation) || generation < 0) return null;
    return {
      h,
      w,
      age: decodeAges(s.cells, h * w),
      generation,
      totalInjections: Number(s.totalInjections) || 0,
      bornAt: Number(s.bornAt) || Date.now(),
      savedAt: Number(s.savedAt) || Date.now(),
    };
  } catch (err) {
    // corrupt or foreign save → a fresh universe
    console.warn('afterlife: could not load the universe, starting fresh', err);
    return null;
  }
}

/** Save atomically (one setItem). Returns true on success. */
export function save(file: SaveFile, storage?: Storage): boolean {
  try {
    const store = storage ?? globalThis.localStorage;
    const stored: Stored = {
      v: 1,
      h: file.h,
      w: file.w,
      generation: file.generation,
      totalInjections: file.totalInjections,
      bornAt: file.bornAt,
      savedAt: file.savedAt,
      cells: encodeAges(file.age),
    };
    const text = JSON.stringify(stored);
    if (text.length > MAX_CHARS) {
      console.warn(`afterlife: the universe is too big to keep (${text.length} chars)`);
      return false;
    }
    if (!store) return false;
    store.setItem(KEY, text);
    return true;
  } catch (err) {
    console.warn('afterlife: could not save the universe', err);
    return false;
  }
}

export function forget(storage?: Storage): void {
  try {
    (storage ?? globalThis.localStorage)?.removeItem(KEY);
  } catch {
    /* fine */
  }
}
