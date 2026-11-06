# Spec 14 — Background Spark Random Walk + Glow — Design

## Overview

Replace the two CSS-keyframe sparks with a small JS-driven pool of
glowing sparks that random-walk node-to-node along the 32px grid within
the left/right edge bands, each with a bounded lifespan. GPU-friendly
(transform + opacity), cleaned up on unmount, disabled under reduced
motion. Stays inside the isolated background feature.

### Tunable values (all clearly labelled, owner-editable)

- **Glow radius** — a CSS variable `--spark-glow-radius` in
  `background.css` (drives the glow's `box-shadow`/radial size).
- **Spark count** — a JS constant `SPARK_COUNT` in `Background.jsx`.
- **Lifespan** — a JS constant `SPARK_MAX_NODES` (chosen condition:
  nodes travelled — see rationale).
- **Step duration** — `STEP_MS` (glide time between nodes).
- **Grid spacing** — `NODE = 32` (matches the CSS `background-size`).

---

## Lifespan condition — decision

Use **nodes travelled** (`SPARK_MAX_NODES`, default ~15), not a wall-
clock timer. Rationale:
- It's tied to the number of DOM/style updates a spark causes, so it
  directly bounds work (one step = one transform update). More
  performance-honest than a timer.
- Deterministic and easy to reason about; naturally retires a spark
  after a fixed number of glides regardless of step speed.

A spark's total on-screen time ≈ `SPARK_MAX_NODES * STEP_MS` (e.g.
15 * ~900ms ≈ 13.5s), which is also a sensible duration.

## Node model

