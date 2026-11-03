# Spec 2 — Content Modal and Data Normalisation — Design

## Overview

Spec 2 delivers the keystone architectural feature from the steering: a
single reusable content modal, backed by a normalisation layer that maps
all five record types (projects, experience, achievements, events,
credentials) onto one consistent "content item" contract. All hidden
sections are surfaced and made openable through that one modal.

Guiding principles:
- **One modal, many types** — no per-type modal components.
- **Normalise, don't mutate** — adapters produce a derived view; the
  source data files are not restructured (preserves authored content and
  keeps the empty-content-tolerance guarantees from Spec 1).
- **Reuse the existing CSS/token system** — extend `components.css`
  (or add scoped style files that use the same tokens); no new styling
  framework, no new runtime dependency.
- **Dependency-free modal** — React portal + hooks; no modal library.

### Verified current state (baseline for this spec)

- `ProjectCard` takes an unused `onClick`; `Home.jsx` renders the grid
  but passes no handler. Cards are `<article>` (not focusable).
- `Section` is a reusable wrapper (`id`, `eyebrow`, `title`, children).
- Nav links: About, Projects, Experience, Contact. Experience section is
  an empty placeholder; About/Contact are hardcoded copy.
- Data barrel `src/data/index.js` exports all five collections.
- Image objects are `{ src, alt, caption? }`; `.mp4` entries appear in
  some `images` arrays (treated as video). Many collections are empty
  by design and will be populated later.
- No `src/utils/` directory exists yet (named in structure steering; to
  be created for the adapter).

---

## Architecture

```
src/
  data/
    index.js                 (existing barrel; unchanged exports)
    *.js                     (existing data; NOT restructured)
  utils/                     (new)
    normaliseContent.js      (adapters: record -> ContentItem)
  components/
    ContentModal.jsx         (new; the single reusable modal)
    MediaItem.jsx            (new; renders one image or video)
    ProjectCard.jsx          (existing; made keyboard-operable)
    Card.jsx                 (new OR reuse pattern; generic clickable card
                              for non-project sections)
    Section.jsx              (existing; reused)
    NavBar.jsx / Footer.jsx  (NavBar: drop About link, add lean links)
  pages/
    Home.jsx                 (owns modal open/close state; renders all
                              sections; passes activate handlers)
  styles/
    components.css           (extended with modal + card/grid styles)
```

### State ownership

`Home.jsx` owns a single piece of modal state:

```js
const [activeItem, setActiveItem] = useState(null); // ContentItem | null
```

- Any card's activation calls `setActiveItem(normalisedItem)`.
- `ContentModal` is rendered once in `Home` (or `AppShell`), open iff
  `activeItem !== null`, closing via `setActiveItem(null)`.
- This keeps exactly one modal instance mounted logically and one source
  of truth, satisfying "one modal implementation" (Req 2.7).

> Alternative considered: a React context/provider for modal control.
> Rejected for now as over-abstraction for a single-page app (tech
> steering prefers simple over abstract). A single `useState` in the
> page is sufficient; can be lifted to context later if a second page
> needs it.

---

## The normalised ContentItem contract (Req 1)

A plain object produced by adapter functions. Shape:

```js
{
  id: 'pythonic-cfd',          // stable id from source
  type: 'project',             // 'project' | 'experience' | 'achievement'
                               //  | 'event' | 'credential'
  title: 'Building CFD in Python',
  subtitle: 'Personal Project · 2026',  // type-specific meta line
  shortDescription: '...',
  description: '...',
  technologies: [...],         // [] when not applicable
  skills: [...],               // [] when not applicable
  images: [ { src, alt, caption? }, ... ],   // [] allowed
  links: { github: 'https://...', ... },     // {} allowed
  meta: {                      // type-specific preserved fields
    // e.g. award, recognition, organisation, role, period, issuer,
    //      year, category, shortTitle, etc. — nothing discarded
  },
  subItems: [ ContentItem, ... ]  // e.g. nested experience sub-projects
}
```

Design decisions:
- **`meta` preserves everything** that is not a core field, satisfying
  Req 1.2 (no silent discard). The modal reads known `meta` keys to
  render type-appropriate detail (award line, issuer, period, etc.).
- **`subItems`** carries nested experience projects (Trivyal/Cyphon) as
  their own ContentItems, so the modal can render them in-place within
  the parent role modal (Req 5.3–5.4) without promoting them to the main
  Projects grid.
