"""
Frame Cache — Stream statistics and metrics for Dream Window

With H.264 video streaming, individual frames are no longer stored.
This module tracks stream statistics (FPS, byte counts, frame numbers)
and provides the data for the /api/dreams/status endpoint.

The I-frame cache for late-joining viewers is handled by
DreamWebSocketHub directly (simpler than routing through here).
"""

import asyncio
import time
from typing import Optional
from collections import deque


class FrameCache:
    """
    Stream statistics tracker for Dream Window.

    Tracks FPS, frame counts, and byte counters for the H.264 video stream.
    No longer stores individual frame data — that's unnecessary with
    video streaming where the encoder handles temporal state.
    """

    def __init__(self, max_frames: int = 30, state_dir=None):
        """
        Initialize frame cache / stats tracker.

        Args:
            max_frames: Unused (kept for API compatibility). Previously was
                       the max number of image frames to cache.
            state_dir: Unused (kept for API compatibility).
        """
        self._lock = asyncio.Lock()

        # Statistics
        self.total_frames_received = 0
        self.total_bytes_received = 0
        self.start_time = time.time()

        # Rolling FPS calculation
        self._fps_window_seconds = 30.0
        self._frame_timestamps: deque[float] = deque()
        self._session_start_time: Optional[float] = None
        self._session_frames = 0

        # Current frame tracking (for status endpoint)
        self._current_frame_number = 0
        self._current_keyframe_number = 0

    def record_frame(
        self,
        size_bytes: int,
        frame_number: int = 0,
        keyframe_number: int = 0,
    ) -> None:
        """
        Record a frame receipt for stats tracking.

        Called by the WebSocket hub for every frame received from GPU.
        This is synchronous (no lock needed — called from single async context).

        Args:
            size_bytes: Size of the H.264 NAL data
            frame_number: Sequential frame number
            keyframe_number: Current generation keyframe number
        """
        self.total_frames_received += 1
        self.total_bytes_received += size_bytes
        self._session_frames += 1
        self._current_frame_number = frame_number
        self._current_keyframe_number = keyframe_number

        now = time.time()
        self._frame_timestamps.append(now)

        if self._session_start_time is None:
            self._session_start_time = now

        # Prune old timestamps
        cutoff = now - self._fps_window_seconds
        while self._frame_timestamps and self._frame_timestamps[0] < cutoff:
            self._frame_timestamps.popleft()

    def reset_session(self) -> None:
        """Reset session stats (call when GPU connects)."""
        self._session_start_time = None
        self._session_frames = 0
        self._frame_timestamps.clear()

    def get_stats(self) -> dict:
        """Get stream statistics."""
        now = time.time()
        uptime = now - self.start_time

        # Rolling FPS: frames in the last N seconds
        if len(self._frame_timestamps) >= 2:
            window_span = self._frame_timestamps[-1] - self._frame_timestamps[0]
            rolling_fps = (len(self._frame_timestamps) - 1) / window_span if window_span > 0 else 0.0
        else:
            rolling_fps = 0.0

        # Session FPS: frames since GPU connected
        if self._session_start_time and self._session_frames > 0:
            session_time = now - self._session_start_time
            session_fps = self._session_frames / session_time if session_time > 0 else 0.0
        else:
            session_fps = 0.0

        return {
            "total_frames_received": self.total_frames_received,
            "total_bytes_received": self.total_bytes_received,
            "average_fps": round(rolling_fps, 2),
            "session_fps": round(session_fps, 2),
            "uptime_seconds": round(uptime, 1),
            "current_frame_number": self._current_frame_number,
            "current_keyframe_number": self._current_keyframe_number,
            "stream_format": "h264",
        }

    # ==================== Compatibility stubs ====================
    # These methods existed when FrameCache stored image frames.
    # They're kept as no-ops so callers don't break during transition.

    async def get_current_frame(self):
        """No longer stores frames. Returns None."""
        return None

    async def get_current_frame_data(self) -> Optional[bytes]:
        """No longer stores frames. Returns None."""
        return None

    async def get_recent_frames(self, count: int = 10) -> list:
        """No longer stores frames. Returns empty list."""
        return []

    async def clear(self) -> None:
        """Clear stats."""
        self.total_frames_received = 0
        self.total_bytes_received = 0
        self._current_frame_number = 0
        self._current_keyframe_number = 0
        self._frame_timestamps.clear()

    async def add_frame(self, **kwargs) -> None:
        """No-op compatibility stub. Use record_frame() instead."""
        pass
