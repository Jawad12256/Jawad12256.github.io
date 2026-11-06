# Spec 13 — Visual Flair and Polish

## Introduction

A batch of visual/interaction polish: craft result consumes ingredients,
Minecraft-style sliding notifications, tighter craft-page top spacing,
mute-button padding, larger accent eyebrow/category text, bolder button
text, a subtle extruded-square background pattern (with gradient + an
optional animated spark), and scroll-triggered fade/slide-up section
reveals.

The animated background is explicitly an EXPERIMENT the owner may ask to
remove; it must be built so it can be cleanly reverted.

### Owner-requested items

1. Clicking the crafted result (successful craft) SHALL also clear the
   grid slots ("using up" the ingredients).
2. Craft notifications SHALL slide in and slide out (Minecraft-style),
   not just fade.
3. Remove the extra empty space above "// CRAFTING MODE" at the top of
   the craft page so the title sits closer to the top and everything
   shifts up into view. (Same first-section top-gap applies to the
   Gallery page.)
4. Add padding between the intro text and the mute button (currently too
   close).
5. Make the accent green text on main-site cards (e.g. project category)
   ~15-30% bigger — still smaller than the title. Apply the same bump to
   the double-slash section eyebrows (e.g. "01 // PROJECTS").
6. Add a subtle background pattern on ALL pages: squares extruding from
   the left and right edges, coloured close to the page background but
   hinted toward the mint-green accent, with a gentle gradient through
   them. Must be very subtle and not detract. The background SHALL be
   fixed/attached to the viewport NOT scrolling with content (scrolling
   reveals different parts). OPTIONAL bonus: a mint spark of light
   tracing the perimeter of the square patterns. (This whole item is an
   experiment — build it to be easily removable.)
7. Add a slide-up + fade-in transition to each section as it scrolls into
   view.
8. Make all button text bold (bold font weight / font if needed).

### Authoritative context (verified on current `main`)

- `.section { padding-block: 6rem }` — on single-section pages (Craft,
  Gallery) this creates a large top gap before the first eyebrow.
- `.hero__eyebrow, .section__eyebrow { font-size: var(--text-sm);
  font-weight: 600 }`.
- `.project-card__category`, `.card__meta { font-size: var(--text-xs) }`.
- Craft notifications currently use a `toast-in` keyframe (slide in from
  the right) but are removed after a fixed timeout without a slide-OUT
  animation; the page controls timing.
- Buttons: `.link-button`, `.craft-button`, `.contact-link`, nav links,
  etc. `.link-button`/`.craft-button` already use `font-weight: 600`;
  "bold" implies `700`.
- `AppShell` wraps `<Navbar/> <main>{children}</main> <Footer/>`; body
  background is a flat `var(--bg)`.
- `Section` renders `<section class="section"><div class="container">
  ...</div></section>`.
- Craft page `collect(resultId)` opens the modal but does NOT clear the
  grid.
- `prefers-reduced-motion` is respected elsewhere and must be here too.

---

## Requirements

### Requirement 1 — Crafting consumes ingredients

**User story:** As a visitor, I want crafting to "use up" the
ingredients, so the grid clears when I take the result.

#### Acceptance criteria

1. WHEN a visitor activates the result slot for a successful craft THEN
   the grid slots SHALL be cleared afterwards.
2. WHEN the grid clears THEN the result slot SHALL also clear (no recipe
   is present once ingredients are gone).
3. WHEN clearing occurs on collect THEN it SHALL NOT trigger the
   remove/"clearclicked" sound for each slot (collecting is distinct
   from manual removal) — OR it SHALL play at most once; the behaviour
   SHALL be deliberate and not a burst of sounds.
4. WHEN the result is collected THEN discovery/modal behaviour SHALL
   remain as before (new discovery registers + opens modal; known opens
   modal).

### Requirement 2 — Sliding notifications

**User story:** As a visitor, I want craft notifications to slide in and
out like Minecraft advancements.

#### Acceptance criteria

1. WHEN a notification appears THEN it SHALL slide IN (e.g. from the
   right/top-right).
2. WHEN a notification is dismissed THEN it SHALL slide OUT (animated),
   not just disappear.
3. WHEN the slide-out completes THEN the toast SHALL be removed from the
   DOM.
4. WHEN multiple notifications are present THEN each SHALL slide
   independently without layout jumps.
5. WHEN `prefers-reduced-motion` is set THEN the slide SHALL be reduced
   to a minimal fade (still appears/disappears, no large motion).
6. WHEN notification in/out sounds are wired THEN they SHALL stay in
   sync with the slide-in and slide-out.

### Requirement 3 — Tighter first-section top spacing

