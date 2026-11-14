"""
Viewer statistics for /dreams that survive deploys.

The container log was the only record of who watched, it is wiped on every
deploy, and it never said how long anyone stayed. This keeps three small
tables in their own SQLite file on the data volume, read over ssh with
tools/dreams_stats.py. Nothing here is served on the web.

  viewer_session  one row per stream connection: when, how long, bytes sent,
                  how it ended, device class, and a visitor hash
  minute          one row a minute: viewers connected, whether the dream was
                  live, frames in, and the site's outbound bytes
  page_view       per hour, path, referrer host and device class: a count

Privacy: no IP address or user agent is stored. A visitor hash is
sha256(daily salt + address + user agent), cut to 12 hex digits; the salt
lives only in memory and is replaced at each UTC midnight, so hashes can
be counted within a day and never linked across days or back to anyone.
Referrers keep only their host.

Every entry point here is called from the stream hub or a request path and
must never raise or block: hooks only touch memory, and the minute task
writes everything in one transaction in a worker thread.
"""

from __future__ import annotations

import asyncio
import hashlib
import logging
import os
import re
import secrets
import sqlite3
import time
from collections import Counter
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Optional
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

# beside blog/irc/chronicle .sqlite in the project data/ dir (the mounted volume in production)
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
STATS_DB_PATH = Path(os.environ.get("DREAMS_STATS_DB", _PROJECT_ROOT / "data" / "dreams_stats.sqlite"))
SAMPLE_INTERVAL_S = 60.0
# paths whose page views are counted (GET, 2xx/3xx)
COUNTED_PATHS = {"/": "/", "/dreams": "/dreams", "/dreams/chronicle": "/dreams/chronicle"}
SITE_HOSTS = {"aetherawi.red", "www.aetherawi.red"}

_BOT_RE = re.compile(r"bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|headless|python-|curl/|wget|go-http", re.I)
_MOBILE_RE = re.compile(r"mobi|android|iphone|ipad", re.I)

SCHEMA = """
CREATE TABLE IF NOT EXISTS viewer_session (
    id INTEGER PRIMARY KEY,
    started_at TEXT NOT NULL,
    ended_at TEXT NOT NULL,
    seconds REAL NOT NULL,
    bytes_sent INTEGER NOT NULL,
    frames_sent INTEGER NOT NULL,
    overflows INTEGER NOT NULL,
    close_code INTEGER,
    close_reason TEXT,
    ended_by TEXT NOT NULL,
    device TEXT NOT NULL,
    visitor TEXT,
    live_at_start INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_viewer_session_started ON viewer_session (started_at);
CREATE TABLE IF NOT EXISTS minute (
    ts TEXT PRIMARY KEY,
    viewers INTEGER NOT NULL,
    live INTEGER NOT NULL,
    gpu_connected INTEGER NOT NULL,
    frames_in INTEGER,
    egress_bytes INTEGER
);
CREATE TABLE IF NOT EXISTS page_view (
    hour TEXT NOT NULL,
    path TEXT NOT NULL,
    referrer TEXT NOT NULL,
    device TEXT NOT NULL,
    views INTEGER NOT NULL,
    PRIMARY KEY (hour, path, referrer, device)
);
"""


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _iso(ts: float) -> str:
    return datetime.fromtimestamp(ts, timezone.utc).isoformat(timespec="seconds")


def device_class(user_agent: Optional[str]) -> str:
    ua = user_agent or ""
    if not ua:
        return "unknown"
    if _BOT_RE.search(ua):
        return "bot"
    return "mobile" if _MOBILE_RE.search(ua) else "desktop"


def referrer_host(referer: Optional[str]) -> str:
    """The referrer's host only: 'direct', 'site' (internal), or e.g. 't.co'."""
    if not referer:
        return "direct"
    try:
        host = (urlparse(referer).hostname or "").lower()
    except ValueError:
        return "other"
    if not host:
        return "direct"
    if host in SITE_HOSTS:
        return "site"
    return host[4:] if host.startswith("www.") else host


def _tx_bytes(path: str = "/proc/net/dev") -> Optional[int]:
    """Outbound bytes on the main interface (inside the container: the site's own)."""
    try:
        best = None
        for line in Path(path).read_text().splitlines()[2:]:
            name, rest = line.split(":", 1)
            if name.strip() == "lo":
                continue
            tx = int(rest.split()[8])
            best = tx if best is None else best + tx
        return best
    except Exception:
        return None


@dataclass
class _Open:
    started: float
    device: str
    visitor: Optional[str]
    live_at_start: bool


