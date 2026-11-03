# Spec 1 — Build Fix and Deployment Baseline — Design

## Overview

This design turns the six requirements into concrete, minimal changes.
The guiding principle is **smallest change that makes the build green on
Linux and establishes a compatible dual-host deployment baseline**,
without introducing new features, dependencies, or architectural
churn. Everything here is reversible and reviewable in isolation.

### Toolchain (verified)

- `react-scripts` **5.0.1** (CRA), `react`/`react-dom` **19.x**
- Node **v22** locally; `gh-pages` **6.3.0** present as a dev dependency
- App root: `my-app/` (nested one level below repository root)
- Build command: `npm run build` → `react-scripts build`, output `build/`

### Scope guardrails

- No new runtime dependencies.
- No feature work (no modal, gallery, crafting mode, new sections).
- No deployment performed; AWS resources untouched.
- Only files required by the six requirements are modified.

---

## Change 0 — Remove warning-as-error lint issues (Req 1.3, 5.3)

Implementation surfaced that while `CI=false` builds succeeded, the
`CI=true` build (AWS Amplify's default) FAILED because CRA promotes
ESLint warnings to errors. The warnings were `no-useless-escape`:

- `profile.js`: `\'` inside a backtick template literal (escape not
  needed).
- `projects.js`: several `\"` inside single-quoted strings (double
  quotes need no escaping inside single quotes).

These were removed. Only the redundant `\"` / template-literal `\'`
escapes were touched; required escapes (`\'` inside single-quoted
strings) were left intact, so no displayed text changed. This is
in-scope: Req 1.3 and 5.3 require the `CI=true` build to succeed.

## Change 1 — Fix case-sensitive import (Req 1)

**Problem:** `src/layout/AppShell.jsx` imports `'../components/Navbar'`
but the file is `src/components/NavBar.jsx`. Case-insensitive dev
machines tolerate this; Linux (CI, GitHub Pages, Amplify) does not.

**Decision — fix the import, not the filename.** Two options exist:

| Option | Action | Trade-off |
|---|---|---|
| A (chosen) | Change the import in `AppShell.jsx` to `'../components/NavBar'` | One-line change; keeps the existing `NavBar.jsx` filename and the component's internal `Navbar` function name consistent with the file |
| B | Rename `NavBar.jsx` → `Navbar.jsx` | Touches git file history for a file; the internal function is `Navbar`, so either way one identifier stays mixed |

Option A is the minimal, lowest-risk change. The component file is
`NavBar.jsx` and its default export is the function `Navbar`; importing
it as `import Navbar from '../components/NavBar'` is valid and leaves the
rest untouched.

**Follow-up safeguard:** add a lint/CI guard against future case drift —
see "Preventing regressions" below.

---

## Change 2 — Fix the missing asset reference (Req 2)

**Problem:** `src/data/projects.js` line 28:
`import printingHero from '../assets/3d-printing/hero.jpg';`
The file on disk is `hero.png`.

**Decision — change the import to `hero.png`** (agreed with owner).
No asset is renamed, deleted, or duplicated. This is the only asset
mismatch; all other ~54 asset imports were verified to resolve.

```js
// before
import printingHero from '../assets/3d-printing/hero.jpg';
// after
import printingHero from '../assets/3d-printing/hero.png';
```

---

## Change 3 — Delete the empty ContentModal stub (Req 4)

`src/components/ContentModal.jsx` (0 bytes, imported nowhere) is
deleted. No code references it, so nothing else changes. The content
modal is reserved for a later spec; **starting state for that spec is
"no ContentModal component present."** (The file has already been
removed as part of agreeing this spec.)

---

## Change 4 — Tolerate intentionally empty content (Req 3)

This is the most design-sensitive requirement because the owner will
**add images later** to records that currently have `images: []`
(e.g. `trivyal`, `cyphon`, and several experience/event items), and
those additions must require **no further code changes**.

### Canonical data shapes (documented)

These are the shapes the data already uses and that all current and
future consumers will rely on:

```js
// An image
{
  src: <importedAsset>,   // required — ES import of a file in src/assets
  alt: "Description",      // required — meaningful alt text
  caption: "Optional"      // optional — omit entirely if not needed
}

// A record's image collection
images: [ /* zero or more image objects, in display order */ ]

// A record's links
links: { /* zero or more named links; {} when none */ }
```

### Why nothing breaks today, and nothing breaks later

- **Today:** The only component that touches record data is
  `ProjectCard`, which reads `category`, `year`, `title`,
  `shortDescription`, and maps `technologies`. It does **not** read
  `images` or `links`, so empty arrays/objects already cause no error.
  `Home.jsx` renders the hero from `profile` and the grid from
  `projects`; no empty-content path is exercised.
- **Later:** When images are added to a previously-empty record using
  the canonical shape above, any future consumer that iterates
  `record.images.map(...)` will naturally pick them up. An empty array
  maps to nothing; a populated array maps to its items. **No code
  change is required** to go from empty to populated, provided future
  consumers always treat `images` as "zero or more" and never assume at
  least one.

### Defensive-iteration convention (for this spec and future specs)

To lock in the "no code change needed later" guarantee, this spec
**documents a convention** (it does not build new rendering here):

1. Consumers MUST treat `images` as a possibly-empty array and render by
   mapping over it, not by indexing `images[0]` without a guard.
2. Consumers MUST treat `links` as a possibly-empty object and render
   only the keys present.
3. `caption` is optional and MUST be rendered conditionally.
4. No consumer may fabricate a placeholder image, caption, or link when
   content is absent (per steering: do not invent content).

Because this spec adds no new rendering components, there is no code to
apply the convention to *yet* — but the convention is recorded here and
in a short data-conventions note so the next spec (content modal /
gallery) implements it correctly from the start. This satisfies Req 3.4
and 3.5.

### Optional, non-breaking documentation artifact

A brief note will be added to the design/spec documenting the canonical
shapes (above). No change to the data files themselves is needed to
satisfy Req 3, since the data already conforms.

---

## Change 5 — Dual-host deployment baseline, config only (Req 5)

No deployment is executed. This change produces **configuration and
documentation** so both hosts can build the nested `my-app/` and stay
compatible.

### The nesting problem

Both GitHub Pages (via Actions) and AWS Amplify default to the
repository root, but the app is at `my-app/`. Each host's config must
explicitly point at `my-app/` and expect output at `my-app/build`.

### Base path analysis

`package.json` has `homepage: "https://jawad12256.github.io"`. Because
this is a **user/organisation Pages site** (`jawad12256.github.io`
repo), the site is served from the domain **root** (`/`), not a
subpath. CRA therefore emits **root-relative** asset URLs (`/static/…`).
AWS Amplify also serves from the root of its app domain. **Conclusion:
the same root-relative build works for both hosts** — no per-host base
path divergence is required. This will be stated explicitly in the docs
and verified by inspecting `build/index.html` after the build.

> If the owner later attaches a custom domain or a project-pages subpath,
> the base path must be revisited. This caveat is documented.

### GitHub Pages

Two compatible mechanisms, documented (owner chooses when to deploy):

1. **Existing `gh-pages` script path (already present):**
   `npm run deploy` → `predeploy` runs `npm run build`, then
   `gh-pages -d build` publishes `my-app/build` to the `gh-pages`
   branch. Run from inside `my-app/`. This already works with the
   current `homepage`.
2. **Optional GitHub Actions workflow (documented, added as config):**
   a workflow that sets `working-directory: my-app`, runs
   `npm ci && npm run build`, and publishes `my-app/build`. Provided so
   deploys are reproducible in CI rather than from a local machine.

The Actions workflow is written to `.github/workflows/` at the
**repository root** (Actions only reads workflows from the repo-root
`.github/workflows/`), with all app steps scoped to `my-app`.

### AWS Amplify

An `amplify.yml` is added **at the repository root** — confirmed
against AWS documentation as the correct location: Amplify reads a
repo-stored build spec from the root of the repository, and for a
nested app it uses the `applications` → `appRoot` key to target the
subfolder. The config describes a build that:

- uses `appRoot: my-app` (monorepo setting) or an equivalent
  `cd my-app` in the build phase,
- runs `npm ci` then `npm run build`,
- publishes artifacts from `my-app/build`,
- accounts for Amplify's default `CI=true` (CRA promotes warnings to
  errors under `CI=true`). The build must be warning-clean; if any
  non-removable warning exists, the documented mitigation is to set
  `CI=false` for the build step **only as a documented, explicit
  choice**, not silently.

