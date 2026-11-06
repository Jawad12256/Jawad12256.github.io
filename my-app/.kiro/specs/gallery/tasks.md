# Spec 10 — Gallery Page — Tasks

Executed as a batch once approved. The `build-after-spec-task` hook runs
`npm run build` after each task. Stage files explicitly; `git add` and
`git commit` as SEPARATE commands.

Note: per owner, the gallery DUPLICATES its own `isVideo` check rather
than extracting a shared util; `MediaItem.jsx` and `normaliseContent.js`
are left untouched.

---

- [ ] 1. Install react-router-dom v6
  - `npm install react-router-dom@^6` in `my-app`. Keep the updated
    lockfile.
  - _Requirements: 1.1, 1.5, 6.1_

- [ ] 2. Add ModalContext and lift modal state
  - Create `src/context/ModalContext.jsx` (ModalProvider + useModal:
    activeItem/openItem/closeModal).
  - Create a GlobalModal (component or inline in App) that renders the
    single `<ContentModal>` from context.
  - _Requirements: 5.2_

- [ ] 3. Wire routing in App.js
  - Wrap in `<HashRouter>` + `<ModalProvider>`; render `<AppShell>` with
    `<Routes>`: `/` → Home, `/gallery` → Gallery; render GlobalModal
    once. Preserve AppShell nav/footer.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6_

- [ ] 4. Refactor Home to use the lifted modal
  - Remove local modal `useState` and the inline `<ContentModal>`; use
    `useModal().openItem` for cards. Behaviour unchanged.
  - _Requirements: 5.4_

- [ ] 5. Build the derived gallery image collection
  - Create `src/utils/galleryImages.js` → `getGalleryImages()` returning
    `{ image, item }[]` from all records (projects, experience + nested
    sub-projects → parent item, achievements, events, credentials),
    images only (exclude video via a LOCAL isVideo check in this file),
    carrying the parent normalised item.
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 5.5_

- [ ] 6. Build the Gallery page with masonry + captions
  - Create `src/pages/Gallery.jsx`: masonry wall of keyboard-operable
    `<button>` image tiles; click → `openItem(parent)`; `alt` retained;
    `loading="lazy"`; caption element per image.
  - Add `.gallery-masonry` / `.gallery-item` styles (CSS column-count
    4→3→2→1; hover overlay on `hover:hover`, always-on bar on
    `hover:none`; reduced-motion aware).
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.3_

- [ ] 7. Add nav + hero entry points
  - Add `ImagesIcon` to BrandIcons; allow `LinkButton` an optional `to`
    (internal route via react-router) alongside `href`.
  - NavBar: add Gallery `<Link to="/gallery">`; make logo `<Link to="/">`.
  - Hero: add a "See my Gallery" LinkButton (ImagesIcon, `to="/gallery"`).
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 8. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; asset check clean.
  - Confirm: gallery renders masonry (images only, no video); nav link +
    hero button navigate client-side; image click opens correct record
    modal; sub-project images open parent internship; Home cards still
    open modal; single ContentModal; only new dep is react-router-dom.
  - State no-live-browser limitation (routing/masonry/hover + mobile);
    flag tunable values.
  - _Requirements: 6.2, 6.3, 6.4, 7.1_

- [ ] 9. Commit, push, open PR
  - Stage explicitly; `git add` then `git commit` separately; push to
    `rework`; open PR into `main`. Report the PR link.
  - _Requirements: (process)_
