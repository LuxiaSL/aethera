"""
WebSocket Hub for Dream Window

Manages two types of WebSocket connections:
1. Browser viewers: Receive frame broadcasts
2. GPU connection: Sends frames to broadcast

Frame protocol uses binary messages for efficiency:
- Type byte (0x01 = frame, 0x02 = state, etc.)
- Payload (H.264 NAL data, msgpack, etc.)

Frame Message Format (v2 from GPU):
  0x01 | metadata_len (4 bytes BE) | JSON metadata | H.264 NAL data

Metadata JSON:
  {
    "fn": frame_number,      // Sequential frame number from GPU
    "kf": keyframe_number,   // Current keyframe number
    "vk": true/false,        // Video keyframe (H.264 I-frame)
    "p": "prompt text"       // Prompt for this keyframe (optional)
  }

H.264 frames are passed through directly to viewers (no buffering/pacing).
The VideoDecoder on the client side handles its own buffering natively.

Fan-out: every viewer has its own small send queue and sender task
(_ViewerChannel), so a slow or stalled viewer can only ever delay itself.
A viewer whose queue overflows drops what it had queued and resyncs at the
next I-frame; one that keeps overflowing, or whose send fails, is closed so
its page reconnects instead of freezing on a stale frame.
"""

import asyncio
import json
import logging
import os
import time
from collections import deque
from typing import Dict, Optional, Set
from fastapi import WebSocket, WebSocketDisconnect

from .frame_cache import FrameCache
from .presence import ViewerPresenceTracker

logger = logging.getLogger(__name__)

# Viewers beyond this get an "at capacity" status and a clean close (0 = no cap).
# Each viewer costs ~2.7 Mbps (4 Mbps cap) of VPS upload.
MAX_VIEWERS = int(os.environ.get("DREAMS_MAX_VIEWERS", "200"))
# Per-viewer queue: ~3 s of frames at ~29 fps (each entry = meta + frame).
VIEWER_QUEUE_FRAMES = 90
VIEWER_SEND_TIMEOUT = 10.0
# A viewer that overflows this many times within the window is closed.
VIEWER_MAX_OVERFLOWS = 5
VIEWER_OVERFLOW_WINDOW = 60.0
# The stream counts as live if a frame arrived this recently.
STREAM_LIVE_SECONDS = 5.0

CLOSE_TOO_SLOW = 4002      # viewer could not keep up; client reconnects
CLOSE_AT_CAPACITY = 4003   # viewer cap reached; client retries later


class _ViewerChannel:
    """One viewer's outbound queue + sender task. Never blocks the hub."""

    def __init__(self, websocket: WebSocket, hub: "DreamWebSocketHub", needs_keyframe: bool):
        self.ws = websocket
        self.hub = hub
        self.queue: asyncio.Queue = asyncio.Queue(maxsize=VIEWER_QUEUE_FRAMES)
        self.needs_keyframe = needs_keyframe
        self.overflows: deque = deque()
        self.closed = False
        self.task = asyncio.create_task(self._run())

    def offer_frame(self, meta_text: str, frame_bytes: bytes, is_keyframe: bool) -> None:
        if self.closed:
            return
        if self.needs_keyframe:
            if not is_keyframe:
                return  # P-frames are useless until the viewer has an I-frame
            self.needs_keyframe = False
        try:
            self.queue.put_nowait(("frame", meta_text, frame_bytes))
        except asyncio.QueueFull:
            self._overflow()

    def offer_text(self, text: str) -> None:
        """Control/status JSON: must get through, so make room if needed."""
        if self.closed:
            return
        try:
            self.queue.put_nowait(("text", text, None))
        except asyncio.QueueFull:
            self._overflow()
            try:
                self.queue.put_nowait(("text", text, None))
            except asyncio.QueueFull:
                pass

    def _overflow(self) -> None:
        # Drop the backlog and resync at the next I-frame.
        while not self.queue.empty():
            try:
                self.queue.get_nowait()
            except asyncio.QueueEmpty:
                break
        self.needs_keyframe = True
        now = time.monotonic()
        self.overflows.append(now)
        while self.overflows and now - self.overflows[0] > VIEWER_OVERFLOW_WINDOW:
            self.overflows.popleft()
        if len(self.overflows) >= VIEWER_MAX_OVERFLOWS:
            logger.info("Viewer too slow (%d overflows in %.0fs) — closing",
                        len(self.overflows), VIEWER_OVERFLOW_WINDOW)
            asyncio.create_task(self.hub._drop_viewer(self.ws, CLOSE_TOO_SLOW, "too slow"))

    async def _run(self) -> None:
        try:
            while True:
                kind, text, data = await self.queue.get()
                await asyncio.wait_for(self.ws.send_text(text), timeout=VIEWER_SEND_TIMEOUT)
                if kind == "frame":
                    await asyncio.wait_for(self.ws.send_bytes(data), timeout=VIEWER_SEND_TIMEOUT)
        except asyncio.CancelledError:
            pass
        except Exception as e:  # timeout, closed socket, network error
            if not self.closed:
                logger.debug(f"Viewer send failed ({type(e).__name__}) — dropping viewer")
                asyncio.create_task(self.hub._drop_viewer(self.ws, 1011, "send failed"))

    def stop(self) -> None:
        self.closed = True
        if not self.task.done():
            self.task.cancel()

