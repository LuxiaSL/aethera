"""
Admin Panel Pod Manager

Manages pod lifecycle by calling the admin panel API, which in turn
controls RunPod pods. This allows automated start/stop based on viewer
presence while keeping pod credentials centralized in the admin panel.

The admin panel handles:
- RunPod API credentials
- Pod IDs for ComfyUI and DreamGen
- REST API calls to start/stop/status

This module just makes HTTP calls to the admin panel endpoints.
"""

import asyncio
import logging
import os
import time
from typing import Optional, Dict, Any, Callable
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

# Try to import httpx for async HTTP
try:
    import httpx
    HAS_HTTPX = True
except ImportError:
    HAS_HTTPX = False
    logger.warning("httpx not available - admin panel API calls may fail")


class PodState(Enum):
    """Pod lifecycle states"""
    IDLE = "idle"           # Pods stopped
    STARTING = "starting"   # Pods starting
    RUNNING = "running"     # Pods running
    STOPPING = "stopping"   # Pods stopping
    ERROR = "error"         # Error state


@dataclass
class PodStats:
    """Statistics for pod instances"""
    state: PodState = PodState.IDLE
    last_start_time: float = 0
    last_stop_time: float = 0
    start_attempts: int = 0
    error_message: Optional[str] = None
    comfyui_status: Optional[str] = None
    dreamgen_status: Optional[str] = None


