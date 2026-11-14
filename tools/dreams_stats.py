#!/usr/bin/env python3
"""
Read the /dreams viewer stats (aethera/dreams/stats.py). Standard library only,
so it runs on the VPS host as is:

  python3 /opt/aethera-server/core/tools/dreams_stats.py            # last 7 days
  python3 tools/dreams_stats.py --days 30 --db path/to/dreams_stats.sqlite

Per UTC day: viewing sessions (bots excluded), distinct visitors, hours
watched, session length, peak concurrent viewers, hours the dream was live,
the site's outbound GB, then how sessions ended, devices, page views and
where visitors came from.
"""
import argparse
import math
import sqlite3
from pathlib import Path

DEFAULT_DB = Path(__file__).resolve().parent.parent / "data" / "dreams_stats.sqlite"


def q(conn, sql, *args):
    return conn.execute(sql, args).fetchall()


def pct(xs, p):
    """Nearest-rank percentile (p90 of two sessions is the longer one)."""
    xs = sorted(xs)
    return xs[max(0, math.ceil(p * len(xs)) - 1)] if xs else 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", type=Path, default=DEFAULT_DB)
    ap.add_argument("--days", type=int, default=7)
    a = ap.parse_args()
    if not a.db.exists():
        print(f"no stats yet: {a.db}")
        return 1
    conn = sqlite3.connect(f"file:{a.db}?mode=ro", uri=True)
    since = f"-{a.days} days"

    print(f"{'day (UTC)':10}  {'sessions':>8}  {'visitors':>8}  {'hours':>6}  {'median':>7}  {'p90':>6}"
          f"  {'peak':>4}  {'live h':>6}  {'out GB':>6}")
    days = [d for (d,) in q(conn, "SELECT DISTINCT substr(ts,1,10) FROM minute WHERE ts >= datetime('now', ?)"
                                  " UNION SELECT DISTINCT substr(started_at,1,10) FROM viewer_session"
                                  " WHERE started_at >= datetime('now', ?) ORDER BY 1", since, since)]
    for d in days:
        s = q(conn, "SELECT seconds, visitor FROM viewer_session WHERE substr(started_at,1,10)=? AND device != 'bot'", d)
        secs = [x for x, _ in s]
        m = q(conn, "SELECT max(viewers), sum(live), sum(coalesce(egress_bytes,0)) FROM minute WHERE substr(ts,1,10)=?", d)[0]
        print(f"{d:10}  {len(s):>8}  {len({v for _, v in s if v}):>8}  {sum(secs) / 3600:>6.1f}"
              f"  {pct(secs, .5) / 60:>6.1f}m  {pct(secs, .9) / 60:>5.0f}m  {m[0] or 0:>4}"
              f"  {(m[1] or 0) / 60:>6.1f}  {(m[2] or 0) / 1e9:>6.1f}")

    def table(title, sql):
        rows = q(conn, sql, since)
        if rows:
            print(f"\n{title}")
            for r in rows:
                print("  " + "  ".join(str(x) for x in r))

    table("how sessions ended (count, ended_by, close code, reason)",
          "SELECT count(*), ended_by, close_code, coalesce(close_reason,'') FROM viewer_session"
          " WHERE started_at >= datetime('now', ?) GROUP BY 2,3,4 ORDER BY 1 DESC LIMIT 10")
    table("devices (sessions, hours)",
          "SELECT device, count(*), round(sum(seconds)/3600.0, 1) FROM viewer_session"
          " WHERE started_at >= datetime('now', ?) GROUP BY 1 ORDER BY 2 DESC")
    table("page views (path, views)",
          "SELECT path, sum(views) FROM page_view WHERE hour >= strftime('%Y-%m-%dT%H', 'now', ?)"
          " GROUP BY 1 ORDER BY 2 DESC")
    table("where visitors came from (referrer, views)",
          "SELECT referrer, sum(views) FROM page_view WHERE hour >= strftime('%Y-%m-%dT%H', 'now', ?)"
          " AND device != 'bot' GROUP BY 1 ORDER BY 2 DESC LIMIT 12")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
