"""
ChronicleStore - ingest, retention, and snapshot queries

Ingest is called from the GPU websocket handler with raw batch bytes.
All DB/disk work runs in a worker thread (asyncio.to_thread) so the
stream hub's event loop is never blocked. A malformed batch logs and
drops - the chronicle must never take down the hub it lives beside.
"""

import asyncio
import base64
import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from sqlmodel import Session, select, func, delete

from .models import (
    CHRONICLE_THUMBS_DIR,
    ChronicleKeyframe,
    get_chronicle_engine,
)

logger = logging.getLogger(__name__)

# Raw records + thumbnails are kept this long (era summaries, once they
# exist in Phase 2+, are kept forever)
RETENTION_DAYS = 14
RETENTION_SWEEP_INTERVAL_S = 6 * 3600


class ChronicleStore:
    """Singleton owning chronicle ingest and retention."""

    def __init__(self):
        self.batches_ingested = 0
        self.batches_rejected = 0
        self.records_ingested = 0
        self.thumbs_written = 0
        self._retention_task: Optional[asyncio.Task] = None

    # ------------------------------------------------------------------ #
    # Ingest                                                             #
    # ------------------------------------------------------------------ #

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
            color_hist = rec.get("color_hist")
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
                    color_hist_json=(
                        json.dumps(color_hist, separators=(",", ":"))
                        if color_hist
                        else None
                    ),
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
            abs_path = CHRONICLE_THUMBS_DIR / day_dir
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
        if self._retention_task and not self._retention_task.done():
            self._retention_task.cancel()

    async def _retention_loop(self) -> None:
        while True:
            try:
                deleted_rows, deleted_thumbs = await asyncio.to_thread(
                    self._retention_sweep_sync
                )
                if deleted_rows or deleted_thumbs:
                    logger.info(
                        f"Chronicle retention: removed {deleted_rows} records, "
                        f"{deleted_thumbs} thumbnails (>{RETENTION_DAYS}d)"
                    )
            except asyncio.CancelledError:
                raise
            except Exception:
                logger.warning("Chronicle retention sweep failed", exc_info=True)
            await asyncio.sleep(RETENTION_SWEEP_INTERVAL_S)

    def _retention_sweep_sync(self) -> tuple[int, int]:
        cutoff = datetime.now(timezone.utc) - timedelta(days=RETENTION_DAYS)

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
                    path = CHRONICLE_THUMBS_DIR / rel
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
            for day_dir in CHRONICLE_THUMBS_DIR.iterdir():
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
                    rec["color_hist"] = (
                        json.loads(r.color_hist_json) if r.color_hist_json else None
                    )
                records.append(rec)

            return {
                "records": records,
                "count": len(records),
                "next_since_id": rows[-1].id if rows else since_id,
            }

    async def export_records(self, **kwargs) -> dict[str, Any]:
        return await asyncio.to_thread(self.export_records_sync, **kwargs)

    def get_stats(self) -> dict[str, int]:
        return {
            "batches_ingested": self.batches_ingested,
            "batches_rejected": self.batches_rejected,
            "records_ingested": self.records_ingested,
            "thumbs_written": self.thumbs_written,
        }


_STORE: Optional[ChronicleStore] = None


def get_chronicle_store() -> ChronicleStore:
    global _STORE
    if _STORE is None:
        _STORE = ChronicleStore()
    return _STORE
