# Spec 6 — Content Width, Hero Photo, and Two-Column Modal — Design

## Overview

Five changes: fix the right-side blank space (let content fill the
column, keep symmetric gutters), widen cards, enlarge the hero photo,
add visible paragraph spacing, and rebuild the modal as a wider
two-pane layout with independently scrolling text and media columns.
All within the existing token/component system; dependency-free.

### Root-cause note on the width issue

The earlier Spec 5 change widened `--content-width` but LEFT
`.section__content { max-width: 72ch }` in place. The `.container` is
centered (`margin-inline:auto`), so the gutters are already symmetric —
the real problem is that section PROSE is capped at ~72ch and sits
left-aligned inside a much wider container, which reads as "left-locked
with a big right gap." The fix is to let section content use (close to)
the full container width, not to touch the left margin.

---

## Change 1 — Content fills the column (Req 1)

`components.css`:

```css
.section__content {
    /* was: max-width: 72ch — caused the left-locked look.
       Let content use the full container column. A large upper bound
       keeps an extreme measure from ever occurring on ultra-wide. */
    max-width: 100%;
}
```

- The `.container` keeps `margin-inline:auto` and the
  `calc(100% - 2rem)` gutter, so both side margins remain and the layout
  stays centered/symmetric (Req 1.2, 1.4, 1.5).
- Grids already use `max-width:none`, so they already fill the column;
  this change makes the text sections match, removing the right-side gap
  (Req 1.1, 1.3).

> `--content-width` stays 1280px (symmetric gutters at that width look
> balanced; tunable). The perceived imbalance was the prose cap, now
> removed.

> For long prose specifically (About, Contact), full-width lines on a
> 1280px column could get long. Mitigation: these particular prose
> blocks MAY keep a generous readable cap (e.g. ~90ch) rather than 72ch,
> so they are clearly wider than before without an unreadable measure.
> Card grids and the hero are unaffected. Final values stated for tuning.

---

## Change 2 — Wider cards (Req 2)

`components.css` — reduce columns so cards are wider:

```css
.project-grid,
.card-grid {
    grid-template-columns: repeat(2, 1fr);  /* was repeat(3, 1fr) */
    gap: var(--space-5);
}

@media (max-width: 760px) {
    .project-grid, .card-grid { grid-template-columns: 1fr; }
}
```

- Two per row at desktop → noticeably wider cards filling the 1280px
  column (Req 2.1, 2.4).
- Remove the old `@media (max-width:1000px)` 2-col rule (now the default)
  and keep a single-column fallback for narrow screens (Req 2.3).
- Card internals unchanged; hero image `aspect-ratio` keeps rows even
  (Req 2.2).

---

## Change 3 — Larger hero photo (Req 3)

```css
.hero__photo {
    max-width: 250px;   /* was 200px → ~25% larger in both dimensions */
}
/* .hero__photo img stays width:100%; height:auto (proportional) */
```

25% over 200px = 250px; `height:auto` keeps it proportional (Req 3.1,
3.2). Tunable (Req 3.4).

---

## Change 4 — Visible paragraph gaps (Req 4)

The global reset zeroes `<p>` margins and `<Paragraphs>` adds none.
Add spacing between adjacent paragraphs. Scope it so it applies wherever
`<Paragraphs>` renders without affecting single-paragraph blocks'
surrounding layout:

```css
/* paragraphs rendered by <Paragraphs> */
.hero__description + .hero__description,
.modal__description + .modal__description,
.section__content p + p,
.modal__subitem-desc + .modal__subitem-desc {
    margin-top: var(--space-4);
}
```

> Cleaner alternative (chosen): give `<Paragraphs>` a wrapper or a
> shared `.prose` class so a single rule `.prose p + p { margin-top }`
> covers all cases. Design decision: add an optional wrapping behaviour
> or a shared paragraph class applied by `<Paragraphs>` so spacing is
> consistent everywhere it is used (Req 4.2), and `p + p` ensures only
> BETWEEN paragraphs (no trailing gap) (Req 4.3). Implementation will
> use the `p + p` adjacency approach to avoid trailing-gap issues.

---

## Change 5 — Two-column modal (Req 5, 6)

### Layout structure

Rebuild `.modal` as a bounded-height frame containing a header and a
two-column body; each column scrolls independently.

```
.modal (max-height ~85vh, display:flex column, overflow:hidden)
  .modal__close
  .modal__layout (flex row, min-height:0, flex:1)       <-- fills frame
    .modal__main   (left, flex ~1.2, overflow-y:auto)    <-- scroll pane
       header (title + subtitle)
       meta lines (award/recognition/issuer/organisation)
       description (Paragraphs)
       technologies chips, skills chips
       sub-items ("Projects within this role")
       links
    .modal__media  (right, flex ~1, overflow-y:auto)     <-- scroll pane
       images/videos + captions (stacked)
       OR empty-state when no media
```

