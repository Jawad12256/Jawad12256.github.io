# Spec 4 — Top-Section Layout and Card Hero Imagery

## Introduction

This spec fixes a set of layout problems in the hero/top section and the
card grids, and introduces a hero image per card so the main page is
more visual. These are presentation/layout concerns plus one deliberate,
owner-approved data-model change to support per-card hero images.

### Owner-reported issues being addressed

1. Everything above the About section (hero photo + short description)
   is pinned to the far left instead of respecting the page's left
   margin like the rest of the site.
2. The Identity Marquee sits side-by-side with the description
   paragraph; it should span the full page width and sit above the rest
   of the top section.
3. The marquee has no visual dividers between items, hurting
   readability; it needs a divider (e.g. `//` or `•`) and generous
   spacing.
4. Cards should show a hero image (one per card) on the main page. The
   owner has explicitly approved mutating the data model if that is the
   most sensible way to support this.
5. Cards are slightly too wide: the content width fits ~2¾ cards per
   row, leaving awkward blank space. Cards should be sized so three fit
   per row, using the space more efficiently.

### Authoritative context (verified on current `main`)

- `src/pages/Home.jsx` hero: `<section class="hero">` contains
  `<div class="container hero__inner">` (photo + content) AND the
  `<IdentityMarquee>` as a SECOND direct child of `.hero`.
- `.hero` is `display:flex; align-items:center`. `.hero__inner` and
  `.hero__content` have NO CSS rules. As flex children of `.hero`, the
  `.container` and the marquee are laid out side-by-side, and the
  `.container` margin behaviour is disrupted — this is the root cause of
  issues 1 and 2.
- `.container` provides the standard centered column with left/right
  margins used by every `Section`.
- `IdentityMarquee` renders items twice for a seamless scroll; items are
  plain `.identity-card` divs with no separators.
- `.project-grid` and `.card-grid` are
  `grid-template-columns: repeat(2, 1fr)` (two per row).
- Projects: each has an images array whose first entry is generally a
  hero image (exception: `morsemaster` first image is `code.png`, not a
  hero; some projects include `.mp4` entries). Achievements: `uksdc`,
  `f1is` have hero images; `student-robotics` has `images: []`.
  Experience: several `images: []` (owner will add later, incl. the
  internship hero). Events: one empty. Credentials: no images by design.

---

## Requirements

### Requirement 1 — Top section respects the page margin

**User story:** As a visitor, I want the hero content to align with the
same left margin as the rest of the site, so that the top of the page
looks intentional and consistent.

#### Acceptance criteria

1. WHEN the hero renders THEN the photo, eyebrow, heading and
   description SHALL align to the same left edge / content column used by
   every other `Section` (the `.container` width and margins), not pinned
   to the far-left viewport edge.
2. WHEN the hero layout is corrected THEN it SHALL NOT rely on
   `.container` being a flex child of a `display:flex` hero in a way that
   breaks its centering; the structure SHALL be adjusted so the content
   column is honoured.
3. WHEN corrected THEN the hero SHALL remain vertically reasonable
   (it MAY keep a tall/initial-viewport feel) without reintroducing the
   alignment bug.
4. WHEN viewed at <=700px THEN the hero SHALL remain coherent and
   readable.

### Requirement 2 — Identity Marquee spans full width, above the top section

**User story:** As a visitor, I want the identity marquee to span the
full page width and sit above the hero content, so that it reads as a
distinct banner rather than a column beside the paragraph.

#### Acceptance criteria

1. WHEN the top section renders THEN the Identity Marquee SHALL span the
   full page width (edge to edge, or an intentional full-bleed band),
   NOT constrained into a column beside the description.
2. WHEN the top section renders THEN the marquee SHALL be positioned
   ABOVE the hero photo/heading/description block.
3. WHEN the marquee is full-width THEN it SHALL NOT be a flex sibling
   competing with the hero content column; the hero content SHALL
   occupy the normal content column beneath it.
4. WHEN the marquee spans full width THEN it SHALL NOT introduce a
   horizontal page scrollbar.

### Requirement 3 — Marquee item dividers and spacing

**User story:** As a visitor, I want clear separation between marquee
items, so that the identity tags are easy to read.

#### Acceptance criteria

1. WHEN the marquee renders THEN consecutive items SHALL be visually
   separated by a divider (e.g. `//` or `•`).
