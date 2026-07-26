# syrinx — design backlog

Ideas we've talked about but are deliberately not sprinting through. The rule
for all of them: no sequencer anywhere — every musical structure must be read
off the substrate.

## ~~Kuramoto oscillators~~ — SHIPPED 2026-07-24 (Claude Opus 5)
Built as specced: toggleable layer (`k`), coupling live on `[` `]`, natural
rates read off each node's strings, phase persisted. `npm run sweep` measures
the knob — the living band turned out to be **K 0.6–1.3**, much narrower and
much lower than guessed, and everything above ~1.6 is a rigid metronome (order
parameter with *zero* variance). Default 1.0. See README, "Where the rhythm
comes from".

Two things worth knowing that only showed up in the building:
- **Locking has to be earned.** Natural rates are deliberately unquantized.
  Snapping them to a rational lattice the way pitch is snapped would look like
  the same move but isn't — it hands the rhythm over instead of finding it.
- **Coherence had to be made audible, not just true.** Sync opens the filter,
  lifts the gain, *and* collapses the strum from a roll into a chord. Without
  that last one the order parameter was a number on the HUD and nothing in the
  ears.

### Follow-ons — all four SHIPPED same day
- ~~**Phase-lag coupling (Kuramoto–Sakaguchi).**~~ α from string length. Worth
  more than expected: it pushed the *rigid* threshold up from K≈1.5 to K≈1.8
  and widened the living band to 0.6–1.5. A lagged body can be strongly coupled
  and still have somewhere to go — measured at K=4, r=0.94 with neighbours
  still 0.23 rad apart. Needed one deviation from the textbook: the `+ sin(α)`
  DC compensation, or raising K drags the tempo down and eventually stalls the
  creature.
- ~~**Coupling as anatomy.**~~ `w = 0.4 → 1.0` over `EDGE_ELDER_AGE`. Measured
  effect is large (r 0.45 → 0.75 for the same body at the same K, young vs
  old). Best consequence, unplanned: "it is older every time you return" now
  has a *rhythmic* meaning — a young creature genuinely can't keep time yet.
- ~~**Feeding tightens it.**~~ τ +0.55/mote, cap 1.6, 9s decay. The time
  constant had to come down from 22s — at 22s the creature's own ambient
  feeding kept it permanently tense (+50% coupling forever) and the response
  to *you* stopped being legible. Anything at or above the ~24s ambient
  interval will do that.
- ~~**Sync as fitness.**~~ Ambient feeding seeks `leastLockedNode()`. The
  gentlest of the four and the one that closes the loop.

## The constellation pass — SHIPPED 2026-07-24 (Claude Opus 5)
Wireframe → star chart. `sky.ts` (procedural deep field), `materials.ts` (star
+ string shaders), travelling light along the strings. The organising rule is
**hue = identity, light = state**: colour is the node's tempo and barely moves,
everything transient rides brightness and spike length.

Things that cost an iteration each and are worth not re-learning:
- **Write the sky in linear light.** The sRGB conversion lifts it hard — 0.03
  linear lands near 0.19 on screen. First pass was 5x too bright and the whole
  frame went milky grey.
- **Spike exponents are two different jobs.** The big one sets how *thin* the
  ray is, the small one how *far* it reaches. Swapped, you get a blurry plus
  sign that reads as a round dot.
- **Cap star brightness.** Uncapped, a star that was fed *and* fired blew out
  into a white ball the size of the constellation.
- **The travelling light must not thicken the string.** Cylinder radius is
  uniform along the run, so leaning on it inflates the whole edge instead of
  the moving point. Brightness carries the wave; geometry stays a hairline.
- **Crisp rings read as UI.** The ripple had to become a soft annulus that
  fades fast, or it looks like interface chrome laid over the sky.

### Perf, measured (`?perf=nosky` / `?perf=nobloom`)
**Bloom dominates the frame — worth ~3x, far more than the entire procedural
sky.** I spent an iteration optimising `fbm` on the assumption the sky was the
problem; it bought ~10%. Measure first. Bloom now runs at half res by default
and the auto-degrade drops it to quarter res *before* touching the sky.

## The flywheel + two leftovers — SHIPPED 2026-07-25 (Claude Opus 5)
The camera's spin is now *state* rather than a constant, and the sky reads the
same number. Fling it and it keeps going, reverses if thrown against the drift,
eases home over ~3.4s. `npm run spin` checks it headlessly.

