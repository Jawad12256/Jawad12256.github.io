# Spec 3 — Browser Branding and Visual Polish — Tasks

Ordered so the icon-independent work (which can proceed immediately) is
grouped, and the icon tasks (blocked on the owner providing the image
file) are clearly separated. The `build-after-spec-task` hook runs
`npm run build` after each task.

Executed as a batch once approved, EXCEPT the icon tasks, which are
gated on the icon source file being present in the repo.

---

## Independent of the icon file

- [ ] 1. Set the browser tab title
  - Edit `my-app/public/index.html`: `<title>React App</title>` →
    `<title>Jawad Uddin</title>`.
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Update HTML meta description and theme-color
  - Replace the CRA placeholder description with a factual portfolio
    description (wording confirmed with owner).
  - Set `<meta name="theme-color" content="#0a0c10">`.
  - _Requirements: 3.3, 3.4, 7.1_

- [ ] 3. Update manifest text and colours
  - `short_name` → "Jawad Uddin"; `name` → agreed full name string.
  - `theme_color` → "#0a0c10"; `background_color` → "#0a0c10".
  - Leave icon entries until Task 6; ensure the file stays valid JSON.
  - _Requirements: 3.1, 3.2, 7.1_

- [ ] 4. Resize the hero portrait
  - Add a constrained `.hero__photo` / `.hero__photo img` rule in
    `components.css` targeting roughly half the current width AND height
    (proportional via `height: auto`). State the chosen value.
  - Verify the <=700px responsive behaviour stays sensible.
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 5. Add the identity marquee scroll animation
  - In `components.css`: add `@keyframes identity-scroll` (0 → -50%),
    apply a continuous linear animation to `.identity-marquee__track`,
    set `overflow: hidden` on the marquee container, and ensure the
    track lays out as a `max-content` flex row.
  - Confirm the existing hover-pause and `prefers-reduced-motion` rules
    still apply, and that no horizontal page scrollbar/layout shift is
    introduced.
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

## Gated on the owner-provided icon file

- [ ] 6. Generate and wire the favicon + app icons (BLOCKED until the
       icon image file is present in the repo)
  - Confirm the source icon file location in the repo.
  - Produce favicon + 192/512 + apple-touch icons from the source. If no
    image-processing tool is available in the environment, STOP and ask
    the owner to commit the pre-sized set (do not fabricate icons).
  - Update `index.html` icon/apple-touch links and `manifest.json`
    `icons[]` to the new files (correct paths/types/sizes).
  - Remove leftover default CRA icon assets once unreferenced; grep
    `public/` to confirm no dangling references.
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 7.2_

## Validation and delivery

- [ ] 7. Validate and no-regression check
  - `npm run build` and `CI=true npm run build` succeed; no unresolved
    imports/assets; no dangling icon references.
  - Inspect built `build/index.html` for new title/description/theme/
    icon links.
  - Diff review: all sections/modal/nav/footer unchanged; scope limited.
  - State the no-live-browser limitation; recommend an owner smoke-test.
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 8. Commit, push, and open PR
  - Commit to `rework`, push, open a PR into `main`. Report the PR link.
  - If Task 6 is still blocked, ship Tasks 1-5 and 7 and clearly flag
    the icon work as pending the asset, OR hold the PR until the icon is
    provided — per the owner's preference.
  - _Requirements: (process)_
