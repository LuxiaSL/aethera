"""
Semantic near-duplicate detection for IRC fragments — embeddings + cosine.

The lexical tool (dedup.py) catches verbatim/near-verbatim regurgitation. This
catches the *thematic* dups it can't: two fragments with the same premise that
share no phrases (e.g. two different phantom-user hauntings). Same report/gate/
cluster shape as dedup.py — just cosine over embeddings instead of MinHash.

Embeddings come from an OpenAI-compatible /v1/embeddings endpoint (config-driven,
same pattern as generation points at the GPU node):
    IRC_EMBED_BASE_URL   (default http://localhost:8001/v1)
    IRC_EMBED_MODEL      (default bge-large)
    IRC_EMBED_API_KEY    (optional)

Report: `python -m aethera.irc.semantic_dedup [--threshold 0.85]`
Gate:   SemanticIndex.max_similarity(vec) — for a banking-time novelty check.

Vectors are unit-normalized so cosine == dot product. Brute-force pairwise is
fine into the thousands; swap to an ANN index (faiss/hnswlib) only past ~100k.
"""

from __future__ import annotations

import argparse
import math
import os
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import httpx

from .dedup import fragment_text

DEFAULT_BASE_URL = "http://localhost:8001/v1"
DEFAULT_MODEL = "bge-large"


def load_pool_texts(db_path: str) -> dict[str, str]:
    """{fragment_id: embedding_text} for the existing pool — the dialogue body
    (pre-collapse), matching what text_from_fragment produces for live fragments.
    Used to seed the SemanticIndex for the banking-time novelty gate."""
    import json
    import sqlite3
    from pathlib import Path

    con = sqlite3.connect(f"file:{Path(db_path).resolve()}?mode=ro", uri=True)
    rows = con.execute(
        "SELECT id, collapse_start_index, messages_json FROM irc_fragments"
    ).fetchall()
    con.close()

    out: dict[str, str] = {}
    for fid, cidx, mj in rows:
        try:
            msgs = json.loads(mj)
        except Exception:
            continue
        txt = fragment_text(msgs, cidx if cidx is not None else -1)
        if txt.strip():
            out[fid] = txt
    return out


# ==================== Embedder ====================

class Embedder:
    """Minimal OpenAI-compatible /v1/embeddings client (batched)."""

    def __init__(self, base_url: str, model: str, api_key: Optional[str] = None, timeout: float = 120.0):
        self.base_url = base_url.rstrip("/")
        self.model = model
        headers = {"Content-Type": "application/json"}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        self._client = httpx.Client(base_url=self.base_url, headers=headers, timeout=timeout)

    def embed(self, texts: list[str], batch: int = 64) -> list[list[float]]:
        out: list[list[float]] = []
        for i in range(0, len(texts), batch):
            chunk = texts[i:i + batch]
            resp = self._client.post("/embeddings", json={"model": self.model, "input": chunk})
            resp.raise_for_status()
            data = resp.json()["data"]
            # endpoints may not preserve order — sort by index to be safe
            data = sorted(data, key=lambda d: d.get("index", 0))
            out.extend(d["embedding"] for d in data)
        return out

    def close(self):
        self._client.close()


def _unit(vec: list[float]) -> list[float]:
    n = math.sqrt(sum(x * x for x in vec))
    return [x / n for x in vec] if n else vec


def cosine(a: list[float], b: list[float]) -> float:
    """Dot product of unit-normalized vectors == cosine similarity."""
    return sum(x * y for x, y in zip(a, b))


# ==================== Index ====================

@dataclass
class SemPair:
    a: str
    b: str
    similarity: float


class SemanticIndex:
    """Brute-force cosine index over unit-normalized embeddings."""

    def __init__(self):
        self.vecs: dict[str, list[float]] = {}

    def add(self, key: str, vec: list[float]) -> None:
        self.vecs[key] = _unit(vec)

    def max_similarity(self, vec: list[float]) -> tuple[float, Optional[str]]:
        u = _unit(vec)
        best_key, best = None, -1.0
        for k, v in self.vecs.items():
            s = cosine(u, v)
            if s > best:
                best, best_key = s, k
        return (best if best_key else 0.0), best_key

    def near_dup_pairs(self, threshold: float) -> list[SemPair]:
        keys = list(self.vecs)
        out: list[SemPair] = []
        for i in range(len(keys)):
            vi = self.vecs[keys[i]]
            for j in range(i + 1, len(keys)):
                s = cosine(vi, self.vecs[keys[j]])
                if s >= threshold:
                    a, b = (keys[i], keys[j]) if keys[i] < keys[j] else (keys[j], keys[i])
                    out.append(SemPair(a, b, s))
        return sorted(out, key=lambda p: -p.similarity)

    def all_pairs(self) -> list[SemPair]:
        return self.near_dup_pairs(-1.0)

    def clusters_from(self, pairs: list[SemPair]) -> list[list[str]]:
        parent = {k: k for k in self.vecs}

        def find(x: str) -> str:
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for p in pairs:
            parent[find(p.a)] = find(p.b)
        groups: dict[str, list[str]] = {}
        for k in self.vecs:
            groups.setdefault(find(k), []).append(k)
        return sorted((g for g in groups.values() if len(g) > 1), key=len, reverse=True)


