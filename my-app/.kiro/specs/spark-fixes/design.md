# Spec 17 — Spark Fixes — Design

## Overview

Three contained fixes in the background feature: rebuild the tail so it
reliably trails behind in all directions, slow the spawn rate ~33%, and
exclude corner/corner-adjacent spawn positions (CORNER_MARGIN=1, all 4
edges). Touches `Background.jsx` and the tail CSS in `background.css`.

---

## Fix 1 — Tail trails behind (all directions)

### Diagnosis

The current tail uses `transform-origin: left center` with
`transform: rotate(var(--tail-angle)) translateX(-100%)` and a gradient
whose bright end is on the bar's right. This composition does not map
cleanly to "opposite of travel", so after the 90° turn (switching axis)
the tail renders ahead of the spark.

### Fix — unambiguous construction

Make the tail a bar that is **always drawn to the LEFT of the spark
centre, bright end at the spark**, then rotate the whole thing by the
TRAVEL angle so "left of centre" becomes "behind the spark" for any
direction.

CSS:
```css
.bg-flair__spark-tail {
    position: absolute;
    top: 50%;
    left: 50%;

    width: var(--spark-tail-len);
    height: 2px;
    border-radius: 2px;

    /* bright at the RIGHT end (nearest the spark), fading left */
    background: linear-gradient(to left,
        rgba(62,232,168,0.75), rgba(62,232,168,0));

    /* pivot at the spark centre; the bar sits to the LEFT of it */
    transform-origin: right center;
    transform: translate(-100%, -50%) rotate(var(--tail-angle, 0deg));
    pointer-events: none;
}
```

Key change: `transform-origin: right center` + `translate(-100%, -50%)`
places the bar's RIGHT (bright) end exactly at the spark centre, bar
extending left. `rotate()` then pivots about that bright end (the spark),
so the bar always swings around the spark. With the bar naturally
pointing LEFT, we rotate by the angle that points "left" toward "behind".

JS — set `--tail-angle` to the angle that rotates a left-pointing bar to
point OPPOSITE travel:

| travel | tail should point | bar base points left (180°); rotate by |
|---|---|---|
| right [1,0]  | left  | 0°   |
| left  [-1,0] | right | 180° |
| down  [0,1]  | up    | 90°  |
| up    [0,-1] | down  | 270° |

```js
const tailAngle = (dc, dr) => {
    if (dc === 1) return 0;    // moving right -> tail points left
    if (dc === -1) return 180; // moving left  -> tail points right
    if (dr === 1) return 90;   // moving down  -> tail points up
    if (dr === -1) return 270; // moving up    -> tail points down
    return 0;
};
```

> This is verifiable by inspection: the bar's resting state (0°) points
> left = behind a right-moving spark; each other direction is that plus
> the rotation needed. Clean per-axis mapping, no fragile composition.
> (Exact rotate/translate order will be confirmed so the pivot is the
> spark centre; if a rotation sign needs flipping for up vs down, the
> 90/270 pair is adjusted — the construction makes this trivial to get
> right, unlike before.)

Length/thickness/colour/fade unchanged (Req 1.4).

## Fix 2 — Slower spawn (~33%)

`SPAWN_INTERVAL_MS: 600 -> 850` (~+42% interval ≈ -30% rate; within the
20–50% band). Keep the ±50% jitter. Labelled tweak point.

## Fix 3 — Corner-exclusion (CORNER_MARGIN=1, all edges)

A labelled constant and a clamped range helper:
```js
const CORNER_MARGIN = 1;  // cells excluded from each END of a spawn edge

// random index along an edge of length N (0..N), excluding the first
// and last CORNER_MARGIN cells; clamps so there's always >=1 valid spot.
const edgePos = (n) => {
    const lo = Math.min(CORNER_MARGIN, Math.floor(n / 2));
    const hi = Math.max(lo, n - CORNER_MARGIN);
    return lo + randInt(hi - lo + 1);
};
```
Apply in `spawn()`:
- outer edge (col 0): `row = edgePos(rows)`.
- inner edge (col cols): `row = edgePos(rows)`.
- top edge (row 0): `col = edgePos(cols)`.
- bottom edge (row rows): `col = edgePos(cols)`.

(Was `randInt(rows+1)` / `randInt(cols+1)` — now excludes the 1-cell
corner margin on both ends of each edge.) Graceful clamp handles narrow
bands (Req 3.3).

---

## Files touched

| File | Change |
|---|---|
| `src/components/Background.jsx` | corrected `tailAngle` mapping; `SPAWN_INTERVAL_MS` 600→850; `CORNER_MARGIN` + `edgePos()`; use `edgePos` in `spawn()` |
| `src/styles/background.css` | rebuild `.bg-flair__spark-tail` transform so it reliably trails behind |

## Validation plan

1. `npm run build` + `CI=true npm run build` → succeed; no new dep;
   diagnostics clean.
2. Confirm (code): tail mapping clean per-axis; spawn interval raised;
   `edgePos` excludes CORNER_MARGIN cells at both ends of every edge with
   graceful clamp; rest of the engine (L-path, pool, fade-in, cursor
   glow, reduced motion, cleanup) unchanged.
3. No live browser → tail-behind correctness after the turn, spawn
   density, and corner-clearance need owner smoke-test; tweak points
   labelled.
