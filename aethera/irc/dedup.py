"""
Lexical near-duplicate detection for IRC fragments — MinHash + LSH.

Why this shape:
- **MinHash** estimates Jaccard similarity between two fragments' k-word shingle
  sets from a fixed-size signature (cheap to compare).
- **LSH** (banding) generates candidate pairs in ~O(n) instead of O(n²), so it
  stays fast as the pool grows to thousands of fragments.
- We compare the **dialogue body only**, nick-normalized: the forced collapse
  cascades are intentionally similar (`X has quit (...)` every time) and nicks
  vary between otherwise-identical conversations, so both are stripped — the
  signal is the premise + what's actually said.

Two uses:
- Report: `python -m aethera.irc.dedup [--threshold 0.5]` — surface the closest
  pairs and clusters in the current pool (measure the near-dup level).
- Gate: `NearDupIndex.max_similarity(tokens)` — for a banking-time novelty check
  (reject a new fragment too close to the pool). Importable, O(1)-ish per query.

Pure stdlib (hashlib + random with a FIXED seed for reproducible signatures).
"""

from __future__ import annotations

import argparse
import hashlib
import json
import random
import re
import sqlite3
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, Optional


# Large prime for the (a*x + b) mod p MinHash permutations (Mersenne 2^61-1).
_PRIME = (1 << 61) - 1
_MAX_HASH = (1 << 61) - 1

_WORD = re.compile(r"[a-z0-9']+")


def _hash64(s: str) -> int:
    """Stable 64-bit hash of a string (blake2b), independent of PYTHONHASHSEED."""
    return int.from_bytes(hashlib.blake2b(s.encode("utf-8"), digest_size=8).digest(), "big")


# ==================== Fragment → comparison tokens ====================

def fragment_tokens(messages: list[dict], collapse_start_index: int = -1) -> list[str]:
    """
    Extract the nick-normalized dialogue-body tokens used for comparison.

    - Only MESSAGE/ACTION content (drops system/join/part/quit/kick boilerplate).
    - Everything from the collapse onward is dropped (the cascades are
      intentionally similar — they'd swamp the similarity signal).
    - A token that matches one of the fragment's own nicks (addressing like
      'yeel', '@yeel', 'yeel,') is replaced with '<n>', so the SAME conversation
      with DIFFERENT nicks still matches.
    """
    nicks = {
        (m.get("nick") or "").strip().lower()
        for m in messages
        if m.get("nick")
    }
    nicks.discard("")

    parts: list[str] = []
    for i, m in enumerate(messages):
        if 0 <= collapse_start_index <= i:
            break
        if m.get("type", "message") not in ("message", "action"):
            continue
        content = m.get("content") or ""
        if content:
            parts.append(content)

    text = " ".join(parts).lower()
    return ["<n>" if tok in nicks else tok for tok in _WORD.findall(text)]


def fragment_text(messages: list[dict], collapse_start_index: int = -1, max_chars: int = 4000) -> str:
    """The dialogue-body TEXT (pre-collapse, message/action content) for embedding.
    Natural text — semantics come from the words; truncated for safety."""
    parts: list[str] = []
    for i, m in enumerate(messages):
        if 0 <= collapse_start_index <= i:
            break
        if m.get("type", "message") not in ("message", "action"):
            continue
        c = (m.get("content") or "").strip()
        if c:
            parts.append(c)
    return " ".join(parts)[:max_chars]


def _fragment_msg_dicts(fragment) -> list[dict]:
    """Duck-type a generated IRCFragment's messages into the dict form the
    pool-side helpers (fragment_tokens / fragment_text) consume."""
    return [
        {
            "type": getattr(m.type, "value", m.type),
            "nick": m.nick,
            "content": m.content,
        }
        for m in fragment.messages
    ]


def tokens_from_fragment(fragment) -> list[str]:
    """Comparison tokens for a generated IRCFragment (duck-typed: .messages with
    .type/.nick/.content, .collapse_start_index)."""
    return fragment_tokens(
        _fragment_msg_dicts(fragment),
        getattr(fragment, "collapse_start_index", -1) or -1,
    )


def text_from_fragment(fragment) -> str:
    """Embedding TEXT for a generated IRCFragment — the live-object analogue of
    fragment_text, so a fresh fragment embeds the SAME representation the pool
    index was built from (cosines are comparable)."""
    return fragment_text(
        _fragment_msg_dicts(fragment),
        getattr(fragment, "collapse_start_index", -1) or -1,
    )


# ==================== MinHash ====================

