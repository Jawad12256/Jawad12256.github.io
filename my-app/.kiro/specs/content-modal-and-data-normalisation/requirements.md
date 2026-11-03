# Spec 2 — Reusable Content Modal and Data Normalisation

## Introduction

With the build green and deployment baseline in place (Spec 1), this
spec builds the first and most important architectural feature named in
the steering: a **single, reusable, centralised content modal** that can
display detailed content for different record types (projects,
experience items, achievements, events), together with the **data
normalisation layer** the modal needs to render those differently-shaped
records through one consistent contract.

This is the keystone for later work: clickable project cards open into
detail, experience and achievements become explorable, and the future
gallery and crafting-mode specs can reuse the same modal rather than
inventing their own.

### Scope boundaries

In scope:
- A normalised "content item" contract and a small adapter layer that
  maps existing data records onto it **without discarding information**.
- One reusable `ContentModal` component used across ALL content types:
  projects, experience, achievements, events and credentials.
- Wiring the existing `ProjectCard` click to open the modal for a
  project.
- Rendering ALL currently-hidden content sections so every record type
  is surfaced and openable: Experience, Achievements, Events and
  Credentials (in addition to the existing Projects grid).

Out of scope (reserved for later specs):
- The gallery feature.
- Crafting Mode.
- A full redesign / the `IdentityMarquee` animation fix (noted for the
  bulk React design spec).
- Routing / deep-linking to a modal via URL.
- Data-driven rewrite of the About/Contact copy (explicitly deferred by
  owner decision).

### Authoritative context (from audit + Spec 1)

- `ContentModal.jsx` was deleted in Spec 1; this spec creates it fresh.
- `ProjectCard` accepts an `onClick` prop but `Home.jsx` does not pass
  one, so cards are not currently clickable.
- Record shapes differ: `projects` have `category/year/type/featured`;
  `experience` have `organisation?/role/period/type` and may nest a
  `projects` array; `achievements` have `award/recognition?`; `events`
  have `shortTitle/role`.
- Image objects follow `{ src, alt, caption? }`; many records
  intentionally have `images: []` and `links: {}` (owner will populate
  later — must remain non-breaking, per Spec 1 data-conventions).
- Design tokens and CSS architecture from `src/styles/` must be reused.

---

## Requirements

### Requirement 1 — Normalised content-item contract

**User story:** As a developer, I want a single normalised shape that
any portfolio record can be adapted to, so that one modal component can
render projects, experience, achievements and events without
type-specific branching everywhere.

#### Acceptance criteria

1. WHEN the normalisation layer is defined THEN it SHALL expose a
   consistent content-item shape covering at least: a stable `id`, a
   `type` discriminator, a `title`, an optional `subtitle`/meta line, a
   short description, a long description, `technologies`/`skills` arrays
   (where applicable), an `images` array of `{ src, alt, caption? }`,
   and a `links` object.
2. WHEN an existing record is adapted THEN no existing field present in
   the source record SHALL be silently discarded; fields that do not map
   onto a core property SHALL be preserved in a documented way (e.g. a
   `meta`/`details` sub-object).
3. WHEN records of different types are adapted THEN type-specific
   attributes (e.g. `award`, `recognition`, `period`, `organisation`,
   `role`) SHALL remain accessible to the modal for display.
4. WHEN a record has `images: []` or `links: {}` THEN the normalised
   item SHALL represent that emptiness faithfully and SHALL NOT fabricate
   content.
5. WHEN the adapter is implemented THEN it SHALL live in the existing
   `src/data/` or `src/utils/` area consistent with project structure,
   and SHALL be covered by the documented data conventions.

### Requirement 2 — Reusable ContentModal component

**User story:** As a visitor, I want to open a detailed view of any
record (project, experience, achievement, event, credential) in a
modal, so that I can explore its description, media and links without
leaving the page.

#### Acceptance criteria

1. WHEN a content item is provided to `ContentModal` and the modal is
   open THEN it SHALL display the item's title, meta/subtitle,
   description, technologies/skills, images and links as applicable.
2. WHEN the content item has no images THEN the modal SHALL render
   cleanly with no image region and no error (empty-content tolerance
   from Spec 1).
3. WHEN the content item has an empty `links` object THEN the modal
   SHALL render no links section and no error.
