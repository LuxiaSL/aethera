/**
 * icons.ts — the desktop's pictures, as inline SVG.
 *
 * Drawn in the Luna manner (gradients lit from the top left, a dark outline,
 * a highlight) but not copied from it: every site is a VHS tape in its own
 * colour, because in this house the sites are tapes and the VCR plays them.
 */

let uid = 0;
const id = (p: string) => `${p}${++uid}`;

export const MARK_URL = '/static/oikos/mark.png';

export function tape(accent: string, label = ''): string {
  const g = id('tp');
  const short = label.length > 9 ? `${label.slice(0, 8)}…` : label;
  return `<svg viewBox="0 0 48 48" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a40"/><stop offset="1" stop-color="#0c0c0e"/></linearGradient></defs>
<rect x="2" y="9" width="44" height="30" rx="3" fill="url(#${g})" stroke="#000"/>
<rect x="6" y="12" width="36" height="12" rx="1.5" fill="#f4f1e8" stroke="#000" stroke-width=".6"/>
<rect x="6" y="12" width="36" height="3" fill="${accent}"/>
<text x="24" y="22.3" font-size="6.2" font-family="Tahoma,Verdana,sans-serif" text-anchor="middle" fill="#111">${escapeXml(short)}</text>
<rect x="12" y="27" width="24" height="8" rx="1" fill="#1d1a18" stroke="#555" stroke-width=".5"/>
<circle cx="17" cy="31" r="2.6" fill="#e9e5da"/><circle cx="31" cy="31" r="2.6" fill="#e9e5da"/>
<circle cx="17" cy="31" r="1" fill="#222"/><circle cx="31" cy="31" r="1" fill="#222"/>
<path d="M5 10h38" stroke="#fff" stroke-opacity=".18"/>
</svg>`;
}

export function folderHome(): string {
  const a = id('fa');
  const b = id('fb');
  return `<svg viewBox="0 0 48 48" aria-hidden="true">
<defs><linearGradient id="${a}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset="1" stop-color="#e8b93a"/></linearGradient>
<linearGradient id="${b}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe98a"/><stop offset="1" stop-color="#d9a21b"/></linearGradient></defs>
<path d="M4 12h14l4 4h22v24H4z" fill="url(#${b})" stroke="#9c7412"/>
<path d="M4 19h40v21H4z" fill="url(#${a})" stroke="#9c7412"/>
<path d="M24 22l-8 7h2.5v7h11v-7H32z" fill="#fff" stroke="#6b5a2a" stroke-width=".8"/>
<text x="24" y="34.5" font-size="7" font-family="Tahoma,sans-serif" text-anchor="middle" fill="#6b5a2a">~</text>
</svg>`;
}

export function computer(): string {
  const s = id('cs');
  return `<svg viewBox="0 0 48 48" aria-hidden="true">
<defs><linearGradient id="${s}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#58a4ff"/><stop offset="1" stop-color="#0b3fa8"/></linearGradient></defs>
<rect x="8" y="6" width="32" height="26" rx="2" fill="#d9d6cc" stroke="#6d6a60"/>
<rect x="11" y="9" width="26" height="19" fill="url(#${s})" stroke="#28344f"/>
<path d="M13 11h22" stroke="#fff" stroke-opacity=".4"/>
<rect x="18" y="32" width="12" height="4" fill="#bdb9ad"/>
<rect x="10" y="36" width="28" height="5" rx="1" fill="#d9d6cc" stroke="#6d6a60"/>
</svg>`;
}

export function globe(): string {
  const g = id('gl');
  return `<svg viewBox="0 0 48 48" aria-hidden="true">
<defs><radialGradient id="${g}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#bfe3ff"/><stop offset=".5" stop-color="#3b8de8"/><stop offset="1" stop-color="#0b3a8f"/></radialGradient></defs>
<circle cx="24" cy="24" r="18" fill="url(#${g})" stroke="#0b3a8f"/>
<path d="M13 16c4 2 7 1 9 4s-2 6 1 9 6 1 7 5M28 9c-2 3 1 5 4 6s5 4 4 7" fill="none" stroke="#5fbf4a" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="24" cy="24" rx="18" ry="7" fill="none" stroke="#fff" stroke-opacity=".35"/>
</svg>`;
}

