# Spec 7 — Media Scroll Fix, About Removal, 3-Col Cards, Icon Buttons — Tasks

Executed as a batch once approved. The `build-after-spec-task` hook runs
`npm run build` after each task. Stage files explicitly; `git add` and
`git commit` as SEPARATE commands.

---

- [ ] 1. Fix the media pane scroll/compression bug
  - In `components.css`, add `.modal__media .media-item { flex-shrink:
    0; }` so figures keep natural size and the pane scrolls its
    overflow. Confirm `.modal__media` keeps `overflow-y:auto` +
    `min-height:0`.
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Remove the About section and update hero copy
  - In `profile.js`: delete the `about` field; change `title` to
    'Multidisciplinary Design Engineer'; reword ONLY the first
    `introduction` paragraph to state he's a Design Engineering student
    at Imperial College London (keep age + tone; paragraphs 2-3
    unchanged).
  - In `Home.jsx`: delete the entire About `<Section>`; renumber the
    remaining eyebrows sequentially (Projects=01 ... Contact=06).
  - Confirm nav has no About link.
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 3. Make the grids three-per-row
  - In `components.css`, set `.project-grid`/`.card-grid` to
    `repeat(3,1fr)`; add responsive 3→2 (<=1000px) →1 (<=760px). Do not
    change `.container` width/margins.
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 4. Create inline brand icon components
  - New `src/components/icons/BrandIcons.jsx` exporting inline-SVG icons
    (GitHub, LinkedIn, MakerWorld or generic, Email, Article/external,
    Credential) using `fill/stroke: currentColor`, `aria-hidden`, sized
    in `em`. Source standard glyph paths (e.g. Simple Icons CC0); use a
    neutral generic icon rather than fabricating a logo if a clean mark
    isn't available.
  - _Requirements: 4.1, 4.3, 4.4_

- [ ] 5. Create the shared LinkButton component
  - New `src/components/LinkButton.jsx` mapping a platform/link key to
    { icon, label, showLabel }; renders `<a class="link-button">` with
    icon (+ clarifying text for ambiguous keys like linkedinTrivyal/
    linkedinCyphon), correct target/rel, and `mailto:` for email.
    Icon-only buttons carry an `aria-label`.
  - _Requirements: 4.1, 4.2, 4.5_

- [ ] 6. Use LinkButton site-wide + style it
  - Refactor ContentModal `LinksList` and the Home Contact links to use
    `LinkButton`. Add `.link-button` styles (accent pill, `svg { width:
    1em; height:1em }`) matching tokens; retire/alias old `.modal__link`
    / `.contact-link` as needed.
  - _Requirements: 4.5, 4.6_

- [ ] 7. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; asset check
    clean.
  - Confirm: media pane scrolls with full-size media + visible captions;
    About fully gone (data + render); hero eyebrow 'Multidisciplinary
    Design Engineer' + first paragraph mentions Imperial; 3-up grid with
    intact margins; icon buttons render correctly in modal + contact,
    ambiguous ones labelled.
  - State no-live-browser limitation (esp. the scroll fix); flag tunable
    values.
  - _Requirements: 5.2, 5.3_

- [ ] 8. Commit, push, open PR
  - Stage explicitly; `git add` then `git commit` separately; push to
    `rework`; open PR into `main`. Report the PR link.
  - _Requirements: (process)_
