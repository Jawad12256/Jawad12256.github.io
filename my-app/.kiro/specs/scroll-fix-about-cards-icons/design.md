# Spec 7 — Media Scroll Fix, About Removal, 3-Col Cards, Icon Buttons — Design

## Overview

Four changes: fix the media-pane scroll/compression bug, remove the
redundant About section (+ hero copy tweaks), move cards to three-per-
row, and add platform icon buttons site-wide. Dependency-free; reuses
existing tokens/components.

---

## Change 1 — Fix media pane scroll and compression (Req 1)

### Diagnosis

`.modal__media` is `display:flex; flex-direction:column; overflow-y:auto`
and its children (`.media-item` figures) have no `flex-shrink` override.
Flex defaults each item to `flex-shrink: 1`, so when total media height
exceeds the pane, flex SHRINKS the figures to fit instead of letting the
pane overflow-scroll. That both compresses the images and hides captions
(figures squeezed to near-zero).

### Fix (components.css)

```css
/* Inside the scrolling media pane, figures keep their natural size so
   the pane scrolls its overflow instead of compressing items. */
.modal__media .media-item {
    flex-shrink: 0;
}
```

- With `flex-shrink: 0`, each figure keeps its intrinsic (image-driven)
  height; cumulative overflow triggers the pane's `overflow-y: auto`
  scrollbar (Req 1.1, 1.2, 1.4).
- Captions reappear because figures are no longer squeezed (Req 1.3).
- `.media-item__media { width:100%; height:auto }` already preserves
  aspect ratio; videos likewise.
- Verify `.modal__media` retains `overflow-y:auto` + `min-height:0`
  (already present) so the pane itself can scroll within the bounded
  modal.

> Also sanity-check the LEFT pane: `.modal__main` uses the same pattern
> and is fine (its content is text, which wraps rather than compresses),
> but it keeps `overflow-y:auto` + `min-height:0` so it scrolls
> independently too.

---

## Change 2 — Remove About, update hero copy (Req 2)

### Data (profile.js)

- Remove the `about` field entirely (no dangling data) (Req 2.1, 2.5).
- Change `title: 'Design Engineer'` → `'Multidisciplinary Design
  Engineer'` (this feeds the hero eyebrow) (Req 2.2).
- First `introduction` paragraph: reword so it states he is a Design
  Engineering student at Imperial College London, keeping the playful
  tone and the age. Draft (owner may fine-tune):
  `"I'm a ${age}-year-old Design Engineering student at Imperial College
  London who loves to build cool stuff, learn cool stuff, and teach cool
  stuff."` — paragraphs 2 and 3 unchanged (Req 2.3).

> Accuracy: "Design Engineering student at Imperial College London" is
> already stated elsewhere in the data (About + experience), so this is
> not a new claim — it is consolidating existing, true info.

### Rendering (Home.jsx)

- Delete the entire About `<Section>` block and its `profile.about`
  usage (Req 2.1).
- Renumber the remaining section eyebrows so they are sequential:
  01 // PROJECTS, 02 // EXPERIENCE, 03 // CREDENTIALS,
  04 // ACHIEVEMENTS, 05 // EVENTS, 06 // CONTACT (Req 2.4).
- Nav already has no About link (confirm) (Req 2.4).

---

## Change 3 — Three cards per row (Req 3)

```css
.project-grid,
.card-grid {
    grid-template-columns: repeat(3, 1fr);  /* from 2 */
}

/* responsive: 3 -> 2 -> 1 */
@media (max-width: 1000px) {
    .project-grid, .card-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 760px) {
    .project-grid, .card-grid { grid-template-columns: 1fr; }
}
```

- `.container` margins/width untouched, so no gutter/padding regression
  (Req 3.4). Card internals already scale; hero aspect-ratio keeps rows
  even (Req 3.2). Graceful 3→2→1 (Req 3.3).

---

## Change 4 — Platform icon buttons (Req 4)

### Approach: inline SVG icon components (no dependency)

Create a small set of inline SVG React components that inherit
`currentColor`, so they style with the site tokens. Source: simple,
widely-used brand glyph paths (e.g. from Simple Icons, an open
CC0-licensed icon set) — standard official marks, not fabricated
(Req 4.4).

