"""
parity_music.py — record life_music.py rendering a scripted evening.

A sequence of snapshots (a boom, a cycle broken by an injection — which
scores the cadence — a style switch mid-buffer-stream, population spikes for
the noise bursts, epochs changing the root) is fed to the original
LifeMusicEngine and every stereo buffer it renders is written down.
scripts/parity-music.ts renders the same evening through the port.

The noise pool is the one random thing in the engine; both sides replace it
with the same deterministic sequence.

    python scripts/parity_music.py /path/to/afterlife > /tmp/music.json
    npx tsx scripts/parity-music.ts /tmp/music.json
"""

import json
import math
import sys

import numpy as np

sys.path.insert(0, sys.argv[1] if len(sys.argv) > 1 else ".")
import life_music as lm  # noqa: E402

N = lm.BUFFER_SIZE


def pool():
    i = np.arange(lm.SAMPLE_RATE, dtype=np.float64)
    return (np.sin(i * 12.9898) * 43758.5453 % 1.0 * 2 - 1).astype(np.float32)


def evening():
    """(buffer index → snapshot kwargs, controls)"""
    moods = ["", "booming", "booming", "cycle", "cycle", "injection", "declining", "sparse", "dense", "stagnant", "haunted"]
    epochs = ["genesis", "genesis", "primordial", "emergence", "expansion", "deep time", "eternity"]
    for b in range(90):
        rows = 60
        col = [((r * 7 + b * 3) % 11) < 2 for r in range(rows)]
        yield b, dict(
            generation=b * 4,
            population=400 + 40 * b,
            pop_floor=300,
            density=0.01 + 0.002 * b,
            spread=(b * 13) % 250,
            cycle_period=3 if moods[b % len(moods)] == "cycle" else 0,
            mood=moods[(b // 3) % len(moods)],
            epoch=epochs[(b // 13) % len(epochs)],
            pop_delta=[0, 5, 35, -60, 120, 0, -25][b % 7],
            playhead_column=tuple(col),
            playhead_position=(b % 30) / 30.0,
            viewport_rows=rows,
            event="inject:heavy(cycle=3)" if b in (12, 40) else ("inject:edge" if b == 20 else ""),
            activity_x=0.5 + 0.4 * math.sin(b * 0.3),
        )


eng = lm.LifeMusicEngine()
eng._noise_pool = pool()
bufs = []
for b, kw in evening():
    if b == 30:
        eng.cycle_style()  # → chiptune
    if b == 70:
        eng.cycle_style()  # → ambient again
    snap = lm.SimulationSnapshot(**kw)
    eng.update(snap)
    left, right = eng._render_stereo(N)
    bufs.append([left.astype(float).tolist(), right.astype(float).tolist()])
json.dump(bufs, sys.stdout)