4. WHEN images are later added to a previously-empty record using the
   canonical `{ src, alt, caption? }` shape THEN the modal SHALL display
   them with NO code change required.
5. WHEN the modal renders images THEN each image SHALL use its `alt`
   text, and a `caption` SHALL be shown only when present.
6. WHEN the modal renders a video asset (e.g. `.mp4` entries already
   present in project images) THEN it SHALL present it appropriately
   rather than as a broken `<img>`.
7. WHEN the modal is a single component THEN there SHALL be exactly one
   modal implementation reused across content types (no per-type
   duplicate modal components), per steering.

### Requirement 3 — Modal interaction and accessibility

**User story:** As a visitor (including keyboard and screen-reader
users), I want the modal to behave correctly and accessibly, so that it
is usable and does not trap or confuse me.

#### Acceptance criteria

1. WHEN the modal is open THEN it SHALL be closable via a visible close
   control, the Escape key, and clicking the backdrop/overlay.
2. WHEN the modal is open THEN it SHALL use appropriate dialog semantics
   (e.g. `role="dialog"`, `aria-modal`, an accessible label).
3. WHEN the modal opens THEN keyboard focus SHALL move into the modal,
   and WHEN it closes THEN focus SHALL return to the triggering element
   where practical.
4. WHEN the modal is open THEN background page scroll SHALL be prevented
   while the modal is visible and restored on close.
5. WHEN no modal is open THEN the modal SHALL not be present/visible in
   the layout.

### Requirement 4 — Project cards open the modal

**User story:** As a visitor, I want to click a project card to see its
full details, so that the project grid becomes explorable.

#### Acceptance criteria

1. WHEN a `ProjectCard` is clicked THEN the content modal SHALL open
   showing that project's normalised content item.
2. WHEN a `ProjectCard` is focused and activated via keyboard
   (Enter/Space) THEN it SHALL open the modal, i.e. the card SHALL be
   keyboard-operable, not click-only.
3. WHEN the modal for a project is open THEN the existing grid and page
   SHALL remain intact behind it and reappear unchanged on close.
4. WHEN project cards are made interactive THEN their existing visual
   design and the design tokens SHALL be preserved.

### Requirement 5 — Experience section rendered and openable

**User story:** As a visitor, I want to see the Experience section
populated and open experience items for detail, so that the currently
empty section becomes useful and demonstrates modal reuse across types.

#### Acceptance criteria

1. WHEN the Experience section renders THEN it SHALL display the
   `experience` records (role, organisation where present, period, type,
   short description) using the existing CSS architecture and tokens.
2. WHEN an experience item is activated THEN the SAME `ContentModal`
   SHALL open showing that item's normalised content.
3. WHEN an experience record nests a `projects` array (e.g. the
   internship's Trivyal/Cyphon) THEN the experience role itself SHALL be
   the first-class entry (with its own hero image where available),
   making clear it was, for example, a software engineering internship;
   AND the nested sub-projects SHALL be presented WITHIN that role's
   modal to convey the technical depth achieved, rather than being
   discarded or promoted to separate top-level entries in the main
   Projects grid.
4. WHEN nested sub-projects are shown within the experience modal THEN
   their own descriptions, technologies, skills and (future) images
   SHALL be representable without discarding information, and empty
   image/link collections on them SHALL remain non-breaking.
5. WHEN the Experience section is added THEN it SHALL NOT alter unrelated
   sections (About, Projects grid, Contact) beyond wiring needed for the
   shared modal.

### Requirement 5a — Page section order and navigation

**User story:** As the portfolio owner, I want the sections to appear in
a specific order and the nav to stay lean, so that the page reads the
way I intend.

#### Acceptance criteria

1. WHEN the Home page renders THEN the sections SHALL appear in this
   order: Hero, About, Projects, Experience, Credentials, Achievements,
   Events, Contact.
2. WHEN the navigation bar renders THEN it SHALL NOT include an "About"
   link; About remains a visible page section but is omitted from the
   nav.
3. WHEN new sections are added to the nav THEN the navigation SHALL be
   kept lean at the implementer's discretion (e.g. a sensible subset or
   grouping of links), and any larger nav redesign beyond that MAY be
   deferred to a future spec.
