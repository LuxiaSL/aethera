"""
Viewer stats for /dreams (aethera/dreams/stats.py): sessions, page views and a
minute sample, written to their own SQLite file. No IP or user agent may ever
reach the file, and no hook may raise into the stream hub.
"""
import asyncio
import json
import sqlite3
from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient

import aethera.dreams.stats as stats_mod
from aethera.dreams.frame_cache import FrameCache
from aethera.dreams.presence import ViewerPresenceTracker
from aethera.dreams.stats import ViewerStats, device_class, referrer_host
from aethera.dreams.websocket import DreamWebSocketHub

IP = "203.0.113.77"
UA_PHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile/15E148"


@pytest.fixture
def stats(tmp_path, monkeypatch):
    s = ViewerStats(db_path=tmp_path / "dreams_stats.sqlite")
    monkeypatch.setattr(stats_mod, "_STATS", s)
    return s


def _rows(s: ViewerStats, sql: str):
    conn = sqlite3.connect(s.db_path)
    try:
        return conn.execute(sql).fetchall()
    finally:
        conn.close()


class _Client:
    host = IP


class FakeSocket:
    def __init__(self, ua=UA_PHONE):
        self.client = _Client()
        self.headers = {"user-agent": ua}
        self.texts, self.frames, self.closed_code = [], [], None

    async def accept(self):
        pass

    async def send_text(self, text):
        self.texts.append(text)

    async def send_bytes(self, data):
        self.frames.append(data)

    async def send_json(self, data):
        await self.send_text(json.dumps(data))

    async def close(self, code=1000, reason=""):
        self.closed_code = code


def _hub(tmp_path) -> DreamWebSocketHub:
    hub = DreamWebSocketHub(FrameCache(state_dir=tmp_path), ViewerPresenceTracker())
    hub._mpegts_muxer = None  # not under test (PyAV segfaults on fake NALs at exit)
    return hub


def _frame(fn: int, keyframe: bool) -> bytes:
    meta = json.dumps({"fn": fn, "kf": 1, "vk": keyframe}).encode()
    return len(meta).to_bytes(4, "big") + meta + b"\x00\x00\x00\x01NAL%d" % fn


def test_device_and_referrer_classes():
    assert device_class(UA_PHONE) == "mobile"
    assert device_class("Mozilla/5.0 (X11; Linux x86_64) Chrome/140") == "desktop"
    assert device_class("Twitterbot/1.0") == "bot"
    assert device_class(None) == "unknown"
    assert referrer_host("https://t.co/abc123") == "t.co"
    assert referrer_host("https://www.google.com/search?q=dreams") == "google.com"
    assert referrer_host("https://aetherawi.red/dreams/chronicle") == "site"
    assert referrer_host(None) == "direct"
    assert referrer_host("not a url at all") == "direct"


def test_visitor_hash_is_stable_within_a_day_and_forgotten_after(stats, monkeypatch):
    a = stats.visitor_hash(IP, UA_PHONE)
    assert a == stats.visitor_hash(IP, UA_PHONE) and len(a) == 12
    assert a != stats.visitor_hash("198.51.100.1", UA_PHONE)
    monkeypatch.setattr(stats_mod, "_utc_now", lambda: datetime(2099, 1, 2, tzinfo=timezone.utc))
    assert stats.visitor_hash(IP, UA_PHONE) != a  # new day, new salt: can't link the two


def test_a_viewing_session_is_recorded_without_any_ip_or_user_agent(stats, tmp_path):
    async def run():
        hub = _hub(tmp_path)
        ws = FakeSocket()
        assert await hub.connect_viewer(ws)
        for fn in range(1, 6):
            await hub._handle_gpu_frame(_frame(fn, keyframe=(fn == 1)))
        await asyncio.sleep(0.05)  # let the sender task drain
        await hub.disconnect_viewer(ws, 1000, "hidden", "client")

    asyncio.run(run())
    assert stats.flush() >= 1
    (row,) = _rows(stats, "SELECT seconds, bytes_sent, frames_sent, close_code, close_reason, ended_by,"
                          " device, visitor FROM viewer_session")
    seconds, bytes_sent, frames, code, reason, ended_by, device, visitor = row
    assert frames == 5 and bytes_sent > 0 and seconds >= 0
    assert (code, reason, ended_by, device) == (1000, "hidden", "client", "mobile")
    assert visitor and len(visitor) == 12
    raw = stats.db_path.read_bytes()
    assert IP.encode() not in raw and b"iPhone" not in raw


def test_a_server_drop_is_recorded_as_the_server_ending_it(stats, tmp_path):
    async def run():
        hub = _hub(tmp_path)
        ws = FakeSocket()
        assert await hub.connect_viewer(ws)
        await hub._drop_viewer(ws, 4002, "too slow")

    asyncio.run(run())
    stats.flush()
    assert _rows(stats, "SELECT close_code, ended_by FROM viewer_session") == [(4002, "server")]


def test_pages_are_counted_by_hour_path_referrer_and_device(stats, client: TestClient):
    client.get("/dreams", headers={"referer": "https://t.co/x", "user-agent": UA_PHONE})
    client.get("/dreams", headers={"referer": "https://t.co/y", "user-agent": UA_PHONE})
    client.get("/dreams/chronicle")
    client.get("/static/js/dreams.js")      # not a counted page
    client.get("/api/dreams/status")         # nor this
    client.post("/dreams")                   # nor a POST
    stats.flush()
    got = {(p, r, d): n for _, p, r, d, n in _rows(stats, "SELECT * FROM page_view")}
    assert got[("/dreams", "t.co", "mobile")] == 2
    assert sum(n for (p, _, _), n in got.items() if p == "/dreams/chronicle") == 1
    assert {p for p, _, _ in got} == {"/dreams", "/dreams/chronicle"}


def test_page_views_add_up_across_flushes(stats):
    for _ in range(3):
        stats.page_view("/dreams", None, "Mozilla/5.0 (X11) Chrome")
        stats.flush()
    assert _rows(stats, "SELECT views FROM page_view") == [(3,)]


def test_minute_rows_carry_deltas_not_totals(stats):
    stats.sample(2, True, True, frames_total=1000, tx_total=10_000)
    stats.sample(3, True, True, frames_total=2800, tx_total=50_000)
    stats.flush()
    rows = _rows(stats, "SELECT viewers, live, frames_in, egress_bytes FROM minute ORDER BY ts")
    # both samples land in the same minute here, so the second replaces the first
    assert rows[-1] == (3, 1, 1800, 40_000)


def test_a_failed_flush_keeps_the_rows(tmp_path):
    s = ViewerStats(db_path=tmp_path / "file-not-dir")
    (tmp_path / "file-not-dir").write_text("x")
    s.db_path = tmp_path / "file-not-dir" / "stats.sqlite"   # parent is a file: can't open
    s.page_view("/dreams", None, None)
    assert s.flush() == 0
    assert sum(s.page_views.values()) == 1


def test_hooks_never_raise():
    s = ViewerStats()
    s.session_ended("never-opened", 0, 0, 0, None, None, "client")   # unknown key: ignored
    s.session_started(object(), None, None, False)                   # no address: no hash
    s.page_view(None, 12345, object())                               # junk in, nothing out


def test_shutdown_closes_open_sessions_and_flushes(stats):
    stats.session_started("k", IP, UA_PHONE, True)
    asyncio.run(stats.stop())
    assert _rows(stats, "SELECT ended_by, close_reason FROM viewer_session") == [("shutdown", "server shutdown")]
