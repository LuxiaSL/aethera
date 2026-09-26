"""
Chronicle Phase 2: eras, scenes, strata, and the page's read API.

A small synthetic dream is fed through the real ingest path (so latents are
f16 blobs and thumbnails land on disk exactly as in production), then the
segmenter and strata passes run over it.
"""
import asyncio
import base64
import io
import json
import math
import random
from datetime import datetime, timezone

import pytest
from PIL import Image
from sqlmodel import Session, create_engine, select

import aethera.dreams.chronicle.models as models
from aethera.api import chronicle as api
from aethera.dreams.chronicle import strata
from aethera.dreams.chronicle.models import ChronicleEra, ChronicleScene, init_chronicle_db
from aethera.dreams.chronicle.segmenter import Segmenter, era_title
from aethera.dreams.chronicle.store import ChronicleStore

T0 = datetime(2026, 9, 20, 10, 0, tzinfo=timezone.utc).timestamp()


@pytest.fixture
def db(tmp_path, monkeypatch):
    engine = create_engine(f"sqlite:///{tmp_path / 'c.sqlite'}",
                           connect_args={"check_same_thread": False, "timeout": 30})
    monkeypatch.setattr(models, "_ENGINE", engine)
    monkeypatch.setattr(models, "CHRONICLE_THUMBS_DIR", tmp_path / "thumbs")
    init_chronicle_db()
    return engine


def unit(seed):
    rng = random.Random(seed)
    v = [rng.gauss(0, 1) for _ in range(128)]
    n = math.sqrt(sum(x * x for x in v))
    return [x / n for x in v]


def near(v, seed, eps=0.03):
    w = [a + eps * b for a, b in zip(v, unit(seed))]
    n = math.sqrt(sum(x * x for x in w))
    return [round(x / n, 4) for x in w]


def thumb_b64(rgb):
    buf = io.BytesIO()
    Image.new("RGB", (256, 128), rgb).save(buf, format="WEBP", quality=90)
    return base64.b64encode(buf.getvalue()).decode()


def rec(session, kf, ts, template, latent, events=(), thumb=None, comps=None):
    r = {
        "session_id": session, "keyframe": kf, "lifetime_keyframe": 1000 + kf, "sequence": kf,
        "ts": ts, "prompt": f"{template} prompt {kf}", "template_id": template,
        "components": comps or {"subject_form": "lantern", "medium_render": "gouache"},
        "events": list(events), "latent_pool": latent, "color_hist": [0.0] * 96,
    }
    if thumb:
        r["thumb_webp_b64"] = thumb_b64(thumb)
    return r


def ingest(records):
    payload = json.dumps({"type": "chronicle_batch", "records": records}).encode()
    asyncio.run(ChronicleStore().ingest(payload))


def dream(start_kf=0, n=120, t=T0, session="s1", template="liminal", first_events=()):
    """120 kf: 60 near u then 60 near a far v, re-anchoring every 12 kf."""
    u, v = unit(1), unit(2)
    out = []
    for i in range(n):
        base = u if i < n // 2 else v
        ev = []
        if i == 0:
            ev = list(first_events)
        elif i % 12 == 0:
            ev = [{"kind": "mutation", "detail": f"color_logic: 'w{i - 12}' -> 'w{i}'"}]
        colour = (200, 40, 40) if i < n // 2 else (40, 60, 200)
        out.append(rec(session, start_kf + i, t + i * 5, template, near(base, 100 + i), ev,
                       thumb=colour if i % 6 == 0 else None))
    return out


def test_eras_scenes_titles_and_words(db):
    ingest(dream(first_events=[{"kind": "session_start"}]))
    ingest(dream(start_kf=120, t=T0 + 600, template="essence",
                 first_events=[{"kind": "seed_injection"}, {"kind": "template_switch", "detail": "-> essence"}]))
    r = Segmenter().run_pass()
    assert r["closed"] == 1 and r["open"] == 1

    with Session(db) as s:
        eras = s.exec(select(ChronicleEra).order_by(ChronicleEra.start_ts)).all()
        assert [e.template_id for e in eras] == ["liminal", "essence"]
        assert [e.opened_by for e in eras] == ["session_start", "template_switch"]
        assert eras[0].closed and not eras[1].closed
        assert eras[0].kf_count == 120 and eras[0].mutations == 9
        assert eras[0].title == "liminal · lantern · gouache"
        words = json.loads(eras[0].words_json)
        assert words[0][1:] == ["color_logic", "w0", "w12"]

        scenes = s.exec(select(ChronicleScene).where(ChronicleScene.era_id == eras[0].id)
                        .order_by(ChronicleScene.idx)).all()
        assert len(scenes) == 2, "one cut, at the jump from u to v"
        assert scenes[0].kf_count == 60 and scenes[1].kf_count == 60
        for sc in scenes:
            assert sc.rep_path and (models.keep_dir() / sc.rep_path).is_file()
            assert json.loads(sc.palette_json)[0].startswith("#")
        red = json.loads(scenes[0].palette_json)[0]
        assert int(red[1:3], 16) > 150, "the first scene's kept image is the red one"


