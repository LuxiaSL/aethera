"""
IRC Admin Session Manager

Manages active generation sessions for the admin web UI.
Sessions are in-memory with automatic cleanup after timeout.
"""

import asyncio
import logging
import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Callable, Awaitable

from .run_config import GenerationRunConfig, SessionState
from .interactive import InteractiveGenerator, EventType, GenerationEvent

logger = logging.getLogger(__name__)


class Session:
    """An active generation session."""
    
    def __init__(
        self,
        session_id: str,
        config: GenerationRunConfig,
    ):
        self.session_id = session_id
        self.config = config
        self.generator: Optional[InteractiveGenerator] = None
        self.created_at = datetime.now(timezone.utc)
        self.last_activity = self.created_at
        self._task: Optional[asyncio.Task] = None
        self._event_callbacks: list[Callable[[GenerationEvent], Awaitable[None]]] = []
    
    def add_event_callback(self, callback: Callable[[GenerationEvent], Awaitable[None]]):
        """Add an event callback (e.g., WebSocket sender)."""
        self._event_callbacks.append(callback)
    
    def remove_event_callback(self, callback: Callable[[GenerationEvent], Awaitable[None]]):
        """Remove an event callback."""
        if callback in self._event_callbacks:
            self._event_callbacks.remove(callback)
    
    async def _broadcast_event(self, event: GenerationEvent):
        """Broadcast event to all callbacks."""
        for callback in self._event_callbacks:
            try:
                await callback(event)
            except Exception as e:
                logger.warning(f"Event callback error: {e}")
    
    async def start(self):
        """Start generation."""
        if self._task and not self._task.done():
            raise RuntimeError("Generation already running")
        
        self.generator = InteractiveGenerator(
            config=self.config,
            event_callback=self._broadcast_event,
        )
        
        self._task = asyncio.create_task(self._run())
        self.last_activity = datetime.now(timezone.utc)
    
    async def _run(self):
        """Run generation and handle completion."""
        try:
            result = await self.generator.generate()
            if result:
                logger.info(f"Session {self.session_id}: Generation complete with {len(result.messages)} messages")
            else:
                logger.warning(f"Session {self.session_id}: Generation returned None")
        except Exception as e:
            logger.error(f"Session {self.session_id}: Generation error: {e}")
            await self._broadcast_event(GenerationEvent(
                type=EventType.ERROR,
                data={"message": str(e), "recoverable": False}
            ))
    
    def stop(self):
        """Stop generation."""
        if self.generator:
            self.generator.stop()
        self.last_activity = datetime.now(timezone.utc)
    
    def provide_selection(self, candidate_index: int):
        """Provide user selection."""
        if self.generator:
            self.generator.provide_selection(candidate_index)
        self.last_activity = datetime.now(timezone.utc)
    
    def provide_confirmation(self):
        """Provide user confirmation."""
        if self.generator:
            self.generator.provide_confirmation()
        self.last_activity = datetime.now(timezone.utc)
    
    def update_config(self, changes: dict):
        """Update configuration (only when paused or before starting)."""
        from .run_config import ControlMode, ProviderConfig, PromptConfig
        
        # Fields that can be safely updated directly (simple types)
        safe_fields = {
            'style', 'collapse_type', 'target_messages', 'target_users',
            'channel', 'candidates_per_batch', 'max_chunks',
            'min_collapse_percentage', 'autoloom_threshold', 'max_chunk_failures',
            'use_instruct_mode', 'dry_run'
        }
        
        for key, value in changes.items():
            if not hasattr(self.config, key):
                continue
            
            # Handle control_mode specially (string -> enum)
            if key == "control_mode" and isinstance(value, str):
                try:
                    setattr(self.config, key, ControlMode(value))
                except ValueError:
                    logger.warning(f"Invalid control_mode value: {value}")
                continue
            
            # Handle nested objects with their from_dict methods
            if key == "generation" and isinstance(value, dict):
                setattr(self.config, key, ProviderConfig.from_dict(value))
                continue
            
            if key == "judge" and isinstance(value, dict):
                setattr(self.config, key, ProviderConfig.from_dict(value))
                continue
            
            if key == "prompts" and isinstance(value, dict):
                setattr(self.config, key, PromptConfig.from_dict(value))
                continue
            
            # Only update simple fields directly
            if key in safe_fields:
                setattr(self.config, key, value)
        
        self.last_activity = datetime.now(timezone.utc)
    
    def get_state(self) -> SessionState:
        """Get current session state."""
        if self.generator:
            state = self.generator.get_state()
            if state:
                state.session_id = self.session_id
                return state
        
        # Return idle state
        return SessionState(
            session_id=self.session_id,
            config=self.config,
            status="idle",
        )
    
    @property
    def is_running(self) -> bool:
        """Check if generation is running."""
        return self._task is not None and not self._task.done()


