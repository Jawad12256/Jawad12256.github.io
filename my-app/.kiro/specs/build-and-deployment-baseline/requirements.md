# Spec 1 — Build Fix and Deployment Baseline

## Introduction

The `rework` branch currently does not produce a successful production
build on Linux, which blocks all further development and both target
deployments (GitHub Pages and AWS Amplify). This spec has a deliberately
narrow scope: get `npm run build` to succeed reliably on a
case-sensitive Linux filesystem, make the data layer tolerant of
content that is intentionally incomplete (e.g. empty image arrays that
will be populated later), and establish a documented, compatible
dual-host deployment baseline — **without performing any deployment**.

This spec does **not** add new portfolio features (no content modal,
gallery, crafting mode, or newly rendered sections). Those are reserved
for later specs. The goal is a green, deployable, future-proof baseline.

### Authoritative context (from audit)

- Build fails first on a case-sensitive import: `AppShell.jsx` imports
  `'../components/Navbar'` but the file is `NavBar.jsx`.
- A second failure follows: `projects.js` imports
  `'../assets/3d-printing/hero.jpg'` but the asset on disk is
  `hero.png`.
- `ContentModal.jsx` was an empty (0-byte) file imported nowhere. Per
  owner decision, it has been deleted; the content modal will be built
  properly in a later spec.
- The app lives at `my-app/` nested inside the repository root.
- No deployment configuration currently exists (no `.github/workflows`,
  no `amplify.yml`, no `CNAME`, no `404.html`, no `.nojekyll`).
- `package.json` sets `homepage: "https://jawad12256.github.io"` and has
  `gh-pages`-based `predeploy`/`deploy` scripts.
- Several data records (e.g. `trivyal`, `cyphon` under the internship,
  plus various experience/event items) intentionally have empty
  `images: []` arrays. The owner will add these images later; the
  baseline must tolerate the current emptiness and must not need code
  changes when images are added later in the already-established shape.

---

## Requirements

### Requirement 1 — Production build compiles on Linux

**User story:** As the portfolio owner, I want `npm run build` to
succeed on a case-sensitive Linux filesystem, so that CI, GitHub Pages
and AWS Amplify can all build the app without case- or path-related
failures.

#### Acceptance criteria

1. WHEN `npm run build` is run from `my-app/` on a case-sensitive Linux
   filesystem THEN the build SHALL complete with exit code 0 and emit a
   `build/` directory.
2. WHEN the module graph is resolved THEN every local import path SHALL
   match the exact case of the file on disk (specifically, the
   `AppShell.jsx` import of the navbar component SHALL resolve correctly
   on Linux).
