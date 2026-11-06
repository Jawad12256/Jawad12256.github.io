# Spec 11 — Crafting Mode

## Introduction

Crafting Mode is an optional, Minecraft-inspired mini-experience at
`/craft` where visitors combine engineering ingredients (disciplines,
skills, tools, materials) in a 2×2 crafting grid to discover recipes
that unlock existing portfolio projects. Discovered projects are tracked
in a Discovery Book and explored via the EXISTING ContentModal.
Completing all recipes earns a one-time "Master Crafter" achievement.
Everything is client-side; progress persists in localStorage.

The underlying theme: Design Engineering is about combining disciplines
to create something new — communicated through the mechanic, not just
the look.

### Standing constraints (steering + prior specs)

- Fully OPTIONAL: every project/section remains browsable normally
  without ever using Crafting Mode.
- Recipes/Discovery Book reference existing project IDs and data — NO
  duplicated project content or parallel data.
- Game logic kept SEPARATE from portfolio presentation components.
- No backend, database, accounts, or AI calls.
- Reuse the existing ContentModal + ModalContext (from Spec 10) for
  viewing projects.
- Uses the existing HashRouter routing; works on direct load/refresh and
  stays compatible with GitHub Pages + AWS Amplify.
- Dark/technical/minimal identity retained, with a pixel-art visual
  language layered on top for the crafting UI.

### Pixel-art approach (CONFIRMED: Path A)

**Path A** — pixel-art built from CSS + hand-authored SVG + a pixel
web-font (no raster sprite files, no new runtime dependency, no
third-party/Mojang textures). Owner may later supply CC0/own PNG sprites
(Path B) to drop in.

### Craftable result IDs (CONFIRMED: projects + experiences + achievements)

- Projects (8): `pythonic-cfd`, `morsemaster`, `megabite`,
  `electronics-1-rc-car`, `data-science`, `3d-printing`, `minecraft`,
  `splatoon`.
- Experiences (3): `software-internship`, `tutoring`,
  `academic-representative`.
- Achievements (3): `uk-space-design`, `f1-in-schools`,
  `student-robotics`.

### Ingredients (CONFIRMED style: concrete, tangible nouns)

Concrete/tangible items (good: Robots, Code, Simulation, Manufacturing,
Gaming controller, Wheels, Wires, 3D Printer). NOT abstract soft-skills
(bad: Critical Thinking, Problem Solving). All ingredients available from
the start. Agent authors best-guess placeholder ingredients + recipes
for owner review.

### Resolved decisions (from owner)

- Results include projects, experiences AND achievements.
- Recipes carry a `required: true` flag; only the required subset gates
  Master Crafter (so easter-egg/bonus recipes can be added later).
- All ingredients available from the start (pure combination puzzle).
- Discovery Book lists only craftable results (those with recipes).
- Hint escalation: 3-tier (vague theme → ingredient count → reveal one
  ingredient).

---

## Requirements

### Requirement 1 — Route, entry points, and optionality

**User story:** As a visitor, I want to reach Crafting Mode easily but
never be forced into it, so the portfolio stays fully usable without it.

#### Acceptance criteria

1. WHEN routing is used THEN a `/craft` route SHALL render the Crafting
   Mode page within the existing router/AppShell, working on direct load
   and refresh (HashRouter → no server fallback needed).
2. WHEN the nav bar renders THEN it SHALL include a link to `/craft`
   (client-side navigation).
3. WHEN the hero/top section renders THEN it SHALL include a prominent
   button to Crafting Mode alongside the existing "See my Gallery"
   button, using the shared LinkButton/BrandIcon styling with a suitable
   (e.g. pickaxe/crafting) icon.
4. WHEN a visitor never opens Crafting Mode THEN ALL projects,
   experience, and other sections SHALL remain fully browsable as
   normal.
5. WHEN Crafting Mode is implemented THEN its game logic SHALL live in
   separate modules/data from the portfolio presentation components.
6. WHEN the `/craft` route is added THEN it SHALL remain compatible with
   both GitHub Pages and the AWS Amplify config intent.

### Requirement 2 — Data-driven ingredients and recipes

**User story:** As the portfolio owner, I want ingredients and recipes
defined in data so I can add/adjust them without touching crafting logic.

#### Acceptance criteria

1. WHEN ingredients are defined THEN they SHALL live in a data file as a
   list of `{ id, label, icon? }` (icon = a pixel/SVG glyph reference),
   starting with approximately 8 ingredients.
