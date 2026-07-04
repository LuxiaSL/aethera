import type { Component, GeneratedPrompt, SlotSpec, Template } from './types';
import { fnv1a, sha256hex } from './hash';
import { mulberry32, randomSeed, type Rng } from './math/rng';

const SLOT_PATTERN = /\{(\w+)(?::(\d+))?(?::([^}]*))?\}/g;

const NEGATABLE_CATEGORIES = new Set([
  'color_logic',
  'light_behavior',
  'atmosphere_field',
  'temporal_state',
  'texture_density',
  'medium_render',
]);

const BASE_NEGATIVES = ['low quality', 'blurry', 'text', 'watermark'];

function parseSlots(structure: string): SlotSpec[] {
  const slots: SlotSpec[] = [];
  let match: RegExpExecArray | null;
  SLOT_PATTERN.lastIndex = 0;
  while ((match = SLOT_PATTERN.exec(structure)) !== null) {
    slots.push({
      category: match[1],
      count: match[2] ? parseInt(match[2], 10) : 1,
      separator: match[3] ?? ' ',
    });
  }
  return slots;
}

function fisherYatesSample<T>(pool: readonly T[], n: number, rng: Rng): T[] {
  const copy = pool.slice();
  const count = Math.min(n, copy.length);
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(rng() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export class CombinatorialEngine {
  templates: Map<string, Template> = new Map();
  components: Map<string, Component[]> = new Map();
  private slotsCache: Map<string, SlotSpec[]> = new Map();

  async load(componentsUrl: string, templatesUrl: string): Promise<void> {
    const [compResp, tmplResp] = await Promise.all([
      fetch(componentsUrl),
      fetch(templatesUrl),
    ]);

    if (!compResp.ok || !tmplResp.ok) {
      throw new Error('Failed to load apeiron data files');
    }

    const compData: Record<string, Array<{ word: string; opposite?: string | null }>> =
      await compResp.json();
    const tmplData: Array<{
      id: string;
      structure: string;
      required_components: string[];
      notes?: string;
    }> = await tmplResp.json();

    for (const [category, items] of Object.entries(compData)) {
      this.components.set(
        category,
        items.map((item) => ({
          word: item.word,
          opposite: item.opposite ?? null,
        }))
      );
    }

    for (const raw of tmplData) {
      const template: Template = {
        id: raw.id,
        structure: raw.structure,
        required_components: raw.required_components,
        notes: raw.notes ?? '',
      };
      this.templates.set(template.id, template);
      this.slotsCache.set(template.id, parseSlots(template.structure));
    }
  }

  /**
   * Deterministic generation: (resolved templateId, seed, pins) fully
   * determines the prompt. The component stream is seeded by
   * seed^fnv1a(templateId) so that a forced template and a seed-picked
   * template with the same id produce identical output.
   * Pinned words are held in place; only the free slots reroll.
   */
  generate(
    templateId?: string | null,
    seed?: number,
    pinned?: Record<string, string[]>,
  ): GeneratedPrompt {
    const templateList = Array.from(this.templates.values());
    if (templateList.length === 0) {
      throw new Error('No templates loaded');
    }

    const resolvedSeed = (seed ?? randomSeed()) >>> 0;
    const templateRng = mulberry32(resolvedSeed);

    // a pinned word is a promise: only roll templates that can honor it
    const pinnedCats = pinned
      ? Object.keys(pinned).filter(c => (pinned[c]?.length ?? 0) > 0)
      : [];
    let templatePool = templateList;
    if (!templateId && pinnedCats.length > 0) {
      const compatible = templateList.filter(t => {
        const cats = new Set(this.slotsCache.get(t.id)!.map(s => s.category));
        return pinnedCats.every(c => cats.has(c));
      });
      if (compatible.length > 0) templatePool = compatible;
    }

    const template =
      templateId && this.templates.has(templateId)
        ? this.templates.get(templateId)!
        : templatePool[Math.floor(templateRng() * templatePool.length)];

    const rng = mulberry32((resolvedSeed ^ fnv1a(template.id)) >>> 0);
    const slots = this.slotsCache.get(template.id)!;

    const needs: Record<string, number> = {};
    for (const s of slots) {
      needs[s.category] = (needs[s.category] ?? 0) + s.count;
    }

    const selections: Record<string, Component[]> = {};
    for (const [category, total] of Object.entries(needs)) {
      const pool = this.components.get(category);
      if (!pool || pool.length === 0) continue;

      const wanted = pinned?.[category] ?? [];
      const held: Component[] = [];
      const heldWords = new Set<string>();
      for (const w of wanted) {
        if (held.length >= total) break;
        if (heldWords.has(w)) continue;
        const comp = pool.find(c => c.word === w);
        if (comp) { held.push(comp); heldWords.add(w); }
      }

      const free = held.length > 0 ? pool.filter(c => !heldWords.has(c.word)) : pool;
      selections[category] = [...held, ...fisherYatesSample(free, total - held.length, rng)];
    }

    return this.assemble(template, selections, resolvedSeed);
  }

  /**
   * Rebuild a prompt from explicit word selections (permalink v2 path).
   * Words missing from the current pools still render, just with no
   * opposite for the negative prompt.
   */
  materialize(templateId: string, words: Record<string, string[]>): GeneratedPrompt | null {
    const template = this.templates.get(templateId);
    if (!template) return null;
    const selections: Record<string, Component[]> = {};
    for (const [category, list] of Object.entries(words)) {
      const pool = this.components.get(category) ?? [];
      selections[category] = list.map(
        w => pool.find(c => c.word === w) ?? { word: w, opposite: null },
      );
    }
    return this.assemble(template, selections, undefined);
  }

  private assemble(
    template: Template,
    selections: Record<string, Component[]>,
    seed: number | undefined,
  ): GeneratedPrompt {
    const slots = this.slotsCache.get(template.id)!;
    let positive = template.structure;
    const consumed: Record<string, number> = {};

    for (const slot of slots) {
      const idx = consumed[slot.category] ?? 0;
      const chosen = selections[slot.category] ?? [];
      const batch = chosen.slice(idx, idx + slot.count);
      consumed[slot.category] = idx + slot.count;

      const replacement =
        batch.length > 0
          ? batch.map((c) => c.word).join(slot.separator)
          : `[missing ${slot.category}]`;

      let pat: string;
      if (slot.count > 1) {
        pat =
          slot.separator !== ' '
            ? `{${slot.category}:${slot.count}:${slot.separator}}`
            : `{${slot.category}:${slot.count}}`;
      } else {
        pat = `{${slot.category}}`;
      }

      positive = positive.replace(pat, replacement);
    }

    const opposites: string[] = [];
    for (const cat of NEGATABLE_CATEGORIES) {
      for (const comp of selections[cat] ?? []) {
        if (comp.opposite) opposites.push(comp.opposite);
      }
    }
    const negative = [...opposites, ...BASE_NEGATIVES].join(', ');

    const compDict: Record<string, string[]> = {};
    for (const [cat, comps] of Object.entries(selections)) {
      compDict[cat] = comps.map((c) => c.word);
    }

    const canonObj: Record<string, unknown> = {
      c: Object.fromEntries(
        Object.entries(compDict)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => [k, [...v].sort()])
      ),
      t: template.id,
    };
    const canon = JSON.stringify(canonObj);
    const promptHash = sha256hex(canon, 16);

    return {
      hash: promptHash,
      templateId: template.id,
      seed,
      positive,
      negative,
      components: compDict,
      createdAt: new Date().toISOString(),
      favorited: false,
    };
  }

  generateUnique(
    seen: Set<string>,
    templateId?: string | null,
    pinned?: Record<string, string[]>,
    maxAttempts = 100,
  ): GeneratedPrompt {
    let prompt = this.generate(templateId, undefined, pinned);
    for (let i = 0; i < maxAttempts; i++) {
      if (!seen.has(prompt.hash)) return prompt;
      prompt = this.generate(templateId, undefined, pinned);
    }
    return prompt;
  }

  /**
   * Flatten a prompt's selections into pool indices (categories in sorted
   * order) for permalink v2. Null if any word left the current data.
   */
  componentIndices(prompt: GeneratedPrompt): number[] | null {
    const out: number[] = [];
    for (const cat of Object.keys(prompt.components).sort()) {
      const pool = this.components.get(cat);
      if (!pool) return null;
      for (const word of prompt.components[cat]) {
        const i = pool.findIndex(c => c.word === word);
        if (i < 0) return null;
        out.push(i);
      }
    }
    return out;
  }

  /** Inverse of componentIndices: rebuild per-category word lists. */
  componentsFromIndices(templateId: string, flat: number[]): Record<string, string[]> | null {
    const slots = this.slotsCache.get(templateId);
    if (!slots) return null;

    const needs: Record<string, number> = {};
    for (const s of slots) {
      needs[s.category] = (needs[s.category] ?? 0) + s.count;
    }

    const words: Record<string, string[]> = {};
    let cursor = 0;
    for (const cat of Object.keys(needs).sort()) {
      const pool = this.components.get(cat);
      if (!pool || pool.length === 0) continue;
      const count = Math.min(needs[cat], pool.length);
      const list: string[] = [];
      for (let i = 0; i < count; i++) {
        const idx = flat[cursor++];
        if (idx === undefined || idx < 0 || idx >= pool.length) return null;
        list.push(pool[idx].word);
      }
      words[cat] = list;
    }
    return cursor === flat.length ? words : null;
  }

  /** Index of a template id in insertion order, for compact share-links. */
  templateIndex(templateId: string): number {
    return this.templateIds.indexOf(templateId);
  }

  templateIdAt(index: number): string | null {
    const ids = this.templateIds;
    return index >= 0 && index < ids.length ? ids[index] : null;
  }

  get totalCombinations(): number {
    let total = 0;
    for (const [tid] of this.templates) {
      const slots = this.slotsCache.get(tid)!;
      const catNeeds: Record<string, number> = {};
      for (const s of slots) {
        catNeeds[s.category] = (catNeeds[s.category] ?? 0) + s.count;
      }
      let product = 1;
      for (const [cat, n] of Object.entries(catNeeds)) {
        const poolSize = this.components.get(cat)?.length ?? 0;
        // Unordered draws: the prompt hash canonicalizes sorted components,
        // so distinct states are C(pool, n), not permutations.
        let comb = 1;
        for (let i = 0; i < n; i++) {
          comb = (comb * Math.max(1, poolSize - i)) / (i + 1);
        }
        product *= Math.round(comb);
      }
      total += product;
    }
    return total;
  }

  get templateIds(): string[] {
    return Array.from(this.templates.keys());
  }
}
