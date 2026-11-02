# Spec 1 — Build Fix and Deployment Baseline — Tasks

Implementation plan. Each task is small, independently reviewable, and
maps to requirements. The `build-after-spec-task` hook runs
`npm run build` after each task, giving continuous validation.

No commit, push, PR, merge, or deploy occurs in any task without
explicit owner approval.

---

- [x] 1. Fix the case-sensitive navbar import
  - Edit `src/layout/AppShell.jsx`: change `import Navbar from
    '../components/Navbar'` to `import Navbar from '../components/NavBar'`
    to match the on-disk filename `NavBar.jsx`.
  - Do not rename the file or change the component's function name.
  - _Requirements: 1.1, 1.2_

- [x] 2. Fix the missing 3D-printing hero asset reference
  - Edit `src/data/projects.js`: change the import from
    `'../assets/3d-printing/hero.jpg'` to
    `'../assets/3d-printing/hero.png'` (the file that exists on disk).
  - Do not rename, delete, or duplicate any asset.
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. Confirm the ContentModal stub removal
  - Verify `src/components/ContentModal.jsx` is absent (already deleted
    while agreeing this spec) and that no import references it.
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 4. Verify the production build compiles on Linux
  - Run `npm run build` from `my-app/`; confirm exit 0 and a populated
    `build/` directory.
  - Run `CI=true npm run build` to mirror Amplify's default and confirm
    no warning-as-error failure.
  - Re-run the asset cross-check to confirm zero unresolved asset
    imports.
  - Capture output as evidence.
  - _Requirements: 1.1, 1.3, 2.1, 6.1, 6.2_

- [x] 5. Verify dual-host base-path compatibility
  - Inspect the built `build/index.html` and confirm asset URLs are
    root-relative (`/static/...`), confirming the same build serves
    correctly from both GitHub Pages (user-pages root) and Amplify root.
  - Record the finding (and the custom-domain caveat) in the design doc
    if any divergence is observed.
  - _Requirements: 5.4_

- [x] 6. Add the GitHub Pages deployment workflow (config only)
  - Create `.github/workflows/deploy-pages.yml` at the **repository
    root** (Actions only reads workflows from the repo-root
    `.github/workflows/`).
  - Scope all app steps to `my-app` via `working-directory`; run
    `npm ci` then `npm run build`; publish `my-app/build`.
  - The workflow must NOT trigger an actual deploy as part of this spec;
    if it is push-triggered, document that it will only deploy once the
    owner approves merging to the default branch.
  - _Requirements: 5.1, 5.2, 5.5_

- [x] 7. Add the AWS Amplify build configuration (config only)
  - Create `amplify.yml` at the **repository root** (confirmed correct
    per AWS docs).
  - Use `applications` with `appRoot: my-app`; `preBuild: npm ci`;
    `build: npm run build`; `artifacts.baseDirectory: build`; cache
    `node_modules`.
  - Account for Amplify's default `CI=true`; if a non-removable warning
    requires `CI=false`, make it an explicit, commented choice.
  - No Amplify app is created and nothing is deployed.
  - _Requirements: 5.1, 5.3, 5.5_

- [x] 8. Document canonical data shapes and SPA-fallback plan
  - Add a short data-conventions note (image shape `{ src, alt,
    caption? }`, `images: []`, `links: {}`) and the defensive-iteration
    convention so future records that gain images need no code change.
  - Document the deferred SPA-fallback approach (GH Pages `404.html` +
    `.nojekyll`; Amplify 200-rewrite) to be implemented when routing is
    introduced.
  - _Requirements: 3.3, 3.4, 3.5, 5.6_

- [x] 9. Final validation and no-regression check
  - Run `npm run build` once more; confirm success with no unresolved
    module/asset/import errors.
  - Review the source diff to confirm the hero, identity marquee,
    project grid, navbar anchors and footer are structurally unchanged
    (no live dev server is run, per environment constraint — state this
    limitation honestly in the report).
  - Confirm changes are limited to this spec's scope; note any unrelated
    issues for future specs without fixing them.
  - Report results with evidence. Do not commit, push, open a PR, or
    deploy without explicit owner approval.
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
