"""
ChronicleStore - ingest, retention, and snapshot queries

The GPU websocket handler hands raw batch bytes to submit(), which queues
them and returns at once; one ingest task drains the queue, doing all
DB/disk work in a worker thread (asyncio.to_thread). So the stream hub
never waits on the database, even while a sweep or VACUUM holds the lock.
A malformed batch logs and drops - the chronicle must never take down the
hub it lives beside.
"""

import asyncio
import base64
import json
import logging
import os
import shutil
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from sqlalchemy import or_, text
from sqlmodel import Session, select, func, delete

from . import models
from .models import (
    ChronicleKeyframe,
    get_chronicle_engine,
    pack_f16,
    unpack_f16,
)

logger = logging.getLogger(__name__)

# Raw records + thumbnails are kept this long (era summaries, once they
# exist in Phase 2+, are kept forever). ~130 MB/day of rows + ~40 MB/day
# of thumbnails while the dream runs continuously.
RETENTION_DAYS = float(os.environ.get("CHRONICLE_RETENTION_DAYS", "14"))
RETENTION_SWEEP_INTERVAL_S = 6 * 3600

# The VPS disk is shared with other services. Below this much free space
# each sweep shortens raw retention by 2 days (never under the floor), and
# relaxes it a day per sweep once there is twice the margin again.
MIN_FREE_BYTES = int(float(os.environ.get("CHRONICLE_MIN_FREE_MB", "1024")) * 1e6)
MIN_RETENTION_DAYS = 2.0

# Batches waiting for ingest (~5 s of records each). Past this the oldest is
# dropped: the chronicle is lossy by design, the stream hub is not.
INGEST_QUEUE_BATCHES = 64

# Legacy JSON-embedding rows are converted this many at a time, so each
# write lock is short. After conversion (or a big retention delete), VACUUM
# returns the space to the disk when more than this fraction of pages is free.
COMPACT_CHUNK_ROWS = 2000
VACUUM_FREE_FRACTION = 0.25


