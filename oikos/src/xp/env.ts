/**
 * env.ts — what the desktop needs to know about the screen and the hand.
 *
 * One breakpoint decides when windows stop floating and become sheets over
 * the bottom of the room: a narrow screen, or a phone held sideways (short
 * and touch-driven). CSS and script both ask it; the @media block at the foot
 * of xp.css spells out the same query and must stay in step with SHEET_QUERY.
 *
 * And which hand is on the house: the keyboard or a pointer. A menu opened
 * from the keyboard takes focus on its first item; one opened by a click
 * waits for the arrows.
 */

export const SHEET_QUERY = '(max-width: 720px), (max-height: 500px) and (pointer: coarse)';

let sheetMq: MediaQueryList | null = null;

/** windows are sheets (phones, narrow windows): no dragging, no resizing, no cascade */
export function isSheet(): boolean {
  try {
    sheetMq ??= matchMedia(SHEET_QUERY);
    return sheetMq.matches;
  } catch {
    return innerWidth <= 720;
  }
}

let keyboard = false;
addEventListener('keydown', (e) => {
  // a bare modifier (Alt to look at the menubar, Shift held) isn't navigation
  if (!['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) keyboard = true;
}, true);
addEventListener('pointerdown', () => (keyboard = false), true);

/** the last thing the visitor did was press a key (not click or tap) */
export function viaKeyboard(): boolean {
  return keyboard;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]';

/** what Tab can reach inside `root`, in document order: visible, enabled, not tabindex=-1 */
export function focusables(root: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = [];
  for (const el of root.querySelectorAll<HTMLElement>(FOCUSABLE)) {
    if (el.tabIndex < 0 || el.closest('[hidden], [inert]')) continue;
    if (!el.getClientRects().length) continue; // display:none somewhere above
    if (getComputedStyle(el).visibility === 'hidden') continue;
    out.push(el);
  }
  return out;
}