- **Two constants can't respond to each other.** The real problem wasn't the
  absence of momentum, it was that OrbitControls' `autoRotate` and the sky's
  `uDrift` were separate fixed rates. One shared velocity fixed both halves of
  the ask at once. Anything else that should move with the world reads
  `spinTheta`.
- **Integrate the drift, don't multiply.** `uDrift = time * rate` jumps the
  entire sky the instant `rate` changes. It has to accumulate.
- **`controls.update()` needs `deltaTime`.** Without it OrbitControls assumes
  60fps — a latent bug that made damping run slow on any struggling machine.
- **Guard the fling against the scroll wheel.** OrbitControls fires
  `start`/`end` for zoom too, so without a "did it actually rotate" check, a
  scroll reads as a fling of zero and brakes the creature to a halt.
- **Testing feel**: assert the *shape* (monotonic approach, no overshoot), not
  a wall-clock deadline. `frame()` clamps dt to 0.1s, so on a slow machine
  wall-time and sim-time diverge and "is it home yet" becomes a question about
  the frame rate instead of the easing.

Also tagged in, both from the list below: the **field now draws in and
brightens as feeding tightens the body** (the band narrows with `uTense`), and
**stars redden with age** — so a mature creature has warm elders at the core
and blue-white new growth at the edges. That last one rhymes with the rhythm
engine on purpose: old strings are also the ones that couple hardest.

## Quaternion camera, dark-sky pass, perf — SHIPPED 2026-07-25 (Claude Opus 5)

**The poles were structural, not tunable.** OrbitControls stores orientation as
spherical coords about a fixed up-vector, so a pole is a coordinate
singularity: you can only clamp there, and a clamp the momentum decays into is
an attractor. Replaced with `src/camera.ts` — orientation as a quaternion,
velocity as an axis-angle vector. No pole, no up, no clamp. `npm run spin` now
asserts a vertical fling sweeps elevation −0.99 … 0.99, i.e. clean over both.

- **The inertia fought the hand because I was applying it under the drag.**
  `update()` ran the omega rotation whether or not a drag was active. Held now
  means held.
- **Press halts, drag throws.** A bare right-click stops the world (aim at it);
  releasing without turning resumes the resting pace; a drag hands over the
  velocity you turned it at. Clean split — motion comes from moving.

**Dark sky.** Less blue, more black, thinner band. What mattered, in order:
deleting the broad haze (it was a third of the frame of navy *and* the main
source of contour banding), dithering the output (8-bit quantisation of these
gradients makes topographic rings), and raising the cloud exponent to 4.2 with
a subtractive Great Rift. Naked-eye Milky Way is mostly nothing with a few
bright knots; low exponents give the smooth blue cloud a camera sees, not the
thing an eye sees. Dust colour went pale grey-white — saturated blue was most
of what read as "washed".

**Perf, measured (4.4 → 9.1fps at 720p on the software rasteriser).**
- **Bake anything that's a pure function of direction.** The nebula's two
  4-octave fbm calls were ~64 hashes/pixel/frame computing a constant. A
  256/face cubemap is indistinguishable and costs one fetch. Stars stayed
  procedural — a cubemap that size would smear exactly the detail they are.
- **Pixel ratio is the most expensive setting in a fill-bound scene.** Capped
  at 1.5; ratio 2 is 4x the pixels of ratio 1.
- **`hash33` instead of four `hash13`s.** Each star needed four randoms and was
  paying four full hashes for them.
- Degrade order is now measured rather than guessed: pixels → bloom → sky.
  (Earlier I "optimised" fbm on the assumption the sky was the problem and
  bought 10%. Measure first, every time.)

## Colour is the key — SHIPPED 2026-07-25 (Claude Opus 5)

The one bit of syrinx that wasn't read off the substrate was its palette, and
it was also the one thing in the house not in the luxia-violet family. Both
fixed at once: the lattice root spans exactly one octave, so it maps to exactly
one loop of a cosine palette, and the sky's hue *is* the creature's key.
Modulation — the eldest dying — now re-hues the whole field.

`npm run keys` measures it: same body, six keys, arc of 0.126 in normalised
red-minus-blue, closing to within 0.001 over the octave.

