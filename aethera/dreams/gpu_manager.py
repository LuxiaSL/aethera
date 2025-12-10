"""
RunPod GPU Manager

Manages GPU lifecycle on RunPod Serverless for Dream Window:
- Starting endpoints when viewers connect
- Stopping endpoints when viewers leave
- Managing GPU WebSocket connection
- Handling state restoration on startup

RunPod Serverless provides per-second billing, making it ideal for
intermittent workloads like Dream Window.
"""

import asyncio
import logging
import time
import os
from typing import Optional, Dict, Any
from dataclasses import dataclass, field
from enum import Enum
import json

logger = logging.getLogger(__name__)

# Try to import httpx for async HTTP, fall back to aiohttp
try:
    import httpx
    HAS_HTTPX = True
except ImportError:
    HAS_HTTPX = False
    try:
        import aiohttp
        HAS_AIOHTTP = True
    except ImportError:
        HAS_AIOHTTP = False
        logger.warning("Neither httpx nor aiohttp available - RunPod API calls will fail")


class GPUState(Enum):
    """GPU lifecycle states"""
    IDLE = "idle"
    STARTING = "starting"
    RUNNING = "running"
    STOPPING = "stopping"
    ERROR = "error"


@dataclass
class GPUStats:
    """Statistics for GPU instance"""
    state: GPUState = GPUState.IDLE
    start_time: Optional[float] = None
    stop_time: Optional[float] = None
    frames_received: int = 0
    last_frame_time: Optional[float] = None
    instance_id: Optional[str] = None
    gpu_type: Optional[str] = None
    error_message: Optional[str] = None
    start_attempts: int = 0


