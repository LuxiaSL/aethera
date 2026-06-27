# Side Plan: Stateful (Conversational) Judge — A/B experiment

Status: proposed, not started. Owner: TBD (good for a focused agent in a worktree).
Branch context: built on `irc/integrate-main`.

## Problem

The autoloom judge (`aethera/irc/autoloom.py::Autoloom.select_best`) runs as a
**stateless one-shot per round**: every round it builds a fresh prompt
(`system + transcript-so-far + the 10 candidates`) and calls `provider.complete()`.
Its `REASONING:` output is parsed for logging and then **discarded**.

So each round the judge re-derives "where is this story going" from the transcript
alone, with no memory of the narrative intent it formed last round. It can silently
pick a *different* direction each round → incoherent arcs.

## Hypothesis

Judging a progressive story is inherently stateful: the transcript records *what
happened*, but the *intent* (the arc the editor is steering toward) lives in the
editor's head. A judge that maintains **one conversation across the fragment's
rounds** — carrying its own `REASONING:` forward — will commit to a direction and
follow through, producing more coherent fragments and stronger, better-timed
collapses.

We don't need hidden reasoning tokens; the `REASONING:` field the judge already
emits *is* the carried-forward intent.

## Design

Add a **stateful judge mode** behind a flag (`IRC_JUDGE_STATEFUL`, default off so
it's A/B-able):

- `Autoloom` holds a per-fragment message list (`self._history: list[dict]`).
- Round 1: `[system, user(candidates + opening framing)]` → judge responds; append
  the assistant response to history.
- Round N: append `user(new transcript delta + new candidates)` to the existing
  history → judge responds with its prior reasoning in context; append response.
- Parse `SCORES:`/`BEST:` from the latest assistant message (unchanged parser).
- **Reset history per fragment** (new fragment = new conversation). The generator
  must signal fragment boundaries (e.g. `autoloom.reset()` at the top of
  `generate_fragment`, or pass a fragment id).

### Why it's cheap now
A stateful judge conversation is **append-only**, the ideal shape for prompt
caching — and the judge is pinned to ModelRun ($0.09/M cache reads). The growing
context is mostly cache hits, so the per-round token cost stays low. Requires the
judge provider/caching to actually cache across the appended turns (verify with
`usage.cache_read_input_tokens`-equivalent on OpenRouter).

### Files to touch
- `autoloom.py` — `Autoloom` gains history state + `reset()`; `select_best` builds
  on history when stateful. Keep the stateless path intact for A/B.
- `generator.py` — call `autoloom.reset()` at the start of each fragment; on a
  fragment restart, reset too.
- `config.py` / `generate.py` — `IRC_JUDGE_STATEFUL` flag threaded to `Autoloom`.
- `autoloom.py::JUDGE_SYSTEM_PROMPT` — in stateful mode, add a line framing the
  judge as a story editor maintaining a consistent arc across turns (this pairs
  with the user's "reason about the objective" idea).

## A/B methodology
1. Generate N fragments (e.g. 10) stateless, N stateful — same style/collapse mix.
   If feasible, fix the RNG seed per pair so the *generation* candidates match and
   only the judging differs.
2. Compare: mean `quality_score`, and a blind human read for narrative coherence
   and collapse strength.
3. Watch the per-round `Judge:` timing log — confirm caching keeps stateful rounds
   from ballooning in cost.

## Tradeoffs / risks
- More tokens/round (mitigated by caching — verify it actually caches).
- **Over-anchoring**: a stateful judge may lock onto an early intent and stop
  adapting. Counter by keeping the per-round candidate framing strong.
- Error compounding: a bad early judgment persists in context. The stateless judge
  "forgets" mistakes; the stateful one doesn't.
- Must reset cleanly per fragment, including on restarts, or arcs bleed across
  fragments.

## Related context (from the tuning session)
- Meta-leak: scaffold concepts bleed into generated dialogue — leaked filenames
  (`ending_corruption.txt`) and the message-count concept (`[ERROR: The message
  timer must have gone off!]`). Worth a separate pass; not part of this plan.
- Aesthetic note: this is a *cursed* channel that *collapses*. In-fiction glitch
  and repetition are on-theme (esp. for `corruption` collapses) — filter
  out-of-fiction artifacts (mash, runaway nicks, leaked scaffold text), but don't
  over-sanitize in-fiction repetition. Relevant if the stateful judge changes how
  aggressively repetition is penalized.
