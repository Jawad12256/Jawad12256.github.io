# Spec 6 — Content Width, Hero Photo, and Two-Column Modal

## Introduction

This spec corrects the content-width behaviour (content currently reads
as left-locked with excessive blank space on the right), widens the
cards, enlarges the hero photo, adds visible spacing between paragraphs,
and redesigns the content modal into a wider two-column layout with
independently scrollable text and media panes.

Gallery and Crafting Mode remain on hold.

### Owner-reported items (precise intent)

1. The earlier width change was misread: the owner wants LESS empty
   space on the RIGHT, NOT content pinned to the left. Items should not
   be locked to the left edge, and there should not be a large blank
   band on the right. (The left page margin/gutter should remain — only
   the excessive right-side emptiness should go.)
2. Cards are now too narrow (three-per-row from Spec 4 made them thin);
   make them noticeably wider (fewer per row / larger card width).
3. Make the hero photo about 25% larger in BOTH dimensions.
4. Paragraphs in the top section (and generally) should have VISIBLE
   vertical gaps between them, not merely line breaks.
5. Redesign the content modal:
   - It should take up a bit more of the page width.
   - Left side: the main description text, awards/recognition, and
     skills.
   - Right side: the images/videos and their captions.
   - This likely means two separate scrollable panes within one modal
     frame.

### Authoritative context (verified on current `main`)

- `.container` = `width: min(calc(100% - 2rem), var(--content-width))`,
  `margin-inline: auto` (centered). `--content-width: 1280px`.
- `.section__content { max-width: 72ch }` — caps prose well short of the
  container's right edge (primary cause of perceived right-side blank
  space / left-locked feel).
- `.hero h1 { max-width: 960px }`, `.hero__description { max-width:
  72ch }`.
- `.project-grid`, `.card-grid`: `repeat(3, 1fr)` at full width; 2 at
  <=1000px; 1 at <=700px.
- `.hero__photo { max-width: 200px }`, `.hero__photo img { width:100%;
  height:auto }`.
- `<Paragraphs>` renders each paragraph as a `<p>`; there is NO margin
  rule giving space between paragraphs (the global reset zeroes margins).
- ContentModal: single `.modal` (`width: min(100%, 760px)`) with one
  vertical `.modal__body` flow (description, chips, media grid,
  sub-items, links). The whole overlay scrolls; there are no separate
  panes.

---

## Requirements

### Requirement 1 — Content fills width sensibly (fix right-side blank space)

**User story:** As a visitor, I want section content to use the
available width without a large empty band on the right, while still
keeping a normal page margin, so the layout looks balanced rather than
left-locked.

#### Acceptance criteria

1. WHEN sections render on a wide viewport THEN text and cards SHALL
   extend further toward the right so there is no large unused band on
   the right-hand side.
2. WHEN the width is corrected THEN content SHALL NOT appear pinned to
   the far-left edge; the standard left/right page gutter (the
   `.container` margin) SHALL be preserved on both sides.
3. WHEN prose width is adjusted THEN the restrictive `.section__content`
   cap SHALL be raised or removed so section content uses (close to) the
   full content column, while retaining a readable measure where
   appropriate.
4. WHEN the change is applied THEN the layout SHALL remain centered and
   symmetric (balanced left and right gutters), with no horizontal
   overflow.
5. WHEN viewed on smaller viewports THEN responsive behaviour and the
   narrow-screen gutter SHALL remain intact.

### Requirement 2 — Wider cards

**User story:** As a visitor, I want the cards to be wider, so they
don't look thin and cramped.

#### Acceptance criteria

1. WHEN the project grid and card grid render at the normal content
   width THEN cards SHALL be noticeably wider than the current
   three-per-row layout (e.g. two per row at desktop width), making
   better use of the space.
2. WHEN cards are widened THEN their internal layout (hero image, meta,
   title, description, tags) SHALL remain well-proportioned and readable.
3. WHEN viewed on narrower viewports THEN the grid SHALL reduce
   gracefully to a single column, preserving the existing <=700px
   behaviour.
4. WHEN the number of columns changes THEN gaps/spacing SHALL remain
   balanced and the cards SHALL fill the content width.

### Requirement 3 — Larger hero photo

**User story:** As the portfolio owner, I want my hero photo about 25%
larger in both dimensions, so it has more presence.

#### Acceptance criteria

1. WHEN the hero renders THEN the portrait SHALL display approximately
   25% larger in BOTH width and height than its current size (i.e. the
   current ~200px constraint SHALL become ~250px), kept proportional.
