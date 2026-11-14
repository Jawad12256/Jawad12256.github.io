# Spec 16 — Spark Edge-Based Lifecycle (Option C) — Tasks

Executed as a batch once approved. Build hook runs `npm run build` after
each task. Stage explicitly; `git add` then `git commit` separately.
Confined to `Background.jsx` (CSS unchanged).

---

- [ ] 1. Replace the walk engine with the Option C path engine
  - In `Background.jsx`, rewrite the walking-sparks effect:
    - Add a reusable POOL of spark elements (POOL_SIZE) with per-element
      state `{ el, alive, col, row, dir, phase, runLeft }`.
    - `spawn()`: pick a random band (left/right) + a random one of its
      four edges; place at a random point on that edge; set the inward
      initial direction; set `phase='initial'`, `runLeft = randInt` in
      RUN_H (2–4) for horizontal-spawn or RUN_V (4–12) for vertical-
      spawn; stationary fade-in (no fly-in); set `--spark-step`.
    - `step()`: in `'initial'` phase, advance `dir` and decrement
      `runLeft`; when it reaches 0, perform ONE random 90° turn and
      switch to `'post-turn'`. In `'post-turn'`, if the next step is out
      of bounds → die (fade out, mark element free); else advance. Set
      `--tail-angle` each step.
    - Timer-driven spawner: every SPAWN_INTERVAL_MS (randomised) grab a
      free pooled element and spawn; skip the tick if none free.
  - Delete redundant code: SPARK_LIFETIME_MS, STRAIGHT_BIAS, chooseDir
    random-walk/reversal logic, bornAt, fixed SPARK_COUNT band-by-index
    assignment.
  - Keep: band width calc + resize, pixelX/place, tailAngle, stationary
    fade-in, cursor glow, reduced-motion guard, full cleanup (timers +
    listeners). Label all tweak points.
  - Render POOL_SIZE spark spans (each with its tail child).
  - _Requirements: 1.x, 2.x, 3.x, 4.x, 5.3, 5.4, 5.5_

- [ ] 2. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; no new dep;
    diagnostics clean.
  - Confirm (code): edge spawn + inward run (2–4 h / 4–12 v) + one 90°
    turn + run-to-edge death; timer-driven spawns; pool reuse (no churn/
    leak); no instakill; tail trails; stationary fade-in; cursor glow +
    reduced motion + cleanup intact; removed engine code is gone.
  - State no-live-browser limitation (feel needs owner smoke-test).
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 3. Commit, push, open PR
  - Stage explicitly; `git add` then `git commit` separately; push to
    `rework`; open PR into `main`. Report PR link + tweak points.
  - _Requirements: (process)_
