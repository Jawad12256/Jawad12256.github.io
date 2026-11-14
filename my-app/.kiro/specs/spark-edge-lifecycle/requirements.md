# Spec 16 — Spark Edge-Based Lifecycle

## Introduction

Replace the sparks' fixed ~2s lifetime + synchronised respawn with an
edge-based, independently-managed lifecycle: sparks spawn at a far edge
heading inward, die when they reach a far edge of the grid, and a
per-side active/max count governs how many exist at once. This creates
the illusion of sparks flying onto and off the screen independently,
rather than all appearing/disappearing together. Confined to the
background feature (`Background.jsx`, with any needed CSS).

### Owner-requested behaviour

1. Sparks should NOT all appear/disappear simultaneously; they should
   come and go independently.
2. Track, **separately for the left and right bands**, how many sparks
   are currently active vs the maximum allowed (e.g. 3 of 4).
3. When a spark reaches any **far edge** of the grid, it fades out and
   dies, decrementing that side's active count and freeing a slot.
4. New sparks **spawn at a far edge** and are given a direction pointing
   inward/away from that edge (e.g. a spark spawning at the rightmost
   edge travels left).
5. Newly-spawned edge sparks MUST NOT be instantly killed by the "at an
   edge = die" rule — they must survive leaving their spawn edge.
6. Sparks therefore have **no fixed lifetime** anymore — only (a) the
   edge-collision death condition and (b) the per-side max-count limit.

### Authoritative context (verified on current `main`)

- `Background.jsx`: `SPARK_COUNT=4` fixed spark elements, half assigned
  to `left`, half to `right` band; grid is `cols` × `rows` nodes;
  `col` 0..cols, `row` 0..rows. `col=0` is the OUTER screen edge for a
  band (left band: `pixelX = col*NODE` from left; right band:
  `pixelX = innerWidth - col*NODE` from the right). `col=cols` is the
  INNER edge (toward centre).
- Current lifecycle: each spark has `bornAt`; dies at
  `SPARK_LIFETIME_MS` (2000) then respawns at a RANDOM node — this is
  what causes the synchronised, non-edge feel.
- Movement: node-to-node random walk, no 180° reversal, `STRAIGHT_BIAS`
  toward continuing straight; tail trails the travel direction; fade-in
  is stationary (no fly-in).
- Cursor glow + reduced-motion disable + cleanup must stay intact.

---

## Requirements

### Requirement 1 — Per-band active/max spark counts

#### Acceptance criteria

1. WHEN sparks are managed THEN the system SHALL track the number of
   ACTIVE sparks separately for the LEFT band and the RIGHT band.
2. WHEN a maximum per side is defined THEN it SHALL be a clearly-labelled
   value (e.g. `MAX_PER_SIDE`), and the active count per side SHALL never
   exceed it.
3. WHEN a spark dies THEN its side's active count SHALL decrement; WHEN a
   spark spawns THEN its side's active count SHALL increment.
4. WHEN a side is below its max THEN the system SHALL be able to spawn a
   new spark on that side (subject to the spawn cadence, Req 4).

### Requirement 2 — Spawn at a far edge heading inward

#### Acceptance criteria

1. WHEN a spark spawns THEN it SHALL start AT a far (outer) edge of its
   band — the left band at the leftmost/outer edge, the right band at
   the rightmost/outer edge — at a random row along that edge.
2. WHEN a spark spawns THEN its initial direction SHALL point INWARD,
   away from the spawn edge (left-band spawn → travels right; right-band
   spawn → travels left).
3. WHEN a spark fades in THEN it SHALL still appear stationary at its
   spawn position (no fly-in), then begin travelling inward.

### Requirement 3 — Edge-collision death (no instakill of fresh sparks)

#### Acceptance criteria

1. WHEN a travelling spark reaches a FAR edge of the grid THEN it SHALL
   fade out and die (freeing a slot). "Far edge" is defined in design
   (the band's bounds a spark can run into); the exact edges that kill
   SHALL be documented.
2. WHEN a spark has JUST spawned at an edge THEN the death rule SHALL NOT
   kill it immediately — it SHALL be allowed to leave its spawn edge
   first (e.g. death only applies once it has moved off the spawn edge,
   or the spawn edge itself is excluded from the kill condition).
3. WHEN a spark dies THEN it SHALL fade out smoothly (consistent with the
   current fade), then its element becomes available for reuse.
4. WHEN sparks die at different times (because they travel different
   paths/distances) THEN deaths SHALL be naturally staggered, not
   synchronised.

### Requirement 4 — No fixed lifetime; independent come-and-go

#### Acceptance criteria

1. WHEN the lifecycle runs THEN sparks SHALL have NO fixed time-based
   lifetime; the ONLY death condition SHALL be reaching a far edge
   (Req 3), and the ONLY spawn constraint SHALL be the per-side max count
   (Req 1) plus a spawn cadence.
2. WHEN a slot frees up on a side THEN a replacement spark SHALL spawn
   after a short, slightly randomised delay so appearances feel
   independent/staggered rather than instantaneous and synchronised.
3. WHEN the effect runs over time THEN each side SHALL tend toward (but
   not rigidly lock at) its max count, with sparks continuously flying
   on at the edges and off at the far edges.
4. WHEN the spawn cadence/limits are defined THEN they SHALL be
   clearly-labelled tweak points.

### Requirement 5 — Reuse, consistency, no regression

#### Acceptance criteria

1. WHEN changes are made THEN they SHALL stay within the background
   feature; no new dependency.
2. WHEN implementation is complete THEN `npm run build` (incl. `CI=true`)
   SHALL succeed with no unresolved imports.
3. WHEN implementation is complete THEN the grid, tail, no-fly-in
   fade-in, no-reversal/straight-bias walk, cursor glow, reduced-motion
   disable, and unmount cleanup SHALL all remain intact.
4. WHEN element pooling is used THEN there SHALL be enough spark DOM
   elements to cover both sides at max simultaneously, reused as sparks
   die and respawn (no per-spawn DOM creation churn).
5. WHEN tweak points exist (max per side, spawn delay, step speed,
   straight bias, etc.) THEN they SHALL be clearly labelled.

---

## Open question — needs owner confirmation

**Which edges kill a spark?** Sparks spawn at the OUTER (screen) edge of
their band and head INWARD. The natural "flies across then off" reading
is that a spark dies when it reaches:
- the **INNER edge** (`col = cols`, toward the page centre), AND
- the **top** (`row = 0`) or **bottom** (`row = rows`) edges,
but NOT its own spawn (outer) edge (which would instakill).

Proposed default: **a spark dies upon reaching any grid edge OTHER THAN
the one it spawned on** (so inner edge, top, or bottom). This gives a
mix of sparks that cross the band and fly off the inner side, and some
that wander off the top/bottom — all flying "off screen"/off-grid.

Alternative (simpler): a spark dies ONLY when it reaches the INNER edge
(a clean left-to-right / right-to-left "fly across and off toward the
centre"), ignoring top/bottom as kill edges (it just turns at top/
bottom). 

Default assumed: the first (any edge except the spawn edge). Confirm or
pick the alternative.