class MinHasher:
    """Computes MinHash signatures from token lists (deterministic via seed)."""

    def __init__(self, num_perm: int = 128, k: int = 5, seed: int = 1):
        self.num_perm = num_perm
        self.k = k
        rnd = random.Random(seed)
        # (a, b) coefficients for num_perm universal hash permutations.
        self._a = [rnd.randrange(1, _PRIME) for _ in range(num_perm)]
        self._b = [rnd.randrange(0, _PRIME) for _ in range(num_perm)]

    def _shingles(self, tokens: list[str]) -> set[int]:
        """k-word shingles, hashed to ints. Short inputs fall back to one shingle."""
        n = len(tokens)
        if n == 0:
            return set()
        if n < self.k:
            return {_hash64(" ".join(tokens))}
        return {_hash64(" ".join(tokens[i:i + self.k])) for i in range(n - self.k + 1)}

    def signature(self, tokens: list[str]) -> tuple[int, ...]:
        shingles = self._shingles(tokens)
        if not shingles:
            return tuple([_MAX_HASH] * self.num_perm)
        sig = []
        for a, b in zip(self._a, self._b):
            sig.append(min(((a * h + b) % _PRIME) for h in shingles))
        return tuple(sig)


def jaccard(sig_a: tuple[int, ...], sig_b: tuple[int, ...]) -> float:
    """MinHash estimate of Jaccard similarity (fraction of matching positions)."""
    if not sig_a:
        return 0.0
    return sum(1 for x, y in zip(sig_a, sig_b) if x == y) / len(sig_a)


# ==================== LSH index ====================

class NearDupIndex:
    """
    MinHash-LSH index over fragments. add() / query candidates in ~O(1) per band,
    so building over n fragments is ~O(n) and stays usable on large pools.

    bands × rows == num_perm. The LSH activation threshold ≈ (1/bands)^(1/rows):
    defaults (num_perm=128, bands=32, rows=4) catch pairs with Jaccard ≳0.42 as
    candidates; the actual similarity is then computed exactly for each candidate,
    so the reported/gated threshold can be set anywhere at/above that.
    """

    def __init__(self, num_perm: int = 128, k: int = 5, bands: int = 32, seed: int = 1):
        if num_perm % bands != 0:
            raise ValueError("num_perm must be divisible by bands")
        self.hasher = MinHasher(num_perm=num_perm, k=k, seed=seed)
        self.num_perm = num_perm
        self.bands = bands
        self.rows = num_perm // bands
        self._buckets: list[dict[int, list[str]]] = [dict() for _ in range(bands)]
        self.sigs: dict[str, tuple[int, ...]] = {}

    def _band_hashes(self, sig: tuple[int, ...]) -> list[int]:
        out = []
        for bi in range(self.bands):
            band = sig[bi * self.rows:(bi + 1) * self.rows]
            out.append(_hash64(",".join(map(str, band))))
        return out

    def add(self, key: str, tokens: list[str]) -> tuple[int, ...]:
        sig = self.hasher.signature(tokens)
        self.sigs[key] = sig
        for bi, h in enumerate(self._band_hashes(sig)):
            self._buckets[bi].setdefault(h, []).append(key)
        return sig

    def candidates(self, sig: tuple[int, ...], exclude: Optional[str] = None) -> set[str]:
        out: set[str] = set()
        for bi, h in enumerate(self._band_hashes(sig)):
            for key in self._buckets[bi].get(h, ()):
                if key != exclude:
                    out.add(key)
        return out

    def max_similarity(self, tokens: list[str]) -> tuple[float, Optional[str]]:
        """Highest similarity of `tokens` to anything already in the index.
        Use for a banking-time novelty gate (reject if too high)."""
        sig = self.hasher.signature(tokens)
        best_key, best_sim = None, 0.0
        for cand in self.candidates(sig):
            sim = jaccard(sig, self.sigs[cand])
            if sim > best_sim:
                best_sim, best_key = sim, cand
        return best_sim, best_key

    def near_dup_pairs(self, threshold: float = 0.5) -> list["NearDup"]:
        """LSH-candidate pairs with similarity >= threshold. Scalable (~O(n)) but
        only sees pairs that collide in a band (≳ the LSH activation, ~0.42 at
        defaults) — use for big pools / the gate, not for a sub-0.4 ceiling."""
        seen: set[tuple[str, str]] = set()
        out: list[NearDup] = []
        for key, sig in self.sigs.items():
            for cand in self.candidates(sig, exclude=key):
                pair = (key, cand) if key < cand else (cand, key)
                if pair in seen:
                    continue
                seen.add(pair)
                sim = jaccard(sig, self.sigs[cand])
                if sim >= threshold:
                    out.append(NearDup(pair[0], pair[1], sim))
        return sorted(out, key=lambda d: -d.similarity)

    def near_dup_pairs_exact(self, threshold: float = 0.0) -> list["NearDup"]:
        """Exact all-pairs comparison on signatures (O(n²), but each compare is
        cheap). Accurate at ANY threshold — use for the report ceiling on
        small/medium pools; near_dup_pairs() is the scalable approximation."""
        keys = list(self.sigs)
        out: list[NearDup] = []
        for i in range(len(keys)):
            si = self.sigs[keys[i]]
            for j in range(i + 1, len(keys)):
                sim = jaccard(si, self.sigs[keys[j]])
                if sim >= threshold:
                    a, b = (keys[i], keys[j]) if keys[i] < keys[j] else (keys[j], keys[i])
                    out.append(NearDup(a, b, sim))
        return sorted(out, key=lambda d: -d.similarity)

    def clusters_from(self, pairs: list["NearDup"]) -> list[list[str]]:
        """Connected components over a list of near-dup pairs — groups of
        mutually-close fragments (a trope the model is over-producing)."""
        parent = {k: k for k in self.sigs}

        def find(x: str) -> str:
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for d in pairs:
            parent[find(d.a)] = find(d.b)

        groups: dict[str, list[str]] = {}
        for k in self.sigs:
            groups.setdefault(find(k), []).append(k)
        return sorted((g for g in groups.values() if len(g) > 1), key=len, reverse=True)


