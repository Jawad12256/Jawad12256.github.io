# Spec 7 — Media Scroll Fix, About Removal, 3-Column Cards, Icon Buttons

## Introduction

This spec fixes the broken media-pane scroll in the two-column modal,
removes the now-redundant About section, adjusts the card grid to
three-per-row, and replaces raw text link buttons with recognisable
platform icon buttons across the site.

Gallery and Crafting Mode remain on hold.

### Owner-reported items

1. The right-hand media pane in the modal does not scroll; all images/
   videos are compressed into the fixed pane height; captions don't show.
   Media must display at full natural size and the pane must scroll.
2. The About section is heavily redundant (the hero introduction covers
   the same ground). Remove it entirely (including data) and instead
   ensure the first hero introduction paragraph mentions "Design
   Engineering student at Imperial College London" (data mutation
   approved). Change the hero eyebrow from "Design Engineer" to
   "Multidisciplinary Design Engineer".
3. Cards (currently 2-per-row) look too large; resize to 3-per-row
   without breaking margin/padding/width.
4. Buttons throughout the site should use recognisable platform icons
   (e.g. GitHub's cat logo) instead of raw text; where further context
   is needed (e.g. "LinkedIn: Trivyal") add clarifying text next to the
   icon. Icons should match the site's colour scheme and be sourced as
   inline SVGs.

### Root-cause analysis (modal scroll bug)

`.modal__media` is a flex-column child with `overflow-y: auto`, BUT the
`.media-item` figures inside it do NOT have `flex-shrink: 0`, so flex
compresses them to fit the pane height instead of letting them overflow
and trigger a scrollbar. Captions disappear because the figures are
squeezed to near-zero height.

Fix: add `flex-shrink: 0` to `.media-item` inside the media pane so
each figure keeps its natural size, and the pane scrolls its overflow.

---

## Requirements

### Requirement 1 — Fix media pane scroll

**User story:** As a visitor, I want the media pane to scroll so I can
see each image/video at full natural size with its caption.

#### Acceptance criteria

1. WHEN a record has multiple images/videos THEN each SHALL render at
   its full natural size (not compressed) in the right-hand media pane.
2. WHEN media exceeds the pane height THEN the pane SHALL scroll
   vertically to reveal all media.
3. WHEN media items are rendered THEN their captions SHALL be visible
   (not clipped by height compression).
4. WHEN the left text pane is shorter than the right media pane THEN the
   media pane SHALL still scroll independently (not be clipped or
   compressed).

### Requirement 2 — Remove About section and update hero copy

**User story:** As the portfolio owner, I want the redundant About
section gone and the hero updated, so the site reads cleanly without
repetition.

#### Acceptance criteria

1. WHEN the About section is removed THEN there SHALL be no About
   section, no About eyebrow, no About heading, and no About data in
   `profile` remaining in the codebase or rendered on the page.
2. WHEN the hero eyebrow renders THEN it SHALL say "Multidisciplinary
   Design Engineer" (replacing "Design Engineer").
3. WHEN the first hero introduction paragraph renders THEN it SHALL
   mention that the owner is a Design Engineering student at Imperial
   College London (the other paragraphs unchanged).
4. WHEN the About section is removed THEN the nav SHALL NOT include an
   About link (already absent; confirm), and the section eyebrow
   numbering SHALL be renumbered consistently (e.g. 01 // PROJECTS,
   02 // EXPERIENCE, etc.).
5. WHEN About data is removed THEN no other data (profile, projects,
   experience, etc.) SHALL be lost or corrupted.

### Requirement 3 — Three cards per row

**User story:** As a visitor, I want three cards per row so they are
smaller and the layout uses the space efficiently.

#### Acceptance criteria

1. WHEN the project grid and card grid render at desktop width THEN they
   SHALL show three cards per row.
2. WHEN cards are reduced in size THEN their content (hero image, meta,
   title, description, tags) SHALL remain readable.
3. WHEN viewed on narrower viewports THEN the grid SHALL reduce
   gracefully (e.g. 2 → 1 column) with the existing narrow-screen
   behaviour preserved.
4. WHEN the grid is adjusted THEN margins, padding, and page width
   SHALL NOT be broken.

### Requirement 4 — Platform icon buttons

**User story:** As a visitor, I want recognisable platform icons on
buttons, so links are immediately identifiable.

#### Acceptance criteria

1. WHEN a link to a known platform (GitHub, LinkedIn, MakerWorld, email,
   external article, Credly/credential) is rendered THEN it SHALL show
   a recognisable icon for that platform alongside or instead of raw text.
2. WHEN the platform context is ambiguous (e.g. "LinkedIn: Trivyal" vs
   "LinkedIn: Cyphon") THEN the button SHALL include clarifying text
   next to the icon.
3. WHEN icons are added THEN they SHALL be inline SVG components (or
   SVGs imported as React components) so they can be styled with the
   site's CSS tokens (e.g. colour matching `--text-on-accent`,
   `--accent`).
4. WHEN icons are sourced THEN they SHALL be standard/official platform
   marks used within fair-use/brand-guideline norms (no fabricated
   logos); sourced as simple SVG paths from well-known open icon sets or
   the platforms' brand resources.
5. WHEN icon buttons are styled THEN they SHALL match the existing dark/
   technical/minimal design tokens and the accent colour scheme.
6. WHEN icon buttons are used THEN they SHALL apply site-wide: in the
   ContentModal link buttons AND in the Contact section link buttons.

### Requirement 5 — Reuse, consistency and no regression

#### Acceptance criteria

1. WHEN changes are made THEN they SHALL reuse existing CSS/token and
   component architecture; no new runtime dependency without clear
   justification.
2. WHEN implementation is complete THEN `npm run build` (including
   `CI=true`) SHALL succeed with no unresolved imports or assets.
3. WHEN implementation is complete THEN all remaining sections, the
   modal (with working scroll), nav, footer, marquee, and card hero
   images SHALL function correctly.
4. WHEN unrelated backlog items (Gallery, Crafting Mode) are noticed
   THEN they SHALL NOT be implemented here.
