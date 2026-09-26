"""
Dreams viewer fan-out: one slow or dead viewer must never hold up the others.

The hub gives each viewer its own queue + sender task. These tests drive it
with fake sockets (no network) via asyncio.run, so no async plugin is needed.
"""
import asyncio
import json
import time

import aethera.dreams.websocket as ws_mod
from aethera.dreams.frame_cache import FrameCache
from aethera.dreams.presence import ViewerPresenceTracker
from aethera.dreams.websocket import DreamWebSocketHub


class FakeSocket:
    def __init__(self, delay: float = 0.0, fail: bool = False):
        self.delay = delay
        self.fail = fail
        self.texts: list = []
        self.frames: list = []
        self.closed_code = None

    async def accept(self):
        pass

    async def send_text(self, text):
        if self.fail:
            raise ConnectionError("gone")
        if self.delay:
            await asyncio.sleep(self.delay)
        self.texts.append(text)

    async def send_bytes(self, data):
        if self.fail:
            raise ConnectionError("gone")
        if self.delay:
            await asyncio.sleep(self.delay)
        self.frames.append(data)

    async def send_json(self, data):
        await self.send_text(json.dumps(data))

    async def close(self, code=1000, reason=""):
        self.closed_code = code


def _hub(tmp_path) -> DreamWebSocketHub:
    hub = DreamWebSocketHub(FrameCache(state_dir=tmp_path), ViewerPresenceTracker())
    # The MPEG-TS muxer (PyAV) isn't under test, and fed these fake NAL bytes
    # it segfaults while finalizing at interpreter exit.
    hub._mpegts_muxer = None
    return hub


def _frame_payload(fn: int, keyframe: bool) -> bytes:
    meta = json.dumps({"fn": fn, "kf": 1, "vk": keyframe}).encode()
    return len(meta).to_bytes(4, "big") + meta + b"\x00\x00\x00\x01NAL%d" % fn


def test_slow_viewer_does_not_delay_fast_viewer(tmp_path):
    async def run():
        hub = _hub(tmp_path)
        fast, slow = FakeSocket(), FakeSocket(delay=2.0)
        assert await hub.connect_viewer(fast)
        assert await hub.connect_viewer(slow)
        t0 = time.monotonic()
        for fn in range(1, 31):
            await hub._handle_gpu_frame(_frame_payload(fn, keyframe=(fn == 1)))
        broadcast_s = time.monotonic() - t0
        await asyncio.sleep(0.05)
        assert broadcast_s < 0.5, "broadcasting must not wait on any viewer"
        assert len(fast.frames) == 30
        assert len(slow.frames) < 30  # still crawling, on its own time
        for w in (fast, slow):
            await hub.disconnect_viewer(w)
    asyncio.run(run())


def test_overflow_drops_backlog_and_resyncs_on_keyframe(tmp_path, monkeypatch):
    monkeypatch.setattr(ws_mod, "VIEWER_QUEUE_FRAMES", 4)
    monkeypatch.setattr(ws_mod, "VIEWER_MAX_OVERFLOWS", 99)

    async def run():
        hub = _hub(tmp_path)
        stuck = FakeSocket(delay=10.0)
        assert await hub.connect_viewer(stuck)
        ch = hub._channels[stuck]
        await hub._handle_gpu_frame(_frame_payload(1, keyframe=True))
        for fn in range(2, 12):          # P-frames pile up and overflow
            await hub._handle_gpu_frame(_frame_payload(fn, keyframe=False))
        assert ch.needs_keyframe, "overflow must wait for the next I-frame"
        before = ch.queue.qsize()
        await hub._handle_gpu_frame(_frame_payload(12, keyframe=False))
        assert ch.queue.qsize() == before, "P-frames skipped until an I-frame"
        await hub._handle_gpu_frame(_frame_payload(13, keyframe=True))
        assert not ch.needs_keyframe
        await hub.disconnect_viewer(stuck)
    asyncio.run(run())


def test_persistently_slow_viewer_is_closed(tmp_path, monkeypatch):
    monkeypatch.setattr(ws_mod, "VIEWER_QUEUE_FRAMES", 2)
    monkeypatch.setattr(ws_mod, "VIEWER_MAX_OVERFLOWS", 3)

    async def run():
        hub = _hub(tmp_path)
        stuck = FakeSocket(delay=10.0)
        assert await hub.connect_viewer(stuck)
        for fn in range(1, 40):
            await hub._handle_gpu_frame(_frame_payload(fn, keyframe=True))
        await asyncio.sleep(0.05)
        assert stuck.closed_code == ws_mod.CLOSE_TOO_SLOW
        assert stuck not in hub._channels and hub.viewer_count == 0
    asyncio.run(run())


def test_failed_send_closes_the_socket(tmp_path):
    async def run():
        hub = _hub(tmp_path)
        dead = FakeSocket(fail=True)
        assert await hub.connect_viewer(dead)
        await hub._handle_gpu_frame(_frame_payload(1, keyframe=True))
        await asyncio.sleep(0.05)
        assert dead.closed_code == 1011, "a dropped viewer must be closed so its page reconnects"
        assert hub.viewer_count == 0
    asyncio.run(run())


def test_viewer_cap_refuses_politely(tmp_path, monkeypatch):
    monkeypatch.setattr(ws_mod, "MAX_VIEWERS", 1)

    async def run():
        hub = _hub(tmp_path)
        first, second = FakeSocket(), FakeSocket()
        assert await hub.connect_viewer(first)
        assert not await hub.connect_viewer(second)
        assert second.closed_code == ws_mod.CLOSE_AT_CAPACITY
        assert json.loads(second.texts[0])["status"] == "full"
        assert hub.viewer_count == 1
        await hub.disconnect_viewer(first)
    asyncio.run(run())


def test_late_joiner_waits_for_live_keyframe(tmp_path):
    async def run():
        hub = _hub(tmp_path)
        await hub._handle_gpu_frame(_frame_payload(1, keyframe=True))
        await hub._handle_gpu_frame(_frame_payload(2, keyframe=False))  # stream is live
        late = FakeSocket()
        assert await hub.connect_viewer(late)
        await hub._handle_gpu_frame(_frame_payload(3, keyframe=False))
        await asyncio.sleep(0.02)
        assert late.frames == [], "no P-frames before an I-frame (they would smear)"
        await hub._handle_gpu_frame(_frame_payload(4, keyframe=True))
        await asyncio.sleep(0.02)
        assert len(late.frames) == 1
        await hub.disconnect_viewer(late)
    asyncio.run(run())


def test_ping_is_answered_through_the_queue(tmp_path):
    async def run():
        hub = _hub(tmp_path)
        v = FakeSocket()
        assert await hub.connect_viewer(v)
        await hub.handle_viewer_message(v, '{"type": "ping"}')
        await asyncio.sleep(0.02)
        assert any(json.loads(t).get("type") == "pong" for t in v.texts)
        await hub.disconnect_viewer(v)
    asyncio.run(run())