# Message type bytes (GPU -> VPS)
MSG_FRAME = 0x01
MSG_STATE = 0x02
MSG_HEARTBEAT = 0x03
MSG_STATUS = 0x04
MSG_CHRONICLE = 0x05  # chronicle keyframe-record batches (see dreams/chronicle/)

# Control message types (VPS -> GPU)
CTRL_LOAD_STATE = 0x11  # VPS sends saved state to GPU for restoration
CTRL_SAVE_STATE = 0x12  # Request GPU to save state
CTRL_SHUTDOWN = 0x13    # Request GPU shutdown


class DreamWebSocketHub:
    """
    Central hub for Dream Window WebSocket connections.

    H.264 video frames from the GPU are passed through directly to all
    viewers with no intermediate buffering. The browser's VideoDecoder
    handles its own buffering natively, eliminating the need for the
    server-side playback queue.

    I-frames (video keyframes) are cached so late-joining viewers can
    start decoding immediately.
    """

    def __init__(
        self,
        frame_cache: FrameCache,
        presence_tracker: ViewerPresenceTracker,
    ):
        self.frame_cache = frame_cache
        self.presence = presence_tracker

        self._viewers: Set[WebSocket] = set()
        self._channels: Dict[WebSocket, _ViewerChannel] = {}
        self._gpu_websocket: Optional[WebSocket] = None
        self._lock = asyncio.Lock()

        # Status tracking
        self._status = "idle"
        self._status_message = "Waiting for connection..."
        self._last_frame_time: float = 0

        # Frame numbering counter
        self._next_frame_number: int = 1

        # Current prompt (updated with each keyframe from GPU)
        self._current_prompt: Optional[str] = None

        # I-frame cache for late-joining viewers
        self._last_keyframe_nal: Optional[bytes] = None
        self._last_keyframe_meta: Optional[dict] = None

        # MPEG-TS muxer for /api/dreams/stream endpoint
        self._mpegts_muxer = None
        try:
            from .mpegts_muxer import MpegTSMuxer
            self._mpegts_muxer = MpegTSMuxer(width=1024, height=512, fps=17.0)
            logger.info("MPEG-TS muxer initialized for /api/dreams/stream")
        except Exception as e:
            logger.warning(f"MPEG-TS muxer unavailable: {e}")

    @property
    def viewer_count(self) -> int:
        return len(self._viewers)

    @property
    def gpu_connected(self) -> bool:
        return self._gpu_websocket is not None

    @property
    def status(self) -> str:
        return self._status

    def set_status(self, status: str, message: str = "") -> None:
        """Update status and optionally broadcast to viewers."""
        self._status = status
        self._status_message = message
        logger.info(f"Status changed: {status} - {message}")

    # ==================== Viewer Connections ====================

    @property
    def stream_live(self) -> bool:
        return self._last_frame_time > 0 and time.time() - self._last_frame_time < STREAM_LIVE_SECONDS

    async def connect_viewer(self, websocket: WebSocket) -> bool:
        """
        Handle a new browser viewer connection. Returns False (socket closed)
        when the viewer cap is reached.
        """
        await websocket.accept()

        async with self._lock:
            at_capacity = MAX_VIEWERS > 0 and len(self._channels) >= MAX_VIEWERS
            if not at_capacity:
                # While the stream is live, start the viewer at the next live
                # I-frame (<= ~2 s): the cached I-frame would be followed by
                # P-frames that reference frames this viewer never got (smear).
                live = self.stream_live
                channel = _ViewerChannel(websocket, self, needs_keyframe=live)
                self._channels[websocket] = channel
                self._viewers.add(websocket)

        if at_capacity:
            logger.info(f"Viewer refused: at capacity ({MAX_VIEWERS})")
            try:
                await asyncio.wait_for(websocket.send_json({
                    "type": "status",
                    "status": "full",
                    "message": "the dream is full right now — trying again in a minute",
                }), timeout=5.0)
                await websocket.close(code=CLOSE_AT_CAPACITY, reason="at capacity")
            except Exception:
                pass
            return False

        # Track presence (may trigger GPU start)
        await self.presence.on_viewer_connect(websocket)

        # Send current status
        await self._send_status_to_viewer(websocket)

        # Stream not live (GPU resting/restarting): show the last I-frame as a
        # still so the page isn't blank.
        if not live and self._last_keyframe_nal:
            meta_msg = {
                "type": "frame_meta",
                **(self._last_keyframe_meta or {}),
                "vk": True,
            }
            channel.offer_frame(json.dumps(meta_msg), bytes([MSG_FRAME]) + self._last_keyframe_nal, True)
        return True

    async def disconnect_viewer(self, websocket: WebSocket) -> None:
        """Handle viewer disconnection (idempotent)."""
        async with self._lock:
            channel = self._channels.pop(websocket, None)
            self._viewers.discard(websocket)

        if channel is not None:
            channel.stop()
            await self.presence.on_viewer_disconnect(websocket)

    async def _drop_viewer(self, websocket: WebSocket, code: int, reason: str) -> None:
        """Remove a viewer and close its socket, so its page reconnects."""
        await self.disconnect_viewer(websocket)
        try:
            await websocket.close(code=code, reason=reason)
        except Exception:
            pass

    async def handle_viewer_message(self, websocket: WebSocket, data: str) -> None:
        """Handle message from viewer."""
        try:
            msg = json.loads(data)
            msg_type = msg.get("type")

            if msg_type == "ping":
                # Through the viewer's queue: its sender task owns the socket's send side.
                channel = self._channels.get(websocket)
                if channel is not None:
                    channel.offer_text('{"type": "pong"}')

        except json.JSONDecodeError:
            logger.warning(f"Invalid JSON from viewer: {data[:100]}")

    async def _send_status_to_viewer(self, websocket: WebSocket) -> None:
        """Queue the current status for a specific viewer."""
        channel = self._channels.get(websocket)
        if channel is None:
            return
        channel.offer_text(json.dumps({
            "type": "status",
            "status": self._status,
            "message": self._status_message,
            "frame_count": self.frame_cache.total_frames_received,
            "viewer_count": self.viewer_count,
        }))

    async def broadcast_status(self, status: str, message: str) -> None:
        """Broadcast status update to all viewers."""
        self.set_status(status, message)

        status_msg = {
            "type": "status",
            "status": status,
            "message": message,
            "frame_count": self.frame_cache.total_frames_received,
            "viewer_count": self.viewer_count,
        }

        await self._broadcast_json(status_msg)

    async def _broadcast_config(self, target_fps: float) -> None:
        """Broadcast playback config to all viewers."""
        config_msg = {
            "type": "config",
            "target_fps": target_fps,
        }

        await self._broadcast_json(config_msg)
        logger.debug(f"Broadcast config to {self.viewer_count} viewers: {target_fps} FPS")

    # ==================== GPU Connection ====================

    async def connect_gpu(self, websocket: WebSocket) -> None:
        """
        Handle GPU worker connection.

        Only one GPU connection is allowed at a time.
        On connect, sends any saved state to GPU for restoration.
        """
        await websocket.accept()

        replacing = self._gpu_websocket is not None
        if replacing:
            logger.warning("GPU already connected — replacing stale connection with new one")
            old_ws = self._gpu_websocket
            self._gpu_websocket = None
            try:
                await old_ws.close(code=4001, reason="Replaced by new GPU connection")
            except Exception:
                pass
            self.presence.set_gpu_running(False)
            logger.info("Stale GPU connection cleaned up")

        self._gpu_websocket = websocket
        self.presence.set_gpu_running(True)

        if not replacing:
            self.frame_cache.reset_session()
            self._next_frame_number = 1
            self._last_keyframe_nal = None
            self._last_keyframe_meta = None

        logger.info("GPU connected")

        # No saved state is pushed back to the GPU any more: it resumes from
        # its own local checkpoint (dream_gen SPEC-resume), and it read this
        # message type (0x11) as RESUME and discarded the payload, while the
        # send held "ready" back by up to 30 s on every reconnect.

        await self.broadcast_status("ready", "Dreams flowing...")

    async def disconnect_gpu(self) -> None:
        """Handle GPU disconnection."""
        self._gpu_websocket = None
        self.presence.set_gpu_running(False)

        logger.info("GPU disconnected")
        await self.broadcast_status("idle", "Dream machine sleeping...")

    async def handle_gpu_message(self, data: bytes) -> None:
        """
        Handle binary message from GPU.

        Args:
            data: Binary message (type byte + optional payload)
        """
        if len(data) < 1:
            return

        msg_type = data[0]
        payload = data[1:] if len(data) > 1 else b""

        if msg_type == MSG_FRAME:
            await self._handle_gpu_frame(payload)

        elif msg_type == MSG_STATE:
            await self._handle_gpu_state(payload)

        elif msg_type == MSG_HEARTBEAT:
            self._last_frame_time = time.time()

        elif msg_type == MSG_CHRONICLE:
            # Fire-and-forget: ingest never raises and runs its DB/disk
            # work in a thread, so the stream hub is never blocked.
            from .chronicle import get_chronicle_store
            await get_chronicle_store().ingest(payload)

        elif msg_type == MSG_STATUS:
            try:
                status = json.loads(payload.decode())
                logger.debug(f"GPU status: {status}")

                if "target_fps" in status:
                    target_fps = float(status["target_fps"])
                    logger.info(f"GPU configured target FPS: {target_fps}")
                    await self._broadcast_config(target_fps)
            except Exception as e:
                logger.warning(f"Failed to parse GPU status: {e}")

    async def _handle_gpu_frame(self, payload: bytes) -> None:
        """
        Handle H.264 video frame from GPU — parse metadata and pass through
        directly to all viewers.

        Frame format: metadata_len (4B BE) | JSON metadata | H.264 NAL data

        No buffering or pacing — the browser's VideoDecoder handles that.
        I-frames are cached for late-joining viewers.
        """
        self._last_frame_time = time.time()

        # Parse metadata
        frame_number = self._next_frame_number
        keyframe_number = 0
        prompt = None
        is_video_keyframe = False
        nal_data = payload

        if len(payload) > 4:
            # Check if first bytes look like a length prefix (not RIFF header)
            first_four = payload[:4]
            if first_four != b'RIFF':
                try:
                    metadata_len = int.from_bytes(first_four, 'big')

                    if 0 < metadata_len < len(payload) - 4:
                        metadata_bytes = payload[4:4 + metadata_len]
                        nal_data = payload[4 + metadata_len:]

                        metadata = json.loads(metadata_bytes.decode('utf-8'))
                        frame_number = metadata.get('fn', frame_number)
                        keyframe_number = metadata.get('kf', 0)
                        is_video_keyframe = metadata.get('vk', False)

                        if 'p' in metadata and isinstance(metadata['p'], str):
                            self._current_prompt = metadata['p']
                            prompt = metadata['p']
                            logger.debug(f"Frame {frame_number} prompt: {prompt[:60]}...")
                except Exception as e:
                    if nal_data is payload:
                        logger.debug(f"Metadata parse failed, using raw payload: {e}")
                    else:
                        logger.warning(f"Error after frame extraction (data preserved): {e}")

        # Update frame counter
        if frame_number == self._next_frame_number:
            self._next_frame_number += 1
        else:
            self._next_frame_number = frame_number + 1

        # Cache I-frame for late joiners
        if is_video_keyframe:
            self._last_keyframe_nal = nal_data
            meta_for_cache: dict = {
                "fn": frame_number,
                "kf": keyframe_number,
            }
            if prompt or self._current_prompt:
                meta_for_cache["p"] = prompt or self._current_prompt
            self._last_keyframe_meta = meta_for_cache

        # Update stats (rolling FPS, byte counters)
        self.frame_cache.record_frame(
            size_bytes=len(nal_data),
            frame_number=frame_number,
            keyframe_number=keyframe_number,
        )

        # Feed to MPEG-TS muxer for /api/dreams/stream
        if self._mpegts_muxer:
            try:
                self._mpegts_muxer.feed_nal(nal_data, is_video_keyframe)
            except Exception as e:
                logger.warning(f"MPEG-TS feed error: {e}")

        # Pass through directly to all viewers (no buffering)
        await self._broadcast_video_frame(
            nal_data, frame_number, keyframe_number,
            prompt or self._current_prompt, is_video_keyframe
        )

    async def _handle_gpu_state(self, state_data: bytes) -> None:
        """Handle state snapshot from GPU — persist to disk for recovery."""
        from .state_storage import save_state

        logger.debug(f"Received state snapshot: {len(state_data)} bytes")

        saved = await save_state(state_data)
        if saved:
            logger.debug("State persisted to disk")
        else:
            logger.warning("Failed to persist state to disk")

    # ==================== Broadcasting ====================

    async def _broadcast_video_frame(
        self,
        nal_data: bytes,
        frame_number: int = 0,
        keyframe_number: int = 0,
        prompt: Optional[str] = None,
        is_video_keyframe: bool = False,
    ) -> None:
        """
        Broadcast H.264 video frame to all connected viewers.

        Sends a JSON metadata message followed by the binary NAL data.
        The metadata includes the video keyframe flag so the client's
        VideoDecoder knows whether this is an I-frame or P-frame.
        """
        if not self._channels:
            return

        meta_msg: dict = {
            "type": "frame_meta",
            "fn": frame_number,
            "kf": keyframe_number,
            "vk": is_video_keyframe,
        }
        if prompt:
            meta_msg["p"] = prompt

        # Encoded once, queued per viewer without awaiting anyone.
        meta_text = json.dumps(meta_msg)
        frame_message = bytes([MSG_FRAME]) + nal_data
        for channel in list(self._channels.values()):
            channel.offer_frame(meta_text, frame_message, is_video_keyframe)

    async def _broadcast_json(self, data: dict) -> None:
        """Broadcast JSON message to all viewers (queued, never blocking)."""
        if not self._channels:
            return
        text = json.dumps(data)
        for channel in list(self._channels.values()):
            channel.offer_text(text)

    # ==================== GPU Control ====================

    async def send_to_gpu(self, msg_type: int, payload: bytes = b"") -> bool:
        """Send control message to GPU."""
        if not self._gpu_websocket:
            return False

        try:
            await asyncio.wait_for(
                self._gpu_websocket.send_bytes(bytes([msg_type]) + payload),
                timeout=10.0
            )
            return True
        except asyncio.TimeoutError:
            logger.error("Timeout sending to GPU")
            return False
        except Exception as e:
            logger.error(f"Failed to send to GPU: {e}")
            return False

    # (request_gpu_shutdown removed: nothing called it, and the GPU would obey
    # it. The dream's lifecycle belongs to its scheduler, not the web server.)

    async def request_gpu_save_state(self) -> bool:
        """Request GPU to save current state."""
        return await self.send_to_gpu(CTRL_SAVE_STATE)

    # ==================== Statistics ====================

    def get_stats(self) -> dict:
        """Get hub statistics."""
        cache_stats = self.frame_cache.get_stats()
        presence_stats = self.presence.get_status()

        return {
            "status": self._status,
            "status_message": self._status_message,
            "viewer_count": self.viewer_count,
            "gpu_connected": self.gpu_connected,
            "last_frame_age_seconds": round(time.time() - self._last_frame_time, 1) if self._last_frame_time > 0 else None,
            "has_video_keyframe": self._last_keyframe_nal is not None,
            **cache_stats,
            **presence_stats,
        }
