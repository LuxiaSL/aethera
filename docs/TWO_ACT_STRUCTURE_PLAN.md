# Two-Act Structure — Plan & Handoff

Status: **SHIPPED (session 4)** — implemented via STEERING, not exemplars. The key
finding flipped §3.A: a zero-shot A/B showed the base model already produces the
two-act arc on its own once it's NOT anchored by short bash.org examples, so we
dropped `examples_per_prompt` 4→1 instead of writing synthetic two-act exemplars
(§3.A is moot). The rest landed as specced: length coinflip (§3.B), act-aware
pacing (§3.C), raised early-end gate (§3.D), two-act editor addendum (§3.E). The
remaining open items (chaotic→short-only, A/B verdict, semantic gate) moved to
`docs/IRC_HANDOFF.md` §B. This doc is kept as the design rationale / data record.

Original status (for context): **proposed, not started.** It's the biggest
structural shift since the stateful judge — it changes *what the loop is trying to
produce*, touching examples, target length, pacing, collapse gating, and editor
framing together. Branch `irc/integrate-main`, worktree
`~/projects/aethera-server/core-irc`. **Read `docs/IRC_HANDOFF.md` first.**

---

## 1. The goal

Today the generator makes **short, single-arc** fragments: ~20–40 messages that
head almost immediately into escalation and collapse. They're good, but they're
*snippets*.

We want **longer, two-act** fragments:

- **Act 1 — Normal:** mundane, engaging channel life. A developing situation,
  banter, a *planted thread*. No collapse, no disaster signals yet.
- **The Turn (~60–70% in):** a deliberate beat where something shifts / goes
  wrong — the escalation trigger, ideally paying off the thread planted in Act 1.
- **Act 2 — Collapse:** escalate to a real cascade (the current end behavior).

The non-negotiable: **the collapse must GROW OUT OF Act 1**, not feel bolted on.
A long fragment whose collapse is unrelated to its normal phase is a failure.

Think of the difference as "a funny IRC exchange that ends in a netsplit" (now)
vs "an evening in a channel that we watched turn, and end" (goal).

---

## 2. Why it's short now — root cause (with data)

The few-shot examples drive both **length and shape**, and they teach the wrong
thing. Measured `aethera/irc/prompts/examples/` (the files `load_random_examples`
pulls from — note only `technical/` + `chaotic/` are used now; `philosophical/`
is orphaned):

| file | msgs | collapse lines |
|---|---|---|
| chaotic/disc_drive_rage | 39 | **0** |
| chaotic/beach_burial | 20 | 2 |
| chaotic/hunter2 | 18 | 2 |
| technical/cs_rap_battle | 53 | **0** |
| technical/long_distance_internet | 14 | 1 |
| technical/dancing_bot | 6 | **0** |
| (most others) | 8–20 | 0–2 |

Two takeaways:
1. **The examples are short** (mostly 8–20 msgs) — the model emulates "short
   snippet."
2. **They mostly contain NO collapse** (0–2 lines; never a full cascade). So the
   model never learns the *normal → collapse pacing* from examples — it
   extrapolates the collapse purely from the header's `ENDS: netsplit` cue and
   the loop's collapse logic. There's **no template for a long, two-act arc.**

Everything else in the loop is also calibrated short:
- `generate_fragment`: `target_messages = ... or random.randint(25, 40)`.
- `GenerationConfig.max_total_messages = 60`, `max_rounds = 24`.
- `min_collapse_percentage = 0.8` (collapse only allowed in the last 20%) — fine.
- `early_end_min_percentage = 0.5` — the judge can `END` from the halfway point.
- `get_pacing_guidance` ramps opening→middle→end across <30/<60/<80/≥80% with no
  notion of "act 1 vs act 2."

---

## 3. Implementation spec (file by file, in leverage order)

### A. Two-act EXAMPLES — `aethera/irc/prompts/examples/` *(highest leverage)*
The model copies what it sees. Without long two-act exemplars, **none of the
other changes will reliably produce the shape** — they'll just make longer
single-arc rambles.

