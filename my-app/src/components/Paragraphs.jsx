// Renders text (a string or an array of paragraph strings) as a series
// of <p> elements. Backward-compatible with single-string content.
//
// Opt-in `collapsible` mode: when the combined text exceeds
// COLLAPSE_THRESHOLD, it renders truncated (whole paragraphs up to the
// threshold) with a mint "Read more…" toggle, so long descriptions don't
// bury the skills/links beneath them. Default off → unchanged behaviour.

import { useState } from 'react';
import { toParagraphs } from '../utils/paragraphs';

// TWEAK: characters above which a collapsible block starts collapsed.
const COLLAPSE_THRESHOLD = 120;

function Paragraphs({ text, className, collapsible = false }) {
    const paragraphs = toParagraphs(text);
    const [expanded, setExpanded] = useState(false);

    const total = paragraphs.join(' ').length;
    const canCollapse = collapsible && total > COLLAPSE_THRESHOLD;

    // Collapsed view: whole paragraphs until we pass the threshold, so
    // text never cuts mid-word.
    let shown = paragraphs;
    if (canCollapse && !expanded) {
        const out = [];
        let used = 0;
        for (let i = 0; i < paragraphs.length; i += 1) {
            out.push(paragraphs[i]);
            used += paragraphs[i].length;
            if (used >= COLLAPSE_THRESHOLD) {
                break;
            }
        }
        shown = out;
    }

    return (
        <>
            {shown.map((paragraph, index) => (
                <p key={index} className={className}>
                    {paragraph}
                </p>
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

export default Paragraphs;
