"""
Viewer Presence Tracking

Tracks connected viewers (WebSocket) and API activity to determine
when to start/stop the GPU. Implements grace periods to handle
brief disconnections without unnecessary GPU cycling.
"""

import asyncio
import time
import logging
from typing import Optional, Set, Callable, Awaitable
from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ViewerPresenceTracker:
    """
    Tracks viewer presence and manages GPU lifecycle triggers
    
    When viewers connect:
    - Cancel any pending shutdown
    - Start GPU if not running (via callback)
    
    When all viewers disconnect:
    - Start grace period timer
    - After grace period, trigger GPU shutdown (via callback)
    """
    
    def __init__(
        self,
        shutdown_delay: float = 30.0,
        api_timeout: float = 300.0,
        on_should_start: Optional[Callable[[], Awaitable[None]]] = None,
        on_should_stop: Optional[Callable[[], Awaitable[None]]] = None,
    ):
        """
        Initialize presence tracker
        
        Args:
            shutdown_delay: Seconds to wait after last viewer before shutdown
            api_timeout: Seconds of API inactivity before considering inactive
            on_should_start: Async callback when GPU should start
            on_should_stop: Async callback when GPU should stop
        """
        self.shutdown_delay = shutdown_delay
        self.api_timeout = api_timeout
        self.on_should_start = on_should_start
        self.on_should_stop = on_should_stop
        
        self._viewers: Set[WebSocket] = set()
        self._last_api_access: float = 0
        self._shutdown_task: Optional[asyncio.Task] = None
        self._gpu_running: bool = False
        self._lock = asyncio.Lock()
    
    @property
    def viewer_count(self) -> int:
        """Current number of connected viewers"""
        return len(self._viewers)
    
    @property
    def has_viewers(self) -> bool:
        """Whether any viewers are connected"""
        return len(self._viewers) > 0
    
    @property
    def has_recent_api_activity(self) -> bool:
        """Whether there's been recent API activity"""
        return (time.time() - self._last_api_access) < self.api_timeout
    
    @property
    def gpu_running(self) -> bool:
        """Whether GPU is currently running"""
        return self._gpu_running
    
    def set_gpu_running(self, running: bool) -> None:
        """Update GPU running state (called by GPU manager)"""
        self._gpu_running = running
    
    async def on_viewer_connect(self, websocket: WebSocket) -> None:
        """
        Called when a browser connects via WebSocket
        
        Args:
            websocket: The connected WebSocket
        """
        async with self._lock:
            self._viewers.add(websocket)
            viewer_count = len(self._viewers)
        
        logger.info(f"Viewer connected (total: {viewer_count})")
        
        # Cancel any pending shutdown
        if self._shutdown_task:
            self._shutdown_task.cancel()
            self._shutdown_task = None
            logger.debug("Cancelled pending shutdown")
        
        # Start GPU if not running
        # The on_should_start callback (gpu_manager.start_gpu) has its own
        # protection against duplicate jobs, but we avoid unnecessary calls
        if not self._gpu_running and self.on_should_start:
            logger.info("Starting GPU due to viewer connection")
            try:
                await self.on_should_start()
            except Exception as e:
                logger.error(f"Failed to start GPU: {e}")
    
    async def on_viewer_disconnect(self, websocket: WebSocket) -> None:
        """
        Called when a browser disconnects
        
        Args:
            websocket: The disconnected WebSocket
        """
        async with self._lock:
            self._viewers.discard(websocket)
            viewer_count = len(self._viewers)
        
        logger.info(f"Viewer disconnected (remaining: {viewer_count})")
        
        # Schedule shutdown if no viewers left
        if viewer_count == 0 and self._shutdown_task is None:
            self._shutdown_task = asyncio.create_task(
                self._delayed_shutdown()
            )
            logger.debug(f"Scheduled shutdown in {self.shutdown_delay}s")
    
    def on_api_access(self) -> None:
        """Called when an API endpoint is accessed"""
        self._last_api_access = time.time()
        
        # Cancel any pending shutdown
        if self._shutdown_task:
            self._shutdown_task.cancel()
            self._shutdown_task = None
            logger.debug("Cancelled pending shutdown due to API access")
        
        # Start GPU if not running
        # The on_should_start callback (gpu_manager.start_gpu) has its own
        # protection against duplicate jobs, but we avoid unnecessary calls
        if not self._gpu_running and self.on_should_start:
            logger.info("Starting GPU due to API access")
            async def _start_with_error_handling():
                try:
                    await self.on_should_start()
                except Exception as e:
                    logger.error(f"Failed to start GPU from API access: {e}")
            asyncio.create_task(_start_with_error_handling())
    
    async def _delayed_shutdown(self) -> None:
        """Wait, then shutdown if still no activity"""
        try:
            await asyncio.sleep(self.shutdown_delay)
            
            # Double-check conditions
            if self.has_viewers:
                logger.debug("Shutdown cancelled: viewers reconnected")
                return
            
            if self.has_recent_api_activity:
                logger.debug("Shutdown cancelled: recent API activity")
                return
            
            # Safe to shutdown
            logger.info("Grace period expired, initiating GPU shutdown")
            if self.on_should_stop:
                await self.on_should_stop()
        
        except asyncio.CancelledError:
            logger.debug("Shutdown task cancelled")
        
        finally:
            self._shutdown_task = None
    
    def get_status(self) -> dict:
        """Get presence tracking status"""
        return {
            "viewer_count": self.viewer_count,
            "has_viewers": self.has_viewers,
            "has_recent_api_activity": self.has_recent_api_activity,
            "gpu_running": self._gpu_running,
            "shutdown_pending": self._shutdown_task is not None,
            "seconds_since_api_access": round(time.time() - self._last_api_access, 1) if self._last_api_access > 0 else None,
        }


