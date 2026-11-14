# Spec 15 — Grid & Spark Refinements

## Introduction

Refinements to the decorative background grid and its travelling sparks:
deeper grid penetration, slightly more visible grid, no visible "fly-in"
on load, faster electricity-like sparks with a short tail, a smarter
random-walk (no reversing, longer straight runs), and a much shorter
spark lifespan. Confined to the isolated background feature
(`Background.jsx` + `background.css`).

### Owner-requested changes

1. **Deeper grid.** Extend the grid further toward the centre from BOTH
   edges (wider bands), keeping the existing gradient fade so it dims
   toward the middle — just occupying more horizontal space.
2. **Slightly more visible grid.** Nudge the grid up a touch so it's
   easier to spot (currently a hair too faint) — still subtle.
3. **No fly-in on load.** On desktop load, the user SHALL NOT see sparks
   gliding across the screen to their start positions; sparks SHALL just
   appear (fade in) where they begin.
4. **Faster, electricity-like sparks with a tail.** Sparks SHALL move
   noticeably faster (electricity-flowing feel, not firefly-floating),
   and SHALL have a thin, short tail trailing their direction of travel.
5. **Smarter random walk.** A spark SHALL never reverse directly back on
   itself (if going right, next step is never left; if up, never down,
   etc). To avoid distracting zig-zags at the higher speed, sparks
   SHALL tend to continue in their current direction for multiple grid
   steps before turning.
6. **Shorter lifespan.** Given the faster motion, each spark SHALL live
   no more than ~2 seconds (implementer picks the exact value), then
   retire and respawn.

### Authoritative context (verified on current `main`)

- Grid bands: `.bg-flair::before/::after { width: clamp(90px, 14vw,
  200px) }`, grid lines `rgba(62,232,168,0.06) 1px`, band
  `opacity: 0.6`, masked to fade toward centre.
- The JS `bandWidth()` in `Background.jsx` mirrors the CSS band width
  (`min(200, max(90, innerWidth*0.14))`) — BOTH must change together so
  sparks stay within the visible grid.
- Sparks: `NODE=32`, `SPARK_COUNT=4`, `SPARK_MAX_NODES=15`,
  `STEP_MS=900`; walk via `transition: transform STEP_MS linear` between
  nodes; random cardinal direction each step (currently CAN reverse).
- Fly-in cause: `spawn()` sets transform then restores the glide
  transition before the first `step()`, so the first move animates from
  the spawn node — and because sparks spawn at random nodes and glide,
  the initial movement reads as "flying across" on load.
- Cursor glow is separate and should remain unaffected except where it
  shares styling.
- Reduced motion already disables the walking sparks.

---

## Requirements

### Requirement 1 — Deeper grid penetration

#### Acceptance criteria

1. WHEN the grid renders THEN the left and right bands SHALL extend
   further toward the centre than the current `clamp(90px, 14vw, 200px)`
   width (noticeably more horizontal coverage).
2. WHEN the bands are widened THEN the existing gradient/mask fade toward
   the centre SHALL be preserved (grid dims and disappears toward the
   middle; no hard edge).
3. WHEN the CSS band width changes THEN the JS `bandWidth()` SHALL be
   updated to match, so sparks continue to travel only within the
   visible grid region.
4. WHEN widened THEN the grid SHALL still not reach/clutter the central
   content area or harm readability.

### Requirement 2 — Slightly more visible grid

#### Acceptance criteria

1. WHEN the grid renders THEN it SHALL be a little more visible than
   current (e.g. a modest increase to the grid-line alpha and/or band
   opacity), making it easier to spot.
2. WHEN made more visible THEN it SHALL remain subtle and SHALL NOT
   distract from or reduce the contrast of page content.
3. WHEN the change is applied THEN the mint-tinted, blueprint-grid
   character SHALL be preserved.

### Requirement 3 — No visible fly-in on load

#### Acceptance criteria

1. WHEN the page loads on desktop THEN sparks SHALL NOT be seen gliding/
   flying across the screen to their starting positions.
2. WHEN a spark first appears THEN it SHALL fade in at its spawn node
   (already in position), not animate a transform into place.
3. WHEN a spark respawns later (after its lifespan) THEN it SHALL
   likewise appear at the new spawn node without a visible glide from
   its previous position.

### Requirement 4 — Faster sparks with a short tail

#### Acceptance criteria

1. WHEN sparks move THEN they SHALL travel noticeably faster than the
   current ~900ms/step, giving an electricity-flowing feel.
2. WHEN a spark moves THEN it SHALL display a thin, short tail trailing
   behind it in its direction of travel (a comet/streak look), not a
   large blur.
3. WHEN the tail renders THEN it SHALL reorient to follow the current
   direction of travel (horizontal vs vertical) so it always trails
   behind, and SHALL remain subtle/on-brand (mint).
4. WHEN sparks are faster THEN motion SHALL remain smooth (no visible
   stutter) using GPU-friendly transforms.

### Requirement 5 — Smarter random walk (no reversal, longer runs)

#### Acceptance criteria

1. WHEN a spark chooses its next step THEN it SHALL NEVER pick the exact
   opposite of its current direction (no 180° reversal).
2. WHEN a spark is moving THEN it SHALL tend to CONTINUE in its current
   direction for multiple grid steps before turning, reducing frequent
   zig-zagging (e.g. a strong probability of going straight, lower
   probability of a 90° turn).
3. WHEN a spark reaches a band boundary THEN it SHALL turn to a valid
   in-bounds direction (still never the direct reverse unless that is
   the only option, which the grid geometry should avoid).
4. WHEN turning THEN only 90° turns (perpendicular directions) SHALL be
   available (plus straight), consistent with no-reversal.

### Requirement 6 — Shorter lifespan

#### Acceptance criteria

1. WHEN a spark is created THEN its total lifespan SHALL be at most ~2
   seconds (implementer picks the exact value / derives a node count
   from the faster step duration so it stays ~2s).
2. WHEN a spark reaches its lifespan THEN it SHALL fade out and respawn
   (keeping a small constant live pool), as today.
3. WHEN the lifespan value is set THEN it SHALL be a clearly-labelled
   tweak point.

### Requirement 7 — Reuse, consistency, no regression

#### Acceptance criteria

1. WHEN changes are made THEN they SHALL stay confined to the background
   feature (`Background.jsx` + `background.css`); no new dependency.
2. WHEN implementation is complete THEN `npm run build` (incl. `CI=true`)
   SHALL succeed with no unresolved imports.
3. WHEN implementation is complete THEN the cursor glow, the static
   grid, reduced-motion behaviour, cleanup on unmount, and everything
   outside the background SHALL remain intact.
4. WHEN animations run THEN `prefers-reduced-motion` SHALL still disable
   the autonomous spark motion.
5. WHEN tweak points exist (band width, grid visibility, step speed,
   lifespan, straight-run bias, glow radius) THEN they SHALL be clearly
   labelled for easy tuning.
