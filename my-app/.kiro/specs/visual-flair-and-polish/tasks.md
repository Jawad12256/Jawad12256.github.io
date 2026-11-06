# Spec 13 — Visual Flair and Polish — Tasks

Executed as a batch once approved. The `build-after-spec-task` hook runs
`npm run build` after each task. Stage files explicitly; `git add` and
`git commit` as SEPARATE commands.

---

- [ ] 1. Crafting consumes ingredients
  - In `Craft.jsx` `collect()`, clear the grid (`setSlots(EMPTY_SLOTS)`)
    after discovery/modal, WITHOUT firing per-slot remove sounds.
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Sliding notifications (in + out)
  - Toast model gains an `exiting` flag; `Craft.jsx` sets it + plays
    `notifOut`, then removes after the out-animation. `CraftNotifications`
    applies a `--exiting` class. Add `toast-out` keyframe + reduced-motion
    fallback in `craft.css`.
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 3. First-section top spacing + mute padding
  - `components.css`: reduce top padding / drop border-top for
    `main > .section:first-child`. `craft.css`: widen `.craft__toolbar`
    gap (mute padding).
  - _Requirements: 3.1, 3.2, 3.3, 4.1_

- [ ] 4. Larger accent eyebrow / category text
  - `components.css`: bump `.hero__eyebrow, .section__eyebrow` and
    `.project-card__category, .card__meta` sizes ~15-30%, preserving
    hierarchy.
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 5. Bold button text
  - `components.css`/`craft.css`: set button text to `font-weight: 700`
    (`.link-button`, `.craft-button`, contact/nav action links).
  - _Requirements: 8.1_

- [ ] 6. Scroll-reveal sections
  - New `src/hooks/useReveal.js` (IntersectionObserver, one-time, no-JS
    fallback). Apply reveal ref + classes in `Section.jsx`. Add
    `.reveal`/`.reveal--shown` CSS with reduced-motion fallback.
  - _Requirements: 7.1-7.5_

- [ ] 7. Extruded-square background (experiment, isolated + removable)
  - New `src/components/Background.jsx` (fixed, behind content,
    pointer-events none) + `src/styles/background.css` (edge square
    pattern, mint-hinted gradient, subtle; optional reduced-motion-gated
    spark). Import background.css in base.css; mount `<Background/>` once
    in `App`.
  - _Requirements: 6.1-6.7_

- [ ] 8. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; asset check clean;
    no new dependency.
  - Confirm: collect clears grid (no sound burst); toasts slide in+out;
    craft/gallery top gap reduced, Home unregressed; mute spacing;
    eyebrow/category larger; buttons bold; reveal works with reduced-
    motion + no-JS fallback; background fixed/behind/removable.
  - State no-live-browser limitation (background subtlety, spark, slide +
    reveal timing need owner smoke-test); note background is flagged
    removable.
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 9. Commit, push, open PR
  - Stage explicitly; `git add` then `git commit` separately; push to
    `rework`; open PR into `main`. Report the PR link; explicitly call
    out the background as the experiment to accept/reject.
  - _Requirements: (process)_
