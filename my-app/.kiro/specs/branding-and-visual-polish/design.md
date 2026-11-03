# Spec 3 — Browser Branding and Visual Polish — Design

## Overview

Spec 3 is a small, low-risk polish spec: remove default CRA branding
(tab title, favicon, manifest, meta description), resize the hero
portrait, and give the identity marquee its missing scroll animation.
No new features, no new dependencies, and the CSS/token architecture is
reused throughout.

### Verified baseline (current `main`)

- `public/index.html`: `<title>React App</title>`, CRA placeholder
  description, `theme-color #000000`, icon refs `favicon.ico` /
  `logo192.png`.
- `public/manifest.json`: CRA names, `#000000`/`#ffffff` colours, icons
  `favicon.ico`/`logo192.png`/`logo512.png`.
- `public/` holds the default CRA icon files.
- `.hero__photo img` has no explicit sizing rule.
- `.identity-marquee__track` has hover-pause + reduced-motion rules but
  no `animation`.

### The icon-asset blocker (handled explicitly)

The new cursive-"J" icon exists only as a chat attachment; the agent
cannot materialise a chat image into a repo file. Implementation is
therefore split:

- **Independent now:** title, meta description, manifest text/colours,
  hero resize, marquee animation — none depend on the icon file.
- **Blocked on the owner providing the icon file:** generating the
  favicon and manifest PNG icons and rewiring the references.

Options for supplying the icon (owner picks one):
1. Owner commits the provided PNG (e.g. 1024×1024) to the repo (e.g.
   `my-app/src/assets/brand/icon.png` or directly into `public/`), then
   the agent derives the required sizes.
2. Owner provides the icon via a path/URL the agent can fetch into the
   repo.
3. Owner generates a favicon set externally and commits the files.

Preferred: option 1 (a single high-res PNG), from which the agent
produces `favicon` + 192/512 PNGs. If image-processing tooling is not
available in the environment, the agent will state that and the owner
supplies pre-sized files instead (no fabricated/placeholder icon).

---

## Change 1 — Tab title (Req 1)

Edit `public/index.html`: `<title>React App</title>` →
`<title>Jawad Uddin</title>`. Single-line change; nothing else in the
template altered.

> Note: CRA's static `index.html` title is the simplest correct source.
> A runtime `document.title` set in React is unnecessary for a
> single-title site and would only flash the old title first; not used.

## Change 2 — Meta description + theme-color (Req 3.3, 3.4)

In `public/index.html`:
- Replace the CRA description with a factual one, e.g.
  "Portfolio of Jawad Uddin, a Design Engineering student at Imperial
  College London." (exact wording confirmed with owner; no invented
  claims).
- Set `<meta name="theme-color" content="#0a0c10">` to match the dark
  background token and the manifest.

## Change 3 — Manifest text + colours (Req 3.1, 3.2)

