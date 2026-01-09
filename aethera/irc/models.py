"""
IRC Simulation Models

Pydantic models for IRC messages, fragments, and related types.
Database models live in aethera/models/models.py for unified migrations.
"""

from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class CollapseType(str, Enum):
    """How the fragment ends - the fate of the channel."""
    NETSPLIT = "netsplit"
    GLINE = "gline"
    MASS_KICK = "mass_kick"
    PING_TIMEOUT = "ping_timeout"
    SENDQ_EXCEEDED = "sendq_exceeded"
    CORRUPTION = "corruption"


class MessageType(str, Enum):
    """Type of IRC message."""
    MESSAGE = "message"    # Normal chat
    ACTION = "action"      # /me did something
    JOIN = "join"          # User joined
    PART = "part"          # User left
    QUIT = "quit"          # User disconnected
    KICK = "kick"          # User was kicked
    SYSTEM = "system"      # Server notice


class PacingStyle(str, Enum):
    """Overall pacing of the fragment."""
    SLOW = "slow"
    NORMAL = "normal"
    FRANTIC = "frantic"


class MessageMeta(BaseModel):
    """Optional metadata for special message types."""
    servers: Optional[tuple[str, str]] = None  # Netsplit: ["irc.net", "other.net"]
    reason: Optional[str] = None               # Kick/ban reason
    target: Optional[str] = None               # Who got kicked


class IRCMessage(BaseModel):
    """A single IRC message."""
    timestamp: str                             # Relative to fragment start, e.g. "00:15"
    nick: str
    content: str
    type: MessageType = MessageType.MESSAGE
    delay_after: int = 0                       # ms until next message (assigned by normalizer)
    meta: Optional[MessageMeta] = None
    
    class Config:
        # Allow serialization with camelCase for frontend
        populate_by_name = True
    
    def to_broadcast(self) -> dict:
        """Convert to dict for WebSocket broadcast."""
        result = {
            "timestamp": self.timestamp,
            "nick": self.nick,
            "content": self.content,
            "type": self.type.value,
            "delayAfter": self.delay_after,
        }
        if self.meta:
            result["meta"] = {}
            if self.meta.servers:
                result["meta"]["servers"] = list(self.meta.servers)
            if self.meta.reason:
                result["meta"]["reason"] = self.meta.reason
            if self.meta.target:
                result["meta"]["target"] = self.meta.target
        return result


class IRCFragment(BaseModel):
    """A complete IRC conversation fragment."""
    id: str
    messages: list[IRCMessage]
    style: str                                  # e.g., "chaotic", "technical", "philosophical"
    collapse_type: CollapseType
    pacing: PacingStyle
    generated_at: datetime
    quality_score: Optional[float] = None
    manual_rating: Optional[int] = None         # 1, 2, or 3 for training set
    times_shown: int = 0
    last_shown_at: Optional[datetime] = None
    collapse_start_index: Optional[int] = None  # Where collapse begins in message array
    
    @property
    def duration_ms(self) -> int:
        """Total duration of fragment in milliseconds."""
        return sum(m.delay_after for m in self.messages)
    
    @property
    def message_count(self) -> int:
        """Number of messages in fragment."""
        return len(self.messages)


class CollapseDetection(BaseModel):
    """Result of collapse detection in a fragment."""
    detected: bool
    type: CollapseType
    start_index: int                            # Where collapse begins in message array
    involved_nicks: list[str]                   # Who gets quit/kicked/etc


# === Pacing Configuration ===

PACING_CONFIGS = {
    PacingStyle.SLOW: {
        "base_delay": 3000,
        "char_delay": 50,
        "jitter": 2000,
        "collapse_pause": 8000,
    },
    PacingStyle.NORMAL: {
        "base_delay": 1500,
        "char_delay": 30,
        "jitter": 1000,
        "collapse_pause": 5000,
    },
    PacingStyle.FRANTIC: {
        "base_delay": 500,
        "char_delay": 15,
        "jitter": 500,
        "collapse_pause": 3000,
    },
}


# === WebSocket Message Types ===

class WSConnected(BaseModel):
    """Sent on WebSocket connection."""
    type: str = "connected"
    channel: str = "#aethera"


class WSMessage(BaseModel):
    """A message being broadcast."""
    type: str = "message"
    data: dict  # IRCMessage.to_broadcast()


class WSCollapseStart(BaseModel):
    """Signals the start of a collapse sequence."""
    type: str = "collapse_start"
    collapse_type: str  # CollapseType value


class WSFragmentEnd(BaseModel):
    """Signals the end of a fragment."""
    type: str = "fragment_end"


# === Utility Functions ===

def generate_fragment_id() -> str:
    """Generate a unique fragment ID."""
    import uuid
    return str(uuid.uuid4())[:12]

