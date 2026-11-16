"""
Link cards for posts: the picture a post unfurls into when someone shares it.

A frame of the site's own background video (power lines against a noisy sky,
cut by tools/card_backs.sh), darkened where the words go, under faint
scanlines; the post's title large in the blog's face, Libertinus Mono, with a
soft glow; its author and date beneath; the æthera mark in the corner.

Each post gets one of the frames, chosen by its slug, so cards differ from
post to post but a post's card never changes on its own. A card is drawn on
first request and kept in memory; its URL carries a version made of
everything drawn on it, so a retitled post gets a new URL (unfurlers cache
images by URL, often for days).
"""

from __future__ import annotations

import hashlib
import io
import logging
from functools import lru_cache
from pathlib import Path
from typing import Final

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

log = logging.getLogger(__name__)

STATIC: Final[Path] = Path(__file__).resolve().parent.parent / "static"
BACKS: Final[tuple[Path, ...]] = tuple(sorted((STATIC / "cards").glob("back-*.jpg")))
FONT: Final[Path] = STATIC / "fonts" / "LibertinusMono-Regular.ttf"
MARK: Final[Path] = STATIC / "uploads" / "aethera_trimmed.png"

W, H = 1200, 630
MARGIN = 64
#: bump when the drawing changes, so every card gets a new URL
CARD_VERSION: Final[str] = "1"
#: the title block's height at most, in px
TITLE_MAX_H: Final[int] = 300

TITLE_COLOR = (244, 241, 234)
GLOW_COLOR = (255, 160, 90)
BYLINE_COLOR = (214, 190, 170)


def _back_index(slug: str) -> int:
    return int(hashlib.sha1(slug.encode("utf-8")).hexdigest(), 16) % max(1, len(BACKS))


def card_version(slug: str, title: str, author: str, date: str) -> str:
    """Short hash of everything drawn on the card (and the drawing itself)."""
    key = "\x1f".join((CARD_VERSION, slug, title, author, date, str(len(BACKS))))
    return hashlib.sha1(key.encode("utf-8")).hexdigest()[:10]


def _font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    try:
        return ImageFont.truetype(str(FONT), size)
    except OSError:  # a missing font must not take the card down
        log.warning("cards: %s unreadable; falling back to Pillow's default face", FONT)
        return ImageFont.load_default(size)


def _wrap(draw: ImageDraw.ImageDraw, text: str, font, width: int) -> list[str]:
    """Greedy word wrap; a word wider than the line is broken by character."""
    lines: list[str] = []
    line = ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=font) <= width:
            line = trial
            continue
        if line:
            lines.append(line)
        while draw.textlength(word, font=font) > width:
            cut = len(word)
            while cut > 1 and draw.textlength(word[:cut], font=font) > width:
                cut -= 1
            lines.append(word[:cut])
            word = word[cut:]
        line = word
    if line:
        lines.append(line)
    return lines or [""]


def _fit_title(draw: ImageDraw.ImageDraw, title: str, width: int):
    """The largest size (120 px down to 44) at which the title fits in 3 lines
    and a block no taller than TITLE_MAX_H (so it stays on the dark ground,
    clear of the mark); past that, the third line ends in an ellipsis."""
    for size in range(120, 43, -4):
        font = _font(size)
        lines = _wrap(draw, title, font, width)
        if len(lines) <= 3 and len(lines) * size * 1.12 <= TITLE_MAX_H:
            return font, size, lines
    font = _font(44)
    lines = _wrap(draw, title, font, width)[:3]
    while lines[-1] and draw.textlength(lines[-1] + "…", font=font) > width:
        lines[-1] = lines[-1][:-1].rstrip()
    lines[-1] += "…"
    return font, 44, lines