**User story:** As a visitor, I want the craft (and gallery) page content
to start near the top, not after a big gap.

#### Acceptance criteria

1. WHEN a page's FIRST section renders THEN its top spacing SHALL be
   noticeably reduced so the eyebrow/title sits close to the top (below
   the fixed nav), shifting the whole page content up into view.
2. WHEN the home page renders THEN its existing hero-first layout SHALL
   NOT regress (the hero already sits at the top).
3. WHEN the fix is applied THEN mid-page sections SHALL keep their normal
   spacing/`border-top` separation.

### Requirement 4 — Mute button spacing

#### Acceptance criteria

1. WHEN the craft toolbar renders THEN there SHALL be comfortable spacing
   between the intro text and the mute button (not cramped).

### Requirement 5 — Larger accent eyebrow / category text

**User story:** As a visitor, I want the accent labels a bit more
prominent.

#### Acceptance criteria

1. WHEN section eyebrows (e.g. "01 // PROJECTS") render THEN their font
   size SHALL be ~15-30% larger than current, still clearly smaller than
   the section title.
2. WHEN card accent labels (project category / card meta) render THEN
   they SHALL be ~15-30% larger than current, still smaller than the
   card title.
3. WHEN sizes change THEN the hierarchy (title > eyebrow/category) SHALL
   be preserved and layouts SHALL NOT break/wrap awkwardly.

### Requirement 6 — Subtle extruded-square background (experiment)

**User story:** As a visitor, I want a subtle, tasteful background that
adds depth without distracting.

#### Acceptance criteria

1. WHEN any page renders THEN a subtle background pattern SHALL appear,
   consisting of squares extruding inward from the LEFT and RIGHT edges
   of the viewport.
2. WHEN the squares render THEN their colour SHALL be close to the page
   background (`--bg`) but hinted toward the mint accent (`--accent`),
   with a gentle gradient through them, and SHALL be subtle enough not to
   detract from the content.
3. WHEN the user scrolls THEN the background SHALL be viewport-fixed (it
   does NOT scroll with the content; scrolling reveals different content
   over a steady background).
4. WHEN the background is added THEN it SHALL sit BEHIND all content
   (z-index) and SHALL NOT capture pointer events or harm readability/
   contrast.
5. OPTIONAL BONUS: a small mint spark of light MAY animate along the
   perimeter of the square pattern; IF included it SHALL be subtle and
   respect `prefers-reduced-motion` (no animation when reduced motion is
   set).
6. WHEN this feature is implemented THEN it SHALL be isolated (e.g. a
   single Background component + its own CSS) so it can be cleanly
   REMOVED on request without affecting other styles.
7. WHEN the background cannot be made tasteful/performant THEN it is
   acceptable to simplify or drop it (owner has flagged this item as the
   most likely to be reverted).

### Requirement 7 — Scroll-reveal section transitions

**User story:** As a visitor, I want sections to gently animate in as I
scroll, for a polished feel.

#### Acceptance criteria

1. WHEN a section scrolls into view THEN it SHALL animate with a subtle
   slide-up + fade-in.
2. WHEN a section has already been revealed THEN it SHALL remain visible
   (no re-hiding on scroll up) — the reveal is a one-time per-section
   effect.
3. WHEN implemented THEN it SHALL use an efficient mechanism
   (IntersectionObserver), not scroll-event thrashing.
4. WHEN `prefers-reduced-motion` is set THEN sections SHALL appear
   without the motion (immediately visible, no transform).
5. WHEN JavaScript/observer is unavailable THEN content SHALL still be
   visible (graceful fallback — never leave sections stuck hidden).

### Requirement 8 — Bold button text

#### Acceptance criteria

1. WHEN buttons render (link buttons, craft buttons, contact links, nav
   links where styled as actions) THEN their text SHALL be bold
   (font-weight 700, using a bold font/weight available from the loaded
   families).

### Requirement 9 — Reuse, consistency, no regression

#### Acceptance criteria

1. WHEN changes are made THEN they SHALL reuse the existing token/
   component architecture; no new runtime dependency (background +
   scroll-reveal implemented with CSS + a small IntersectionObserver
   hook, no animation library).
2. WHEN implementation is complete THEN `npm run build` (incl. `CI=true`)
   SHALL succeed with no unresolved imports or assets.
3. WHEN implementation is complete THEN all pages (Home, Gallery, Craft),
   the ContentModal, nav, footer, marquee, card heroes, and crafting
   behaviour SHALL remain functional.
4. WHEN animations are added THEN they SHALL respect
   `prefers-reduced-motion` throughout.
5. WHEN the background experiment is in place THEN removing it SHALL be a
   localised change (one component + one CSS file + one mount point).
