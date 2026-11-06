# Spec 12 — Crafting Interaction Polish — Design

## Overview

Rework how Crafting Mode surfaces results and accepts input, without
touching recipe data or the matching engine: a live result slot, crafted
-item pixel art, double-click + native-DnD placement (green hover),
double-tap/drag-out/keyboard removal, a Recipe Book lightbox (persistent
count outside it), advancement notifications, and SFX with a persisted
mute. Native HTML5 DnD + double-click fallback — no DnD/audio library.

---

## Change 1 — Live result slot (Req 1)

`Craft.jsx` already holds `slots` and runs `evaluate` on a button press.
Change to **live evaluation** with `useMemo`/effect on `slots`:

```js
const result = useMemo(
    () => evaluate(slots.filter(Boolean), recipes, attempts),
    [slots, attempts]
);
const craftable = result.type === 'success' ? result.recipe : null;
```

- Remove Craft/Clear buttons. `CraftingGrid` becomes grid + arrow +
  result slot.
- Result slot shows the crafted item's art when `craftable`, else empty.
- Activating the result slot → `onCollect(craftable)`:
  - if new: `discover(id)`, play `achievementget`, push notification,
    (achievement check), then `openItem(resolveResult(result))`.
  - if already discovered: just `openItem(...)` (no sound/notification).
- Feedback banner (close/flavour/generic) still shown from `result`
  (hints now also surface here transiently; main-page hint list is gone
  per Req 5/owner).

### CraftingGrid layout

```
<div class="craft-table">
  <div class="craft-grid"> 4 slots </div>
  <span class="craft-arrow">→</span>
  <div class="craft-result-slot pixel-cell craft-result-slot--filled?">
     <ResultIcon resultId=... />      (red-tinted bg)
  </div>
</div>
```

---

## Change 2 — Crafted-item pixel art (Req 2)

New `src/components/craft/ResultIcon.jsx`: hand-authored SVG glyphs keyed
by result ID (projects/experiences/achievements), rendered on a
red-tinted slot background (`.craft-result-slot` / `--new`). Simple
bespoke-ish glyph per result + a generic fallback (e.g. a star/box) for
any unmapped result.

```jsx
// ResultIcon switches on resultId -> a Glyph (rect-grid SVG), same
// technique as IngredientIcon. Red tint comes from the slot CSS, not
// the glyph, so one tint rule covers all.
```

- 14 result IDs get a simple glyph; fallback covers the rest and future
  results (Req 2.3, 2.4).
- Red tint: `.craft-result-slot { background: rgba(232,102,62,0.18);
  border-color: #e8663e; }` so crafted items read distinctly vs
  ingredient slots (Req 2.2).

---

## Change 3 — Placement: double-click + native DnD + green hover (Req 3)

### Double-click (accessible / touch / mobile)

- `Inventory` items: `onDoubleClick` → `placeIngredient(id)` (next empty
  slot). Keyboard: Enter on a focused inventory item = place (documented
  as the keyboard equivalent). Single click no longer places.

### Native HTML5 drag-and-drop (desktop pointer)

- Inventory item: `draggable`, `onDragStart` sets
  `dataTransfer` payload `{ from: 'inventory', ingredientId }`.
- Slot: `onDragOver` (preventDefault to allow drop) toggles a
  `is-drop-target` class → **green outline**; `onDragLeave` clears it;
  `onDrop` reads payload and places/replaces.
- Grid item: also `draggable` with payload `{ from: 'slot', index }` so
  it can be dragged OUT (Change 4).

### Green hover outline (Req 3.3, 3.4)

```css
.craft-slot.is-drop-target {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    box-shadow: 0 0 0 2px var(--accent) inset;
}
```
Applied only while a drag is over that slot; cleared on leave/drop.

---

## Change 4 — Removal & replacement (Req 4)

- **Double-click/tap a filled slot** → remove that ingredient
  (`removeSlot(index)`), play `clearclicked` (Req 4.3, owner rule).
