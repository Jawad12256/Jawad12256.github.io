// Normalises paragraph input into an array of non-empty paragraph
// strings. Backward-compatible: a plain string (optionally containing
// blank-line separators) still works, so fields not yet converted to
// arrays render correctly as a single paragraph.
//
//   toParagraphs(['a', 'b'])   -> ['a', 'b']
//   toParagraphs('a\n\nb')     -> ['a', 'b']
//   toParagraphs('single')     -> ['single']
//   toParagraphs(undefined)    -> []

export function toParagraphs(value) {
    if (Array.isArray(value)) {
        return value.map((p) => String(p).trim()).filter(Boolean);
    }
    if (typeof value === 'string') {
        return value
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter(Boolean);
    }
    return [];
}