- `NODE = 32` px (matches the grid's `background-size: 32px`).
- Each edge band spans: vertical 0..viewportHeight, horizontal 0..bandW
  where `bandW = clamp(90, 14vw, 200)` resolved at runtime from the
  band's actual width.
- A spark position is a node `(col, row)` in integer grid units; pixel
  position = `col*NODE, row*NODE` (left band measured from the left
  edge; right band mirrored from the right edge).
- Columns range `0..floor(bandW / NODE)`; rows range
  `0..floor(vh / NODE)`.

## Random walk

On each step a spark picks a random direction from the 4 cardinals that
stays in bounds (filter out-of-range directions; pick uniformly from the
valid set). If somehow boxed in (shouldn't happen on a grid), it stays.
Each step updates the spark element's `transform: translate(x, y)`; a CSS
`transition: transform STEP_MS` makes it glide smoothly node-to-node.

## Implementation (`Background.jsx`)

- Render a fixed number of `<span class="bg-flair__spark">` in each band
  (left/right) — actually a single pool rendered into the `.bg-flair`
  with each spark knowing which band it's in (affects x origin).
- A `useEffect` sets up the pool and a scheduler:
  - For each spark: state `{ col, row, band, nodes }`.
  - A stepping loop. Prefer **one shared `setInterval`/recursive
    `setTimeout` per spark** keyed to `STEP_MS` (not per-frame rAF,
    since movement is node-to-node with CSS handling the tween — cheaper
    and smooth). Update the element's transform directly via a ref
    (avoid React re-render per step → no reconciliation cost).
  - Increment `nodes`; when `nodes >= SPARK_MAX_NODES`: fade out (set
    opacity 0 via class), then after the fade respawn at a random node
    with `nodes = 0` and fade back in. Keeps `SPARK_COUNT` live sparks.
- **Direct DOM updates via refs** (not React state per step) so there's
  no re-render churn; React only mounts the spark elements once.
- Resize: a `resize` listener recomputes band width / row-col bounds
  (debounced/throttled or just recompute on event; cheap). Out-of-range
  sparks are clamped.
- Cleanup: clear all timers + remove the resize listener on unmount
  (Req 4.2).
- Reduced motion: if `matchMedia('(prefers-reduced-motion: reduce)')`
  matches, do NOT start the walk (and CSS already hides sparks). The
  static grid remains (Req 4.4).

> Why not pure CSS: node-to-node random direction can't be expressed in
> static keyframes. A light JS stepper driving CSS transitions is the
> performant middle ground (no per-frame JS, GPU-composited transforms).

## Glow (`background.css`)

```css
.bg-flair {
    /* TWEAK: mint glow radius around each spark. Increase for a larger
       illuminated area; decrease for a tighter spark. */
    --spark-glow-radius: 42px;
}

.bg-flair__spark {
    position: absolute;
    top: 0; left: 0;              /* positioned via transform */
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--accent);

    /* Layered glow using the radius variable — a bright core fading to a
       soft mint halo that "lights" the grid around it. */
    box-shadow:
        0 0 calc(var(--spark-glow-radius) * 0.35) calc(var(--spark-glow-radius) * 0.10) rgba(62,232,168,0.55),
        0 0 var(--spark-glow-radius) calc(var(--spark-glow-radius) * 0.28) rgba(62,232,168,0.28),
        0 0 calc(var(--spark-glow-radius) * 1.8) calc(var(--spark-glow-radius) * 0.5) rgba(62,232,168,0.12);

    transition: transform var(--spark-step, 900ms) linear,
                opacity 600ms ease;
    will-change: transform, opacity;
}

.bg-flair__spark--hidden { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
    .bg-flair__spark { display: none; }
}
```

- `--spark-glow-radius` is the single labelled tweak point (Req 1.2).
- Glow uses layered mint `box-shadow` → illuminates a small-medium area
  (Req 1.1, 1.3). Pointer-events none inherited from `.bg-flair`
  (Req 1.4).
- `transform`/`opacity` only → GPU-friendly (Req 4.1).

> The right-band sparks are positioned from the right edge: implemented
> by giving right-band sparks an x origin relative to the right side
> (e.g. a container pinned right, or computing x from viewport width).
> Simplest: position all sparks with `left`-based transforms, computing
> the right band's base x as `viewportWidth - bandW`.

## Cursor glow (Req 4)

A single extra element `.bg-flair__cursor` inside `.bg-flair`, reusing
the same glow (`--spark-glow-radius`). A `pointermove` listener on
`window` writes the cursor x/y to the element's `transform` via a ref,
throttled with `requestAnimationFrame` (store latest coords, apply once
per frame). It starts hidden and reveals on first pointer move, so touch
devices (which never emit meaningful `pointermove`/have a hover pointer)
don't show it — guarded with `matchMedia('(hover: hover) and (pointer:
fine)')` so only real mice get it (Req 4.4). `pointer-events: none`,
behind content (Req 4.2). Listener + rAF cleaned up on unmount (Req 4.6).

```css
.bg-flair__cursor {
    position: absolute;
    top: 0; left: 0;
    width: 4px; height: 4px;
    border-radius: 50%;
    /* reuse the spark glow (same radius variable) */
    box-shadow: /* same layered mint glow as .bg-flair__spark */;
    opacity: 0;                 /* until first pointer move */
    transition: opacity 400ms ease;
    will-change: transform;
}
.bg-flair__cursor--active { opacity: 1; }
```

> The cursor glow is still decorative and behind content (z-index -1 on
> `.bg-flair`). It tracks the user's own motion, so it's kept under
> reduced-motion (no autonomous animation added) per Req 4.5.

## Files touched

| File | Change |
|---|---|
| `src/components/Background.jsx` | JS spark pool + random-walk scheduler (refs, timers, resize, reduced-motion, cleanup); render N spark spans; cursor-glow element + throttled pointermove tracking (pointer-device only) |
| `src/styles/background.css` | `--spark-glow-radius` var + layered glow (shared by sparks + cursor); transform-based positioning; cursor-glow styles; remove old per-side vertical keyframes |

## Validation plan

1. `npm run build` + `CI=true npm run build` → succeed; no new
   dependency.
2. Confirm (code): sparks step node-to-node in 4 directions within band
   bounds; bounded by `SPARK_MAX_NODES`; respawn keeps `SPARK_COUNT`
   live; transforms/opacity only; timers + resize listener cleaned up;
   reduced-motion disables; glow radius is one labelled var.
3. No live browser → the walk feel, glow size, and performance need
   owner smoke-test; glow radius / count / lifespan flagged as the three
   tweak points.

## Non-goals / unchanged

- The static grid pattern, masks, bands, fixed positioning — unchanged.
- Everything outside the background feature — untouched.
