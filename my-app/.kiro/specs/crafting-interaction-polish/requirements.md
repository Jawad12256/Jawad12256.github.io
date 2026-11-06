# Spec 12 — Crafting Interaction Polish

## Introduction

A set of interaction and feel upgrades to Crafting Mode to make it more
authentically Minecraft-like: a live result slot (arrow → crafted item),
drag-and-drop + double-click ingredient placement with green hover
outlines, crafted-item pixel art, a collapsed Recipe Book lightbox,
advancement-style craft notifications, and sound effects with a mute
toggle.

Builds on Spec 11; no change to the recipe/matching DATA or the core
engine logic (only how results surface and how ingredients are placed).

### Owner-requested changes

1. **Result slot.** Replicate Minecraft's crafting layout: the 2×2 grid
   with an arrow pointing to a single result box that shows the crafted
   item when a valid recipe is present. Crafting becomes live (no Craft
   button) — the result appears automatically when the grid matches.
2. **Crafted-item pixel art.** Build new pixel-art icons for the crafted
   results, visually distinct from ingredients (e.g. a red-tinted
   background behind the result glyph).
3. **Placement mechanics.** Replace single-click placement with:
   - **double-click** an inventory item to add it to the next slot, AND
   - **drag** an inventory item onto a slot.
   Both available for accessibility. While dragging and hovering a slot,
   show a **green outline** on that slot.
4. **Removal / replacement.** Remove a grid ingredient by dragging it
   anywhere outside the grid. Dropping an ingredient on an already-filled
   slot **replaces** it.
5. **Remove Craft and Clear buttons** (made redundant by live crafting +
   drag-out removal).
6. **Recipe Book lightbox.** Collapse the always-visible Discovery Book
   into a clearly-labelled "Recipe Book" button that opens a lightbox/
   overlay showing discovery progress. The **"X / 12 discovered" count
   SHALL remain visible on the page** without opening the lightbox.
7. Hints disappearing from the main page as a result of (6) is
   acceptable (hints live in the Recipe Book lightbox).
8. **Advancement notification.** On a successful craft, show a temporary
   Minecraft-advancement-style popup in the top-right that animates in,
   stays briefly, then slides off.
9. **Sound effects + mute.** Wire the provided SFX; include a mute
   toggle at the top of the crafting page.

### Verified SFX assets (committed at src/assets/craftingsfx/)

- `achievementget.mp3`
- `clearclicked.mp3`
- `mastercrafter.mp3`
- `notificationin.ogg`
- `notificationout.ogg`

(Exact event mapping confirmed in Open Questions.)

### Standing constraints

- Recipe/ingredient DATA and the matching engine stay as-is (this spec
  changes surfacing + input, not the recipes).
- Crafted/discovered results still open the EXISTING ContentModal.
- Fully optional; portfolio unaffected; client-side only; no backend.
- Reuse tokens/components; avoid new runtime dependencies where
  reasonable (drag-and-drop implemented with native HTML5 DnD + a
  keyboard/double-click fallback — no DnD library).
- Respect `prefers-reduced-motion` for animations.

---

## Requirements

### Requirement 1 — Live result slot (arrow → crafted item)

**User story:** As a visitor, I want to see the crafted item appear in a
result box as soon as my grid matches a recipe, like Minecraft.

#### Acceptance criteria

1. WHEN the crafting area renders THEN it SHALL show the 2×2 grid, an
   arrow, and a single result slot to the right of the arrow.
2. WHEN the ingredients in the grid form a valid recipe THEN the result
   slot SHALL automatically display the crafted item's icon (no Craft
   button press needed).
3. WHEN the grid does NOT form a valid recipe THEN the result slot SHALL
   be empty.
4. WHEN a valid result is shown AND the user activates the result slot
   (click/Enter) THEN it SHALL register the discovery (if new) and allow
   opening the project's existing ContentModal.
5. WHEN the recipe is newly discovered (first time) THEN discovery state
   SHALL be recorded; WHEN it was already discovered THEN it SHALL still
   show/allow opening without error.