- **`subtitle`** is a derived, type-specific one-liner:
  - project: `"{type} · {year}"` (and category shown as eyebrow)
  - experience: `"{role}{, organisation if present} · {period}"`
  - achievement: `"{category} · {year}"` + award/recognition in body
  - event: `"{role} · {year}"`
  - credential: `"{issuer} · {year}"`

### Adapters (`src/utils/normaliseContent.js`)

One small pure function per type plus a dispatcher:

```js
export function normaliseProject(p) { ... }      // -> ContentItem
export function normaliseExperience(e) { ... }   // includes subItems
export function normaliseAchievement(a) { ... }
export function normaliseEvent(ev) { ... }
export function normaliseCredential(c) { ... }   // credentialUrl -> links
```

- Credentials: `credentialUrl` is folded into `links` (e.g.
  `links: { credential: credentialUrl }`) so the modal's generic link
  rendering handles it (Req 8.3). The raw value is also retained in
  `meta` so nothing is lost.
- Events: both `title` and `shortTitle` kept (`title` core, `shortTitle`
  in `meta`); compact card uses `shortTitle || title`, modal uses
  `title` (Req 7.3).
- Empty `images`/`links` pass through as `[]`/`{}` untouched (Req 1.4).

Adapters are pure and derive a view; **source data files are not
edited** in this spec.

---

## ContentModal component (Req 2, 3)

Dependency-free, using a React portal into `document.body`.

### Structure

```
<Overlay onClick=close>            role/aria on dialog, not overlay
  <Dialog role="dialog" aria-modal="true" aria-labelledby=...
          onClick=stopPropagation>
    <Header>
      <eyebrow/category> <h2 id=title> <subtitle>
      <CloseButton aria-label="Close" />
    </Header>
    <Body>
      <p description/>
      {award/recognition/issuer meta lines when present}
      {technologies chips when present}
      {skills chips when present}
      {images.length > 0 && <MediaGallery> images.map(MediaItem) }
      {subItems.length > 0 && <SubItems> subItems.map(sub-card/detail) }
      {hasLinks && <Links> render each link }
    </Body>
  </Dialog>
</Overlay>
```

### Behaviour & accessibility (Req 3)

- **Open condition:** rendered only when an item is provided; otherwise
  returns `null` (Req 3.5).
- **Portal:** `ReactDOM.createPortal` to `document.body` so stacking/
  overflow are not affected by section layout.
- **Close:** close button, `Escape` key (keydown listener added on open,
  removed on close), and overlay click (dialog click stops propagation)
  (Req 3.1).
- **Dialog semantics:** `role="dialog"`, `aria-modal="true"`,
  `aria-labelledby` pointing to the title node (Req 3.2).
- **Focus management:** on open, move focus to the dialog (or close
  button); on close, restore focus to the element that opened it
  (captured via a ref passed from the trigger, or `document
  .activeElement` saved on open) (Req 3.3). A basic focus trap keeps Tab
  within the dialog.
- **Scroll lock:** on open, set `document.body` overflow hidden; restore
  previous value on close (Req 3.4). Implemented in a `useEffect` keyed
  on open state with proper cleanup.

### MediaItem (Req 2.6)

Chooses rendering by file extension of `image.src`:
- `.mp4` (and other video extensions) → `<video controls>` with the
  `alt`/`caption` as accessible text/caption.
- otherwise → `<img src alt />`.
- `caption` rendered (e.g. `<figcaption>`) only when present (Req 2.5).

Because `src` is an imported/hashed asset string, extension detection is
done on the imported URL; a small helper (`isVideo(src)`) encapsulates
this. This keeps future-added images working with no code change
(Req 2.4): a new `{src, alt, caption}` entry simply renders.

---

## Section rendering (Req 4, 5, 5a, 6, 7, 8)

### Section order (Req 5a.1)

`Home.jsx` renders, in order:
Hero → About → Projects → Experience → Credentials → Achievements →
Events → Contact.

Existing `eyebrow` numbering (`01 // ABOUT`, etc.) is renumbered to match
the new order. About and Contact copy are left as-is (out of scope).

### Cards

- **Projects:** existing `ProjectCard`, now keyboard-operable:
  - add `role="button"`, `tabIndex={0}`, `onKeyDown` for Enter/Space,
    and keep `onClick`; `Home` passes
    `onClick={() => setActiveItem(normaliseProject(project))}`
    (Req 4.1–4.2). Visuals/tokens unchanged (Req 4.4).
