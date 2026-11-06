# Spec 14 — Background Spark Random Walk + Glow

## Introduction

Upgrade the background grid's sparks from simple up/down CSS keyframe
traces into glowing mint sparks that random-walk node-to-node along the
grid (up/down/left/right), illuminating the grid around them, each with a
bounded lifespan. Confined entirely to the existing isolated background
feature (Background.jsx + background.css).

### Owner-requested changes

1. Add a stronger mint-green **glow** around each spark so it
   "illuminates" the grid in a small-to-medium radius. The glow radius
   SHALL be defined via a single, clearly-labelled value the owner can
   easily tweak.
2. Sparks SHALL move not only up/down but also left/right — performing a
   **random walk** from node to node, where a node is a corner of a grid
   square (a grid intersection).
3. Each spark SHALL have a **maximum lifespan** (by time or by number of
   nodes travelled — implementer chooses whichever is more performant);
   after its life ends the spark is retired and (optionally) a fresh one
   begins elsewhere, keeping the effect alive but bounded.
4. A **cursor glow** SHALL follow the pointer with the same mint glow
   effect (same radius as the sparks), illuminating the grid/content
   around the cursor.

### Authoritative context (verified on current `main`)

- The grid is drawn by `.bg-flair::before/::after` using
  `background-size: 32px 32px` → grid spacing is 32px; nodes are at 32px
  intervals (grid intersections) within the left/right edge bands.
- Edge bands are `width: clamp(90px, 14vw, 200px)`.
- Current sparks are two CSS-animated elements (`.bg-flair__spark--left/
  --right`) that only move vertically along the inner band edge, with a
  modest `box-shadow` glow.
- The whole background is fixed, behind content, pointer-events none, and
  already respects `prefers-reduced-motion` (sparks hidden).
- Background is isolated: `Background.jsx` + `background.css` + one App
  mount — this spec keeps that isolation/removability.

---

## Requirements

### Requirement 1 — Glowing sparks that illuminate the grid

**User story:** As a visitor, I want the sparks to cast a soft mint glow
that lights up the nearby grid, for a more alive, premium feel.

#### Acceptance criteria

1. WHEN a spark renders THEN it SHALL emit a mint-green glow extending a
   small-to-medium radius around it (noticeably more than the current
   subtle box-shadow), giving an "illuminated grid" impression near the
   spark.
2. WHEN the glow radius is defined THEN it SHALL be a single, clearly-
   labelled CSS variable (e.g. `--spark-glow-radius`) with a comment, so
   the owner can tweak the size in one place.
3. WHEN the glow renders THEN it SHALL use the mint accent colour and
   remain tasteful/subtle enough not to wash out or distract from page
   content.
4. WHEN the glow is drawn THEN it SHALL not introduce layout shifts or
   capture pointer events (purely decorative, behind content).

### Requirement 2 — Node-to-node random walk (all four directions)

**User story:** As a visitor, I want sparks to wander the grid naturally
in any direction, not just slide up and down.

#### Acceptance criteria

1. WHEN a spark moves THEN it SHALL travel between NODES (grid
   intersections at the 32px grid spacing), moving one node at a time.
2. WHEN a spark chooses its next node THEN it SHALL pick a random
   adjacent direction (up/down/left/right), i.e. a random walk, staying
   within its edge band's bounds (reflect/choose a valid direction at
   edges rather than leaving the band).
3. WHEN a spark transitions between nodes THEN the movement SHALL be
   smoothly animated (glide), not teleport.
4. WHEN the walk runs THEN horizontal movement SHALL be possible across
   the band width and vertical movement across the viewport height.
5. WHEN the grid spacing (node size) is referenced THEN it SHALL match
   the visual grid (32px) so sparks visibly track the grid lines.

### Requirement 3 — Bounded spark lifespan

**User story:** As the portfolio owner, I want sparks to be bounded so
the effect stays performant and never runs forever unbounded.

#### Acceptance criteria

1. WHEN a spark is created THEN it SHALL have a maximum lifespan defined
   either as a number of nodes travelled OR a time limit (implementer
   chooses the more performant/sensible condition), with the chosen
   value clearly labelled for tuning.
2. WHEN a spark reaches its lifespan THEN it SHALL fade out and be
   retired.
3. WHEN a spark retires THEN the overall effect SHALL continue (e.g. a
   replacement spark starts at a new random node), keeping a small,
   roughly-constant number of live sparks.
4. WHEN sparks are managed THEN the total number of simultaneous sparks
   SHALL be small and bounded (performance), with the count clearly
   labelled for tuning.

### Requirement 4 — Cursor glow

**User story:** As a visitor, I want a mint glow to follow my cursor,
subtly illuminating the area around it, matching the spark glow.

#### Acceptance criteria

1. WHEN the pointer moves THEN a mint glow SHALL follow the cursor
   position, using the SAME glow radius as the sparks
   (`--spark-glow-radius`).
2. WHEN the cursor glow renders THEN it SHALL be purely decorative:
   behind content or non-interactive (`pointer-events: none`), never
   blocking clicks/hovers, and not harming readability.
3. WHEN tracking the pointer THEN it SHALL use GPU-friendly transform
   updates (no layout thrash), updating via a ref (no per-move React
   re-render) and ideally throttled to animation frames.
4. WHEN there is no pointer (touch devices / no mouse) THEN the cursor
   glow SHALL simply not appear (no errors; touch users are unaffected).
5. WHEN `prefers-reduced-motion` is set THEN the cursor glow MAY remain
   (it tracks the user's own movement, not autonomous motion) but SHALL
   not add autonomous animation; if it feels excessive it MAY be
   simplified. (Implementer's judgement; keep it tasteful.)
6. WHEN the component unmounts THEN the pointer listener SHALL be removed
   (no leak), consistent with the rest of the background cleanup.

### Requirement 6 — Performance and resilience

**User story:** As a visitor, I want the effect to be smooth and not harm
performance or battery.

#### Acceptance criteria

1. WHEN the animation runs THEN it SHALL use GPU-friendly properties
   (transform/opacity) and avoid layout thrashing (no per-frame layout
   reads/writes of geometry).
2. WHEN the component unmounts THEN all timers/animation frames/
   listeners SHALL be cleaned up (no leaks).
3. WHEN the viewport resizes THEN the walk SHALL continue sensibly (rec
   ompute bounds without breaking), OR degrade gracefully.
4. WHEN `prefers-reduced-motion` is set THEN the walking sparks SHALL be
   disabled (no motion); the static grid SHALL remain.
5. WHEN the effect is implemented THEN it SHALL remain confined to the
   isolated background feature and SHALL be cleanly removable with the
   rest of the background.

### Requirement 7 — Reuse, consistency, no regression

#### Acceptance criteria

1. WHEN changes are made THEN they SHALL reuse the existing background
   component/CSS and tokens; no new runtime dependency (plain JS timers/
   rAF + CSS).
2. WHEN implementation is complete THEN `npm run build` (incl. `CI=true`)
   SHALL succeed with no unresolved imports or assets.
3. WHEN implementation is complete THEN the static grid, all pages, and
   everything else SHALL remain unaffected; only the spark behaviour/
   glow changes.
4. WHEN the owner wishes to tweak THEN the glow radius, spark count, and
   lifespan SHALL each be single clearly-labelled values.