6. WHEN the Craft and Clear buttons are removed THEN crafting SHALL rely
   entirely on live evaluation + drag-out removal (Req 4), with no loss
   of ability to craft or clear the grid.

### Requirement 2 — Crafted-item pixel art

**User story:** As a visitor, I want crafted items to look like distinct
"products", not the same as raw ingredients.

#### Acceptance criteria

1. WHEN a crafted result is displayed (result slot, notification, Recipe
   Book unlocked entry thumbnail where used) THEN it SHALL use a
   pixel-art icon representing that result.
2. WHEN crafted-item art is shown THEN it SHALL be visually distinct from
   ingredient art (e.g. a red-tinted slot background behind the glyph).
3. WHEN result art is authored THEN it SHALL be hand-authored CSS/SVG
   (Path A), with a sensible generic fallback glyph if a specific result
   has no bespoke art yet; NO raster sprites or third-party textures.
4. WHEN a result maps to a project/experience/achievement THEN its art
   SHALL be keyed by result ID so new mappings can get art without
   engine changes.

### Requirement 3 — Placement: double-click and drag, with green hover

**User story:** As a visitor, I want to place ingredients by dragging or
double-clicking, with a clear visual cue of where I'm dropping.

#### Acceptance criteria

1. WHEN a visitor double-clicks an inventory ingredient THEN it SHALL be
   placed in the next empty grid slot (accessible, no drag needed).
2. WHEN a visitor drags an inventory ingredient onto a slot THEN it SHALL
   be placed in that slot on drop.
3. WHILE a drag is in progress AND the pointer is over a slot THEN that
   slot SHALL show a green outline indicating the drop target.
4. WHEN a draggable item is NOT being hovered over a valid slot THEN no
   spurious green outline SHALL persist.
5. WHEN single-click (previous behaviour) is removed THEN a single click
   SHALL no longer place an item (double-click/drag are the methods),
   AND the interaction SHALL remain keyboard-accessible (double-click
   equivalent via keyboard, e.g. Enter places into next slot).
6. WHEN placement occurs THEN live evaluation (Req 1) SHALL re-run
   automatically.

### Requirement 4 — Removal and replacement

**User story:** As a visitor, I want intuitive removal and replacement of
grid ingredients.

#### Acceptance criteria

1. WHEN a visitor drags a grid ingredient and drops it anywhere OUTSIDE
   the grid THEN that ingredient SHALL be removed from its slot.
2. WHEN a visitor drops an ingredient onto an already-filled slot THEN
   the new ingredient SHALL REPLACE the existing one.
3. WHEN a visitor double-clicks/double-taps an ingredient that is ALREADY
   in a grid slot THEN that ingredient SHALL be removed from the slot
   (the symmetric, touch-friendly counterpart to double-click-to-place).
   A keyboard equivalent (focus slot + Enter/Delete) SHALL also clear it,
   so removal is never drag-only.
4. WHEN a slot is emptied or replaced THEN live evaluation SHALL re-run.
5. WHEN removal/replacement occurs THEN it SHALL be reflected
   immediately in the result slot.

### Requirement 5 — Recipe Book lightbox + persistent count

**User story:** As a visitor, I want the recipes tucked into a Recipe
Book I can open, while still seeing my progress at a glance.

#### Acceptance criteria

1. WHEN the crafting page renders THEN the full Discovery/Recipe list
   SHALL NOT occupy the main page; instead a clearly-labelled "Recipe
   Book" button SHALL open it in a lightbox/overlay.
