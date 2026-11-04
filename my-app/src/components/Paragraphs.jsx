// Renders text (a string or an array of paragraph strings) as a series
// of <p> elements. Backward-compatible with single-string content.

import { toParagraphs } from '../utils/paragraphs';

function Paragraphs({ text, className }) {
    const paragraphs = toParagraphs(text);

    return paragraphs.map((paragraph, index) => (
        <p key={index} className={className}>
            {paragraph}
        </p>
    ));
}

export default Paragraphs;
