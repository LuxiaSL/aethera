/**
 * icons.ts — the desktop's pictures, as inline SVG.
 *
 * One family, drawn the way the skin is: thin amber line on dark lacquer, lit
 * from inside rather than from the top left. Every place is a small monitor
 * whose glass is that place's own colour (the room's screens, at icon size);
 * the system's own things (home, search, power, the clock's moon) are line
 * sigils. Nothing here is Luna's any more.
 *
 * Exported names are what the behaviour code calls; `tape()` is the old name
 * for a place's icon and stays as an alias until the words catch up.
 */

let uid = 0;
const id = (p: string) => `${p}${++uid}`;

export const MARK_URL = '/static/oikos/mark.png';

/** the palette, as the skin's tokens are (xp.css --ae-*) */
const AMBER = '#ffb347';
const LINE = 'rgba(255,179,71,.75)';
const FAINT = 'rgba(255,179,71,.4)';
const BODY = '#1c0e0b';
const BODY_HI = '#2a1612';
const CYAN = '#8fe3ec';
const RED = '#ff6a5a';
const GREEN = '#7dff6a';

/** an svg at its own size, decorative (the label beside it carries the meaning) */
function svg(view: number, inner: string): string {
  return `<svg viewBox="0 0 ${view} ${view}" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

/**
 * A place: a monitor with its glass lit in the place's accent. The label is
 * accepted for the old callers and no longer drawn: the name sits beside the
 * icon everywhere it's used.
 */
export function screen(accent: string, _label = ''): string {
  const g = id('gl');
  return svg(
    48,
    `<defs><radialGradient id="${g}" cx=".42" cy=".38" r=".8"><stop offset="0" stop-color="${accent}" stop-opacity="1"/><stop offset=".75" stop-color="${accent}" stop-opacity=".55"/><stop offset="1" stop-color="${accent}" stop-opacity=".25"/></radialGradient></defs>
<rect x="5" y="7" width="38" height="29" rx="4" fill="${BODY}" stroke="${LINE}" stroke-width="1.6"/>
<rect x="9.5" y="11" width="29" height="21" rx="3" fill="url(#${g})"/>
<path d="M9.5 15.5h29M9.5 20h29M9.5 24.5h29M9.5 29h29" stroke="#000" stroke-opacity=".18" stroke-width="1"/>
<path d="M12 13.5h8" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/>
<path d="M18 36l-2.5 5h17L30 36" fill="${BODY}" stroke="${LINE}" stroke-width="1.6"/>
<circle cx="39.5" cy="33.5" r=".9" fill="${accent}" stroke="none"/>`,
  );
}

/** the old name: every place used to be a tape */
export const tape = screen;

/** ~, the home directory: a folder whose tab is a tilde */
export function folderHome(): string {
  return svg(
    48,
    `<path d="M5 13h13l4 4h21v22H5z" fill="${BODY}" stroke="${LINE}" stroke-width="1.6"/>
<path d="M5 20h38" stroke="${FAINT}" stroke-width="1.2"/>
<path d="M17 31c2.4-3.4 4.8-3.4 7 0s4.6 3.4 7 0" stroke="${AMBER}" stroke-width="2.2"/>`,
  );
}

/** æthera itself: the machine in the middle of the room */
export function computer(): string {
  return svg(
    48,
    `<rect x="4" y="8" width="26" height="21" rx="3" fill="${BODY}" stroke="${LINE}" stroke-width="1.6"/>
<rect x="7.5" y="11.5" width="19" height="14" rx="2" fill="${AMBER}" fill-opacity=".22" stroke="${FAINT}"/>
<path d="M10 15h8M10 18.5h11M10 22h6" stroke="${AMBER}" stroke-width="1.3"/>
<path d="M13 29l-1.5 4h11L21 29" stroke="${LINE}" stroke-width="1.6"/>
<rect x="33" y="10" width="11" height="28" rx="1.5" fill="${BODY}" stroke="${LINE}" stroke-width="1.6"/>
<path d="M35.5 15h6M35.5 18h6" stroke="${FAINT}" stroke-width="1.2"/>
<circle cx="38.5" cy="32" r="1.4" fill="${GREEN}" stroke="none"/>
<path d="M24 36c3 4 9 4 12 2" stroke="${FAINT}" stroke-width="1.2"/>`,
  );
}

/** somewhere else on the wire */
export function globe(): string {
  return svg(
    48,
    `<circle cx="24" cy="24" r="17" fill="${BODY}" stroke="${CYAN}" stroke-opacity=".8" stroke-width="1.6"/>
<ellipse cx="24" cy="24" rx="7.5" ry="17" stroke="${CYAN}" stroke-opacity=".55" stroke-width="1.2"/>
<path d="M7 24h34M10 15h28M10 33h28" stroke="${CYAN}" stroke-opacity=".45" stroke-width="1.2"/>`,
  );
}

/** the tray's link light: two nodes and the wire between them */
export function network(): string {
  return svg(
    16,
    `<rect x="1" y="2.5" width="6" height="5" rx="1" fill="${BODY}" stroke="${AMBER}" stroke-width="1.1"/>
<rect x="9" y="8.5" width="6" height="5" rx="1" fill="${BODY}" stroke="${AMBER}" stroke-width="1.1"/>
<path d="M4 7.5v3.5h5" stroke="${AMBER}" stroke-width="1.1"/>
<circle cx="12" cy="11" r="1" fill="${GREEN}" stroke="none"/>`,
  );
}

/** the dream's moon: an outline asleep, lit (with a red eye) awake */
export function moon(awake: boolean): string {
  const c = awake ? '#ff7a5c' : AMBER;
  return svg(
    16,
    `<path d="M10.5 2.2a6 6 0 1 0 3.3 9.6A5 5 0 0 1 10.5 2.2z" fill="${awake ? c : 'none'}" fill-opacity="${awake ? '.85' : '0'}" stroke="${c}" stroke-width="1.2"/>
${awake ? `<circle cx="12.8" cy="12.8" r="1.8" fill="${RED}" stroke="none"/>` : ''}`,
  );
}

function chevronButton(dir: 'back' | 'fwd'): string {
  const path = dir === 'back' ? 'M13.5 7.5L9 12l4.5 4.5' : 'M10.5 7.5L15 12l-4.5 4.5';
  return svg(24, `<circle cx="12" cy="12" r="9.5" fill="${BODY}" stroke="${LINE}" stroke-width="1.4"/><path d="${path}" stroke="${AMBER}" stroke-width="2"/>`);
}

export const back = () => chevronButton('back');
export const forward = () => chevronButton('fwd');

export function up(): string {
  return svg(
    24,
    `<path d="M2.5 6.5h6l2 2h11v12h-19z" fill="${BODY}" stroke="${LINE}" stroke-width="1.3"/>
<path d="M12 18v-6.5M9 14l3-3 3 3" stroke="${AMBER}" stroke-width="1.8"/>`,
  );
}

export function search(): string {
  return svg(24, `<circle cx="10" cy="10" r="6" fill="${BODY}" stroke="${LINE}" stroke-width="1.6"/><path d="M14.5 14.5l6 6" stroke="${AMBER}" stroke-width="2.2"/><path d="M7.5 8.5a3 3 0 0 1 2.5-2" stroke="#fff" stroke-opacity=".35" stroke-width="1.1"/>`);
}

export function folders(): string {
  return svg(
    24,
    `<path d="M1.5 4.5h5l2 2h7.5v7.5h-14.5z" fill="${BODY}" stroke="${FAINT}" stroke-width="1.2"/>
<path d="M7.5 10.5h5l2 2h8v8.5h-15z" fill="${BODY}" stroke="${LINE}" stroke-width="1.3"/>`,
  );
}

export function go(): string {
  return svg(18, `<rect x="1.5" y="1.5" width="15" height="15" rx="1" stroke="${CYAN}" stroke-opacity=".75" stroke-width="1.2"/><path d="M5 9h7M9 5.5L12.5 9 9 12.5" stroke="${CYAN}" stroke-width="1.6"/>`);
}

export function play(): string {
  return svg(16, `<circle cx="8" cy="8" r="6.6" stroke="${LINE}" stroke-width="1.1"/><path d="M6.3 4.8v6.4l5-3.2z" fill="${AMBER}" stroke="none"/>`);
}

export function look(): string {
  return svg(16, `<rect x="1" y="2" width="10.5" height="8.5" rx="1.2" fill="${BODY}" stroke="${LINE}" stroke-width="1.1"/><circle cx="11" cy="11" r="2.7" fill="${BODY}" stroke="${AMBER}" stroke-width="1.2"/><path d="M13 13l2.3 2.3" stroke="${AMBER}" stroke-width="1.5"/>`);
}

export function tv(): string {
  return svg(16, `<rect x="1" y="3.5" width="14" height="10" rx="2" fill="${BODY}" stroke="${LINE}" stroke-width="1.1"/><rect x="2.8" y="5.2" width="8.5" height="6.6" rx="1.4" fill="${AMBER}" fill-opacity=".3"/><path d="M5 1.2l3 2.3 3-2.3" stroke="${FAINT}" stroke-width="1"/><circle cx="13" cy="7" r=".7" fill="${AMBER}" stroke="none"/><circle cx="13" cy="9.8" r=".7" fill="${AMBER}" stroke="none"/>`);
}

export function copy(): string {
  return svg(16, `<rect x="2" y="1.5" width="8" height="10" rx="1" fill="${BODY}" stroke="${FAINT}" stroke-width="1.1"/><rect x="6" y="4.5" width="8" height="10" rx="1" fill="${BODY}" stroke="${LINE}" stroke-width="1.1"/><path d="M8 8h4M8 10h4M8 12h3" stroke="${AMBER}" stroke-opacity=".7" stroke-width=".9"/>`);
}

export function eject(): string {
  return svg(16, `<path d="M8 2.5l5.5 6.5h-11z" stroke="${AMBER}" stroke-width="1.2"/><path d="M2.5 11.5h11v2h-11z" stroke="${AMBER}" stroke-width="1.2"/>`);
}

/** a plain file; its extension on a coloured tag (xml amber, everything else cyan) */
export function textFile(ext: string): string {
  const tag = ext === 'xml' ? '#ff8a3d' : CYAN;
  return svg(
    48,
    `<path d="M11 4h19l8 8v32H11z" fill="${BODY}" stroke="${LINE}" stroke-width="1.6"/>
<path d="M30 4v8h8" stroke="${LINE}" stroke-width="1.6"/>
<path d="M16 18h16M16 23h16M16 28h12" stroke="${AMBER}" stroke-opacity=".45" stroke-width="1.3"/>
<rect x="13" y="34" width="22" height="8" fill="${tag}" fill-opacity=".14" stroke="${tag}" stroke-opacity=".8" stroke-width="1"/>
<text x="24" y="40.4" font-size="6.6" font-family="'IBM Plex Mono',ui-monospace,monospace" font-weight="500" text-anchor="middle" fill="${tag}" stroke="none">${escapeXml(ext.toUpperCase())}</text>`,
  );
}

export function info(): string {
  return svg(16, `<circle cx="8" cy="8" r="6.6" fill="${BODY}" stroke="${AMBER}" stroke-width="1.2"/><path d="M8 7.2v4.3" stroke="${AMBER}" stroke-width="1.6"/><circle cx="8" cy="4.8" r="1" fill="${AMBER}" stroke="none"/>`);
}

export function power(): string {
  return svg(22, `<path d="M11 4v7" stroke="${RED}" stroke-width="2"/><path d="M7 6.8a6.3 6.3 0 1 0 8 0" stroke="${RED}" stroke-width="1.8"/>`);
}

export function standby(): string {
  return svg(22, `<path d="M14 4a7.3 7.3 0 1 0 4.8 10.6A6.2 6.2 0 0 1 14 4z" stroke="${AMBER}" stroke-width="1.7"/>`);
}

/** the start menu's Log Off: a key */
export function logoff(): string {
  return svg(22, `<circle cx="7.5" cy="11" r="3.6" stroke="${AMBER}" stroke-width="1.7"/><path d="M11.1 11h8M16 11v3M18.6 11v2.3" stroke="${AMBER}" stroke-width="1.7"/>`);
}

/** "All Programs ▸" */
export function allPrograms(): string {
  return svg(18, `<rect x="1.5" y="1.5" width="15" height="15" rx="1" stroke="${LINE}" stroke-width="1.2"/><path d="M7 5l5 4-5 4z" fill="${AMBER}" stroke="none"/>`);
}

export function restart(): string {
  return svg(22, `<path d="M16.5 7.5a6.3 6.3 0 1 0 1 5.5" stroke="${GREEN}" stroke-width="1.8"/><path d="M17.5 3.5v4.5H13" stroke="${GREEN}" stroke-width="1.8"/>`);
}

export function markImg(size: number, invert = false): string {
  return `<img src="${MARK_URL}" alt="" width="${size}" height="${size}" style="width:${size}px;height:${size}px;${invert ? 'filter:invert(1);' : ''}">`;
}

export function escapeXml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}

/** the chat client: two speech balloons; `status` is the server's own window */
export function chat(kind: 'app' | 'status' | 'channel' = 'app'): string {
  if (kind === 'status') {
    return svg(16, `<rect x="1.5" y="2.5" width="13" height="9" rx="1" fill="${BODY}" stroke="${LINE}" stroke-width="1.1"/><path d="M4 5.5h5M4 8h3" stroke="${CYAN}" stroke-width="1.1"/><path d="M5.5 13.5h5" stroke="${FAINT}" stroke-width="1.1"/>`);
  }
  if (kind === 'channel') {
    return svg(16, `<path d="M1.5 2.5h11a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1H6l-3 2.8v-2.8H1.5a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" fill="${BODY}" stroke="${CYAN}" stroke-opacity=".85" stroke-width="1.1"/><path d="M5 4.5l-1 4M8 4.5l-1 4M3.5 5.8h5.5M3 7.6h5.5" stroke="${CYAN}" stroke-width=".9"/>`);
  }
  return svg(
    24,
    `<path d="M2 3h12.5A1.5 1.5 0 0 1 16 4.5v6.5a1.5 1.5 0 0 1-1.5 1.5H8l-4 3.5v-3.5H2A1.5 1.5 0 0 1 .5 11V4.5A1.5 1.5 0 0 1 2 3z" fill="${BODY_HI}" stroke="${AMBER}" stroke-width="1.3"/>
<path d="M10 10h11.5A1.5 1.5 0 0 1 23 11.5v6a1.5 1.5 0 0 1-1.5 1.5H20v3.5L16 19h-6a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 10 10z" fill="${BODY}" stroke="${CYAN}" stroke-width="1.3"/>
<path d="M3.5 6.5h8M3.5 9h5" stroke="${AMBER}" stroke-opacity=".8" stroke-width="1.1"/>
<path d="M12 13.5h8M12 16h5" stroke="${CYAN}" stroke-opacity=".8" stroke-width="1.1"/>`,
  );
}