class RunPodManager:
    """
    Manages RunPod Serverless GPU for Dream Window
    
    Handles:
    - Endpoint lifecycle (start/stop)
    - Health monitoring
    - Connection management
    - Cost tracking
    """
    
    # RunPod API endpoints
    RUNPOD_API_BASE = "https://api.runpod.io/v2"
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        endpoint_id: Optional[str] = None,
        on_state_change: Optional[callable] = None,
    ):
        """
        Initialize RunPod manager
        
        Args:
            api_key: RunPod API key (or RUNPOD_API_KEY env var)
            endpoint_id: RunPod serverless endpoint ID (or RUNPOD_ENDPOINT_ID env var)
            on_state_change: Callback when GPU state changes
        """
        self.api_key = api_key or os.environ.get("RUNPOD_API_KEY")
        self.endpoint_id = endpoint_id or os.environ.get("RUNPOD_ENDPOINT_ID")
        self.on_state_change = on_state_change
        
        self.stats = GPUStats()
        self._http_client: Optional[Any] = None
        self._running_job_id: Optional[str] = None
        self._health_task: Optional[asyncio.Task] = None
        
        if not self.api_key:
            logger.warning("No RunPod API key configured - GPU management disabled")
        if not self.endpoint_id:
            logger.warning("No RunPod endpoint ID configured - GPU management disabled")
        
        logger.info(f"RunPodManager initialized (endpoint: {self.endpoint_id or 'not configured'})")
    
    @property
    def is_configured(self) -> bool:
        """Whether RunPod is properly configured"""
        return bool(self.api_key and self.endpoint_id)
    
    @property
    def is_running(self) -> bool:
        """Whether GPU is currently running"""
        return self.stats.state == GPUState.RUNNING
    
    @property
    def uptime_seconds(self) -> float:
        """Current GPU uptime in seconds"""
        if self.stats.start_time and self.stats.state == GPUState.RUNNING:
            return time.time() - self.stats.start_time
        return 0
    
    async def start_gpu(self) -> bool:
        """
        Start GPU instance on RunPod
        
        Returns:
            True if start was initiated successfully
        """
        if not self.is_configured:
            logger.error("Cannot start GPU: RunPod not configured")
            await self._set_state(GPUState.ERROR, "RunPod not configured")
            return False
        
        if self.stats.state in (GPUState.STARTING, GPUState.RUNNING):
            logger.info(f"GPU already {self.stats.state.value}, skipping start")
            return True
        
        self.stats.start_attempts += 1
        await self._set_state(GPUState.STARTING)
        
        try:
            # Submit async job to RunPod
            job_id = await self._submit_runpod_job({
                "type": "start",
                "vps_websocket_url": self._get_vps_websocket_url(),
            })
            
            if job_id:
                self._running_job_id = job_id
                logger.info(f"RunPod job submitted: {job_id}")
                
                # Start health check task
                if self._health_task:
                    self._health_task.cancel()
                self._health_task = asyncio.create_task(self._health_check_loop())
                
                return True
            else:
                await self._set_state(GPUState.ERROR, "Failed to submit RunPod job")
                return False
        
        except Exception as e:
            logger.error(f"Failed to start GPU: {e}")
            await self._set_state(GPUState.ERROR, str(e))
            return False
    
    async def stop_gpu(self) -> bool:
        """
        Stop GPU instance on RunPod
        
        Returns:
            True if stop was initiated successfully
        """
        if self.stats.state == GPUState.IDLE:
            logger.info("GPU already idle, skipping stop")
            return True
        
        await self._set_state(GPUState.STOPPING)
        
        try:
            # Cancel health check
            if self._health_task:
                self._health_task.cancel()
                self._health_task = None
            
            # Cancel running job
            if self._running_job_id:
                await self._cancel_runpod_job(self._running_job_id)
                self._running_job_id = None
            
            self.stats.stop_time = time.time()
            await self._set_state(GPUState.IDLE)
            
            logger.info(f"GPU stopped (uptime: {self.uptime_seconds:.1f}s)")
            return True
        
        except Exception as e:
            logger.error(f"Error stopping GPU: {e}")
            # Force to idle anyway
            await self._set_state(GPUState.IDLE)
            return False
    
    def on_gpu_connected(self) -> None:
        """Called when GPU WebSocket connects to VPS"""
        self.stats.start_time = time.time()
        asyncio.create_task(self._set_state(GPUState.RUNNING))
        logger.info("GPU connected and running")
    
    def on_gpu_disconnected(self) -> None:
        """Called when GPU WebSocket disconnects from VPS"""
        if self.stats.state == GPUState.RUNNING:
            asyncio.create_task(self._set_state(GPUState.IDLE))
            logger.warning("GPU disconnected unexpectedly")
    
    def on_frame_received(self) -> None:
        """Called when a frame is received from GPU"""
        self.stats.frames_received += 1
        self.stats.last_frame_time = time.time()
    
    async def _set_state(self, state: GPUState, error: Optional[str] = None) -> None:
        """Update GPU state and notify callback"""
        old_state = self.stats.state
        self.stats.state = state
        self.stats.error_message = error
        
        logger.info(f"GPU state: {old_state.value} -> {state.value}")
        
        if self.on_state_change:
            try:
                await self.on_state_change(state, error)
            except Exception as e:
                logger.error(f"Error in state change callback: {e}")
    
    async def _submit_runpod_job(self, input_data: dict) -> Optional[str]:
        """
        Submit an async job to RunPod
        
        Args:
            input_data: Job input parameters
        
        Returns:
            Job ID if successful, None otherwise
        """
        url = f"{self.RUNPOD_API_BASE}/{self.endpoint_id}/run"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {"input": input_data}
        
        try:
            if HAS_HTTPX:
                async with httpx.AsyncClient() as client:
                    response = await client.post(url, headers=headers, json=payload, timeout=30.0)
                    if response.status_code == 200:
                        data = response.json()
                        return data.get("id")
                    else:
                        logger.error(f"RunPod API error: {response.status_code} - {response.text}")
            elif HAS_AIOHTTP:
                async with aiohttp.ClientSession() as session:
                    async with session.post(url, headers=headers, json=payload, timeout=30) as response:
                        if response.status == 200:
                            data = await response.json()
                            return data.get("id")
                        else:
                            text = await response.text()
                            logger.error(f"RunPod API error: {response.status} - {text}")
            else:
                logger.error("No HTTP client available for RunPod API")
            
            return None
        
        except Exception as e:
            logger.error(f"RunPod API request failed: {e}")
            return None
    
    async def _cancel_runpod_job(self, job_id: str) -> bool:
        """Cancel a running RunPod job"""
        url = f"{self.RUNPOD_API_BASE}/{self.endpoint_id}/cancel/{job_id}"
        headers = {"Authorization": f"Bearer {self.api_key}"}
        
        try:
            if HAS_HTTPX:
                async with httpx.AsyncClient() as client:
                    response = await client.post(url, headers=headers, timeout=10.0)
                    return response.status_code == 200
            elif HAS_AIOHTTP:
                async with aiohttp.ClientSession() as session:
                    async with session.post(url, headers=headers, timeout=10) as response:
                        return response.status == 200
            return False
        
        except Exception as e:
            logger.error(f"Failed to cancel job {job_id}: {e}")
            return False
    
    async def _get_job_status(self, job_id: str) -> Optional[dict]:
        """Get status of a RunPod job"""
        url = f"{self.RUNPOD_API_BASE}/{self.endpoint_id}/status/{job_id}"
        headers = {"Authorization": f"Bearer {self.api_key}"}
        
        try:
            if HAS_HTTPX:
                async with httpx.AsyncClient() as client:
                    response = await client.get(url, headers=headers, timeout=10.0)
                    if response.status_code == 200:
                        return response.json()
            elif HAS_AIOHTTP:
                async with aiohttp.ClientSession() as session:
                    async with session.get(url, headers=headers, timeout=10) as response:
                        if response.status == 200:
                            return await response.json()
            return None
        
        except Exception as e:
            logger.error(f"Failed to get job status: {e}")
            return None
    
    async def _health_check_loop(self) -> None:
        """Periodically check GPU health"""
        check_interval = 30  # seconds
        startup_timeout = 120  # seconds for initial startup
        
        start_check_time = time.time()
        
        while True:
            try:
                await asyncio.sleep(check_interval)
                
                # Check if we're still waiting for startup
                if self.stats.state == GPUState.STARTING:
                    elapsed = time.time() - start_check_time
                    if elapsed > startup_timeout:
                        logger.error(f"GPU startup timeout after {elapsed:.0f}s")
                        await self._set_state(GPUState.ERROR, "Startup timeout")
                        break
                    
                    # Check job status
                    if self._running_job_id:
                        status = await self._get_job_status(self._running_job_id)
                        if status:
                            job_status = status.get("status", "")
                            if job_status == "FAILED":
                                error = status.get("error", "Unknown error")
                                logger.error(f"RunPod job failed: {error}")
                                await self._set_state(GPUState.ERROR, error)
                                break
                            elif job_status == "COMPLETED":
                                # Job shouldn't complete during streaming
                                logger.warning("RunPod job completed unexpectedly")
                
                # Check frame freshness when running
                elif self.stats.state == GPUState.RUNNING:
                    if self.stats.last_frame_time:
                        frame_age = time.time() - self.stats.last_frame_time
                        if frame_age > 60:  # No frames for 60s
                            logger.warning(f"No frames received for {frame_age:.0f}s")
            
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Health check error: {e}")
    
    def _get_vps_websocket_url(self) -> str:
        """Get the WebSocket URL for GPU to connect to"""
        # This should be configured based on deployment
        # For now, return a placeholder
        host = os.environ.get("VPS_HOST", "aetherawi.red")
        return f"wss://{host}/ws/gpu"
    
    def get_status(self) -> dict:
        """Get GPU manager status"""
        return {
            "configured": self.is_configured,
            "state": self.stats.state.value,
            "running": self.is_running,
            "uptime_seconds": round(self.uptime_seconds, 1),
            "frames_received": self.stats.frames_received,
            "instance_id": self.stats.instance_id,
            "gpu_type": self.stats.gpu_type,
            "start_attempts": self.stats.start_attempts,
            "error_message": self.stats.error_message,
            "last_frame_age": round(time.time() - self.stats.last_frame_time, 1) if self.stats.last_frame_time else None,
        }


# Singleton instance (will be configured on startup)
gpu_manager: Optional[RunPodManager] = None


def get_gpu_manager() -> RunPodManager:
    """Get or create the GPU manager singleton"""
    global gpu_manager
    if gpu_manager is None:
        gpu_manager = RunPodManager()
    return gpu_manager


def configure_gpu_manager(
    api_key: Optional[str] = None,
    endpoint_id: Optional[str] = None,
    on_state_change: Optional[callable] = None,
) -> RunPodManager:
    """Configure and return the GPU manager"""
    global gpu_manager
    gpu_manager = RunPodManager(
        api_key=api_key,
        endpoint_id=endpoint_id,
        on_state_change=on_state_change,
    )
    return gpu_manager

