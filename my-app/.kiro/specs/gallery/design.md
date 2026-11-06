# Spec 10 — Gallery Page — Design

## Overview

Add a `/gallery` page via `react-router-dom` v6 using **HashRouter**
(robust on GitHub Pages, no 404 fallback needed). Lift ContentModal
control to a shared **ModalContext** so both Home and Gallery open the
one modal. The Gallery derives an images-only list from all records,
renders a responsive CSS masonry wall with hover/touch captions, and
opens the parent record's modal on click.

Crafting Mode remains on hold.

### Confirmed decisions

- HashRouter (clean deploy, URLs like `/#/gallery`).
- React Router **v6** (CRA-compatible).
- Nested sub-project images open the **parent internship** modal.
- Touch: always-on caption bar; desktop: hover overlay.

---

## Change 1 — Routing (react-router-dom v6, HashRouter)

Add `react-router-dom` (v6) as a dependency (the one justified new runtime
dep). Restructure `App.js`:

```jsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import AppShell from './layout/AppShell';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import ContentModal from './components/ContentModal';

function App() {
    return (
        <HashRouter>
            <ModalProvider>
                <AppShell>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/gallery" element={<Gallery />} />
                    </Routes>
                </AppShell>
                <GlobalModal />   {/* renders the single ContentModal */}
            </ModalProvider>
        </HashRouter>
    );
}
```

- HashRouter → `jawad12256.github.io/#/gallery`; direct loads/refreshes
  work with no `404.html` trick (Req 1.4). CRA-compatible v6 (Req 1.5).
- AppShell (nav + footer) wraps the routed pages, so nav/footer persist
  across routes (Req 1.2, 1.3, 1.6).

> AppShell currently takes `children`; it keeps doing so and renders
> `{children}` (the `<Routes>`), unchanged otherwise.

---

## Change 2 — Lift the modal to ModalContext (Req 5.2, 5.4)

New `src/context/ModalContext.jsx`:

```jsx
const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [activeItem, setActiveItem] = useState(null);
    const openItem = useCallback((item) => setActiveItem(item), []);
    const closeModal = useCallback(() => setActiveItem(null), []);
    return (
        <ModalContext.Provider value={{ activeItem, openItem, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
}

export const useModal = () => useContext(ModalContext);
```

- A single `GlobalModal` component (rendered once in App) reads the
  context and renders `<ContentModal item={activeItem}
  onClose={closeModal} />` — exactly one modal instance app-wide
  (Req 5.2).
- `Home.jsx` stops owning modal `useState`; instead it calls
  `const { openItem } = useModal();` and passes `openItem(...)` to its
  cards. Its existing card behaviour is otherwise unchanged (Req 5.4).
  The `<ContentModal>` currently rendered inside Home is removed (now
  global).
- Gallery likewise calls `useModal()` to open items (Req 5.1).

> This is the one refactor to existing code. Net effect on Home: remove
> local modal state + the inline `<ContentModal>`, swap to `useModal()`.
> Behaviour identical.

---

## Change 3 — Derived images-only collection (Req 3)

New `src/utils/galleryImages.js`:

```js
import { projects, experience, achievements, events, credentials }
    from '../data';
import { normalise... } from './normaliseContent';

// Local isVideo check (owner opted to duplicate rather than extract a
// shared util; MediaItem/normaliseContent are left untouched).
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
const isVideo = (src) =>
    typeof src === 'string' &&
    VIDEO_EXTENSIONS.some((ext) => src.toLowerCase().includes(ext));

// Produce a flat list of { image, item } where item is the normalised
// ContentItem to open when the image is clicked. Images only (no video).
export function getGalleryImages() {
    const out = [];
    const push = (normItem, images) => {
        (images || []).forEach((img) => {
            if (img && img.src && !isVideo(img.src)) {
                out.push({ image: img, item: normItem });
            }
        });
    };

    projects.forEach((p) => {
        const n = normaliseProject(p);
        push(n, n.images);
    });
    experience.forEach((e) => {
        const n = normaliseExperience(e);
        push(n, n.images);                       // role images
        (n.subItems || []).forEach((sub) =>      // Trivyal/Cyphon images
            push(n, sub.images));                // -> open PARENT (Req 5.5)
    });
    achievements.forEach((a) => push(normaliseAchievement(a), ...));
    events.forEach((ev) => push(normaliseEvent(ev), ...));
    credentials.forEach((c) => push(normaliseCredential(c), ...));
    return out;
}
```

- Derived purely from existing records via the normaliser — no separate
  dataset, no duplicated assets (Req 3.1, 3.5).
- Images only; videos excluded via shared `isVideo` (Req 3.2).
- Each entry carries its parent normalised item, so clicking opens that
  record's modal (Req 3.3). Sub-project images map to the PARENT
  internship item (Req 5.5, per owner).
- New images in any record appear automatically (Req 3.4). Empty records
  contribute nothing (Req 3.6).

> Per owner: the gallery keeps its OWN local `isVideo`; no shared util is
> extracted, and `MediaItem`/`normaliseContent` are not touched.

---

## Change 4 — Gallery page + masonry (Req 4)

New `src/pages/Gallery.jsx`:

