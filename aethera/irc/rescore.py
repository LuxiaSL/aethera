"""
Re-score banked fragments with the CURRENT judge rubric.

After the judge's evaluate_fragment criteria change (e.g. the cursed-aesthetic
recalibration), already-banked fragments carry stale scores. This re-runs the
whole-fragment scorer (style-aware) over the pool and updates quality_score, so
the broadcaster's weighted selection and the review UI reflect the new rubric.

    uv run python -m aethera.irc.rescore            # dry-run (shows old -> new)
    uv run python -m aethera.irc.rescore --apply    # write new scores
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sqlite3
import sys
from collections import defaultdict
from pathlib import Path

from dotenv import load_dotenv

from .config import get_config
from .autoloom import Autoloom


async def rescore(db_path: str, apply: bool = False, concurrency: int = 8) -> list[tuple]:
    cfg = get_config()
    judge = cfg.get_judge_provider()
    al = Autoloom(judge_provider=judge, threshold=0.4)

    con = sqlite3.connect(db_path, timeout=15)
    con.execute("PRAGMA busy_timeout=10000")
    rows = con.execute(
        "SELECT id, style, quality_score, messages_json FROM irc_fragments"
    ).fetchall()

    sem = asyncio.Semaphore(concurrency)

    async def one(fid, style, oldq, mj):
        async with sem:
            content = "\n".join(m.get("content", "") for m in json.loads(mj) if m.get("content"))
            try:
                new, _ = await al.evaluate_fragment(content, style=style)
            except Exception as e:
                print(f"  ! {fid[:8]} scoring failed: {e}", file=sys.stderr)
                new = None
            return (fid, style, oldq, new)

    results = await asyncio.gather(*(one(*r) for r in rows))

    if apply:
        for fid, style, oldq, new in results:
            if new is not None:
                con.execute("UPDATE irc_fragments SET quality_score=? WHERE id=?", (new, fid))
        con.commit()
    con.close()
    await judge.close()
    return results


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(
        prog="python -m aethera.irc.rescore",
        description="Re-score banked fragments with the current judge rubric.",
    )
    parser.add_argument("--db", default="data/irc.sqlite", help="SQLite path")
    parser.add_argument("--apply", action="store_true", help="Write new scores (default: dry-run)")
    args = parser.parse_args(argv)

    load_dotenv()
    db = Path(args.db)
    if not db.exists():
        print(f"DB not found: {db.resolve()}", file=sys.stderr)
        return 1

    mode = "APPLY" if args.apply else "DRY-RUN"
    print(f"[{mode}] re-scoring {db} with the current judge rubric...")
    results = asyncio.run(rescore(str(db), apply=args.apply))

    scored = [(s, o or 0, n) for _, s, o, n in results if n is not None]
    if not scored:
        print("nothing scored")
        return 0

    by_style = defaultdict(lambda: [0.0, 0.0, 0])
    moved_up = 0
    for style, oldq, new in scored:
        agg = by_style[style]
        agg[0] += oldq
        agg[1] += new
        agg[2] += 1
        if new > oldq + 0.001:
            moved_up += 1

    print(f"\n{'style':<11}{'n':>3}{'old avg':>9}{'new avg':>9}{'Δ':>7}")
    for style in sorted(by_style):
        o, n, c = by_style[style]
        print(f"{style:<11}{c:>3}{o/c:>9.2f}{n/c:>9.2f}{(n-o)/c:>+7.2f}")
    oa = sum(o for _, o, _ in scored) / len(scored)
    na = sum(n for _, _, n in scored) / len(scored)
    print(f"{'ALL':<11}{len(scored):>3}{oa:>9.2f}{na:>9.2f}{na-oa:>+7.2f}")
    print(f"\n{moved_up}/{len(scored)} fragments scored higher under the new rubric")
    if not args.apply:
        print("re-run with --apply to write the new scores")
    return 0


if __name__ == "__main__":
    sys.exit(main())
