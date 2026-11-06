# Spec 12 — Crafting Interaction Polish — Tasks

Executed as a batch once approved. The `build-after-spec-task` hook runs
`npm run build` after each task. Stage files explicitly; `git add` and
`git commit` as SEPARATE commands. Recipe data + matching engine are NOT
changed.

---

- [ ] 1. Crafted-item pixel art (ResultIcon)
  - `src/components/craft/ResultIcon.jsx`: hand-authored SVG glyphs keyed
    by result ID (projects/experiences/achievements) + generic fallback.
  - `craft.css`: red-tinted `.craft-result-slot` background/border so
    crafted items read distinctly from ingredients.
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 2. Sound hook + mute (useSound)
  - `src/craft/useSound.js`: import the 5 SFX; `play(name)` gated by a
    localStorage-persisted `muted` flag; graceful try/catch + promise
    catch; no autoplay (event-driven only). Add speaker/mute icons to
    BrandIcons.
  - _Requirements: 7.1-7.6_

- [ ] 3. Live result slot + grid DnD/placement/removal (CraftingGrid)
  - Rebuild `CraftingGrid`: 2×2 grid + arrow + result slot; result slot
    shows ResultIcon when a recipe matches and is activatable.
  - Native HTML5 DnD: inventory/grid items draggable; slots are drop
    targets with a green `is-drop-target` outline on dragover; drop
    places/replaces; drag a slot item outside the grid removes it.
  - Double-click/tap a filled slot removes it; keyboard clear
    (Delete/Backspace/Enter on focused slot).
  - _Requirements: 1.1, 1.2, 1.3, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.5_

- [ ] 4. Inventory placement (double-click + draggable)
  - `Inventory`: double-click/tap places into next empty slot; items
    `draggable` for DnD; Enter = place (keyboard). Remove single-click
    placement.
  - _Requirements: 3.1, 3.5, 3.6_

- [ ] 5. Recipe Book lightbox + persistent count
  - `src/components/craft/RecipeBook.jsx`: lightbox overlay wrapping the
    discovery grid (locked silhouettes, hints, unlocked → openItem);
    closable (button/Escape/backdrop) with dialog semantics + focus.
  - Craft page shows "X / 12 discovered" + a "Recipe Book" button
    (lightbox hidden until opened). Remove the inline full list.
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 6. Advancement notifications (CraftNotifications)
  - `src/components/craft/CraftNotifications.jsx`: fixed top-right stack;
    each toast (result art + "Item crafted!" + title) animates in, plays
    notifIn, auto-dismisses after ~4s (notifOut), removed; queue/stack
    multiple; pointer-events none on container; reduced-motion aware.
  - _Requirements: 6.1-6.6_

- [ ] 7. Wire the Craft page
  - Live `evaluate` on `slots`; remove Craft/Clear buttons; result-slot
    collect → new discovery: discover + achievementGet + push toast +
    openItem; already-known: just openItem. Remove sound = clearClicked.
    Master Crafter celebration plays masterCrafter. Add mute toggle at
    top. Wire Recipe Book button + count.
  - _Requirements: 1.4, 1.5, 1.6, 6.x, 7.x_

- [ ] 8. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; asset check clean
    (audio imports resolve).
  - Confirm: engine/data untouched; live result; place via dbl-click +
    drag (green hover); remove via dbl-tap/drag-out/key; replace on
    filled slot; Recipe Book lightbox + visible count; notifications
    queue + auto-dismiss; sounds gated by mute + new-discovery rule;
    Master Crafter one-time still works; Home/Gallery/portfolio
    unaffected.
  - State no-live-browser limitation (DnD/audio/animation/touch need
    owner smoke-test).
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 9. Commit, push, open PR
  - Stage explicitly; `git add` then `git commit` separately; push to
    `rework`; open PR into `main`. Report the PR link.
  - _Requirements: (process)_
