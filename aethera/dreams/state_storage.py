"""
DreamGen State Persistence

Persists generation state to disk for resume after pod restart.
State is received from GPU via WebSocket (MSG_STATE = 0x02).

This allows the DreamGen pod to be stopped and restarted without
losing generation context - it can resume from where it left off.

Storage:
- State binary stored as msgpack in /app/data/dreams/last_state.msgpack
- Metadata (timestamp, size) stored as JSON in state_meta.json
"""

import asyncio
import json
import logging
import time
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

# State storage paths
# In Docker: /app/data/dreams/
# In dev: relative to core directory
STATE_DIR = Path("/app/data/dreams")
STATE_FILE = STATE_DIR / "last_state.msgpack"
STATE_META_FILE = STATE_DIR / "state_meta.json"

# Fall back to local path if not in Docker
if not STATE_DIR.parent.exists():
    STATE_DIR = Path(__file__).parent.parent.parent.parent / "data" / "dreams"


def ensure_state_dir() -> None:
    """Ensure state directory exists"""
    STATE_DIR.mkdir(parents=True, exist_ok=True)


async def save_state(state_bytes: bytes) -> bool:
    """
    Save state snapshot to disk
    
    Called when GPU sends MSG_STATE message.
    Runs in executor to avoid blocking event loop.
    
    Args:
        state_bytes: Raw msgpack state bytes from GPU
    
    Returns:
        True if saved successfully
    """
    def _save() -> bool:
        try:
            ensure_state_dir()
            
            # Atomic write: write to temp file, then rename
            temp_file = STATE_FILE.with_suffix('.tmp')
            temp_file.write_bytes(state_bytes)
            temp_file.rename(STATE_FILE)
            
            # Save metadata
            meta = {
                "saved_at": time.time(),
                "saved_at_iso": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "size_bytes": len(state_bytes),
            }
            STATE_META_FILE.write_text(json.dumps(meta, indent=2))
            
            logger.debug(f"State saved: {len(state_bytes)} bytes")
            return True
        except Exception as e:
            logger.error(f"Failed to save state: {e}")
            return False
    
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _save)


async def load_state() -> Optional[bytes]:
    """
    Load last saved state
    
    Called when GPU connects and requests state restore.
    
    Returns:
        State bytes if available, None otherwise
    """
    def _load() -> Optional[bytes]:
        try:
            if not STATE_FILE.exists():
                logger.info("No saved state found")
                return None
            
            state_bytes = STATE_FILE.read_bytes()
            logger.info(f"Loaded state: {len(state_bytes)} bytes")
            return state_bytes
        except Exception as e:
            logger.error(f"Failed to load state: {e}")
            return None
    
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _load)


async def get_state_info() -> Optional[dict]:
    """
    Get info about saved state without loading it
    
    Returns:
        Metadata dict or None if no state exists
    """
    def _get_info() -> Optional[dict]:
        try:
            if not STATE_META_FILE.exists():
                return None
            
            meta = json.loads(STATE_META_FILE.read_text())
            
            # Add age calculation
            if "saved_at" in meta:
                meta["age_seconds"] = round(time.time() - meta["saved_at"], 1)
            
            return meta
        except Exception:
            return None
    
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _get_info)


async def clear_state() -> bool:
    """
    Clear saved state (e.g., fresh start requested)
    
    Returns:
        True if cleared successfully
    """
    def _clear() -> bool:
        try:
            if STATE_FILE.exists():
                STATE_FILE.unlink()
            if STATE_META_FILE.exists():
                STATE_META_FILE.unlink()
            logger.info("State cleared")
            return True
        except Exception as e:
            logger.error(f"Failed to clear state: {e}")
            return False
    
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _clear)


def get_state_dir() -> Path:
    """Get the state directory path (for debugging/admin)"""
    return STATE_DIR

