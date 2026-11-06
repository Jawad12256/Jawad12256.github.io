# Spec 13 — Visual Flair and Polish — Design

## Overview

Nine mostly-CSS changes plus two small JS pieces (a scroll-reveal
IntersectionObserver hook and a self-contained Background component).
Dependency-free. The animated background is isolated so it can be
reverted in one move.

---

## Change 1 — Crafting consumes ingredients (Req 1)

In `Craft.jsx` `collect(resultId)`: after registering discovery / opening
the modal, clear the grid.

```js
const collect = useCallback((resultId) => {
    if (!craftableRecipe) return;
    const item = resolveResult(resultId);
    if (isNewResult) {
        discover(craftableRecipe.id);
        play('achievementGet');
        pushToast(resultId, item ? item.title : 'a project');
    }
    if (item) openItem(item);
    setSlots(EMPTY_SLOTS);        // consume ingredients
}, [...]);
```

- Grid + result slot clear automatically (result derives from slots)
  (Req 1.1, 1.2).
- Clearing happens by resetting slot state directly (NOT via per-slot
  `removeSlot`), so the `clearClicked` sound does NOT fire per slot
  (Req 1.3). The craft/achievement sound already played.
- Discovery/modal behaviour unchanged (Req 1.4).

## Change 2 — Sliding notifications (Req 2)

Currently toasts mount with a `toast-in` slide and are removed after a
timeout (no out-animation). Add an `exiting` state so they slide out
before unmount.

- Toast model gains `exiting: bool`. Page timeline: push (in) → after
  TOAST_MS set `exiting: true` + play `notifOut` → after the out-anim
  duration, remove from array.
- CSS: `.craft-toast` slide-in; `.craft-toast--exiting` slide-out
  (translateX to +120%, fade). Reduced-motion → both become quick fades
  (Req 2.5).
- Sounds stay in sync (notifIn on push, notifOut when exiting begins)
  (Req 2.6).

```css
.craft-toast { animation: toast-in 250ms ease; }
.craft-toast--exiting { animation: toast-out 250ms ease forwards; }
@keyframes toast-out { to { transform: translateX(120%); opacity: 0; } }
@media (prefers-reduced-motion: reduce){
  .craft-toast, .craft-toast--exiting { animation: none; }
}
```

## Change 3 — First-section top spacing (Req 3)

`.section { padding-block: 6rem }` gives the big top gap on single-
section pages (Craft, Gallery). Reduce the TOP padding for a first-child
section:

```css
.section { padding-block: 6rem; border-top: 1px solid var(--border); }
main > .section:first-child,
.section:first-child {
    padding-top: var(--space-8);
    border-top: none;
}
```

- First section on Craft/Gallery sits near the top (Req 3.1).
- Home is hero-first (hero is not a `.section`), so unaffected (Req 3.2).
- Mid-page sections keep 6rem + border-top (Req 3.3).

> The routed pages render a single `.section` as the first child of
> `<main>`, so `main > .section:first-child` targets them precisely.

## Change 4 — Mute button spacing (Req 4)

`.craft__toolbar { gap: var(--space-4) }` → increase to `var(--space-6)`
(or add margin-left on `.craft-mute`). Comfortable separation.

## Change 5 — Larger accent eyebrow / category (Req 5)

- `.hero__eyebrow, .section__eyebrow`: `--text-sm` (0.8125rem) →
  `--text-base` (0.9375rem) (~+15%). Still < title (`--text-2xl`).
- `.project-card__category`, `.card__meta`: `--text-xs` (0.75rem) →
  `--text-sm` (0.8125rem) (~+8%)... to hit 15-30% use a slightly larger
  value: set to `0.9rem` (~+20%). Keep < card title (`--text-xl`).

> Values chosen within the 15-30% band; stated for owner tuning.

## Change 6 — Extruded-square background (experiment, Req 6)

