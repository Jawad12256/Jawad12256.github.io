# Spec 5 — About/Contact Rewrite and Readability — Design

## Overview

Five changes: make About and Contact data-driven, widen the content
column, lift body-text contrast, and introduce a backward-compatible
multi-paragraph representation applied across the site's text. All within
the existing token/component architecture; no new dependencies.

### Verified baseline (current `main`)

- About/Contact copy is hardcoded `<p>` in `Home.jsx`; `profile.links`
  rendered nowhere.
- `profile` = { name, greeting, title, profilePhoto, introduction,
  marqueeItems, links }. No `about`/`contact`.
- `.container` caps at `--content-width: 1100px`; `.section__content`
  caps at 800px; `.hero h1` 800px; `.hero__description` 650px.
- `--text-body: #aab2c0`, `--text-heading: #eef1f5`, `--text-dim:
  #5b6472`.
- Descriptions are single strings in data files and
  `profile.introduction`; rendered by Section children, the hero, and
  ContentModal.

---

## Change 1 — Multi-paragraph representation (foundation; Req 5)

Introduce ONE backward-compatible convention used everywhere, so the
other text changes build on it.

### Helper (src/utils/paragraphs.js, new)

```js
// Normalises paragraph input to an array of non-empty strings.
// Accepts: string[] (returned as-is), or a string (split on blank
// lines / explicit \n\n), so existing single-string data still works.
export function toParagraphs(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string') {
        return value.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
    }
    return [];
}
```

### Renderer (src/components/Paragraphs.jsx, new)

```jsx
import { toParagraphs } from '../utils/paragraphs';

function Paragraphs({ text, className }) {
    const paras = toParagraphs(text);
    return paras.map((p, i) => (
        <p key={i} className={className}>{p}</p>
    ));
}
export default Paragraphs;
```

- Any consumer passing a plain string still renders one paragraph
  (Req 5.5). A consumer passing an array renders multiple (Req 5.2).
- Used by: the hero introduction, `Section` prose (About/Contact),
  `ContentModal` description + sub-item descriptions.

### Data representation (Req 5.2, 5.3)

Convert long descriptions to **arrays of paragraph strings**, preserving
wording exactly — only inserting breaks (Req 5.3). Applies to:
`profile.introduction`, `profile.about`, and the `description` fields in
`projects.js`, `experience.js` (incl. nested projects), `achievements.js`,
`events.js`, `credentials.js`.

> Decision: arrays (not embedded `\n\n`) are the primary representation —
> explicit, diff-friendly, and unambiguous. `toParagraphs` still accepts
> strings so the change can be incremental and nothing breaks if a field
> is left as a string.

> Accuracy guard: splits are inserted only at existing sentence/idea
> boundaries; no word is changed/added/removed (Req 5.3, 7.1). The hero
> intro is split so each sentence/idea is its own short paragraph
> (Req 5.4).

---

## Change 2 — Data-driven About (Req 1)

Add to `profile`:

```js
about: [
  // paragraphs derived from existing About intent + profile, no new
  // claims. Draft (owner to fine-tune):
  'I\'m a Design Engineering student at Imperial College London...',
  '...'
]
```

- Source the wording from the current About paragraph and the existing
  `introduction`/profile — NOT inventing achievements (Req 1.2, 7.1).
- `Home.jsx` About section renders `<Paragraphs text={profile.about} />`
  instead of the inline `<p>` (Req 1.1).
- Eyebrow/title/order unchanged (Req 1.4).

> If faithful About copy would require asserting anything not already
> stated, that is flagged to the owner rather than invented. The initial
> draft will stay close to the existing sentence.

---

## Change 3 — Data-driven Contact + links (Req 2)

Add to `profile`:

```js
contact: [ 'Short factual contact blurb ...' ]
// links already exist: { github, linkedin, email }
```

### Rendering (Home.jsx Contact section)

```jsx
<Paragraphs text={profile.contact} />
<div className="contact-links">
  {profile.links.github && <a href={github} target="_blank"
       rel="noreferrer noopener">GitHub</a>}
  {profile.links.linkedin && <a href=... >LinkedIn</a>}
  {profile.links.email && <a href={`mailto:${email}`}>Email</a>}
</div>
```

- Email → `mailto:` (Req 2.1, 2.3). Missing values omitted (Req 2.4).
- Links styled with existing tokens (reuse the modal link / accent
  styling pattern) (Req 2.3).
