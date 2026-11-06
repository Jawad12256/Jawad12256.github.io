// Hand-authored pixel-art glyphs for CRAFTED results (Spec 12, Path A).
// Keyed by result ID (project / experience / achievement). Same
// rect-grid SVG technique as IngredientIcon. The distinct "crafted" look
// (red tint) comes from the result-slot CSS, not the glyph, so one tint
// rule covers everything. A generic glyph is used for any unmapped
// result so new recipes get art with no code change.

const V = '#3ee8a8';   // accent
const H = '#eef1f5';   // heading
const D = '#5b6472';   // dim
const Y = '#f5c451';   // warm yellow
const R = '#e8663e';   // warm red-orange
const B = '#6fb7ff';   // cool blue

function Glyph({ blocks, title }) {
    return (
        <svg
            viewBox="0 0 10 10"
            width="1em"
            height="1em"
            role="img"
            aria-label={title}
            shapeRendering="crispEdges"
        >
            {blocks.map(([x, y, w, h, c], i) => (
                <rect key={i} x={x} y={y} width={w} height={h} fill={c} />
            ))}
        </svg>
    );
}

const GLYPHS = {
    // CFD — fluid streamlines
    'pythonic-cfd': [
        [1, 2, 7, 1, B], [2, 4, 7, 1, B], [1, 6, 7, 1, B],
        [8, 2, 1, 1, H], [1, 4, 1, 1, H], [8, 6, 1, 1, H]
    ],
    // MorseMaster — dots & dashes
    morsemaster: [
        [1, 4, 1, 2, V], [3, 4, 3, 2, V], [7, 4, 1, 2, V],
        [1, 7, 3, 1, D], [5, 7, 2, 1, D]
    ],
    // MegaBite — hand/gesture
    megabite: [
        [3, 1, 1, 4, H], [5, 1, 1, 4, H], [4, 1, 1, 4, H],
        [2, 5, 6, 3, H], [2, 5, 1, 2, H], [7, 5, 1, 2, H], [4, 8, 2, 1, R]
    ],
    // RC car — car body + wheels
    'electronics-1-rc-car': [
        [1, 4, 8, 2, R], [3, 3, 3, 1, R],
        [2, 6, 2, 1, H], [6, 6, 2, 1, H]
    ],
    // Data science — bar chart
    'data-science': [
        [1, 6, 2, 2, V], [4, 4, 2, 4, V], [7, 2, 2, 6, V]
    ],
    // 3D printing — printed layers
    '3d-printing': [
        [3, 2, 4, 1, V], [3, 4, 4, 1, V], [3, 6, 4, 1, V],
        [2, 8, 6, 1, D]
    ],
    // Minecraft — grass block
    minecraft: [
        [2, 2, 6, 2, V], [2, 4, 6, 4, '#7a5a3a']
    ],
    // Splatoon — ink splat
    splatoon: [
        [3, 2, 3, 1, Y], [2, 3, 6, 3, Y], [3, 6, 4, 1, Y],
        [1, 4, 1, 1, Y], [8, 5, 1, 1, Y], [5, 7, 1, 1, Y]
    ],
    // Software internship — terminal/code window
    'software-internship': [
        [1, 2, 8, 6, D], [1, 2, 8, 1, H],
        [2, 4, 1, 1, V], [3, 4, 2, 1, V], [2, 6, 4, 1, V]
    ],
    // F1 in Schools — race car + stripe
    'f1-in-schools': [
        [1, 4, 8, 2, R], [4, 3, 2, 1, R], [1, 5, 8, 1, H],
        [2, 6, 1, 1, D], [7, 6, 1, 1, D]
    ],
    // UK Space Design — rocket
    'uk-space-design': [
        [4, 1, 2, 5, H], [4, 1, 2, 1, R], [3, 6, 1, 2, R], [6, 6, 1, 2, R],
        [4, 6, 2, 2, V], [4, 8, 2, 1, Y]
    ],
    // Student Robotics — robot head
    'student-robotics': [
        [2, 2, 6, 5, H], [3, 3, 1, 1, V], [6, 3, 1, 1, V],
        [3, 5, 4, 1, D], [5, 1, 0.6, 1, H], [4, 7, 2, 1, D]
    ]
};

const FALLBACK = [
    [4, 1, 2, 2, Y], [2, 3, 6, 1, Y], [3, 4, 4, 3, Y], [4, 7, 2, 1, Y]
];

function ResultIcon({ resultId, label }) {
    const blocks = GLYPHS[resultId] || FALLBACK;
    return <Glyph blocks={blocks} title={label || resultId} />;
}

export default ResultIcon;