```jsx
function Gallery() {
    const { openItem } = useModal();
    const images = useMemo(getGalleryImages, []);
    return (
        <Section id="gallery" eyebrow="GALLERY"
                 title="A visual tour of my work.">
            <div className="gallery-masonry">
                {images.map(({ image, item }, i) => (
                    <button className="gallery-item" key={i}
                            onClick={() => openItem(item)}
                            aria-label={`Open ${item.title}`}>
                        <img src={image.src} alt={image.alt || ''}
                             loading="lazy" />
                        {image.caption && (
                            <span className="gallery-item__caption">
                                {image.caption}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </Section>
    );
}
```

### Masonry CSS (dependency-free, CSS columns)

```css
.gallery-masonry {
    column-count: 4;
    column-gap: var(--space-4);
}
@media (max-width: 1100px) { .gallery-masonry { column-count: 3; } }
@media (max-width: 760px)  { .gallery-masonry { column-count: 2; } }
@media (max-width: 480px)  { .gallery-masonry { column-count: 1; } }

.gallery-item {
    display: block;
    width: 100%;
    margin: 0 0 var(--space-4);
    break-inside: avoid;           /* keep items whole across columns */
    position: relative;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    cursor: pointer;
    background: var(--bg-raised);
}
.gallery-item img { width: 100%; height: auto; display: block; }

/* caption: hover overlay on pointer devices */
.gallery-item__caption {
    position: absolute; inset-inline: 0; bottom: 0;
    padding: var(--space-3) var(--space-4);
    background: linear-gradient(transparent, rgba(6,7,10,0.9));
    color: var(--text-heading);
    font-size: var(--text-xs);
    opacity: 0; transition: opacity 150ms ease;
}
@media (hover: hover) {
    .gallery-item:hover .gallery-item__caption,
    .gallery-item:focus-visible .gallery-item__caption { opacity: 1; }
}
/* touch (no hover): always-on caption bar */
@media (hover: none) {
    .gallery-item__caption { opacity: 1; position: static;
        background: var(--bg-sunken); }
}
@media (prefers-reduced-motion: reduce) {
    .gallery-item__caption { transition: none; }
}
```

- CSS `column-count` masonry, responsive 4→3→2→1 (Req 4.1, 4.2), no new
  layout dependency.
- Hover overlay on `hover: hover`; always-on bar on `hover: none` (touch)
  so captions aren't lost (Req 4.3, 4.4).
- `<button>` wrapper → keyboard-operable + `alt` retained (Req 4.5, 5.1);
  `loading="lazy"` (Req 4.6).

---

## Change 5 — Nav + hero entry points (Req 2)

- **NavBar:** add a Gallery link. Since routing is client-side, use
  react-router's `<Link to="/gallery">Gallery</Link>` (and make the logo
  a `<Link to="/">`). Other in-page anchors (`#projects` etc.) only make
  sense on Home — they will be plain anchors that work when on Home; from
  the Gallery page the logo/Home link returns to `/`. (Design keeps nav
  simple; anchor links remain as-is.)
- **Hero button:** add a "See my Gallery" button using the existing
  `LinkButton` styling. LinkButton currently renders an `<a href>`; to
  route client-side, either (a) extend LinkButton to optionally render a
  react-router `<Link>` / use `useNavigate`, or (b) add a small
  `GalleryButton` that reuses `.link-button` styling + a new
  `ImagesIcon`. Design choice: add an `ImagesIcon` to BrandIcons and let
  LinkButton accept an optional `to` prop (internal route) vs `href`
  (external) — keeps one button component (Req 2.2, 2.5).
- New `ImagesIcon` (stacked-photos glyph) in `BrandIcons.jsx`.
- Back to home via nav logo/link (Req 2.4).

---

## Deployment / hosting (Req 6.4)

- HashRouter needs no server rewrite, so GitHub Pages (Actions source)
  serves `/gallery` via the hash with zero extra config. The Amplify
  config intent is likewise unaffected (hash routing is client-only).
- No `404.html` needed.

---

## Validation plan

1. `npm install react-router-dom@^6` then `npm run build` +
   `CI=true npm run build` → succeed; asset check clean.
2. Confirm: `/#/gallery` renders the masonry wall; nav link + hero
   button navigate client-side; clicking an image opens the correct
   record's modal; Home cards still open the modal (lifted state);
   videos excluded; captions on hover (desktop) / always-on (touch).
3. Diff review: Home behaviour preserved; single ContentModal; no
   duplicated assets; only new dep is react-router-dom.
4. No live browser → routing, masonry, hover/touch captions verified via
   build + code; owner smoke-test (incl. mobile) recommended; column
   counts and caption styling flagged tunable.

---

## Files touched (planned)

| File | Change |
|---|---|
| `my-app/package.json` (+lock) | add `react-router-dom` v6 |
| `src/App.js` | HashRouter + Routes + ModalProvider + GlobalModal |
| `src/context/ModalContext.jsx` | NEW shared modal state |
| `src/components/GlobalModal.jsx` | NEW single ContentModal renderer (or inline in App) |
| `src/pages/Home.jsx` | use `useModal()`, drop local modal state + inline ContentModal |
| `src/pages/Gallery.jsx` | NEW gallery page (masonry) |
| `src/utils/galleryImages.js` | NEW derived images-only collection (local isVideo) |
| `src/components/LinkButton.jsx` | optional `to` (internal route) prop |
| `src/components/icons/BrandIcons.jsx` | add `ImagesIcon` |
| `src/components/NavBar.jsx` | Gallery `<Link>`, logo `<Link>` |
| `src/styles/components.css` | gallery masonry + caption styles |

## Out of scope (deferred)

- Crafting Mode.
- Lightbox/zoom, filtering/grouping, per-image deep links.
