import type { Component, GeneratedPrompt, SlotSpec, Template } from './types';
import { sha256hex } from './hash';

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

function fisherYatesSample<T>(pool: readonly T[], n: number): T[] {
  const copy = pool.slice();
  const count = Math.min(n, copy.length);
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
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

  generate(templateId?: string | null): GeneratedPrompt {
    const templateList = Array.from(this.templates.values());
    if (templateList.length === 0) {
      throw new Error('No templates loaded');
    }

    const template =
      templateId && this.templates.has(templateId)
        ? this.templates.get(templateId)!
        : templateList[Math.floor(Math.random() * templateList.length)];

    const slots = this.slotsCache.get(template.id)!;

    const needs: Record<string, number> = {};
    for (const s of slots) {
      needs[s.category] = (needs[s.category] ?? 0) + s.count;
    }

    const selections: Record<string, Component[]> = {};
    for (const [category, total] of Object.entries(needs)) {
      const pool = this.components.get(category);
      if (!pool || pool.length === 0) continue;
      selections[category] = fisherYatesSample(pool, total);
    }

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
      positive,
      negative,
      components: compDict,
      createdAt: new Date().toISOString(),
      favorited: false,
    };
  }

  generateUnique(seen: Set<string>, templateId?: string | null, maxAttempts = 100): GeneratedPrompt {
    let prompt = this.generate(templateId);
    for (let i = 0; i < maxAttempts; i++) {
      if (!seen.has(prompt.hash)) return prompt;
      prompt = this.generate(templateId);
    }
    return prompt;
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
        let perm = 1;
        for (let i = 0; i < n; i++) {
          perm *= Math.max(1, poolSize - i);
        }
        product *= perm;
      }
      total += product;
    }
    return total;
  }

  get templateIds(): string[] {
    return Array.from(this.templates.keys());
  }
}
