"""
parity_music.py — record life_music.py rendering a scripted evening.

A sequence of snapshots (a boom, a cycle broken by an injection — which
scores the cadence — a style switch mid-buffer-stream, population spikes for
the noise bursts, epochs changing the root) is fed to the original
LifeMusicEngine and every stereo buffer it renders is written down.
scripts/parity-music.ts renders the same evening through the port.

Then a longer evening goes through the original's PyAudio callback itself
(master volume, mute, tanh soft clip): 620 buffers, with a third cadence and
two back-to-back style switches that land mid-crossfade. The port answers it
with renderBlock(), what the worklet plays.

The noise pool is the one random thing in the engine; both sides replace it
with the same deterministic sequence.

    python scripts/parity_music.py /path/to/afterlife > /tmp/music.json
    npx tsx scripts/parity-music.ts /tmp/music.json
"""

import json
import math
import sys
from types import SimpleNamespace

import numpy as np

sys.path.insert(0, sys.argv[1] if len(sys.argv) > 1 else ".")
import life_music as lm  # noqa: E402

N = lm.BUFFER_SIZE
STEREO_BUFFERS = 90
CALLBACK_BUFFERS = 620


def pool():
    i = np.arange(lm.SAMPLE_RATE, dtype=np.float64)
    return (np.sin(i * 12.9898) * 43758.5453 % 1.0 * 2 - 1).astype(np.float32)


def evening(nb):
    """(buffer index → snapshot kwargs)"""
    moods = ["", "booming", "booming", "cycle", "cycle", "injection", "declining", "sparse", "dense", "stagnant", "haunted"]
    epochs = ["genesis", "genesis", "primordial", "emergence", "expansion", "deep time", "eternity"]
    for b in range(nb):
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
            event="inject:heavy(cycle=3)" if b in (12, 40, 480) else ("inject:edge" if b == 20 else ""),
            activity_x=0.5 + 0.4 * math.sin(b * 0.3),
        )


def as_lists(left, right):
    return [left.astype(float).tolist(), right.astype(float).tolist()]


# The stereo mix, as _render_stereo returns it
eng = lm.LifeMusicEngine()
eng._noise_pool = pool()
stereo = []
for b, kw in evening(STEREO_BUFFERS):
    if b == 30:
        eng.cycle_style()  # → chiptune
    if b == 70:
        eng.cycle_style()  # → ambient again
    eng.update(lm.SimulationSnapshot(**kw))
    stereo.append(as_lists(*eng._render_stereo(N)))

# What the speakers got: the callback, without a stream (or PyAudio) behind it
if lm.pyaudio is None:
    lm.pyaudio = SimpleNamespace(paContinue=0, paComplete=1, paOutputUnderflow=2)
eng = lm.LifeMusicEngine()
eng._noise_pool = pool()
eng._running = True
eng._channels = 2
callback = []
for b, kw in evening(CALLBACK_BUFFERS):
    if b in (30, 70, 300, 301):
        eng.cycle_style()  # 300 → 301: a switch mid-crossfade
    eng._master_volume = 0.7 if b < 400 else 1.0
    eng._muted = 350 <= b < 360
    eng.update(lm.SimulationSnapshot(**kw))
    data, _ = eng._audio_callback(None, N, {}, 0)
    samples = np.frombuffer(data, dtype=np.float32)
    callback.append(as_lists(samples[0::2], samples[1::2]))

json.dump({"stereo": stereo, "callback": callback}, sys.stdout)
