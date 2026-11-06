# Spec 11 — Crafting Mode — Tasks

Executed as a batch once approved. The `build-after-spec-task` hook runs
`npm run build` after each task. Stage files explicitly; `git add` and
`git commit` as SEPARATE commands.

All recipe/ingredient/flavour text is PLACEHOLDER content for owner
review (marked in the data files).

---

- [ ] 1. Ingredient + recipe data
  - `src/craft/ingredients.js`: 8 concrete ingredients `{id,label,icon}`.
  - `src/craft/recipes.js`: 12 shapeless recipes
    `{id, ingredients[], result, required, hint}` mapping to real
    project/experience/achievement IDs (placeholders, `required: true`).
  - _Requirements: 2.1-2.7, 10.1_

- [ ] 2. Crafting engine (pure)
  - `src/craft/craftingEngine.js`: shapeless `matchRecipe` (sorted
    multiset key), `findNearMiss`, `escalatedHint`, and `evaluate`
    returning success/close/flavour/generic/too-few.
  - `src/craft/feedback.js`: flavour map + generic fallback.
  - _Requirements: 2.4, 3.3, 3.5, 4.1-4.5, 5.4_

- [ ] 3. Result resolver
  - `src/craft/resolveResult.js`: map a result ID to a normalised
    ContentItem via the existing normalisers (projects, experiences,
    achievements) — no duplicated content.
  - _Requirements: 2.3, 5.6_

- [ ] 4. State + localStorage hook
  - `src/craft/useCraftingState.js`: versioned key `craft:v1`;
    discovered/attempts/celebrated; load with try/catch + validate
    against current recipes (ignore unknown IDs); persist on change;
    `reset()`; graceful degradation.
  - _Requirements: 7.1-7.6_

- [ ] 5. Pixel-art styles + font + icons
  - `src/styles/craft.css` (blocky slots/grid/inventory/book using
    tokens; pixel-font usage; reduced-motion guards); import it + the
    pixel font in `base.css`.
  - `IngredientIcon.jsx`: inline-SVG pixel glyphs switching on icon id;
    add `PickaxeIcon` to BrandIcons.
  - _Requirements: 8.1, 8.2, 8.4_

- [ ] 6. Crafting UI components
  - `components/craft/`: Inventory, CraftingGrid (2×2, click-to-place +
    keyboard, Craft/Clear), CraftResult (View project → openItem),
    DiscoveryBook (locked silhouettes, progress, hints, open discovered
    → openItem), MasterCrafterCelebration (one-time, reduced-motion).
  - _Requirements: 3.1, 3.2, 3.6, 5.1-5.7, 6.1-6.5_

- [ ] 7. Craft page + wiring
  - `src/pages/Craft.jsx`: compose the components; use
    `useCraftingState` + `useModal`; feedback banner; reset-with-confirm.
  - _Requirements: 3.1, 4.x, 5.x, 6.x, 7.3, 9.4_

- [ ] 8. Route + entry points
  - `App.js`: add `/craft` route (HashRouter/AppShell).
  - `NavBar`: add Craft link.
  - `Home` hero: add "Try Crafting Mode" LinkButton (PickaxeIcon,
    `to="/craft"`) beside "See my Gallery".
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6_

- [ ] 9. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; asset check clean;
    no new runtime dependency.
  - Confirm: shapeless matching (order-independent); feedback tiers;
    discovery persists + reset confirms; Master Crafter one-time; results
    open existing ContentModal; portfolio/Home/Gallery unaffected;
    localStorage resilience.
  - State no-live-browser limitation (engine verified by code; UI/
    animation/persistence need owner smoke-test); flag placeholders +
    tunables.
  - _Requirements: 9.1, 9.2, 9.3, 10.2_

- [ ] 10. Commit, push, open PR
  - Stage explicitly; `git add` then `git commit` separately; push to
    `rework`; open PR into `main`. Report the PR link + list the
    placeholder ingredient/recipe content for owner review.
  - _Requirements: (process)_