def _treatment() -> Image.Image:
    """Darkness where the words go, scanlines, a vignette: one RGBA layer."""
    # the smooth parts at a quarter size (they're gradients), then scaled up
    sw, sh = W // 4, H // 4
    small = Image.new("L", (sw, sh), 0)
    px = small.load()
    for y in range(sh):
        # from nothing above the middle to deep at the foot
        fy = max(0.0, (y / sh - 0.34) / 0.66)
        vy = 225 * fy**1.35
        for x in range(sw):
            # a little more on the left, where the lines start
            fx = max(0.0, 1 - x / (sw * 0.75))
            # the corners
            dx, dy = (x / sw - 0.5) * 2, (y / sh - 0.5) * 2
            vig = max(0.0, (dx * dx + dy * dy) ** 0.5 - 0.75) * 120
            px[x, y] = min(235, int(vy + 70 * fx * fy + vig))
    shade = small.resize((W, H), Image.BILINEAR)
    # scanlines: every third row a shade darker
    lines = Image.new("L", (W, H), 0)
    ld = ImageDraw.Draw(lines)
    for y in range(0, H, 3):
        ld.line([(0, y), (W, y)], fill=46)
    shade = ImageChops.add(shade, lines)
    layer = Image.new("RGBA", (W, H), (4, 2, 3, 255))
    layer.putalpha(shade)
    return layer


@lru_cache(maxsize=1)
def _treatment_cached() -> Image.Image:
    return _treatment()


@lru_cache(maxsize=1)
def _mark() -> Image.Image | None:
    try:
        m = Image.open(MARK).convert("RGBA")
    except OSError:
        log.warning("cards: %s unreadable; cards go without the mark", MARK)
        return None
    h = 46
    m = m.resize((round(m.width * h / m.height), h), Image.LANCZOS)
    alpha = m.getchannel("A").point(lambda a: a * 0.88)
    m.putalpha(alpha)
    return m


def card_path(post) -> str:
    """Where a post's card is served, versioned by what's drawn on it (no leading slash)."""
    date = post.created_at.strftime("%Y-%m-%d")
    return f"posts/{post.slug}/card.jpg?v={card_version(post.slug, post.title, post.author, date)}"


def card_for(post) -> bytes:
    """A post's card (see render_card)."""
    return render_card(post.slug, post.title, post.author, post.created_at.strftime("%Y-%m-%d"))


@lru_cache(maxsize=32)  # ~160 KB each: a few MB at most on a small server
def render_card(slug: str, title: str, author: str, date: str) -> bytes:
    """The card for one post, as a JPEG. Cached by everything drawn on it."""
    if BACKS:
        base = Image.open(BACKS[_back_index(slug)]).convert("RGB").resize((W, H))
    else:  # no frames committed: a dark card still carries the words
        log.warning("cards: no backgrounds under %s", STATIC / "cards")
        base = Image.new("RGB", (W, H), (12, 6, 8))
    img = base.convert("RGBA")
    img.alpha_composite(_treatment_cached())

    draw = ImageDraw.Draw(img)
    width = W - 2 * MARGIN
    font, size, lines = _fit_title(draw, title.strip() or slug, width)
    line_h = round(size * 1.12)

    byline = " · ".join(p for p in (author.strip(), date) if p)
    by_font = _font(30)
    by_y = H - MARGIN - 30
    top = by_y - 22 - line_h * len(lines)

    # the glow: the title blurred, warm, under the crisp one
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for i, line in enumerate(lines):
        gd.text((MARGIN, top + i * line_h), line, font=font, fill=GLOW_COLOR + (150,))
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(14)))

    draw = ImageDraw.Draw(img)
    for i, line in enumerate(lines):
        draw.text((MARGIN, top + i * line_h), line, font=font, fill=TITLE_COLOR + (255,))
    if byline:
        draw.text((MARGIN, by_y), byline, font=by_font, fill=BYLINE_COLOR + (255,))

    mark = _mark()
    if mark is not None:
        img.alpha_composite(mark, (MARGIN - 6, MARGIN - 18))

    out = io.BytesIO()
    img.convert("RGB").save(out, "JPEG", quality=86, optimize=True, progressive=True)
    return out.getvalue()