- Write/curate **2–3 long (50–80 msg) two-act exemplars** that demonstrate the
  full structure: a sustained normal phase that plants a thread, a clear turn
  ~60–70% in, then escalation → a real collapse cascade. They MUST include the
  collapse (current examples don't), so the model learns the whole arc + pacing.
- **Sourcing options** (pick per the effort/quality tradeoff):
  - (a) Hand-write them.
  - (b) **Hand-extend a banked gem** with a normal-life prefix — this is where
    the earlier "use banked fragments as examples" idea pays off cleanly. Take a
    strong fragment (e.g. the `WhoIsHere665` anomaly or a support gem), prepend
    ~30–40 msgs of ordinary channel life that sets up its premise, and you have a
    two-act exemplar grounded in proven content.
  - (c) Generate long, then curate + edit the best into exemplars.
- **Placement decision (OPEN):** `load_random_examples` samples examples
  *style-agnostically* (random across `STYLE_DESCRIPTIONS` dirs) and uses them as
  format/shape demos. Options: per-style two-act exemplars; OR a small shared
  "always-include a two-act exemplar" mechanism so every generation sees the
  shape. The latter is more reliable but less diverse. Decide before writing them.
- Risk: a two-act exemplar in one tone (e.g. eerie anomaly) could bias all
  styles toward that tone. Prefer at least one exemplar per major tone, or keep
  them tonally neutral.

### B. Target length + caps — `aethera/irc/generator.py`
- `generate_fragment`: bump `random.randint(25, 40)` → ~`randint(50, 80)` (or
  drive from config). Remember **counts are honest now** (in-loop dedup), so 60
  *means* ~60 real dialogue lines — a substantial log. Don't overshoot into
  tedium; tune from reads.
- `GenerationConfig.max_total_messages = 60` → raise (e.g. 100–120) so the loop
  doesn't hard-cap before Act 2.
- `GenerationConfig.max_rounds = 24` → raise proportionally (longer fragments =
  more rounds; the forced-collapse backstop must not fire mid-Act-1).
- `min_messages_before_collapse` / `max_messages_before_collapse` (20/35) — revisit.

### C. Two-act PACING — `aethera/irc/autoloom.py::get_pacing_guidance`
This is the steering lever. Replace the generic ramp with act-aware guidance:
- **< ~55–60% (ACT 1 / NORMAL):** "We're in the NORMAL act. Favor candidates
  that build everyday channel texture and develop a mundane situation — and
  PLANT a thread that can pay off later. Do NOT escalate or collapse yet; reject
  candidates that introduce disaster prematurely."
- **~60–70% (THE TURN):** "This is the TURN. Favor the candidate that introduces
  the disruption — the thing going wrong — ideally paying off the thread from
  Act 1."
- **> ~70% (ACT 2 / COLLAPSE):** the current end-phase guidance (escalate to a
  STRONG cascade; the strength gate already requires ≥2 member drops).

### D. Gate early-END + escalation to the act boundary — `generator.py::_generate_progressive`
- `early_end_min_percentage = 0.5` → raise to ~`0.65` so the judge can't `END`
  during Act 1.
- Keep collapse acceptance late (`min_collapse_percentage = 0.8` is fine), but
  make sure the **escalation pressure doesn't start before the Turn** — that
  pressure lives in the pacing guidance (C), so C and D move together.
- Re-check the forced-collapse safeguards (`collapse_grace_rounds`,
  `max_stall_rounds`, `max_rounds`) against the longer length so they backstop
  Act 2, not interrupt Act 1.

### E. Stateful editor framing — `autoloom.py::STATEFUL_EDITOR_ADDENDUM`
The stateful judge is the **coherence engine** — it carries reasoning across
rounds, so it's the right place to hold the act structure. Rewrite the addendum
around two acts: *"Work in two acts. Act 1: establish ordinary channel life and
plant a thread. The Turn: bring the disruption. Act 2: pay the thread off with a
collapse that the normal phase earned. Track which act you're in; don't rush to
Act 2."* This pairs with the pacing guidance (C) — pacing is per-round nudges,
the addendum is the standing intent.

### F. Header / scaffold — `aethera/irc/prompts/templates.py`
- `build_header` already passes `message_count` (the target) into the log header,
  so a longer target advertises "60 messages" etc. — keep that honest.
- DON'T over-instruct the scaffold with structural prose — recall scaffold
  artifacts LEAK into dialogue (see `IRC_HANDOFF.md` pitfalls, `ff7375a`). Rely
  on examples (A) + pacing (C) + editor (E) for the structure, not a header cue.

---

## 4. The hard parts / risks

- **Coherence across the Turn** — the collapse feeling bolted-on. The mitigation
  is the stack: two-act examples (A) + planted-thread framing (C/E) + the
  stateful editor (E). This is the whole point; if it doesn't hold, the feature
  fails.
- **Act 1 sagging into filler.** "Normal channel life" must still be *engaging*.
  The judge's tone/atmosphere criteria (the recalibrated rubric) should favor
  engaging-but-not-yet-disastrous over both boring AND prematurely-explosive.
- **The judge over-anchoring in Act 1** (refusing to turn). The Turn pressure (C)
  + the forced-collapse backstop (D) catch this; tune the boundary %.
- **Cost/time:** longer fragments = more rounds = more generation + judge calls
  per fragment. Acceptable but note it.
- **Length calibration:** with honest counting, 60–80 real messages is LONG.
  There may be a sweet spot well under the max; find it by reading.
- **Variety:** consider keeping a *mix* — some short single-arc fragments, some
  long two-act ones — so the broadcast isn't monotonously long. Could be a flag
  or a random per-fragment choice (see Open Decisions).

---

## 5. Testing / validation

The judge's quality score is a **weak signal here** (noisy, ±0.05–0.08 per draw;
see `IRC_HANDOFF.md`). Validate by **reading**:

1. Generate a handful at the new settings (start with one style, e.g. `support`
   or `anomaly`, via `generate --style X`).
2. For each, ask:
   - Is there a clear **normal phase** before anything goes wrong?
   - Does the collapse feel **earned** — does it grow from a thread in Act 1?
   - Is Act 1 **engaging**, not filler?
   - Is the length near target without dragging?
3. Contrast against a few current single-arc fragments to feel the difference.
4. Re-run the dedup tools (`dedup`, `semantic_dedup`) — longer fragments may
   change the similarity structure (more room to diverge could *reduce* thematic
   dups, or more structure could *increase* sameness — watch the ceiling).

---

## 6. Recommended sequencing

1. **Examples first** (A). Write/curate 2–3 two-act exemplars. Nothing else works
   without these.
2. **Length + caps** (B). Bump target, `max_total_messages`, `max_rounds`.
3. **Pacing rewrite** (C) + **editor addendum** (E). The steering.
4. **Gate early-END + escalation** (D) to the act boundary.
5. **Generate + read + iterate** on the boundary percentages and target length.

Do 1–4, then loop on 5. Expect to spend most of the time tuning the act-boundary
% and the Act-1 engagement vs the Turn timing.

---

## 7. Open decisions for the next session

- **Act boundaries:** 55/65/75%? Tune from reads.
- **Target length:** 50? 60? 80? (honest count — 60 is already long).
- **Example placement:** per-style two-act exemplars vs a shared always-shown
  exemplar (§3.A).
- **Example sourcing:** hand-write vs hand-extend a banked gem (§3.A).
- **Mix vs all-two-act:** keep short single-arc fragments in the rotation for
  variety? A `--two-act` flag, or a random per-fragment structure choice?
- **Per-style structure:** do all 5 categories want two acts, or do some (e.g.
  `chaotic`) work better as short single-arc? Maybe two-act is opt-in per style.

---

## 8. Related context from this session (so you don't re-derive)

- The loop is otherwise in good shape: stateful judge with **three ending paths**
  (judge `END` / strong natural collapse / forced cascade), the **recalibrated
  judge** (cursed-aesthetic rubric, style-aware — see `autoloom.TONE_BY_STYLE`),
  **honest in-loop counting**, **5 frame-driven categories**, nick-tic cleanup.
  Pool ~70 fragments. All on `irc/integrate-main`.
- **Dedup tooling exists** (`aethera/irc/dedup.py` lexical MinHash+LSH gate, wired
  into banking via `generate --max-similarity`; `aethera/irc/semantic_dedup.py`
  embeddings+cosine report/gate). Semantic findings: the model has favorite
  tropes (a CD-drive support cluster; a phantom-entity anomaly shape ~0.80). The
  semantic gate (~0.85) is now WIRED into banking (session 4) —
  `generate --max-semantic-similarity 0.85`, resilient to the embed server being down.
- **Embeddings run on the GPU node** via a tiny sentence-transformers server. The
  blackwell-conda vLLM can't serve embeddings (flashinfer version bug). The
  server lives at `aethera/irc/embed_server.py` and runs from the user's
  `~/luxi-files/.venv-shared` on the GPU node. Relaunch:
  ```bash
  # on the GPU node, from ~/luxi-files (script scp'd there):
  CUDA_VISIBLE_DEVICES=1 PORT=8001 EMBED_MODEL=BAAI/bge-large-en-v1.5 \
    HF_HOME=~/luxi-files/.hf-cache setsid nohup \
    ~/luxi-files/.venv-shared/bin/python embed_server.py > embed_server.log 2>&1 &
  # reachable from the laptop at localhost:8001 (like :8000). If a longer
  # context window is wanted for long two-act fragments, swap bge-large (512 tok)
  # for a bigger-context embed model (gte / nomic, 8192 tok).
  ```
  (The server may have been torn down after this session to free the shared GPU —
  relaunch when you need the semantic tools.)
- **Two-act + dedup interaction:** longer fragments with more divergent normal
  phases may naturally reduce thematic near-dups — re-measure after, it could
  change the dedup story.

## 9. Key files (for this work)
- `aethera/irc/prompts/examples/` — the few-shot exemplars (root lever, §3.A)
- `aethera/irc/prompts/templates.py` — scaffold/header, `load_random_examples`,
  `build_header`, `STYLE_DESCRIPTIONS`
- `aethera/irc/generator.py` — `generate_fragment` (target), `GenerationConfig`
  (caps), `_generate_progressive` (collapse + early-END gating)
- `aethera/irc/autoloom.py` — `get_pacing_guidance` (§3.C), `STATEFUL_EDITOR_ADDENDUM`
  (§3.E), `JUDGE_SYSTEM_PROMPT`, `TONE_BY_STYLE`
- `aethera/irc/dedup.py`, `aethera/irc/semantic_dedup.py`, `aethera/irc/embed_server.py`
  — dedup tooling (re-measure after)