In `public/manifest.json`:
- `short_name`: "Jawad Uddin"
- `name`: "Jawad Uddin — Design Engineer" (confirm with owner)
- `theme_color`: "#0a0c10"  (was #000000)
- `background_color`: "#0a0c10"  (was #ffffff; dark to match the app)
- `icons`: updated in Change 4 once the icon file exists.

## Change 4 — Favicon + app icons (Req 2) — depends on icon file

Once the owner provides the source icon (see blocker section):

- Produce icon assets from the source:
  - `favicon.ico` (multi-size 16/32/48) OR a PNG favicon referenced
    from `index.html`.
  - `logo192.png` → replaced by the new 192×192 icon (or renamed to a
    brand-specific name with references updated).
  - `logo512.png` → replaced by the new 512×512 icon.
  - apple-touch icon (180×180 recommended) referenced in `index.html`.
- Update `index.html` `<link rel="icon">` and
  `<link rel="apple-touch-icon">` and `manifest.json` `icons[]` to the
  new files with correct `type`/`sizes`.
- Remove leftover default CRA icon files once nothing references them
  (Req 2.5), verified by grepping `public/` references.

Image generation approach: prefer a tool already available in the
environment (e.g. ImageMagick/`sharp` if present). If none is available,
the agent will NOT fabricate icons — it will ask the owner to commit the
pre-sized set. (Determined at implementation; stated honestly.)

> The square source icon already uses the site's palette (accent
> #3ee8a8 on #0a0c10 / near-black), so it will sit correctly on the dark
> tab and as a maskable-ish app icon. A small safe-area/padding check
> will be done when generating sizes.

## Change 5 — Hero portrait resize (Req 4)

Add a constrained size rule in `components.css`. The hero image
currently fills whatever `.hero__photo` allots with no cap. Add, e.g.:

```css
.hero__photo {
    max-width: 220px;   /* ~half of its current rendered width */
}

.hero__photo img {
    width: 100%;
    height: auto;       /* preserve aspect ratio (Req 4.1) */
}
```

- The exact `max-width` is chosen to achieve the "about half each
  dimension" intent; the final value is stated for the owner to
  fine-tune (Req 4.4). (Current rendered size will be measured from the
  layout/source to set a sensible halving target.)
- `height: auto` guarantees proportional scaling (no distortion).
- Confirm the <=700px responsive block still looks sensible; add a
  mobile cap if needed (Req 4.3).

## Change 6 — Marquee animation (Req 5)

`IdentityMarquee` already renders the items twice
(`[...items, ...items]`) specifically to allow a seamless -50% loop.
Add the keyframes + animation in `components.css`:

```css
.identity-marquee {
    overflow: hidden;          /* prevent horizontal page overflow */
}

.identity-marquee__track {
    display: flex;
    width: max-content;
    animation: identity-scroll 30s linear infinite;
}

@keyframes identity-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }   /* half = one full set */
}
```

- Because the track contains two copies, translating by -50% lands
  exactly on the start of the second copy, giving a seamless loop
  (Req 5.1).
- Existing `:hover` pause rule already targets
  `.identity-marquee__track` → keeps working (Req 5.2).
- Existing `prefers-reduced-motion` rule sets `animation: none` → keeps
  working; content stays readable (Req 5.3).
- `overflow: hidden` on the marquee container prevents the duplicated
  track from creating a horizontal scrollbar (Req 5.4). Verify no layout
  shift.
- Duration (30s) chosen for a calm, non-distracting scroll per the
  "avoid gratuitous animation" design direction; adjustable.

---

## Styling / consistency (Req 6)

- All CSS changes live in `src/styles/components.css` using existing
  tokens; no hardcoded colours outside the token system (except the
  manifest/HTML metadata, which are static files and use the literal
  token hex values).
- No new runtime dependency. (Any icon-generation tool, if used, is a
  build-time/local utility, not an app dependency.)

## Content accuracy (Req 7)

- Title, description, and manifest names use only owner-stated facts.
- No placeholder/fabricated icon is introduced if the real one is not
  yet available.

## Validation plan (Req 6.2–6.3)

1. `npm run build` and `CI=true npm run build` → succeed, no unresolved
   imports/assets (icon refs must point to existing files).
2. Grep `public/` to confirm no dangling references to removed CRA icon
   files.
3. Inspect built `build/index.html` for the new title, description,
   theme-color and icon links.
4. Source-diff review confirms all sections/modal/nav/footer unchanged.
5. No live browser available here → visual results (tab icon/title, hero
   size, marquee scroll) are verified by code + build; owner smoke-test
   recommended (good Playwright-power candidate later). Limitation stated
   honestly.

---

## Files touched (planned)

| File | Change | Requirements |
|---|---|---|
| `my-app/public/index.html` | Title, description, theme-color, icon links | 1, 2.4, 3.3, 3.4 |
| `my-app/public/manifest.json` | Names, colours, icon refs | 3.1, 3.2, 2.4 |
| `my-app/public/` icon files | Replace CRA icons with brand icons | 2 (blocked on asset) |
| `my-app/src/styles/components.css` | Hero resize + marquee animation | 4, 5 |

## Out of scope (deferred)

- About/Contact data-driven rewrite and `profile.links` rendering.
- Gallery, Crafting Mode.
- Any broader redesign beyond hero resize + marquee animation.
