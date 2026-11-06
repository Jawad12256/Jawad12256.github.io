# Spec 9 — Page Margin, Mobile Modal Stacking, PDF Link — Tasks

Executed as a batch once approved. The `build-after-spec-task` hook runs
`npm run build` after each task. Stage files explicitly; `git add` and
`git commit` as SEPARATE commands.

---

- [ ] 1. Increase page margin and slightly shrink cards
  - `tokens.css`: `--content-width` 1280px → ~1180px (~8% narrower).
  - `base.css`: `.container` width → `min(calc(100% - 4rem),
    var(--content-width))` (2rem gutter each side, up from 1rem).
  - Keep centered/symmetric; confirm no horizontal overflow and that
    small-screen width stays sensible. State chosen values.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Fix the mobile modal stacking (no overlap)
  - Rewrite the `@media (max-width: 860px)` modal block in
    `components.css`: `.modal__layout` single scroll
    (`flex-direction:column; overflow-y:auto; min-height:0`); set
    `.modal__main` and `.modal__media` to `flex:0 0 auto; overflow:
    visible; min-height:0` so they stack at natural height (text first,
    media below); set `.modal__media .media-item { flex-shrink:1 }` in
    the stacked context.
  - Confirm desktop (>860px) two-pane scroll is unchanged.
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 3. Render PDFs as a styled new-tab link
  - In `MediaItem.jsx`, add an `isPdf(src)` check BEFORE the img branch;
    render a `.media-doc` link (`target=_blank`, `rel=noreferrer
    noopener`) using the ArticleIcon from BrandIcons and the caption/alt
    as label. Keep video + image branches unchanged. Generic for any
    `.pdf`.
  - Add `.media-doc` styles to `components.css` using tokens.
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 4. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; asset check clean
    (PDF import resolves).
  - Confirm narrower centered column + larger gutters; mobile modal
    stacks without overlap; PDF renders as a new-tab link not an image;
    desktop modal unchanged.
  - State no-live-browser limitation (esp. mobile modal — owner device
    test recommended); flag tunable values.
  - _Requirements: 4.2, 4.3, 4.4_

- [ ] 5. Commit, push, open PR
  - Stage explicitly; `git add` then `git commit` separately; push to
    `rework`; open PR into `main`. Report the PR link.
  - _Requirements: (process)_
