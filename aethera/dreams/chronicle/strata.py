"""
Strata - the chronicle's core sample.

The dream lays its memory down like sediment: every ROW_S seconds becomes
one row of colour, the column-mean profile of that window's thumbnails
(middle half of the frame, where the subject sits), averaged. An hour is a
240-row tile; tiles are kept forever, so when the raw thumbnails age out
the day's strata remain. Thumbnails come every 30 s plus at every event,
so a row with none borrows its nearest neighbour up to HOLD_ROWS away;
longer silences stay transparent and the page shows them as "no record".

Tiles: strata/YYYYMMDD/HH.webp (UTC hour), 256 x 240, lossy WebP with alpha.
"""

import logging
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Iterable, Optional

from PIL import Image
from sqlalchemy import text
from sqlmodel import Session

from . import models
from .models import ChronicleMeta, get_chronicle_engine

logger = logging.getLogger(__name__)

ROW_S = 15
HOLD_ROWS = 2  # a row with no thumbnail borrows a neighbour this close
ROWS_PER_HOUR = 3600 // ROW_S
WIDTH = 256
CURSOR_KEY = "strata_cursor"


def tile_path(hour: datetime) -> Path:
    return models.strata_dir() / hour.strftime("%Y%m%d") / f"{hour:%H}.webp"


def tile_rel(hour: datetime) -> str:
    return f"{hour:%Y%m%d}/{hour:%H}.webp"


def _hour_floor(dt: datetime) -> datetime:
    return dt.replace(minute=0, second=0, microsecond=0)


def _row_strip(path: Path) -> Optional[Image.Image]:
    """One thumbnail -> a WIDTH x 1 strip: column means of its middle half."""
    try:
        with Image.open(path) as im:
            im = im.convert("RGB")
            w, h = im.size
            band = im.crop((0, h // 4, w, h - h // 4))
            return band.resize((WIDTH, 1), Image.BOX)
    except Exception:
        return None


def render_hour(session: Session, hour: datetime) -> Optional[Path]:
    """(Re)render one UTC hour's tile from its thumbnails. None if it has none."""
    end = hour + timedelta(hours=1)
    rows = session.execute(text(
        "SELECT ts, thumb_path FROM chronicle_keyframe"
        " WHERE thumb_path IS NOT NULL AND ts >= :a AND ts < :b ORDER BY ts"
    ).bindparams(a=hour.strftime("%Y-%m-%d %H:%M:%S"), b=end.strftime("%Y-%m-%d %H:%M:%S"))).all()
    buckets: list[list[Image.Image]] = [[] for _ in range(ROWS_PER_HOUR)]
    for ts, rel in rows:
        t = ts if isinstance(ts, datetime) else datetime.fromisoformat(str(ts))
        i = int((t - hour).total_seconds() // ROW_S)
        if 0 <= i < ROWS_PER_HOUR:
            strip = _row_strip(models.CHRONICLE_THUMBS_DIR / rel)
            if strip is not None:
                buckets[i].append(strip)
    if not any(buckets):
        return None
    rows_img: list[Optional[Image.Image]] = []
    for strips in buckets:
        if not strips:
            rows_img.append(None)
            continue
        stack = Image.new("RGB", (WIDTH, len(strips)))
        for j, s in enumerate(strips):
            stack.paste(s, (0, j))
        rows_img.append(stack.resize((WIDTH, 1), Image.BOX) if len(strips) > 1 else stack)
    tile = Image.new("RGBA", (WIDTH, ROWS_PER_HOUR), (0, 0, 0, 0))
    for i in range(ROWS_PER_HOUR):
        row = rows_img[i]
        if row is None:
            near = [rows_img[j] for d in range(1, HOLD_ROWS + 1) for j in (i - d, i + d)
                    if 0 <= j < ROWS_PER_HOUR and rows_img[j] is not None]
            row = near[0] if near else None
        if row is not None:
            tile.paste(row.convert("RGBA"), (0, i))
    out = tile_path(hour)
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = out.with_suffix(".tmp.webp")
    tile.save(tmp, format="WEBP", quality=88, method=6)
    tmp.replace(out)
    return out


def hours_touched(session: Session, after_id: int) -> tuple[set, int]:
    """UTC hours holding thumbnail rows newer than after_id, and the max id seen."""
    hours, last = set(), after_id
    while True:
        batch = session.execute(text(
            "SELECT id, ts FROM chronicle_keyframe WHERE id > :i AND thumb_path IS NOT NULL"
            " ORDER BY id LIMIT 5000"
        ).bindparams(i=last)).all()
        if not batch:
            return hours, last
        for rid, ts in batch:
            t = ts if isinstance(ts, datetime) else datetime.fromisoformat(str(ts))
            hours.add(_hour_floor(t))
        last = batch[-1][0]


def run_pass() -> dict:
    """Render every hour that gained thumbnails since the last pass."""
    engine = get_chronicle_engine()
    with Session(engine) as session:
        meta = session.get(ChronicleMeta, CURSOR_KEY) or ChronicleMeta(key=CURSOR_KEY, value="0")
        hours, last = hours_touched(session, int(meta.value or 0))
        rendered = 0
        for hour in sorted(hours):
            if render_hour(session, hour) is not None:
                rendered += 1
        meta.value = str(last)
        session.add(meta)
        session.commit()
    return {"rendered": rendered, "cursor": last}


def list_tiles(before: Optional[datetime] = None, limit: int = 24) -> list[tuple[datetime, Path]]:
    """The newest `limit` tiles strictly before `before` (UTC), oldest first."""
    root = models.strata_dir()
    found = []
    if root.is_dir():
        for day in sorted(root.iterdir(), reverse=True):
            if not day.is_dir():
                continue
            for f in sorted(day.glob("??.webp"), reverse=True):
                try:
                    hour = datetime.strptime(f"{day.name}{f.stem}", "%Y%m%d%H")
                except ValueError:
                    continue
                if before is None or hour < before:
                    found.append((hour, f))
                    if len(found) >= limit:
                        return sorted(found)
    return sorted(found)


def iter_hours(a: datetime, b: datetime) -> Iterable[datetime]:
    h = _hour_floor(a)
    while h < b:
        yield h
        h += timedelta(hours=1)


def utc_naive(ts: float) -> datetime:
    return datetime.fromtimestamp(ts, tz=timezone.utc).replace(tzinfo=None)
