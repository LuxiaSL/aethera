"""
Frame Playback Queue - Smooth frame pacing for viewers

Receives frames from GPU at variable intervals (network jitter),
releases them to viewers at steady FPS for smooth playback.

Design:
- GPU sends frames → queue
- Playback loop runs at (target_fps - cushion) for buffer building
- Waits for minimum buffer before starting playback
- On underrun: holds last frame (no stutter, just freeze)
- On overrun: drops oldest frames (stay "live")
"""

import asyncio
import logging
import time
from collections import deque
from dataclasses import dataclass
from typing import Optional, Callable, Awaitable

logger = logging.getLogger(__name__)


@dataclass
class PlaybackFrame:
    """A frame waiting in the playback queue"""
    data: bytes
    frame_number: int
    received_at: float


class FramePlaybackQueue:
    """
    Smooth frame pacing for WebSocket broadcast
    
    Usage:
        queue = FramePlaybackQueue(
            broadcast_callback=hub._broadcast_frame,
            on_frame_displayed=frame_cache.add_frame
        )
        
        # When GPU sends frame
        await queue.add_frame(frame_data, frame_number)
        
        # Start playback (runs until stopped)
        asyncio.create_task(queue.run())
    """
    
    # Playback configuration
    DEFAULT_TARGET_FPS = 5.0
    FPS_CUSHION = 0.3  # Play slightly slower to build buffer
    MIN_BUFFER_FRAMES = 5  # Wait for 1 second of buffer before starting
    MAX_QUEUE_SIZE = 50  # ~10 seconds at 5 FPS, prevents memory growth
    OVERRUN_TRIM_TO = 30  # When max reached, trim to this many frames
    
    def __init__(
        self,
        broadcast_callback: Callable[[bytes], Awaitable[None]],
        on_frame_displayed: Optional[Callable[[bytes, int], Awaitable[None]]] = None,
    ):
        """
        Initialize playback queue
        
        Args:
            broadcast_callback: Async function to broadcast frame to viewers
            on_frame_displayed: Optional callback when frame is displayed (for cache)
        """
        self.broadcast_callback = broadcast_callback
        self.on_frame_displayed = on_frame_displayed
        
        # Queue
        self._queue: deque[PlaybackFrame] = deque()
        self._last_frame: Optional[PlaybackFrame] = None
        
        # Playback state
        self._target_fps = self.DEFAULT_TARGET_FPS
        self._running = False
        self._playback_started = False
        self._playback_task: Optional[asyncio.Task] = None
        
        # Statistics
        self._frames_received = 0
        self._frames_displayed = 0
        self._frames_dropped = 0
        self._underruns = 0
        self._playback_start_time: Optional[float] = None
        self._last_display_time: Optional[float] = None
    
    @property
    def target_fps(self) -> float:
        return self._target_fps
    
    @target_fps.setter
    def target_fps(self, fps: float) -> None:
        """Set target FPS (from GPU configuration)"""
        if fps > 0:
            old_fps = self._target_fps
            self._target_fps = fps
            logger.info(f"Playback FPS updated: {old_fps} → {fps}")
    
    @property
    def effective_fps(self) -> float:
        """Actual playback FPS (slightly slower than target for cushion)"""
        return max(1.0, self._target_fps - self.FPS_CUSHION)
    
    @property
    def queue_depth(self) -> int:
        return len(self._queue)
    
    @property
    def buffer_seconds(self) -> float:
        """Seconds of content in buffer"""
        if self._target_fps <= 0:
            return 0.0
        return len(self._queue) / self._target_fps
    
    async def add_frame(self, data: bytes, frame_number: int) -> None:
        """
        Add a frame to the playback queue
        
        Args:
            data: Frame image data (WebP/JPEG bytes)
            frame_number: Sequential frame number
        """
        frame = PlaybackFrame(
            data=data,
            frame_number=frame_number,
            received_at=time.time()
        )
        
        self._queue.append(frame)
        self._frames_received += 1
        
        # Handle overrun - drop oldest frames to stay "live"
        if len(self._queue) > self.MAX_QUEUE_SIZE:
            dropped = len(self._queue) - self.OVERRUN_TRIM_TO
            for _ in range(dropped):
                self._queue.popleft()
            self._frames_dropped += dropped
            logger.warning(
                f"Playback overrun: dropped {dropped} frames, "
                f"queue now {len(self._queue)} frames"
            )
        
        # Log queue status periodically
        if self._frames_received % 50 == 0:
            logger.info(
                f"[PLAYBACK] Queue: {len(self._queue)} frames "
                f"({self.buffer_seconds:.1f}s buffer), "
                f"received: {self._frames_received}, displayed: {self._frames_displayed}"
            )
    
    async def run(self) -> None:
        """
        Main playback loop
        
        Runs continuously, releasing frames at steady FPS.
        Call stop() to terminate.
        """
        self._running = True
        self._playback_started = False
        logger.info(
            f"Playback queue started: target {self._target_fps} FPS, "
            f"effective {self.effective_fps:.1f} FPS (with cushion)"
        )
        
        while self._running:
            try:
                # Wait for minimum buffer before starting
                if not self._playback_started:
                    if len(self._queue) >= self.MIN_BUFFER_FRAMES:
                        self._playback_started = True
                        self._playback_start_time = time.time()
                        logger.info(
                            f"Playback starting: {len(self._queue)} frames buffered "
                            f"({self.buffer_seconds:.1f}s)"
                        )
                    else:
                        # Still buffering, wait a bit
                        await asyncio.sleep(0.1)
                        continue
                
                # Calculate frame interval
                interval = 1.0 / self.effective_fps
                
                # Time the display
                display_start = time.time()
                
                if self._queue:
                    # Pop and display next frame
                    frame = self._queue.popleft()
                    self._last_frame = frame
                    
                    # Broadcast to viewers
                    await self.broadcast_callback(frame.data)
                    
                    # Notify cache if callback provided
                    if self.on_frame_displayed:
                        try:
                            await self.on_frame_displayed(frame.data, frame.frame_number)
                        except Exception as e:
                            logger.warning(f"Frame displayed callback failed: {e}")
                    
                    self._frames_displayed += 1
                    self._last_display_time = time.time()
                    
                else:
                    # Underrun - queue empty
                    # Just wait, don't broadcast (holds last frame on client)
                    self._underruns += 1
                    if self._underruns == 1 or self._underruns % 10 == 0:
                        logger.warning(
                            f"Playback underrun #{self._underruns}: queue empty, "
                            f"holding last frame"
                        )
                
                # Sleep for remainder of interval
                elapsed = time.time() - display_start
                sleep_time = max(0, interval - elapsed)
                await asyncio.sleep(sleep_time)
                
            except asyncio.CancelledError:
                logger.info("Playback loop cancelled")
                break
            except Exception as e:
                logger.error(f"Playback loop error: {e}", exc_info=True)
                await asyncio.sleep(0.5)
        
        logger.info("Playback queue stopped")
    
    def stop(self) -> None:
        """Stop the playback loop"""
        self._running = False
        if self._playback_task and not self._playback_task.done():
            self._playback_task.cancel()
    
    def clear(self) -> None:
        """Clear the queue (e.g., on GPU disconnect)"""
        self._queue.clear()
        self._playback_started = False
        logger.info("Playback queue cleared")
    
    def reset(self) -> None:
        """Full reset (e.g., on GPU reconnect)"""
        self.clear()
        self._frames_received = 0
        self._frames_displayed = 0
        self._frames_dropped = 0
        self._underruns = 0
        self._playback_start_time = None
        self._last_display_time = None
        logger.info("Playback queue reset")
    
    def get_stats(self) -> dict:
        """Get playback statistics"""
        now = time.time()
        
        # Calculate actual display FPS
        if self._playback_start_time and self._frames_displayed > 0:
            elapsed = now - self._playback_start_time
            actual_fps = self._frames_displayed / elapsed if elapsed > 0 else 0
        else:
            actual_fps = 0
        
        return {
            "queue_depth": len(self._queue),
            "buffer_seconds": round(self.buffer_seconds, 2),
            "target_fps": self._target_fps,
            "effective_fps": round(self.effective_fps, 2),
            "actual_fps": round(actual_fps, 2),
            "frames_received": self._frames_received,
            "frames_displayed": self._frames_displayed,
            "frames_dropped": self._frames_dropped,
            "underruns": self._underruns,
            "playback_started": self._playback_started,
        }

