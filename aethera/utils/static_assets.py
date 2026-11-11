"""
Static files that cache properly, and compression that skips what can't shrink.

Before this, nothing under /static sent Cache-Control. Browsers fell back to
heuristic caching off Last-Modified, which for a bundle untouched for weeks
means days: after a deploy, returning visitors could run an old oikos.js
against a new page. And GZipMiddleware compressed every response over 1 KB at
level 9 inside the event loop, video and images included (about 0.9 s of
blocked loop per cold visit to /oikos, for zero bytes saved on the MP4).

- `asset_url("oikos/oikos.js")` gives "/static/oikos/oikos.js?v=<hash>". The
  hash is of the file's bytes, so the URL changes exactly when the file does.
- `CachedStaticFiles` serves a URL as immutable for a year only when its `?v=`
  is the file's current content hash (what asset_url wrote). Anything else,
  hand-written versions like `?v=2` included, gets five minutes and then
  revalidates with the ETag Starlette already sends: a hand-bumped number can
  be forgotten, and a year-long pin on a stale file can't be taken back.
- `SelectiveGZipMiddleware` passes already-compressed formats straight through
  and compresses the rest at level 6 (level 9 costs far more CPU for ~1% more).
"""

from __future__ import annotations

import hashlib
import logging
import mimetypes
from pathlib import Path
from urllib.parse import parse_qs
from typing import Final

from starlette.middleware.gzip import GZipMiddleware
from starlette.responses import Response
from starlette.staticfiles import StaticFiles
from starlette.types import ASGIApp, Receive, Scope, Send

log = logging.getLogger(__name__)

STATIC_ROOT: Final[Path] = Path(__file__).resolve().parent.parent / "static"

# python's mimetypes table depends on the host; on the slim image some of these
# came back as text/plain, which browsers refuse for fonts under nosniff
for _type, _ext in (
    ("font/woff2", ".woff2"),
    ("font/woff", ".woff"),
    ("font/ttf", ".ttf"),
    ("font/otf", ".otf"),
    ("image/webp", ".webp"),
    ("image/avif", ".avif"),
    ("application/manifest+json", ".webmanifest"),
):
    mimetypes.add_type(_type, _ext)

IMMUTABLE: Final[str] = "public, max-age=31536000, immutable"
SHORT: Final[str] = "public, max-age=300"

# (path, mtime_ns, size) -> short hash; recomputed only when the file changes
_hashes: dict[str, tuple[int, int, str]] = {}


def content_hash(rel: str) -> str:
    """Short sha256 of a file under /static; recomputed only when it changes.
    Raises OSError / ValueError for a missing file or a path outside /static."""
    rel = rel.lstrip("/")
    path = (STATIC_ROOT / rel).resolve()
    if STATIC_ROOT not in path.parents:
        raise ValueError("outside /static")
    st = path.stat()
    cached = _hashes.get(rel)
    if cached and cached[0] == st.st_mtime_ns and cached[1] == st.st_size:
        return cached[2]
    digest = hashlib.sha256(path.read_bytes()).hexdigest()[:12]
    _hashes[rel] = (st.st_mtime_ns, st.st_size, digest)
    return digest


def asset_url(rel: str) -> str:
    """
    URL for a file under /static, versioned by its content.

    Never raises: a missing or unreadable file gets the bare URL (which then
    caches for five minutes instead of a year), and a warning in the log.
    """
    rel = rel.lstrip("/")
    bare = f"/static/{rel}"
    try:
        return f"{bare}?v={content_hash(rel)}"
    except (OSError, ValueError) as e:
        log.warning("asset_url(%r): %s; serving it unversioned", rel, e)
        return bare


def _pinned(path: str, query: bytes) -> bool:
    """True when the URL's ?v= is this file's current content hash."""
    try:
        v = parse_qs(query.decode("latin-1")).get("v", [""])[0]
        return len(v) == 12 and v == content_hash(path)
    except (OSError, ValueError, UnicodeDecodeError):
        return False


class CachedStaticFiles(StaticFiles):
    """StaticFiles with Cache-Control: a year for content-hashed URLs, five minutes otherwise."""

    async def get_response(self, path: str, scope: Scope) -> Response:
        response = await super().get_response(path, scope)
        if response.status_code in (200, 206, 304):
            pinned = _pinned(path, scope.get("query_string", b""))
            response.headers["Cache-Control"] = IMMUTABLE if pinned else SHORT
        return response


# formats that are already compressed: gzipping them burns CPU for nothing
INCOMPRESSIBLE: Final[tuple[str, ...]] = (
    ".mp4", ".webm", ".mov", ".m4a", ".mp3", ".ogg", ".opus", ".wav",
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico",
    ".woff", ".woff2", ".zip", ".gz", ".br", ".ts",
)


class SelectiveGZipMiddleware:
    """GZip for text; a straight pass-through for media, fonts and archives."""

    def __init__(self, app: ASGIApp, minimum_size: int = 1000, compresslevel: int = 6) -> None:
        self.app = app
        self.gzip = GZipMiddleware(app, minimum_size=minimum_size, compresslevel=compresslevel)

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http" and scope.get("path", "").lower().endswith(INCOMPRESSIBLE):
            await self.app(scope, receive, send)
            return
        await self.gzip(scope, receive, send)