@dataclass
class NearDup:
    a: str
    b: str
    similarity: float


# ==================== Loading + report ====================

def load_pool(db_path: str) -> dict[str, dict]:
    """id -> {style, collapse_type, quality_score, tokens, preview}."""
    con = sqlite3.connect(f"file:{Path(db_path).resolve()}?mode=ro", uri=True)
    try:
        rows = con.execute(
            "SELECT id, style, collapse_type, quality_score, collapse_start_index, "
            "messages_json FROM irc_fragments"
        ).fetchall()
    finally:
        con.close()

    pool: dict[str, dict] = {}
    for fid, style, collapse, q, cidx, mj in rows:
        try:
            msgs = json.loads(mj)
        except Exception:
            continue
        toks = fragment_tokens(msgs, cidx if cidx is not None else -1)
        # a short human preview (first couple of dialogue lines)
        preview = []
        for m in msgs:
            if m.get("type", "message") == "message" and (m.get("content") or "").strip():
                preview.append(f"<{m.get('nick','')}> {m.get('content','')}")
            if len(preview) >= 2:
                break
        pool[fid] = {
            "style": style,
            "collapse_type": collapse,
            "quality_score": q,
            "tokens": toks,
            "preview": " | ".join(preview)[:120],
        }
    return pool


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(
        prog="python -m aethera.irc.dedup",
        description="Lexical near-duplicate report for the IRC fragment pool (MinHash+LSH).",
    )
    parser.add_argument("--db", default="data/irc.sqlite", help="SQLite path")
    parser.add_argument("--threshold", type=float, default=0.5, help="Report pairs >= this similarity (default 0.5)")
    parser.add_argument("--k", type=int, default=5, help="Shingle size in words (default 5)")
    parser.add_argument("--num-perm", type=int, default=128, help="MinHash permutations (default 128)")
    parser.add_argument("--bands", type=int, default=32, help="LSH bands (default 32)")
    parser.add_argument("--top", type=int, default=25, help="Max pairs to print")
    parser.add_argument("--lsh", action="store_true",
                        help="Force the scalable LSH path even on a small pool (default: exact under 4000)")
    args = parser.parse_args(argv)

    db = Path(args.db)
    if not db.exists():
        print(f"DB not found: {db.resolve()}", file=sys.stderr)
        return 1

    pool = load_pool(str(db))
    idx = NearDupIndex(num_perm=args.num_perm, k=args.k, bands=args.bands)
    for fid, data in pool.items():
        idx.add(fid, data["tokens"])

    # Exact (accurate at any threshold) for normal pools; LSH for huge ones.
    EXACT_MAX = 4000
    use_exact = (not args.lsh) and len(pool) <= EXACT_MAX
    method = "exact O(n²)" if use_exact else "LSH candidates"
    all_pairs = idx.near_dup_pairs_exact(0.0) if use_exact else idx.near_dup_pairs(0.0)
    pairs = [d for d in all_pairs if d.similarity >= args.threshold]
    clusters = idx.clusters_from(pairs)

    print(f"pool: {len(pool)} fragments | k={args.k}, {args.num_perm} perms, {args.bands} bands | {method}")
    print(f"near-dup pairs >= {args.threshold:.2f}: {len(pairs)} | clusters: {len(clusters)}")
    if all_pairs:
        print(f"similarity ceiling (closest pair anywhere): {all_pairs[0].similarity:.3f}")
    print()

    if pairs:
        print(f"--- closest pairs (top {min(args.top, len(pairs))}) ---")
        for d in pairs[:args.top]:
            sa, sb = pool[d.a], pool[d.b]
            print(f"{d.similarity:.2f}  {d.a[:8]} ({sa['style']}) ~ {d.b[:8]} ({sb['style']})")
            print(f"        A: {sa['preview']}")
            print(f"        B: {sb['preview']}")
    else:
        print(f"no pairs above {args.threshold:.2f} — pool is lexically diverse at this cutoff.")
        # Still show the few closest so the ceiling is concrete.
        if all_pairs:
            print("closest pairs that DO exist:")
            for d in all_pairs[:5]:
                sa, sb = pool[d.a], pool[d.b]
                print(f"  {d.similarity:.2f}  {d.a[:8]} ({sa['style']}) ~ {d.b[:8]} ({sb['style']})")

    if clusters:
        print(f"\n--- clusters (mutually-similar groups, a trope being over-produced) ---")
        for g in clusters:
            styles: dict[str, int] = {}
            for k in g:
                styles[pool[k]["style"]] = styles.get(pool[k]["style"], 0) + 1
            print(f"  {len(g)} fragments {styles}: {', '.join(k[:8] for k in g)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
