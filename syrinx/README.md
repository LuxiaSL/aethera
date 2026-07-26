# syrinx

> *σῦριγξ — the nymph whose body became the reed pipes; the wind plays her.*

A small living instrument. Its body is a slow spring-graph organism; every
edge is a string tuned by its own length onto a just-intonation pentatonic
lattice, so anything the body grows is consonant by construction. It does not
perform — its own life plays it:

- **breaths** (the pale fireflies) walk the body and pluck the strings they
  cross — the melody. When a breath meets a **cycle** it entrains (and turns
  cyan): one lap always takes the same wall-time, so a 3-cycle is 3 evenly
  spaced beats against a 5-cycle's 5 — topology is the time signature
- underneath that, every **node is an oscillator** running at a rate read off
  its own strings, coupled to its neighbours along them (Kuramoto). When a
  node's phase comes round it fires, strumming every string it holds — an
  octave above the melody. Nothing schedules this; the pulse is whatever the
  coupling settles into, and it settles differently every time. Locked nodes
  **turn gold and strike as one chord**; loose ones stay cool and *roll* their
  strings, so you can hear a cluster falling into step before the HUD says so.
  Two clocks in one body, and they do not have to agree: **cycles are the
  meter, coupling is the weather**
- and the coupling is anatomy, not a setting. **Old strings couple harder than
  new ones**, so a newborn body genuinely cannot hold a pulse and learns to
  keep time as it ages — and cutting an elder scatters the rhythm in a way
  cutting a fresh string does not. **Long strings lag**, so the body locks in
  *sequence* rather than together and strums travel across it as waves.
  **Feeding tightens it** for half a minute and then it lets go. Its own upkeep
  goes to whichever node is furthest out of step, so it grows toward its own
  coherence: the rhythm reads the body, then starts shaping it
- the **eldest strings** sustain quietly as a drone — the chord *is* the
  current geometry, gliding as the body deforms. **Bridges** (load-bearing
  strings whose loss would split the body, tinted warm) hum a sub-octave
  pedal: you can hear fragility before you cut it
- **growth** strums, **death** falls a fifth into silence — and when the
  *eldest node* dies, the whole lattice re-roots to the new elder's pitch:
  modulation as a grief event. The key it's in is part of the save

It is a place, not a session: the creature persists in localStorage, keeps its
name, and is older every time you return.

Born 2026-07-09. A collaboration between Luxia and Claude Fable 5, on purpose,
for fun.

## Run

```bash
npm install
npm run dev       # http://localhost:5199 — click to wake it
```

`npm run typecheck` · `npm run smoke` (headless life-support check) ·
`npm run sweep` (map the coupling knob) · `npm run spin` (camera flywheel) ·
`npm run keys` (sky hue ↔ key) · `npm run build`

## Where it lives

