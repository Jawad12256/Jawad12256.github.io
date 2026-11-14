# Spec 15 — Grid & Spark Refinements — Tasks

Executed as a batch once approved. Build hook runs `npm run build` after
each task. Stage explicitly; `git add` then `git commit` separately.
Confined to the background feature.

---

- [ ] 1. Grid: deeper bands + slightly more visible
  - `background.css`: widen `.bg-flair::before/::after` width to
    `clamp(140px, 22vw, 320px)` (keep the centre-fade mask); raise grid
    line alpha ~0.06 → ~0.10 and band opacity 0.6 → 0.7.
  - _Requirements: 1.1, 1.2, 1.4, 2.1, 2.2, 2.3_

- [ ] 2. Spark tail styles
  - `background.css`: add a `.bg-flair__spark-tail` child element — a
    thin short mint gradient bar trailing the spark, rotated via a
    `--tail-angle` var, with a labelled `--spark-tail-len`. Keep it
    subtle; transforms only.
  - _Requirements: 4.2, 4.3, 4.4_

- [ ] 3. Background.jsx: faster + no-fly-in + smarter walk + ~2s life
  - Mirror the new band width (BAND_MIN/VW/MAX) so JS matches CSS
    (Req 1.3).
  - STEP_MS → fast (~150ms). No-fly-in spawn: snap to spawn node with the
    transform transition disabled, fade opacity in, settle, THEN enable
    the transform transition and begin stepping (initial + respawn).
  - Walk: track current direction; never choose the direct reverse;
    continue straight with probability STRAIGHT_BIAS (~0.72) else a 90°
    turn; handle boundaries.
  - Lifespan: time-based SPARK_LIFETIME_MS = 2000; on expiry fade out +
    respawn, keeping SPARK_COUNT live.
  - Render a tail child per spark; set `--tail-angle` from the current
    travel direction each step.
  - Keep cursor glow, reduced-motion disable, and full cleanup intact.
    Label all tweak points.
  - _Requirements: 1.3, 3.1, 3.2, 3.3, 4.1, 4.4, 5.1, 5.2, 5.3, 5.4,
    6.1, 6.2, 6.3, 7.5_

- [ ] 4. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; no new dep.
  - Confirm (code): CSS/JS band widths match; grid more visible but
    subtle; stationary fade-in (no transform glide on appear); fast
    steps; tail trails travel direction; no 180° reversal + straight
    bias; ~2s time-based lifespan + respawn; cursor glow + reduced-motion
    + cleanup intact.
  - State no-live-browser limitation (feel needs owner smoke-test); list
    tweak points.
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 5. Commit, push, open PR
  - Stage explicitly; `git add` then `git commit` separately; push to
    `rework`; open PR into `main`. Report the PR link + tweak points.
  - _Requirements: (process)_
