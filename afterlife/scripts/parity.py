"""
parity.py — run the original afterlife, and write down what it did.

The web port claims to be the same universe. This drives life.py's own
InfiniteLife and records everything the port has to reproduce: every step's
population, telemetry, camera, zoom, mood and tempo, a checksum of every
cell's age, the smoothed ages and activity, the display maps every seventh
step, the census every 150, then the final ages, the display maps at every
zoom, the sparkline, the epoch and auto-focus. scripts/parity.ts replays each
case through the port and compares.

There are two kinds of case.

  still  The dice are taken out (injections become no-ops), which leaves the
         physics, the camera, the infinity engine's telemetry and every
         read-out deterministic. The genesis is recorded and replayed.
         Many seeds, tiny and odd terminal sizes, travellers crossing the
         torus seams, haunted mode, pan/zoom/toggle/focus/home, and resizes
         (a new world adopting the old one).

  live   The dice stay in. life.py's `random` and `np.random.random` are
         replaced by one shared stream (mulberry32, reimplemented bit for
         bit in parity.ts, so both sides draw the same numbers in the same
         order), and randint/choice/shuffle map a draw to an integer the
         way the port does. Genesis, every injection, every dramaturge
         shot, and the draw count after each step must all agree.

         One substitution: _find_quiet_spot picks among the darkest
         quintile via np.argpartition, whose order among equal scores is
         numpy's implementation detail (introselect, or SIMD on AVX-512
         builds) and not something a port can promise. The live cases give
         it a stable argsort instead, which is what the port does. The
         quintile itself is unchanged; only the order of ties is pinned.

    cd /path/to/afterlife
    uv run --with scipy python /path/to/scripts/parity.py . > /tmp/parity.json
    npx tsx scripts/parity.ts /tmp/parity.json

Needs numpy and scipy. life.py quietly turns the census off without scipy
(and auto-focus loses its smoothing), so this refuses to run without it.
"""

import json
import random
import sys

import numpy as np

try:
    import scipy.ndimage  # noqa: F401
except ImportError:
    sys.exit(
        "parity.py needs scipy: life.py silently disables its census without it,\n"
        "and the parity would be checking the wrong universe.\n"
        "    uv run --with scipy python scripts/parity.py /path/to/afterlife"
    )

sys.path.insert(0, sys.argv[1] if len(sys.argv) > 1 else ".")
import life  # noqa: E402

if getattr(life, "_nd_label", None) is None or getattr(life, "_uniform_filter", None) is None:
    sys.exit("parity.py: life.py imported without scipy.ndimage; refusing to record a census-less universe")


# ── the shared dice ──────────────────────────────────────────────────────
M32 = 0xFFFFFFFF


class Stream:
    """mulberry32, as parity.ts has it: one uniform draw in [0, 1) per call."""

    def __init__(self, seed: int) -> None:
        self.a = seed & M32
        self.draws = 0

    def __call__(self) -> float:
        self.draws += 1
        self.a = (self.a + 0x6D2B79F5) & M32
        a = self.a
        t = ((a ^ (a >> 15)) * (1 | a)) & M32
        t = ((t + (((t ^ (t >> 7)) * (61 | t)) & M32)) & M32) ^ t
        return ((t ^ (t >> 14)) & M32) / 4294967296


STREAM = Stream(0)


class SharedRandom:
    """life.py's `random`, drawing from STREAM the way the port's helpers do."""

    def random(self) -> float:
        return STREAM()

    def randint(self, a: int, b: int) -> int:
        return a + int(np.floor(STREAM() * (b - a + 1)))

    def choice(self, xs):
        xs = list(xs)
        return xs[int(np.floor(STREAM() * len(xs)))]

    def shuffle(self, xs) -> None:
        for i in range(len(xs) - 1, 0, -1):
            j = int(np.floor(STREAM() * (i + 1)))
            xs[i], xs[j] = xs[j], xs[i]

    def seed(self, *_a) -> None:
        pass


def shared_np_random(shape):
    h, w = shape
    return np.array([STREAM() for _ in range(h * w)], dtype=np.float64).reshape(h, w)


def stable_argpartition(a, kth, **_kw):
    # life.py's only np.argpartition call is _find_quiet_spot's darkest
    # quintile; [:k] of a stable argsort is that quintile, ties in index order
    return np.argsort(a, kind="stable")


REAL = {"random": life.random, "np_random": life.np.random.random, "argpartition": life.np.argpartition}


def dice(live: bool, seed: int) -> None:
    if live:
        global STREAM
        STREAM = Stream(seed)
        life.random = SharedRandom()
        life.np.random.random = shared_np_random
        life.np.argpartition = stable_argpartition
    else:
        life.random = REAL["random"]
        life.np.random.random = REAL["np_random"]
        life.np.argpartition = REAL["argpartition"]
        random.seed(seed)
        np.random.seed(seed)


# ── recording ────────────────────────────────────────────────────────────
def sparse(a):
    idx = np.flatnonzero(a)
    return [[int(i), int(a.flat[i])] for i in idx]