# ==================== Report ====================

def main(argv=None) -> int:
    parser = argparse.ArgumentParser(
        prog="python -m aethera.irc.semantic_dedup",
        description="Semantic near-duplicate report for the IRC fragment pool (embeddings + cosine).",
    )
    parser.add_argument("--db", default="data/irc.sqlite", help="SQLite path")
    parser.add_argument("--threshold", type=float, default=0.85, help="Report pairs >= this cosine (default 0.85)")
    parser.add_argument("--base-url", default=os.environ.get("IRC_EMBED_BASE_URL", DEFAULT_BASE_URL))
    parser.add_argument("--model", default=os.environ.get("IRC_EMBED_MODEL", DEFAULT_MODEL))
    parser.add_argument("--top", type=int, default=25, help="Max pairs to print")
    args = parser.parse_args(argv)

    db = Path(args.db)
    if not db.exists():
        print(f"DB not found: {db.resolve()}", file=sys.stderr)
        return 1

    # Reuse dedup.load_pool for the DB read, but embed the natural dialogue TEXT.
    import json
    import sqlite3
    con = sqlite3.connect(f"file:{db.resolve()}?mode=ro", uri=True)
    rows = con.execute(
        "SELECT id, style, collapse_type, quality_score, collapse_start_index, messages_json "
        "FROM irc_fragments"
    ).fetchall()
    con.close()

    meta: dict[str, dict] = {}
    ids, texts = [], []
    for fid, style, collapse, q, cidx, mj in rows:
        try:
            msgs = json.loads(mj)
        except Exception:
            continue
        txt = fragment_text(msgs, cidx if cidx is not None else -1)
        if not txt.strip():
            continue
        preview = []
        for m in msgs:
            if m.get("type", "message") == "message" and (m.get("content") or "").strip():
                preview.append(f"<{m.get('nick','')}> {m.get('content','')}")
            if len(preview) >= 2:
                break
        meta[fid] = {"style": style, "preview": " | ".join(preview)[:120]}
        ids.append(fid)
        texts.append(txt)

    print(f"embedding {len(texts)} fragments via {args.model} @ {args.base_url} ...")
    embedder = Embedder(args.base_url, args.model)
    try:
        vectors = embedder.embed(texts)
    except Exception as e:
        print(f"embedding failed: {e}", file=sys.stderr)
        print("is the embed endpoint up? (curl <base_url>/models)", file=sys.stderr)
        return 2
    finally:
        embedder.close()

    idx = SemanticIndex()
    for fid, vec in zip(ids, vectors):
        idx.add(fid, vec)

    all_pairs = idx.all_pairs()
    pairs = [p for p in all_pairs if p.similarity >= args.threshold]
    clusters = idx.clusters_from(pairs)

    print(f"\npool: {len(ids)} fragments | model {args.model}")
    print(f"semantic near-dup pairs >= {args.threshold:.2f}: {len(pairs)} | clusters: {len(clusters)}")
    if all_pairs:
        print(f"similarity ceiling (closest pair): {all_pairs[0].similarity:.3f}")
    print()

    shown = pairs if pairs else all_pairs[:8]
    label = "closest pairs >= threshold" if pairs else "closest pairs that exist (none above threshold)"
    print(f"--- {label} ---")
    for p in shown[:args.top]:
        sa, sb = meta[p.a], meta[p.b]
        print(f"{p.similarity:.3f}  {p.a[:8]} ({sa['style']}) ~ {p.b[:8]} ({sb['style']})")
        print(f"        A: {sa['preview']}")
        print(f"        B: {sb['preview']}")

    if clusters:
        print(f"\n--- semantic clusters (same-premise groups) ---")
        for g in clusters:
            styles: dict[str, int] = {}
            for k in g:
                styles[meta[k]["style"]] = styles.get(meta[k]["style"], 0) + 1
            print(f"  {len(g)} fragments {styles}: {', '.join(k[:8] for k in g)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