@dataclass
class ViewerStats:
    """In-memory collector; flush() writes it out. One per process."""

    db_path: Path = STATS_DB_PATH
    open_sessions: dict = field(default_factory=dict)        # key -> _Open
    finished: list = field(default_factory=list)              # rows for viewer_session
    page_views: Counter = field(default_factory=Counter)      # (hour, path, ref, device) -> n
    minutes: list = field(default_factory=list)               # rows for minute
    _salt: bytes = field(default_factory=lambda: secrets.token_bytes(16))
    _salt_day: str = field(default_factory=lambda: _utc_now().strftime("%Y-%m-%d"))
    _last_tx: Optional[int] = None
    _last_frames: Optional[int] = None
    _task: Optional[asyncio.Task] = None

    # ---- privacy -------------------------------------------------------------

    def visitor_hash(self, address: Optional[str], user_agent: Optional[str]) -> Optional[str]:
        if not address:
            return None
        day = _utc_now().strftime("%Y-%m-%d")
        if day != self._salt_day:  # new day: forget yesterday's salt
            self._salt, self._salt_day = secrets.token_bytes(16), day
        h = hashlib.sha256(self._salt + address.encode() + b"|" + (user_agent or "").encode())
        return h.hexdigest()[:12]

    # ---- hooks (never raise) -------------------------------------------------

    def session_started(self, key: Any, address: Optional[str], user_agent: Optional[str], live: bool) -> None:
        try:
            self.open_sessions[key] = _Open(time.time(), device_class(user_agent),
                                            self.visitor_hash(address, user_agent), bool(live))
        except Exception:
            logger.debug("stats: session_started failed", exc_info=True)

    def session_ended(self, key: Any, bytes_sent: int, frames_sent: int, overflows: int,
                      close_code: Optional[int], close_reason: Optional[str], ended_by: str) -> None:
        try:
            s = self.open_sessions.pop(key, None)
            if s is None:
                return
            end = time.time()
            self.finished.append((_iso(s.started), _iso(end), round(end - s.started, 1), int(bytes_sent),
                                  int(frames_sent), int(overflows), close_code, (close_reason or "")[:60] or None,
                                  ended_by, s.device, s.visitor, int(s.live_at_start)))
        except Exception:
            logger.debug("stats: session_ended failed", exc_info=True)

    def page_view(self, path: str, referer: Optional[str], user_agent: Optional[str]) -> None:
        try:
            hour = _utc_now().strftime("%Y-%m-%dT%H:00Z")
            self.page_views[(hour, path, referrer_host(referer), device_class(user_agent))] += 1
        except Exception:
            logger.debug("stats: page_view failed", exc_info=True)

    def sample(self, viewers: int, live: bool, gpu_connected: bool, frames_total: Optional[int],
               tx_total: Optional[int] = None) -> None:
        """One minute row; frames and egress are deltas since the last sample."""
        try:
            tx = _tx_bytes() if tx_total is None else tx_total
            d_tx = tx - self._last_tx if tx is not None and self._last_tx is not None and tx >= self._last_tx else None
            d_fr = (frames_total - self._last_frames if frames_total is not None and self._last_frames is not None
                    and frames_total >= self._last_frames else None)
            self._last_tx, self._last_frames = tx, frames_total
            ts = _utc_now().replace(second=0, microsecond=0).isoformat(timespec="minutes")
            self.minutes.append((ts, int(viewers), int(bool(live)), int(bool(gpu_connected)), d_fr, d_tx))
        except Exception:
            logger.debug("stats: sample failed", exc_info=True)

    # ---- storage -------------------------------------------------------------

    def _connect(self) -> sqlite3.Connection:
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(self.db_path, timeout=30)
        conn.executescript(SCHEMA)
        return conn

    def flush(self) -> int:
        """Write everything collected so far in one transaction. Never raises."""
        finished, self.finished = self.finished, []
        minutes, self.minutes = self.minutes, []
        views, self.page_views = self.page_views, Counter()
        if not (finished or minutes or views):
            return 0
        try:
            conn = self._connect()
            with conn:
                conn.executemany(
                    "INSERT INTO viewer_session (started_at, ended_at, seconds, bytes_sent, frames_sent, overflows,"
                    " close_code, close_reason, ended_by, device, visitor, live_at_start)"
                    " VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", finished)
                conn.executemany("INSERT OR REPLACE INTO minute VALUES (?,?,?,?,?,?)", minutes)
                conn.executemany(
                    "INSERT INTO page_view VALUES (?,?,?,?,?) ON CONFLICT (hour, path, referrer, device)"
                    " DO UPDATE SET views = views + excluded.views",
                    [(*k, n) for k, n in views.items()])
            conn.close()
            return len(finished) + len(minutes) + len(views)
        except Exception:
            logger.warning("stats: flush failed (keeping the rows for next time)", exc_info=True)
            self.finished[:0], self.minutes[:0] = finished, minutes
            self.page_views.update(views)
            return 0

    # ---- the minute task -----------------------------------------------------

    def start(self, probe: Callable[[], tuple]) -> None:
        """probe() -> (viewers, live, gpu_connected, frames_total); called once a minute."""
        if self._task is None or self._task.done():
            self._task = asyncio.get_running_loop().create_task(self._loop(probe))

    async def _loop(self, probe: Callable[[], tuple]) -> None:
        while True:
            await asyncio.sleep(SAMPLE_INTERVAL_S)
            try:
                self.sample(*probe())
                await asyncio.to_thread(self.flush)
            except asyncio.CancelledError:
                raise
            except Exception:
                logger.warning("stats: minute pass failed", exc_info=True)

    async def stop(self) -> None:
        """On shutdown: close what is still open (a deploy ends every session) and flush."""
        if self._task and not self._task.done():
            self._task.cancel()
        for key in list(self.open_sessions):
            self.session_ended(key, 0, 0, 0, None, "server shutdown", "shutdown")
        await asyncio.to_thread(self.flush)


_STATS: Optional[ViewerStats] = None


def get_stats() -> ViewerStats:
    global _STATS
    if _STATS is None:
        _STATS = ViewerStats()
    return _STATS


class PageViewMiddleware:
    """
    Pure ASGI: counts GETs of the pages in COUNTED_PATHS that answer 2xx/3xx.
    Looks only at the path, two headers and the response status; never at a
    body, so streaming responses pass straight through.
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope.get("type") != "http" or scope.get("method") != "GET" or scope.get("path") not in COUNTED_PATHS:
            return await self.app(scope, receive, send)
        headers = {k.decode("latin-1").lower(): v.decode("latin-1") for k, v in scope.get("headers") or []}

        async def send_wrapper(message):
            if message.get("type") == "http.response.start" and 200 <= message.get("status", 0) < 400:
                get_stats().page_view(COUNTED_PATHS[scope["path"]], headers.get("referer"), headers.get("user-agent"))
            await send(message)

        return await self.app(scope, receive, send_wrapper)