2. WHEN recipes are defined THEN they SHALL live in a data file in a
   shape conceptually like:
   `{ id, ingredients: [ingredientId, ...], result: projectId, hint }`,
   and SHALL start with approximately 8-12 recipes.
3. WHEN a recipe is defined THEN its `result` SHALL be an existing
   project ID (no duplicated project content); the crafting UI SHALL
   resolve project details via the existing data/normalisation layer.
4. WHEN recipes are matched THEN matching SHALL be SHAPELESS: the order
   and grid position of ingredients SHALL NOT matter; only the multiset
   of ingredients SHALL determine a match.
5. WHEN recipe complexity varies THEN most recipes SHALL use two
   ingredients, with a few using three or four.
6. WHEN new ingredients/recipes are added to the data files THEN NO
   change to the crafting engine logic SHALL be required.
7. WHEN recipe data is authored THEN each recipe SHALL map to a real
   project in a way that is thematically sensible (ingredients reflect
   that project's disciplines/skills/tools); exact mappings are authored
   content (placeholders acceptable for owner review).

### Requirement 3 — Crafting grid interaction

**User story:** As a visitor, I want to place ingredients into a 2×2
grid and attempt combinations to discover recipes.

#### Acceptance criteria

1. WHEN the crafting page loads THEN it SHALL present an inventory of the
   available ingredients and a 2×2 crafting grid with four slots.
2. WHEN a visitor selects/places ingredients THEN they SHALL be able to
   put ingredients into the grid slots and remove/clear them, using the
   inventory (click-to-place and/or drag — approach set in design).
3. WHEN ingredients are placed and a craft is attempted THEN the system
   SHALL evaluate the multiset of placed ingredients against the recipe
   data (shapeless).
4. WHEN a valid recipe is matched THEN the system SHALL produce the
   crafted result (the associated project) and mark that recipe as
   discovered.
5. WHEN the grid is evaluated THEN duplicate ingredients and partial
   fills SHALL be handled deterministically (e.g. an empty-grid or
   single-ingredient attempt yields a defined feedback, not an error).
6. WHEN interaction occurs THEN it SHALL be keyboard-accessible and
   usable on touch devices, consistent with the rest of the site.

### Requirement 4 — Thoughtful failure/feedback handling

**User story:** As a visitor, I want interesting feedback on
combinations that don't craft a project, so experimenting feels
rewarding rather than dead-ended.

#### Acceptance criteria

1. WHEN a combination is NOT a valid recipe but is CLOSE (e.g. shares
   most ingredients with a real recipe) THEN the system SHALL provide a
   useful hint nudging toward the real recipe.
2. WHEN a combination is meaningful but produces no project THEN the
   system SHALL provide interesting contextual feedback (data-driven
   "near-miss"/flavour responses).
3. WHEN a combination is completely unrelated THEN a generic fallback
   message SHALL be shown.
4. WHEN failed combinations occur THEN they SHALL be tracked where
   appropriate (e.g. to escalate hint helpfulness over repeated
   attempts) rather than simply ignored.
5. WHEN feedback is shown THEN it SHALL never fabricate a project or
   falsely claim a craft succeeded.

### Requirement 5 — Discovery Book

**User story:** As a visitor, I want a Discovery Book that shows what
I've unlocked and nudges me toward what I haven't.

#### Acceptance criteria

1. WHEN the Discovery Book renders THEN it SHALL list all
   craftable/discoverable projects, referencing existing project IDs and
   data (no duplicated content).
2. WHEN a project is undiscovered THEN it SHALL appear as a locked
   silhouette / obscured entry.
3. WHEN a project is discovered THEN it SHALL appear distinctly
   (unlocked, visually celebrated).
4. WHEN a project is undiscovered THEN the Book SHALL provide clues and
   progressively more helpful hints for its recipe (escalating with
   attempts/progress).
5. WHEN the Book renders THEN it SHALL show overall discovery progress
   (e.g. X of N discovered, a progress indicator).
6. WHEN a discovered project is selected (from the Book OR from a fresh
   craft) THEN it SHALL open the EXISTING ContentModal for that project
   (same modal as the portfolio), not a separate project modal.
7. WHEN the Book is used THEN previously discovered projects SHALL remain
   revisitable.

### Requirement 6 — Master Crafter achievement (one-time celebration)

**User story:** As a visitor, I want a satisfying reward for discovering
everything, shown once when earned.

#### Acceptance criteria

1. WHEN all required recipes have been discovered THEN a "Master
   Crafter" achievement SHALL be earned.
2. WHEN the achievement is FIRST earned THEN a satisfying completion
   animation/celebration SHALL play once.
3. WHEN the user revisits the page after earning it THEN the celebration
   SHALL NOT replay automatically (earned state persisted); the achieved
   status MAY still be displayed statically.
4. WHEN "all required recipes" is defined THEN the required set SHALL be
   derived from the recipe data (design specifies whether every recipe
   or a designated subset counts), so it adapts if recipes change.
5. WHEN reduced motion is preferred THEN the celebration SHALL respect
   `prefers-reduced-motion` (no gratuitous animation).

### Requirement 7 — Persistence (localStorage) and resilience

**User story:** As a visitor, I want my progress remembered between
visits, with a way to reset, and without breakage if recipes change.

#### Acceptance criteria

1. WHEN discoveries, failed combinations (where tracked), and
   achievement state change THEN they SHALL be saved to localStorage
   under a versioned/namespaced key.
2. WHEN the page is revisited THEN saved progress SHALL be restored.
3. WHEN a reset option is used THEN it SHALL require a confirmation step
   before clearing saved progress.
4. WHEN recipe/ingredient/project IDs change between versions THEN old
   saved progress SHALL be handled gracefully (ignore unknown IDs,
   reconcile against current data) WITHOUT throwing or corrupting the
   experience.
5. WHEN localStorage is unavailable or data is malformed THEN the app
   SHALL degrade gracefully (treat as no saved progress) rather than
   crashing.
6. WHEN state is read THEN discovery/achievement status SHALL always be
   validated against the CURRENT recipe data (the current data is the
   source of truth, not stale saved IDs).

### Requirement 8 — Pixel-art visual language, consistent identity

**User story:** As a visitor, I want Crafting Mode to look like a fun
Minecraft-inspired space that still clearly belongs to this portfolio.

#### Acceptance criteria

1. WHEN the crafting UI renders THEN it SHALL use a pixel-art visual
   language (pixel/blocky item slots, grid, inventory, buttons, a pixel
   web-font) layered on the site's existing dark/accent design tokens.
2. WHEN pixel art is produced THEN it SHALL (Path A default) be built
   from CSS and hand-authored SVG with no raster sprite dependency and
   no third-party/Mojang textures; IF the owner supplies CC0/own sprites
   (Path B) THEN those SHALL be wired in without duplicating assets.
3. WHEN the crafting page renders THEN the shared AppShell nav/footer and
   overall identity SHALL remain, so it reads as part of the portfolio.
4. WHEN animations are used (craft success, celebration) THEN they SHALL
   respect `prefers-reduced-motion`.

### Requirement 9 — Reuse, consistency, no regression

#### Acceptance criteria

1. WHEN changes are made THEN they SHALL reuse existing component/data/
   util/CSS architecture and the ModalContext; new runtime dependencies
   SHALL be avoided (a pixel web-font via Google Fonts, like the
   existing JetBrains Mono, is acceptable; no game/engine library unless
   justified).
2. WHEN implementation is complete THEN `npm run build` (incl. `CI=true`)
   SHALL succeed with no unresolved imports or assets.
3. WHEN implementation is complete THEN the existing Home, Gallery, all
   sections, the ContentModal, nav, footer, marquee, and deploy workflow
   SHALL remain functional.
4. WHEN crafting logic is organised THEN it SHALL be isolated (e.g.
   `src/craft/` or similar) and SHALL NOT entangle portfolio
   presentation components with game state.

### Requirement 10 — Content accuracy

#### Acceptance criteria

1. WHEN recipes map ingredients to projects THEN they SHALL not
   misrepresent a project (ingredients should plausibly reflect that
   project's real disciplines/skills/tools).
2. WHEN hints/feedback text is authored THEN it SHALL not fabricate
   project facts; flavour text is clearly game-flavour, project facts
   come only from the existing data via the ContentModal.

---

## Open questions — RESOLVED

All open questions are now resolved (see "Resolved decisions" above):
Path A; results include projects + experiences + achievements; agent
authors concrete placeholder ingredients + recipes for review;
`required: true` subset gates Master Crafter; all ingredients available
from the start; Discovery Book lists craftable results only; 3-tier hint
escalation. Remaining fine detail is a design/implementation concern and
all placeholder content is explicitly for owner review.
