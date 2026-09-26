"""
Chronicle store: compact f16 embeddings, legacy-row compaction, and an
ingest path that never makes the stream hub wait.

Each test gets its own sqlite file + thumbs dir (the module-level engine
singleton is swapped out), and runs async code via asyncio.run.
"""
import asyncio
import json
import math
import random
import time
from datetime import datetime

import pytest
from sqlmodel import Session, create_engine, select

import aethera.dreams.chronicle.models as models
import aethera.dreams.chronicle.store as store_mod
from aethera.dreams.chronicle.models import (
    ChronicleKeyframe,
    init_chronicle_db,
    pack_f16,
    unpack_f16,
)
from aethera.dreams.chronicle.store import ChronicleStore


@pytest.fixture
def chronicle_db(tmp_path, monkeypatch):
    engine = create_engine(
        f"sqlite:///{tmp_path / 'chronicle.sqlite'}",
        connect_args={"check_same_thread": False, "timeout": 30},
    )
    monkeypatch.setattr(models, "_ENGINE", engine)
    monkeypatch.setattr(models, "CHRONICLE_THUMBS_DIR", tmp_path / "thumbs")
    init_chronicle_db()
    return engine


def _unit(n: int, seed: int) -> list[float]:
    rng = random.Random(seed)
    v = [rng.gauss(0, 1) for _ in range(n)]
    norm = math.sqrt(sum(x * x for x in v))
    return [round(x / norm, 4) for x in v]


def _hist(seed: int) -> list[float]:
    rng = random.Random(seed)
    v = [rng.random() ** 3 for _ in range(96)]
    s = sum(v)
    return [round(x / s, 4) for x in v]


def _cos_dist(a, b) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(y * y for y in b))
    return 1.0 - dot / (na * nb)


def _batch(records: list[dict]) -> bytes:
    return json.dumps({"type": "chronicle_batch", "records": records}).encode()


def _record(kf: int) -> dict:
    return {
        "session_id": "s" * 32,
        "keyframe": kf,
        "lifetime_keyframe": 1000 + kf,
        "sequence": kf * 20,
        "ts": 1_790_000_000 + kf,
        "prompt": f"prompt {kf}",
        "template_id": "liminal",
        "components": {"color_logic": "verdigris"},
        "events": [],
        "color_hist": _hist(kf),
        "latent_pool": _unit(128, kf),
    }


def test_f16_round_trip_keeps_the_metric():
    a, b = _unit(128, 1), _unit(128, 2)
    pa, pb = pack_f16(a), pack_f16(b)
    assert len(pa) == 256, "128 floats -> 256 bytes"
    ua, ub = unpack_f16(pa), unpack_f16(pb)
    assert max(abs(x - y) for x, y in zip(a, ua)) < 1e-3
    # cosine distance (the working latent metric) survives quantization
    assert abs(_cos_dist(a, b) - _cos_dist(ua, ub)) < 1e-3
    h = _hist(3)
    assert max(abs(x - y) for x, y in zip(h, unpack_f16(pack_f16(h)))) < 5e-4


def test_f16_codec_rejects_garbage():
    assert pack_f16(None) is None
    assert pack_f16([]) is None
    assert pack_f16(["not a number"]) is None
    assert pack_f16([1e9]) is None  # outside f16 range
    assert unpack_f16(None) is None
    assert unpack_f16(b"\x00") is None  # odd length


def test_ingest_stores_blobs_and_export_returns_lists(chronicle_db):
    store = ChronicleStore()
    asyncio.run(store.ingest(_batch([_record(1), _record(2)])))
    assert store.records_ingested == 2

    with Session(chronicle_db) as s:
        rows = s.exec(select(ChronicleKeyframe)).all()
    assert all(r.color_hist_json is None and r.latent_pool_json is None for r in rows)
    assert all(len(r.latent_pool_f16) == 256 and len(r.color_hist_f16) == 192 for r in rows)

    out = store.export_records_sync()
    assert out["count"] == 2
    src = _record(1)
    got = out["records"][0]
    assert len(got["latent_pool"]) == 128 and len(got["color_hist"]) == 96
    assert max(abs(x - y) for x, y in zip(src["latent_pool"], got["latent_pool"])) < 1e-3


def _insert_legacy(engine, n: int, bad_every: int = 0) -> None:
    with Session(engine) as s:
        for kf in range(n):
            bad = bad_every and kf % bad_every == 0
            s.add(ChronicleKeyframe(
                session_id="legacy", keyframe=kf, sequence=kf,
                ts=datetime.fromtimestamp(1_790_000_000 + kf),
                received_at=datetime.fromtimestamp(1_790_000_000 + kf),
                prompt="p", template_id="t",
                color_hist_json="{broken" if bad else json.dumps(_hist(kf)),
                latent_pool_json=json.dumps(_unit(128, kf)),
            ))
        s.commit()


