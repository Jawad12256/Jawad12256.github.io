# Spec 11 — Crafting Mode — Design

## Overview

A self-contained, optional crafting game at `/craft`: an inventory of
concrete ingredients, a 2×2 shapeless crafting grid, a pure data-driven
recipe engine, thoughtful failure feedback, a Discovery Book, a one-time
Master Crafter celebration, and versioned localStorage persistence.
Crafted/discovered results open the EXISTING ContentModal. Game logic is
isolated under `src/craft/`; pixel art is CSS + hand-authored SVG + a
pixel web-font (Path A). No new runtime dependency.

---

## Architecture

```
src/
  craft/                         (isolated game module)
    ingredients.js               ingredient data
    recipes.js                   recipe data (shapeless, data-driven)
    craftingEngine.js            pure functions: match / near-miss / hint
    useCraftingState.js          hook: state + localStorage persistence
    feedback.js                  flavour/near-miss/fallback messages
  components/craft/              (pixel-art UI components)
    CraftingGrid.jsx
    Inventory.jsx
    IngredientIcon.jsx           (SVG pixel glyphs)
    CraftResult.jsx
    DiscoveryBook.jsx
    MasterCrafterCelebration.jsx
  pages/
    Craft.jsx                    page: composes the above; opens modal
  styles/
    craft.css                    pixel-art styling (imported by base.css)
```

- Portfolio presentation components are untouched except: App route,
  NavBar link, Home hero button. Project viewing reuses ModalContext's
  `openItem` + the existing normalisers (no duplicated project data).

---

## Data shapes

### Ingredients (`src/craft/ingredients.js`)

