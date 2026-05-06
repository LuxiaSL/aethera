import type { Palette } from '../types';

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>{}[]|/\\~=+-';
const TOTAL_FRAMES = 14;
const FRAME_MS = 1000 / 24;

export function runGlitchDecode(
  el: HTMLElement,
  text: string,
  palette: Palette,
  highlightFn: (text: string) => string,
): void {
  let frame = 0;
  el.style.borderColor = palette.border;

  const tick = (): void => {
    frame++;
    const progress = frame / TOTAL_FRAMES;

    if (frame >= TOTAL_FRAMES) {
      el.innerHTML = highlightFn(text);
      el.style.borderColor = '';
      return;
    }

    const lockedCount = Math.ceil(text.length * progress);
    let html = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (i < lockedCount) {
        html += `<span style="color:${palette.bright}">${escapeChar(ch)}</span>`;
      } else if (' ,.\n;:'.includes(ch)) {
        html += escapeChar(ch);
      } else {
        const glyph = GLITCH_CHARS[(Math.random() * GLITCH_CHARS.length) | 0];
        const roll = Math.random();
        let color: string;
        if (roll < 0.10) color = palette.accent;
        else if (roll < 0.14) color = '#ffffff';
        else color = palette.rainMid;
        html += `<span style="color:${color}">${glyph}</span>`;
      }
    }
    el.innerHTML = html;

    const borderColors = [palette.rainMid, palette.border, palette.borderDim, palette.accent];
    el.style.borderColor = borderColors[(Math.random() * borderColors.length) | 0];

    setTimeout(tick, FRAME_MS);
  };

  setTimeout(tick, FRAME_MS);
}

function escapeChar(ch: string): string {
  if (ch === '<') return '&lt;';
  if (ch === '>') return '&gt;';
  if (ch === '&') return '&amp;';
  if (ch === '"') return '&quot;';
  return ch;
}
