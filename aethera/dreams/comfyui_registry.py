"""
ComfyUI Service Registry

Tracks the ComfyUI pod's IP address for DreamGen to connect to.

Flow:
1. Admin panel starts ComfyUI pod via RunPod GraphQL
2. ComfyUI pod starts up and runs comfyui-start.sh
3. Startup script POSTs to VPS with pod's public IP
4. VPS stores endpoint in this registry
5. Admin panel starts DreamGen pod
6. DreamGen queries VPS for ComfyUI endpoint
7. DreamGen connects to ComfyUI via the registered IP

This decouples ComfyUI and DreamGen - they don't need to know
each other's IPs at deployment time, only at runtime.
"""

import asyncio
import logging
import time
from typing import Optional
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


@dataclass
class ComfyUIEndpoint:
    """Registered ComfyUI endpoint information"""
    ip: str
    port: int
    auth_user: str = ""
    auth_pass: str = ""
    registered_at: float = field(default_factory=time.time)
    last_health_check: Optional[float] = None
    healthy: bool = False
    pod_id: Optional[str] = None  # RunPod pod ID for correlation


# Module-level singleton state
_comfyui_endpoint: Optional[ComfyUIEndpoint] = None
_lock = asyncio.Lock()


async def register_comfyui(
    ip: str,
    port: int = 8188,
    auth_user: str = "",
    auth_pass: str = "",
    pod_id: Optional[str] = None,
) -> bool:
    """
    Register ComfyUI pod's endpoint
    
    Called by ComfyUI startup script via /api/dreams/comfyui/register.
    
    Args:
        ip: Public IP address of the ComfyUI pod
        port: ComfyUI port (default 8188)
        auth_user: Basic auth username (if nginx auth enabled)
        auth_pass: Basic auth password (if nginx auth enabled)
        pod_id: Optional RunPod pod ID for correlation
    
    Returns:
        True on success
    """
    global _comfyui_endpoint
    async with _lock:
        _comfyui_endpoint = ComfyUIEndpoint(
            ip=ip,
            port=port,
            auth_user=auth_user,
            auth_pass=auth_pass,
            pod_id=pod_id,
        )
        logger.info(f"ComfyUI registered: {ip}:{port} (pod: {pod_id or 'unknown'})")
        return True


async def get_comfyui_endpoint() -> Optional[dict]:
    """
    Get current ComfyUI endpoint for DreamGen
    
    Called by DreamGen via /api/dreams/comfyui to discover where
    to connect for SD generation.
    
    Returns:
        Endpoint dict with url, auth credentials, etc.
        None if no ComfyUI is registered
    """
    if _comfyui_endpoint is None:
        return None
    
    return {
        "url": f"http://{_comfyui_endpoint.ip}:{_comfyui_endpoint.port}",
        "ip": _comfyui_endpoint.ip,
        "port": _comfyui_endpoint.port,
        "auth_user": _comfyui_endpoint.auth_user,
        "auth_pass": _comfyui_endpoint.auth_pass,
        "registered_at": _comfyui_endpoint.registered_at,
        "healthy": _comfyui_endpoint.healthy,
        "pod_id": _comfyui_endpoint.pod_id,
    }


async def unregister_comfyui() -> bool:
    """
    Clear ComfyUI endpoint (pod stopped)
    
    Called by admin panel when stopping ComfyUI pod.
    
    Returns:
        True on success
    """
    global _comfyui_endpoint
    async with _lock:
        _comfyui_endpoint = None
        logger.info("ComfyUI unregistered")
        return True


async def health_check_comfyui() -> bool:
    """
    Check if ComfyUI is reachable
    
    Performs HTTP health check to the registered endpoint.
    Updates the healthy flag in the registry.
    
    Returns:
        True if ComfyUI responds, False otherwise
    """
    global _comfyui_endpoint
    if _comfyui_endpoint is None:
        return False
    
    try:
        import aiohttp
        url = f"http://{_comfyui_endpoint.ip}:{_comfyui_endpoint.port}/system_stats"
        
        # Setup basic auth if configured
        auth = None
        if _comfyui_endpoint.auth_user:
            auth = aiohttp.BasicAuth(
                _comfyui_endpoint.auth_user,
                _comfyui_endpoint.auth_pass
            )
        
        timeout = aiohttp.ClientTimeout(total=10)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(url, auth=auth) as resp:
                _comfyui_endpoint.healthy = resp.status == 200
                _comfyui_endpoint.last_health_check = time.time()
                
                if resp.status == 200:
                    logger.debug(f"ComfyUI health check passed")
                else:
                    logger.warning(f"ComfyUI health check failed: HTTP {resp.status}")
                
                return _comfyui_endpoint.healthy
    
    except Exception as e:
        logger.warning(f"ComfyUI health check failed: {e}")
        if _comfyui_endpoint:
            _comfyui_endpoint.healthy = False
            _comfyui_endpoint.last_health_check = time.time()
        return False


async def get_registry_status() -> dict:
    """
    Get full registry status for admin monitoring
    
    Returns:
        Status dict with registration info and health
    """
    if _comfyui_endpoint is None:
        return {
            "registered": False,
            "endpoint": None,
        }
    
    return {
        "registered": True,
        "endpoint": {
            "url": f"http://{_comfyui_endpoint.ip}:{_comfyui_endpoint.port}",
            "ip": _comfyui_endpoint.ip,
            "port": _comfyui_endpoint.port,
            "pod_id": _comfyui_endpoint.pod_id,
            "registered_at": _comfyui_endpoint.registered_at,
            "registered_ago_seconds": round(time.time() - _comfyui_endpoint.registered_at, 1),
            "healthy": _comfyui_endpoint.healthy,
            "last_health_check": _comfyui_endpoint.last_health_check,
        },
    }


def is_registered() -> bool:
    """Check if ComfyUI is currently registered (sync version for quick checks)"""
    return _comfyui_endpoint is not None

