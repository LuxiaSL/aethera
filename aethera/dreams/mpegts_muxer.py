"""
MPEG-TS Live Muxer

Wraps H.264 NAL units into MPEG-TS packets for HTTP streaming.
External players connect to GET /api/dreams/stream and receive
continuous MPEG-TS via chunked transfer encoding.

Uses PyAV to mux H.264 into MPEG-TS format. Each NAL unit from
the WebSocket is remuxed (not re-encoded) into TS packets and
pushed to all connected HTTP consumers.

Design:
- Single muxer instance fed by DreamWebSocketHub
- Multiple HTTP consumers read from a shared ring buffer
- Each consumer tracks its own read position via asyncio.Event
- I-frame: new consumers start from the latest I-frame
"""

import asyncio
import io
import logging
import time
from collections import deque
from dataclasses import dataclass, field
from fractions import Fraction
from typing import Optional, AsyncGenerator

logger = logging.getLogger(__name__)

try:
    import av
    HAS_AV = True
except ImportError:
    HAS_AV = False
    logger.warning("PyAV not available — MPEG-TS streaming disabled")


@dataclass
class TSSegment:
    """A chunk of MPEG-TS data ready for HTTP consumers."""
    data: bytes
    sequence: int
    is_keyframe: bool
    timestamp: float = field(default_factory=time.time)


class MpegTSMuxer:
    """
    Muxes H.264 NAL units into MPEG-TS format for HTTP streaming.

    Fed by DreamWebSocketHub._handle_gpu_frame().
    Read by /api/dreams/stream HTTP endpoint via consume().
    """

    def __init__(self, width: int = 1024, height: int = 512, fps: float = 17.0):
        if not HAS_AV:
            raise RuntimeError("PyAV is required for MPEG-TS streaming: pip install av")

        self.width = width
        self.height = height
        self.fps = fps

        # Ring buffer of TS segments
        self._segments: deque[TSSegment] = deque(maxlen=600)  # ~35s at 17fps
        self._sequence: int = 0

        # Consumers waiting for new data
        self._waiters: list[asyncio.Event] = []

        # PyAV muxer state — recreated per I-frame group to keep segments independent
        self._init_muxer()

        self._frame_count = 0
        logger.info(f"MpegTSMuxer initialized: {width}x{height} @ {fps}fps")

    def _init_muxer(self) -> None:
        """Initialize (or reinitialize) the PyAV MPEG-TS muxer."""
        self._output = io.BytesIO()
        self._container = av.open(self._output, mode='w', format='mpegts')
        self._stream = self._container.add_stream('h264', rate=int(self.fps))
        self._stream.width = self.width
        self._stream.height = self.height
        self._stream.pix_fmt = 'yuv420p'
        self._stream.codec_context.time_base = Fraction(1, 90000)  # Standard MPEG-TS timebase

    def feed_nal(self, nal_data: bytes, is_keyframe: bool) -> None:
        """
        Feed H.264 NAL units from GPU. Muxes into MPEG-TS and
        appends to ring buffer.

        Called from the WebSocket message handler (synchronous context
        within the async event loop).
        """
        try:
            # Create a packet from raw NAL data
            packet = av.Packet(nal_data)
            packet.stream = self._stream
            packet.pts = int(self._frame_count * (90000 / self.fps))
            packet.dts = packet.pts
            packet.is_keyframe = is_keyframe
            self._frame_count += 1

            # Reset output buffer
            self._output.seek(0)
            self._output.truncate()

            # Mux packet to MPEG-TS
            self._container.mux(packet)

            ts_data = self._output.getvalue()
            if ts_data:
                self._sequence += 1
                segment = TSSegment(
                    data=ts_data,
                    sequence=self._sequence,
                    is_keyframe=is_keyframe,
                )
                self._segments.append(segment)

                # Wake up any waiting consumers
                for event in self._waiters:
                    event.set()

        except Exception as e:
            logger.warning(f"MPEG-TS mux error: {e}")

    async def consume(self) -> AsyncGenerator[bytes, None]:
        """
        Async generator that yields MPEG-TS bytes for an HTTP consumer.

        Starts from the latest I-frame (if available) for fast playback start,
        then yields new segments as they arrive.
        """
        event = asyncio.Event()
        self._waiters.append(event)

        try:
            # Find latest I-frame to start from
            segments = list(self._segments)
            start_idx = 0
            for i in range(len(segments) - 1, -1, -1):
                if segments[i].is_keyframe:
                    start_idx = i
                    break

            # Yield backlog from I-frame
            for seg in segments[start_idx:]:
                yield seg.data

            last_seq = segments[-1].sequence if segments else 0

            # Yield new segments as they arrive
            while True:
                event.clear()

                try:
                    await asyncio.wait_for(event.wait(), timeout=30.0)
                except asyncio.TimeoutError:
                    # No data for 30s — stream may have stopped
                    break

                # Get new segments since last yield
                for seg in list(self._segments):
                    if seg.sequence > last_seq:
                        yield seg.data
                        last_seq = seg.sequence

        except asyncio.CancelledError:
            pass
        except GeneratorExit:
            pass
        finally:
            try:
                self._waiters.remove(event)
            except ValueError:
                pass

    def close(self) -> None:
        """Close the muxer."""
        try:
            self._container.close()
        except Exception:
            pass
