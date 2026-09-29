/**
 * ticker.ts — the news ticker.
 *
 * A scrolling marquee of musings that drift across the status bar. Messages
 * spawn at the right edge and scroll left. Context-aware musings are spawned
 * when the simulation mood changes; ambient musings fill the gaps in between.
 *
 * Positions are in terminal columns, as in life.py: the renderer decides how
 * wide a column is.
 */

import { MUSINGS, MUSINGS_BY_STATE } from './musings';

export interface TickerMessage {
  text: string;
  /** position in ticker-space (0 = left edge, positive = right) */
  x: number;
}

/** A string's width in terminal columns (every glyph here is one column). */
export const cols = (s: string): number => [...s].length;

export class NewsTicker {
  messages: TickerMessage[] = [];
  private scrollSpeed = 0.4; // chars per frame
  private spawnCooldown = 0; // frames until next spawn allowed
  private minGap = 12; // min chars between messages
  private ambientInterval = 60; // frames between ambient spawns
  private moodInterval = 50; // frames between mood spawns
  private ambientIdx = Math.floor(Math.random() * MUSINGS.length);
  private lastMood = '';
  private pendingSpecial = '';

  /** Queue a priority message (e.g. a pattern sighting). It spawns as soon
   *  as there's physical room, ahead of the regular pools. */
  queueSpecial(text: string): void {
    this.pendingSpecial = text;
  }

  /** Advance one frame: scroll, cull off-screen messages, maybe spawn. */
  tick(tickerWidth: number, mood: string, generation: number): void {
    if (tickerWidth < 10) return;

    // Scroll every message to the left
    for (const msg of this.messages) msg.x -= this.scrollSpeed;

    // Remove messages that have fully left the visible area
    this.messages = this.messages.filter((m) => m.x + cols(m.text) > 0);

    // Special sightings jump the queue (only physical room gates them)
    if (this.pendingSpecial && this.canSpawn(tickerWidth)) {
      this.messages.push({ text: this.pendingSpecial, x: tickerWidth });
      this.pendingSpecial = '';
      this.spawnCooldown = Math.max(this.spawnCooldown, this.moodInterval);
      return;
    }

    const moodPool = mood ? MUSINGS_BY_STATE[mood] : undefined;

    // On mood change, allow a contextual message to appear quickly
    if (moodPool && mood !== this.lastMood) {
      this.spawnCooldown = Math.min(this.spawnCooldown, 15);
    }

    // Count down the spawn timer
    this.spawnCooldown = Math.max(0, this.spawnCooldown - 1);
    if (this.spawnCooldown > 0) return;

    // Check physical room at the right edge
    if (!this.canSpawn(tickerWidth)) return;

    // Pick a message based on mood
    let text: string;
    let cooldown: number;
    if (moodPool) {
      text = moodPool[Math.floor(generation / 180) % moodPool.length] ?? '';
      cooldown = this.moodInterval;
    } else {
      text = MUSINGS[this.ambientIdx] ?? '';
      this.ambientIdx = (this.ambientIdx + 1) % MUSINGS.length;
      cooldown = this.ambientInterval;
    }

    this.messages.push({ text, x: tickerWidth });
    this.spawnCooldown = cooldown;
    this.lastMood = mood;
  }

  /** True if the right edge is clear enough for a new message. */
  private canSpawn(tickerWidth: number): boolean {
    if (!this.messages.length) return true;
    let right = -Infinity;
    for (const m of this.messages) right = Math.max(right, m.x + cols(m.text));
    return right < tickerWidth - this.minGap;
  }

  /** The ticker breathes: dim on the out-breath, as the terminal's A_DIM. */
  static dim(generation: number): boolean {
    return Math.sin(generation * 0.035) < 0;
  }
}
