# Spec 10 — Gallery Page

## Introduction

Add a dedicated Gallery page that presents a masonry-style wall of all
images drawn from existing records (no duplicated assets, no separate
gallery dataset). It is reached via a nav link and a "See my Gallery"
button in the hero. Clicking any image opens the existing ContentModal
for that image's parent record. This introduces client-side routing to
the app for the first time.

Crafting Mode remains on hold.

### Owner decisions (confirmed)

- Gallery is a SEPARATE page, with a nav-bar link and a hero "See my
  Gallery" button built from the existing LinkButton/BrandIcon component
  (gallery/pictures icon).
- Routing: use `react-router-dom` (first new runtime dependency).
- Layout: masonry / varied, not a uniform grid.
- Clicking an image opens the EXISTING ContentModal for that image's
  parent record.
- Source: IMAGES ONLY (exclude videos), from EVERY record.
- Captions shown on hover.

### Steering constraints (standing)

- The gallery MUST derive from existing project/experience (and other
  record) images; it MUST NOT duplicate assets or maintain a separate
  manually-curated gallery dataset.

### Authoritative context (verified on current `main`)

- No router installed; `App.js` renders `<AppShell><Home/></AppShell>`.
- ContentModal open/close state is LOCAL to `Home.jsx` (`useState`), so
  a separate Gallery page cannot currently trigger it — modal control
  must be lifted to a shared level (App/context).
- Records live in `src/data/*` and are shaped into ContentItems by
  `src/utils/normaliseContent.js` (projects, experience incl. nested
  sub-projects, achievements, events, credentials). Each image is
  `{ src, alt, caption? }`; videos are detectable via extension (as in
  `MediaItem`/normaliser `isVideo`).
- GitHub Pages serves the SPA; `BrowserRouter` deep links need the
  `404.html` redirect fallback (documented in Spec 1). `HashRouter`
  avoids this entirely.
- `react-router-dom` current major is v7+, but this is a CRA app; v6 is
  the well-supported declarative fit for CRA.

---

## Requirements

### Requirement 1 — Routing and page structure

**User story:** As a visitor, I want a distinct Gallery page with its own
URL, so I can navigate to and share the gallery.

#### Acceptance criteria

1. WHEN routing is added THEN the app SHALL use `react-router-dom` with
   at least two routes: the home page (`/`) and the gallery (`/gallery`).
2. WHEN the home route renders THEN it SHALL show the existing Home page
   unchanged (hero, sections, modal) within the shared AppShell.
3. WHEN the gallery route renders THEN it SHALL show the Gallery page
   within the shared AppShell (nav + footer preserved).
4. WHEN a routing approach is chosen THEN deep-linking to `/gallery`
   SHALL work on GitHub Pages (either via a `404.html` SPA redirect for
   `BrowserRouter`, or by using `HashRouter`); the chosen approach SHALL
   be documented and the Pages fallback (if needed) implemented.
5. WHEN the router version is chosen THEN it SHALL be compatible with
   the existing CRA (`react-scripts`) build (React Router v6).
6. WHEN navigating between pages THEN the nav bar and footer SHALL remain
   present and the correct nav state SHALL be reachable.

### Requirement 2 — Navigation entry points

**User story:** As a visitor, I want obvious ways to reach the gallery,
so I can find it from the nav and the hero.

#### Acceptance criteria

1. WHEN the nav bar renders THEN it SHALL include a link to the Gallery
   page that routes to `/gallery` (client-side navigation, not a full
   reload).
2. WHEN the hero/top section renders THEN it SHALL include a "See my
   Gallery" button built with the existing LinkButton/BrandIcon
   component, using a gallery/pictures icon.
3. WHEN the "See my Gallery" button is activated THEN it SHALL route to
   the Gallery page via client-side navigation.
4. WHEN on the Gallery page THEN there SHALL be a clear way back to the
   home page (e.g. the nav logo/links routing to `/`).
5. WHEN the gallery link/button are added THEN their styling SHALL match
   the existing design tokens and nav/link-button patterns.

### Requirement 3 — Derived image collection (no duplication)

**User story:** As the portfolio owner, I want the gallery to reuse my
existing images automatically, so I don't maintain a separate image set.

#### Acceptance criteria

