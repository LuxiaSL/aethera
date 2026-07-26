/**
 * names.ts — every creature is born with a name.
 */

const OPENERS = ['sy', 'xa', 'the', 'ka', 'ly', 'me', 'phi', 'o', 'ai', 'ne', 'thy', 'ei'];
const MIDDLES = ['rin', 'la', 'ne', 'mo', 'thi', 'ra', 'le', 'si', 'va', 'ny'];
const CLOSERS = ['x', 'a', 'os', 'is', 'e', 'on', 'ia', 'ys', 'ei'];

export function genesisName(rand: () => number = Math.random): string {
  const pick = <T>(arr: readonly T[]): T => {
    const v = arr[Math.min(arr.length - 1, Math.floor(rand() * arr.length))];
    if (v === undefined) throw new Error('empty name pool');
    return v;
  };
  const parts = [pick(OPENERS)];
  if (rand() < 0.7) parts.push(pick(MIDDLES));
  parts.push(pick(CLOSERS));
  const name = parts.join('');
  return name.charAt(0).toUpperCase() + name.slice(1);
}
