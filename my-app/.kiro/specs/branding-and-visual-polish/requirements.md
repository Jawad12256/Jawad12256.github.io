# Spec 3 — Browser Branding and Visual Polish

## Introduction

With the content modal and all sections live (Spec 2), this spec
removes the remaining default Create React App branding and addresses a
focused set of visual-polish items that have accumulated in the backlog.
The goal is a professional first impression in the browser tab and on
the page, without starting the larger design overhaul or new features.

### Scope boundaries

In scope:
- Replace the browser tab title ("React App" → "Jawad Uddin").
- Replace the favicon / app icon with the owner-provided cursive-"J"
  mark (accent green on dark), including the PWA manifest icons and
  metadata.
- Update the PWA manifest name/short_name and theme/background colours
  to match the site's identity and design tokens.
- Update the HTML meta description from the CRA placeholder.
- Resize the hero portrait to roughly half its current displayed width
  AND height (about a quarter of the current area), kept proportional.
- Add the missing marquee scroll animation so `IdentityMarquee`
  actually animates (it currently renders static).

Out of scope (deferred to later specs):
- Data-driven rewrite of About/Contact copy and rendering
  `profile.links` (content change — separate spec).
- Gallery feature.
- Crafting Mode.
- A broader visual redesign beyond the two specific polish items above.

### Authoritative context (verified on current `main`)

- `my-app/public/index.html`: `<title>React App</title>`; CRA
  placeholder meta description; favicon/apple-touch reference
  `favicon.ico` / `logo192.png`.
- `my-app/public/manifest.json`: `short_name: "React App"`,
  `name: "Create React App Sample"`, `theme_color: #000000`,
  `background_color: #ffffff`, icons `favicon.ico`, `logo192.png`,
  `logo512.png`.
- `my-app/public/` contains the default CRA `favicon.ico`,
  `logo192.png`, `logo512.png`.
- Hero portrait: rendered in `src/pages/Home.jsx` `.hero__photo`
  (`profile.profilePhoto`); there is currently NO explicit size rule for
  `.hero__photo img` in `src/styles/components.css`.
- Marquee: `.identity-marquee__track` has hover-pause and
  reduced-motion rules but NO `animation` property defined
  (`src/styles/components.css`), so it does not scroll.

### Asset dependency (IMPORTANT)

The new icon is an owner-provided image shown in chat. The agent cannot
extract a chat attachment into a file on disk. Before the icon tasks can
be implemented, the owner must provide the actual image file in the
repository (e.g. committed to `my-app/public/` or `my-app/src/assets/`),
or confirm how it will be supplied. The title/description/manifest-text
changes do not depend on this and can proceed independently.

---

## Requirements

### Requirement 1 — Browser tab title

**User story:** As the portfolio owner, I want the browser tab to show
my name, so that the site looks professional and identifiable.

#### Acceptance criteria

1. WHEN the site loads THEN the browser tab title SHALL read
   "Jawad Uddin" (replacing "React App").
2. WHEN the title is set THEN it SHALL be defined in
   `my-app/public/index.html` `<title>` (the CRA static title source),
   unless a documented reason requires setting it elsewhere.
3. WHEN the title changes THEN no other `index.html` behaviour (root
   div, `%PUBLIC_URL%` references, script injection) SHALL be broken.

### Requirement 2 — Favicon and app icon

**User story:** As the portfolio owner, I want my own cursive-"J" icon
in the browser tab and as the installable app icon, so that the default
React logo no longer represents my site.

#### Acceptance criteria

1. WHEN the owner-provided icon image file is available in the repo THEN
   it SHALL be used to produce the favicon and the manifest app icons.
2. WHEN the site loads THEN the browser tab SHALL display the new icon
   instead of the default React/CRA favicon.
3. WHEN the appropriate icon sizes are generated THEN they SHALL cover
   at least a standard favicon (e.g. 16/32/48 via `favicon.ico` or a PNG
   favicon) and the manifest 192px and 512px icons; the apple-touch icon
   reference SHALL point at a valid icon.
4. WHEN icons are added THEN `index.html` and `manifest.json` references
   SHALL point to files that actually exist with correct paths and
   types (no broken icon links).
5. WHEN the default CRA icon assets are replaced THEN unused default
   assets (`logo192.png`, `logo512.png`, old `favicon.ico`) SHALL be
   removed or replaced, with no dangling references left behind.