Concrete, tangible nouns (owner's steer). Starting set of 8, each with a
hand-authored SVG pixel glyph id:

```js
export const ingredients = [
  { id: 'code',        label: 'Code',             icon: 'code' },
  { id: 'wires',       label: 'Wires',            icon: 'wires' },
  { id: 'cad',         label: 'CAD Model',        icon: 'cad' },
  { id: 'printer',     label: '3D Printer',       icon: 'printer' },
  { id: 'wheels',      label: 'Wheels',           icon: 'wheels' },
  { id: 'simulation',  label: 'Simulation',       icon: 'simulation' },
  { id: 'controller',  label: 'Gaming Controller',icon: 'controller' },
  { id: 'blueprint',   label: 'Blueprint',        icon: 'blueprint' }
];
```

> All placeholders for owner review. Concrete/tangible per the brief
> (no soft skills).

### Recipes (`src/craft/recipes.js`)

Shapeless; `ingredients` is an unordered multiset; `result` is a real
record ID (project/experience/achievement); `required` gates Master
Crafter; `hint` is the vague tier-1 clue.

```js
export const recipes = [
  // --- 2-ingredient (most) ---
  { id: 'r-cfd',        ingredients: ['code','simulation'],
    result: 'pythonic-cfd', required: true,
    hint: 'Code that models how fluids flow.' },
  { id: 'r-morse',      ingredients: ['code','controller'],
    result: 'morsemaster', required: true,
    hint: 'Software that turns signals into messages.' },
  { id: 'r-datascience',ingredients: ['code','blueprint'],
    result: 'data-science', required: true,
    hint: 'Finding patterns from structured data.' },
  { id: 'r-printing',   ingredients: ['cad','printer'],
    result: '3d-printing', required: true,
    hint: 'A model made physical, layer by layer.' },
  { id: 'r-minecraft',  ingredients: ['blueprint','controller'],
    result: 'minecraft', required: true,
    hint: 'Building something real inside a game.' },
  { id: 'r-splatoon',   ingredients: ['controller','wheels'],
    result: 'splatoon', required: true,
    hint: 'Teamwork and reflexes in competitive play.' },
  { id: 'r-internship', ingredients: ['code','wires','blueprint'],
    result: 'software-internship', required: true,
    hint: 'Professional software built across a summer.' },
  // --- 3-ingredient (advanced) ---
  { id: 'r-rccar',      ingredients: ['wires','wheels','controller'],
    result: 'electronics-1-rc-car', required: true,
    hint: 'A remote-controlled machine on wheels.' },
  { id: 'r-megabite',   ingredients: ['code','wires','cad'],
    result: 'megabite', required: true,
    hint: 'A hands-free assistant blending software and hardware.' },
  { id: 'r-srobo',      ingredients: ['wires','cad','controller'],
    result: 'student-robotics', required: true,
    hint: 'An autonomous robot built to compete.' },
  // --- 4-ingredient (most advanced) ---
  { id: 'r-f1is',       ingredients: ['cad','simulation','wheels','blueprint'],
    result: 'f1-in-schools', required: true,
    hint: 'A tiny race car, designed, analysed and manufactured.' },
  { id: 'r-uksdc',      ingredients: ['cad','simulation','blueprint','wires'],
    result: 'uk-space-design', required: true,
    hint: 'Designing a settlement beyond Earth.' }
];
```

- 12 recipes: 6×two-ingredient, 3×three-ingredient, 1 (tutoring)
  three-ingredient, 2×four-ingredient. All `required: true` to start;
  owner can later add `required: false` easter eggs.
- `tutoring` and `academic-representative` are intentionally NOT mapped
  initially (owner can add later) — recipes/results are fully
  data-driven, so this is a data edit, not a logic change.
  `software-internship` IS included per owner request. (Discovery Book
  derives from `recipes`, so only mapped results show.)
- All ingredient→result mappings are PLACEHOLDERS for owner review;
  they're thematically plausible but the owner refines freely.

---

## Crafting engine (`src/craft/craftingEngine.js`) — pure, data-driven

Shapeless matching via sorted-multiset key:

```js
const key = (ids) => [...ids].filter(Boolean).sort().join('+');

export function matchRecipe(placedIds, recipes) {
    const k = key(placedIds);
    return recipes.find((r) => key(r.ingredients) === k) || null;
}
```

Near-miss detection (for "close" hints, Req 4.1):

```js
// A recipe is "close" if the placed multiset shares all-but-one
// ingredient with it (same size ±1 and large overlap).
export function findNearMiss(placedIds, recipes) {
    // compute multiset overlap; return the recipe with the smallest
    // non-zero difference (e.g. differs by exactly one ingredient).
}
```

Feedback resolution (Req 4):

```js
export function evaluate(placedIds, recipes, attemptsByRecipe) {
    if (placedIds.length < 2) return { type: 'too-few' };
    const hit = matchRecipe(placedIds, recipes);
    if (hit) return { type: 'success', recipe: hit };
    const near = findNearMiss(placedIds, recipes);
    if (near) return { type: 'close', recipe: near,
                       hint: escalatedHint(near, attemptsByRecipe) };
    const flavour = flavourFor(placedIds);        // data-driven near-miss
    if (flavour) return { type: 'flavour', message: flavour };
    return { type: 'generic', message: GENERIC_FALLBACK };
}
```

- Pure functions, no React — unit-testable and reused by the hook.
- Engine never changes when ingredients/recipes data changes (Req 2.6).

### Hint escalation (3 tiers, Req 5.4)

Per-recipe attempt counter drives:
- tier 1 (0-1 close attempts): the recipe's vague `hint`.
- tier 2 (2-3): reveal the ingredient COUNT ("needs 3 ingredients").
- tier 3 (4+): reveal ONE ingredient ("one ingredient is Wires").

### Flavour / fallback (`src/craft/feedback.js`)

- A small data map of "meaningful but no project" combos → flavour text
  (Req 4.2), e.g. `code+code` → "Two bits of code... but what are we
  building?".
- `GENERIC_FALLBACK` for unrelated combos (Req 4.3).
- No fabricated project success (Req 4.5, 10.2).

---

## State + persistence (`src/craft/useCraftingState.js`)

```js
const STORAGE_KEY = 'craft:v1';
// shape: { discovered: [recipeId...], attempts: { recipeId: n },
//          masterCrafterCelebrated: bool }
```

- On load: read + JSON.parse in try/catch; if missing/malformed →
  empty state (Req 7.5).
- **Validate against current data** (Req 7.6, 2 /7.4): filter
  `discovered` to recipe IDs that still exist; ignore unknown IDs. The
  current `recipes` array is the source of truth, not the saved blob.
- Persist on change (discover, attempt, celebrate) (Req 7.1, 7.2).
- `reset()` → clears the key; the UI gates it behind a confirm step
  (Req 7.3).
- Versioned key (`craft:v1`) so a future breaking change can bump the
  version and ignore old data cleanly (Req 7.4).

### Master Crafter (Req 6)

- `requiredRecipeIds = recipes.filter(r => r.required).map(id)`.
- Earned when `discovered ⊇ requiredRecipeIds`.
- Celebration plays once: when earned AND
  `!masterCrafterCelebrated` → play, then set the flag (persisted), so
  it never auto-replays (Req 6.2, 6.3). Static "achieved" badge shown
  thereafter. Respects `prefers-reduced-motion` (Req 6.5).

---

## UI composition (`src/pages/Craft.jsx`)

```
Craft page (inside AppShell; its own pixel-styled layout)
  intro / theme line ("Combine disciplines to craft projects")
  <Inventory>            8 ingredient tiles (click to add to grid)
  <CraftingGrid>         2x2 slots; Craft button; Clear button
  <CraftResult>          shows crafted item; "View project" -> openItem()
  feedback banner        success / close-hint / flavour / generic
  <DiscoveryBook>        grid of result entries (locked/unlocked)
  <MasterCrafterCelebration/>   one-time overlay when newly earned
  reset button (with confirm)
```

- Interaction: **click-to-place** (click inventory tile → fills next
  empty grid slot; click a filled slot → removes it). Keyboard: tiles
  and slots are buttons (Enter/Space). (Drag optional/none — click is
  simpler and touch-friendly, Req 3.6.) 
- `openItem` comes from `useModal()`; resolving a result ID → normalised
  item: a small resolver maps result ID → the right record +
  normaliser (project/experience/achievement) so the EXISTING
  ContentModal opens (Req 5.6, 3). No duplicated content.

### Result resolver

```js
// src/craft/resolveResult.js
// resultId -> normalised ContentItem, searching projects (+ nested? no),
// experiences, achievements, via the existing normalisers.
```

---

## Discovery Book (`components/craft/DiscoveryBook.jsx`) — Req 5

- Entries derived from `recipes` (result IDs) — references existing data
  only (Req 5.1).
- Undiscovered → locked silhouette / obscured title (e.g. "???" + blocky
  censored icon) (Req 5.2); shows escalating hint text (Req 5.4).
- Discovered → shows the real title + hero image, visually distinct,
  clickable → `openItem` (Req 5.3, 5.6, 5.7).
- Progress indicator "X / N discovered" (Req 5.5).

---

## Pixel-art visual language (Path A) — Req 8

- **Pixel font** via Google Fonts (like existing JetBrains Mono): e.g.
  "Press Start 2P" (headings/labels) used sparingly for legibility, with
  body falling back to the existing mono. Imported in `base.css`.
- **Ingredient/result icons:** hand-authored inline SVG built from
  `<rect>` grids (true pixel look), `image-rendering: pixelated` where
  raster-ish, colored with the accent/token palette. One `IngredientIcon`
  component switches on `icon` id. Simple, geometric, on-brand — NOT
  Mojang textures.
- **Slots/grid/inventory:** blocky bordered cells using tokens
  (`--bg-sunken`, `--border-strong`), chunky inset/outset borders to
  evoke Minecraft slots, via `craft.css`.
- **Animations:** craft-success pop, celebration burst — all guarded by
  `prefers-reduced-motion` (Req 8.4).
- AppShell nav/footer retained so it reads as part of the portfolio
  (Req 8.3).

---

## Routing + entry points (Req 1)

- `App.js`: add `<Route path="/craft" element={<Craft />} />` inside the
  existing HashRouter/AppShell. HashRouter → direct load/refresh works,
  Pages/Amplify compatible (Req 1.1, 1.6).
- `NavBar`: add "Craft" `<Link to="/craft">` (Req 1.2).
- `Home` hero: add a "Try Crafting Mode" `LinkButton` next to "See my
  Gallery" with a pickaxe/crafting SVG icon (new `PickaxeIcon` in
  BrandIcons) (Req 1.3).