def cks(a) -> int:
    """sum of value × ((index mod 9973) + 1): a position-sensitive fingerprint"""
    flat = a.astype(np.int64).ravel()
    w = (np.arange(flat.size, dtype=np.int64) % 9973) + 1
    return int((flat * w).sum())


def still(lf) -> None:
    lf._inject = lambda *a, **k: None
    lf._inject_from_edge = lambda *a, **k: None
    lf._inject_garden = lambda *a, **k: None
    lf._inject_provoke = lambda *a, **k: ""
    lf._inject_collide = lambda *a, **k: False


def run(name, rows, cols, steps, seed, live=False, extra=(), actions=None, clear=False):
    actions = actions or {}
    dice(live, seed)
    lf = life.InfiniteLife(rows, cols)
    if not live:
        still(lf)
    if clear:
        lf.grid[:] = 0
        lf.age[:] = 0
    for pat, y, x, rot in extra:
        lf._place(pat, y, x, rotation=rot)
    if clear or extra:
        lf.age_smooth = lf.age.astype(np.float32)
    out = {
        "name": name, "mode": "live" if live else "still", "seed": seed,
        "rows": rows, "cols": cols, "cam": [lf.cam_y, lf.cam_x],
        "actions": {str(k): v for k, v in actions.items()},
        "steps": [],
    }
    if live:
        out["rng_init"] = STREAM.draws
        out["initial_cks"] = cks(lf.age)
    else:
        out["initial"] = sparse(lf.age)
    for s in range(steps):
        acted = []
        for act in actions.get(s, []):
            op = act[0]
            if op == "haunt":
                lf.toggle_haunted()
            elif op == "pan":
                lf.pan(act[1], act[2])
            elif op == "zin":
                lf.zoom_in()
            elif op == "zout":
                lf.zoom_out()
            elif op == "toggle":
                lf.toggle_cell(act[1], act[2])
            elif op == "focus":
                lf.auto_focus()
            elif op == "home":
                lf.home()
            elif op == "resize":
                # KEY_RESIZE: a new world for the new terminal adopts the old
                old = lf
                lf = life.InfiniteLife(act[1], act[2])
                if not live:
                    still(lf)
                lf.haunted = old.haunted
                lf.adopt(old.grid, old.age, old.generation, old.total_injections)
            # the dramaturge on cue (live cases: these roll dice)
            elif op == "provoke":
                acted.append(str(lf._inject_provoke()))
            elif op == "collide":
                acted.append("1" if lf._inject_collide() else "0")
            elif op == "garden":
                lf._inject_garden()
            elif op.startswith("inject:"):
                lf._inject(op.split(":", 1)[1])
            else:
                raise ValueError(f"unknown action {op!r}")
        event = lf.step()
        dil = lf.time_dilation()
        rec = {
            "event": event, "pop": lf.population(), "floor": lf.pop_floor,
            "spread": lf.spread, "cycle": lf.cycle_period,
            "cam": [lf.cam_y, lf.cam_x], "zoom": lf.zoom_level,
            "mood": lf._detect_mood(), "dilation": dil,
            "ax": lf.activity_center_x(),
            "ack": cks(lf.age),
            "sm": float(lf.age_smooth.astype(np.float64).sum()),
            "act": float(lf.activity.astype(np.float64).sum()),
        }
        if s % 7 == 0:
            rec["dg"] = cks(lf.display_grid())
            rec["da"] = cks(lf.display_age())
            rec["dshape"] = list(lf.display_age().shape)
        if s % 150 == 149:
            lf.take_census()
            rec["census"] = dict(sorted(lf.last_census.items()))
            rec["sites"] = [list(x) for x in lf.last_census_sites]  # order kept
        if live:
            rec["rng"] = STREAM.draws
        if acted:
            rec["acted"] = acted
        out["steps"].append(rec)
    out["final_age"] = sparse(lf.age)
    out["sparkline"] = lf.sparkline()
    out["epoch"] = lf.epoch()
    disp = {}
    for z in range(life.MIN_ZOOM, life.MAX_ZOOM + 1):
        lf.zoom_level = z
        lf._disp_grid_cache = None
        lf._disp_age_cache = None
        g = lf.display_grid()
        a = lf.display_age()
        disp[str(z)] = {"g_shape": list(g.shape), "a_shape": list(a.shape), "g": cks(g), "a": cks(a)}
    out["display"] = disp
    lf.auto_focus()
    out["focus"] = {"zoom": lf.zoom_level, "cam": [lf.cam_y, lf.cam_x]}
    print(f"  {name}: {cols}x{rows}, {steps} steps", file=sys.stderr)
    return out


