"""
IRC Broadcaster

Manages the global playback state for the IRC simulation.
All connected clients see the same stream in sync.
"""

import asyncio
import logging
import random
from collections import deque
from datetime import datetime
from typing import Any, Callable, Optional, Set, Awaitable
from fastapi import WebSocket

from .models import (
    IRCFragment,
    IRCMessage,
    PACING_CONFIGS,
    PacingStyle,
    CollapseType,
    MessageType,
)

logger = logging.getLogger(__name__)

#: broadcast payloads remembered, for late listeners and /api/irc/recent
HISTORY = 400
#: the most a new listener is played back on connect
REPLAY_MAX = 40
#: between fragments the channel is quiet; a new listener gets this much of the last one
AFTERIMAGE = 8


class IRCBroadcaster:
    """
    Central hub for IRC WebSocket connections and playback.
    
    Responsibilities:
    - Accept browser viewer connections
    - Maintain global playback state (current fragment, message index)
    - Push messages to all clients according to timing
    - Handle fragment transitions
    """
    
    def __init__(
        self,
        get_next_fragment: Callable[[], Awaitable[Optional[IRCFragment]]],
        channel_name: str = "#aethera",
    ):
        """
        Initialize broadcaster.
        
        Args:
            get_next_fragment: Async callable that returns the next fragment to play
            channel_name: The IRC channel name to report to clients
        """
        self.get_next_fragment = get_next_fragment
        self.channel_name = channel_name
        
        self._clients: Set[WebSocket] = set()
        self._lock = asyncio.Lock()
        
        # What has been said, numbered, so a late listener can be caught up
        # (and so /api/irc/recent can long-poll): (seq, payload), oldest first
        self._history: deque[tuple[int, dict[str, Any]]] = deque(maxlen=HISTORY)
        self._seq = 0
        self._pulse = asyncio.Event()

        # Playback state
        self._current_fragment: Optional[IRCFragment] = None
        self._message_index: int = 0
        self._running: bool = False
        self._playback_task: Optional[asyncio.Task] = None
    
    @property
    def client_count(self) -> int:
        """Number of connected clients."""
        return len(self._clients)
    
    @property
    def is_running(self) -> bool:
        """Whether the playback loop is running."""
        return self._running
    
    @property
    def current_fragment_id(self) -> Optional[str]:
        """ID of the currently playing fragment."""
        return self._current_fragment.id if self._current_fragment else None
    
    # ==================== Connection Management ====================
    
    async def connect(self, websocket: WebSocket) -> None:
        """
        Handle a new client connection.
        
        Args:
            websocket: The connecting WebSocket
        """
        await websocket.accept()

        await self._send_to_client(websocket, {
            "type": "connected",
            "channel": self.channel_name,
        })

        # Catch them up on the fragment in progress (or the tail of the last
        # one, between fragments), so they don't join to an empty screen; then
        # anything said meanwhile; then they're live. Joining the client set
        # under the lock, only once nothing newer is waiting, keeps every line
        # in order and none twice.
        async with self._lock:
            pending = self._replay_tail()
            cursor = self._seq
        for _ in range(5):
            for _seq, payload in pending:
                await self._send_to_client(websocket, {**payload, "replay": True})
            async with self._lock:
                pending = [(n, p) for n, p in self._history if n > cursor]
                cursor = self._seq
                if not pending:
                    self._clients.add(websocket)
                    break
        else:
            async with self._lock:
                self._clients.add(websocket)

        logger.info(f"Client connected. Total clients: {self.client_count}")
    
    async def disconnect(self, websocket: WebSocket) -> None:
        """
        Handle client disconnection.
        
        Args:
            websocket: The disconnecting WebSocket
        """
        async with self._lock:
            self._clients.discard(websocket)
        
        logger.info(f"Client disconnected. Total clients: {self.client_count}")
    
    async def _send_to_client(self, websocket: WebSocket, message: dict) -> bool:
        """
        Send a message to a specific client.
        
        Returns:
            True if sent successfully, False if client is dead
        """
        try:
            await asyncio.wait_for(websocket.send_json(message), timeout=5.0)
            return True
        except (asyncio.TimeoutError, Exception) as e:
            logger.debug(f"Failed to send to client: {e}")
            return False
    
    # ==================== History ====================

    def _replay_tail(self) -> list[tuple[int, dict[str, Any]]]:
        """What a new listener is played: the fragment so far, or, between
        fragments, the last few lines of the one that ended."""
        items = list(self._history)
        ends = [i for i, (_, p) in enumerate(items) if p.get("type") == "fragment_end"]
        if ends and ends[-1] == len(items) - 1:
            # quiet between fragments: an afterimage of the last one
            start = ends[-2] + 1 if len(ends) > 1 else 0
            last = items[start:]
            msgs = [it for it in last if it[1].get("type") == "message"][-AFTERIMAGE:]
            return msgs + [items[-1]]
        tail = items[ends[-1] + 1:] if ends else items
        if len(tail) > REPLAY_MAX:
            cut = tail[-REPLAY_MAX:]
            # still mid-collapse? say so, even if it began before the cut
            collapse = [it for it in tail[:-REPLAY_MAX] if it[1].get("type") == "collapse_start"]
            tail = collapse[-1:] + cut
        return tail

    def history_since(self, since: int, limit: int = 100) -> tuple[list[tuple[int, dict[str, Any]]], int, bool]:
        """Payloads after `since` (the last `limit` of them), the cursor to pass
        next, and whether any were skipped: the poller fell further behind than
        the history (or `limit`) reaches, or passed a cursor from the future (a
        restarted server) and is being brought back to the present.
        since <= 0 means "the recent past": the last `limit`, nothing missed."""
        if since > self._seq:
            return list(self._history)[-limit:], self._seq, True
        items = [it for it in self._history if it[0] > since] if since > 0 else list(self._history)
        oldest = self._history[0][0] if self._history else self._seq + 1
        missed = since > 0 and (since + 1 < oldest or len(items) > limit)
        return items[-limit:], self._seq, missed

    async def wait_since(self, since: int, timeout: float) -> None:
        """Return once something newer than `since` has been said, or after `timeout`."""
        if timeout <= 0 or self._seq > since:
            return
        pulse = self._pulse
        try:
            await asyncio.wait_for(pulse.wait(), timeout=timeout)
        except asyncio.TimeoutError:
            pass

    async def _broadcast(self, message: dict) -> None:
        """Remember a message, and send it to all connected clients."""
        async with self._lock:
            self._seq += 1
            self._history.append((self._seq, message))
            clients = set(self._clients)
        # wake the long-pollers, and hand the next ones a fresh doorbell
        pulse, self._pulse = self._pulse, asyncio.Event()
        pulse.set()

        if not clients:
            return

        # all at once: one listener that has stopped reading mustn't hold up the rest
        order = list(clients)
        results = await asyncio.gather(*(self._send_to_client(c, message) for c in order))
        dead_clients: Set[WebSocket] = {c for c, ok in zip(order, results) if not ok}
        
        # Clean up dead connections
        if dead_clients:
            async with self._lock:
                self._clients -= dead_clients
    
    # ==================== Playback Loop ====================
    
    async def start(self) -> None:
        """Start the playback loop as a background task."""
        if self._running:
            logger.warning("Broadcaster already running")
            return
        
        self._running = True
        self._playback_task = asyncio.create_task(self._playback_loop())
        logger.info("IRC broadcaster started")
    
    async def stop(self) -> None:
        """Stop the playback loop."""
        self._running = False
        
        if self._playback_task and not self._playback_task.done():
            self._playback_task.cancel()
            try:
                await self._playback_task
            except asyncio.CancelledError:
                pass
        
        self._playback_task = None
        logger.info("IRC broadcaster stopped")
    
    async def _playback_loop(self) -> None:
        """
        Main playback loop.
        
        Continuously plays fragments, pushing messages to all clients
        according to the timing specified in each message.
        """
        while self._running:
            try:
                # Get next fragment if needed
                if self._current_fragment is None:
                    self._current_fragment = await self.get_next_fragment()
                    self._message_index = 0
                    
                    if self._current_fragment is None:
                        # No fragments available, wait and retry
                        logger.warning("No fragments available, waiting...")
                        await asyncio.sleep(5.0)
                        continue
                    
                    logger.info(
                        f"Playing fragment {self._current_fragment.id} "
                        f"({self._current_fragment.message_count} messages, "
                        f"style={self._current_fragment.style})"
                    )
                
                # Get current message
                fragment = self._current_fragment
                msg = fragment.messages[self._message_index]
                
                # Check if this is the start of collapse
                if (fragment.collapse_start_index is not None and 
                    self._message_index == fragment.collapse_start_index):
                    await self._broadcast({
                        "type": "collapse_start",
                        "collapseType": fragment.collapse_type.value,
                    })
                
                # Broadcast message. Override the stored (per-fragment, resets-to-
                # 00:00) timestamp with the server's REAL wall clock at send time:
                # the raw timestamps only drive inter-message gaps (via delay_after,
                # already applied below), while the clock shown to viewers is a
                # single continuous real-time timer across all fragments.
                data = msg.to_broadcast()
                data["timestamp"] = datetime.now().strftime("%H:%M:%S")
                await self._broadcast({
                    "type": "message",
                    "data": data,
                })

                self._message_index += 1

                # Check if fragment is complete
                if self._message_index >= len(fragment.messages):
                    # Signal fragment end. The viewer does NOT clear — the channel
                    # just goes quiet, then the next fragment rolls on continuously.
                    await self._broadcast({"type": "fragment_end"})

                    # Quiet gap before the next fragment "tunes in" (15–30s).
                    gap_s = random.uniform(15.0, 30.0)
                    await asyncio.sleep(gap_s)

                    # Clear current fragment for next iteration
                    self._current_fragment = None
                else:
                    # Wait for delay before next message
                    await asyncio.sleep(msg.delay_after / 1000)
            
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in playback loop: {e}")
                await asyncio.sleep(1.0)
    
    # ==================== Statistics ====================
    
    def get_stats(self) -> dict:
        """Get broadcaster statistics."""
        return {
            "client_count": self.client_count,
            "is_running": self._running,
            "current_fragment_id": self.current_fragment_id,
            "message_index": self._message_index,
            "channel": self.channel_name,
        }


