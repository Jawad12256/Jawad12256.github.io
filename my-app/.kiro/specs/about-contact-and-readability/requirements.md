# Spec 5 — About/Contact Rewrite and Readability

## Introduction

This spec makes the About and Contact sections data-driven (removing the
hardcoded placeholder copy and surfacing the owner's contact links), and
addresses three readability/layout refinements: too much blank space on
the right of every section, low-contrast body text, and a lack of
paragraphing in long text blocks.

The owner has (again) granted data-mutation permission for this spec,
specifically to add paragraphing throughout the site's text where it
improves readability, and to add About/Contact content to the data layer.

### Owner-reported items

1. Make About and Contact data-driven (currently hardcoded in
   `Home.jsx`); surface the real contact links (`profile.links`).
2. Every section has noticeable blank space on the right; loosen the
   restrictive width caps so text and cards flow more naturally toward
   the right edge.
3. Body text feels dreary / low-contrast; lighten the body-text token so
   it sits closer to the heading white.
4. Add sensible paragraphing to the site's text blocks (e.g. the hero
   introduction, long project/experience/achievement descriptions),
   where it improves readability. Agent decides the split for now; owner
   will fine-tune later.

### Authoritative context (verified on current `main`)

- About section: hardcoded `<p>` in `Home.jsx` (not from `profile`).
- Contact section: hardcoded `<p>`; `profile.links`
  (github/linkedin/email) are defined but rendered NOWHERE.
- `profile` has `greeting`, `title`, `introduction`, `marqueeItems`,
  `links`. It has NO `about` or `contact` fields yet.
- Width caps causing right-side blank space:
  - `.container` → `width: min(calc(100% - 2rem), var(--content-width))`
    with `--content-width: 1100px` (tokens.css).
  - `.section__content { max-width: 800px }` (components.css) — caps all
    section text well short of the container edge.
  - `.hero h1 { max-width: 800px }`, `.hero__description { max-width:
    650px }`.
- Body-text token: `--text-body: #aab2c0`; heading `--text-heading:
  #eef1f5` (tokens.css).
- Long descriptions are single large strings in the data files
  (`projects.js`, `experience.js`, `achievements.js`, `events.js`,
  `credentials.js`) and in `profile.introduction`.

---

## Requirements

### Requirement 1 — Data-driven About section

**User story:** As the portfolio owner, I want the About section driven
by data, so that its content lives with the rest of my portfolio data
and is easy to maintain.

#### Acceptance criteria

1. WHEN the About section renders THEN its content SHALL come from the
   data layer (e.g. a new `profile.about` field), NOT hardcoded JSX in
   `Home.jsx`.
2. WHEN `profile.about` is authored THEN it SHALL be factual and SHALL
   NOT invent new claims beyond what the owner has already stated
   elsewhere in the data/profile; existing meaning SHALL be preserved.
3. WHEN the About content supports multiple paragraphs THEN the data
   SHALL represent it in a way that renders as distinct paragraphs (see
   Requirement 5).
4. WHEN the About section is made data-driven THEN the section heading/
   eyebrow and ordering SHALL be preserved.

### Requirement 2 — Data-driven Contact section with links

**User story:** As a visitor, I want to reach the owner via their real
links, so that the Contact section is actually useful.

#### Acceptance criteria

1. WHEN the Contact section renders THEN it SHALL display the owner's
   links from `profile.links` (GitHub, LinkedIn, email), each as a
   working link (email as a `mailto:`).
2. WHEN the Contact copy renders THEN it SHALL come from the data layer
   (e.g. a new `profile.contact` field), not hardcoded JSX.
3. WHEN links are rendered THEN they SHALL open appropriately (external
   links in a new tab with `rel="noreferrer noopener"`; `mailto:` in the
   default handler) and SHALL be styled using existing tokens.
4. WHEN a link value is missing THEN that link SHALL be omitted cleanly
   rather than rendering an empty/broken anchor.
5. WHEN the Contact section is rendered THEN it SHALL NOT fabricate any
   contact detail not present in `profile.links`.

### Requirement 3 — Looser content width (reduce right-side blank space)

**User story:** As a visitor, I want sections to use more of the page
width, so that there isn't a large empty band on the right.

#### Acceptance criteria