- No fabricated contact details (Req 2.5).

---

## Change 4 — Looser content width (Req 3)

Two coordinated adjustments in the token/CSS layer:

1. **Widen the container** (`tokens.css`):
   `--content-width: 1100px` → `1280px` (wider column, less side blank
   space, still centered).

2. **Relax the prose caps** (`components.css`):
   - `.section__content { max-width: 800px }` → raise to a wider measure
     (e.g. `70ch` ≈ comfortable max line length, which at the body font
     is wider than 800px but still bounded) OR a larger px value; chosen
     to be clearly wider than today while avoiding an over-long measure
     (Req 3.3).
   - `.hero h1 { max-width: 800px }` → widen (e.g. 900–960px) or drop.
   - `.hero__description { max-width: 650px }` → widen (e.g. ~70ch).

- Grids (`max-width: none`) already fill the container, so widening
  `--content-width` immediately gives three cards more room (Req 3.1).
- Centered layout and `calc(100% - 2rem)` gutter preserved, so no
  horizontal overflow and narrow-screen gutter remains (Req 3.4, 3.5).

> Exact final numbers are tunable and will be stated for the owner. The
> intent: noticeably wider, still a readable measure for prose.

---

## Change 5 — Higher-contrast body text (Req 4)

In `tokens.css`, lighten `--text-body`:

```
--text-body: #aab2c0;  ->  e.g. #c9d1dc  (closer to heading #eef1f5,
                             still clearly below pure heading white)
```

- Single token change propagates everywhere (Req 4.1, 4.2).
- Keeps hierarchy: heading `#eef1f5` (lightest) > body (new, lighter
  mid) > dim `#5b6472` (unchanged, clearly darker) — hierarchy preserved
  (Req 4.4).
- Final hex tunable; chosen for clearly improved contrast on `#0a0c10`/
  `#12151b` while staying in the cool-grey family (Req 4.3).

> Contrast sanity: `#c9d1dc` on `#0a0c10` is a high ratio (well above
> WCAG AA for body text); it reads brighter without becoming pure white.

---

## Consistency / no regression (Req 6)

- New files: `utils/paragraphs.js`, `components/Paragraphs.jsx`. Reuse
  everywhere prose is rendered.
- `normaliseContent.js` keeps `description` as-is (string or array);
  ContentModal switches to `<Paragraphs text={item.description} />` so
  both forms render (Req 6.2).
- No new runtime dependency.

## Validation plan

1. `npm run build` + `CI=true npm run build` → succeed; asset check
   clean.
2. Confirm About/Contact render from data; contact links work
   (external + mailto); modal + sub-items still render descriptions.
3. Confirm single-string descriptions still render (backward compat) for
   any field not yet converted.
4. Diff review: wording unchanged except paragraph breaks; token changes
   isolated; sections/modal/nav/footer/marquee/hero images intact.
5. No live browser here → width/contrast/paragraphing verified via build
   + code; owner smoke-test recommended; tunable values (content width,
   prose max-width, body colour hex) flagged.

---

## Files touched (planned)

| File | Change | Requirements |
|---|---|---|
| `src/utils/paragraphs.js` | New — `toParagraphs` helper | 5 |
| `src/components/Paragraphs.jsx` | New — paragraph renderer | 5 |
| `src/data/profile.js` | Add `about`, `contact`; paragraph the intro | 1, 2, 5 |
| `src/data/projects.js` | Paragraph descriptions (array form) | 5 |
| `src/data/experience.js` | Paragraph descriptions (incl. nested) | 5 |
| `src/data/achievements.js` | Paragraph descriptions | 5 |
| `src/data/events.js` | Paragraph descriptions | 5 |
| `src/data/credentials.js` | Paragraph description | 5 |
| `src/pages/Home.jsx` | About/Contact data-driven; use Paragraphs | 1, 2 |
| `src/components/ContentModal.jsx` | Render description via Paragraphs | 5 |
| `src/styles/tokens.css` | Widen `--content-width`; lighten `--text-body` | 3, 4 |
| `src/styles/components.css` | Relax prose max-widths; contact-links style | 3, 2 |

## Out of scope (deferred)

- Gallery; Crafting Mode.
- Any copy rewriting beyond paragraph breaks + the About/Contact data
  move (no new claims).
