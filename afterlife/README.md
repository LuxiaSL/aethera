# afterlife

> *the game of life, after hours.* A web port of
> [afterlife](https://github.com/LuxiaSL/afterlife), the terminal screensaver.
> Served at **`/afterlife`**, and on channel 10 in [oikos](../oikos).

Conway's Life on a toroidal world five times the size of the screen. A camera
steers toward the drama. A dramaturge stages collisions and aims gliders at
the citizens it has recognised. A ticker muses. The music scores it all, and
`g` brings back the bug that painted the void magenta.

It is meant to be the same program, not a tribute. The terminal was the
medium, so the page is a terminal: a canvas drawn as a grid of character
cells. Every cell is an upper-half block in the same xterm-256 colours curses
asked for, and the status line keeps to the grid one glyph per column.

## Faithful, and how we know

The engine (`src/engine/`) and the music (`src/music/engine.ts`) are
method-for-method ports of `life.py` and `life_music.py`. Two scripts replay
the Python original and compare the results:

```bash
# from the afterlife checkout (a uv project; scipy is an optional extra there)
cd /path/to/afterlife
uv run --with scipy python /path/to/scripts/parity.py . > /tmp/parity.json
npm run parity -- /tmp/parity.json          # "the same universe ✓"

python scripts/parity_music.py /path/to/afterlife > /tmp/music.json
npm run parity-music -- /tmp/music.json     # "the same music ✓"
```

`parity.py` refuses to run without scipy: `life.py` quietly turns its census
off without it, and the recording would be of the wrong universe. Recording
takes about two minutes, and so does the replay.

`parity` replays 22 cases, in three kinds:

- **still** (16): `life.py`'s `InfiniteLife` from a seeded genesis with the
  dice taken out, so the physics and every read-out are deterministic. Nine
  seeds; tiny, absurdly tiny, odd and 1080p terminals; travellers crossing
  every seam of the torus; haunted mode; pan, zoom, toggle, focus and home;
  and resizes, where a new world adopts the old one.
- **live** (4): the dice stay in. `life.py`'s `random` and `np.random` are
  swapped for one mulberry32 stream that the port draws from too. Genesis,
  every injection, a garden at generation 5000, and on-cue provokes and
  collisions then have to draw the same numbers in the same order. One thing
  is pinned: `_find_quiet_spot` orders tied scores by
  `np.argpartition`, which is numpy's implementation detail, so the live
  cases give it a stable sort, as the port uses.
- **focus** (2): hundreds of small worlds of stamped clumps, for
  `auto_focus`'s hotspot (scipy's `uniform_filter` breaks exact ties by its
  own rounding, and the port reproduces it) and its percentiles.

Every step is checked: population, pop floor, spread, cycle detection, engine
events, camera, auto-zoom, mood, time dilation, the activity centroid, a
checksum of every age, the smoothed ages and activity, the display maps every
seventh step, the census and its sites every 150, and, in live cases, the
draw count. At the end it checks the final ages, the display maps at all five
zooms, the sparkline, the epoch and auto-focus. All of it matches exactly.
`parity-music` feeds both engines the same scripted evening: a boom, a broken
cycle and its cadence, two style crossfades, noise bursts, and epoch roots.
Every sample matches within float32 rounding (worst |Δ| ≈ 2e-7).

## What changed for the web, and why

- **The universe lives in localStorage** (`afterlife-universe-v1`), not
  `universe.npz`. It is saved when you leave (`pagehide`, or the tab being
  hidden) and every 5000 generations, and resumed on the next visit with
  *the universe remembers generation N*. Only ages are stored, sparsely (the
  grid is exactly `age > 0`), because a save must be synchronous on the way
  out. oikos reads the same key, so its screen runs *your* universe.
- **Music waits for a gesture.** Browsers only start sound from a click or a
  key, so the splash asks for one. Until then the status line shows no music,
  just as the terminal did without PyAudio. The engine runs in an
  AudioWorklet at 44.1 kHz and renders the same 2048-frame buffers PyAudio
  asked for, because its smoothing constants are per buffer. `vite.config.ts`
  bundles the worklet with esbuild and inlines it into the page.
- **`q` leaves**: back where you came from, or to æthera. Inside an oikos
  screen it can't leave, and the ticker says so; ⏏ is on the other side of the
  glass. **`d`** records snapshots as before and downloads `snapshots.jsonl`
  when you stop (`life_music_diag.py --replay` reads it). `life_stats.csv` is
  kept in memory and downloads from the keys panel.
- **More than a terminal's mouse.** A click still toggles a cell. You can
  also drag to draw life, right-drag or shift-drag to pan, and scroll to zoom.
  On touch: tap to toggle, drag to pan, pinch to zoom. The **keys** panel
  (`?`) lists every key and runs it on click, for phones.
- **Narrow screens get a two-line status.** On a phone the ticker would lose
  its room to the stats and fall back to the terminal's compact line, so the
  ticker gets a line of its own instead. The sparkline shortens to fit.
- **Resizing keeps the universe**, as `KEY_RESIZE` did: it is adopted,
  centred, into the new world.
- Two display caches are now invalidated on pan, zoom and toggle. In the
  terminal, a pan or click made while paused didn't show until you unpaused.

## Layout

```
src/engine/   life.ts (InfiniteLife), census, ticker, musings, constants, persist, stats
src/term/     render.ts (the terminal: grid, status line, stats overlay), palette.ts (xterm-256)
src/music/    engine.ts (LifeMusicEngine), worklet.ts, audio.ts (the page's side)
src/main.ts   life.py's main(): the loop, keys, pointer, splash, persistence
scripts/      parity checks, bench.ts (life_bench.py), shot.mjs (headless screenshots)
```

The engine and renderer have no DOM dependencies beyond a 2D context, so
oikos imports them directly (`oikos/src/screens/afterlife.ts`).

## Build

Like syrinx, apeiron and oikos, the built bundle is committed. The Docker
image never runs npm, so rebuild and commit whenever `src/` changes. Rebuild
oikos too if `src/engine` or `src/term` changed, since it bundles them.

```bash
npm install
npm run build        # → ../aethera/static/afterlife/afterlife.{js,css}
npm run dev          # the standalone index.html on :5198
npm run bench        # per-frame cost, headless (240×66 terminal by default)
npm run shot -- out/ [url]   # splash, lived, stats, haunted, keys, resume, phone
```

`shot` wants Playwright's Chromium. Set `CHROMIUM=/path/to/chrome` if the
downloaded one doesn't match.
