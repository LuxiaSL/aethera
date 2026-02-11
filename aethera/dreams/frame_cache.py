"""
Frame Cache - Storage and serving of dream frames

Maintains a rolling buffer of recent frames for:
- Immediate display to newly connected viewers
- API access to current frame
- Fallback during brief GPU disconnections
"""

import asyncio
import time
from pathlib import Path
from typing import Optional
from dataclasses import dataclass, field
from collections import deque


@dataclass
class CachedFrame:
    """A single cached frame with metadata"""
    data: bytes
    frame_number: int
    keyframe_number: int
    timestamp: float = field(default_factory=time.time)
    generation_time_ms: int = 0
    prompt: Optional[str] = None


class FrameCache:
    """
    Thread-safe frame cache for Dream Window
    
    Stores recent frames in memory for quick access.
    Provides the current frame for API requests and new WebSocket connections.
    """
    
    def __init__(self, max_frames: int = 30, state_dir: Optional[Path] = None):
        """
        Initialize frame cache
        
        Args:
            max_frames: Maximum number of frames to keep in memory
            state_dir: Directory for persisting state (optional)
        """
        self.max_frames = max_frames
        self.state_dir = state_dir
        
        self._frames: deque[CachedFrame] = deque(maxlen=max_frames)
        self._current_frame: Optional[CachedFrame] = None
        self._lock = asyncio.Lock()
        
        # Statistics
        self.total_frames_received = 0
        self.total_bytes_received = 0
        self.start_time = time.time()
        
        # Rolling FPS calculation (tracks frames in last N seconds)
        self._fps_window_seconds = 30.0  # Calculate FPS over last 30 seconds
        self._frame_timestamps: deque[float] = deque()  # Timestamps of recent frames
        self._session_start_time: Optional[float] = None  # Reset when GPU connects
        self._session_frames = 0  # Frames in current session
    
    async def add_frame(
        self,
        data: bytes,
        frame_number: int,
        keyframe_number: int = 0,
        generation_time_ms: int = 0,
        prompt: Optional[str] = None
    ) -> None:
        """
        Add a new frame to the cache
        
        Args:
            data: WebP frame data
            frame_number: Sequential frame number (server-authoritative)
            keyframe_number: Which keyframe this relates to
            generation_time_ms: How long generation took
            prompt: Prompt text for the current keyframe
        """
        frame = CachedFrame(
            data=data,
            frame_number=frame_number,
            keyframe_number=keyframe_number,
            generation_time_ms=generation_time_ms,
            prompt=prompt
        )
        
        async with self._lock:
            self._frames.append(frame)
            self._current_frame = frame
            
            self.total_frames_received += 1
            self.total_bytes_received += len(data)
            
            # Track for rolling FPS calculation
            now = time.time()
            self._frame_timestamps.append(now)
            self._session_frames += 1
            
            # Start session timer on first frame
            if self._session_start_time is None:
                self._session_start_time = now
            
            # Prune old timestamps (keep only last N seconds)
            cutoff = now - self._fps_window_seconds
            while self._frame_timestamps and self._frame_timestamps[0] < cutoff:
                self._frame_timestamps.popleft()
    
    async def get_current_frame(self) -> Optional[CachedFrame]:
        """Get the most recent frame"""
        async with self._lock:
            return self._current_frame
    
    async def get_current_frame_data(self) -> Optional[bytes]:
        """Get just the frame data (for API responses)"""
        frame = await self.get_current_frame()
        return frame.data if frame else None
    
    async def get_recent_frames(self, count: int = 10) -> list[CachedFrame]:
        """Get the N most recent frames"""
        async with self._lock:
            return list(self._frames)[-count:]
    
    def get_stats(self) -> dict:
        """Get cache statistics"""
        now = time.time()
        uptime = now - self.start_time
        
        # Rolling FPS: frames in the last N seconds
        if len(self._frame_timestamps) >= 2:
            # Time span of frames in window
            window_span = self._frame_timestamps[-1] - self._frame_timestamps[0]
            if window_span > 0:
                rolling_fps = (len(self._frame_timestamps) - 1) / window_span
            else:
                rolling_fps = 0.0
        else:
            rolling_fps = 0.0
        
        # Session FPS: frames since GPU connected
        if self._session_start_time and self._session_frames > 0:
            session_time = now - self._session_start_time
            session_fps = self._session_frames / session_time if session_time > 0 else 0.0
        else:
            session_fps = 0.0
        
        return {
            "frames_cached": len(self._frames),
            "max_frames": self.max_frames,
            "total_frames_received": self.total_frames_received,
            "total_bytes_received": self.total_bytes_received,
            "average_fps": round(rolling_fps, 2),  # Now uses rolling window
            "session_fps": round(session_fps, 2),  # FPS since GPU connected
            "uptime_seconds": round(uptime, 1),
            "current_frame_number": self._current_frame.frame_number if self._current_frame else 0,
            "current_keyframe_number": self._current_frame.keyframe_number if self._current_frame else 0,
        }
    
    async def clear(self) -> None:
        """Clear all cached frames"""
        async with self._lock:
            self._frames.clear()
            self._current_frame = None
    
    def reset_session(self) -> None:
        """Reset session stats (call when GPU connects)"""
        self._session_start_time = None
        self._session_frames = 0
        self._frame_timestamps.clear()


