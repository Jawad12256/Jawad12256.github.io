# Spec 15 — Grid & Spark Refinements — Design

## Overview

Six tweaks inside the isolated background feature. CSS handles grid
depth/visibility and the tail look; JS handles faster stepping, no-fly-in
spawn, no-reversal momentum walk, and the ~2s lifespan. Band width must
stay in sync between CSS and JS.

### Tweak points (all labelled)

- CSS: band `width` (grid depth), grid-line alpha + band `opacity` (grid
  visibility), `--spark-glow-radius`, tail length var.
- JS: `NODE`, `SPARK_COUNT`, `STEP_MS` (speed), `SPARK_LIFETIME_MS`
  (~2000), `STRAIGHT_BIAS` (chance of continuing straight), `BAND_*`
  width constants (mirror CSS).

---

## Change 1 — Deeper grid (Req 1)

Widen the bands and extend the fade further inward.

```css
.bg-flair::before,
.bg-flair::after {
    /* deeper: was clamp(90px, 14vw, 200px) */
    width: clamp(140px, 22vw, 320px);
    ...
}
```

Keep the existing mask gradient (fades to transparent toward centre) —
it already scales to the band width, so a wider band simply fades over a
longer distance (still no hard edge) (Req 1.2, 1.4).

JS must match (Req 1.3):
```js
// mirror the CSS clamp(140px, 22vw, 320px)
const BAND_MIN = 140, BAND_VW = 0.22, BAND_MAX = 320;
const bandWidth = () =>
    Math.max(NODE * 2,
        Math.min(BAND_MAX, Math.max(BAND_MIN, window.innerWidth * BAND_VW)));
```

## Change 2 — More visible grid (Req 2)

Modest bumps:
```css
background-image:
    linear-gradient(to right,  rgba(62,232,168,0.10) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(62,232,168,0.10) 1px, transparent 1px),
    linear-gradient(135deg, rgba(62,232,168,0.06), rgba(62,232,168,0) 70%);
/* band opacity 0.6 -> 0.7 */
```
(0.06→0.10 line alpha, 0.6→0.7 band opacity.) Still subtle; tunable.

## Change 3 — No fly-in on load (Req 3)

Root cause: `spawn()` places the spark then the FIRST `step()` glides it
from the spawn node with the transform transition active — so the opening
move looks like it flies in.

Fix: **separate "appear" from "move".**
- On spawn: set transform with the transition **disabled** (so it snaps
  to the spawn node), force a reflow, then fade opacity in. No transform
  transition happens on appearance.
- Only AFTER the spark is visible/placed do we enable the transform
  transition and begin stepping. Each subsequent step glides normally.
- Implementation: toggle a `--no-move` state by setting
  `el.style.transition = 'opacity ...'` (no transform) during spawn, then
  on the next frame set `el.style.transition = ''` (restores the CSS
  transform transition) right before the first real step. (Current code
  does this but starts stepping too eagerly; we add a short "settle"
  delay so the fade-in completes at the spawn node before the first
  move.)

> Net: spark fades in stationary at its node, then starts travelling.
> Applies equally to initial spawn and respawn (Req 3.3).

## Change 4 — Faster sparks + tail (Req 4)

### Speed
`STEP_MS: 900 -> 150` (fast, electric). Linear transition keeps constant
velocity between nodes. (Tunable.)

### Tail
A thin streak trailing the direction of travel. Implement as a child
element (`.bg-flair__spark-tail`) inside each spark, or a `::before` on
the spark, that is a short mint gradient rectangle pointing opposite the
travel direction. Because direction changes, we rotate the tail to match.

Approach (direction-aware, GPU-friendly):
- Spark element holds the position transform (`translate`).
- A tail child is absolutely centred on the spark; it's a thin rounded
  gradient bar (e.g. width = tail length, height = 2px) that fades from
  mint at the spark end to transparent at the far end.