2. WHEN items are separated THEN there SHALL be generous, consistent
   spacing around each item and divider.
3. WHEN the divider is added THEN it SHALL be styled distinctly from the
   item text (e.g. using the accent or dim token) and SHALL be
   decorative (not read as a separate interactive item).
4. WHEN the marquee loops THEN the divider pattern SHALL remain
   consistent across the seam (no doubled or missing divider at the loop
   point).
5. WHEN the divider is implemented THEN it SHALL NOT break the existing
   seamless scroll, hover-pause, or reduced-motion behaviour.

### Requirement 4 — Hero image per card (data model + rendering)

**User story:** As a visitor, I want each card on the main page to show
a representative image, so that the page is more visual and scannable.

#### Acceptance criteria

1. WHEN a card renders THEN it SHALL display a single hero image
   representative of that record, where one is available.
2. WHEN hero images are supported THEN the data model MAY be mutated to
   make the hero image explicit (e.g. a dedicated `heroImage` field, or
   a documented convention that a record's hero is its first image)
   rather than relying on fragile `images[0]` guessing; the chosen
   approach SHALL be documented and applied consistently.
3. WHEN a record's first/only media is a video or is unsuitable as a
   thumbnail (e.g. `morsemaster`), THEN the hero image selection SHALL
   still yield a sensible still image (not a broken/again-video
   thumbnail), or SHALL fall back gracefully.
4. WHEN a record has NO image yet (e.g. several experience items,
   `student-robotics`, one event, all credentials) THEN the card SHALL
   render cleanly WITHOUT a broken image — using a tasteful
   image-less/placeholder treatment consistent with the design tokens,
   and SHALL NOT fabricate or borrow an unrelated image.
5. WHEN images are later added to a currently-empty record (e.g. the
   internship hero) using the established image shape THEN the card
   hero SHALL pick it up with NO further code change.
6. WHEN the data model is mutated THEN existing information SHALL NOT be
   discarded; the normalisation layer and the ContentModal SHALL
   continue to work with the updated shape.
7. WHEN a hero image is shown THEN it SHALL have meaningful alt text
   derived from the record.

### Requirement 5 — Card grid shows three per row

**User story:** As a visitor, I want three cards per row, so that the
content area is used efficiently without large blank gaps.

#### Acceptance criteria

1. WHEN the project grid and the generic card grid render at the normal
   content width THEN they SHALL display three cards per row.
2. WHEN cards are resized to fit three per row THEN their internal layout
   (hero image, meta, title, description, tags) SHALL remain readable and
   not overflow or clip.
3. WHEN viewed on narrower viewports THEN the grid SHALL reduce
   gracefully (e.g. two per row, then one per row) using sensible
   breakpoints; the existing <=700px single-column behaviour SHALL be
   preserved or improved.
4. WHEN the grid is three-per-row THEN spacing/gaps SHALL look balanced
   and the cards SHALL fill the content width without the previous
   "~2¾ cards" blank space.

### Requirement 6 — Reuse, consistency and no regression

**User story:** As the portfolio owner, I want these changes to stay
consistent with the design system and not break existing behaviour.

#### Acceptance criteria

1. WHEN changes are made THEN they SHALL reuse the existing CSS/token
   architecture and component/data/util structure; no new runtime
   dependency SHALL be added without clear justification.
2. WHEN the card components change THEN clicking/keyboard-activating a
   card SHALL still open the shared ContentModal with that record's
   content (Spec 2 behaviour preserved).
3. WHEN implementation is complete THEN `npm run build` (including
   `CI=true`) SHALL succeed with no unresolved imports or assets.
4. WHEN implementation is complete THEN all sections, the modal, nav
   anchors and footer SHALL remain intact; the marquee animation, hover
   pause and reduced-motion from Spec 3 SHALL remain working.
5. WHEN unrelated backlog items (About/Contact rewrite, Gallery,
   Crafting Mode) are noticed THEN they SHALL NOT be implemented here.

### Requirement 7 — Content accuracy

**User story:** As the portfolio owner, I want no invented or misused
imagery, so that the portfolio stays truthful.

#### Acceptance criteria

1. WHEN hero images are assigned THEN each SHALL be an existing asset
   genuinely belonging to that record; no image SHALL be borrowed from
   an unrelated record to fill a gap.
2. WHEN a record has no suitable image THEN the gap SHALL be handled with
   an image-less treatment, never by fabricating or substituting
   content.
