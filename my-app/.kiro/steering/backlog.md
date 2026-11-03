---
inclusion: manual
---

# Deferred Backlog

Items noticed during earlier specs but intentionally not fixed yet, to
be folded into a future spec (most likely the bulk React / visual design
spec). Not a commitment to scope — review before planning.

## Visual / layout

- **Hero portrait is too large.** The profile photo rendered in the hero
  (`src/pages/Home.jsx` `.hero__photo` → `profile.profilePhoto`; styling
  via `src/styles/components.css`) displays too big. Target: roughly
  halve its displayed width AND height (about a quarter of current area),
  kept proportional. (Owner referred to this as the "About section"
  image; the About section currently has no image — the only profile
  photo on the page is the hero portrait. Confirm element before
  implementing.) There is currently no explicit sizing rule for
  `.hero__photo img`, so a constrained size should be added.

- **IdentityMarquee does not animate.** `.identity-marquee__track` has
  hover-pause and reduced-motion rules but no `animation` defined, so it
  renders as a static row rather than a scrolling marquee
  (`src/styles/components.css`, `src/components/IdentityMarquee.jsx`).

## Content

- **About / Contact copy is hardcoded placeholder text**, not driven by
  `profile` data; `profile.links` (github/linkedin/email) are defined but
  not rendered anywhere. Consider a data-driven rewrite.

## Later features (already known)

- Gallery derived from existing project/experience images (no
  duplication).
- Minecraft-inspired Crafting Mode (optional; must not block ordinary
  content).
