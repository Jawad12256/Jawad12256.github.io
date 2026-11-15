# Spec 18 — "Read more" for long modal descriptions

## Introduction

Long description text in the content modal can overwhelm the reader and
push the skills and links out of view. Add a collapsible "Read more…"
affordance (mint accent) that truncates descriptions past a character
threshold and expands on click. Implemented as an opt-in property of the
`Paragraphs` renderer so it applies to the modal descriptions
(project/experience/achievement and the nested sub-projects) but not to
short blocks like the hero intro or contact blurb.

### Owner-requested behaviour

1. Add a **"Read more…"** text button, coloured in the standard
   site-wide mint accent (`--accent`).
2. It applies to every card's (modal's) description text block that
   exceeds a character threshold (threshold is the implementer's call).
3. Below the threshold, the button does NOT appear (text shows in full).
4. Make it a generic property of the relevant React component.

### Authoritative context (verified on current `main`)

- `Paragraphs` (`src/components/Paragraphs.jsx`) renders text (string or
  array) as `<p>` blocks via `toParagraphs`. Used in 4 places:
  - ContentModal main description (the long one — target).
  - ContentModal sub-item description (Trivyal/Cyphon — target).
  - Home hero introduction (short, 3 short paragraphs — NOT a target).
  - Home contact blurb (short — NOT a target).
- Descriptions are multi-paragraph arrays; total length across
  paragraphs is what matters for the threshold.
- Accent token `--accent: #3ee8a8`; `prefers-reduced-motion` respected
  elsewhere.

---

## Requirements

### Requirement 1 — Collapsible long descriptions in the modal

#### Acceptance criteria

1. WHEN a modal description's total text length EXCEEDS a character
   threshold THEN it SHALL render truncated, followed by a "Read more…"
   button.
2. WHEN the total length is at or below the threshold THEN the full text
   SHALL render with NO button.
3. WHEN "Read more…" is clicked/activated THEN the full description
   SHALL expand into view.
4. WHEN expanded THEN a way to collapse again SHALL be provided (e.g.
   the button toggles to "Show less").
5. WHEN truncating THEN it SHALL cut at a sensible boundary (e.g. by
   whole paragraphs and/or a character cap) so truncated text doesn't
   end mid-word awkwardly, and the point is that skills/links below
   remain visible without scrolling past a huge wall of text.

### Requirement 2 — Styling (mint, site-consistent)

#### Acceptance criteria

1. WHEN the "Read more…" / "Show less" button renders THEN its text
   SHALL use the site accent mint (`--accent`), styled as an inline text
   button consistent with the site (not a big pill).
2. WHEN the button is interactive THEN it SHALL be a real `<button>`
   (keyboard-accessible, focusable), with an accessible label.
3. WHEN hovered/focused THEN it SHALL give a subtle affordance (e.g.
   accent-hover colour / underline), consistent with the design.

### Requirement 3 — Generic, opt-in component property

#### Acceptance criteria

1. WHEN the behaviour is implemented THEN it SHALL be a generic opt-in
   prop on the `Paragraphs` component (e.g. `collapsible`), with an
   optional configurable threshold, defaulting to OFF.
2. WHEN `collapsible` is NOT set THEN `Paragraphs` SHALL behave exactly
   as today (hero intro, contact blurb unaffected).
3. WHEN `collapsible` IS set THEN the truncation/expansion behaviour
   SHALL apply per Requirement 1.
4. WHEN the modal renders descriptions (main + sub-item) THEN it SHALL
   use the collapsible mode.

### Requirement 4 — Reuse, consistency, no regression

#### Acceptance criteria

1. WHEN changes are made THEN they SHALL reuse the existing component/
   token architecture; no new dependency.
2. WHEN implementation is complete THEN `npm run build` (incl. `CI=true`)
   SHALL succeed with no unresolved imports.
3. WHEN implementation is complete THEN short-text usages (hero,
   contact) SHALL be unchanged, and the modal SHALL still render all
   content types; expanding/collapsing SHALL not break modal scroll,
   layout, or the two-pane behaviour.
4. WHEN the modal is reopened for a different record THEN the collapsed/
   expanded state SHALL reset appropriately (each description starts
   collapsed if over threshold).
5. WHEN the threshold is defined THEN it SHALL be a clearly-labelled
   value (implementer's choice; expected to trigger for most project
   descriptions).
