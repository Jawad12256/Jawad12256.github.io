# Spec 16 — Spark Edge-Based Lifecycle (Option C) — Design

## Overview

Replace the random-walk + fixed-lifetime engine with a simple
deterministic path per spark: spawn on a band edge, run straight inward
a short distance, turn 90° once, then run straight until it hits an edge
and dies. Spawning is timer-driven. This removes a lot of code
(`STRAIGHT_BIAS`, per-step direction choosing, reversal logic, time-based
lifespan) and is more performant. Confined to `Background.jsx` (CSS
unchanged except where noted).

### Geometry (confirmed)

- Sparks live in the two edge BANDS. A band is `cols` wide
  (~4–10 at NODE=32) and `rows` tall (~20–28). `col` 0..cols with
  `col=0` = OUTER (screen) edge, `col=cols` = INNER edge. `row` 0..rows.
- The four spawn edges are the four sides OF A BAND: outer (col 0),
  inner (col cols), top (row 0), bottom (row rows).

### Per-spark path (Option C)

1. **Spawn** at a random point on one of the band's four edges.
2. **Initial straight run** perpendicular to that edge, INWARD into the
   band:
   - left/right edge spawn → move horizontally `randInt(2..4)` steps
   - top/bottom edge spawn → move vertically `randInt(4..12)` steps
   (clamped so it can't overshoot the band; if the band is too small for
   the drawn count, it runs as far as it can.)
3. **One 90° turn**, randomly clockwise or anticlockwise.
4. **Run straight** in the new direction every STEP_MS until the next
   step would leave the grid → the spark **dies** (fades out), and its
   pooled element becomes free for reuse.

No reversal logic needed (it never turns more than once). No per-step
random direction. No fixed lifetime.

### Direction vectors by spawn edge → initial inward direction

| spawn edge | start node | initial dir | first-run axis | first-run range |
|---|---|---|---|---|
| outer (col 0)   | col 0,    row rand | right [1,0]  | horizontal | 2–4 |
| inner (col cols)| col cols, row rand | left [-1,0]  | horizontal | 2–4 |
| top (row 0)     | col rand, row 0    | down [0,1]   | vertical   | 4–12 |
| bottom (row rows)| col rand, row rows| up [0,-1]    | vertical   | 4–12 |

### The 90° turn

After the initial run, pick perpendicular: if moving horizontally, turn
to [0,1] or [0,-1] (random); if vertical, turn to [1,0] or [-1,0]
(random). Then travel that way until an out-of-bounds step → die.

> This guarantees a spark always makes exactly one L-shaped path and
> exits at an edge, so it reliably dies (no immortal sparks, no
> instakill — the initial inward run moves it off the spawn edge before
> any death check applies).

## Spawning (timer-driven)

- A repeating timer spawns a new spark every `SPAWN_INTERVAL_MS`
  (slightly randomised each time) onto a randomly chosen band + edge.
- A fixed **pool** of spark elements (`POOL_SIZE`) is reused: on spawn,
  grab a free (dead/idle) element; if none free, skip this tick (natural
  soft cap, prevents unbounded DOM). `POOL_SIZE` is the only "max
  simultaneous" safety — set comfortably above the expected live count
  (e.g. spawn interval × max path time implies how many overlap).
- Per the owner: spawning does NOT read an alive-count to decide; it's
  purely the timer. The pool is just an element-reuse safety, not a
  behavioural gate the user would notice.

## State model (simplified)

Each pooled element has a tiny state object:
`{ el, alive, col, row, dir, phase, runLeft }` where
- `phase`: `'initial'` (doing the first straight run) → `'post-turn'`.
- `runLeft`: steps remaining in the initial run; when it hits 0, turn
  once and switch to `'post-turn'`.
- In `'post-turn'`, each step just advances `dir`; if the next node is
  out of bounds → die.

## Tweak points (labelled)

```js
const NODE = 32;
const STEP_MS = 150;              // step glide speed
const SPAWN_INTERVAL_MS = 600;    // avg time between spawns (randomised)
const POOL_SIZE = 10;             // reusable spark elements (soft cap)
const RUN_H = [2, 4];             // initial straight run, horizontal spawn
const RUN_V = [4, 12];            // initial straight run, vertical spawn
// Band width mirrors CSS clamp(140,22vw,320): BAND_MIN/VW/MAX.
```

## Code to REMOVE (per owner: delete redundant engine code)

- `SPARK_LIFETIME_MS` and all time-based lifespan logic.
- `STRAIGHT_BIAS` and the `chooseDir` random-walk / no-reversal /
  candidate-filtering logic.
- The fixed `SPARK_COUNT` left/right assignment by element index (the
  pool + timer replaces it).
- `bornAt` tracking.

## Code to KEEP

- `NODE`, band-width calc (`BAND_MIN/VW/MAX`), `cols`/`rows` + resize.
- `pixelX`/`place` positioning (left vs right band origin).
- `tailAngle()` (tail still trails travel direction — set on each step).
- Stationary fade-in on spawn (no fly-in).
- `--spark-step` per element; `bg-flair__spark--active` toggle.
- Cursor glow effect, reduced-motion guard, unmount cleanup.

## Render

Render `POOL_SIZE` `.bg-flair__spark` spans (each with its tail child),
all idle/transparent initially; the engine drives them. (CSS unchanged.)

## Files touched

| File | Change |
|---|---|
| `src/components/Background.jsx` | Replace walk engine with Option C path engine + timer spawner + element pool; delete redundant lifetime/walk code; render POOL_SIZE sparks |

(CSS `background.css` unchanged — same spark/tail/glow styling applies.)

## Validation plan

1. `npm run build` + `CI=true npm run build` → succeed; no new dep;
   diagnostics clean.
2. Confirm (code): spawn on a random band edge; correct inward initial
   dir; initial run 2–4 (h) / 4–12 (v) then one 90° turn; travel to edge
   → die + element freed; timer-driven spawns (randomised); pool reuse
   (no DOM churn / leak); no instakill (initial run moves off spawn
   edge first); tail trails; stationary fade-in; cursor glow + reduced
   motion + cleanup intact; removed code is gone.
3. No live browser → the come-and-go feel + path shapes need owner
   smoke-test; tweak points labelled.