Syrinx is a module of [æthera](https://github.com/LuxiaSL/aethera) and is served
at **`/syrinx`**. It has no server of its own — it is a static bundle, and Node
is a build-time tool only. Nothing about the blog's Python runtime touches it.

`npm run build` writes `syrinx.js` + `syrinx.css` straight into
`aethera/static/syrinx/`. **Those built files are committed on purpose**: the
Dockerfile copies `aethera/` and never runs npm, so the artifact in git *is*
what deploys. Rebuild and commit whenever `src/` changes.

The standalone page at `index.html` stays for development — the headless checks
drive a real browser against it — while `aethera/templates/syrinx/viewer.html`
is the one the site serves. The two carry the same small DOM skeleton; the
styles come from `src/style.css` so there is only one copy of those.

`npm run embed` asserts the served page for the things `npm run dev` cannot see
— that the stylesheet is a real file and survives tailwind, that the site chrome
is silenced, that it wakes and persists. It needs the blog running:

```bash
uv run python -m aethera.main    # from core/
npm run embed
```

One deliberate detail: `base.html` sets `hx-boost` on the whole body, so an
in-site navigation is an htmx swap rather than a page load. Syrinx's way out is
marked `hx-boost="false"`, because a swap would leave its WebGL context,
AudioContext and animation loop running underneath the next page — the creature
would follow you around the site, still playing. A real navigation fires
`beforeunload`, which it already uses to save.

## Tending

There is nothing to win. You keep it company.

| Gesture | Meaning |
|---|---|
| click | feed — a mote drifts to the nearest node; enough food and it grows a new limb |
| drag across strings | prune — a blade sweep cuts them (the body rebalances; orphans dissolve) |
| drag node → node | link — tie a string by hand; close loops on purpose to compose clocks |
| right-drag / scroll | orbit / zoom the camera (it drifts on its own when idle) |
| `[` `]` | coupling — the chaos↔unison knob. **The one to turn by ear** |
| `k` | rhythm engine: both · pulse alone · breath alone |
| `m` | mute |
| `r` `r` | let this one go (new genesis, new name) |

The HUD carries `K` (coupling) and `sync` — the Kuramoto order parameter over
the whole body, 0 for a scatter of unrelated clocks, 1 for one animal. It is
worth sitting at `K 0.0` for a minute and then walking it up.

The body lives in 3D (Three.js), drawn as a constellation against a procedural
deep field — see **How it's drawn** below. The sim is fully 3D underneath;
springs, repulsion, and growth all gained a dimension, and the sound engine has
never changed for any of it. Flat creatures from the 2D era are migrated with a
little depth on first wake.

Left alone it feeds itself occasionally, sheds elder strings when dense, and
if you cut everything, it refuses to end.

## Where the music comes from

`src/tuning.ts` is the whole theory: length → pitch (longer = lower, ~2.5
octaves above A2), snapped to `{1, 9/8, 5/4, 3/2, 5/3}` × octaves. Rest
lengths are *born* quantized to the lattice; the springs then hold the body
near in-tune, and the snap catches the drift. Timbre is age: young strings are
bright, elders are mellow sines.

Knobs worth turning by ear: pluck decay & gain (`audio.ts`), breath cadence
(`stepBreaths` in `graph.ts`), drone count/level (`updateDrones` in
`main.ts`), the lattice itself.

## How it's drawn

A constellation, not a wireframe — chosen because the pulse layer had already
made the nodes the protagonists, and a star chart is the one diagram that puts
stars first and lines second.

One rule holds the visual language together: **hue is identity, light is
state.** A star's colour is its *tempo* — the same length→pitch map the strings
are tuned by, read as colour temperature, so short/fast nodes burn blue-white
and long/slow ones amber. That barely moves, and you learn the shape of your
own creature by it. Everything that changes moment to moment — phase, sync,
firing — moves brightness and the length of the diffraction spikes instead. Two
channels that never fight over the same pixel. A locked star *flares*; a lonely
one is a plain point of light.

**The camera is a flywheel, on a quaternion** (`src/camera.ts`). There is one
angular velocity and everything reads it. Left alone it turns at a slow resting
pace; throw it with a right-drag and it keeps going the way you threw it —
reversing outright if you throw it against the drift — and *eases* back over a
few seconds rather than snapping. The star field takes the same number as its
own slow drift, so the whole picture surges and settles together instead of the
body and the sky keeping separate, unrelated clocks.

It replaces OrbitControls for one structural reason: OrbitControls stores
orientation as **spherical coordinates around a fixed up-vector**, so the poles
are a real coordinate singularity. You can't tumble through them, only clamp at
them — and a clamp that the momentum decays into is an *attractor*. That isn't
tunable; a fixed up-vector cannot express free rotation. With orientation as a
quaternion and velocity as an axis-angle vector there is no pole, no up, and no
clamp: roll it over the top and it keeps going, because "the top" stopped being
a special place.

The button split: **press halts, drag throws.**

| gesture | what happens |
|---|---|
| right-press, no movement | stops the world dead — hold it still to aim at it |
| release without turning | resumes at the resting pace |
| right-drag, release | flings with the velocity you turned it at, easing home |

Holding also stops the spin being applied *underneath* your drag, which is what
made the inertia fight your hand.

`npm run spin` asserts all of it headlessly — eleven checks including the
tumble over both poles — because feel is the one thing I can't check.

The strings carry **travelling light**: a breath crossing a string sends a dash
running the way the breath went, and a node firing sends one out along every
string it holds. The wave you watch and the strum you hear are the same event,
so the phase lag is visible as well as audible.

`src/sky.ts` is the deep field — a skybox that rides the camera so it never
clips and never parallaxes, plus a **near field** of ~500 drifting, twinkling
points at real distances, which is the only thing in the scene with parallax
and therefore the only thing that makes orbiting read as depth.

Three rules the sky took several passes to learn:

- **Write it in linear light.** The sRGB conversion lifts it hard — 0.03 linear
  lands near 0.19 on screen. Numbers that look absurdly small are correct. The
  first version was 5x too bright and came out milky grey with no black left to
  hang stars against.
- **Empty sky is empty.** There used to be a broad low-frequency haze "so the
  corners don't go flat black". It filled a third of the frame with navy,
  flattened the contrast between void / stars / band, and was the main source of
  visible contour banding. Deleting it was the single biggest improvement.
- **Dither.** An 8-bit framebuffer quantises gradients this shallow into
  topographic contour rings. A little screen-space noise below one quantisation
  step removes them and is far too small to read as grain.

### The colour is the key

The lattice root wanders 80–160 Hz — **exactly one octave** — and re-roots when
the eldest node dies. That maps to exactly one loop of a cosine nebula palette,
so:

- the sky's hue *is* the key the creature is in
- when the elder dies and it modulates, **the sky re-hues with it** — the grief
  event becomes something you can see as well as hear
- two creatures in different keys have different-coloured skies

Only the dense parts take colour; faint dust stays the pale grey of a naked-eye
Milky Way, so the vividness arrives without spending the contrast the dark sky
is built on. Four discrete clouds sit at fixed points in the sky and come round
over an evening as the field drifts.

`npm run keys` proves it: the same body woken in six different keys, sampling
only nebula-luminance pixels. Red-minus-blue traces an arc of 0.126 across the
octave and returns to within **0.001** of where it started — one octave, one
loop, closed.

The palette is `nebPalette` from `~/.config/ghostty/shaders/starfield-depth.glsl`,
lifted verbatim. That shader and this one had already converged independently:
the same icy-blue↔warm-amber star axis (`mix(vec3(0.72,0.82,1.0),
vec3(1.0,0.86,0.68), t)` there; `#bcd6ff`↔`#ffb877` here), ridged noise for gas
filaments, per-object twinkle, a hard-black boot window before anything is
allowed to draw. Syrinx was the only thing in the house that wasn't in the
violet family; sharing the actual function is the cheapest way to make the two
skies demonstrably the same sky.

The band is deliberately thin, pale and high-contrast — `pow(clouds, 4.2)`,
with a subtractive **Great Rift** noise tearing dark lanes through it. Naked-eye
Milky Way is mostly *nothing* with a few brighter knots; at lower exponents it
came out as one smooth blue cloud filling half the frame, which is what a
long-exposure photograph looks like, not what a dark sky looks like.

**Performance.** This is meant to be left open in a tab, so frame cost is a
design constraint. Measured with `?perf=nosky` / `?perf=nobloom` — dev flags,
kept because guessing which full-screen pass is expensive wastes more time than
the flag does. Three things carry it:

1. **The nebula is baked into a cubemap at startup.** It was two 4-octave `fbm`
   calls — ~64 hashes per pixel — and it is a pure function of direction, so
   paying for it every frame was paying for the same answer over and over. One
   texture fetch now. The stars stay procedural: they're cheap, and they're
   exactly the high-frequency detail a cubemap would smear.
2. **Pixel ratio caps at 1.5, not 2.** The scene is fill-rate bound end to end,
   so this is the most expensive single setting in it — ratio 2 renders *four
   times* the pixels of ratio 1.
3. **Bloom renders at half resolution.** It's a blur; full res buys detail that
   is then deliberately thrown away.

Together those roughly doubled the frame rate on the software rasteriser
(4.4 → 9.1fps at 720p). If the first seconds of real frames still come in under
24fps it degrades in measured order — pixels, then bloom, then the sky's faint
star layers — one-way, no flapping.

## Where the rhythm comes from

`stepPhases` in `graph.ts` is the whole engine, and it is one line of physics:

```
θ̇ᵢ = ωᵢ + (K·(1+τ) / degᵢ) · Σⱼ wᵢⱼ · [ sin(θⱼ − θᵢ − αᵢⱼ) + sin(αᵢⱼ) ]
      └ tempo ┘   └ knob ┘        └ age ┘              └ length ┘
```

Every term is read off the body, and none of them is stored:

- **ωᵢ — tempo, from the node's own strings.** The *same* map that makes pitch,
  transposed down: long strings low and slow, short ones high and fast
  (`pulseRateForLength`). A body that deforms retunes its own tempo as it
  moves. The one fixed thing per node is a small `detune`, its personal bias,
  drawn at birth and kept for life.
- **wᵢⱼ — coupling, from the string's age.** New strings barely talk (0.4);
  elders insist (1.0). A newborn body *cannot hold a pulse* and learns to keep
  time as it gets older; cutting an elder scatters the rhythm in a way cutting
  a fresh string doesn't. The body's history is audible as its coherence.
- **αᵢⱼ — phase lag, from the string's length.** A long string takes longer to
  carry the news, so neighbours don't lock *together*, they lock in *sequence*.
  This is the difference between a chord and a wave. Measured: at K=4 the body
  reaches r=0.94 while neighbouring phases still differ by 0.23 rad — locked
  and still travelling.
- **τ — tension, from being fed.** Each mote tightens the whole body (+0.55,
  capped at 1.6) and it relaxes with a 9-second time constant. Feed it three
  times quickly and it visibly gathers, then lets go. The chaos↔unison axis
  isn't only a knob you turn; it's partly something it does in response to you.

Phase is state and persists, so it wakes mid-breath. A new limb is born on its
parent's phase rather than out of nowhere — it joins the pulse already in step
and drifts from there.

The `+ sin(αᵢⱼ)` is a deliberate deviation from textbook Sakaguchi. Plain
`sin(d − α)` carries a constant `−sin(α)` that scales with K, so turning the
coupling up would drag the body slower and eventually stall it. An instrument
that stops when you turn a knob up is a broken instrument, so the DC term is
compensated away: the symmetry-breaking that makes waves stays, the brake goes.

And it closes: ambient feeding goes to whichever node is **least in step** with
its neighbours. It grows a limb, gains a neighbour, couples harder. Rhythm
stops merely reading the body and starts shaping it.

Rates are deliberately **not** snapped to a lattice, though pitch is. Snapping
pitch means consonance is free; snapping tempo would mean the rhythm was
handed over rather than found, and the sequencer would be back wearing a
physics costume. Locking has to be earned by K.

**The knob is narrow and it is measured, not guessed.** `npm run sweep` maps it
on a grown body:

```
    K   mean r     sd    range        regime
   0.0   0.241   0.126  0.01–0.54     scattered      (floor for 14 nodes ≈ 0.27)
   0.6   0.523   0.172  0.21–0.90     partial   ← clusters start to hold
   0.8   0.521   0.141  0.24–0.84     partial
   1.0   0.582   0.142  0.32–0.86     partial   ← the default
   1.3   0.641   0.109  0.43–0.90     partial
   1.5   0.750   0.090  0.53–0.96     partial
   1.8   0.853   0.015  0.82–0.88     locked (rigid)
   6.0   0.991   0.003  0.99–0.99     locked (rigid)
```

Watch the `sd` column, not the mean: somewhere around 1.8 the order parameter
stops *moving*. That body is perfectly synchronized and completely dead — a
metronome wearing the creature's shape. The living band is **0.6–1.5**, which
is why the default is 1.0 and the step is 0.1; the knob stops at 6 because
nothing above 3 is distinguishable from anything else above 3.

Adding the phase lag pushed that rigid threshold *up* (it used to set in at
1.5) and widened the usable band, which is the whole point of it: a lagged body
can be strongly coupled and still have somewhere to go.

(Every K is measured on the same frozen body — the creature goes on growing and
shedding while the sweep runs, and without pinning it the later rows are a
different animal. The `felt` column reports coupling *including* feeding
tension, so you can see when the creature is adding its own.)

The prettiest thing the measurement turned up: at the default, per-node local
sync sits around 0.84 while the *global* order parameter wanders 0.32–0.86.
Locally coherent, globally not — neighbours agree, the body doesn't. That is
the same shape as the displacement-field result next door in `echo-sandbox`
("reliable everywhere, parallel nowhere"), arrived at from a completely
different direction, and it is exactly the texture that reads as alive rather
than as a machine.