### Key CSS

```css
.modal {
    width: min(100%, 1100px);     /* wider than the old 760px */
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;             /* panes scroll, not the frame */
}

.modal__layout {
    display: flex;
    gap: var(--space-8);
    min-height: 0;                /* allow children to shrink + scroll */
    flex: 1 1 auto;
}

.modal__main,
.modal__media {
    overflow-y: auto;
    min-height: 0;
}

.modal__main  { flex: 1.2 1 0; }
.modal__media { flex: 1 1 0; }
```

- Two independent scroll areas inside one bounded modal (Req 5.1, 5.2,
  5.3). The overlay no longer needs to scroll the whole modal; the
  `.modal-overlay` can keep `overflow-y:auto` as a safety net but the
  modal is height-bounded.
- `min-height: 0` on flex children is the crucial bit that makes
  `overflow-y:auto` actually scroll inside a flex column (otherwise flex
  items refuse to shrink below content size).

### Content placement (ContentModal.jsx)

- LEFT (`.modal__main`): header (title/subtitle), `MetaLines`
  (award/recognition/issuer/organisation), `Paragraphs` description,
  Technologies + Skills chips, the sub-items section, and the links.
  (Req 5.2 left; 5.5 sub-items; 5.6 links.)
- RIGHT (`.modal__media`): the main record's `images` mapped through
  `MediaItem`, PLUS each sub-project's images aggregated below, grouped
  under a small per-sub-project heading so it is clear which project
  each image belongs to. (Req 5.2 right; sub-project media.)
- LEFT sub-projects therefore render TEXT ONLY (title, description,
  technologies, skills, links) — their media moves to the right pane.

### No-media graceful degradation (Req 5.4)

- If `item.images` is empty AND no sub-item media: render the modal as a
  single column (hide the right pane; `.modal__main` spans full width),
  via a conditional class, so there is no empty dangling pane.
- If media exists, the right pane shows it; captions via MediaItem's
  `<figcaption>`.

### Responsive (Req 5.7)

```css
@media (max-width: 860px) {
    .modal { width: min(100%, 560px); max-height: 90vh; }
    .modal__layout { flex-direction: column; }
    /* stacked: the whole modal body becomes one scroll area */
    .modal__main, .modal__media { overflow: visible; }
    .modal__layout { overflow-y: auto; min-height: 0; }
}
```

Columns stack into a single scrollable column on narrow screens.

### Preserved behaviour (Req 5.8, 6.2)

- Keep the portal, `role="dialog"`, `aria-modal`, `aria-labelledby`,
  close via button/Escape/backdrop, focus move-in + restore, focus trap,
  and body scroll-lock exactly as today — only the inner layout changes.
- All content types still render from the normalised item; multi-
  paragraph descriptions (via `<Paragraphs>`) and video (via `MediaItem`)
  continue to work.

> Nested sub-projects (owner decision): ALL text is on the left, ALL
> media on the right. So each sub-project's TEXT (title, description,
> technologies, skills, links) renders in the LEFT column under
> "Projects within this role", while each sub-project's IMAGES/VIDEOS
> are aggregated into the RIGHT media pane alongside the main record's
> media. To avoid ambiguity about which project an image belongs to,
> sub-project media in the right pane is grouped/labelled by
> sub-project title (e.g. a small heading above that sub-project's
> media group). Nothing is discarded.

---

## Styling / consistency (Req 6)

- All new styles in `components.css` using tokens; no new dependency.
- Media pane figures reuse existing `.media-item` styling.

## Validation plan

1. `npm run build` + `CI=true npm run build` → succeed; asset check
   clean.
2. Confirm modal renders two panes for a media-rich record (e.g.
   morsemaster/megabite), single column for a media-less one (e.g. a
   credential), and stacks on narrow width.
3. Confirm preserved a11y/behaviour (close paths, focus, scroll-lock).
4. Diff review: sections/nav/footer/marquee/hero + card hero intact;
   paragraph gaps visible; cards two-up; photo larger.
5. No live browser here → widths, independent scroll panes and modal
   responsiveness verified via build + code; owner smoke-test
   recommended; all sizing values flagged as tunable.

---

## Files touched (planned)

| File | Change | Requirements |
|---|---|---|
| `src/styles/components.css` | section width, 2-col grids, hero photo 250px, paragraph gaps, full modal two-pane layout + responsive | 1-5 |
| `src/components/ContentModal.jsx` | Restructure into header + `.modal__layout` (`.modal__main` / `.modal__media`); conditional single-column when no media | 5, 6.2 |
| (`src/styles/tokens.css`) | only if a content-width tweak is needed (likely unchanged) | 1 |

## Out of scope (deferred)

- Gallery; Crafting Mode.
- Any content/data changes (this is layout/presentation only).