- **Experience / Credentials / Achievements / Events:** a single generic
  clickable `Card` component (same interaction/a11y pattern) renders a
  compact summary appropriate to each type, driven by the normalised
  item's `title`/`subtitle`/`shortDescription`. This avoids duplicating
  card logic per section (Req 6 reuse). Each card activates the shared
  modal with its normalised item.

> Decision: reuse one generic `Card` for the four non-project sections
> rather than four bespoke cards. `ProjectCard` is kept as-is (plus
> keyboard support) to avoid disturbing its established markup/styles,
> but it follows the same interaction contract.

### Experience nested sub-projects (Req 5.3–5.4)

- The experience role is the first-class card and modal subject, with
  its own hero image when available via its `images` array. (Today the
  internship's `images` is empty; it will populate later with no code
  change — a dedicated internship hero image is owner-provided content,
  not fabricated here.)
- `normaliseExperience` maps the nested `projects` array into
  `subItems` (each via `normaliseProject`). The modal renders a
  "Projects within this role" subsection listing each sub-item's title,
  description, technologies/skills and (future) images — conveying
  technical depth without creating top-level Projects-grid entries.

### Navigation (Req 5a.2–5a.4)

- Remove the **About** link.
- Keep the nav lean: proposed links are Projects, Experience, and a
  single grouped entry or a short set for the credentials/achievements/
  events cluster (final lean choice made at implementation; e.g. links
  for Projects, Experience, Achievements, Contact, with Credentials/
  Events reachable by scrolling). Any larger nav redesign is deferred.
- All links keep anchor-scroll behaviour and the existing <=700px hide
  rule.

---

## Styling (Req 9.2)

- Extend `src/styles/components.css` with modal, overlay, media-gallery,
  chip, and generic-card/grid styles, all using existing CSS variables
  from `tokens.css` (bg-raised, border, accent, radii, spacing, type
  scale). No hardcoded colours outside the token system.
- Dark/technical/minimal: overlay is a dim scrim over `--bg-sunken`;
  dialog uses `--bg-raised` + `--border`; accent used sparingly for
  links/close affordance; respect `prefers-reduced-motion` for any
  open/close transition.
- Reuse the existing `.project-card__tags` chip styling pattern for
  technologies/skills in the modal to stay visually consistent.

---

## Content accuracy (Req 10)

- Adapters only reshape existing fields; they never synthesise values.
- Missing media/links render as absent. No placeholder imagery or
  invented captions, awards, or dates.
- If any record's data is ambiguous to normalise (e.g. a field whose
  intended display is unclear), it will be surfaced to the owner rather
  than guessed.

---

## Validation plan (Req 9)

1. `npm run build` and `CI=true npm run build` → both succeed, no
   unresolved imports/assets.
2. Asset cross-check remains clean.
3. Source-diff review confirms hero/marquee/footer and existing project
   grid appearance unchanged; new sections added in the specified order.
4. Because no live browser is available in this environment
   (long-running process constraint), interactive behaviours (open/
   close, Escape, focus, scroll lock, keyboard activation, video
   playback) are verified by code review and build success, and this
   limitation is stated honestly in the report. The owner is encouraged
   to smoke-test in a browser (and this is a good candidate for the
   future Playwright/browser-automation check).
5. No new runtime dependencies added.

---

## Files touched (planned)

| File | Change | Requirements |
|---|---|---|
| `src/utils/normaliseContent.js` | New — adapters + dispatcher | 1, 5, 6, 7, 8 |
| `src/components/ContentModal.jsx` | New — single reusable modal | 2, 3 |
| `src/components/MediaItem.jsx` | New — image/video renderer | 2.5, 2.6 |
| `src/components/Card.jsx` | New — generic clickable card | 4–8 |
| `src/components/ProjectCard.jsx` | Add keyboard operability + wire onClick | 4 |
| `src/components/NavBar.jsx` | Drop About; lean links | 5a |
| `src/pages/Home.jsx` | Modal state; render all sections in order | 4,5,5a,6,7,8 |
| `src/styles/components.css` | Modal/card/media/chip styles via tokens | 9.2 |

## Out of scope (deferred)

- Gallery, Crafting Mode.
- IdentityMarquee animation fix.
- URL/deep-link routing to a modal.
- Data-driven About/Contact rewrite.
- Restructuring the source data files (adapters derive a view instead).
