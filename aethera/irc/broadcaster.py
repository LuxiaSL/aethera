"""
IRC Broadcaster

Manages the global playback state for the IRC simulation.
All connected clients see the same stream in sync.
"""

import asyncio
import logging
import random
from typing import Callable, Optional, Set, Awaitable
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
        
        async with self._lock:
            self._clients.add(websocket)
        
        # Send connection confirmation - no history, client joins stream in progress
        await self._send_to_client(websocket, {
            "type": "connected",
            "channel": self.channel_name,
        })
        
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
    
    async def _broadcast(self, message: dict) -> None:
        """Broadcast a message to all connected clients."""
        if not self._clients:
            return
        
        dead_clients: Set[WebSocket] = set()
        
        async with self._lock:
            clients = set(self._clients)
        
        for client in clients:
            if not await self._send_to_client(client, message):
                dead_clients.add(client)
        
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
                
                # Broadcast message
                await self._broadcast({
                    "type": "message",
                    "data": msg.to_broadcast(),
                })
                
                self._message_index += 1
                
                # Check if fragment is complete
                if self._message_index >= len(fragment.messages):
                    # Signal fragment end
                    await self._broadcast({"type": "fragment_end"})
                    
                    # Pause before next fragment
                    pacing_config = PACING_CONFIGS[fragment.pacing]
                    pause_ms = pacing_config["collapse_pause"]
                    await asyncio.sleep(pause_ms / 1000)
                    
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

