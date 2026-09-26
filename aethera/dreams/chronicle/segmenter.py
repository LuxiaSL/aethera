"""
Segmenter - eras and scenes from the raw keyframe records (chronicle Phase 2).

Eras come nearly free under anchor walking: a template switch (or a fresh
boot, or a long silence) opens one. Scenes are found inside each era: the
picture only restructures at a re-anchor (mutation, recall, swap), so each
stretch between re-anchors gets a mean pooled latent, and a scene begins
where a stretch lands far from its predecessor (a jump) or where the
picture has drifted far from how the current scene opened. Scenes shorter
than MIN_SCENE_KF fold into their nearer neighbour.

Thresholds were tuned by eye on the 2026-09-25/26 record (dream_gen
recordings/chronicle/tools/scenes.py): era 85 reads as 11 scenes, a
restless era like 102 as 9.

Each pass is incremental: finished eras are written once, the open (last)
era is re-derived from its rows every pass. Pure Python + Pillow — the
blog process takes no numpy/torch dependency. Latent math follows
dream_gen backend/cache/latent_pool.py (pooled VAE latent, cosine).
"""

import json
import logging
import math
import re
import struct
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterator, Optional

from PIL import Image
from sqlalchemy import text
from sqlmodel import Session, select

from . import models
from .models import ChronicleEra, ChronicleMeta, ChronicleScene, get_chronicle_engine

logger = logging.getLogger(__name__)

SCENE_JUMP = 0.15  # cosine distance between consecutive re-anchor stretches
SCENE_DRIFT = 0.30  # cosine distance from the scene's opening stretch
MIN_CUT_KF = 30  # no cut closer than this to the previous one
MIN_SCENE_KF = 48  # shorter scenes fold into a neighbour
MAX_SCENES = 16
SILENCE_S = 30 * 60  # a gap this long opens a new era on its own
BATCH_ROWS = 2000
HUE_MAGENTA = range(23, 32)  # magenta-crimson hue bins of the 96-d HSV histogram

REANCHOR = {"mutation", "forced_mutation", "cache_injection", "seed_injection"}
# Component slots in the order they make good era titles (identity first)
TITLE_SLOTS = [
    "subject_form", "material_substance", "setting_location", "phenomenon_pattern",
    "spatial_logic", "texture_density", "medium_render", "scale_perspective",
]
_MUTATION_RE = re.compile(r"^(\w+): '(.*)' -> '(.*)'$")
CURSOR_KEY = "segmenter_cursor"


@dataclass
class Row:
    id: int
    session_id: str
    lifetime_kf: Optional[int]
    ts: float
    prompt: str
    template_id: str
    components: dict
    events: list
    thumb_path: Optional[str]
    latent: Optional[tuple]
    magenta: Optional[float]

    @property
    def kinds(self) -> set:
        return {e.get("kind") for e in self.events if isinstance(e, dict)}


@dataclass
class EraBuild:
    rows: list = field(default_factory=list)
    opened_by: str = "session_start"


# --------------------------------------------------------------------------- #
# Vector helpers (128-d, pure Python)                                         #
# --------------------------------------------------------------------------- #

def _unit(v: list) -> Optional[list]:
    n = math.sqrt(sum(x * x for x in v))
    return [x / n for x in v] if n > 1e-8 else None


def _mean_unit(vecs: list) -> Optional[list]:
    if not vecs:
        return None
    dim = len(vecs[0])
    acc = [0.0] * dim
    for v in vecs:
        for i, x in enumerate(v):
            acc[i] += x
    return _unit(acc)


def _cos_d(a: list, b: list) -> float:
    return 1.0 - sum(x * y for x, y in zip(a, b))


def _vec(blob: Optional[bytes], legacy: Optional[str]) -> Optional[tuple]:
    if blob and len(blob) % 2 == 0:
        return struct.unpack(f"<{len(blob) // 2}e", blob)
    if legacy:
        try:
            return tuple(json.loads(legacy))
        except ValueError:
            return None
    return None


def _ts(dt: datetime) -> float:
    return dt.replace(tzinfo=timezone.utc).timestamp() if dt.tzinfo is None else dt.timestamp()


def _dt(ts: float) -> datetime:
    return datetime.fromtimestamp(ts, tz=timezone.utc).replace(tzinfo=None)


