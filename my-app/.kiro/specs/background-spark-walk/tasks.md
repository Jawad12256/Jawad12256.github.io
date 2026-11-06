# Spec 14 — Background Spark Random Walk + Glow — Tasks

Executed as a batch once approved. The `build-after-spec-task` hook runs
`npm run build` after each task. Stage files explicitly; `git add` and
`git commit` as SEPARATE commands. Confined to the isolated background
feature.

---

- [ ] 1. Glow + transform-positioning CSS
  - In `background.css`: add a clearly-labelled `--spark-glow-radius`
    variable on `.bg-flair`; give `.bg-flair__spark` a layered mint glow
    driven by that variable; position via `transform: translate()` with
    `transition` for the glide; add `--hidden` fade class; keep
    reduced-motion hiding. Remove the old vertical-only keyframes +
    per-side spark rules.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.3_

- [ ] 2. JS random-walk spark pool (Background.jsx)
  - Render SPARK_COUNT spark spans. In a useEffect: model each spark as a
    node (col,row,band,nodes); step every STEP_MS to a random valid
    adjacent node (4-dir, in-bounds) by writing `transform` to the
    element ref (no React re-render per step); NODE=32 to match the grid.
    Retire at SPARK_MAX_NODES (fade out → respawn at a random node). Add
    a resize listener to recompute bounds; clamp out-of-range sparks.
    Disable entirely under prefers-reduced-motion. Clean up all timers +
    listeners on unmount.
  - Clearly label SPARK_COUNT, SPARK_MAX_NODES, STEP_MS, NODE as the
    tweak points.
  - _Requirements: 2.1, 2.2, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2,
    4.3, 4.4, 4.5_

- [ ] 3. Cursor glow
  - Add a `.bg-flair__cursor` element reusing `--spark-glow-radius`;
    track `pointermove` on window via a ref, throttled with rAF; reveal
    on first move; only enable for pointer devices
    (`matchMedia('(hover: hover) and (pointer: fine)')`); pointer-events
    none; clean up listener + rAF on unmount.
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 4. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; no new dependency.
  - Confirm (code): 4-direction node walk within bounds; bounded
    lifespan + respawn keeps count; cursor glow tracks pointer (pointer
    devices only); transform/opacity only; cleanup; reduced-motion
    disables autonomous motion; static grid unchanged; glow radius/
    count/lifespan are single labelled values.
  - State no-live-browser limitation (walk feel, glow size, cursor
    tracking, perf need owner smoke-test).
  - _Requirements: 6.2, 7.2, 7.3_

- [ ] 5. Commit, push, open PR
  - Stage explicitly; `git add` then `git commit` separately; push to
    `rework`; open PR into `main`. Report the PR link and name the
    tweak points (glow radius, spark count, lifespan).
  - _Requirements: (process)_