3. WHEN the build runs with warnings-as-errors enabled (`CI=true`,
   which is AWS Amplify's default) THEN the build SHALL still succeed
   (i.e. no ESLint warnings are promoted to build-breaking errors).
4. WHEN the build completes THEN the existing rendered output (hero,
   identity marquee, project grid, navbar, footer) SHALL remain
   functionally unchanged from the intended current behaviour.

### Requirement 2 — All referenced assets resolve

**User story:** As the portfolio owner, I want every imported image and
media file to resolve to a real file, so that the build does not fail
and no broken media appears in the running app.

#### Acceptance criteria

1. WHEN the build resolves asset imports THEN every `import` of a file
   under `src/assets/` SHALL point to a file that exists with the exact
   name and extension on disk.
2. WHEN the `3d-printing` project hero image is referenced THEN the
   import SHALL resolve to the actual asset on disk
   (`hero.png`) rather than a non-existent `hero.jpg`.
3. WHEN assets are reconciled THEN no existing asset file SHALL be
   deleted, renamed away, or replaced, and no image SHALL be duplicated
   to satisfy an import (per steering).
4. IF a referenced asset genuinely does not exist in any form THEN the
   discrepancy SHALL be surfaced to the owner for a decision rather than
   silently substituted or invented.

### Requirement 3 — Tolerate intentionally empty content

**User story:** As the portfolio owner, I have records whose `images`
arrays (and some `links` objects) are intentionally empty right now and
that I will populate later; I want the app and build to handle this
emptiness gracefully and to require no code changes when I later add the
content in the established shape.

#### Acceptance criteria

1. WHEN a data record has `images: []` THEN the build SHALL succeed and
   the app SHALL NOT throw a runtime error attributable to the empty
   array.
2. WHEN a data record has an empty `links: {}` object THEN the build and
   app SHALL handle it without error.
3. WHEN images are later added to a previously-empty record using the
   established image shape (`{ src: <import>, alt: string, caption?:
   string }`) THEN no changes to component or build code SHALL be
   required for those images to be consumed correctly.
4. WHEN this spec is implemented THEN the canonical image and links
   shapes SHALL be documented (in the design document and/or a data
   convention note) so that future content additions follow a known,
   supported structure.
5. WHEN empty-content handling is added THEN it SHALL NOT fabricate,
   placeholder, or infer any image, caption, link, or other content
   that the owner has not provided.

### Requirement 4 — Remove the empty ContentModal stub

**User story:** As the portfolio owner, I want the empty
`ContentModal.jsx` stub removed, so that it does not linger as dead code
and the content modal can be built cleanly in a later spec.

#### Acceptance criteria

1. WHEN this spec is implemented THEN the empty `ContentModal.jsx` file
   SHALL be deleted from `src/components/`.
2. WHEN `ContentModal.jsx` is deleted THEN the build SHALL still succeed
   (the file was imported nowhere, so no import SHALL be left dangling).
3. WHEN this spec is complete THEN the full content modal feature SHALL
   NOT be implemented here; it is explicitly reserved for a later spec,
   and the design document SHALL record that the starting state for that
   spec is "no ContentModal component present".

### Requirement 5 — Dual-host deployment baseline (configuration only)

**User story:** As the portfolio owner, I want a documented deployment
configuration that supports both GitHub Pages and AWS Amplify from the
single nested `my-app/` application, so that the two hosts stay
compatible as development continues — without anything being deployed
yet.

#### Acceptance criteria

1. WHEN the deployment baseline is defined THEN it SHALL build the app
   from the nested `my-app/` directory and produce output at
   `my-app/build` for both hosts.
2. WHEN GitHub Pages configuration is defined THEN it SHALL be
   compatible with the existing `homepage` value and the `gh-pages`
   deploy approach, and SHALL document the exact build command and base
   path used.
3. WHEN AWS Amplify configuration is defined THEN an `amplify.yml` (or
   equivalent documented config) SHALL specify the `my-app` app root,
   the build command, and the `my-app/build` artifact directory, and
   SHALL account for Amplify's default `CI=true` behaviour.
4. WHEN both host configurations are defined THEN the base path / asset
   path strategy SHALL be verified to produce working hashed asset URLs
   on both hosts, and any divergence SHALL be documented.
5. WHEN this spec is implemented THEN NO deployment SHALL be performed
   to either host, and NO AWS resource SHALL be created, modified, or
   deleted. Deployment remains gated on explicit owner approval.
6. WHEN routing-dependent features are later introduced THEN the
   baseline SHOULD already document the intended SPA-fallback approach
   for each host (GitHub Pages `404.html` redirect; Amplify 200
   rewrite), even though no router exists yet.

### Requirement 6 — Validation without regression

**User story:** As the portfolio owner, I want the fixes validated and
the existing experience preserved, so that I can trust the baseline
before any feature work begins.

#### Acceptance criteria

1. WHEN implementation is complete THEN `npm run build` SHALL be run and
   SHALL succeed, and the result SHALL be reported with evidence.
2. WHEN the build output is inspected THEN there SHALL be no unresolved
   module, asset, or import errors.
3. WHEN the running app is checked THEN existing functionality (hero,
   marquee, project grid, navbar anchors, footer) SHALL remain intact.
4. WHEN changes are made THEN they SHALL be limited to the scope of this
   spec; unrelated improvements noticed during the work SHALL NOT be
   implemented (they MAY be noted for future specs).
5. WHEN the work is finished THEN no commit, push, PR, merge, or deploy
   SHALL occur without explicit owner approval.