def test_compaction_converts_legacy_rows_and_is_idempotent(chronicle_db, monkeypatch):
    monkeypatch.setattr(store_mod, "COMPACT_CHUNK_ROWS", 7)  # force several chunks
    _insert_legacy(chronicle_db, 40, bad_every=10)
    store = ChronicleStore()
    before = store.export_records_sync(limit=100)["records"]

    result = store._compact_sync()
    assert result["converted"] == 40

    with Session(chronicle_db) as s:
        rows = s.exec(select(ChronicleKeyframe).order_by(ChronicleKeyframe.id)).all()
    assert all(r.color_hist_json is None and r.latent_pool_json is None for r in rows)
    assert all(r.latent_pool_f16 is not None for r in rows)
    # the malformed histograms are dropped, not retried forever
    assert sum(r.color_hist_f16 is None for r in rows) == 4

    after = store.export_records_sync(limit=100)["records"]
    for b, a in zip(before, after):
        assert max(abs(x - y) for x, y in zip(b["latent_pool"], a["latent_pool"])) < 1e-3

    assert store._compact_sync()["converted"] == 0


def test_compaction_vacuums_the_freed_space(chronicle_db):
    _insert_legacy(chronicle_db, 3000)
    result = ChronicleStore()._compact_sync()
    assert result["vacuumed"]
    assert result["bytes_after"] < 0.6 * result["bytes_before"]
    # nothing left to free: a second pass leaves the file alone
    assert not ChronicleStore()._compact_sync()["vacuumed"]


def test_submit_never_waits_and_drops_oldest_when_full(chronicle_db, monkeypatch):
    monkeypatch.setattr(store_mod, "INGEST_QUEUE_BATCHES", 3)

    async def run():
        store = ChronicleStore()
        seen = []

        async def slow_ingest(payload):
            seen.append(payload)
            await asyncio.sleep(0.2)

        store.ingest = slow_ingest
        t0 = time.monotonic()
        for i in range(10):
            store.submit(str(i).encode())
        assert time.monotonic() - t0 < 0.05, "the stream hub must never wait on the chronicle"
        await asyncio.sleep(1.0)
        store.stop_retention_task()
        return store, seen

    store, seen = asyncio.run(run())
    assert store.batches_dropped >= 6
    assert seen[-1] == b"9", "the newest batch survives"


def test_submit_ingests_for_real(chronicle_db):
    async def run():
        store = ChronicleStore()
        store.submit(_batch([_record(5)]))
        await asyncio.wait_for(store._ingest_queue.join(), timeout=5)
        store.stop_retention_task()
        return store

    store = asyncio.run(run())
    assert store.records_ingested == 1
    assert store.export_records_sync()["records"][0]["prompt"] == "prompt 5"


def test_low_disk_shortens_retention_then_relaxes(chronicle_db, monkeypatch):
    from collections import namedtuple
    usage = namedtuple("usage", "total used free")
    free = {"bytes": store_mod.MIN_FREE_BYTES // 2}
    monkeypatch.setattr(store_mod.shutil, "disk_usage", lambda p: usage(0, 0, free["bytes"]))

    store = ChronicleStore()
    days = [store._retention_days_for_disk() for _ in range(10)]
    assert days[0] == store_mod.RETENTION_DAYS - 2
    assert min(days) == store_mod.MIN_RETENTION_DAYS, "never below the floor"

    free["bytes"] = store_mod.MIN_FREE_BYTES * 3
    for _ in range(20):
        store._retention_days_for_disk()
    assert store.retention_days == store_mod.RETENTION_DAYS


def test_sweep_uses_the_shortened_window(chronicle_db, monkeypatch):
    from datetime import timedelta, timezone
    now = datetime.now(timezone.utc)
    with Session(chronicle_db) as s:
        for age_days in (10, 5, 1):  # oldest first, as ids grow in production
            t = now - timedelta(days=age_days)
            s.add(ChronicleKeyframe(session_id="x", keyframe=age_days, ts=t, received_at=t))
        s.commit()
    store = ChronicleStore()
    monkeypatch.setattr(store, "_retention_days_for_disk", lambda: 4.0)
    deleted_rows, _ = store._retention_sweep_sync()
    assert deleted_rows == 2


def test_failed_vacuum_is_retried_next_pass(chronicle_db, monkeypatch):
    _insert_legacy(chronicle_db, 500)
    store = ChronicleStore()
    real_connect = chronicle_db.connect
    calls = {"n": 0}

    class Boom(Exception):
        pass

    def flaky_connect(*a, **k):
        conn = real_connect(*a, **k)
        orig = conn.execution_options

        def execution_options(**opts):
            if opts.get("isolation_level") == "AUTOCOMMIT" and calls["n"] == 0:
                calls["n"] += 1
                raise Boom("database is locked")
            return orig(**opts)

        conn.execution_options = execution_options
        return conn

    monkeypatch.setattr(chronicle_db, "connect", flaky_connect)
    with pytest.raises(Boom):
        store._compact_sync()
    result = store._compact_sync()
    assert result["converted"] == 0 and result["vacuumed"], "the pending VACUUM runs on the next pass"
