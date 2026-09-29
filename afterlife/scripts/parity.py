"""
parity.py — run the original afterlife, and write down what it did.

The web port claims to be the same universe. This drives life.py's own
InfiniteLife from a seeded genesis and records everything the port has to
reproduce: every step's population, telemetry, camera, zoom, mood and tempo,
then the final ages, the display maps at every zoom, the census, auto-focus,
and a stretch of haunted mode. scripts/parity.ts replays the same genesis
through the port and compares.

The dice are taken out (injections become no-ops; their choices are the
one thing a replay can't share), which leaves the physics, the camera, the
infinity engine's telemetry and every read-out deterministic.

    python scripts/parity.py /path/to/afterlife > /tmp/parity.json
    npx tsx scripts/parity.ts /tmp/parity.json

Needs numpy and scipy (the census is scipy's in the original).
"""

import json
import random
import sys

import numpy as np

sys.path.insert(0, sys.argv[1] if len(sys.argv) > 1 else ".")
import life  # noqa: E402


def sparse(a):
    idx = np.flatnonzero(a)
    return [[int(i), int(a.flat[i])] for i in idx]


def still(lf):
    lf._inject = lambda *a, **k: None
    lf._inject_from_edge = lambda *a, **k: None
    lf._inject_garden = lambda *a, **k: None
    lf._inject_provoke = lambda *a, **k: ""
    lf._inject_collide = lambda *a, **k: False


def run(rows, cols, steps, seed, haunt_at=None, pan_at=None):
    random.seed(seed)
    np.random.seed(seed)
    lf = life.InfiniteLife(rows, cols)
    still(lf)
    out = {
        "rows": rows, "cols": cols,
        "cam": [lf.cam_y, lf.cam_x],
        "initial": sparse(lf.age),
        "steps": [],
    }
    for s in range(steps):
        if haunt_at is not None and s == haunt_at:
            lf.toggle_haunted()
        if pan_at is not None and s == pan_at:
            lf.pan(7, -12)
            lf.zoom_out()
        event = lf.step()
        dil = lf.time_dilation()
        rec = {
            "event": event,
            "pop": lf.population(),
            "floor": lf.pop_floor,
            "spread": lf.spread,
            "cycle": lf.cycle_period,
            "cam": [lf.cam_y, lf.cam_x],
            "zoom": lf.zoom_level,
            "mood": lf._detect_mood(),
            "dilation": dil,
            "ax": lf.activity_center_x(),
        }
        if s % 150 == 149:
            lf.take_census()
            rec["census"] = dict(sorted(lf.last_census.items()))
            rec["sites"] = sorted([list(x) for x in lf.last_census_sites])
        out["steps"].append(rec)
    out["final_age"] = sparse(lf.age)
    out["smooth_sum"] = float(lf.age_smooth.astype(np.float64).sum())
    out["activity_sum"] = float(lf.activity.astype(np.float64).sum())
    out["sparkline"] = lf.sparkline()
    out["epoch"] = lf.epoch()
    disp = {}
    for z in range(life.MIN_ZOOM, life.MAX_ZOOM + 1):
        lf.zoom_level = z
        lf._disp_grid_cache = None
        lf._disp_age_cache = None
        g = lf.display_grid()
        a = lf.display_age()
        disp[str(z)] = {"g_shape": list(g.shape), "a_shape": list(a.shape), "g": sparse(g), "a": sparse(a)}
    out["display"] = disp
    lf.auto_focus()
    out["focus"] = {"zoom": lf.zoom_level, "cam": [lf.cam_y, lf.cam_x]}
    return out


cases = [
    run(30, 100, 600, 1),
    run(40, 150, 400, 7, pan_at=120),
    run(25, 90, 160, 3, haunt_at=60),
]
json.dump(cases, sys.stdout, default=lambda o: o.item())
