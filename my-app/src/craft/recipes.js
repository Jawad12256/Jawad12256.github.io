// Crafting Mode recipes (Spec 11).
//
// PLACEHOLDER content for owner review. Each recipe is SHAPELESS:
// `ingredients` is an unordered multiset; grid order/position does not
// matter. `result` is an existing project/experience/achievement ID
// (project content is NOT duplicated — it is resolved via the existing
// data/normalisers). `required: true` recipes gate the Master Crafter
// achievement; add `required: false` recipes later for easter eggs.
//
// The crafting ENGINE does not change when you edit this data.

export const recipes = [
    // --- 2-ingredient (most common) ---
    {
        id: 'r-cfd',
        ingredients: ['code', 'simulation'],
        result: 'pythonic-cfd',
        required: true,
        hint: 'Code that models how fluids flow.'
    },
    {
        id: 'r-morse',
        ingredients: ['code', 'controller'],
        result: 'morsemaster',
        required: true,
        hint: 'Software that turns signals into messages.'
    },
    {
        id: 'r-datascience',
        ingredients: ['code', 'blueprint'],
        result: 'data-science',
        required: true,
        hint: 'Finding patterns from structured data.'
    },
    {
        id: 'r-printing',
        ingredients: ['cad', 'printer'],
        result: '3d-printing',
        required: true,
        hint: 'A model made physical, layer by layer.'
    },
    {
        id: 'r-minecraft',
        ingredients: ['blueprint', 'controller'],
        result: 'minecraft',
        required: true,
        hint: 'Building something real inside a game.'
    },
    {
        id: 'r-splatoon',
        ingredients: ['controller', 'wheels'],
        result: 'splatoon',
        required: true,
        hint: 'Teamwork and reflexes in competitive play.'
    },

    // --- 3-ingredient (advanced) ---
    {
        id: 'r-internship',
        ingredients: ['code', 'wires', 'blueprint'],
        result: 'software-internship',
        required: true,
        hint: 'Professional software built across a summer.'
    },
    {
        id: 'r-rccar',
        ingredients: ['wires', 'wheels', 'controller'],
        result: 'electronics-1-rc-car',
        required: true,
        hint: 'A remote-controlled machine on wheels.'
    },
    {
        id: 'r-megabite',
        ingredients: ['code', 'wires', 'cad'],
        result: 'megabite',
        required: true,
        hint: 'A hands-free assistant blending software and hardware.'
    },
    {
        id: 'r-srobo',
        ingredients: ['wires', 'cad', 'controller'],
        result: 'student-robotics',
        required: true,
        hint: 'An autonomous robot built to compete.'
    },

    // --- 4-ingredient (most advanced) ---
    {
        id: 'r-f1is',
        ingredients: ['cad', 'simulation', 'wheels', 'blueprint'],
        result: 'f1-in-schools',
        required: true,
        hint: 'A tiny race car: designed, analysed and manufactured.'
    },
    {
        id: 'r-uksdc',
        ingredients: ['cad', 'simulation', 'blueprint', 'wires'],
        result: 'uk-space-design',
        required: true,
        hint: 'Designing a settlement beyond Earth.'
    }
];

export const requiredRecipeIds = recipes
    .filter((r) => r.required)
    .map((r) => r.id);
