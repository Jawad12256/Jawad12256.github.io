# Spec 4 — Top-Section Layout and Card Hero Imagery — Design

## Overview

Four cohesive changes: fix the hero section structure/alignment, make
the marquee a full-width banner above the hero with dividers, add a hero
image per card (with an explicit, owner-approved data-model change), and
move the grids to three-per-row. All within the existing CSS/token
system; no new runtime dependencies.

### Root-cause analysis (verified)

- `.hero` is `display:flex; align-items:center` and has TWO direct
  children in `Home.jsx`: `.container.hero__inner` and the
  `<IdentityMarquee>`. As flex items they sit side-by-side, and a
  `.container` (whose centering relies on `margin-inline:auto` in normal
  block flow) does not center predictably as a flex child. This is why
  the hero content hugs the left (issue 1) and the marquee sits beside
  the paragraph (issue 2).
- `.hero__inner` and `.hero__content` have no CSS at all, so the intended
  photo/content arrangement never materialised.

---

## Change 1 — Restructure the hero (Req 1, 2)

### Markup (Home.jsx)

Move the marquee ABOVE the content container and make the hero a normal
vertical stack rather than a centering flexbox with mixed children:

```jsx
<section className="hero" id="top">
  {/* full-width banner, above everything */}
  <IdentityMarquee items={profile.marqueeItems} />

  <div className="container hero__inner">
    <div className="hero__photo"> ... </div>
    <div className="hero__content"> ... </div>
  </div>
</section>
```

### CSS

```css
.hero {
    /* was: display:flex; align-items:center — removed so children stack
       in normal flow and the .container centers correctly */
    padding-block: 0 var(--space-12);
}

.hero__inner {
    display: flex;
    align-items: center;
    gap: var(--space-10);

    padding-top: var(--space-12);
}

.hero__content {
    /* occupies the remaining column beside the (now smaller) photo */
    flex: 1 1 auto;
}
```

- The `.container` is now the sole centered column holding photo +
  content, so it respects the same left margin as every `Section`
  (Req 1.1, 1.2).
- `.hero__inner` becomes the flex row (photo | content), replacing the
  old mis-scoped flex on `.hero` (Req 1.3).
- Photo keeps the Spec 3 `max-width` cap; `.hero__content` takes the
  rest.
- The old `min-height: calc(100vh - nav)` is dropped/relaxed so the
  layout isn't vertically stretched around a centering flex; a comfy
  top-padding is used instead. (Tunable.)

### Responsive (<=700px)

```css
@media (max-width: 700px) {
    .hero__inner { flex-direction: column; align-items: flex-start; }
}
```
Photo stacks above content on narrow screens (Req 1.4).

---

## Change 2 — Full-width marquee banner (Req 2)

The marquee is now the first child of `.hero` and OUTSIDE `.container`,
so it is already full page width (its own wrapper). Ensure it reads as a
band:

```css
.identity-marquee {
    overflow: hidden;                 /* existing; keeps no h-scroll */
    width: 100%;
    border-block: 1px solid var(--border);
    background: var(--bg-sunken);
    padding-block: var(--space-3);
}
```

- Full-bleed within the hero; sits above the content column (Req 2.1,
  2.2, 2.3).
- `overflow:hidden` + the existing seamless track prevents a horizontal
  scrollbar (Req 2.4).

> Full-bleed note: because the marquee is outside `.container`, it spans
> the hero width naturally. If the hero ever gains horizontal padding,
> the marquee wrapper will use a full-bleed technique (negative margin
> or being a direct section child) to stay edge-to-edge. Verified it is
> a direct child of `.hero` with no horizontal padding on `.hero`.

---

## Change 3 — Marquee dividers + spacing (Req 3)

### Component (IdentityMarquee.jsx)

Render a decorative divider between items. Keep the duplicate-items
approach for seamless looping. Each rendered unit = item + trailing
divider, so the pattern is uniform across the seam (Req 3.4):

```jsx
function IdentityMarquee({ items }) {
    const repeated = [...items, ...items];
    return (
        <div className="identity-marquee" aria-hidden="false">
            <div className="identity-marquee__track">
                {repeated.map((item, i) => (
                    <div className="identity-card" key={`${item}-${i}`}>
                        <span className="identity-card__text">{item}</span>
                        <span className="identity-card__divider"
                              aria-hidden="true">//</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
```

### CSS

```css
.identity-card {
    display: inline-flex;
    align-items: center;
    gap: var(--space-5);              /* generous spacing (Req 3.2) */
    padding-inline: var(--space-3);
    white-space: nowrap;
    color: var(--text-body);
    font-size: var(--text-sm);
}

.identity-card__divider {
    color: var(--accent);             /* distinct from item text */
    font-weight: 600;
    user-select: none;
}
```

- Divider is `//` in the accent token, decorative via `aria-hidden`
  (Req 3.1, 3.3).
- A trailing divider on every item keeps the cadence identical at the
  loop seam (Req 3.4).
- Existing track animation / hover-pause / reduced-motion untouched
  (Req 3.5). The track `gap` from Spec 3 is removed or reconciled so
  spacing is driven by `.identity-card` to keep the -50% math exact.

> Seam math: both halves are identical sequences each ending in a
> divider, so translating -50% lands on an identical boundary — no
> doubled/missing divider.

---

## Change 4 — Hero image per card + data model (Req 4, 7)