- **Drag a slot item outside the grid** → remove. Implement via a drop
  handler on a wrapping area / document: if a `{from:'slot'}` drag ends
  NOT on a slot, remove it. (Track the dragged slot; on `dragend` if it
  wasn't dropped on a slot, clear it.)
- **Drop onto a filled slot** → replace (the drop handler just sets the
  slot to the new id regardless of prior contents) (Req 4.2).
- **Keyboard:** focus a slot, press Delete/Backspace/Enter → clear
  (Req 4.3).
- Any change re-runs live evaluation automatically (Req 4.4, 4.5).

> Drag-out detection: simplest robust approach — on slot `onDragStart`
> record the source index; add an `onDrop`+`onDragOver` on the page/
> inventory region that, for a `from:'slot'` payload, removes the source
> slot. Plus `onDragEnd` fallback: if `dropEffect === 'none'`, remove.

---

## Change 5 — Recipe Book lightbox + persistent count (Req 5)

- Replace the inline `<DiscoveryBook>` on the page with:
  - A header row always showing **"X / 12 discovered"** + a
    **"Recipe Book"** button.
  - A lightbox overlay (reuse the modal overlay pattern / or a dedicated
    `.recipe-book-overlay`) that renders the existing DiscoveryBook grid
    (locked silhouettes, hints, unlocked → `openItem`).
- Lightbox: closable via button/Escape/backdrop, dialog semantics, focus
  handling — mirror ContentModal's approach (Req 5.5). Can be a small
  local component; does not need ModalContext (it's craft-local), but
  unlocked entries still call `openItem` from `useModal()` to show the
  ContentModal (Req 5.4).
- Count derives from state (`discovered` vs `recipes.length`) (Req 5.2).

> Note: opening a result's ContentModal from inside the Recipe Book
> lightbox will stack the ContentModal above the lightbox — acceptable
> (ContentModal has higher z-index). Closing the modal returns to the
> lightbox.

---

## Change 6 — Advancement notification (Req 6)

New `src/components/craft/CraftNotifications.jsx` + a tiny queue in
`Craft.jsx` (array of `{ id, resultId, title }`).

- On a NEW craft: push a notification; it mounts top-right, plays
  `notificationin`, auto-dismisses after ~4s (plays `notificationout`),
  then removed.
- Stacking: render the array as a vertical stack in a fixed top-right
  container; each item self-expires via a timer (Req 6.4).
- Card: result art + "Item crafted!" eyebrow + result title (Req 6.3).
- `position: fixed; top/right; pointer-events: none` on the container so
  it never blocks the crafting area (Req 6.6).
- Reduced-motion: no slide, just a brief fade/appear (Req 6.5).

```css
.craft-toasts { position: fixed; top: calc(var(--nav-height) + 1rem);
  right: 1rem; z-index: 1050; display: flex; flex-direction: column;
  gap: .5rem; pointer-events: none; }
.craft-toast { pointer-events: auto; animation: toast-in 250ms ease; }
@keyframes toast-in { from { transform: translateX(120%);} to {...} }
@media (prefers-reduced-motion: reduce){ .craft-toast{animation:none;} }
```

---

## Change 7 — SFX + mute (Req 7)

New `src/craft/useSound.js`:

```js
import achievementGet from '../assets/craftingsfx/achievementget.mp3';
import clearClicked   from '../assets/craftingsfx/clearclicked.mp3';
import masterCrafter  from '../assets/craftingsfx/mastercrafter.mp3';
import notifIn        from '../assets/craftingsfx/notificationin.ogg';
import notifOut       from '../assets/craftingsfx/notificationout.ogg';

const SOUNDS = { achievementGet, clearClicked, masterCrafter,
                 notifIn, notifOut };
// useSound(): { play(name), muted, toggleMute }
// - muted persisted in localStorage 'craft:muted'
// - play(): if muted -> no-op; else new Audio(src) (or cached), .play()
//   wrapped in try/catch + .catch() so autoplay/load failures are silent
```

- Mute toggle button at the top of the craft page (speaker icon;
  persists via localStorage) (Req 7.2, 7.3).
- No sound before user interaction (sounds only fire on craft/remove/
  notification events, which are user-initiated) (Req 7.6).
- Graceful failure (Req 7.5): `.play()` returns a promise; `.catch(()=>{})`.

### Event → sound mapping (confirmed)

| Event | Sound |
|---|---|
| New discovery (first craft of a recipe) | `achievementGet` |
| Remove ingredient from slot (dbl-tap / drag-out / key) | `clearClicked` |
| Master Crafter celebration shown | `masterCrafter` |
| Notification in | `notifIn` |
| Notification out | `notifOut` |

(Re-crafting an already-known recipe plays nothing — owner rule.)

---

## Files touched (planned)

| File | Change |
|---|---|
| `src/pages/Craft.jsx` | live result; remove Craft/Clear; place/remove/replace handlers; notification queue; sound calls; Recipe Book button + count; mute button |
| `src/components/craft/CraftingGrid.jsx` | grid + arrow + result slot; DnD handlers + green hover; dbl-click/tap remove |
| `src/components/craft/Inventory.jsx` | dbl-click place + draggable items (remove single-click place) |
| `src/components/craft/ResultIcon.jsx` | NEW crafted-item glyphs (red-tinted) |
| `src/components/craft/RecipeBook.jsx` | NEW lightbox wrapping the discovery grid (from DiscoveryBook) |
| `src/components/craft/DiscoveryBook.jsx` | reused inside the lightbox (grid stays; page-level usage removed) |
| `src/components/craft/CraftNotifications.jsx` | NEW advancement toasts |
| `src/craft/useSound.js` | NEW sound hook + mute (localStorage) |
| `src/components/icons/BrandIcons.jsx` | add speaker/mute icons |
| `src/styles/craft.css` | result slot red tint, drop-target green, toasts, recipe-book overlay, mute button |

## Non-goals / unchanged

- Recipe data + matching engine (`recipes.js`, `craftingEngine.js`,
  `ingredients.js`) unchanged.
- ContentModal / ModalContext unchanged (reused).
- Portfolio, Home, Gallery unaffected.

## Validation plan

1. `npm run build` + `CI=true npm run build` → succeed; asset check
   clean (new audio imports resolve).
2. Confirm (code): live result appears/clears with grid; dbl-click place;
   DnD place/replace/out with green hover; dbl-click/tap + key remove;
   Recipe Book lightbox + persistent count; notifications queue + auto-
   dismiss; sounds gated by persisted mute + new-discovery rule; no
   autoplay; graceful audio failure.
3. No live browser → DnD, audio, animations, and touch behaviour need
   owner smoke-test (desktop drag + mobile double-tap especially);
   engine/data untouched so crafting correctness is preserved.
