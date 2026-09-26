"""
Chronicle database - separate sqlite following the one-DB-per-concern
convention (blog.sqlite, irc.sqlite, chronicle.sqlite).

Phase 1: raw keyframe records (14-day window).
Phase 2: eras and scenes, derived by segmenter.py and kept forever, together
with two kinds of permanent files beside the raw thumbnails:
  keep/    one representative thumbnail per scene
  strata/  hourly "core sample" tiles: one row per 30 s of the dream
"""

import logging
import os
import struct
from datetime import datetime
from pathlib import Path
from typing import Optional, Sequence

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


def keep_dir() -> Path:
    """Permanent scene representatives (outlive the raw thumbnails)."""
    return CHRONICLE_THUMBS_DIR.parent / "keep"


def strata_dir() -> Path:
    """Permanent hourly strata tiles."""
    return CHRONICLE_THUMBS_DIR.parent / "strata"


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
    # Embeddings are stored as little-endian float16 blobs (see pack_f16):
    # as JSON text they were ~1.4 KB of every ~1.9 KB row.
    color_hist_f16: Optional[bytes] = None  # 96 x f16 = 192 B
    latent_pool_f16: Optional[bytes] = None  # 128 x f16 = 256 B, pooled VAE latent
    # Legacy JSON columns: only rows written before the f16 columns existed
    # use them, and the store's compaction step converts those rows.
    color_hist_json: Optional[str] = None
    latent_pool_json: Optional[str] = None
    phash: Optional[str] = None
    thumb_path: Optional[str] = None  # relative to CHRONICLE_THUMBS_DIR
    era_id: Optional[int] = Field(default=None, index=True)  # filled in Phase 2


class ChronicleEra(SQLModel, table=True):
    """
    One era: a stretch of one template, opened by a template switch (or a
    fresh boot / long silence). Kept forever. The last era stays open
    (closed=False) and is re-derived each segmenter pass until it ends.
    """

    __tablename__ = "chronicle_era"

    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: str = Field(default="", index=True)
    template_id: str = ""
    start_ts: datetime = Field(index=True)
    end_ts: datetime = Field(index=True)
    first_row_id: int = Field(index=True)  # chronicle_keyframe.id range
    last_row_id: int = 0
    kf_count: int = 0
    lifetime_kf_start: Optional[int] = None
    lifetime_kf_end: Optional[int] = None
    mutations: int = 0
    recalls: int = 0
    opened_by: str = ""  # template_switch | session_start | resume | silence
    closed: bool = Field(default=False, index=True)
    title: str = ""  # mechanical: "template · word · word"
    magenta: Optional[float] = None  # mean magenta hue share
    words_json: str = "[]"  # [[unix_ts, category, from, to], ...]
    recalls_json: str = "[]"  # [[unix_ts, detail], ...]


class ChronicleScene(SQLModel, table=True):
    """A scene: a stretch of an era with one coherent look. Kept forever."""

    __tablename__ = "chronicle_scene"

    id: Optional[int] = Field(default=None, primary_key=True)
    era_id: int = Field(index=True)
    idx: int = 0
    start_ts: datetime
    end_ts: datetime
    kf_count: int = 0
    prompt: str = ""  # prompt at the representative moment
    rep_path: Optional[str] = None  # relative to keep_dir()
    palette_json: str = "[]"  # ["#rrggbb", ...] most common first


class ChronicleMeta(SQLModel, table=True):
    """Small key/value store for segmenter bookkeeping."""

    __tablename__ = "chronicle_meta"

    key: str = Field(primary_key=True)
    value: str = ""


def pack_f16(values: Optional[Sequence[float]]) -> Optional[bytes]:
    """Pack a float vector as little-endian float16. None/empty/bad -> None."""
    if not values:
        return None
    try:
        return struct.pack(f"<{len(values)}e", *(float(v) for v in values))
    except (struct.error, TypeError, ValueError, OverflowError):
        return None


def unpack_f16(blob: Optional[bytes]) -> Optional[list[float]]:
    """Inverse of pack_f16, rounded to 4 dp (the precision the GPU sends)."""
    if not blob or len(blob) % 2:
        return None
    return [round(v, 4) for v in struct.unpack(f"<{len(blob) // 2}e", blob)]


def get_chronicle_engine():
    """Get or create the chronicle database engine singleton."""
    global _ENGINE
    if _ENGINE is None:
        # Ensure data/ exists before sqlite tries to create the file
        db_path = CHRONICLE_DATABASE_URL.replace("sqlite:///", "")
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        # timeout: ingest runs off the stream hub's loop, so waiting out a
        # long write (retention sweep, one-time VACUUM) beats failing a batch
        _ENGINE = create_engine(
            CHRONICLE_DATABASE_URL,
            connect_args={"check_same_thread": False, "timeout": 30},
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
    for table in (ChronicleKeyframe, ChronicleEra, ChronicleScene, ChronicleMeta):
        table.__table__.create(engine, checkfirst=True)
    _migrate(engine)
    # WAL: the page's reads and the segmenter's passes no longer queue behind
    # ingest writes (the mode is persistent once set)
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("PRAGMA journal_mode=WAL"))
    except Exception:
        logger.debug("Chronicle WAL mode not set", exc_info=True)
    for d in (CHRONICLE_THUMBS_DIR, keep_dir(), strata_dir()):
        d.mkdir(parents=True, exist_ok=True)
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
        "ALTER TABLE chronicle_keyframe ADD COLUMN latent_pool_json VARCHAR",
        "ALTER TABLE chronicle_keyframe ADD COLUMN color_hist_f16 BLOB",
        "ALTER TABLE chronicle_keyframe ADD COLUMN latent_pool_f16 BLOB",
    ]
    with engine.connect() as conn:
        for stmt in migrations:
            try:
                conn.execute(text(stmt))
                conn.commit()
                logger.info(f"Chronicle migration applied: {stmt}")
            except Exception:
                pass  # column already exists
