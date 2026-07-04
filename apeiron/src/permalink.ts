/**
 * Shareable addresses into the combinatorial space.
 *
 * v2 (current): #p2.<templateIndex>.<poolIdx>-<poolIdx>-...
 *   Encodes the actual component pool indices (categories in sorted order),
 *   so links survive changes to the sampling algorithm and identify the
 *   prompt content directly.
 *
 * v1 (legacy, still decoded): #p1.<templateIndex>.<seed>
 *   Seed-based; kept alive for links shared before v2 existed.
 *
 * All numbers base36. templateIndex is the resolved template, so links
 * reproduce regardless of whatever filter the viewer had active.
 */

export type Permalink =
  | { kind: 'seed'; templateIndex: number; seed: number }
  | { kind: 'indices'; templateIndex: number; indices: number[] };

export function encodePermalinkV2(templateIndex: number, indices: number[]): string {
  return `p2.${templateIndex.toString(36)}.${indices.map(i => i.toString(36)).join('-')}`;
}

export function encodePermalinkV1(templateIndex: number, seed: number): string {
  return `p1.${templateIndex.toString(36)}.${(seed >>> 0).toString(36)}`;
}

export function decodePermalink(fragment: string): Permalink | null {
  try {
    const raw = fragment.startsWith('#') ? fragment.slice(1) : fragment;
    const parts = raw.split('.');
    if (parts.length !== 3) return null;

    const templateIndex = parseInt(parts[1], 36);
    if (!Number.isFinite(templateIndex) || templateIndex < 0) return null;

    if (parts[0] === 'p1') {
      const seed = parseInt(parts[2], 36);
      if (!Number.isFinite(seed) || seed < 0 || seed > 0xFFFFFFFF) return null;
      return { kind: 'seed', templateIndex, seed: seed >>> 0 };
    }

    if (parts[0] === 'p2') {
      if (!parts[2]) return null;
      const indices: number[] = [];
      for (const tok of parts[2].split('-')) {
        const v = parseInt(tok, 36);
        if (!Number.isFinite(v) || v < 0 || v > 0xFFFF) return null;
        indices.push(v);
      }
      return { kind: 'indices', templateIndex, indices };
    }

    return null;
  } catch {
    return null;
  }
}