# ==================== Test Data ====================

def create_test_fragment() -> IRCFragment:
    """
    Create a test fragment for development.
    
    This allows frontend development before the generation pipeline is complete.
    """
    import uuid
    from datetime import datetime
    
    messages = [
        IRCMessage(
            timestamp="00:00",
            nick="xen0morph",
            content="anyone here dealt with memory corruption in rust unsafe blocks",
            type=MessageType.MESSAGE,
            delay_after=2500,
        ),
        IRCMessage(
            timestamp="00:03",
            nick="null_ptr",
            content="yeah the borrow checker doesn't save you there",
            type=MessageType.MESSAGE,
            delay_after=1800,
        ),
        IRCMessage(
            timestamp="00:05",
            nick="xen0morph",
            content="tell me about it",
            type=MessageType.MESSAGE,
            delay_after=3200,
        ),
        IRCMessage(
            timestamp="00:08",
            nick="dreamweaver",
            content="has entered the chat",
            type=MessageType.JOIN,
            delay_after=1500,
        ),
        IRCMessage(
            timestamp="00:10",
            nick="dreamweaver",
            content="what are we debugging today",
            type=MessageType.MESSAGE,
            delay_after=2100,
        ),
        IRCMessage(
            timestamp="00:12",
            nick="null_ptr",
            content="xen0morph is trying to do crimes against memory safety",
            type=MessageType.MESSAGE,
            delay_after=2800,
        ),
        IRCMessage(
            timestamp="00:15",
            nick="xen0morph",
            content="it's not crimes if it compiles",
            type=MessageType.MESSAGE,
            delay_after=1900,
        ),
        IRCMessage(
            timestamp="00:17",
            nick="dreamweaver",
            content="lmao",
            type=MessageType.MESSAGE,
            delay_after=2400,
        ),
        IRCMessage(
            timestamp="00:19",
            nick="cogito_",
            content="has entered the chat",
            type=MessageType.JOIN,
            delay_after=1200,
        ),
        IRCMessage(
            timestamp="00:21",
            nick="cogito_",
            content="the real question is whether code that compiles but segfaults is morally correct",
            type=MessageType.MESSAGE,
            delay_after=3500,
        ),
        IRCMessage(
            timestamp="00:24",
            nick="xen0morph",
            content="philosophy hour at 2am again",
            type=MessageType.MESSAGE,
            delay_after=2000,
        ),
        IRCMessage(
            timestamp="00:26",
            nick="null_ptr",
            content="wait what time is it",
            type=MessageType.MESSAGE,
            delay_after=1600,
        ),
        IRCMessage(
            timestamp="00:28",
            nick="dreamweaver",
            content="time is an illusion",
            type=MessageType.MESSAGE,
            delay_after=2200,
        ),
        IRCMessage(
            timestamp="00:30",
            nick="cogito_",
            content="lunch time doubly so",
            type=MessageType.MESSAGE,
            delay_after=1800,
        ),
        IRCMessage(
            timestamp="00:32",
            nick="xen0morph",
            content="ok i think i found the issue",
            type=MessageType.MESSAGE,
            delay_after=2600,
        ),
        IRCMessage(
            timestamp="00:34",
            nick="xen0morph",
            content="i was writing to a pointer after free",
            type=MessageType.MESSAGE,
            delay_after=2100,
        ),
        IRCMessage(
            timestamp="00:36",
            nick="null_ptr",
            content="...",
            type=MessageType.MESSAGE,
            delay_after=1400,
        ),
        IRCMessage(
            timestamp="00:38",
            nick="null_ptr",
            content="my username is literally null_ptr and even i know that's bad",
            type=MessageType.MESSAGE,
            delay_after=3000,
        ),
        IRCMessage(
            timestamp="00:41",
            nick="dreamweaver",
            content="lmaooo",
            type=MessageType.MESSAGE,
            delay_after=1500,
        ),
        IRCMessage(
            timestamp="00:43",
            nick="",
            content="* void.aethera.net irc.aethera.net",
            type=MessageType.SYSTEM,
            delay_after=800,
        ),
        IRCMessage(
            timestamp="00:44",
            nick="xen0morph",
            content="",
            type=MessageType.QUIT,
            delay_after=400,
            meta={"servers": ("irc.aethera.net", "void.aethera.net")},
        ),
        IRCMessage(
            timestamp="00:44",
            nick="null_ptr",
            content="",
            type=MessageType.QUIT,
            delay_after=400,
            meta={"servers": ("irc.aethera.net", "void.aethera.net")},
        ),
        IRCMessage(
            timestamp="00:44",
            nick="dreamweaver",
            content="",
            type=MessageType.QUIT,
            delay_after=400,
            meta={"servers": ("irc.aethera.net", "void.aethera.net")},
        ),
        IRCMessage(
            timestamp="00:44",
            nick="cogito_",
            content="",
            type=MessageType.QUIT,
            delay_after=0,
            meta={"servers": ("irc.aethera.net", "void.aethera.net")},
        ),
    ]
    
    return IRCFragment(
        id=str(uuid.uuid4())[:8],
        messages=messages,
        style="technical",
        collapse_type=CollapseType.NETSPLIT,
        pacing=PacingStyle.NORMAL,
        generated_at=datetime.utcnow(),
        quality_score=0.85,
        times_shown=0,
        collapse_start_index=19,  # System message about netsplit
    )


async def get_test_fragment() -> IRCFragment:
    """Async wrapper for test fragment generation."""
    # Add some variety by randomizing delays slightly
    fragment = create_test_fragment()
    
    # Randomize delays by ±20%
    for msg in fragment.messages:
        if msg.delay_after > 0:
            jitter = int(msg.delay_after * 0.2)
            msg.delay_after = msg.delay_after + random.randint(-jitter, jitter)
    
    return fragment

