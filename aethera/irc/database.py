"""
IRC Database Configuration

Separate database for IRC fragments, independent from the main blog database.
This allows different backup strategies and cleaner separation of concerns.
"""

import os
import json
import logging
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional
from contextlib import contextmanager

from sqlmodel import SQLModel, Field, Session, create_engine
from sqlalchemy import Column, Text

logger = logging.getLogger(__name__)


# Compute default database path relative to project root
_PROJECT_ROOT = Path(__file__).parent.parent.parent
_DEFAULT_DB = f"sqlite:///{_PROJECT_ROOT / 'data' / 'irc.sqlite'}"

# Read from environment or use local default
IRC_DATABASE_URL = os.environ.get("IRC_DATABASE_URL", _DEFAULT_DB)

# Global singleton engine
_IRC_ENGINE = None


def get_irc_engine():
    """Get or create the IRC database engine singleton."""
    global _IRC_ENGINE
    if _IRC_ENGINE is None:
        _IRC_ENGINE = create_engine(
            IRC_DATABASE_URL, 
            connect_args={"check_same_thread": False}
        )
        logger.info(f"IRC database engine created: {IRC_DATABASE_URL}")
    return _IRC_ENGINE


@contextmanager
def get_irc_session():
    """Context manager for IRC database sessions."""
    engine = get_irc_engine()
    with Session(engine) as session:
        yield session


def get_irc_session_factory():
    """
    Return a session factory callable for dependency injection.
    
    Used by FragmentStorage and other components.
    """
    return get_irc_session


def init_irc_db():
    """Initialize the IRC database with tables."""
    engine = get_irc_engine()
    SQLModel.metadata.create_all(engine)
    logger.info("IRC database tables created")


# ==================== IRC Fragment Database Model ====================

class IRCFragmentDB(SQLModel, table=True):
    """
    A generated IRC conversation fragment.
    
    Stores the complete conversation including messages, metadata,
    and quality scoring for autoloom selection.
    
    This is the database model; see irc/models.py for the Pydantic model.
    """
    __tablename__ = "irc_fragments"
    
    id: str = Field(primary_key=True)
    messages_json: str = Field(sa_column=Column(Text))  # JSON serialized list of IRCMessage
    style: str                                          # e.g., "chaotic", "technical", "philosophical"
    collapse_type: str                                  # CollapseType as string
    pacing: str                                         # PacingStyle as string
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    quality_score: Optional[float] = None
    manual_rating: Optional[int] = None                 # 1, 2, or 3 for training set
    times_shown: int = 0
    last_shown_at: Optional[datetime] = None
    collapse_start_index: Optional[int] = None          # Where collapse begins in message array
    
    @property
    def messages(self) -> list[dict]:
        """Deserialize messages from JSON."""
        return json.loads(self.messages_json)
    
    @messages.setter
    def messages(self, value: list[dict]) -> None:
        """Serialize messages to JSON."""
        self.messages_json = json.dumps(value)
    
    @property
    def message_count(self) -> int:
        """Number of messages in fragment."""
        return len(self.messages)

