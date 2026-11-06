// Hand-authored pixel-art glyphs for crafting ingredients (Spec 11,
// Path A). Each is an inline SVG on a 10x10 grid of blocks using the
// site's token palette — stylised/geometric pixel art, no raster
// sprites, no third-party textures. Switches on the ingredient `icon`.

const V = '#3ee8a8';   // accent (var token value)
const H = '#eef1f5';   // heading
const D = '#5b6472';   // dim
const Y = '#f5c451';   // warm accent for variety
const R = '#e8663e';   // warm red-orange

// Build an SVG from a list of [x, y, w, h, color] blocks on a 10x10 grid.
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
    // "</>" code brackets
    code: [
        [2, 2, 1, 1, V], [1, 3, 1, 1, V], [1, 4, 1, 2, V], [1, 6, 1, 1, V], [2, 7, 1, 1, V],
        [7, 2, 1, 1, V], [8, 3, 1, 1, V], [8, 4, 1, 2, V], [8, 6, 1, 1, V], [7, 7, 1, 1, V],
        [5, 2, 1, 1, H], [4, 4, 1, 1, H], [5, 5, 1, 1, H], [4, 7, 1, 1, H]
    ],
    // wires / cabling
    wires: [
        [1, 2, 2, 1, R], [3, 3, 1, 1, R], [4, 4, 2, 1, Y], [6, 5, 1, 1, Y],
        [7, 6, 2, 1, V], [2, 6, 1, 2, D], [7, 2, 1, 2, D], [4, 7, 2, 1, R]
    ],
    // CAD cube (wireframe)
    cad: [
        [3, 2, 4, 1, V], [3, 2, 1, 4, V], [6, 2, 1, 4, V], [3, 5, 4, 1, V],
        [5, 1, 3, 1, H], [7, 1, 1, 4, H], [6, 2, 1, 1, H], [5, 5, 3, 1, H], [7, 5, 1, 1, H]
    ],
    // 3D printer (gantry + base)
    printer: [
        [1, 2, 8, 1, D], [1, 2, 1, 5, D], [8, 2, 1, 5, D], [4, 3, 2, 1, V],
        [4, 4, 2, 2, H], [2, 7, 6, 1, D]
    ],
    // wheels (tyre + hub)
    wheels: [
        [3, 1, 4, 1, H], [2, 2, 1, 1, H], [7, 2, 1, 1, H], [1, 3, 1, 4, H], [8, 3, 1, 4, H],
        [2, 7, 1, 1, H], [7, 7, 1, 1, H], [3, 8, 4, 1, H],
        [4, 4, 2, 2, V]
    ],
    // simulation (waveform)
    simulation: [
        [1, 5, 1, 2, V], [2, 4, 1, 2, V], [3, 3, 1, 2, V], [4, 4, 1, 2, V],
        [5, 2, 1, 3, V], [6, 4, 1, 2, V], [7, 3, 1, 2, V], [8, 5, 1, 2, V]
    ],
    // gaming controller
    controller: [
        [2, 4, 6, 3, H], [1, 5, 1, 2, H], [8, 5, 1, 2, H],
        [3, 5, 1, 1, D], [2, 5, 1, 1, V], [3, 4, 1, 1, V],
        [6, 5, 1, 1, R], [7, 5, 1, 1, Y]
    ],
    // blueprint (document + lines)
    blueprint: [
        [2, 1, 6, 8, V],
        [3, 3, 4, 1, H], [3, 5, 4, 1, H], [3, 7, 2, 1, H]
    ]
};

function IngredientIcon({ icon, label }) {
    const blocks = GLYPHS[icon];
    if (!blocks) {
        // Fallback: a simple block.
        return (
            <Glyph title={label || icon}
                blocks={[[3, 3, 4, 4, D]]} />
        );
    }
    return <Glyph title={label || icon} blocks={blocks} />;
}

export default IngredientIcon;