**The palette is `nebPalette` from the ghostty starfield shader, verbatim.**
Those two shaders had already converged without knowing about each other —
same icy-blue↔warm-amber star axis, ridged noise for filaments, per-object
twinkle, hard-black boot window, `.perfpass` discipline. Worth remembering as
evidence that the aesthetic here is a real grammar and not a mood.

Two test bugs that each looked like a broken feature:
- **`page.reload()` destroyed the thing I was seeding.** The app persists on
  `beforeunload`, so the live root was written back over the seeded one and
  every key came out identical. Fixed with a fresh page per key and
  `addInitScript`, which runs before any page script. Any test that seeds
  localStorage for this app has to do it that way.
- **Averaging the whole frame washed the signal out.** The sky is mostly black
  with fixed-colour stars; the nebula's hue vanishes into the mean. Sample
  mid-luminance pixels only, and normalise by brightness to measure hue rather
  than amount.
- And the pass threshold was calibrated for 0–255 values while the metric was
  normalised chroma, which made a *working* mapping report as broken. Check the
  units of the threshold, not just the measurement.

### Still open after all that
- **Rigidity comes back above K≈2.** The lag delays it, doesn't abolish it.
  Making α larger is the obvious lever but it distorts the tempo; a
  frequency-dependent or *randomised* lag might kill the rigid regime outright.
- **Per-string lag is currently only length.** Bridges could lag more than
  cycle strings — the load-bearing parts of the body being the slow parts to
  hear the news is a nice idea and it's already computed.
- ~~**Tension has no visual.**~~ Done — the dust band narrows and brightens.
- ~~**Star colour is monochrome on a uniform body.**~~ Done — age reddens.
- **The sky could be baked.** It barely changes — drift is a rotation and the
  twinkle is decoration. Rendering it once to a cubemap and rotating that would
  make it nearly free, at the cost of losing per-star twinkle. Worth doing if
  the sky ever becomes the bottleneck (it currently is not; bloom is).
- **The flywheel only moves the camera.** Nothing else in the scene has
  inertia. The obvious next one: let a hard fling *disturb the body* — the
  springs already exist, so a flung camera could impart a little sway the
  creature then settles out of. Would need care not to fight the sim.
- ~~**Polar momentum dies at the poles.**~~ Gone with the spherical camera.
- **Bloom is now the top cost again** (~50% of the frame). `UnrealBloomPass`
  hardcodes 5 mip levels; a custom 3-mip bloom would be meaningfully cheaper.
  Held off because it would change the glow's character, which is currently
  good.
- **Tension no longer narrows the band**, only brightens it — band width is
  baked into the cubemap now. Could bake two widths and blend if it's missed.
- **No touch support.** There wasn't really any before either (one-finger
  rotate fought one-finger prune), but it's now explicitly unimplemented.
- The old backlog below is untouched and still good — interval-aware growth and
  census motifs are the two that would change the harmony rather than the
  rhythm.

## Interval-aware growth
New strings currently pick a random lattice tone. Instead choose rest length
relative to neighbors' tones — consonance-seeking when well-fed,
tension-seeking when starved. The body's mood becomes audible as harmony.

## Stick-slip strain plucks (the ptyx move)
Strings fire when spring strain crosses a threshold, then relax. The physics
itself becomes the beatmap. Risky: may sound like a kitchen drawer until the
thresholds and cooldowns are tuned. Prototype behind a toggle.

## Census motifs beyond bridges (the afterlife move)
Recognize citizens and render them: breath entering a triangle → triad
arpeggio; chains → scale runs; stars → strummed clusters. Bridges (shipped)
were the first citizen.

## Activity → dynamics
Aggregate kinetic energy / strain drives global intensity: breath cadence,
pluck brightness, delay feedback. Calm body = sparse; freshly pruned = urgent.
Time breathes (afterlife's slow-motion, inverted). The order parameter is now
a second candidate driver here — a body that has just fallen into step could
open the room up (more delay, more air) and close it again as it scatters.

## Spice tones
Rare 7-limit intervals (7/4, 7/6) allowed only on elder or highly-strained
strings. Tension earned by age.

## Someday / maybe
- MIDI out (play a hardware synth); record-to-file for keeping mornings
- multiple creatures in one room, hearing each other (cross-feeding motes?)
- seasons: very-long-period drift of lattice, damping, ambient feed rate
