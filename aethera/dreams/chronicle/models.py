"""
Chronicle database - separate sqlite following the one-DB-per-concern
convention (blog.sqlite, irc.sqlite, chronicle.sqlite).

Phase 1 schema: raw keyframe records only. Era and DiaryEntry tables arrive
with the segmenter (Phase 2+) once thresholds have been tuned against real
recorded sessions.
"""

import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Optional

from sqlmodel import Field, Session, SQLModel, create_engine

logger = logging.getLogger(__name__)

_PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
_DEFAULT_DB = f"sqlite:///{_PROJECT_ROOT / 'data' / 'chronicle.sqlite'}"

CHRONICLE_DATABASE_URL = os.environ.get("CHRONICLE_DATABASE_URL", _DEFAULT_DB)

# Thumbnails live on disk; the DB stores relative paths
CHRONICLE_THUMBS_DIR = Path(
    os.environ.get("CHRONICLE_THUMBS_DIR", str(_PROJECT_ROOT / "data" / "chronicle" / "thumbs"))
)

_ENGINE = None


class ChronicleKeyframe(SQLModel, table=True):
    """One keyframe's memoir entry (raw window; TTL enforced by retention job)."""

    __tablename__ = "chronicle_keyframe"

    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: str = Field(index=True)
    keyframe: int
    lifetime_keyframe: Optional[int] = Field(default=None, index=True)  # SPEC-resume.md
    sequence: int = -1
    ts: datetime = Field(index=True)  # GPU clock, UTC
    received_at: datetime = Field(index=True)  # VPS clock, UTC
    prompt: str = ""
    negative: str = ""
    template_id: str = Field(default="", index=True)
    components_json: str = "{}"  # {category: word}
    events_json: str = "[]"  # [{kind, detail}], "[]" if none
    has_events: bool = Field(default=False, index=True)
    color_hist_json: Optional[str] = None  # 96 floats, compact JSON
    phash: Optional[str] = None
    thumb_path: Optional[str] = None  # relative to CHRONICLE_THUMBS_DIR
    era_id: Optional[int] = Field(default=None, index=True)  # filled in Phase 2


def get_chronicle_engine():
    """Get or create the chronicle database engine singleton."""
    global _ENGINE
    if _ENGINE is None:
        # Ensure data/ exists before sqlite tries to create the file
        db_path = CHRONICLE_DATABASE_URL.replace("sqlite:///", "")
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        _ENGINE = create_engine(
            CHRONICLE_DATABASE_URL, connect_args={"check_same_thread": False}
        )
        logger.info(f"Chronicle database engine created: {CHRONICLE_DATABASE_URL}")
    return _ENGINE


def get_chronicle_session():
    """Session generator for dependency injection."""
    engine = get_chronicle_engine()
    with Session(engine) as session:
        yield session


def init_chronicle_db() -> None:
    """Initialize chronicle tables and the thumbnail directory."""
    engine = get_chronicle_engine()
    # Only create THIS module's tables - metadata is shared across sqlmodel
    # models in the process, and blog/IRC tables must not be created here.
    ChronicleKeyframe.__table__.create(engine, checkfirst=True)
    _migrate(engine)
    CHRONICLE_THUMBS_DIR.mkdir(parents=True, exist_ok=True)
    logger.info("Chronicle database initialized")


def _migrate(engine) -> None:
    """
    Additive column migrations for existing databases. checkfirst table
    creation doesn't add columns, so new nullable columns are ALTERed in,
    each guarded (already-present -> no-op).
    """
    from sqlalchemy import text

    migrations = [
        "ALTER TABLE chronicle_keyframe ADD COLUMN lifetime_keyframe INTEGER",
    ]
    with engine.connect() as conn:
        for stmt in migrations:
            try:
                conn.execute(text(stmt))
                conn.commit()
                logger.info(f"Chronicle migration applied: {stmt}")
            except Exception:
                pass  # column already exists