# --------------------------------------------------------------------------- #
# Reading                                                                     #
# --------------------------------------------------------------------------- #

def _iter_rows(session: Session, start_id: int) -> Iterator[Row]:
    last = start_id - 1
    while True:
        batch = session.execute(text(
            "SELECT id, session_id, lifetime_keyframe, ts, prompt, template_id, components_json,"
            " events_json, thumb_path, latent_pool_f16, latent_pool_json, color_hist_f16, color_hist_json"
            " FROM chronicle_keyframe WHERE id > :last ORDER BY id LIMIT :n"
        ).bindparams(last=last, n=BATCH_ROWS)).all()
        if not batch:
            return
        for r in batch:
            hist = _vec(r[11], r[12])
            ts = r[3] if isinstance(r[3], datetime) else datetime.fromisoformat(str(r[3]))
            try:
                components = json.loads(r[6] or "{}")
                events = json.loads(r[7] or "[]")
            except ValueError:
                components, events = {}, []
            yield Row(
                id=r[0], session_id=r[1] or "", lifetime_kf=r[2], ts=_ts(ts),
                prompt=r[4] or "", template_id=r[5] or "",
                components=components if isinstance(components, dict) else {},
                events=events if isinstance(events, list) else [],
                thumb_path=r[8], latent=_vec(r[9], r[10]),
                magenta=sum(hist[i] for i in HUE_MAGENTA) if hist and len(hist) >= 32 else None,
            )
        last = batch[-1][0]


def _split_eras(rows: Iterator[Row], first_opened_by: str = "session_start") -> Iterator[EraBuild]:
    """Group rows into eras; yields each era as soon as the next one begins.
    first_opened_by: why the first era began (a pass resuming an open era
    passes that era's own reason)."""
    cur: Optional[EraBuild] = None
    for row in rows:
        opened = None
        if cur is None:
            opened = first_opened_by
        else:
            prev = cur.rows[-1]
            kinds = row.kinds
            if "template_switch" in kinds:
                opened = "template_switch"
            elif row.ts - prev.ts > SILENCE_S:
                opened = "silence"
            elif row.session_id != prev.session_id and (
                "session_start" in kinds or row.template_id != prev.template_id
            ):
                opened = "session_start" if "session_start" in kinds else "resume"
            elif row.template_id and prev.template_id and row.template_id != prev.template_id:
                opened = "template_switch"
        if opened is not None:
            if cur is not None:
                yield cur
            cur = EraBuild(opened_by=opened)
        cur.rows.append(row)
    if cur is not None:
        yield cur


# --------------------------------------------------------------------------- #
# Deriving                                                                    #
# --------------------------------------------------------------------------- #

def segment_scenes(rows: list) -> list:
    """Scene start indices into rows (always begins with 0)."""
    marks = [i for i, r in enumerate(rows) if r.kinds & REANCHOR and i > 0]
    bounds = [0] + marks + [len(rows)]
    stretches = [(a, b) for a, b in zip(bounds, bounds[1:]) if b > a]
    means = [_mean_unit([r.latent for r in rows[a:b] if r.latent]) for a, b in stretches]

    cuts = [0]
    opening = means[0] if means else None
    for k in range(1, len(stretches)):
        m, prev = means[k], means[k - 1]
        if m is None:
            continue
        if opening is None:
            opening = m
            continue
        jump = _cos_d(m, prev) if prev is not None else 0.0
        drift = _cos_d(m, opening)
        start = stretches[k][0]
        if (jump > SCENE_JUMP or drift > SCENE_DRIFT) and start - cuts[-1] >= MIN_CUT_KF:
            cuts.append(start)
            opening = m
    return _merge_short(rows, cuts)[:MAX_SCENES]


def _merge_short(rows: list, cuts: list) -> list:
    def mean(a: int, b: int):
        return _mean_unit([r.latent for r in rows[a:b] if r.latent])

    cuts = list(cuts)
    while len(cuts) > 1:
        bounds = cuts + [len(rows)]
        lens = [b - a for a, b in zip(bounds, bounds[1:])]
        i = min(range(len(lens)), key=lens.__getitem__)
        if lens[i] >= MIN_SCENE_KF:
            break
        me = mean(bounds[i], bounds[i + 1])
        prev = mean(bounds[i - 1], bounds[i]) if i > 0 else None
        nxt = mean(bounds[i + 1], bounds[i + 2]) if i + 2 < len(bounds) else None
        d_prev = _cos_d(me, prev) if (me and prev) else math.inf
        d_next = _cos_d(me, nxt) if (me and nxt) else math.inf
        if i == 0 or (d_next < d_prev and i + 1 < len(cuts)):
            del cuts[i + 1]
        else:
            del cuts[i]
    return cuts


