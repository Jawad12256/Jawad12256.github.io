# Spec 18 — "Read more" for long modal descriptions — Tasks

Executed as a batch once approved. Build hook runs `npm run build` after
each task. Stage explicitly; `git add` then `git commit` separately.

---

- [ ] 1. Add collapsible mode to Paragraphs
  - `Paragraphs.jsx`: add `collapsible` prop (default false) + a labelled
    `COLLAPSE_THRESHOLD` (~320 chars). When collapsible AND total text >
    threshold: show whole paragraphs up to the threshold, then a mint
    "Read more…" `<button>` that toggles to full / "Show less"
    (`aria-expanded`). Default-off path behaves exactly as today.
  - _Requirements: 1.1-1.5, 2.2, 3.1, 3.2, 3.3, 4.4_

- [ ] 2. Opt the modal descriptions in
  - `ContentModal.jsx`: add `collapsible` to the main description and the
    sub-item description `<Paragraphs>` usages. Leave Home hero/contact
    usages unchanged.
  - _Requirements: 3.4, 4.3_

- [ ] 3. Style the Read more button (mint)
  - `components.css`: `.read-more` inline text button in `--accent`
    (bold, underline/accent-hover on hover/focus, keyboard-focusable).
  - _Requirements: 2.1, 2.3_

- [ ] 4. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; no new dep;
    diagnostics clean.
  - Confirm (code): long descriptions collapse + mint toggle; short/
    hero/contact unaffected; truncation by whole paragraphs; reopen
    resets state; modal scroll/two-pane intact.
  - State no-live-browser limitation (feel + threshold need owner
    smoke-test).
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 5. Commit, push, open PR
  - Stage explicitly; `git add` then `git commit` separately; push to
    `rework`; open PR into `main`. Report PR link + the threshold.
  - _Requirements: (process)_