export function network(): string {
  return `<svg viewBox="0 0 16 16" aria-hidden="true">
<rect x="1" y="3" width="7" height="6" fill="#d9d6cc" stroke="#333" stroke-width=".7"/><rect x="2" y="4" width="5" height="4" fill="#2c7ce0"/>
<rect x="8" y="7" width="7" height="6" fill="#d9d6cc" stroke="#333" stroke-width=".7"/><rect x="9" y="8" width="5" height="4" fill="#2c7ce0"/>
<path d="M4.5 9v3.5H8" stroke="#fff" stroke-width="1" fill="none"/>
</svg>`;
}

export function moon(awake: boolean): string {
  return `<svg viewBox="0 0 16 16" aria-hidden="true">
<circle cx="8" cy="8" r="6.5" fill="${awake ? '#ff7a5c' : '#5b6b8c'}" stroke="#fff" stroke-width=".8"/>
<circle cx="10.5" cy="6" r="5" fill="${awake ? '#ffd2c4' : '#16305e'}"/>
${awake ? '<circle cx="12.6" cy="12.6" r="2" fill="#ff2a2a" stroke="#fff" stroke-width=".6"/>' : ''}
</svg>`;
}

function roundArrow(dir: 'back' | 'fwd'): string {
  const g = id('ar');
  const path = dir === 'back' ? 'M17 7l-8 5 8 5v-3h7v-4h-7z' : 'M7 7l8 5-8 5v-3H0v-4h7z';
  const tx = dir === 'back' ? 0 : 5;
  return `<svg viewBox="0 0 24 24" aria-hidden="true">
<defs><radialGradient id="${g}" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#bff5a8"/><stop offset=".6" stop-color="#3fae2a"/><stop offset="1" stop-color="#1e6e14"/></radialGradient></defs>
<circle cx="12" cy="12" r="10.5" fill="url(#${g})" stroke="#1e6e14"/>
<path d="${path}" transform="translate(${tx} 0)" fill="#fff"/>
</svg>`;
}

export const back = () => roundArrow('back');
export const forward = () => roundArrow('fwd');

export function up(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">
<path d="M2 6h7l2 2h11v13H2z" fill="#f3cd55" stroke="#9c7412"/>
<path d="M12 9l-5 5h3v5h4v-5h3z" fill="#3fae2a" stroke="#1e6e14" stroke-width=".8"/>
</svg>`;
}

export function search(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">
<circle cx="10" cy="10" r="6.5" fill="#dff1ff" stroke="#2a4f80" stroke-width="2"/>
<path d="M15 15l6 6" stroke="#8a5a1c" stroke-width="3.5" stroke-linecap="round"/>
</svg>`;
}

