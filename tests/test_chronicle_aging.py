"""
Chronicle aging: what happens when raw rows and thumbnails pass the retention
window. Permanent memory (eras, scenes, keep/, strata/) must survive intact,
and the page must say honestly what has faded.
"""
import json
from datetime import datetime, timedelta, timezone

from sqlalchemy import text
from sqlmodel import Session, select

import aethera.dreams.chronicle.models as models
from aethera.api import chronicle as api
from aethera.dreams.chronicle import strata
from aethera.dreams.chronicle.models import ChronicleEra, ChronicleScene
from aethera.dreams.chronicle.segmenter import Segmenter
from aethera.dreams.chronicle.store import ChronicleStore

from test_chronicle_phase2 import T0, db, dream, ingest  # noqa: F401  (db is a fixture)


def age_rows(engine, where="1=1", days=30):
    old = datetime.now(timezone.utc) - timedelta(days=days)
    with engine.begin() as c:
        c.execute(text(f"UPDATE chronicle_keyframe SET received_at = :t WHERE {where}"), {"t": old})


def sweep(monkeypatch=None):
    store = ChronicleStore()
    store.retention_days = 14
    return store._retention_sweep_sync()


def test_sweep_never_empties_the_table_so_ids_keep_growing(db):
    ingest(dream(first_events=[{"kind": "session_start"}]))
    with Session(db) as s:
        top = s.execute(text("SELECT MAX(id) FROM chronicle_keyframe")).scalar()
    age_rows(db)                      # the dream has been off for a month
    rows, _ = sweep()
    assert rows == 119
    ingest(dream(start_kf=500, n=10, t=T0 + 40 * 86400, session="s2",
                 first_events=[{"kind": "session_start"}]))
    with Session(db) as s:
        ids = [r[0] for r in s.execute(text("SELECT id FROM chronicle_keyframe ORDER BY id"))]
    assert ids[0] == top and min(ids[1:]) == top + 1, "new rows continue after the old ids"


def test_sweep_removes_rows_before_their_files_and_spares_permanent_memory(db):
    ingest(dream(first_events=[{"kind": "session_start"}]))
    Segmenter().run_pass()
    strata.run_pass()
    with Session(db) as s:
        keeps = [sc.rep_path for sc in s.exec(select(ChronicleScene)).all()]
    tiles = list(models.strata_dir().rglob("*.webp"))
    assert keeps and tiles

    age_rows(db)
    rows, thumbs = sweep()
    assert rows == 119 and thumbs >= 19
    assert all((models.keep_dir() / k).is_file() for k in keeps)
    assert all(t.is_file() for t in tiles)
    with Session(db) as s:
        assert len(s.exec(select(ChronicleEra)).all()) == 1
        assert len(s.exec(select(ChronicleScene)).all()) == 2


def test_a_missing_thumbnail_keeps_the_scene_image_it_already_had(db):
    ingest(dream(first_events=[{"kind": "session_start"}]))
    seg = Segmenter()
    seg.run_pass()
    with Session(db) as s:
        before = {sc.idx: (sc.rep_path, sc.palette_json) for sc in s.exec(select(ChronicleScene)).all()}
    # every thumbnail vanishes under a pass that still sees the rows
    for f in models.CHRONICLE_THUMBS_DIR.rglob("*.webp"):
        f.unlink()
    ingest(dream(start_kf=120, n=6, t=T0 + 600))     # something new, so the pass re-derives
    seg.run_pass()
    with Session(db) as s:
        after = {sc.idx: (sc.rep_path, sc.palette_json) for sc in s.exec(select(ChronicleScene)).all()}
    for idx, (rep, palette) in before.items():
        assert after[idx][0] == rep and (models.keep_dir() / rep).is_file()
        # re-read from the kept WebP: same dominant colour, not blanked
        assert json.loads(after[idx][1])[0] == json.loads(palette)[0]


def test_a_resting_dream_does_not_rewrite_its_open_era(db):
    ingest(dream(first_events=[{"kind": "session_start"}]))
    seg = Segmenter()
    seg.run_pass()
    keep = next(models.keep_dir().rglob("*.webp"))
    stamp = keep.stat().st_mtime_ns
    assert seg.run_pass() == {"closed": 0, "open": 0, "cursor": 120}
    assert keep.stat().st_mtime_ns == stamp


def test_an_era_that_outlives_its_rows_closes_and_the_next_one_continues(db):
    ingest(dream(first_events=[{"kind": "session_start"}]))
    seg = Segmenter()
    seg.run_pass()
    age_rows(db, "keyframe < 60")
    sweep()
    ingest(dream(start_kf=120, n=30, t=T0 + 600))    # same template, same session: still dreaming
    seg.run_pass()
    with Session(db) as s:
        eras = s.exec(select(ChronicleEra).order_by(ChronicleEra.start_ts)).all()
    assert [e.closed for e in eras] == [True, False]
    assert eras[0].kf_count == 120, "frozen as last derived"
    assert eras[1].opened_by == "continued"


def test_the_drawer_says_when_an_era_has_partly_faded(db):
    ingest(dream(first_events=[{"kind": "session_start"}]))
    Segmenter().run_pass()
    strata.run_pass()
    (era_id,) = [e["id"] for e in api.build_timeline(None, 24)["eras"]]
    d = api.build_era(era_id)
    assert not d["partly_faded"] and len(d["moments"]) == 20

    age_rows(db, "keyframe < 60")
    sweep()
    d = api.build_era(era_id)
    assert d["partly_faded"] and len(d["moments"]) == 10
    assert d["raw_note_days"] > 0

    age_rows(db)
    sweep()
    d = api.build_era(era_id)
    assert d["moments"] == [] and d["scenes"], "fully faded: the scenes remain"