---

## Validation plan

1. `npm run build` + `CI=true npm run build` → succeed; asset check
   clean; no new runtime dependency (pixel font is a CSS @import).
2. Confirm (code): shapeless match works regardless of slot order;
   near-miss/flavour/generic feedback paths; discovery persists + reset
   confirms; Master Crafter earns once and doesn't replay; results open
   the existing ContentModal; Home/Gallery/portfolio unaffected.
3. Validate localStorage resilience: malformed/absent data → empty
   state; unknown saved IDs ignored.
4. No live browser → engine logic verified by code review (pure
   functions are deterministic); UI/animation/persistence need owner
   smoke-test; all recipe/ingredient content flagged placeholder.

---

## Files touched (planned)

| File | Change |
|---|---|
| `src/craft/ingredients.js` | NEW ingredient data (placeholders) |
| `src/craft/recipes.js` | NEW recipe data (placeholders, `required`) |
| `src/craft/craftingEngine.js` | NEW pure match/near-miss/evaluate |
| `src/craft/feedback.js` | NEW flavour + generic fallback |
| `src/craft/resolveResult.js` | NEW resultId → normalised ContentItem |
| `src/craft/useCraftingState.js` | NEW state + localStorage hook |
| `src/components/craft/*` | NEW pixel UI (grid, inventory, icon, result, book, celebration) |
| `src/pages/Craft.jsx` | NEW craft page |
| `src/styles/craft.css` | NEW pixel-art styles (import in base.css) |
| `src/styles/base.css` | import craft.css + pixel font @import |
| `src/App.js` | add `/craft` route |
| `src/components/NavBar.jsx` | add Craft link |
| `src/components/icons/BrandIcons.jsx` | add PickaxeIcon |
| `src/pages/Home.jsx` | add "Try Crafting Mode" hero button |

## Out of scope / future (data-only, no logic change)

- Mapping `software-internship` / `academic-representative` to recipes.
- `required: false` easter-egg recipes.
- Owner-supplied CC0/own PNG sprites (Path B) if richer art wanted.