def era_title(template_id: str, rows: list) -> str:
    """template · the two most persistent identity words across the era."""
    picks = []
    for slot in TITLE_SLOTS:
        counts: dict = {}
        for r in rows:
            w = r.components.get(slot)
            if w:
                counts[w] = counts.get(w, 0) + 1
        if counts:
            word, n = max(counts.items(), key=lambda kv: kv[1])
            picks.append((n, TITLE_SLOTS.index(slot), word))
    picks.sort(key=lambda p: (-p[0], p[1]))
    words = [w for _, _, w in picks[:2]]
    return " · ".join([template_id.replace("_", " ")] + words) if template_id else " · ".join(words)


def _word_changes(rows: list) -> list:
    out = []
    for r in rows:
        for e in r.events:
            if isinstance(e, dict) and e.get("kind") in ("mutation", "forced_mutation"):
                m = _MUTATION_RE.match(e.get("detail") or "")
                if m:
                    out.append([round(r.ts, 1), m.group(1), m.group(2), m.group(3)])
    return out


def _recalls(rows: list) -> list:
    return [[round(r.ts, 1), (e.get("detail") or "")[:240]]
            for r in rows for e in r.events
            if isinstance(e, dict) and e.get("kind") == "cache_injection"]


def palette_of(img: Image.Image, n: int = 5) -> list:
    q = img.convert("RGB").resize((64, 32)).quantize(colors=n, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette() or []
    counts = sorted(q.getcolors() or [], reverse=True)
    return ["#%02x%02x%02x" % tuple(pal[i * 3:i * 3 + 3]) for _, i in counts[:n]]


def _representative(rows: list) -> Optional[Row]:
    """A thumbnailed row near the scene's middle (past its opening glide)."""
    with_thumb = [r for r in rows if r.thumb_path]
    if not with_thumb:
        return None
    mid = rows[0].ts + 0.55 * (rows[-1].ts - rows[0].ts)
    return min(with_thumb, key=lambda r: abs(r.ts - mid))


# --------------------------------------------------------------------------- #
# Writing                                                                     #
# --------------------------------------------------------------------------- #

class Segmenter:
    def __init__(self):
        self.eras_written = 0
        self.passes = 0

    def run_pass(self) -> dict:
        engine = get_chronicle_engine()
        with Session(engine) as session:
            cursor = int((session.get(ChronicleMeta, CURSOR_KEY) or ChronicleMeta(key=CURSOR_KEY, value="0")).value)
            open_era = session.exec(
                select(ChronicleEra).where(ChronicleEra.closed == False)  # noqa: E712
                .order_by(ChronicleEra.first_row_id)
            ).first()
            if open_era is not None and session.execute(
                text("SELECT 1 FROM chronicle_keyframe WHERE id = :i").bindparams(i=open_era.first_row_id)
            ).first() is None:
                # its rows aged out while the dream rested: nothing left to re-derive
                open_era.closed = True
                session.add(open_era)
                open_era = None
            start_id = open_era.first_row_id if open_era else cursor + 1

            closed = updated = 0
            last_id = cursor
            pending: Optional[EraBuild] = None
            first_reason = open_era.opened_by if open_era and open_era.opened_by else "session_start"
            for build in _split_eras(_iter_rows(session, start_id), first_reason):
                if pending is not None:
                    self._write_era(session, pending, closed=True, reuse=open_era)
                    open_era = None
                    closed += 1
                pending = build
                last_id = build.rows[-1].id
            if pending is not None:
                self._write_era(session, pending, closed=False, reuse=open_era)
                updated += 1
                last_id = max(last_id, pending.rows[-1].id)

            meta = session.get(ChronicleMeta, CURSOR_KEY) or ChronicleMeta(key=CURSOR_KEY)
            meta.value = str(last_id)
            session.add(meta)
            session.commit()
        self.passes += 1
        self.eras_written += closed
        return {"closed": closed, "open": updated, "cursor": last_id}

    def _write_era(self, session: Session, build: EraBuild, closed: bool,
                   reuse: Optional[ChronicleEra]) -> None:
        rows = build.rows
        era = reuse if (reuse is not None and reuse.first_row_id == rows[0].id) else None
        if era is None:
            era = session.exec(
                select(ChronicleEra).where(ChronicleEra.first_row_id == rows[0].id)
            ).first() or ChronicleEra(first_row_id=rows[0].id, start_ts=_dt(rows[0].ts), end_ts=_dt(rows[-1].ts))
        mags = [r.magenta for r in rows if r.magenta is not None]
        template = next((r.template_id for r in rows if r.template_id), "")
        lifetimes = [r.lifetime_kf for r in rows if r.lifetime_kf is not None]
        era.session_id = rows[0].session_id
        era.template_id = template
        era.start_ts, era.end_ts = _dt(rows[0].ts), _dt(rows[-1].ts)
        era.last_row_id = rows[-1].id
        era.kf_count = len(rows)
        era.lifetime_kf_start = min(lifetimes) if lifetimes else None
        era.lifetime_kf_end = max(lifetimes) if lifetimes else None
        era.mutations = sum(1 for r in rows for k in r.kinds if k in ("mutation", "forced_mutation"))
        era.recalls = sum(1 for r in rows if "cache_injection" in r.kinds)
        era.opened_by = build.opened_by
        era.closed = closed
        era.title = era_title(template, rows)
        era.magenta = round(sum(mags) / len(mags), 3) if mags else None
        era.words_json = json.dumps(_word_changes(rows), separators=(",", ":"))
        era.recalls_json = json.dumps(_recalls(rows), separators=(",", ":"))
        session.add(era)
        session.flush()  # assigns era.id

        for old in session.exec(select(ChronicleScene).where(ChronicleScene.era_id == era.id)).all():
            session.delete(old)
        cuts = segment_scenes(rows)
        keep_names = set()
        for idx, (a, b) in enumerate(zip(cuts, cuts[1:] + [len(rows)])):
            part = rows[a:b]
            rep = _representative(part)
            rep_path, palette = self._keep(era, idx, rep)
            if rep_path:
                keep_names.add(Path(rep_path).name)
            session.add(ChronicleScene(
                era_id=era.id, idx=idx, start_ts=_dt(part[0].ts), end_ts=_dt(part[-1].ts),
                kf_count=len(part), prompt=(rep or part[0]).prompt[:600], rep_path=rep_path,
                palette_json=json.dumps(palette),
            ))
        self._drop_stale_keeps(era, keep_names)

    @staticmethod
    def _keep_folder(era: ChronicleEra) -> str:
        return era.start_ts.strftime("%Y%m%d")

    def _keep(self, era: ChronicleEra, idx: int, rep: Optional[Row]):
        """Copy the representative thumbnail into the permanent keep/ tree."""
        if rep is None or not rep.thumb_path:
            return None, []
        src = models.CHRONICLE_THUMBS_DIR / rep.thumb_path
        rel = f"{self._keep_folder(era)}/era{era.id}_s{idx:02d}.webp"
        dst = models.keep_dir() / rel
        try:
            with Image.open(src) as im:
                im = im.convert("RGB")
                palette = palette_of(im)
                dst.parent.mkdir(parents=True, exist_ok=True)
                im.save(dst, format="WEBP", quality=82)
            return rel, palette
        except Exception:
            logger.debug(f"Chronicle keep failed for {src}", exc_info=True)
            return None, []

    def _drop_stale_keeps(self, era: ChronicleEra, keep: set) -> None:
        folder = models.keep_dir() / self._keep_folder(era)
        if not folder.is_dir():
            return
        for f in folder.glob(f"era{era.id}_s*.webp"):
            if f.name not in keep:
                try:
                    f.unlink()
                except OSError:
                    pass


_SEGMENTER: Optional[Segmenter] = None


def get_segmenter() -> Segmenter:
    global _SEGMENTER
    if _SEGMENTER is None:
        _SEGMENTER = Segmenter()
    return _SEGMENTER