def travellers_on_edges(H, W):
    """gliders and a spaceship straddling, or heading across, every world seam"""
    return [
        ("glider", 1, W // 2, 2), ("glider", H - 3, W // 3, 0),
        ("glider", H // 2, 1, 1), ("glider", H // 3, W - 3, 3),
        ("lwss", 0, W // 4, 0), ("lwss", H // 4, W - 2, 1),
        ("glider", 0, 0, 2), ("glider", H - 2, W - 2, 0),
    ]


def focus_probes(name, rows, cols, worlds, seed):
    """auto_focus on many small worlds of stamped clumps.

    Each clump is stamped several times, so 3×3 block neighbourhoods tie
    exactly in whole cells and scipy's uniform_filter breaks the ties by its
    own rounding; the 10th/90th percentiles of the core size the zoom. The
    main cases call auto_focus a handful of times; this calls it hundreds.
    """
    dice(False, seed)
    rng = np.random.default_rng(seed)
    lf = life.InfiniteLife(rows, cols)
    H, W = lf.world_h, lf.world_w
    home = (lf.cam_y, lf.cam_x)
    out = {"name": name, "mode": "focus", "seed": seed, "rows": rows, "cols": cols, "worlds": []}
    for _ in range(worlds):
        lf.grid[:] = 0
        lf.age[:] = 0
        for _t in range(int(rng.integers(1, 4))):
            ch, cw = (int(v) for v in rng.integers(2, 24, 2))
            clump = (rng.random((ch, cw)) < rng.uniform(0.1, 0.6)) * rng.integers(1, 30, (ch, cw))
            for _s in range(int(rng.integers(1, 5))):
                y, x = int(rng.integers(0, H - ch)), int(rng.integers(0, W - cw))
                lf.age[y:y + ch, x:x + cw] = clump
        lf.grid[:] = (lf.age > 0).astype(lf.grid.dtype)
        lf.zoom_level = 0
        lf.cam_y, lf.cam_x = home
        lf.auto_focus()
        out["worlds"].append({"age": sparse(lf.age), "focus": {"zoom": lf.zoom_level, "cam": [lf.cam_y, lf.cam_x]}})
    print(f"  {name}: {worlds} worlds", file=sys.stderr)
    return out


EVERYTHING = {
    40: [["haunt"]], 120: [["zout"], ["zout"]], 160: [["haunt"]],
    200: [["zin"], ["zin"], ["zin"]], 230: [["pan", 5, -9]], 260: [["zin"]],
    300: [["toggle", 3, 4], ["toggle", 10, 20]], 330: [["focus"]], 400: [["home"]],
    450: [["haunt"]], 470: [["zout"], ["zout"], ["zout"]], 520: [["haunt"]],
    560: [["resize", 22, 70]], 640: [["resize", 35, 130]], 700: [["zout"]],
}

cases = [
    # still: the dice out, the genesis recorded
    run("seed 1", 30, 100, 600, 1),
    run("pan + zoom out", 40, 150, 400, 7, actions={120: [["pan", 7, -12], ["zout"]]}),
    run("haunted", 25, 90, 160, 3, actions={60: [["haunt"]]}),
    *[run(f"seed {s}", 30, 100, 900, s) for s in (11, 12, 13, 14, 15)],
    run("tiny terminal", 10, 40, 600, 21),       # the 400×800 world floor
    run("absurdly tiny", 3, 7, 300, 22),
    run("odd sizes", 41, 161, 600, 23),
    run("1080p", 66, 240, 400, 24),
    run("seams, empty world", 20, 80, 800, 31, extra=travellers_on_edges(400, 800), clear=True),
    run("seams, in the soup", 20, 80, 800, 32, extra=travellers_on_edges(400, 800)),
    run("every key + resizes", 30, 100, 800, 41, actions=EVERYTHING),
    run("small, zoomed out, haunted", 12, 30, 500, 42,
        actions={10: [["zout"], ["zout"]], 50: [["haunt"]], 300: [["haunt"]]}),
    # auto-focus, many times over
    focus_probes("auto-focus probes", 10, 40, 400, 51),
    focus_probes("auto-focus probes, 1080p", 66, 240, 150, 52),
    # live: the dice in, one shared stream
    # (the census runs after steps 150, 300, …; provoke aims at its sites)
    run("live", 30, 100, 1500, 101, live=True,
        actions={100: [["haunt"]], 151: [["provoke"], ["collide"]], 200: [["inject:massive"]],
                 250: [["garden"], ["inject:medium"]], 301: [["provoke"], ["provoke"], ["collide"]],
                 400: [["haunt"]], 451: [["collide"], ["provoke"]], 600: [["zout"]], 700: [["focus"]],
                 800: [["pan", -6, 11], ["toggle", 5, 5]], 900: [["home"]],
                 1000: [["resize", 22, 70]], 1051: [["provoke"], ["collide"]],
                 1200: [["resize", 41, 161]], 1351: [["collide"], ["inject:heavy"]]}),
    run("live, tiny terminal", 10, 40, 5100, 102, live=True),   # a garden at 5000
    run("live, odd sizes", 41, 161, 1000, 103, live=True),
    run("live, 1080p", 66, 240, 600, 104, live=True),
]
json.dump(cases, sys.stdout, default=lambda o: o.item() if hasattr(o, "item") else str(o))
