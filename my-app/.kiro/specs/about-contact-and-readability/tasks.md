# Spec 5 — About/Contact Rewrite and Readability — Tasks

Executed as a batch once approved. The `build-after-spec-task` hook runs
`npm run build` after each task. Stage files explicitly and keep
`git add` and `git commit` as SEPARATE commands (lesson from Spec 3).

---

- [ ] 1. Add the paragraph helper and renderer
  - Create `src/utils/paragraphs.js` with `toParagraphs(value)`
    (array → filtered; string → split on blank lines; else []).
  - Create `src/components/Paragraphs.jsx` rendering each paragraph as a
    `<p>` with an optional className. Backward-compatible with plain
    strings.
  - _Requirements: 5.2, 5.5_

- [ ] 2. Lighten body text and widen the content column (tokens)
  - In `tokens.css`: change `--text-body` to a lighter value closer to
    the heading colour (e.g. ~#c9d1dc) while keeping `--text-dim` and
    `--text-heading` distinct; widen `--content-width` (e.g. 1100 →
    1280px).
  - State the chosen values for owner fine-tuning.
  - _Requirements: 3.2, 4.1, 4.2, 4.3, 4.4_

- [ ] 3. Relax prose max-widths (components.css)
  - Widen `.section__content`, `.hero h1`, `.hero__description` caps so
    text flows further right while keeping a sensible max line length;
    preserve centering, the narrow-screen gutter, and no horizontal
    overflow.
  - _Requirements: 3.1, 3.3, 3.4, 3.5_

- [ ] 4. Make About and Contact data-driven
  - Add `profile.about` (paragraph array) and `profile.contact`
    (paragraph array) to `profile.js`, sourced from existing copy/
    profile with NO new claims.
  - In `Home.jsx`, render About via `<Paragraphs text={profile.about}/>`
    and Contact via `<Paragraphs text={profile.contact}/>` plus a
    `contact-links` block rendering `profile.links` (GitHub, LinkedIn,
    email→mailto), omitting any missing link. Style links with tokens.
  - Preserve eyebrows/titles/order.
  - _Requirements: 1.1, 1.2, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 7.1_

- [ ] 5. Paragraph the hero introduction and render it
  - Convert `profile.introduction` to a paragraph array (each sentence/
    idea its own short paragraph; wording unchanged).
  - Render the hero description via `<Paragraphs
    text={profile.introduction} className="hero__description" />`.
  - _Requirements: 5.1, 5.3, 5.4_

- [ ] 6. Paragraph the data-file descriptions and modal rendering
  - Convert `description` fields to paragraph arrays in `projects.js`,
    `experience.js` (incl. nested projects), `achievements.js`,
    `events.js`, `credentials.js`, inserting breaks only at existing
    sentence/idea boundaries (no wording changes).
  - Update `ContentModal.jsx` to render descriptions (item + sub-items)
    via `<Paragraphs>`.
  - Confirm `normaliseContent.js` passes `description` through unchanged
    (string or array both supported).
  - _Requirements: 5.1, 5.2, 5.3, 6.2_

- [ ] 7. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; asset check
    clean.
  - Confirm: About/Contact render from data; contact links work
    (external + mailto); modal + sub-items render multi-paragraph;
    single-string fields still render (backward compat).
  - Diff review: wording unchanged except paragraph breaks; token and
    width changes isolated; sections/modal/nav/footer/marquee/hero
    images intact.
  - State no-live-browser limitation; flag tunable values (content
    width, prose max-width, body colour hex) for owner fine-tuning.
  - _Requirements: 6.1, 6.3, 6.4, 7.2_

- [ ] 8. Commit, push, open PR
  - Stage explicitly; `git add` then `git commit` as separate commands;
    push to `rework`; open PR into `main`. Report the PR link.
  - _Requirements: (process)_