4. WHEN nav links are present THEN each SHALL anchor-scroll to its
   section, consistent with the existing anchor-link behaviour and the
   existing responsive (<=700px) hiding rules.

### Requirement 6 — Achievements section rendered and openable

**User story:** As a visitor, I want to see the Achievements section and
open each achievement for detail, so that competition results and awards
are visible and explorable.

#### Acceptance criteria

1. WHEN the Achievements section renders THEN it SHALL display the
   `achievements` records (title, category, year, and `award` /
   `recognition` where present) using the existing CSS and tokens.
2. WHEN an achievement is activated THEN the SAME `ContentModal` SHALL
   open showing its normalised content, including its images where
   present (e.g. the F1-in-Schools and UKSDC image sets).
3. WHEN an achievement has `award` and/or `recognition` fields THEN
   those SHALL be displayed (e.g. "National 1st Place", "Quality of
   Visual Communication Award") without being dropped during
   normalisation.
4. WHEN an achievement has an empty `images`/`links` collection (e.g.
   Student Robotics) THEN it SHALL render cleanly, and an external
   `article` link where present SHALL be shown.

### Requirement 7 — Events section rendered and openable

**User story:** As a visitor, I want to see the Events section and open
each event for detail, so that organised/led events are visible.

#### Acceptance criteria

1. WHEN the Events section renders THEN it SHALL display the `events`
   records (title or `shortTitle`, year, `role`, short description)
   using the existing CSS and tokens.
2. WHEN an event is activated THEN the SAME `ContentModal` SHALL open
   showing its normalised content.
3. WHEN an event has `shortTitle` in addition to `title` THEN the
   normalisation SHALL retain both and the UI SHALL use them
   sensibly (e.g. `shortTitle` in compact UI, full `title` in the
   modal).
4. WHEN an event has empty `images`/`links` THEN it SHALL render cleanly
   with no fabricated content.

### Requirement 8 — Credentials section rendered and openable

**User story:** As a visitor, I want to see the Credentials section and
reach verification links, so that certifications are visible and
verifiable.

#### Acceptance criteria

1. WHEN the Credentials section renders THEN it SHALL display the
   `credentials` records (title, issuer, year, category) using the
   existing CSS and tokens.
2. WHEN a credential is activated THEN the SAME `ContentModal` SHALL
   open showing its description, skills and a verification link.
3. WHEN a credential has a `credentialUrl` THEN the modal SHALL expose
   it as an external verification link; the normalisation SHALL map
   `credentialUrl` into the standard `links` representation without
   discarding it.
4. WHEN the credential has no images THEN it SHALL render cleanly, as
   credentials currently carry no image collection.

### Requirement 9 — Reuse, consistency and no regression

**User story:** As the portfolio owner, I want Spec 2 to reuse existing
structure and keep everything working, so that the codebase stays
coherent and the build stays green.

#### Acceptance criteria

1. WHEN components are added THEN they SHALL be functional React
   components using hooks, placed in the existing `components/`,
   `data/`, `utils/`, `styles/` structure.
2. WHEN styles are added THEN they SHALL extend the existing CSS/token
   architecture rather than introducing a parallel styling system, and
   SHALL respect the dark/technical/minimal design direction.
3. WHEN implementation is complete THEN `npm run build` (including
   `CI=true`) SHALL succeed with no unresolved imports or assets.
4. WHEN implementation is complete THEN existing functionality (hero,
   marquee, navbar anchors, project grid appearance, footer) SHALL
   remain intact.
5. WHEN new dependencies are considered THEN none SHALL be added unless
   clearly justified; a dependency-free modal implementation is
   preferred.
6. WHEN unrelated issues are noticed (e.g. the IdentityMarquee animation)
   THEN they SHALL be noted for a future spec, not fixed here.

### Requirement 10 — Content accuracy

**User story:** As the portfolio owner, I want no invented content, so
that the portfolio stays factual.

#### Acceptance criteria

1. WHEN records are normalised and rendered THEN no personal
   achievement, result, technology, date, or contribution SHALL be
   invented or inferred beyond what the source data states.
2. WHEN content is missing (e.g. empty images) THEN it SHALL render as
   absent, never as fabricated placeholder content.
3. IF a normalisation decision would require assuming a fact not present
   in the data THEN the ambiguity SHALL be surfaced to the owner rather
   than guessed.
