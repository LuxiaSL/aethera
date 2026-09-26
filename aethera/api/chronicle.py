"""
The chronicle page (/dreams/chronicle) and its read API.

  GET /dreams/chronicle                       the page
  GET /api/dreams/chronicle/timeline          strata tiles + eras + scenes for a span of
                                              recorded hours (newest first; ?before= pages back)
  GET /api/dreams/chronicle/era/{id}          one era in full: scenes, every thumbnailed
                                              moment with its prompt, words changed, recalls
  GET /dreams/chronicle/media/{kind}/{path}   thumbs (14 d), keep (forever), strata (forever)

Monitoring-style endpoints: none of them wake the GPU.
"""

import asyncio
import json
import logging
import time
from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from sqlalchemy import text
from sqlmodel import Session, select

from aethera.dreams.chronicle import models, strata
from aethera.dreams.chronicle.models import ChronicleEra, ChronicleScene, get_chronicle_engine
from aethera.utils.templates import templates

logger = logging.getLogger(__name__)
router = APIRouter()

MAX_HOURS = 48
RAW_RETENTION_NOTE_DAYS = 14

# Editorial landmarks shown in the core. data/chronicle/annotations.json
# ([{"t": unix, "text": "..."}]) replaces this list when present.
DEFAULT_ANNOTATIONS = [
    {"t": 1790344689.0, "text": "the colour fix — the magenta world ends here"},
]

# The page makes a burst of small requests (one per era hovered); give the
# chronicle its own window instead of sharing the stream's 60/min budget.
_RATE = 240
_WINDOW = 60.0
_hits: dict[str, deque] = defaultdict(deque)


def _limit(request: Request) -> None:
    ip = request.client.host if request.client else "unknown"
    now = time.monotonic()
    q = _hits[ip]
    while q and now - q[0] > _WINDOW:
        q.popleft()
    if len(q) >= _RATE:
        raise HTTPException(status_code=429, detail="slow down")
    q.append(now)
    if len(_hits) > 5000:  # forget idle visitors
        for k in [k for k, v in _hits.items() if not v or now - v[-1] > _WINDOW]:
            _hits.pop(k, None)


def _unix(dt: datetime) -> float:
    return round(dt.replace(tzinfo=timezone.utc).timestamp(), 1)


def _media(kind: str, rel: Optional[str], version: Optional[float] = None) -> Optional[str]:
    if not rel:
        return None
    url = f"/dreams/chronicle/media/{kind}/{rel}"
    return f"{url}?v={int(version)}" if version else url


def _mtime(root: Path, rel: Optional[str]) -> Optional[float]:
    """Version stamp for files that can be rewritten (an open era's scene images)."""
    try:
        return (root / rel).stat().st_mtime if rel else None
    except OSError:
        return None


def _annotations(t0: float, t1: float) -> list:
    path = models.CHRONICLE_THUMBS_DIR.parent / "annotations.json"
    items = DEFAULT_ANNOTATIONS
    try:
        if path.is_file():
            items = json.loads(path.read_text())
    except Exception:
        logger.debug("annotations.json unreadable", exc_info=True)
    return [a for a in items if isinstance(a, dict) and t0 <= float(a.get("t", 0)) <= t1]


def _scene_json(s: ChronicleScene) -> dict:
    return {
        "i": s.idx, "t0": _unix(s.start_ts), "t1": _unix(s.end_ts), "kf": s.kf_count,
        "rep": _media("keep", s.rep_path, _mtime(models.keep_dir(), s.rep_path)),
        "palette": json.loads(s.palette_json or "[]"),
        "prompt": s.prompt,
    }


def _era_json(e: ChronicleEra, scenes: list) -> dict:
    return {
        "id": e.id, "t0": _unix(e.start_ts), "t1": _unix(e.end_ts), "template": e.template_id,
        "title": e.title, "kf": e.kf_count, "mutations": e.mutations, "recalls": e.recalls,
        "magenta": e.magenta, "opened_by": e.opened_by, "open": not e.closed,
        "scenes": [_scene_json(s) for s in scenes],
    }


def build_timeline(before: Optional[float], hours: int) -> dict[str, Any]:
    hours = max(1, min(int(hours), MAX_HOURS))
    tiles = strata.list_tiles(before=strata.utc_naive(before) if before else None, limit=hours)
    out: dict[str, Any] = {"now": round(time.time(), 1), "tiles": [], "eras": [],
                           "annotations": [], "older": None, "live": None}
    if not tiles:
        return out
    t_from, t_to = tiles[0][0], tiles[-1][0] + timedelta(hours=1)
    out["tiles"] = [{"t": _unix(h), "url": _media("strata", strata.tile_rel(h), p.stat().st_mtime)}
                    for h, p in tiles]
    older = strata.list_tiles(before=t_from, limit=1)
    out["older"] = _unix(older[0][0]) if older else None

    with Session(get_chronicle_engine()) as session:
        eras = session.exec(
            select(ChronicleEra).where(ChronicleEra.end_ts >= t_from, ChronicleEra.start_ts < t_to)
            .order_by(ChronicleEra.start_ts)
        ).all()
        scenes: dict[int, list] = defaultdict(list)
        if eras:
            for s in session.exec(
                select(ChronicleScene).where(ChronicleScene.era_id.in_([e.id for e in eras]))  # type: ignore[attr-defined]
                .order_by(ChronicleScene.era_id, ChronicleScene.idx)
            ).all():
                scenes[s.era_id].append(s)
        out["eras"] = [_era_json(e, scenes[e.id]) for e in eras]
        first = session.exec(select(ChronicleEra.start_ts).order_by(ChronicleEra.start_ts)).first()
        out["since"] = _unix(first) if first else None
        out["era_count"] = session.execute(text("SELECT COUNT(*) FROM chronicle_era")).scalar() or 0

        if before is None:
            row = session.execute(text(
                "SELECT ts, thumb_path, prompt, template_id FROM chronicle_keyframe"
                " WHERE thumb_path IS NOT NULL ORDER BY id DESC LIMIT 1"
            )).first()
            if row:
                ts = row[0] if isinstance(row[0], datetime) else datetime.fromisoformat(str(row[0]))
                out["live"] = {"t": _unix(ts), "thumb": _media("thumbs", row[1]),
                               "prompt": row[2], "template": row[3]}
    out["annotations"] = _annotations(_unix(t_from), _unix(t_to))
    return out