### Data-model decision (owner-approved mutation)

Add an explicit, optional `heroImage` to records where a representative
still image exists. Rationale over `images[0]`:
- `morsemaster`'s first image is `code.png` (not a hero) — guessing
  `images[0]` would be wrong.
- Some arrays begin with/contain `.mp4` — a video is a poor card
  thumbnail.
- Explicit is self-documenting and robust.

Shape (reuses the canonical image object):

```js
heroImage: { src: importedAsset, alt: 'Description' }
```

Applied in the data files:
- **Projects:** set `heroImage` to each project's existing hero still
  (cfdHero, megabiteHero, electronicsHero, dataHero, printingHero,
  minecraftHero, splatoonHero; for `morsemaster`, pick an existing
  representative still from its own images — owner to confirm which, no
  borrowing from other records).
- **Achievements:** `uksdc` → uksdcHero, `f1is` → f1isHero,
  `student-robotics` → none (no asset) → image-less card.
- **Experience / Events:** mostly none yet → image-less cards now; add
  `heroImage` later with no code change (Req 4.5). Internship hero added
  when the owner provides it.
- **Credentials:** none by design → image-less cards.

This does NOT discard any existing field; `images` arrays stay intact
for the modal. The `heroImage` is an additional pointer (Req 4.6).

> Alternative considered: a `heroImage` getter in normalisation that
> defaults to the first *image-typed* (non-video) entry. Rejected as the
> primary mechanism because `morsemaster`'s first image still isn't a
> hero; an explicit field is clearer. The normaliser MAY still provide a
> safe fallback (first non-video image) when `heroImage` is absent, but
> will never fabricate.

### Normalisation (utils/normaliseContent.js)

Add `heroImage` to the `ContentItem` shape, populated from
`record.heroImage` when present, else a safe fallback: the first
`images` entry that is NOT a video (via the existing `isVideo` logic),
else `null`. Never borrow across records (Req 7.1).

### Card rendering (Req 4.1, 4.3, 4.4, 4.7)

Both `ProjectCard` and the generic `Card` render a hero image region:

```jsx
{item.heroImage
    ? <img className="card__hero" src={item.heroImage.src}
           alt={item.heroImage.alt} loading="lazy" />
    : <div className="card__hero card__hero--empty" aria-hidden="true" />}
```

- Image-less fallback is a tasteful token-styled block (e.g. subtle
  gradient/`--bg-sunken` with a small monogram or just a flat panel) —
  NOT a broken image, NOT a borrowed one (Req 4.4, 7.2).
- `ProjectCard` currently reads the raw `project`; it will be updated to
  use the normalised item (or passed the `heroImage`) so hero rendering
  is consistent. Click/keyboard → modal behaviour preserved (Req 6.2).

---

## Change 5 — Three cards per row (Req 5)

```css
.project-grid,
.card-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-5);
}

@media (max-width: 1000px) {
    .project-grid, .card-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 700px) {
    .project-grid, .card-grid { grid-template-columns: 1fr; }
}
```

- Three per row at full content width, filling the space (Req 5.1, 5.4).
- Graceful 3 → 2 → 1 reduction (Req 5.3).
- Card internals (hero image on top, then meta/title/desc/tags) adjusted
  so they read well at the narrower three-up width (Req 5.2): hero image
  gets a fixed aspect ratio (e.g. `aspect-ratio: 16/10; object-fit:
  cover;`) so rows stay even regardless of source dimensions.

---

## Styling / consistency (Req 6)

- All CSS in `components.css` using tokens; card hero uses
  `object-fit: cover` + `aspect-ratio` for uniform rows.
- No new dependency.

## Validation plan

1. `npm run build` + `CI=true npm run build` → succeed; asset
   cross-check clean (new `heroImage` imports resolve).
2. Confirm normalisation + modal still work with the added field.
3. Diff review: sections/modal/nav/footer intact; Spec 3 marquee anim /
   branding intact.
4. No live browser here → layout (margin alignment, full-width marquee,
   dividers, 3-up grid, hero images, empty-state cards) verified via code
   + build; owner smoke-test strongly recommended (good Playwright
   candidate). Limitation stated honestly, and the exact sizing values
   (photo cap, grid breakpoints, aspect ratio) flagged as tunable.

---

## Files touched (planned)

| File | Change | Requirements |
|---|---|---|
| `src/pages/Home.jsx` | Move marquee above container; hero structure | 1, 2 |
| `src/components/IdentityMarquee.jsx` | Dividers, item markup | 3 |
| `src/components/ProjectCard.jsx` | Render hero image; use normalised hero | 4, 5, 6.2 |
| `src/components/Card.jsx` | Render hero image + empty-state | 4, 5, 6.2 |
| `src/utils/normaliseContent.js` | Add `heroImage` to ContentItem + fallback | 4.2, 4.6 |
| `src/data/projects.js` | Add `heroImage` fields | 4 |
| `src/data/achievements.js` | Add `heroImage` fields | 4 |
| `src/data/events.js`, `experience.js`, `credentials.js` | `heroImage` where applicable (often none yet) | 4 |
| `src/styles/components.css` | Hero layout, marquee banner/dividers, 3-up grid, card hero/empty-state | 1-5 |

## Out of scope (deferred)

- About/Contact data-driven rewrite and `profile.links`.
- Gallery; Crafting Mode.
- Any redesign beyond the five reported items.
