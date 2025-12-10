from typing import Optional
from datetime import datetime
from sqlmodel import Field, SQLModel, create_engine
import os
from pathlib import Path
from typing import Optional

# Compute default database path relative to project root
_PROJECT_ROOT = Path(__file__).parent.parent.parent
_DEFAULT_DB = f"sqlite:///{_PROJECT_ROOT / 'data' / 'blog.sqlite'}"

# Read from environment (set in Dockerfile for production) or use local default
DATABASE_URL = os.environ.get("DATABASE_URL", _DEFAULT_DB)

# Global singleton engine - create once and reuse
_ENGINE = None


def get_engine():
    """Get or create the SQLAlchemy engine singleton"""
    global _ENGINE
    if _ENGINE is None:
        _ENGINE = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    return _ENGINE


def get_session():
    """Session generator for dependency injection"""
    from sqlmodel import Session
    engine = get_engine()
    with Session(engine) as session:
        yield session


def init_db():
    """Initialize the database with tables."""
    engine = get_engine()
    SQLModel.metadata.create_all(engine)