Self-contained `src/components/Background.jsx` + `src/styles/
background.css` (imported in base.css), mounted once in `App` (outside
AppShell's `<main>`, as a fixed layer).

### Structure

```jsx
// Background.jsx — fixed, behind everything, pointer-events:none
function Background() {
  return <div className="bg-flair" aria-hidden="true" />;
}
```

### Visual approach (CSS only)

- A `position: fixed; inset: 0; z-index: -1; pointer-events: none` layer
  behind content (body stays `--bg`; content sits above).
- **Extruded squares from left & right edges:** a repeating pattern
  using CSS gradients, confined to left/right bands via two pseudo-
  elements (`::before` left band, `::after` right band), each a
  `repeating` grid of squares. The square colour is `--bg` mixed toward
  `--accent` (e.g. a very low-alpha mint over the sunken bg), with a
  subtle linear-gradient so squares aren't flat.
- Fixed to viewport (`position: fixed`) → does not scroll with content
  (Req 6.3). Content scrolls over a steady backdrop.
- Very low contrast/opacity so it's subtle (Req 6.2, 6.4).

```css
.bg-flair { position: fixed; inset: 0; z-index: -1;
  pointer-events: none; background: var(--bg); }
.bg-flair::before, .bg-flair::after {
  content: ''; position: absolute; top: 0; bottom: 0; width: 160px;
  background-image:
    linear-gradient(135deg, rgba(62,232,168,0.05), rgba(62,232,168,0));
  -webkit-mask-image: repeating-linear-gradient(...squares...);
  /* squares via a mask of repeating gradients in both axes */
  opacity: 0.5;
}
.bg-flair::before { left: 0; }
.bg-flair::after  { right: 0; transform: scaleX(-1); }
```

> Implementation detail: the "squares" grid is produced with layered
> `repeating-linear-gradient`s (horizontal + vertical lines) forming a
> grid, tinted mint, masked to fade toward the centre so it only reads
> near the edges. Exact recipe tuned at implementation for subtlety.

### Optional spark (Req 6.5)

- A small radial-gradient dot animated along the band perimeter via
  `@keyframes` on `offset-path`/translate. Guarded by
  `prefers-reduced-motion`.
- If it looks gimmicky or hurts perf, it is dropped (Req 6.7). The base
  static pattern stands alone.

### Removability (Req 6.6)

- Entirely contained: delete `Background.jsx`, remove its one mount line
  in App, and drop the `@import './background.css'`. Nothing else
  depends on it.

## Change 7 — Scroll-reveal sections (Req 7)

New `src/hooks/useReveal.js` (IntersectionObserver):

```js
export function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    if (!('IntersectionObserver' in window)) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  return [ref, shown];
}
```

- Apply in `Section.jsx`: wrap the `<section>` with the ref + a
  `reveal` / `reveal--shown` class.

```css
.reveal { opacity: 0; transform: translateY(24px);
  transition: opacity 500ms ease, transform 500ms ease; }
.reveal--shown { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

- One-time reveal (observer disconnects after first intersection)
  (Req 7.2). IntersectionObserver, not scroll events (Req 7.3). No-JS /
  no-observer fallback shows content (Req 7.5). Reduced-motion → no
  motion (Req 7.4).
- Applies to every `Section` (About removed earlier, so: Projects,
  Experience, combined Awards, Events, Contact, + Gallery/Craft
  sections). The hero is not a Section (stays as-is).

## Change 8 — Bold button text (Req 8)

- JetBrains Mono is already loaded with weight 700. Bump button
  font-weight 600 → 700: `.link-button`, `.craft-button`,
  `.contact-link` (if still present), nav action links as applicable.

---

## Files touched (planned)

| File | Change |
|---|---|
| `src/pages/Craft.jsx` | collect clears slots; toast exiting state + slide-out timing |
| `src/components/craft/CraftNotifications.jsx` | apply `--exiting` class |
| `src/styles/craft.css` | toast-out keyframe; toolbar gap |
| `src/styles/components.css` | first-section top spacing; eyebrow/category sizes; button weight 700; reveal classes |
| `src/components/Section.jsx` | useReveal ref + reveal classes |
| `src/hooks/useReveal.js` | NEW IntersectionObserver hook |
| `src/components/Background.jsx` | NEW fixed background layer |
| `src/styles/background.css` | NEW background pattern (+ optional spark); imported in base.css |
| `src/styles/base.css` | import background.css |
| `src/App.js` | mount `<Background/>` once (outside AppShell main) |

## Validation plan

1. `npm run build` + `CI=true npm run build` → succeed; asset check
   clean; no new dependency.
2. Confirm (code): collect clears grid (no sound burst); toasts slide
   in+out; first-section top gap reduced (Craft/Gallery) without
   regressing Home; mute spacing; eyebrow/category larger; background
   fixed + behind + pointer-events none + removable; reveal via IO with
   reduced-motion + no-JS fallback; buttons bold.
3. No live browser → background subtlety, spark, slide timing, and
   scroll-reveal feel need owner smoke-test; background flagged as
   removable on request.

## Out of scope

- Any content/data changes; Crafting recipe/engine logic.
