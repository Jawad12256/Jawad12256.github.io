# Spec 9 — Page Margin, Mobile Modal Stacking, PDF Link — Design

## Overview

Three small, independent changes: widen the page gutter / narrow the
content column (shrinking cards ~5-10%), fix the mobile modal stacking
so media no longer overlaps text, and render PDFs as styled links.
Dependency-free; token/component reuse.

---

## Change 1 — More margin, smaller cards (Req 1)

The `.container` is `width: min(calc(100% - 2rem), var(--content-width))`
centered. Two coordinated tweaks in `base.css`/`tokens.css`:

1. **Narrow the content column** ~5-10%: `--content-width: 1280px` →
   `1180px` (~8% narrower). Because grids are `1fr`-based, every card
   shrinks ~8% and the whole block pulls toward centre (Req 1.2).
2. **Widen the minimum gutter** so there's more edge space before the
   cap kicks in: `.container` width →
   `min(calc(100% - 4rem), var(--content-width))` (2rem each side,
   up from 1rem) (Req 1.1).

- Still centered via `margin-inline:auto`, symmetric gutters, no
  overflow (Req 1.3). Titles and grids share the `.container` column, so
  they stay aligned (Req 1.4).
- On small screens the `calc(100% - 4rem)` still leaves a sensible
  column; if 4rem feels too tight on mobile, the responsive block can
  reduce it — but 2rem total-each-side is fine down to phone widths
  (verify; tunable) (Req 1.5).

> Values (1180px / 4rem) are starting points, stated for owner tuning.

---

## Change 2 — Mobile modal: clean single-column stack (Req 2)

### Diagnosis

The existing `@media (max-width: 860px)` block sets
`.modal__layout { flex-direction: column; overflow-y:auto }` and panes
to `overflow-y: visible`, BUT `.modal__main` and `.modal__media` keep
their desktop `flex: 1.2 1 0` / `flex: 1 1 0`. In a column flex
container those flex-basis/grow values make the items try to share
height and collapse, and combined with `min-height:0` + the media
items' `flex-shrink:0`, the media can render over/under the text
instead of stacking at natural height → the reported overlap.

### Fix (rewrite the 860px block)

```css
@media (max-width: 860px) {
    .modal--split,
    .modal--single {
        width: min(100%, 560px);
    }

    .modal {
        max-height: 90vh;
    }

    /* One scroll area; children stack at natural height */
    .modal__layout {
        flex-direction: column;
        gap: 0;
        overflow-y: auto;
        min-height: 0;
    }

    .modal__main,
    .modal__media {
        flex: 0 0 auto;        /* natural height, no shrink/overlap */
        overflow: visible;      /* no inner scroll; the layout scrolls */
        min-height: 0;
    }

    .modal__media {
        border-left: none;
        border-top: 1px solid var(--border);
    }

    /* media items need not resist shrinking in the stacked flow */
    .modal__media .media-item {
        flex-shrink: 1;
    }
}
```

- `flex: 0 0 auto` on both panes is the key change: each pane takes its
  natural content height and they stack in order — text first, media
  below (Req 2.1, 2.3). The DOM order is already main-then-media, so the
  stack order is correct.
- The single scroll lives on `.modal__layout` (Req 2.2); inner panes
  don't scroll (`overflow: visible`) (Req 2.4).
- Desktop (>860px) rules unchanged → two-pane independent scroll intact
  (Req 2.5).
- Close/focus/scroll-lock/dialog semantics are JS-side and untouched
  (Req 2.6).

> Breakpoint stays 860px (where columns are already too narrow to sit
> side by side). Tunable.

---

## Change 3 — PDF as a styled link (Req 3)

Extend `MediaItem` to detect PDFs and render a link instead of `<img>`.

```jsx
const isPdf = (src) =>
    typeof src === 'string' && src.toLowerCase().includes('.pdf');

// inside MediaItem, before the img branch:
if (isPdf(src)) {
    return (
        <figure className="media-item media-item--doc">
            <a className="media-doc" href={src}
               target="_blank" rel="noreferrer noopener">
                <DocIcon />
                <span>{caption || alt || 'Open document (PDF)'}</span>
                <span className="media-doc__hint">Opens in a new tab</span>
            </a>
        </figure>
    );
}
```

- Generic: ANY `.pdf` entry in any record is handled (Req 3.4).
- Opens in a new tab (Req 3.2); label uses caption/alt (Req 3.3).
- Non-PDF/non-video images unchanged (Req 3.5); video branch unchanged.
- `DocIcon`: reuse the existing inline SVG icon set
  (`ArticleIcon` from `components/icons/BrandIcons.jsx`) rather than a
  new dependency.

### CSS (components.css)

```css
.media-doc {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-5);
    color: var(--text-heading);
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    transition: border-color 150ms ease, background 150ms ease;
}
.media-doc:hover,
.media-doc:focus-visible {
    border-color: var(--accent);
    background: var(--bg-raised-hover);
    outline: none;
}
.media-doc svg { width: 1.5em; height: 1.5em; color: var(--accent); }
.media-doc__hint {
    margin-left: auto;
    color: var(--text-dim);
    font-size: var(--text-xs);
}
.media-item--doc { background: transparent; border: none; }
```

Matches the dark/technical/minimal tokens (Req 3.3).

> The data file keeps the PDF in the `images` array (no data change
> needed) — the renderer now handles it. The data-science entry's
> caption ("Abbreviated version of the project report") becomes the link
> label.

---

## Validation plan

1. `npm run build` + `CI=true npm run build` → succeed; asset check
   clean (PDF import still resolves).
2. Confirm (code/markup): narrower centered column + bigger gutters;
   modal main/media stack with `flex:0 0 auto` on mobile; PDF renders as
   a link (new tab) not an `<img>`.
3. Diff review: sections/modal(desktop)/nav/footer/marquee/heroes
   intact.
4. No live browser → margin, mobile stacking and PDF link verified via
   build + code; owner smoke-test recommended (esp. the mobile modal on
   a real device); sizing values flagged tunable.

---

## Files touched (planned)

| File | Change | Req |
|---|---|---|
| `src/styles/tokens.css` | `--content-width` 1280 → 1180px | 1 |
| `src/styles/base.css` | `.container` gutter 2rem → 4rem total | 1 |
| `src/styles/components.css` | rewrite 860px modal block (flex:0 0 auto stack); `.media-doc` styles | 2, 3 |
| `src/components/MediaItem.jsx` | PDF branch → styled link (new tab) | 3 |

## Out of scope (deferred)

- Gallery; Crafting Mode.