def build_era(era_id: int) -> Optional[dict[str, Any]]:
    with Session(get_chronicle_engine()) as session:
        era = session.get(ChronicleEra, era_id)
        if era is None:
            return None
        scenes = session.exec(
            select(ChronicleScene).where(ChronicleScene.era_id == era.id).order_by(ChronicleScene.idx)
        ).all()
        # ts bounds as well as ids: an era's frames are exactly its own
        # even if row ids were ever handed out twice
        rows = session.execute(text(
            "SELECT ts, thumb_path, prompt FROM chronicle_keyframe"
            " WHERE id BETWEEN :a AND :b AND ts BETWEEN :t0 AND :t1"
            " AND thumb_path IS NOT NULL ORDER BY id"
        ).bindparams(a=era.first_row_id, b=era.last_row_id,
                     t0=era.start_ts - timedelta(seconds=1),
                     t1=era.end_ts + timedelta(seconds=1))).all()
        first_left = session.execute(text(
            "SELECT MIN(id) FROM chronicle_keyframe WHERE id BETWEEN :a AND :b"
        ).bindparams(a=era.first_row_id, b=era.last_row_id)).scalar()
    prompts: list[str] = []
    index: dict[str, int] = {}
    moments = []
    for ts, thumb, prompt in rows:
        t = ts if isinstance(ts, datetime) else datetime.fromisoformat(str(ts))
        p = prompt or ""
        if p not in index:
            index[p] = len(prompts)
            prompts.append(p)
        moments.append([_unix(t), _media("thumbs", thumb), index[p]])
    detail = _era_json(era, scenes)
    detail.update({
        "words": json.loads(era.words_json or "[]"),
        "recall_list": json.loads(era.recalls_json or "[]"),
        "moments": moments, "prompts": prompts,
        "raw_note_days": _retention_days(),
        # some raw rows remain but the era's opening ones have aged out
        "partly_faded": first_left is not None and first_left != era.first_row_id,
    })
    return detail


def _retention_days() -> float:
    """The raw window in force now (the disk guard can shorten it)."""
    try:
        from aethera.dreams.chronicle.store import get_chronicle_store
        return get_chronicle_store().retention_days
    except Exception:
        return RAW_RETENTION_NOTE_DAYS


@router.get("/dreams/chronicle", response_class=HTMLResponse)
async def chronicle_page(request: Request):
    return templates.TemplateResponse(
        request=request, name="dreams/chronicle.html",
        context={"request": request, "title": "chronicle | æthera"},
    )


@router.get("/api/dreams/chronicle/timeline")
async def chronicle_timeline(request: Request, before: Optional[float] = None, hours: int = 24):
    _limit(request)
    try:
        return JSONResponse(await asyncio.to_thread(build_timeline, before, hours))
    except Exception:
        logger.warning("Chronicle timeline failed", exc_info=True)
        return JSONResponse({"status": "error"}, status_code=500)


@router.get("/api/dreams/chronicle/era/{era_id}")
async def chronicle_era(request: Request, era_id: int):
    _limit(request)
    try:
        detail = await asyncio.to_thread(build_era, era_id)
    except Exception:
        logger.warning("Chronicle era detail failed", exc_info=True)
        return JSONResponse({"status": "error"}, status_code=500)
    if detail is None:
        return JSONResponse({"status": "not found"}, status_code=404)
    return JSONResponse(detail)


_MEDIA_ROOTS = {
    "thumbs": lambda: models.CHRONICLE_THUMBS_DIR,
    "keep": models.keep_dir,
    "strata": models.strata_dir,
}


@router.get("/dreams/chronicle/media/{kind}/{rel:path}")
async def chronicle_media(kind: str, rel: str):
    root_fn = _MEDIA_ROOTS.get(kind)
    if root_fn is None:
        raise HTTPException(status_code=404)
    root = Path(root_fn()).resolve()
    path = (root / rel).resolve()
    if root not in path.parents or not path.is_file() or path.suffix != ".webp":
        raise HTTPException(status_code=404)
    # thumbs never change; keep and strata URLs carry ?v=mtime
    return FileResponse(path, media_type="image/webp",
                        headers={"Cache-Control": "public, max-age=31536000, immutable"})
