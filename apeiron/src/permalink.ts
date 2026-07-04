/**
 * Shareable addresses into the combinatorial space.
 * Format: #p1.<templateIndex base36>.<seed base36>
 * (templateIndex is the resolved template, so links reproduce regardless
 * of whatever filter the viewer had active.)
 */

const VERSION = 'p1';

export interface Permalink {
  templateIndex: number;
  seed: number;
}

export function encodePermalink(templateIndex: number, seed: number): string {
  return `${VERSION}.${templateIndex.toString(36)}.${(seed >>> 0).toString(36)}`;
}

export function decodePermalink(fragment: string): Permalink | null {
  try {
    const raw = fragment.startsWith('#') ? fragment.slice(1) : fragment;
    const parts = raw.split('.');
    if (parts.length !== 3 || parts[0] !== VERSION) return null;
    const templateIndex = parseInt(parts[1], 36);
    const seed = parseInt(parts[2], 36);
    if (!Number.isFinite(templateIndex) || !Number.isFinite(seed)) return null;
    if (templateIndex < 0 || seed < 0 || seed > 0xFFFFFFFF) return null;
    return { templateIndex, seed: seed >>> 0 };
  } catch {
    return null;
  }
}