2. WHEN the page renders THEN the discovery count (e.g. "X / 12
   discovered") SHALL remain visible WITHOUT opening the lightbox.
3. WHEN the Recipe Book lightbox is open THEN it SHALL show all recipes
   as locked (silhouette + escalating hint) or unlocked (crafted-item
   art/title), with overall progress, matching prior Discovery Book
   behaviour.
4. WHEN an unlocked entry in the lightbox is activated THEN it SHALL open
   the existing ContentModal for that result.
5. WHEN the lightbox is open THEN it SHALL be closable (button, Escape,
   backdrop) with appropriate dialog semantics and focus handling,
   consistent with the existing modal.
6. WHEN hints no longer appear on the main page (a side effect) THEN this
   SHALL be acceptable; hints live in the Recipe Book.

### Requirement 6 — Advancement-style craft notification

**User story:** As a visitor, I want a satisfying Minecraft-advancement
popup when I craft something new.

#### Acceptance criteria

1. WHEN a successful craft occurs THEN a notification popup SHALL appear
   in the top-right corner.
2. WHEN the notification appears THEN it SHALL animate in, remain for a
   few seconds, then animate out and be removed from the page.
3. WHEN the notification shows THEN it SHALL present the crafted item
   (art + a short label, advancement-style).
4. WHEN multiple crafts occur in quick succession THEN notifications
   SHALL be handled sensibly (queue or stack) without breaking layout.
5. WHEN `prefers-reduced-motion` is set THEN the animation SHALL be
   reduced/removed while still surfacing the notification briefly.
6. WHEN the notification is shown THEN it SHALL not block interaction
   with the crafting area.

### Requirement 7 — Sound effects + mute

**User story:** As a visitor, I want tasteful sound effects that I can
mute.

#### Acceptance criteria

1. WHEN relevant crafting events occur THEN the corresponding SFX from
   `src/assets/craftingsfx/` SHALL play (event→file mapping per Open
   Questions / design).
2. WHEN a mute toggle at the top of the crafting page is engaged THEN NO
   crafting SFX SHALL play; WHEN un-muted THEN they SHALL resume.
3. WHEN the mute preference is set THEN it SHALL persist (localStorage)
   across visits.
4. WHEN sounds play THEN they SHALL be short, not overlap jarringly, and
   SHALL respect the mute state at play time.
5. WHEN audio cannot play (autoplay restrictions, load failure) THEN the
   experience SHALL degrade gracefully (no errors; visuals still work).
6. WHEN the page first loads THEN it SHALL NOT autoplay sound before any
   user interaction (respect browser autoplay policies).

### Requirement 8 — Reuse, consistency, no regression

#### Acceptance criteria

1. WHEN changes are made THEN the recipe DATA and matching engine SHALL
   remain unchanged (only surfacing/input/feedback change); reuse
   existing tokens/components; avoid new runtime dependencies (native
   HTML5 drag-and-drop; no DnD or audio library).
2. WHEN implementation is complete THEN `npm run build` (incl. `CI=true`)
   SHALL succeed with no unresolved imports or assets.
3. WHEN implementation is complete THEN crafting still unlocks records,
   opens the existing ContentModal, persists progress, and the
   Master Crafter one-time celebration still works; Home/Gallery/
   portfolio unaffected.
4. WHEN touch devices are considered THEN double-click/tap placement and
   an accessible removal affordance SHALL keep the mode usable where
   native drag-and-drop is limited.

---

## Resolved decisions (from owner)

1. **SFX mapping:**
   - `achievementget.mp3` → **only on a NEW discovery** (not on
     re-crafting an already-known recipe; nothing plays on a re-craft).
   - `clearclicked.mp3` → removing an ingredient from a slot (double-tap
     remove, drag-out, or keyboard clear).
   - `mastercrafter.mp3` → the Master Crafter celebration.
   - `notificationin.ogg` → advancement popup animating in.
   - `notificationout.ogg` → advancement popup animating out.
2. **Crafted-item art:** a simple bespoke-ish glyph per result, on a
   red-tinted slot, with a generic fallback glyph.
3. **Result slot activation:** registers discovery AND opens the
   existing ContentModal directly.
4. **Notification:** advancement card with an "Item crafted!" eyebrow +
   the result title.
5. **Removal via double-click/tap:** double-clicking/tapping an
   ingredient already in the grid removes it (Req 4.3), alongside
   drag-out and a keyboard clear.