1. WHEN the gallery builds its image list THEN it SHALL derive the
   images from existing records (projects, experience incl. nested
   sub-projects, achievements, events, credentials) via the data layer —
   NOT from a separate hand-maintained gallery dataset.
2. WHEN the image list is built THEN it SHALL include IMAGES ONLY and
   EXCLUDE videos (using the same video detection as MediaItem).
3. WHEN an image is included THEN it SHALL retain a reference to its
   parent record so clicking it can open that record's ContentModal.
4. WHEN new images are later added to any record THEN they SHALL appear
   in the gallery automatically with NO gallery-specific code change.
5. WHEN assembling the list THEN no asset SHALL be duplicated on disk or
   copied into a gallery-only location.
6. WHEN a record has no images THEN it SHALL simply contribute nothing
   (no errors, no placeholders).

### Requirement 4 — Masonry layout with hover captions

**User story:** As a visitor, I want an attractive varied-height gallery
where I can see each image's caption on hover.

#### Acceptance criteria

1. WHEN the gallery renders THEN images SHALL be presented in a masonry/
   varied-height layout (not a fixed uniform grid), using the existing
   CSS/token architecture (a CSS columns or grid-based masonry, no new
   dependency for layout).
2. WHEN the viewport changes THEN the number of masonry columns SHALL
   adapt responsively (more columns on wide screens, fewer/one on
   mobile).
3. WHEN a visitor hovers an image (pointer devices) THEN that image's
   caption SHALL be shown (e.g. an overlay); WHEN not hovering THEN the
   wall SHALL read cleanly without persistent caption clutter.
4. WHEN on touch devices (no hover) THEN captions SHALL still be
   reasonably accessible (e.g. shown on tap/focus or always-on for
   touch) so the information is not lost — approach chosen in design.
5. WHEN images render THEN each SHALL keep meaningful `alt` text for
   accessibility.
6. WHEN the gallery is large THEN images SHALL use lazy loading to keep
   it performant.

### Requirement 5 — Clicking an image opens the existing ContentModal

**User story:** As a visitor, I want clicking a gallery image to open
the full details of the project/record it belongs to.

#### Acceptance criteria

1. WHEN a gallery image is clicked (or activated via keyboard) THEN the
   EXISTING ContentModal SHALL open showing that image's parent record's
   normalised content.
2. WHEN the modal is opened from the gallery THEN it SHALL be the same
   single ContentModal implementation used elsewhere (no duplicate
   modal) — requiring modal control to be lifted to a shared
   (App/context) level accessible from both Home and Gallery.
3. WHEN the modal is closed from the gallery THEN the visitor SHALL
   remain on the Gallery page with no navigation side effects.
4. WHEN modal control is lifted THEN the Home page's existing
   open-on-card behaviour SHALL continue to work unchanged.
5. WHEN a gallery image belongs to a nested sub-project (e.g. Trivyal/
   Cyphon) THEN clicking it SHALL open the appropriate parent record's
   modal (design decides whether that is the parent experience or the
   sub-project context), without discarding information.

### Requirement 6 — Reuse, consistency, no regression

#### Acceptance criteria

1. WHEN changes are made THEN they SHALL reuse the existing component/
   data/util/CSS architecture; the only new runtime dependency SHALL be
   `react-router-dom` (justified by the separate-page requirement).
2. WHEN implementation is complete THEN `npm run build` (incl. `CI=true`)
   SHALL succeed with no unresolved imports or assets.
3. WHEN implementation is complete THEN the existing Home page, all
   sections, the ContentModal (desktop two-pane + mobile stacked), nav,
   footer, marquee, card heroes and the deploy workflow SHALL remain
   functional.
4. WHEN the dual-host concern is considered THEN the routing choice SHALL
   remain compatible with the GitHub Pages deployment (and the AWS
   Amplify config intent), per the standing hosting constraints.
5. WHEN unrelated backlog items (Crafting Mode) are noticed THEN they
   SHALL NOT be implemented here.

### Requirement 7 — Content accuracy

#### Acceptance criteria

1. WHEN the gallery displays images and captions THEN it SHALL use the
   records' existing alt/caption text; it SHALL NOT invent new captions
   or claims.
2. WHEN an image has a weak placeholder caption (from the earlier media
   sync) THEN it SHALL still be shown as-is (owner refines captions in
   the data, which the gallery reflects automatically).
