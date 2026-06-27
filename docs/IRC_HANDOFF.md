# IRC "Haunted Broadcast" — Handoff

Last updated: 2026-06-27 (session 4: zero-shot examples, TWO-ACT, +284 topics,
10 collapse types, combinatorial axes, semantic gate, cost tracker — generation
DONE; next = the viewer). This is the working state of the IRC module. Read this
first, then the linked plan docs.

## TL;DR

A "cursed IRC channel" that endlessly generates and collapses. The **generation
loop produces genuine two-act arcs now** — a sustained NORMAL phase that plants a
thread, a TURN, then a collapse the normal phase earned. Validated by reading a
10-fragment bank (avg 0.82, 9/10 ≥ 0.85). What landed in session 4:
- **examples_per_prompt 4 → 1.** A zero-shot A/B proved the base model already
  knows IRC/bash.org from pretraining — examples only anchor FORMAT, and 4 of the
  short bash.org quotes over-anchored to short repetitive snippets. 1 example
  (pure format anchor) tightened format without biasing length/structure.
- **TWO-ACT, via steering only** (no synthetic exemplars — the model produces the
  arc on its own once unanchored): a **length coinflip** (`two_act_probability=0.5`
  → long 75–100 or short 25–40), **act-aware pacing** (`get_pacing_guidance` bands
  by %: ACT 1 / THE TURN / ACT 2 / END), a **two-act editor addendum**, raised caps
  (`max_total_messages=140`, `max_rounds=45`), and `early_end_min_percentage 0.5→
  0.65` (judge can't END during Act 1). Longs hold coherence to ~97 honest msgs.
- **Meta-leak FIXED** (two-pronged): HTML/shell stop-sequences at generation +
  `normalizer.strip_meta_artifacts` (strips leaked tags / shell prompts, drops
  pure-markup husks). 10/10 bank fragments clean.

Earlier (sessions 2–3, still current): **stateful judge** with **three ways to
end** (judge `END` / strong natural collapse / forced cascade), **5 frame-driven
categories** (`technical, anomaly, incident, support, chaotic`), **honest counting**,
**nick-tic cleanup**, **quality floor**, **review web UI**, **compare.py A/B**,
**lexical + semantic dedup**.

The generation engine is **done and mature** (~120 banked fragments). **NEXT
SESSION'S FOCUS: build the public viewer** and go live — see §A below for the
concrete brief (it's mostly frontend: a `/irc` page modeled on the dreams viewer
+ ~5 wiring lines). A/B was deliberately skipped (scores consistently 0.85–0.95,
answer earned); chaotic-short and the long-stall fix shipped. Nothing is blocked.

## Where this lives

- **Branch:** `irc/integrate-main` (off `origin/feat/irc-fragment-generator`,
  with `origin/main` merged in). Pushed to `origin/irc/integrate-main`.
- **Worktree:** `~/projects/aethera-server/core-irc` (the `core` repo, a worktree
  on this branch). Do git/edits here.
- **NOT deployed.** The VPS (`aetherawi.red`) runs `core` `main`. Going live means
  merging `irc/integrate-main` → `main` (CI auto-deploys). Don't merge until the
  viewer + bridge are ready.
- **DB:** `data/irc.sqlite` (gitignored). **92 fragments** (session 4). Per-style
  quality: technical 0.80, support 0.82, anomaly 0.85, incident 0.89, chaotic 0.71.
  The judge runs HARSH on cursed content — read transcripts, don't trust badges.
  Two reconstructed gems are banked (`dcd45a69` support haunted-printer, `e370ea64`
  incident cat→ChanServ) — rebuilt from rendered text via the normalizer (see
  `scratchpad/reconstruct.py` pattern: clean IRC + sequential `[MM:SS]` timestamps
  so `normalize_lines` delimits, collapse as `*** nick has quit (reason)`).
- **DB path is env-driven:** `IRC_DATABASE_URL` (default `sqlite:///data/irc.sqlite`).
  Set it BEFORE importing `aethera.irc.database` to redirect (e.g. a throwaway
  scratch DB for read-first batches that shouldn't touch the curated pool).
  `review.py --db <path>` views any DB.

## Architecture (the loop)

```
generate.py (CLI)
  → IRCGenerator.generate_fragment()  [aethera/irc/generator.py]
      autoloom.reset()  (fresh judge conversation per fragment, stateful mode)
      per round:
        _generate_batch_candidates(): native-n batch off the base model,
            REROLL degenerate candidates until 10 CLEAN ones
        autoloom.select_best(): judge scores all 10, picks best
            [STATELESS one-shot  OR  STATEFUL conversation — IRC_JUDGE_STATEFUL]
        merge winner → normalize + DEDUP-IN-LOOP → honest message count
        ending (3 paths, checked in this order):
          - END:     judge set END:yes AND log >= 50% target → forced cascade
          - natural: candidate has_collapse, >=80% target, AND >=2 member drops
                     (real exodus) → accept; a WEAK one is stripped → forced
          - FORCED:  >=1 round past target / stall / round-cap → nick-derived
                     cascade (the over-anchoring backstop)
      → IRCNormalizer.normalize(): filter garbage, dedup, monotonic timestamps,
            assign timing, build IRCFragment
      → validate_fragment()
  → autoloom.evaluate_fragment(): final whole-fragment quality_score
       [STATELESS one-shot, ignores judge history — independent of arm]
  → quality floor (--min-quality): discard sub-threshold instead of banking
  → FragmentStorage.save() → data/irc.sqlite
```

### Generation = BASE model, pure completion
- Provider: `local` → `OpenAICompatibleProvider`, `CompletionMode.COMPLETION`.
- Model: **`deepseek-v3-base`** served by vLLM at `localhost:8000/v1`
  (16K ctx, no auth; reachable from the laptop over the VPN).
  - **It's a Heimdall job on the GPU node** (`6a93853475e2`, name `serve-dsv3-base`, TP=8,
    all GPUs, conda env `blackwell`). If it's down, **restart with**
    `heimdall resubmit 6a93853475e2` (same spec, new job). Raw equivalent:
    ```bash
    source ~/miniconda/etc/profile.d/conda.sh && conda activate blackwell && \
    FLASHINFER_DISABLE_VERSION_CHECK=1 VLLM_ENABLE_V1_MULTIPROCESSING=0 \
    CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7 \
    python -u -m vllm.entrypoints.openai.api_server \
      --model /models/DeepSeek-V3-Base --served-model-name deepseek-v3-base \
      --host 0.0.0.0 --port 8000 --tensor-parallel-size 8 --max-model-len 16384 \
      --trust-remote-code --gpu-memory-utilization 0.70
    ```
    (NOT ours to kill — it's the shared production model; this is for restart-only.)
- **No system prompt** — the base model gets only `examples + header + prefill`.
  This is intentional (pure simulation, no assistant voice). The instruct-mode
  system prompt (`build_system_prompt`) exists but is NOT used on this path.
- Native `n`: `_generate_batch_candidates` requests all candidates in ONE vLLM
  call (shared-prefix KV cache) — ~50x faster than the old N-parallel-requests.
- Sampling (defaults, tuned against the GPU node): temp **0.7**, repetition_penalty
  **1.05**, frequency_penalty **0.0**. >0.75 temp degenerates (runaway nicks,
  keyboard mash).

### Judge = instruct model, via OpenRouter
- Provider: `openrouter` → `OpenRouterProvider`, `CompletionMode.CHAT`.
- Model: **`moonshotai/kimi-k2.5`** (reasoning-capable; chosen for "taste").
- **Pinned** to `modelrun/fp4` backend (`provider: {order:["modelrun/fp4"],
  allow_fallbacks:false}`). Unpinned, OpenRouter load-balances across backends of
  35-83s latency variance; pinned ModelRun is ~108 tps, stable, $0.40/$1.90/M +
  $0.09/M cache reads.
- Reasoning budget 16K (`is_reasoning_model` matches `kimi-k2`) so it finishes
  reasoning AND emits the `SCORES:` line. Caching enabled.
- **Two modes (flag `IRC_JUDGE_STATEFUL` / CLI `--stateful` / `--stateless`):**
  - *Stateless* (default-off baseline): fresh one-shot prompt each round.
  - *Stateful* (built this session): ONE judge conversation across the
    fragment's rounds — editor-arc system addendum, **delta-only** continuation
    turns (only new transcript since last call + new candidates), a **compact**
    carried memory (the `SCORES/BEST/REASONING` decision, not the raw reasoning
    dump). `Autoloom.reset()` per fragment + per restart. Produces more coherent
    arcs; caching keeps per-round latency ~8-20s (cold round ~22s). It
    **over-anchors** (won't volunteer a collapse) — which is why the loop has
    forced-collapse safeguards (below). Design notes: `docs/STATEFUL_JUDGE_PLAN.md`.
- `evaluate_fragment` (final whole-fragment score) is a STATELESS one-shot that
  ignores `_history` — so the final grade is independent of the round-by-round
  arm. `compare.py` uses a dedicated stateless scorer instance for both arms.

### Collapse handling (generator loop) — three ending paths
- **Judge-called END:** the judge may emit `END: yes` to wrap on a narrative peak
  rather than padding to target. Honored once the log is >= `max(12, 50% target)`
  (`allow_early_end`, `early_end_min_percentage`) so it can't bail into a stub;
  below that it's ignored. On END that round's candidates are discarded and the
  forced cascade fires. It DOES get used in practice (~4/13 in a recent run).
- **Strong natural collapse:** a selected candidate with collapse markers, at
  >=80% target, AND >=2 member drops (`_count_member_drops` — quit/kick/gline/
  etc., i.e. the room actually empties) is accepted. A *weak* one (a lone quiet
  exit / a single error line) is STRIPPED and replaced with the forced cascade,
  so every ending is a real exodus.
- **Forced (backstop):** otherwise the loop forces a clean deterministic cascade
  from the transcript's OWN active nicks (`_build_forced_collapse`, shaped to
  match the normalizer's detect patterns, light per-fragment variation).
  Triggers: `collapse_grace_rounds=1` past target, `max_stall_rounds=3` near
  target, or `max_rounds=24` backstop. Without these the over-anchoring stateful
  judge spun forever (counts stalled below the 60 cap).

### Categories (styles) — frame-driven
`STYLE_DESCRIPTIONS` in `prompts/templates.py` (and `STYLES` in generator.py).
Philosophical was retired (avg 0.56 — abstract talking-heads, no concrete
situation → no escalation, nothing for the collapse to grow from). A strong
category bakes in **a concrete premise that escalates toward the channel dying**:
- `technical` (NORMAL) — programming/sysadmin/debugging war stories.
- `anomaly` (SLOW) — users report increasingly WRONG things until the channel
  itself goes wrong; the haunting setting in. Most on-theme; highest quality.
- `incident` (FRANTIC) — on-call crew scrambling as something actively breaks.
- `support` (NORMAL) — helpdesk hell, mundane turning absurd.
- `chaotic` (FRANTIC) — unhinged 3am energy that spirals.
Each has **~42–65 topics** (session 4 expansion → 284 total) + ~22 nicks. **Topics
steer generation** (filename slug `irc_{style}_{topic}_*.txt` — a WEAK signal);
**nicks are NOT wired** (vestigial — 97% of generated nicks are already unique;
the base model invents fitting ones). Force a style with `generate --style X`.

### Combinatorial axes (session 4) — `prompts/templates.py`
Beyond style/topic/collapse, each fragment rolls a SUBSET of probe-VALIDATED axes
(`roll_axes(style)`), surfaced as diegetic metadata across THREE channels:
- **header** (`build_header`): `tone:` (STRONG — flips mood), `network`+`era`
  (MODERATE — `EFnet | 1999`; shifts vocab/refs/nicks), `bots`/`+N bots`/`svc:`
  (STRONG — format-locked `<ChanServ>`/markov lines; also a great horror vector).
- **timestamp prefill** (`[03:33] <`): `clock` — time-of-day energy, zero-leak.
Pools: `TONE_POOL`/`ERA_POOL`/`BOTS_POOL`/`CLOCK_POOL`. `roll_axes` fires each
axis with a probability (bots style-conditional) so headers never over-stuff —
dreamgen's "grammar activates a subset" coherence mechanism. Gated by
`GenerationConfig.use_combinatorial_axes` (True). **How we validated:** raw-completion
A/B probes (`scratchpad/capacity_probe*.py` pattern — fixed style+topic, flip one
field, read). The base model resolves CONCRETE/format-locked/strong-footprint cues
(bots, era, tone, clock) but NOT abstract taxonomic tags — `wrongness:`/`aware:`/
`cast:`/`modes:` were proposed but probe-rejected (don't re-add as header tags).
Soft echo to watch: `svc:` label can become a bot nick (harmless). Design rationale
+ rejected axes: subagent specs were the input; the keepers are what passed probes.

### Storage / Broadcaster
- `FragmentStorage` (storage.py): weighted random selection (never-shown >
  high-quality > least-shown), 7-day replay cooldown, manual ratings 1/2/3.
- `IRCBroadcaster` (broadcaster.py): synced playback over `/ws/irc`, auto-starts
  on first client. **Still wired to `get_test_fragment`** (test data) in
  `api/irc.py::get_broadcaster` — the swap to `FragmentStorage.get_next_fragment`
  is a ~5-line change needed for live.

## Configuration (`.env`, gitignored; copy from `.env.example`)

```
# generation (base model on the GPU node)
IRC_GENERATION_PROVIDER=local
IRC_LOCAL_BASE_URL=http://localhost:8000/v1
IRC_LOCAL_MODEL=deepseek-v3-base
# judge (OpenRouter, pinned to ModelRun FP4)
IRC_JUDGE_PROVIDER=openrouter
IRC_JUDGE_MODEL=moonshotai/kimi-k2.5
OPENROUTER_API_KEY=sk-or-v1-...
IRC_OPENROUTER_PROVIDERS=modelrun/fp4
IRC_OPENROUTER_ALLOW_FALLBACKS=false
# judge mode (optional; default stateless). --stateful/--stateless CLI overrides.
IRC_JUDGE_STATEFUL=false
```
Sampling/loop knobs (`IRC_CANDIDATE_TEMPERATURE`, `IRC_REPETITION_PENALTY`,
`IRC_MIN_COLLAPSE_PERCENTAGE`, etc.) default to the tuned values, so they're
optional in `.env`. `IRC_CANDIDATES_PER_BATCH=10`. The CLI auto-loads `.env`.
Forced-collapse knobs live in `GenerationConfig` (not env): `collapse_grace_rounds`,
`max_stall_rounds`, `max_rounds`.

## How to run

```bash
cd ~/projects/aethera-server/core-irc
uv run python -m aethera.irc.generate --count 10 --stateful --min-quality 0.5  # curated bank
uv run python -m aethera.irc.generate --count 6 --stateful --style anomaly     # force a category
uv run python -m aethera.irc.generate --count 1 --stateful -v                  # one, verbose
uv run python -m aethera.irc.generate --count 1 --stateless                    # baseline judge
uv run python -m aethera.irc.tune --temp 0.7 -n 5      # fast sampling preview (no judge, no DB)
uv run python -m aethera.irc.compare --n 5 --out ab.txt  # stateless-vs-stateful A/B (banks nothing)
uv run python -m aethera.irc.review                   # local read-only web UI → :7878 (auto-polls)
uv run python -m aethera.irc.clean_addresses --apply  # backfill: strip 'nick:' tics from banked
```
`--min-quality F` discards fragments scoring below F and keeps generating until
`--count` good ones bank (default 0.0 = bank all). `--style X` forces one
category. Run unbuffered to a file for long background runs
(`PYTHONUNBUFFERED=1 ... > run.log 2>&1`); a `grep | tail` pipe BLOCK-BUFFERS and
hides progress until exit. Per-round logs (INFO): `Candidates: 10/10 clean ...`,
`Judge: ...`, and the ending path (`judge called END` / `[COLLAPSE xN]` /
`forcing collapse` / `weak natural collapse ... forcing a real cascade`).
**Read the pool with the review UI** (`aethera.irc.review` → http://127.0.0.1:7878):
terminal-style render, quality badges, highlighted collapse region, sort/filter,
5s auto-poll. Read-only, safe alongside a running bank.

## Outstanding work (priority order)

### A. Make it live — NEXT SESSION'S FOCUS: build the public viewer
The **generation engine is done and mature** (~120 banked fragments, all the
session-4 work below). What's left to ship the haunted broadcast is mostly
FRONTEND + a few wiring lines. Concrete brief, with exact pointers:

1. **Build the public viewer page** (the only fully-missing piece). The **dreams
   viewer is the exact structural analog** — copy its shape:
   - Route: add `@router.get("/irc")` in `aethera/api/irc.py`, mirroring
     `aethera/api/dreams.py:140` (`dreams_viewer` → renders `dreams/viewer.html`).
   - Page: create `aethera/templates/irc/viewer.html` (+ `static/js/irc.js`,
     `static/css/irc.css`) modeled on `templates/dreams/viewer.html` /
     `static/js/dreams.js` for the WS-client + page scaffold.
   - Rendering: the **admin `static/js/irc-admin.js`** already renders IRC
     messages (msg/action/join/quit/system, collapse region) terminal-style —
     lift that rendering, drop the admin controls. Messages arrive over the WS
     as `IRCMessage.to_broadcast()` dicts (`{timestamp,nick,content,type,delayAfter,meta}`).
   - Connect to **`/ws/irc`** (`api/irc.py:49`, already serving). The broadcaster
     pushes a synced playback stream; auto-starts on first client.
2. **Wire the broadcaster to real fragments** — `api/irc.py:39` currently passes
   `get_next_fragment=get_test_fragment`; swap to `FragmentStorage.get_next_fragment`
   (`storage.py:84`, weighted selection + cooldown). ~5 lines + construct storage.
3. **Bridge laptop → VPS.** The pool lives in the laptop's `data/irc.sqlite`
   (gitignored). Start simple: `rsync data/irc.sqlite` to the VPS. Upgrade to an
   authenticated ingest endpoint (`POST /api/irc/fragments` + bearer token,
   idempotent on id) when VPS-side curation state (ratings, times_shown) matters.
4. Merge `irc/integrate-main` → `main` → CI auto-deploys.

Serving-side map: `aethera/api/irc.py` (`/ws/irc`, `/api/irc/status|health`,
`get_broadcaster`), `aethera/irc/broadcaster.py` (`IRCBroadcaster`: connect/
disconnect/start/stop/_playback_loop, `get_test_fragment` placeholder),
`aethera/irc/storage.py` (`FragmentStorage.get_next_fragment`).

### B. Generation refinements
DONE (sessions 2–3): stateful judge, forced-collapse safeguards, honest counting,
overshoot fix, quality floor, **early-end (judge `END`)**, **natural-collapse
strength gate**, **5 frame-driven categories + expanded pools**, **nick-tic
cleanup**, **judge recalibration (cursed aesthetic, style-aware)**, review UI,
**lexical + semantic dedup tooling**.
DONE (session 4): **examples 4→1** (zero-shot finding), **TWO-ACT via steering**
(coinflip + act-aware pacing + editor addendum + raised caps; NO synthetic
exemplars — `docs/TWO_ACT_STRUCTURE_PLAN.md` §3.A was rendered unnecessary),
**meta-leak fix** (stop-seqs + `normalizer.strip_meta_artifacts`), **`**`-nick
artifact backfilled**, **semantic dedup gate WIRED into banking**
(`generate --max-semantic-similarity`, default 0.85; after lexical, before judge;
resilient if the GPU node embed down), **topics 127→284** (concrete frames), **collapse
types 6→10** (kill/server_shutdown/takeover/erasure), and **COMBINATORIAL AXES**
(below). Still open:
1. **A/B verdict** — run `compare.py` for the stateless-vs-stateful number +
   blind read. The one quantitative thing not yet settled.
2. **Chaotic → short-only.** Chaotic is the laggard (~0.78) and meanders as a
   two-act. Consider per-style structure: force `short_target_range` for chaotic
   (the coinflip / target ranges live in `GenerationConfig`).
3. **Collapse letter-decay** — the cascade can degenerate into letter-spaced mash.
   Often DIEGETIC now (log corruption, clock skew) and on-aesthetic, but it can
   tip into pure noise. If it ever reads as broken, cap it in the loop/normalizer.
4. **Topic/frame diversity** — nicks are 97% unique (not a problem; NOT wired in
   anyway). Topics ARE wired in (`random.choice(topics)` → filename slug) and are
   the real diversity lever. DONE (session 4): subagent-expanded `STYLE_DESCRIPTIONS`
   topics **127 → 284** concrete frames (technical/chaotic were vague — fixed:
   chaotic got a full concrete-bit makeover, technical dropped pure field-names).
   **Collapse types 6 → 10**: added `kill` (Killed-by-oper/entity), `server_shutdown`
   (Closing Link), `takeover` (entity seizes ops), `erasure` (members erased —
   cursed). All wired through enum / COLLAPSE_NAMES / COLLAPSE_EXAMPLES /
   `_build_forced_collapse` / `_DROP_MARKERS` / `COLLAPSE_PATTERNS` + a SYSTEM-line
   detection pass (`SYSTEM_COLLAPSE_TYPES`); picked automatically by the loop.
   #2 combinatorial axes: **DONE** (see "Combinatorial axes" above — tone/era/bots/
   clock, validated + wired). #3 anti-clustering (semantic-index-guided topic
   resampling pre-generation): **still optional** — likely unnecessary now the
   frame-space is ~14k wide + the semantic reject-gate runs; revisit only if a
   post-bank semantic report shows real saturation. Pool diversity: 1 near-dup
   pair (CD-tray @ 0.87) — drop one. Topic pools are internally diverse (0 pairs
   ≥0.85), so dreamgen-style pool-curation was measured-unnecessary and skipped.
5. **Long-fragment stall efficiency** (surfaced session 4): a long two-act target
   (e.g. 85) that stalls below the 80% stall-gate grinds to `max_rounds=45` and
   force-collapses SHORT of target (~55/85). Not broken (backstop works, banked
   0.91), but inefficient. Fix: scale `max_rounds` with target, or relax the
   stall-gate's near-target threshold for long targets.

### Dedup tooling (this session)
- `aethera/irc/dedup.py` — lexical MinHash+LSH. Report (`python -m aethera.irc.dedup`)
  + banking-time novelty gate (`generate --max-similarity`, default 0.5). Pool
  ceiling ~0.03 — no verbatim dups. Compares the nick-normalized dialogue body.
- `aethera/irc/semantic_dedup.py` — embeddings+cosine via the GPU node embed server.
  Catches THEMATIC dups lexical can't (found a 0.87 CD-drive support cluster
  invisible at 0.02 lexical). Gate threshold ~0.85 (0.78 is tone-noise).
- `aethera/irc/embed_server.py` — the GPU node-side embed endpoint (runs in
  `.venv-shared`; see two-act plan §8 for the relaunch command).

## Pitfalls learned this session (don't repeat)

- **Don't put scaffold artifacts in the prompt** (filenames, an in-frame "ending
  reference" file) — the base model echoes them into dialogue (`ff7375a` revert).
- **Don't raise generation temp above ~0.75** — degeneration, not creativity.
- **Don't fire N separate requests** for candidates — use native `n` (`a2d3bce`).
- **Don't leave the OpenRouter judge unpinned** — latency variance is brutal.
- **Don't starve the reasoning judge's token budget** — it returns null content
  before emitting SCORES (`bb73413`); 16K headroom fixed it.
- **`MessageMeta` is a pydantic model**, not a dict — attribute access only.
- **The stateful judge over-anchors** — it will develop a nice arc forever and
  never volunteer a collapse. The loop MUST have forced-collapse safeguards or it
  spins (the message count stalls below the 60 cap on deduped repetition). Don't
  remove `collapse_grace_rounds` / `max_stall_rounds` / `max_rounds`.
- **The loop count must be deduped** — base models echo lines; counting the raw
  transcript inflated the count ~2x (a "40-message" fragment was ~22 real, the
  "reads as half" bug). Dedup happens IN-LOOP now (`dedup_adjacent_lines`), so
  `target_messages` = real dialogue lines. Final dedup is unchanged.
- **IRC actions are single-star** (`* nick waves`); `***` is a server notice.
  The action regex has a `(?!\*)` lookahead so notices don't parse as actions
  with nick `**` (was the `* **` artifact).
- **A strong category needs a concrete situation that escalates** — not a topic.
  Philosophical failed (abstract debate, no event). The winners all have
  something HAPPENING that builds to a breaking point (which is also what the
  collapse grows out of). Keep new categories in that mold.
- **The model tics on `nick:` addressing** (`<Gerald> vapor: ...`). The
  normalizer strips a leading `knownnick:` (only when it's a participant nick, so
  `ERROR:`/`Re:`/`http://` survive); `clean_addresses` backfills banked ones.
- **The judge underrates cursed/eerie content** (anomaly/incident) — great
  fragments score ~0.50-0.70. Keep the quality floor low (~0.5) so it doesn't
  discard gems; curate by reading, not by score.

## Key files
- `aethera/irc/generator.py` — the loop, reroll, native-n batch, the 3 ending
  paths (early-end / strength-gated natural / forced cascade), `_count_member_drops`,
  in-loop dedup, `generate_batch` (+ `min_quality` floor, `--style`)
- `aethera/irc/autoloom.py` — judge: `select_best` (stateless + `_select_best_stateful`),
  `reset()`, editor addendum, pacing guidance, `END` parsing, `evaluate_fragment`
- `aethera/irc/normalizer.py` — parse/clean/dedup/timing, `dedup_adjacent_lines`,
  `strip_leading_address` (nick-tic), garbage + empty-notice filters
- `aethera/irc/prompts/templates.py` — `STYLE_DESCRIPTIONS` (the 5 categories,
  topics+nicks+pacing), scaffold/header builders
- `aethera/irc/providers/openai_compatible.py` — base model + native-n
- `aethera/irc/providers/openrouter.py` — judge + provider routing + `complete_chat`
  (multi-turn, for the stateful judge)
- `aethera/irc/providers/base.py` — `complete_chat` default (flatten fallback)
- `aethera/irc/config.py` — env config (+ `judge_stateful`) + provider construction
- `aethera/irc/generate.py` (`--stateful`/`--stateless`/`--min-quality`/`--style`) /
  `tune.py` / `compare.py` (A/B) / `review.py` (read UI) /
  `clean_addresses.py` (nick-tic backfill) — CLIs/tools
- `aethera/irc/broadcaster.py`, `storage.py`, `api/irc.py` — serving side
- `docs/STATEFUL_JUDGE_PLAN.md` — the stateful-judge experiment (now implemented)
