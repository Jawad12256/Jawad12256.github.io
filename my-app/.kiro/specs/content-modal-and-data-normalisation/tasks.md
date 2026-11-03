# Spec 2 — Content Modal and Data Normalisation — Tasks

Implementation plan. Tasks are ordered so the data contract and modal
exist before the sections that consume them. The `build-after-spec-task`
hook runs `npm run build` after each task for continuous validation.

Per the updated workflow steering, these are executed as a batch once
approved; results are reported after the batch.

---

- [ ] 1. Create the normalisation layer (`src/utils/normaliseContent.js`)
  - Create `src/utils/` and `normaliseContent.js`.
  - Implement pure adapters producing the `ContentItem` shape
    (`id, type, title, subtitle, shortDescription, description,
    technologies, skills, images, links, meta, subItems`):
    `normaliseProject`, `normaliseExperience` (maps nested `projects`
    into `subItems` via `normaliseProject`), `normaliseAchievement`,
    `normaliseEvent`, `normaliseCredential` (fold `credentialUrl` into
    `links`, retain in `meta`).
  - Preserve all non-core fields in `meta`; never discard; never
    fabricate. Pass empty `images: []` / `links: {}` through untouched.
  - Do NOT edit the source data files.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.3, 8.3, 10.1, 10.2_

- [ ] 2. Build the MediaItem renderer (`src/components/MediaItem.jsx`)
  - Render one `{ src, alt, caption? }` entry: `<video controls>` for
    video sources (extension-based `isVideo(src)` helper), else `<img>`.
  - Render `caption` only when present (e.g. `<figcaption>`).
  - _Requirements: 2.5, 2.6_

- [ ] 3. Build the reusable ContentModal (`src/components/ContentModal.jsx`)
  - Render via `ReactDOM.createPortal` to `document.body`; return `null`
    when no item.
  - Display title, subtitle, description, type-specific `meta` lines
    (award/recognition/issuer/period as applicable), technologies/skills
    chips, images via `MediaItem`, `subItems` ("Projects within this
    role") subsection, and links — each section rendered only when it
    has content.
  - Accessibility/behaviour: `role="dialog"`, `aria-modal`,
    `aria-labelledby`; close via close button, Escape, and overlay
    click; focus move-in on open and restore on close with a basic focus
    trap; body-scroll lock with cleanup.
  - Respect `prefers-reduced-motion` for any transition.
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5, 5.4_

- [ ] 4. Build the generic clickable Card (`src/components/Card.jsx`)
  - Compact summary card driven by a normalised item
    (`title`/`shortTitle`, `subtitle`, `shortDescription`), used by the
    four non-project sections.
  - Keyboard-operable: `role="button"`, `tabIndex={0}`, Enter/Space and
    click all invoke the activate handler. Styled with existing tokens.
  - _Requirements: 6.1, 6.2, 9.1, 9.2_

- [ ] 5. Make ProjectCard keyboard-operable and modal-wired
  - Add `role="button"`, `tabIndex={0}`, `onKeyDown` (Enter/Space)
    alongside the existing `onClick`; preserve existing markup/visuals.
  - _Requirements: 4.1, 4.2, 4.4_

- [ ] 6. Wire modal state and render all sections in Home.jsx
  - Add `activeItem` state; render `<ContentModal item={activeItem}
    onClose=...>` once.
  - Render sections in order: Hero, About, Projects, Experience,
    Credentials, Achievements, Events, Contact; renumber eyebrows
    `01 // ABOUT` … `07 // CONTACT`.
  - Projects grid: pass `onClick` that opens the modal with
    `normaliseProject(project)`.
  - Experience/Credentials/Achievements/Events: render via `Card`, each
    opening the modal with the matching normalised item; the internship
    role is the first-class entry with its nested sub-projects shown in
    its modal (not promoted to the Projects grid).
  - Leave About/Contact copy unchanged.
  - _Requirements: 4.3, 5.1, 5.2, 5.3, 5.5, 5a.1, 6.1, 6.2, 6.3, 6.4,
    7.1, 7.2, 8.1, 8.2, 8.4, 10.3_

- [ ] 7. Update the navigation (`src/components/NavBar.jsx`)
  - Remove the About link; set lean links: Projects, Experience,
    Achievements, Contact. Keep anchor-scroll + existing <=700px hide
    rule. Ensure each target section `id` exists.
  - _Requirements: 5a.2, 5a.3, 5a.4_

- [ ] 8. Add styles for modal, cards, media and chips
  - Extend `src/styles/components.css` using existing tokens only:
    overlay/scrim, dialog, close button, media gallery/figure, chips
    (reusing the existing tag pattern), generic card + section grids,
    sub-items subsection. Dark/technical/minimal; reduced-motion aware.
  - _Requirements: 9.2_

- [ ] 9. Validation and no-regression check
  - Run `npm run build` and `CI=true npm run build`; both must succeed
    with no unresolved imports/assets. Re-run the asset cross-check.
  - Review the diff: confirm hero/marquee/footer and existing project
    grid appearance unchanged; sections present in the specified order;
    no source data files restructured; no new runtime dependency.
  - State the no-live-browser limitation honestly; recommend an owner /
    Playwright smoke test for interactive behaviours.
  - Note (do not fix) the IdentityMarquee animation gap for a future
    spec.
  - _Requirements: 9.3, 9.4, 9.5, 9.6, 10.2_

- [ ] 10. Commit, push, and open PR
  - Commit to `rework` with a clear message, push, and open a PR into
    `main` (now the default branch). Report the PR link.
  - _Requirements: (process)_
