# Spec 17 — Spark Fixes — Tasks

Executed as a batch once approved. Build hook runs `npm run build` after
each task. Stage explicitly; `git add` then `git commit` separately.

---

- [ ] 1. Fix the tail orientation
  - `background.css`: rebuild `.bg-flair__spark-tail` transform so the
    bright end anchors at the spark centre and the bar extends behind
    (`transform-origin: right center; transform: translate(-100%,-50%)
    rotate(var(--tail-angle))`), keeping length/thickness/colour/fade.
  - `Background.jsx`: correct `tailAngle` → {right:0, left:180, down:90,
    up:270} so the tail points opposite travel in all four directions
    (before and after the 90° turn).
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Slow the spawn rate
  - `Background.jsx`: `SPAWN_INTERVAL_MS` 600 → 850 (~-30% rate), keep
    the ±50% jitter.
  - _Requirements: 2.1, 2.2_

- [ ] 3. Exclude corner / corner-adjacent spawns
  - `Background.jsx`: add `CORNER_MARGIN = 1` and an `edgePos(n)` helper
    that returns a random index in `[CORNER_MARGIN .. n-CORNER_MARGIN]`
    with a graceful clamp. Use it for `row`/`col` in all four spawn
    edges.
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 4. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; no new dep;
    diagnostics clean.
  - Confirm (code): tail per-axis mapping; spawn interval raised; corner
    margin excluded on all edges with clamp; L-path/pool/fade-in/cursor
    glow/reduced-motion/cleanup intact.
  - State no-live-browser limitation (tail-after-turn, density, corner
    clearance need owner smoke-test).
  - _Requirements: (validation)_

- [ ] 5. Commit, push, open PR
  - Stage explicitly; `git add` then `git commit` separately; push to
    `rework`; open PR into `main`. Report PR link.
  - _Requirements: (process)_