class AdminPanelPodManager:
    """
    Manages RunPod pods through the admin panel API
    
    The admin panel centralizes:
    - RunPod API credentials
    - Pod IDs for ComfyUI and DreamGen
    - Cost tracking and billing
    
    This manager just makes HTTP calls to trigger lifecycle events.
    """
    
    def __init__(
        self,
        admin_url: Optional[str] = None,
        admin_auth_token: Optional[str] = None,
        on_state_change: Optional[Callable[[PodState, Optional[str]], None]] = None,
    ):
        """
        Initialize admin panel pod manager
        
        Args:
            admin_url: Admin panel base URL (or ADMIN_PANEL_URL env var)
            admin_auth_token: Optional auth token (or ADMIN_PANEL_TOKEN env var)
            on_state_change: Callback when pod state changes
        """
        self.admin_url = (admin_url or os.environ.get("ADMIN_PANEL_URL", "")).rstrip("/")
        self.admin_auth_token = admin_auth_token or os.environ.get("ADMIN_PANEL_TOKEN")
        self.on_state_change = on_state_change
        
        self.stats = PodStats()
        self._http_client: Optional[httpx.AsyncClient] = None
        self._start_lock = asyncio.Lock()
        self._last_action_time: float = 0
        self._min_action_interval: float = 10.0  # Minimum seconds between actions
        
        if not self.admin_url:
            logger.warning("No ADMIN_PANEL_URL configured - pod management via admin disabled")
        else:
            logger.info(f"AdminPanelPodManager initialized (admin: {self.admin_url})")
    
    @property
    def is_configured(self) -> bool:
        """Whether admin panel is properly configured"""
        return bool(self.admin_url)
    
    @property
    def is_running(self) -> bool:
        """Whether pods are currently running"""
        return self.stats.state == PodState.RUNNING
    
    @property
    def is_starting(self) -> bool:
        """Whether pods are currently starting"""
        return self.stats.state == PodState.STARTING
    
    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client"""
        if self._http_client is None or self._http_client.is_closed:
            headers = {}
            if self.admin_auth_token:
                headers["Authorization"] = f"Bearer {self.admin_auth_token}"
            self._http_client = httpx.AsyncClient(
                timeout=30.0,
                headers=headers,
            )
        return self._http_client
    
    async def _set_state(self, state: PodState, error: Optional[str] = None) -> None:
        """Update state and notify callback"""
        old_state = self.stats.state
        self.stats.state = state
        self.stats.error_message = error
        
        if old_state != state:
            logger.info(f"Pod state: {old_state.value} -> {state.value}")
            if self.on_state_change:
                try:
                    # Handle both sync and async callbacks
                    result = self.on_state_change(state, error)
                    if asyncio.iscoroutine(result):
                        await result
                except Exception as e:
                    logger.error(f"State change callback error: {e}")
    
    async def start_pods(self) -> bool:
        """
        Start both pods via admin panel
        
        Returns:
            True if start request was successful
        """
        if not self.is_configured:
            logger.warning("Admin panel not configured, cannot start pods")
            return False
        
        async with self._start_lock:
            # Debounce rapid start requests
            elapsed = time.time() - self._last_action_time
            if elapsed < self._min_action_interval and self.stats.state == PodState.STARTING:
                logger.debug(f"Debouncing start request ({elapsed:.1f}s since last action)")
                return True
            
            # Don't start if already running
            if self.stats.state == PodState.RUNNING:
                logger.debug("Pods already running")
                return True
            
            self.stats.start_attempts += 1
            await self._set_state(PodState.STARTING)
            self._last_action_time = time.time()
            
            try:
                client = await self._get_client()
                response = await client.post(f"{self.admin_url}/api/dreams/pods/start")
                
                if response.status_code == 200:
                    data = response.json()
                    logger.info(f"Pods start requested: {data}")
                    self.stats.last_start_time = time.time()
                    
                    # Note: We stay in STARTING state until GPU actually connects
                    # The websocket hub will call on_gpu_connected() which should
                    # transition us to RUNNING
                    return True
                else:
                    error_msg = f"Admin panel returned {response.status_code}: {response.text}"
                    logger.error(error_msg)
                    await self._set_state(PodState.ERROR, error_msg)
                    return False
            
            except Exception as e:
                logger.error(f"Failed to start pods via admin: {e}")
                await self._set_state(PodState.ERROR, str(e))
                return False
    
    async def stop_pods(self) -> bool:
        """
        Stop both pods via admin panel
        
        Returns:
            True if stop request was successful
        """
        if not self.is_configured:
            logger.warning("Admin panel not configured, cannot stop pods")
            return False
        
        # Debounce rapid stop requests
        elapsed = time.time() - self._last_action_time
        if elapsed < self._min_action_interval and self.stats.state == PodState.STOPPING:
            logger.debug(f"Debouncing stop request ({elapsed:.1f}s since last action)")
            return True
        
        await self._set_state(PodState.STOPPING)
        self._last_action_time = time.time()
        
        try:
            client = await self._get_client()
            response = await client.post(f"{self.admin_url}/api/dreams/pods/stop")
            
            if response.status_code == 200:
                data = response.json()
                logger.info(f"Pods stop requested: {data}")
                self.stats.last_stop_time = time.time()
                await self._set_state(PodState.IDLE)
                return True
            else:
                error_msg = f"Admin panel returned {response.status_code}: {response.text}"
                logger.error(error_msg)
                # Don't go to error state on stop failure, just log it
                await self._set_state(PodState.IDLE)
                return False
        
        except Exception as e:
            logger.error(f"Failed to stop pods via admin: {e}")
            # Don't go to error state on stop failure
            await self._set_state(PodState.IDLE)
            return False
    
    async def get_status(self) -> Dict[str, Any]:
        """
        Get pod status from admin panel
        
        Returns:
            Status dict from admin panel
        """
        if not self.is_configured:
            return {"configured": False, "error": "Admin panel not configured"}
        
        try:
            client = await self._get_client()
            response = await client.get(f"{self.admin_url}/api/dreams/pods/status")
            
            if response.status_code == 200:
                data = response.json()
                
                # Update our local state based on admin panel response
                comfyui = data.get("comfyui", {})
                dreamgen = data.get("dreamgen", {})
                
                self.stats.comfyui_status = comfyui.get("status")
                self.stats.dreamgen_status = dreamgen.get("status")
                
                # Determine combined state
                comfyui_running = comfyui.get("status") == "RUNNING"
                dreamgen_running = dreamgen.get("status") == "RUNNING"
                
                if comfyui_running and dreamgen_running:
                    if self.stats.state != PodState.RUNNING:
                        await self._set_state(PodState.RUNNING)
                elif comfyui.get("status") in ["STARTING", "CREATED"] or dreamgen.get("status") in ["STARTING", "CREATED"]:
                    if self.stats.state == PodState.IDLE:
                        await self._set_state(PodState.STARTING)
                
                return data
            else:
                return {"error": f"Admin panel returned {response.status_code}"}
        
        except Exception as e:
            logger.error(f"Failed to get status from admin: {e}")
            return {"error": str(e)}
    
    def on_gpu_connected(self) -> None:
        """Called when GPU WebSocket connects"""
        # GPU connected means pods are running
        if self.stats.state != PodState.RUNNING:
            # Use asyncio to set state since this may be called from sync context
            asyncio.create_task(self._set_state(PodState.RUNNING))
    
    def on_gpu_disconnected(self) -> None:
        """Called when GPU WebSocket disconnects"""
        # GPU disconnected - pods might still be running but not connected
        # Don't change state here, let the stop_pods call handle it
        pass
    
    async def close(self) -> None:
        """Close HTTP client"""
        if self._http_client and not self._http_client.is_closed:
            await self._http_client.aclose()


# Global instance
_pod_manager: Optional[AdminPanelPodManager] = None


def get_pod_manager() -> AdminPanelPodManager:
    """Get the global pod manager instance"""
    global _pod_manager
    if _pod_manager is None:
        _pod_manager = AdminPanelPodManager()
    return _pod_manager


def configure_pod_manager(
    admin_url: Optional[str] = None,
    admin_auth_token: Optional[str] = None,
    on_state_change: Optional[Callable] = None,
) -> AdminPanelPodManager:
    """Configure and return the pod manager"""
    global _pod_manager
    _pod_manager = AdminPanelPodManager(
        admin_url=admin_url,
        admin_auth_token=admin_auth_token,
        on_state_change=on_state_change,
    )
    return _pod_manager

