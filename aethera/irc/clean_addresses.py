"""
One-off maintenance: strip the model's 'nick:' address tic from already-banked
fragments (the normalizer now does this for new fragments; this backfills old).

Strips a leading 'knownnick:' prefix from message content where the nick is a
participant in that fragment (so ERROR:/Re:/http:/times survive). To keep stored
`collapse_start_index` valid, it NEVER drops messages — a bare 'nick:' husk
(empty after stripping) is left untouched.

    uv run python -m aethera.irc.clean_addresses            # dry-run (no writes)
    uv run python -m aethera.irc.clean_addresses --apply    # write changes
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from pathlib import Path

from .normalizer import strip_leading_address


def clean_db(db_path: str, apply: bool = False, show: int = 6) -> tuple[int, int]:
    """Returns (fragments_changed, lines_changed). Writes only if apply=True."""
    con = sqlite3.connect(db_path, timeout=10)
    try:
        con.execute("PRAGMA busy_timeout=8000")  # tolerate a concurrent banking writer
        rows = con.execute("SELECT id, messages_json FROM irc_fragments").fetchall()
        frags_changed = 0
        lines_changed = 0
        shown = 0

        for fid, mj in rows:
            try:
                msgs = json.loads(mj)
            except Exception:
                continue
            known = {
                (m.get("nick") or "").strip().lower()
                for m in msgs
                if m.get("type", "message") == "message" and m.get("nick")
            }
            known.discard("")
            if not known:
                continue

            changed = False
            for m in msgs:
                if m.get("type", "message") != "message":
                    continue
                content = m.get("content") or ""
                cleaned = strip_leading_address(content, known)
                # Only rewrite when it actually changed AND stays non-empty
                # (never drop a message — that would shift collapse_start_index).
                if cleaned != content and cleaned.strip():
                    if shown < show:
                        print(f"  {fid[:8]} <{m.get('nick')}>  {content[:48]!r} -> {cleaned[:48]!r}")
                        shown += 1
                    m["content"] = cleaned
                    changed = True
                    lines_changed += 1

            if changed:
                frags_changed += 1
                if apply:
                    con.execute(
                        "UPDATE irc_fragments SET messages_json=? WHERE id=?",
                        (json.dumps(msgs), fid),
                    )

        if apply:
            con.commit()
        return frags_changed, lines_changed
    finally:
        con.close()


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(
        prog="python -m aethera.irc.clean_addresses",
        description="Backfill: strip 'nick:' address tics from banked fragments.",
    )
    parser.add_argument("--db", default="data/irc.sqlite", help="SQLite path")
    parser.add_argument("--apply", action="store_true", help="Write changes (default: dry-run)")
    args = parser.parse_args(argv)

    db = Path(args.db)
    if not db.exists():
        print(f"DB not found: {db.resolve()}", file=sys.stderr)
        return 1

    mode = "APPLY" if args.apply else "DRY-RUN"
    print(f"[{mode}] cleaning 'nick:' address tics in {db}")
    frags, lines = clean_db(str(db), apply=args.apply)
    verb = "cleaned" if args.apply else "would clean"
    print(f"{verb}: {lines} lines across {frags} fragments")
    if not args.apply and lines:
        print("re-run with --apply to write the changes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
