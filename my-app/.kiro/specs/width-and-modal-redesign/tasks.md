# Spec 6 — Content Width, Hero Photo, and Two-Column Modal — Tasks

Executed as a batch once approved. The `build-after-spec-task` hook runs
`npm run build` after each task. Stage files explicitly; keep `git add`
and `git commit` as SEPARATE commands.

---

- [ ] 1. Fix content width (remove right-side blank space)
  - In `components.css`, raise/remove the `.section__content` max-width
    so section content fills (close to) the full container column; keep
    a generous readable cap (~90ch) only for long prose if needed.
  - Preserve `.container` centering and the symmetric left/right gutter;
    no horizontal overflow.
  - State the chosen values.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.1_

- [ ] 2. Widen the cards
  - Change `.project-grid` and `.card-grid` to `repeat(2, 1fr)`; remove
    the now-redundant 1000px 2-col media query; keep a single-column
    fallback at the narrow breakpoint (~760px). Balanced gaps.
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 3. Enlarge the hero photo ~25%
  - `.hero__photo { max-width: 250px }` (from 200px), keeping
    `height:auto` for proportional scaling; verify narrow-screen layout.
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 4. Add visible gaps between paragraphs
  - Add a `p + p { margin-top: var(--space-4) }`-style rule scoped to
    where `<Paragraphs>` renders (hero description, modal description,
    section content prose, sub-item descriptions), using spacing tokens;
    ensure no trailing gap on single-paragraph blocks.
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 5. Restructure ContentModal into a two-column layout
  - In `ContentModal.jsx`, wrap the body in `.modal__layout` containing
    `.modal__main` (header, meta lines, description, technologies/skills
    chips, sub-items, links) and `.modal__media` (images/videos +
    captions). Render a single-column variant (hide the media pane) when
    the record has no media.
  - Preserve portal, dialog a11y, close paths, focus trap/restore and
    body scroll-lock unchanged.
  - _Requirements: 5.2, 5.4, 5.5, 5.6, 5.8, 6.2_

- [ ] 6. Style the two-pane modal (wider, independent scroll, responsive)
  - In `components.css`: widen `.modal` (~1100px max), bound its height
    (~85vh), make it a flex column with `overflow:hidden`; lay out
    `.modal__layout` as a flex row with `min-height:0`; give
    `.modal__main` and `.modal__media` `overflow-y:auto` + `min-height:0`
    so each scrolls independently. Add the narrow-viewport stack
    (columns → single scrollable column).
  - _Requirements: 5.1, 5.3, 5.7_

- [ ] 7. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; asset check
    clean.
  - Confirm: content fills width with symmetric gutters; cards two-up;
    photo larger; paragraph gaps visible; modal shows two independent
    scroll panes for media-rich records, single column for media-less,
    and stacks on narrow width; all modal behaviour (close/focus/scroll-
    lock) preserved; all content types still render.
  - State no-live-browser limitation; flag tunable values (content/prose
    width, card columns, photo 250px, modal 1100px, paragraph gap).
  - _Requirements: 6.1, 6.3, 6.4, 7.1, 7.2_

- [ ] 8. Commit, push, open PR
  - Stage explicitly; `git add` then `git commit` as separate commands;
    push to `rework`; open PR into `main`. Report the PR link.
  - _Requirements: (process)_