2. WHEN enlarged THEN the image SHALL NOT be distorted or stretched.
3. WHEN enlarged THEN the hero layout SHALL remain coherent, and the
   <=700px responsive behaviour SHALL remain sensible.
4. WHEN the exact value is ambiguous THEN ~250px (25% over 200px) SHALL
   be used and stated for the owner to fine-tune.

### Requirement 4 — Visible gaps between paragraphs

**User story:** As a visitor, I want clear vertical spacing between
paragraphs, so multi-paragraph text reads as distinct blocks rather than
run-on lines.

#### Acceptance criteria

1. WHEN multi-paragraph text renders (hero intro, About, modal
   descriptions, etc.) THEN there SHALL be a visible vertical gap
   between consecutive paragraphs (not just a line break).
2. WHEN paragraph spacing is added THEN it SHALL use the existing
   spacing tokens and SHALL be consistent wherever `<Paragraphs>` is
   used.
3. WHEN a single-paragraph block renders THEN it SHALL NOT gain an
   awkward trailing gap that breaks surrounding layout.

### Requirement 5 — Two-column content modal

**User story:** As a visitor, I want the expanded card view to show the
description/awards/skills on the left and the media on the right, in a
wider modal, so I can read and view media side by side.

#### Acceptance criteria

1. WHEN the modal opens on a desktop-width viewport THEN it SHALL occupy
   somewhat more of the page width than the current ~760px (e.g. a
   larger max-width suited to two columns), while retaining a sensible
   maximum and the page backdrop.
2. WHEN the modal renders THEN it SHALL present two columns:
   - LEFT: the title/subtitle (header), main description text, award and
     recognition (where present), issuer/organisation meta (where
     present), and the skills (and technologies where applicable).
   - RIGHT: the images and videos with their captions.
3. WHEN either column's content is taller than the modal THEN that
   column SHALL scroll INDEPENDENTLY within the modal frame (two
   separate scroll areas), rather than the whole page/overlay scrolling
   as one.
4. WHEN a record has NO media THEN the modal SHALL degrade gracefully
   (e.g. the left column uses the full width, or the right pane shows a
   tasteful empty state), without a broken/empty dangling pane.
5. WHEN the record has nested sub-projects (experience) THEN they SHALL
   still be presented coherently within the new layout without being
   discarded (placement to be chosen in design, e.g. within the left
   column or as described).
6. WHEN links are present THEN they SHALL remain accessible within the
   modal (placement chosen in design, e.g. under the left column).
7. WHEN viewed on a narrow viewport THEN the two columns SHALL stack
   into a single scrollable column (responsive fallback), preserving
   readability.
8. WHEN the modal redesign is implemented THEN all existing modal
   behaviour SHALL be preserved: close via button/Escape/backdrop,
   dialog semantics (`role="dialog"`, `aria-modal`, labelled title),
   focus move-in and restore, focus trap, and body scroll-lock.

### Requirement 6 — Reuse, consistency and no regression

**User story:** As the portfolio owner, I want these changes consistent
with the design system and non-breaking.

#### Acceptance criteria

1. WHEN changes are made THEN they SHALL reuse the existing CSS/token,
   component and util architecture; no new runtime dependency SHALL be
   added without clear justification (a dependency-free modal is
   preferred).
2. WHEN the modal is restructured THEN it SHALL still render all content
   types (project, experience, achievement, event, credential) correctly
   from the normalised item, including multi-paragraph descriptions and
   video media.
3. WHEN implementation is complete THEN `npm run build` (including
   `CI=true`) SHALL succeed with no unresolved imports or assets.
4. WHEN implementation is complete THEN all sections, nav anchors,
   footer, marquee, hero images and card hero images SHALL remain
   intact.
5. WHEN unrelated backlog items (Gallery, Crafting Mode) are noticed
   THEN they SHALL NOT be implemented here.

### Requirement 7 — Tunability and honest verification

**User story:** As the portfolio owner, I want sizing values to be easy
to adjust and the verification to be honest about its limits.

#### Acceptance criteria

1. WHEN sizing values are chosen (content width, prose max-width, card
   columns, hero photo size, modal max-width, paragraph gap) THEN they
   SHALL be stated so the owner can fine-tune.
2. WHEN the work is validated THEN it SHALL be acknowledged that
   interactive/visual behaviour (layout widths, independent scroll
   panes, modal responsiveness) is verified via build + code review in
   the absence of a live browser, with an owner smoke-test recommended.