class SessionManager:
    """
    Manages active generation sessions.
    
    Sessions are stored in-memory and cleaned up after inactivity timeout.
    """
    
    def __init__(
        self,
        session_timeout_minutes: int = 30,
        max_sessions: int = 10,
    ):
        self.sessions: Dict[str, Session] = {}
        self.session_timeout_minutes = session_timeout_minutes
        self.max_sessions = max_sessions
        self._cleanup_task: Optional[asyncio.Task] = None
    
    def start_cleanup_task(self):
        """Start the background cleanup task."""
        if self._cleanup_task is None or self._cleanup_task.done():
            self._cleanup_task = asyncio.create_task(self._cleanup_loop())
    
    async def _cleanup_loop(self):
        """Periodically clean up inactive sessions."""
        while True:
            await asyncio.sleep(60)  # Check every minute
            await self._cleanup_inactive()
    
    async def _cleanup_inactive(self):
        """Remove sessions that have been inactive too long."""
        now = datetime.now(timezone.utc)
        timeout_seconds = self.session_timeout_minutes * 60
        
        to_remove = []
        for session_id, session in self.sessions.items():
            if not session.is_running:
                age = (now - session.last_activity).total_seconds()
                if age > timeout_seconds:
                    to_remove.append(session_id)
        
        for session_id in to_remove:
            logger.info(f"Cleaning up inactive session: {session_id}")
            await self.delete_session(session_id)
    
    async def create_session(self, config: GenerationRunConfig) -> Session:
        """Create a new session."""
        # Check session limit
        if len(self.sessions) >= self.max_sessions:
            # Try to clean up inactive sessions first
            await self._cleanup_inactive()
            
            if len(self.sessions) >= self.max_sessions:
                raise RuntimeError(f"Maximum sessions ({self.max_sessions}) reached")
        
        session_id = str(uuid.uuid4())[:8]  # Short ID for convenience
        session = Session(session_id=session_id, config=config)
        self.sessions[session_id] = session
        
        logger.info(f"Created session: {session_id}")
        return session
    
    def get_session(self, session_id: str) -> Optional[Session]:
        """Get a session by ID."""
        return self.sessions.get(session_id)
    
    def list_sessions(self) -> list[SessionState]:
        """List all sessions."""
        return [session.get_state() for session in self.sessions.values()]
    
    async def delete_session(self, session_id: str) -> bool:
        """Delete a session."""
        session = self.sessions.pop(session_id, None)
        if session:
            session.stop()
            logger.info(f"Deleted session: {session_id}")
            return True
        return False
    
    async def cleanup_all(self):
        """Clean up all sessions (for shutdown)."""
        for session_id in list(self.sessions.keys()):
            await self.delete_session(session_id)
        
        if self._cleanup_task:
            self._cleanup_task.cancel()
            try:
                await self._cleanup_task
            except asyncio.CancelledError:
                pass


# Global session manager instance
_session_manager: Optional[SessionManager] = None


def get_session_manager() -> SessionManager:
    """Get the global session manager."""
    global _session_manager
    if _session_manager is None:
        _session_manager = SessionManager()
        _session_manager.start_cleanup_task()
    return _session_manager