New file: `src/components/icons/BrandIcons.jsx` exporting:
- `GitHubIcon`, `LinkedInIcon`, `MakerWorldIcon` (or a generic cube/
  print glyph if a clean MakerWorld mark isn't available — fall back to
  a tasteful generic "external" icon rather than a fabricated logo),
  `EmailIcon` (envelope), `ArticleIcon`/`ExternalIcon` (generic link/
  document), `CredentialIcon` (badge/verified glyph).
- Each is an inline `<svg>` with `fill="currentColor"` (or stroke),
  `width/height: 1em`, `aria-hidden="true"` (label comes from button
  text / aria-label).

> Licensing note: Simple Icons ships CC0 brand glyphs; using the path
> data is standard practice. Marks are used only to identify the linked
> platform (nominative use). If a specific mark (e.g. MakerWorld) isn't
> cleanly available, a neutral generic icon is used rather than inventing
> a logo.

### Link-key → icon + label mapping

Centralise in the existing link-key handling (ContentModal already has
`LINK_LABELS`). Extend to a map of `{ icon, label, showLabel }`:

| key | icon | label | showLabel? |
|---|---|---|---|
| github | GitHub | "GitHub" | icon only (aria-label "GitHub") |
| linkedin | LinkedIn | "LinkedIn" | icon only |
| makerworld | MakerWorld/generic | "MakerWorld" | icon only |
| email | Email | "Email" | icon only |
| article | Article/external | "Read article" | icon + short text |
| credential | Credential/badge | "Verify credential" | icon + text |
| linkedinTrivyal | LinkedIn | "Trivyal" | icon + text (clarify) |
| linkedinCyphon | LinkedIn | "Cyphon" | icon + text (clarify) |

- Ambiguous keys (linkedinTrivyal/linkedinCyphon) show the LinkedIn icon
  PLUS clarifying text (Req 4.2).
- Icon-only buttons still carry an `aria-label` for accessibility.

### Shared button component

Introduce `src/components/LinkButton.jsx` used by BOTH the modal
(`LinksList`) and the Contact section, so icon buttons are consistent
site-wide (Req 4.6):

```jsx
<LinkButton href={url} platform={key} />   // resolves icon + label
```

- Renders `<a class="link-button"> <Icon/> {label?} </a>` with
  `target`/`rel` for external, `mailto:` for email.
- Styling: pill using `--accent` background + `--text-on-accent`, icon
  sized `1em`, matches existing `.modal__link`/`.contact-link` look
  (Req 4.3, 4.5). Replaces the current text-only buttons.

### CSS

```css
.link-button {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: var(--accent);
    color: var(--text-on-accent);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    font-weight: 600;
}
.link-button:hover { background: var(--accent-hover); }
.link-button svg { width: 1em; height: 1em; }
```

- Contact section and modal both switch to `LinkButton`; old
  `.modal__link` / `.contact-link` styles retired or aliased.

---

## Consistency / no regression (Req 5)

- New files: `components/icons/BrandIcons.jsx`, `components/
  LinkButton.jsx`. No runtime dependency (hand-inlined SVG paths).
- ContentModal `LinksList` and Home Contact links refactored to use
  `LinkButton`.

## Validation plan

1. `npm run build` + `CI=true npm run build` → succeed; asset check
   clean.
2. Confirm: media pane scrolls with full-size media + captions; About
   gone (no data, no render); hero eyebrow + first paragraph updated;
   3-up grid with intact gutters; icon buttons render in modal + contact
   with correct icons, ambiguous ones labelled.
3. Diff review: only intended files; no data loss; marquee/hero/cards
   intact.
4. No live browser → scroll behaviour, 3-up layout, and icon rendering
   verified via build + code; owner smoke-test recommended (the scroll
   fix especially).

---

## Files touched (planned)

| File | Change | Req |
|---|---|---|
| `src/styles/components.css` | `.modal__media .media-item { flex-shrink:0 }`; grids → 3-up + responsive; `.link-button` styles | 1, 3, 4 |
| `src/data/profile.js` | remove `about`; title → Multidisciplinary...; reword intro para 1 | 2 |
| `src/pages/Home.jsx` | delete About section; renumber eyebrows; Contact uses LinkButton | 2, 4 |
| `src/components/icons/BrandIcons.jsx` | new inline SVG icons | 4 |
| `src/components/LinkButton.jsx` | new shared icon link button | 4 |
| `src/components/ContentModal.jsx` | LinksList → LinkButton | 4 |

## Out of scope (deferred)

- Gallery; Crafting Mode.
