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
"""

import asyncio
import json
import logging
import time
from typing import Optional, Set
from fastapi import WebSocket, WebSocketDisconnect

from .frame_cache import FrameCache
from .presence import ViewerPresenceTracker

logger = logging.getLogger(__name__)

# Message type bytes (GPU -> VPS)
MSG_FRAME = 0x01
MSG_STATE = 0x02
MSG_HEARTBEAT = 0x03
MSG_STATUS = 0x04

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

    async def connect_viewer(self, websocket: WebSocket) -> None:
        """Handle a new browser viewer connection."""
        await websocket.accept()

        async with self._lock:
            self._viewers.add(websocket)

        # Track presence (may trigger GPU start)
        await self.presence.on_viewer_connect(websocket)

        # Send current status
        await self._send_status_to_viewer(websocket)

        # Send cached I-frame so viewer can start decoding immediately
        if self._last_keyframe_nal:
            try:
                meta_msg = {
                    "type": "frame_meta",
                    **(self._last_keyframe_meta or {}),
                    "vk": True,
                }
                await asyncio.wait_for(websocket.send_json(meta_msg), timeout=5.0)
                await asyncio.wait_for(
                    websocket.send_bytes(
                        bytes([MSG_FRAME]) + self._last_keyframe_nal
                    ),
                    timeout=5.0
                )
            except (asyncio.TimeoutError, Exception) as e:
                logger.warning(f"Failed to send initial I-frame: {e}")

    async def disconnect_viewer(self, websocket: WebSocket) -> None:
        """Handle viewer disconnection."""
        async with self._lock:
            self._viewers.discard(websocket)

        await self.presence.on_viewer_disconnect(websocket)

    async def handle_viewer_message(self, websocket: WebSocket, data: str) -> None:
        """Handle message from viewer."""
        try:
            msg = json.loads(data)
            msg_type = msg.get("type")

            if msg_type == "ping":
                await websocket.send_json({"type": "pong"})

        except json.JSONDecodeError:
            logger.warning(f"Invalid JSON from viewer: {data[:100]}")

    async def _send_status_to_viewer(self, websocket: WebSocket) -> None:
        """Send current status to a specific viewer."""
        try:
            await asyncio.wait_for(
                websocket.send_json({
                    "type": "status",
                    "status": self._status,
                    "message": self._status_message,
                    "frame_count": self.frame_cache.total_frames_received,
                    "viewer_count": self.viewer_count,
                }),
                timeout=5.0
            )
        except (asyncio.TimeoutError, Exception) as e:
            logger.warning(f"Failed to send status: {e}")

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

        # Send saved state if available (for resume after pod restart)
        await self._send_saved_state_to_gpu(websocket)

        await self.broadcast_status("ready", "Dreams flowing...")

    async def _send_saved_state_to_gpu(self, websocket: WebSocket) -> None:
        """Send any saved state to GPU for restoration."""
        from .state_storage import load_state, get_state_info

        try:
            state_info = await get_state_info()
            if state_info is None:
                logger.info("No saved state to restore")
                return

            saved_state = await load_state()
            if saved_state is None:
                logger.warning("State metadata exists but load failed")
                return

            logger.info(f"Sending saved state to GPU: {len(saved_state)} bytes (age: {state_info.get('age_seconds', '?')}s)")
            await asyncio.wait_for(
                websocket.send_bytes(bytes([CTRL_LOAD_STATE]) + saved_state),
                timeout=30.0
            )
            logger.info("Saved state sent to GPU for restoration")

        except asyncio.TimeoutError:
            logger.error("Timeout sending saved state to GPU")
        except Exception as e:
            logger.error(f"Failed to send saved state to GPU: {e}")

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
        if not self._viewers:
            return

        meta_msg: dict = {
            "type": "frame_meta",
            "fn": frame_number,
            "kf": keyframe_number,
            "vk": is_video_keyframe,
        }
        if prompt:
            meta_msg["p"] = prompt

        frame_message = bytes([MSG_FRAME]) + nal_data
        dead_viewers: set[WebSocket] = set()

        async with self._lock:
            viewers = set(self._viewers)

        for viewer in viewers:
            try:
                await asyncio.wait_for(viewer.send_json(meta_msg), timeout=5.0)
                await asyncio.wait_for(viewer.send_bytes(frame_message), timeout=5.0)
            except (asyncio.TimeoutError, Exception):
                dead_viewers.add(viewer)

        if dead_viewers:
            async with self._lock:
                self._viewers -= dead_viewers

            for viewer in dead_viewers:
                await self.presence.on_viewer_disconnect(viewer)

    async def _broadcast_json(self, data: dict) -> None:
        """Broadcast JSON message to all viewers."""
        if not self._viewers:
            return

        dead_viewers: set[WebSocket] = set()

        async with self._lock:
            viewers = set(self._viewers)

        for viewer in viewers:
            try:
                await asyncio.wait_for(viewer.send_json(data), timeout=5.0)
            except (asyncio.TimeoutError, Exception):
                dead_viewers.add(viewer)

        if dead_viewers:
            async with self._lock:
                self._viewers -= dead_viewers

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

    async def request_gpu_shutdown(self) -> bool:
        """Request GPU to save state and shutdown."""
        return await self.send_to_gpu(CTRL_SHUTDOWN)

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
