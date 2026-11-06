# Spec 9 — Page Margin, Mobile Modal Stacking, PDF Link

## Introduction

Three focused changes: increase the page's side margin (with slightly
smaller cards to compensate) to pull titles/cards toward the centre for
readability; fix the mobile modal where media overlaps the text body by
stacking into a single scrollable column; and render the Data Science
PDF as a styled "open in new tab" link instead of a broken image.

Gallery and Crafting Mode remain on hold.

### Owner-reported items

1. Add more left-side (page) margin; to make room, make all cards
   ~5-10% smaller. Intent: push main titles — and the cards aligned with
   them — toward the middle of the page for readability.
2. Mobile: in the content modal on a vertical device, the media
   partially overlaps the text body (description/technologies/skills).
   Fix by using ONE scrollable area on mobile that stacks the text
   section first, then the media section below it (instead of the two
   independent desktop panes).
3. The Data Science PDF (`projectabbreviated.pdf`) renders as a broken
   image. Make it a styled link/button that opens the PDF in a new tab,
   matching the site design.

### Authoritative context (verified on current `main`)

- `.container` = `width: min(calc(100% - 2rem), var(--content-width))`,
  `margin-inline: auto`; `--content-width: 1280px`. The gutter is 1rem
  each side.
- Grids are `repeat(3, 1fr)` (→2 at <=1000px, →1 at <=760px); cards size
  from the container width, so narrowing the content column shrinks them.
- Modal `@media (max-width: 860px)` already sets `.modal__layout` to
  `flex-direction: column` + `overflow-y:auto`, and panes to
  `overflow-y:visible` — BUT `.modal__main`/`.modal__media` keep their
  desktop `flex: 1.2/1 1 0`, so in a column they can collapse/overlap
  rather than stacking at natural height (the reported overlap).
- `.modal__media .media-item { flex-shrink: 0 }` (desktop scroll fix).
- `MediaItem` renders `<video>` for video extensions, else `<img>`.
  A `.pdf` entry (data-science `projectabbreviated.pdf`) therefore
  renders as a broken `<img>`.
- The PDF lives in the project's `images` array.

---

## Requirements

### Requirement 1 — More page margin, slightly smaller cards

**User story:** As a visitor, I want the titles and cards pulled a bit
toward the centre with more breathing room at the page edges, so the
layout reads more comfortably.

#### Acceptance criteria

1. WHEN the page renders on a wide viewport THEN the left (and right)
   page margin SHALL be visibly larger than the current ~1rem gutter,
   pulling section titles and the card grids inward toward the centre.
2. WHEN the margin is increased THEN the overall content column SHALL be
   ~5-10% narrower, making the cards correspondingly ~5-10% smaller.
3. WHEN the content width changes THEN the layout SHALL remain centered
   and symmetric (left and right gutters equal), with no horizontal
   overflow.
4. WHEN titles and cards are aligned THEN they SHALL continue to share
   the same left edge (the `.container` column), i.e. titles stay
   aligned with the grid beneath them.
5. WHEN viewed on smaller/mobile viewports THEN the existing responsive
   behaviour SHALL remain intact (the change SHALL not reduce usable
   width awkwardly on small screens).

### Requirement 2 — Mobile modal stacks into one scrollable column

**User story:** As a mobile visitor, I want the modal's text and media
to stack cleanly in one scroll area, so media never overlaps the text.

#### Acceptance criteria

1. WHEN the modal is viewed on a narrow/vertical viewport THEN the text
   section (description, technologies, skills, sub-items, links) SHALL
   appear FIRST, and the media section SHALL appear BELOW it.
2. WHEN stacked on mobile THEN there SHALL be a SINGLE scrollable area
   for the whole modal body (not two independent scroll panes).
3. WHEN stacked on mobile THEN the media SHALL NOT overlap or sit on top
   of the text body; each section SHALL occupy its own vertical space at
   natural height.
4. WHEN stacked on mobile THEN media items SHALL display at a sensible
   size for the viewport and the whole modal SHALL scroll to reveal all
   content.
5. WHEN returning to desktop width THEN the existing two-column
   independent-scroll behaviour SHALL be preserved.
6. WHEN the modal is stacked THEN all existing behaviour (close via
   button/Escape/backdrop, focus handling, dialog semantics) SHALL
   remain intact.

### Requirement 3 — Data Science PDF as a styled link

**User story:** As a visitor, I want the project report PDF to open in a
new tab via a clear button, rather than appearing as a broken image.

#### Acceptance criteria

1. WHEN a media entry references a PDF (`.pdf`) THEN it SHALL NOT be
   rendered as an `<img>` (which breaks); instead it SHALL render a
   styled link/button.
2. WHEN the PDF link is clicked THEN the PDF SHALL open in a new browser
   tab (`target="_blank"`, `rel="noreferrer noopener"`).
3. WHEN the PDF link renders THEN it SHALL be styled consistently with
   the site's design tokens (e.g. like the existing media figure or a
   document/link button), and SHALL use the entry's caption/alt as its
   visible label where appropriate.
4. WHEN the PDF handling is added THEN it SHALL be generic (any `.pdf`
   entry in any record's images is handled), not hard-coded to the Data
   Science project.
5. WHEN a non-PDF, non-video image is rendered THEN its existing
   behaviour SHALL be unchanged.

### Requirement 4 — Reuse, consistency, no regression

#### Acceptance criteria

1. WHEN changes are made THEN they SHALL reuse existing CSS/token and
   component architecture; no new runtime dependency.
2. WHEN implementation is complete THEN `npm run build` (incl. `CI=true`)
   SHALL succeed with no unresolved imports or assets.
3. WHEN implementation is complete THEN all sections, the modal (desktop
   two-pane scroll AND mobile stacked scroll), nav, footer, marquee and
   card heroes SHALL function.
4. WHEN sizing values are chosen (margin/content width, mobile
   breakpoints, PDF button style) THEN they SHALL be stated so the owner
   can fine-tune.
5. WHEN unrelated backlog items (Gallery, Crafting Mode) are noticed
   THEN they SHALL NOT be implemented here.