- On each step, set the tail's rotation via a CSS variable
  `--tail-angle` (0/90/180/270deg) based on the chosen direction so it
  always points BEHIND the spark.

```css
.bg-flair__spark-tail {
    position: absolute;
    top: 50%; left: 50%;
    width: var(--spark-tail-len, 22px);   /* TWEAK: tail length */
    height: 2px;
    border-radius: 2px;
    /* trails behind: bright at the spark (right end), fades left */
    background: linear-gradient(to left,
        rgba(62,232,168,0.7), rgba(62,232,168,0));
    transform-origin: left center;
    /* rotate so the bar points opposite travel; translate so it starts
       at the spark centre and extends backwards */
    transform: transl(-100%? ) rotate(var(--tail-angle, 0deg));
    transition: opacity 150ms ease;
}
```
(Exact transform-origin/offset finalised in code so the tail sits behind
the moving dot; angle set from JS travel direction.) Subtle + mint
(Req 4.3). Transforms only (Req 4.4).

> Simpler fallback if the rotating bar is fussy: render the tail as a
> motion-blur-style elongated box-shadow offset opposite travel, set via
> a `--tail-dx/--tail-dy` variable. Whichever reads cleaner in code wins;
> both are transform/shadow based and cheap.

## Change 5 — Smarter walk: no reversal + straight bias (Req 5)

Track each spark's current direction `dir` (dc,dr). On each step:
1. Build candidate directions = the 4 cardinals, EXCLUDING the exact
   reverse of `dir` (Req 5.1) and any out-of-bounds move.
2. If `dir` itself is still valid (in bounds), choose: with probability
   `STRAIGHT_BIAS` (e.g. 0.7) keep going straight; otherwise pick a
   random perpendicular (90°) turn from the candidates (Req 5.2, 5.4).
3. If straight is blocked by a boundary, pick a random valid
   perpendicular turn (Req 5.3).
4. First step after spawn: pick a random initial direction (no prior
   `dir`).

```js
const STRAIGHT_BIAS = 0.72;   // TWEAK: higher = longer straight runs
// opposite(dir) excluded; prefer straight; else 90° turn.
```

This yields longer straight "runs" with occasional right-angle turns and
never a 180° flip — an electric, purposeful path (Req 5).

## Change 6 — ~2s lifespan (Req 6)

Switch from a node count to a time budget so it stays ~2s regardless of
speed:
```js
const SPARK_LIFETIME_MS = 2000;   // TWEAK: max spark life (~2s)
// a spark started at t0 retires when performance.now()-t0 >= LIFETIME.
```
At `STEP_MS=150`, ~2s ≈ ~13 steps — plenty of travel. On retire: fade
out, respawn at a new random node (stationary fade-in per Change 3),
keep `SPARK_COUNT` live (Req 6.2).

> Chosen 2000ms exactly (the owner's suggested cap). Clearly labelled.

---

## Files touched

| File | Change |
|---|---|
| `src/styles/background.css` | wider bands; higher line alpha/opacity; spark tail element styles + `--spark-tail-len`; keep glow/cursor |
| `src/components/Background.jsx` | matching BAND constants; STEP_MS fast; no-fly-in spawn (settle before move); no-reversal + straight-bias walk tracking `dir`; time-based ~2s lifespan; render tail child + set `--tail-angle` per step |

## Validation plan

1. `npm run build` + `CI=true npm run build` → succeed; no new dep.
2. Confirm (code): band width CSS/JS in sync; grid alpha/opacity raised
   modestly; spawn fades in stationary (no transform glide on
   appearance); STEP_MS fast; tail child rotates to trail travel;
   direction never reverses + straight bias; ~2s time-based lifespan +
   respawn; cursor glow + reduced-motion + cleanup intact.
3. No live browser → the feel (speed, tail, grid depth/visibility, no
   fly-in) needs owner smoke-test; all values labelled for tuning.

## Non-goals

- Cursor glow behaviour (unchanged beyond shared styling).
- Anything outside the background feature.