def test_passes_are_idempotent_and_grow_the_open_era_in_place(db):
    ingest(dream(first_events=[{"kind": "session_start"}]))
    seg = Segmenter()
    seg.run_pass()
    with Session(db) as s:
        (era,) = s.exec(select(ChronicleEra)).all()
        era_id, kf = era.id, era.kf_count
    assert seg.run_pass()["closed"] == 0

    more = dream(start_kf=120, n=30, t=T0 + 600)
    ingest(more)
    seg.run_pass()
    with Session(db) as s:
        (era,) = s.exec(select(ChronicleEra)).all()
        assert era.id == era_id and era.kf_count == kf + 30 and not era.closed
        assert era.opened_by == "session_start", "a later pass keeps the era's own reason"


def test_silence_and_resume(db):
    ingest(dream(first_events=[{"kind": "session_start"}]))
    # same template after a short restart: the era continues
    ingest(dream(start_kf=0, n=60, t=T0 + 700, session="s2", first_events=[{"kind": "session_resume"}]))
    # an hour of nothing: a new era even with no switch
    ingest(dream(start_kf=60, n=60, t=T0 + 700 + 3600 + 300, session="s2"))
    Segmenter().run_pass()
    with Session(db) as s:
        eras = s.exec(select(ChronicleEra).order_by(ChronicleEra.start_ts)).all()
    assert [e.opened_by for e in eras] == ["session_start", "silence"]
    assert eras[0].kf_count == 180


def test_strata_tiles(db):
    ingest(dream(first_events=[{"kind": "session_start"}]))
    r = strata.run_pass()
    assert r["rendered"] == 1
    hour = datetime(2026, 9, 20, 10)
    tile = Image.open(strata.tile_path(hour))
    assert tile.size == (256, 240)
    rgba = tile.convert("RGBA")
    assert rgba.getpixel((128, 0))[3] == 255, "first 15 s hold a thumbnail"
    assert rgba.getpixel((128, 239))[3] == 0, "the end of the hour was never recorded"
    r_px = rgba.getpixel((128, 2))
    assert r_px[0] > 150 and r_px[2] < 100, "red while the dream was red"
    assert strata.run_pass()["rendered"] == 0, "nothing new, nothing re-rendered"
    assert [h for h, _ in strata.list_tiles()] == [hour]


def test_timeline_and_era_api(db):
    ingest(dream(first_events=[{"kind": "session_start"}]))
    Segmenter().run_pass()
    strata.run_pass()
    tl = api.build_timeline(None, 24)
    assert len(tl["tiles"]) == 1 and "?v=" in tl["tiles"][0]["url"]
    assert tl["era_count"] == 1 and tl["since"] == pytest.approx(T0, abs=1)
    (era,) = tl["eras"]
    assert era["open"] and len(era["scenes"]) == 2 and era["scenes"][0]["rep"].startswith("/dreams/chronicle/media/keep/")
    assert tl["live"]["thumb"].startswith("/dreams/chronicle/media/thumbs/")
    assert tl["older"] is None

    d = api.build_era(era["id"])
    assert len(d["moments"]) == 20 and len(d["prompts"]) == 20
    assert d["words"][0][1] == "color_logic"
    assert api.build_era(9999) is None


def test_media_route_only_serves_webp_inside_its_root(db, tmp_path):
    from fastapi import HTTPException
    (tmp_path / "secret.webp").write_bytes(b"x")
    keep = models.keep_dir()
    (keep / "a").mkdir(parents=True)
    (keep / "a" / "ok.webp").write_bytes(b"RIFF")
    (keep / "a" / "no.txt").write_text("x")

    async def get(kind, rel):
        return await api.chronicle_media(kind, rel)

    assert asyncio.run(get("keep", "a/ok.webp")).status_code == 200
    for kind, rel in [("keep", "../secret.webp"), ("keep", "a/no.txt"), ("nope", "a/ok.webp"),
                      ("keep", "a/missing.webp")]:
        with pytest.raises(HTTPException):
            asyncio.run(get(kind, rel))


def test_title_uses_the_most_persistent_identity_words():
    from aethera.dreams.chronicle.segmenter import Row
    rows = [Row(i, "s", None, 0.0, "", "site_decay",
                {"setting_location": "mason jar" if i < 8 else "grain elevator",
                 "medium_render": "cyanotype", "color_logic": "oxblood"}, [], None, None, None)
            for i in range(10)]
    assert era_title("site_decay", rows) == "site decay · cyanotype · mason jar"