6. WHEN the icon source file is NOT yet available THEN the icon-related
   tasks SHALL be clearly blocked/pending rather than fabricated, and
   the non-icon tasks SHALL still be completable.

### Requirement 3 — PWA manifest and metadata

**User story:** As the portfolio owner, I want the installable/app
metadata to reflect my site and its dark theme, so that it is coherent
if installed or previewed.

#### Acceptance criteria

1. WHEN `manifest.json` is updated THEN `name` and `short_name` SHALL
   reflect the site identity (e.g. name "Jawad Uddin — Design Engineer",
   short_name "Jawad Uddin"); exact strings confirmed with the owner.
2. WHEN `manifest.json` theme/background colours are updated THEN they
   SHALL use the site's design tokens (e.g. background `#0a0c10`,
   theme colour `#0a0c10` or the accent `#3ee8a8`), replacing the CRA
   `#000000`/`#ffffff` defaults.
3. WHEN the HTML meta description is updated THEN it SHALL describe the
   portfolio factually (no invented claims) and replace the CRA
   "Web site created using create-react-app" placeholder.
4. WHEN `index.html`'s `theme-color` meta is set THEN it SHALL be
   consistent with the manifest theme colour.

### Requirement 4 — Hero portrait resize

**User story:** As the portfolio owner, I want the hero portrait to be
about half its current size in each dimension, so that it is better
proportioned on the page.

#### Acceptance criteria

1. WHEN the hero renders THEN the portrait SHALL display at roughly half
   its current width AND half its current height (approximately a
   quarter of the current displayed area), kept proportional (no
   distortion/stretching).
2. WHEN the portrait is resized THEN it SHALL be achieved via the
   existing CSS/token architecture in `src/styles/components.css` (a
   constrained `.hero__photo`/`.hero__photo img` rule), not by editing
   the image file.
3. WHEN resized THEN the hero layout SHALL remain coherent and the
   responsive (<=700px) behaviour SHALL remain sensible.
4. WHEN the exact target size is ambiguous THEN a reasonable constrained
   max-width/size SHALL be chosen to meet the "about half" intent, and
   the chosen value SHALL be stated for the owner to fine-tune.

### Requirement 5 — Identity marquee animation

**User story:** As a visitor, I want the identity marquee to scroll, so
that the row of identity tags reads as an intentional animated element
rather than a static list.

#### Acceptance criteria

1. WHEN the marquee renders THEN `.identity-marquee__track` SHALL
   continuously scroll horizontally via a CSS `animation`, looping
   seamlessly (the track already duplicates its items for this purpose).
2. WHEN the user hovers the marquee THEN the existing hover-pause rule
   SHALL still pause the animation.
3. WHEN the user prefers reduced motion THEN the existing
   `prefers-reduced-motion` rule SHALL disable the animation and the
   content SHALL remain readable (static).
4. WHEN the animation is added THEN it SHALL use the existing CSS
   architecture/tokens and SHALL not introduce layout shift or
   horizontal page overflow/scrollbars.

### Requirement 6 — Reuse, consistency and no regression

**User story:** As the portfolio owner, I want these changes to stay
consistent and not break anything, so that the site remains stable.

#### Acceptance criteria

1. WHEN changes are made THEN they SHALL reuse the existing CSS/token
   architecture and file structure; no new runtime dependency SHALL be
   added without clear justification.
2. WHEN implementation is complete THEN `npm run build` (including
   `CI=true`) SHALL succeed with no unresolved imports or assets.
3. WHEN implementation is complete THEN existing functionality (all
   sections, the content modal, navbar anchors, footer) SHALL remain
   intact.
4. WHEN changes are made THEN they SHALL be limited to this spec's
   scope; other backlog items (About/Contact rewrite, Gallery, Crafting
   Mode) SHALL NOT be implemented here.

### Requirement 7 — Content accuracy

**User story:** As the portfolio owner, I want no invented content in
metadata, so that descriptions remain truthful.

#### Acceptance criteria

1. WHEN metadata text (title, description, manifest name) is written
   THEN it SHALL be factual and SHALL NOT invent credentials, roles, or
   claims beyond what the owner has stated.
2. WHEN the owner-provided icon is not yet in the repo THEN no
   substitute icon SHALL be fabricated or generated to stand in for it
   without the owner's explicit agreement.
