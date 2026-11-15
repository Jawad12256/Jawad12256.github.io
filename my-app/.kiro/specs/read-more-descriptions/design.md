# Spec 18 — "Read more" for long modal descriptions — Design

## Overview

Add an opt-in `collapsible` mode to `Paragraphs`. When enabled AND the
combined text exceeds a threshold, it shows a truncated view
(first paragraph(s) up to a char cap) + a mint "Read more…" toggle that
expands/collapses. The modal's main + sub-item descriptions opt in; the
hero intro and contact blurb do not, so they're unchanged.

## Component change (`Paragraphs.jsx`)

```jsx
import { useState } from 'react';
import { toParagraphs } from '../utils/paragraphs';

const COLLAPSE_THRESHOLD = 320; // chars; above this, collapse by default

function Paragraphs({ text, className, collapsible = false }) {
    const paragraphs = toParagraphs(text);
    const total = paragraphs.join(' ').length;
    const canCollapse = collapsible && total > COLLAPSE_THRESHOLD;

    const [expanded, setExpanded] = useState(false);

    // When collapsed, show whole paragraphs until we pass a visible
    // budget (so we never cut mid-word/mid-sentence).
    let shown = paragraphs;
    if (canCollapse && !expanded) {
        const out = [];
        let used = 0;
        for (const p of paragraphs) {
            out.push(p);
            used += p.length;
            if (used >= COLLAPSE_THRESHOLD) break;
        }
        shown = out;
    }

    return (
        <>
            {shown.map((p, i) => (
                <p key={i} className={className}>{p}</p>
            ))}
            {canCollapse && (
                <button
                    type="button"
                    className="read-more"
                    aria-expanded={expanded}
                    onClick={() => setExpanded((v) => !v)}
                >
                    {expanded ? 'Show less' : 'Read more…'}
                </button>
            )}
        </>
    );
}
```

Design notes:
- **Threshold `COLLAPSE_THRESHOLD = 320` chars** — chosen so most of the
  multi-paragraph project descriptions (which run ~800–1600 chars)
  collapse, while short ones don't. Labelled, easy to tune.
- **Truncate by whole paragraphs** (never mid-word): show paragraphs
  until the cumulative length passes the threshold, so the collapsed
  view is clean prose, typically the first paragraph. (Req 1.5)
- **Default OFF** (`collapsible=false`) → hero/contact unchanged
  (Req 3.2).
- Returns a fragment now (was an array) — still valid JSX; keys
  preserved.
- Component-local `expanded` state. Because React remounts `Paragraphs`
  when the modal opens a different item (the modal content changes), a
  reopened modal starts collapsed. To be robust, key the component or
  reset on `text` change — simplest: since each modal open renders a
  fresh element tree, state resets naturally; if needed, add
  `key={item.id}` upstream. (Verified: ContentModal is unmounted/empty
  when closed — `item` null returns null — so it remounts fresh each
  open, resetting state. Req 4.4 satisfied.)

## Modal opt-in (`ContentModal.jsx`)

Add `collapsible` to the two description usages:
- main description: `<Paragraphs text={item.description}
  className="modal__description" collapsible />`
- sub-item description: `<Paragraphs text={item.description}
  className="modal__subitem-desc" collapsible />`

Hero intro / contact blurb usages in `Home.jsx` are left as-is.

## Styling (`components.css`)

```css
.read-more {
    display: inline;
    margin-top: var(--space-2);

    background: none;
    border: none;
    padding: 0;

    color: var(--accent);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
}
.read-more:hover,
.read-more:focus-visible {
    color: var(--accent-hover);
    text-decoration: underline;
    outline: none;
}
```
Inline mint text button, bold (consistent with other buttons), keyboard-
accessible (real `<button>`, `aria-expanded`). (Req 2)

## Files touched

| File | Change |
|---|---|
| `src/components/Paragraphs.jsx` | add `collapsible` prop + threshold + expand/collapse toggle |
| `src/components/ContentModal.jsx` | pass `collapsible` on the two description usages |
| `src/styles/components.css` | `.read-more` inline mint button styles |

## Validation plan

1. `npm run build` + `CI=true npm run build` → succeed; no new dep;
   diagnostics clean.
2. Confirm (code): long descriptions collapse with a mint Read more…;
   short ones (and hero/contact) unaffected; toggle expands/Show less;
   truncation by whole paragraphs; state resets on modal reopen; modal
   scroll/two-pane intact.
3. No live browser → the collapse feel + threshold suitability need
   owner smoke-test; threshold labelled for tuning.