Example shape (final values confirmed during implementation):

```yaml
version: 1
applications:
  - appRoot: my-app
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: build
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
```

### SPA fallback (documented now, not implemented)

No router exists yet, so no fallback is wired. The design records the
intended approach for when routes arrive:

- **GitHub Pages:** add a `404.html` that redirects to `index.html`
  (the standard CRA/GH-Pages SPA trick), plus `.nojekyll` to stop Jekyll
  from ignoring `_`-prefixed files.
- **AWS Amplify:** add a 200-rewrite rule mapping unmatched routes to
  `/index.html`.

These are **documented**, not added, because adding an unused `404.html`
redirect now could mask real 404s during this baseline phase. They will
be introduced in the spec that first adds routing.

---

## Preventing regressions (supports Req 1, 6)

To stop the case-sensitivity class of bug from recurring:

- The CI/Amplify Linux builds are themselves the strongest guard — any
  future case mismatch fails the build on a case-sensitive FS.
- Optionally (documented, low-cost): keep the existing
  `eslint-config-react-app` as-is; CRA already surfaces unresolved
  modules at build time. No new tooling is added in this spec to avoid
  scope creep; the recommendation is noted for a future spec if desired.

---

## Validation plan (Req 6)

1. Run `npm run build` from `my-app/` → expect exit 0 and a populated
   `build/` directory. Capture output as evidence.