class ChronicleStore:
    """Singleton owning chronicle ingest and retention."""

    def __init__(self):
        self.batches_ingested = 0
        self.batches_rejected = 0
        self.batches_dropped = 0
        self.records_ingested = 0
        self.thumbs_written = 0
        self.retention_days: float = RETENTION_DAYS
        self._vacuum_pending = False
        self._retention_task: Optional[asyncio.Task] = None
        self._ingest_queue: Optional[asyncio.Queue] = None
        self._ingest_task: Optional[asyncio.Task] = None

    # ------------------------------------------------------------------ #
    # Ingest                                                             #
    # ------------------------------------------------------------------ #

    def submit(self, payload: bytes) -> None:
        """Queue one chronicle batch (0x05 payload) for ingest. Never blocks or raises."""
        try:
            if self._ingest_queue is None:
                self._ingest_queue = asyncio.Queue(maxsize=INGEST_QUEUE_BATCHES)
            if self._ingest_task is None or self._ingest_task.done():
                self._ingest_task = asyncio.get_running_loop().create_task(
                    self._ingest_loop()
                )
            if self._ingest_queue.full():
                self._ingest_queue.get_nowait()
                self.batches_dropped += 1
            self._ingest_queue.put_nowait(payload)
        except Exception:
            self.batches_rejected += 1
            logger.warning("Chronicle batch could not be queued", exc_info=True)

    async def _ingest_loop(self) -> None:
        assert self._ingest_queue is not None
        while True:
            payload = await self._ingest_queue.get()
            try:
                await self.ingest(payload)
            finally:
                self._ingest_queue.task_done()

    async def ingest(self, payload: bytes) -> None:
        """Ingest one chronicle batch (0x05 payload). Never raises."""
        try:
            count = await asyncio.to_thread(self._ingest_sync, payload)
            if count:
                self.batches_ingested += 1
                self.records_ingested += count
        except Exception:
            self.batches_rejected += 1
            logger.warning("Chronicle batch rejected", exc_info=True)

    def _ingest_sync(self, payload: bytes) -> int:
        batch = json.loads(payload.decode("utf-8"))
        if batch.get("type") != "chronicle_batch":
            raise ValueError(f"unexpected chronicle payload type: {batch.get('type')!r}")

        records = batch.get("records", [])
        if not records:
            return 0

        now = datetime.now(timezone.utc)
        rows = []
        for rec in records:
            thumb_path = self._write_thumb(rec, now)
            events = rec.get("events") or []
            rows.append(
                ChronicleKeyframe(
                    session_id=str(rec.get("session_id", "unknown")),
                    keyframe=int(rec.get("keyframe", -1)),
                    lifetime_keyframe=(
                        int(rec["lifetime_keyframe"])
                        if rec.get("lifetime_keyframe") is not None
                        else None
                    ),
                    sequence=int(rec.get("sequence", -1)),
                    ts=datetime.fromtimestamp(float(rec.get("ts", 0)), tz=timezone.utc),
                    received_at=now,
                    prompt=str(rec.get("prompt", ""))[:2000],
                    negative=str(rec.get("negative", ""))[:2000],
                    template_id=str(rec.get("template_id", ""))[:200],
                    components_json=json.dumps(
                        rec.get("components") or {}, separators=(",", ":")
                    ),
                    events_json=json.dumps(events, separators=(",", ":")),
                    has_events=bool(events),
                    color_hist_f16=pack_f16(rec.get("color_hist")),
                    latent_pool_f16=pack_f16(rec.get("latent_pool")),
                    phash=rec.get("phash"),
                    thumb_path=thumb_path,
                )
            )

        with Session(get_chronicle_engine()) as session:
            session.add_all(rows)
            session.commit()
        return len(rows)

    def _write_thumb(self, rec: dict, now: datetime) -> Optional[str]:
        """Decode and store a record's thumbnail. Returns relative path or None."""
        b64 = rec.get("thumb_webp_b64")
        if not b64:
            return None
        try:
            data = base64.b64decode(b64)
            if len(data) > 256 * 1024:  # sanity bound
                return None
            day_dir = now.strftime("%Y%m%d")
            session8 = str(rec.get("session_id", "unknown"))[:8]
            name = f"{session8}_{int(rec.get('keyframe', 0)):08d}.webp"
            rel = f"{day_dir}/{name}"
            abs_path = models.CHRONICLE_THUMBS_DIR / day_dir
            abs_path.mkdir(parents=True, exist_ok=True)
            (abs_path / name).write_bytes(data)
            self.thumbs_written += 1
            return rel
        except Exception:
            logger.debug("Chronicle thumb write failed", exc_info=True)
            return None

    # ------------------------------------------------------------------ #
    # Retention                                                          #
    # ------------------------------------------------------------------ #

    def start_retention_task(self) -> None:
        """Start the periodic retention sweep (call from app lifespan)."""
        if self._retention_task is None or self._retention_task.done():
            self._retention_task = asyncio.get_running_loop().create_task(
                self._retention_loop()
            )

    def stop_retention_task(self) -> None:
        for task in (self._retention_task, self._ingest_task):
            if task and not task.done():
                task.cancel()

    async def _retention_loop(self) -> None:
        while True:
            try:
                deleted_rows, deleted_thumbs = await asyncio.to_thread(
                    self._retention_sweep_sync
                )
                if deleted_rows or deleted_thumbs:
                    logger.info(
                        f"Chronicle retention: removed {deleted_rows} records, "
                        f"{deleted_thumbs} thumbnails (>{self.retention_days:g}d)"
                    )
            except asyncio.CancelledError:
                raise
            except Exception:
                logger.warning("Chronicle retention sweep failed", exc_info=True)
            try:
                result = await asyncio.to_thread(self._compact_sync)
                if result["converted"] or result["vacuumed"]:
                    logger.info(
                        f"Chronicle compaction: {result['converted']} rows to f16, "
                        f"vacuumed={result['vacuumed']}, "
                        f"{result['bytes_before'] / 1e6:.0f} MB -> {result['bytes_after'] / 1e6:.0f} MB"
                    )
            except asyncio.CancelledError:
                raise
            except Exception:
                logger.warning("Chronicle compaction failed", exc_info=True)
            await asyncio.sleep(RETENTION_SWEEP_INTERVAL_S)

    def _compact_sync(self) -> dict[str, Any]:
        """
        Convert legacy JSON-embedding rows to f16 blobs, then VACUUM if a
        large share of pages is free. Idempotent: a no-op once converted.
        """
        engine = get_chronicle_engine()
        legacy = or_(
            ChronicleKeyframe.color_hist_json.is_not(None),  # type: ignore[union-attr]
            ChronicleKeyframe.latent_pool_json.is_not(None),  # type: ignore[union-attr]
        )
        converted = 0
        while True:
            with Session(engine) as session:
                rows = session.exec(
                    select(
                        ChronicleKeyframe.id,
                        ChronicleKeyframe.color_hist_json,
                        ChronicleKeyframe.latent_pool_json,
                    )
                    .where(legacy)
                    .limit(COMPACT_CHUNK_ROWS)
                ).all()
            if not rows:
                break
            params = [
                {"id": rid, "ch": _json_to_f16(ch), "lp": _json_to_f16(lp)}
                for rid, ch, lp in rows
            ]
            with engine.begin() as conn:
                # COALESCE keeps an existing blob when the legacy column is empty;
                # the JSON is always cleared, so a bad row can't loop forever
                conn.execute(
                    text(
                        "UPDATE chronicle_keyframe SET "
                        "color_hist_f16 = COALESCE(:ch, color_hist_f16), "
                        "latent_pool_f16 = COALESCE(:lp, latent_pool_f16), "
                        "color_hist_json = NULL, latent_pool_json = NULL "
                        "WHERE id = :id"
                    ),
                    params,
                )
            converted += len(rows)

        with engine.connect() as conn:
            page_size = conn.exec_driver_sql("PRAGMA page_size").scalar() or 0
            pages = conn.exec_driver_sql("PRAGMA page_count").scalar() or 0
            free = conn.exec_driver_sql("PRAGMA freelist_count").scalar() or 0
        bytes_before = pages * page_size
        vacuumed = False
        # Conversion shrinks rows inside their pages without freeing any
        # (the freelist can't see that slack, and appends never reuse it),
        # so a converting pass always vacuums; otherwise only big deletes do.
        # A failed VACUUM (lock held past the timeout) stays pending for the
        # next pass, which would otherwise see nothing left to convert.
        if converted:
            self._vacuum_pending = True
        if pages and (self._vacuum_pending or free / pages > VACUUM_FREE_FRACTION):
            self._vacuum_pending = True
            with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
                conn.exec_driver_sql("VACUUM")
            self._vacuum_pending = False
            vacuumed = True
        with engine.connect() as conn:
            bytes_after = (conn.exec_driver_sql("PRAGMA page_count").scalar() or 0) * page_size
        return {
            "converted": converted,
            "vacuumed": vacuumed,
            "bytes_before": bytes_before,
            "bytes_after": bytes_after,
        }

    def _retention_days_for_disk(self) -> float:
        """Shorten raw retention while the shared disk is low; relax it after."""
        try:
            free = shutil.disk_usage(models.CHRONICLE_THUMBS_DIR).free
        except OSError:
            return self.retention_days
        if free < MIN_FREE_BYTES and self.retention_days > MIN_RETENTION_DAYS:
            self.retention_days = max(MIN_RETENTION_DAYS, self.retention_days - 2)
            logger.warning(
                f"Chronicle: disk low ({free / 1e6:.0f} MB free), "
                f"raw retention shortened to {self.retention_days:g} days"
            )
        elif free > 2 * MIN_FREE_BYTES and self.retention_days < RETENTION_DAYS:
            self.retention_days = min(RETENTION_DAYS, self.retention_days + 1)
            logger.info(f"Chronicle: disk ok, raw retention back to {self.retention_days:g} days")
        return self.retention_days

    def _retention_sweep_sync(self) -> tuple[int, int]:
        days = self._retention_days_for_disk()
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)

        # Phase 2 note: once eras exist, representative thumbnails must be
        # excluded from deletion here. In Phase 1 nothing is permanent yet.
        deleted_thumbs = 0
        with Session(get_chronicle_engine()) as session:
            old = session.exec(
                select(ChronicleKeyframe.thumb_path).where(
                    ChronicleKeyframe.received_at < cutoff,
                    ChronicleKeyframe.thumb_path.is_not(None),  # type: ignore[union-attr]
                )
            ).all()
            for rel in old:
                try:
                    path = models.CHRONICLE_THUMBS_DIR / rel
                    if path.is_file():
                        path.unlink()
                        deleted_thumbs += 1
                except Exception:
                    pass

            result = session.exec(
                delete(ChronicleKeyframe).where(ChronicleKeyframe.received_at < cutoff)  # type: ignore[arg-type]
            )
            session.commit()
            deleted_rows = result.rowcount or 0

        # Remove any now-empty day directories
        try:
            for day_dir in models.CHRONICLE_THUMBS_DIR.iterdir():
                if day_dir.is_dir() and not any(day_dir.iterdir()):
                    day_dir.rmdir()
        except Exception:
            pass

        return deleted_rows, deleted_thumbs

    # ------------------------------------------------------------------ #
    # Snapshots                                                          #
    # ------------------------------------------------------------------ #

    def current_snapshot_sync(self) -> dict[str, Any]:
        """Live snapshot of the most recent session for /api/dreams/chronicle/current."""
        with Session(get_chronicle_engine()) as session:
            latest = session.exec(
                select(ChronicleKeyframe)
                .order_by(ChronicleKeyframe.received_at.desc())  # type: ignore[attr-defined]
                .limit(1)
            ).first()
            if latest is None:
                return {"status": "empty", "session": None}

            sid = latest.session_id
            count = session.exec(
                select(func.count()).select_from(ChronicleKeyframe).where(
                    ChronicleKeyframe.session_id == sid
                )
            ).one()
            event_count = session.exec(
                select(func.count()).select_from(ChronicleKeyframe).where(
                    ChronicleKeyframe.session_id == sid,
                    ChronicleKeyframe.has_events == True,  # noqa: E712
                )
            ).one()
            first_ts = session.exec(
                select(func.min(ChronicleKeyframe.ts)).where(
                    ChronicleKeyframe.session_id == sid
                )
            ).one()

            recent_events = [
                {
                    "keyframe": row.keyframe,
                    "lifetime_keyframe": row.lifetime_keyframe,
                    "ts": str(row.ts),
                    "template_id": row.template_id,
                    "events": json.loads(row.events_json or "[]"),
                }
                for row in session.exec(
                    select(ChronicleKeyframe)
                    .where(
                        ChronicleKeyframe.session_id == sid,
                        ChronicleKeyframe.has_events == True,  # noqa: E712
                    )
                    .order_by(ChronicleKeyframe.keyframe.desc())  # type: ignore[attr-defined]
                    # window must reach back past one template_swap_interval
                    # (mutations dominate event rows; ~62/1000 kf + swaps/injections)
                    .limit(80)
                )
            ]

            return {
                "status": "recording",
                "session": {
                    "session_id": sid,
                    "started_at": str(first_ts),
                    "last_record_at": str(latest.ts),
                    "keyframes_recorded": int(count),
                    "keyframes_with_events": int(event_count),
                    "latest_keyframe": latest.keyframe,
                    "lifetime_keyframe": latest.lifetime_keyframe,
                    "latest_template": latest.template_id,
                    "latest_prompt": latest.prompt,
                    "latest_components": json.loads(latest.components_json or "{}"),
                    "latest_thumb": latest.thumb_path,
                },
                "recent_events": recent_events,
                "store": self.get_stats(),
            }

    async def current_snapshot(self) -> dict[str, Any]:
        return await asyncio.to_thread(self.current_snapshot_sync)

    def export_records_sync(
        self,
        session_id: Optional[str] = None,
        since_id: int = 0,
        limit: int = 500,
        include_embeddings: bool = True,
    ) -> dict[str, Any]:
        """
        Paginated raw-record export for offline analysis (Phase 2 threshold
        tuning). Cursor on the autoincrement id: pass next_since_id back as
        since_id until count == 0.
        """
        limit = max(1, min(int(limit), 2000))
        with Session(get_chronicle_engine()) as session:
            query = select(ChronicleKeyframe).where(ChronicleKeyframe.id > since_id)  # type: ignore[operator]
            if session_id:
                query = query.where(ChronicleKeyframe.session_id == session_id)
            rows = session.exec(
                query.order_by(ChronicleKeyframe.id).limit(limit)  # type: ignore[arg-type]
            ).all()

            records = []
            for r in rows:
                rec: dict[str, Any] = {
                    "id": r.id,
                    "session_id": r.session_id,
                    "keyframe": r.keyframe,
                    "lifetime_keyframe": r.lifetime_keyframe,
                    "sequence": r.sequence,
                    "ts": str(r.ts),
                    "received_at": str(r.received_at),
                    "prompt": r.prompt,
                    "template_id": r.template_id,
                    "components": json.loads(r.components_json or "{}"),
                    "events": json.loads(r.events_json or "[]"),
                    "thumb_path": r.thumb_path,
                }
                if include_embeddings:
                    rec["phash"] = r.phash
                    rec["color_hist"] = unpack_f16(r.color_hist_f16) or _json_list(
                        r.color_hist_json
                    )
                    rec["latent_pool"] = unpack_f16(r.latent_pool_f16) or _json_list(
                        r.latent_pool_json
                    )
                records.append(rec)

            return {
                "records": records,
                "count": len(records),
                "next_since_id": rows[-1].id if rows else since_id,
            }

    async def export_records(self, **kwargs) -> dict[str, Any]:
        return await asyncio.to_thread(self.export_records_sync, **kwargs)

    def get_stats(self) -> dict[str, float]:
        return {
            "batches_ingested": self.batches_ingested,
            "batches_rejected": self.batches_rejected,
            "batches_dropped": self.batches_dropped,
            "records_ingested": self.records_ingested,
            "thumbs_written": self.thumbs_written,
            "retention_days": self.retention_days,
        }


def _json_list(raw: Optional[str]) -> Optional[list[float]]:
    """Legacy JSON vector column -> list; missing or unparseable -> None."""
    if not raw:
        return None
    try:
        value = json.loads(raw)
    except ValueError:
        return None
    return value if isinstance(value, list) else None


def _json_to_f16(raw: Optional[str]) -> Optional[bytes]:
    """Legacy JSON vector -> f16 blob; unparseable -> None (dropped, not retried)."""
    return pack_f16(_json_list(raw))


_STORE: Optional[ChronicleStore] = None


def get_chronicle_store() -> ChronicleStore:
    global _STORE
    if _STORE is None:
        _STORE = ChronicleStore()
    return _STORE
