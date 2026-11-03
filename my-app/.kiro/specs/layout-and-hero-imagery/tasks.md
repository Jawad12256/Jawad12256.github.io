# Spec 4 — Top-Section Layout and Card Hero Imagery — Tasks

Executed as a batch once approved. The `build-after-spec-task` hook runs
`npm run build` after each task.

---

- [ ] 1. Restructure the hero section (fix far-left alignment)
  - In `Home.jsx`, move `<IdentityMarquee>` to be the FIRST child of
    `.hero`, above `.container.hero__inner`.
  - In `components.css`: remove the centering flex from `.hero`; add
    `.hero__inner` as the photo|content flex row with gap; add
    `.hero__content { flex: 1 1 auto }`; relax the forced min-height.
  - Ensure the hero content now aligns to the standard `.container`
    margin.
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Make the marquee a full-width banner
  - Style `.identity-marquee` as a full-width band (background
    `--bg-sunken`, top/bottom border, vertical padding), keeping
    `overflow:hidden` so no horizontal scrollbar appears.
  - Confirm it spans full page width above the hero content.
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 3. Add marquee dividers and spacing
  - In `IdentityMarquee.jsx`, render each item with a trailing
    decorative `//` divider (`aria-hidden`), wrapping text in a span.
  - In `components.css`, style `.identity-card` with generous gap/
    padding and `.identity-card__divider` in the accent token.
  - Reconcile the track `gap` so the seamless -50% loop, hover-pause and
    reduced-motion still work and the divider cadence is uniform across
    the seam.
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 4. Add `heroImage` to the data model and normalisation
  - Add an explicit optional `heroImage: { src, alt }` to records that
    have a representative still image (projects; achievements uksdc/f1is).
    Do NOT borrow images across records; leave genuinely image-less
    records without one. Do not discard any existing field.
  - For `morsemaster` (no dedicated hero), select an existing
    representative still from its OWN images (confirm choice; see open
    question).
  - In `normaliseContent.js`, add `heroImage` to the ContentItem shape:
    use `record.heroImage` if present, else fall back to the first
    non-video `images` entry, else `null`.
  - _Requirements: 4.1, 4.2, 4.3, 4.6, 4.7, 7.1_

- [ ] 5. Render the hero image (and empty-state) on cards
  - Update `ProjectCard` and `Card` to render a `card__hero` image when
    present, else a tasteful token-styled `card__hero--empty` block (no
    broken/borrowed image). Hero uses `aspect-ratio` + `object-fit:
    cover` for even rows. Meaningful alt text.
  - Preserve click/keyboard → ContentModal behaviour.
  - Ensure a later-added image on a currently-empty record is picked up
    with no further code change.
  - _Requirements: 4.1, 4.4, 4.5, 4.7, 6.2, 7.2_

- [ ] 6. Make the grids three-per-row
  - In `components.css`, set `.project-grid` and `.card-grid` to
    `repeat(3, 1fr)` at full width, with responsive 3 → 2 (<=1000px) →
    1 (<=700px) breakpoints and balanced gaps.
  - Verify card internals read well at three-up width.
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 7. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; asset
    cross-check clean (new `heroImage` imports resolve).
  - Confirm normalisation + ContentModal still work with the new field.
  - Diff review: all sections/modal/nav/footer intact; Spec 3 marquee
    animation and branding intact.
  - State the no-live-browser limitation; flag tunable values (photo
    cap, grid breakpoints, hero aspect ratio) for owner fine-tuning;
    recommend a browser smoke-test.
  - _Requirements: 6.1, 6.3, 6.4, 6.5_

- [ ] 8. Commit, push, open PR
  - Commit to `rework` (stage files explicitly; do NOT chain add+commit
    in one shell line to avoid the earlier staging slip), push, open PR
    into `main`. Report the PR link.
  - _Requirements: (process)_