2. Run the build again with `CI=true npm run build` to mirror Amplify's
   default and confirm no warning-as-error failure.
3. Grep the built `build/index.html` to confirm root-relative asset
   paths (dual-host compatibility check).
4. Re-run the asset cross-check script to confirm zero unresolved asset
   imports.
5. Sanity-check that the rendered structure is unchanged (hero, marquee,
   project grid, navbar, footer) — verified via build success plus a
   source diff review; a local dev server is not used (long-running
   process constraint), so verification is build-output + code review
   based, and this limitation is stated honestly.
6. Report results with evidence. No commit, push, PR, or deploy without
   explicit owner approval.

---

## Files touched by this spec

| File | Change | Requirement |
|---|---|---|
| `src/layout/AppShell.jsx` | Fix import `Navbar` → `NavBar` | 1 |
| `src/data/projects.js` | Fix `hero.jpg` → `hero.png`; remove unnecessary `\"` escapes (no-useless-escape) | 2, 1 |
| `src/data/profile.js` | Remove unnecessary `\'` escape in template literal (no-useless-escape) | 1 |
| `src/components/ContentModal.jsx` | Delete (already done) | 4 |
| `.github/workflows/deploy-pages.yml` (repo root) | Add GH Pages CI workflow (config only) | 5 |
| `amplify.yml` | Add Amplify build config (config only) | 5 |
| spec docs / data-conventions note | Document canonical shapes + SPA fallback plan | 3, 5 |

> The modified `package-lock.json` is a side effect of `npm install`
> during the audit. Per owner decision, the updated lockfile is kept.

## Out of scope (explicitly deferred)

- Content modal implementation (next spec).
- Gallery, crafting mode, rendering experience/achievements/credentials/
  events, data-driven About/Contact.
- Any actual deployment to GitHub Pages or AWS Amplify.
- Dependency upgrades / npm-audit remediation.