1. WHEN sections render on a wide viewport THEN text and cards SHALL use
   more of the available width than at present, reducing the perceived
   right-side blank space.
2. WHEN the content width is loosened THEN it SHALL be done via the
   existing layout tokens/architecture (e.g. increasing
   `--content-width` and/or relaxing `.section__content`,
   `.hero__*` max-widths), not ad-hoc per-element hacks.
3. WHEN body text lines get wider THEN they SHALL remain comfortably
   readable (an extremely long measure/line length SHALL be avoided; a
   sensible upper bound MAY be retained for prose while still being
   wider than today).
4. WHEN the width changes THEN the layout SHALL remain centered and
   consistent across all sections, with no horizontal overflow.
5. WHEN viewed on smaller viewports THEN the existing responsive
   behaviour SHALL remain intact (the side gutter SHALL be preserved on
   narrow screens).

### Requirement 4 — Higher-contrast body text

**User story:** As a visitor, I want body text that is easy to read, so
that the content doesn't feel dreary or low-contrast.

#### Acceptance criteria

1. WHEN body text renders THEN the `--text-body` token SHALL be
   lightened so it sits closer to the heading colour while remaining
   distinct from pure heading white.
2. WHEN the token is changed THEN it SHALL be changed in `tokens.css` so
   the new value applies consistently everywhere body text is used.
3. WHEN the new body colour is chosen THEN it SHALL provide clearly
   better contrast against the dark backgrounds than `#aab2c0`, while
   preserving the dark/technical/minimal aesthetic.
4. WHEN the change is made THEN dim/secondary text (`--text-dim`) and
   headings SHALL remain visually distinct from the new body colour (the
   hierarchy SHALL NOT collapse).

### Requirement 5 — Paragraphing of text blocks

**User story:** As a visitor, I want long text split into paragraphs, so
that it is easier to read.

#### Acceptance criteria

1. WHEN a long text block (e.g. the hero introduction, project/
   experience/achievement/event/credential descriptions) is displayed
   THEN it SHALL be broken into sensible paragraphs where this improves
   readability.
2. WHEN paragraphing is introduced THEN the data SHALL represent
   multi-paragraph text in a consistent, documented way (e.g. an array
   of paragraph strings, or a convention for splitting), and the
   renderers (hero, Section content, ContentModal) SHALL render each
   paragraph as a separate block with appropriate spacing.
3. WHEN text is re-paragraphed THEN NO wording SHALL be changed, added,
   or removed — only paragraph breaks SHALL be introduced (the agent
   chooses the breaks; the owner will fine-tune later).
4. WHEN the hero introduction specifically is paragraphed THEN each
   sentence/idea MAY become its own short paragraph for readability, per
   the owner's stated preference.
5. WHEN the multi-paragraph representation is adopted THEN existing
   single-string consumers SHALL continue to work (backward-compatible
   rendering: a plain string still renders as one paragraph).

### Requirement 6 — Reuse, consistency and no regression

**User story:** As the portfolio owner, I want these changes consistent
with the design system and non-breaking.

#### Acceptance criteria

1. WHEN changes are made THEN they SHALL reuse the existing CSS/token,
   component, data and util architecture; no new runtime dependency
   SHALL be added without clear justification.
2. WHEN the data model is mutated (profile about/contact, paragraphed
   descriptions) THEN no existing information SHALL be discarded, and the
   normalisation layer and ContentModal SHALL continue to work.
3. WHEN implementation is complete THEN `npm run build` (including
   `CI=true`) SHALL succeed with no unresolved imports or assets.
4. WHEN implementation is complete THEN all sections, the content modal,
   nav anchors, footer, marquee animation and card hero images SHALL
   remain intact.
5. WHEN unrelated backlog items (Gallery, Crafting Mode) are noticed
   THEN they SHALL NOT be implemented here.

### Requirement 7 — Content accuracy

**User story:** As the portfolio owner, I want nothing invented, so that
the portfolio stays truthful.

#### Acceptance criteria

1. WHEN About/Contact content is authored or text is re-paragraphed THEN
   no personal claim, achievement, link, or detail SHALL be invented or
   altered in meaning.
2. WHEN the agent is unsure whether a paragraphing split changes meaning
   or whether About copy would introduce a new claim THEN it SHALL err
   toward preserving the existing wording exactly and SHALL flag any
   genuine ambiguity to the owner.
