# Spec 17 — Spark Fixes (tail direction, spawn rate, corner exclusion)

## Introduction

Three fixes to the edge-based grid sparks: the tail renders ahead of the
spark after a 90° turn (should always trail behind), the spawn rate is a
touch high, and sparks can spawn in grid corners / corner-adjacent outer
cells which looks messy. Confined to the background feature.

### Owner-reported items

1. **Tail direction bug.** After a spark makes its 90° turn, the trail
   appears AHEAD of the direction of travel instead of behind it. The
   tail must always trail BEHIND the spark, in every direction, before
   and after the turn.
2. **Spawn rate slightly too high.** Reduce it by roughly 20–50%.
3. **No corner / corner-adjacent spawns.** To avoid sparks running along
   the very edge of the screen on spawn, exclude spawn positions that
   are at a grid corner, or within 1–2 cells of a corner along the outer
   perimeter. (See the precise definition + the open question below.)

### Authoritative context (verified on current `main`)

- Tail CSS (`background.css`): `.bg-flair__spark-tail` is a bar anchored
  at the spark centre (`left:50%; top:50%`), `transform-origin: left
  center`, `transform: rotate(var(--tail-angle)) translateX(-100%)`,
  gradient bright on the right end fading left. JS sets `--tail-angle`
  from `tailAngle(dc,dr)` → {right:180, left:0, down:270, up:90}.
- This `rotate() translateX(-100%)` + `transform-origin: left center`
  composition is fragile: the effective tail orientation does not map
  cleanly to the intended "opposite of travel", which is why it reads
  correctly on one axis but wrong after turning onto the other axis.
- Spawn: a band is `cols`×`rows` nodes; sparks spawn on one of the four
  band edges (outer col 0, inner col cols, top row 0, bottom row rows)
  at a random position along that edge, then run inward.
- `SPAWN_INTERVAL_MS = 600` (randomised ±50%).

---

## Requirements

### Requirement 1 — Tail always trails behind the spark

#### Acceptance criteria

1. WHEN a spark moves in ANY of the four directions (up/down/left/right)
   THEN its tail SHALL extend BEHIND it (opposite the direction of
   travel), with the bright end at the spark and fading away behind.
2. WHEN a spark makes its 90° turn THEN the tail SHALL immediately follow
   the new direction and still trail behind (no case where the tail
   points ahead).
3. WHEN the tail orientation is implemented THEN the mapping from travel
   direction to tail transform SHALL be unambiguous/clean (not reliant
   on a fragile transform composition), so it is correct for all four
   directions by construction.
4. WHEN fixed THEN the tail's length, thickness, mint colour, and fade
   SHALL look the same as now (only the orientation is corrected).

### Requirement 2 — Reduce spawn rate

#### Acceptance criteria

1. WHEN sparks spawn THEN the average spawn rate SHALL be reduced by
   roughly 20–50% versus the current `SPAWN_INTERVAL_MS = 600` (i.e. a
   longer interval; implementer picks a value in that band and labels
   it).
2. WHEN reduced THEN the staggered/randomised spawn feel SHALL be
   preserved (still jittered, not metronomic).

### Requirement 3 — Exclude corner & corner-adjacent spawn positions

#### Acceptance criteria

1. WHEN a spark spawns on a band edge THEN its spawn position SHALL NOT
   be a grid corner (a vertex where two perimeter edges meet) nor within
   a small margin of cells of a corner along that edge.
2. WHEN the exclusion margin is defined THEN cells within `CORNER_MARGIN`
   (default 2) steps of either end of the spawn edge SHALL be excluded
   from the spawnable range, so sparks start away from the corners and
   don't skim along the very edge.
3. WHEN an edge is too short for the margin (small bands) THEN the rule
   SHALL degrade gracefully (e.g. clamp so there is always at least one
   valid spawn position near the middle of the edge) rather than
   producing no valid position.
4. WHEN the margin value is defined THEN it SHALL be a clearly-labelled
   tweak point.

---

## Corner-exclusion — RESOLVED

Confirmed with owner: `CORNER_MARGIN = 1`, applied to **all four** band
edges. For each spawn edge indexed `0..N`, valid spawn indices are
`CORNER_MARGIN .. (N - CORNER_MARGIN)`:
- outer/inner (vertical) edges: `row` in `[1 .. rows-1]`.
- top/bottom (horizontal) edges: `col` in `[1 .. cols-1]`.
Graceful clamp if an edge is too short (always ≥1 valid position near
the middle).