export function folders(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">
<path d="M1 4h6l2 2h8v8H1z" fill="#f3cd55" stroke="#9c7412"/>
<path d="M7 11h6l2 2h8v8H7z" fill="#ffe27a" stroke="#9c7412"/>
</svg>`;
}

export function go(): string {
  return `<svg viewBox="0 0 18 18" aria-hidden="true">
<rect x="1" y="1" width="16" height="16" rx="3" fill="#3fae2a" stroke="#1e6e14"/>
<path d="M5 9h7M9 5l4 4-4 4" stroke="#fff" stroke-width="2" fill="none"/>
</svg>`;
}

export function play(): string {
  return `<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="#3fae2a" stroke="#1e6e14"/><path d="M6 4.5v7l6-3.5z" fill="#fff"/></svg>`;
}

export function look(): string {
  return `<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="2" width="11" height="9" rx="1" fill="#d9d6cc" stroke="#555"/><rect x="2.5" y="3.5" width="8" height="6" fill="#2c7ce0"/><circle cx="11" cy="11" r="3" fill="#fff" stroke="#2a4f80" stroke-width="1.4"/><path d="M13 13l2.5 2.5" stroke="#8a5a1c" stroke-width="2"/></svg>`;
}

export function tv(): string {
  return `<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="3" width="14" height="10" rx="2" fill="#2a2a2e" stroke="#000"/><rect x="2.5" y="4.5" width="9" height="7" rx="1.5" fill="#3fae2a"/><path d="M5 1l3 2 3-2" stroke="#555" fill="none"/><circle cx="13" cy="6" r=".8" fill="#ddd"/><circle cx="13" cy="9" r=".8" fill="#ddd"/></svg>`;
}

export function copy(): string {
  return `<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="1.5" width="8" height="10" fill="#fff" stroke="#555"/><rect x="6" y="4.5" width="8" height="10" fill="#fff" stroke="#555"/><path d="M7.5 7h5M7.5 9h5M7.5 11h4" stroke="#8aa"/></svg>`;
}

export function eject(): string {
  return `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2l6 7H2z" fill="#4a5a80"/><rect x="2" y="11" width="12" height="3" fill="#4a5a80"/></svg>`;
}

export function textFile(ext: string): string {
  return `<svg viewBox="0 0 48 48" aria-hidden="true">
<path d="M10 4h20l8 8v32H10z" fill="#fff" stroke="#7a7a7a"/><path d="M30 4v8h8" fill="#e6e6e6" stroke="#7a7a7a"/>
<path d="M15 18h18M15 23h18M15 28h14M15 33h18" stroke="#9fb3c8"/>
<rect x="12" y="36" width="24" height="9" rx="1" fill="${ext === 'xml' ? '#e8742a' : '#2c7ce0'}"/>
<text x="24" y="43" font-size="7" font-family="Tahoma,sans-serif" font-weight="bold" text-anchor="middle" fill="#fff">${escapeXml(ext.toUpperCase())}</text>
</svg>`;
}

export function error(): string {
  return `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="#e53b2a" stroke="#8c1508"/><path d="M10 10l12 12M22 10L10 22" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></svg>`;
}

export function info(): string {
  return `<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="#2c7ce0" stroke="#fff"/><rect x="7" y="7" width="2" height="5" fill="#fff"/><rect x="7" y="4" width="2" height="2" fill="#fff"/></svg>`;
}

export function lock(): string {
  return `<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="8" rx="1" fill="#e8b93a" stroke="#8a6512"/><path d="M5 7V5a3 3 0 016 0v2" fill="none" stroke="#777" stroke-width="1.6"/></svg>`;
}

export function power(): string {
  return `<svg viewBox="0 0 22 22" aria-hidden="true"><rect x="1" y="1" width="20" height="20" rx="3" fill="#e0542e" stroke="#fff"/><path d="M11 5v6" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><path d="M7.5 7.5a5 5 0 107 0" fill="none" stroke="#fff" stroke-width="2"/></svg>`;
}

export function standby(): string {
  return `<svg viewBox="0 0 22 22" aria-hidden="true"><rect x="1" y="1" width="20" height="20" rx="3" fill="#e5a117" stroke="#fff"/><path d="M13 5a6 6 0 104 9 6.5 6.5 0 01-4-9z" fill="#fff"/></svg>`;
}

export function restart(): string {
  return `<svg viewBox="0 0 22 22" aria-hidden="true"><path d="M16 7a6 6 0 10.8 6" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M17.5 3v5h-5" fill="#fff"/></svg>`;
}

export function markImg(size: number, invert = false): string {
  return `<img src="${MARK_URL}" alt="" width="${size}" height="${size}" style="width:${size}px;height:${size}px;${invert ? 'filter:invert(1);' : ''}">`;
}

export function escapeXml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}
