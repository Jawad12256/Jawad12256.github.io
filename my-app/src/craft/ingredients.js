// Crafting Mode ingredients (Spec 11).
//
// PLACEHOLDER content for owner review: concrete, tangible nouns (no
// soft skills). `icon` maps to a hand-authored pixel SVG glyph in
// components/craft/IngredientIcon.jsx. All 8 are available from the
// start. Add/rename freely here without touching crafting logic.

export const ingredients = [
    { id: 'code',       label: 'Code',              icon: 'code' },
    { id: 'wires',      label: 'Wires',             icon: 'wires' },
    { id: 'cad',        label: 'CAD Model',         icon: 'cad' },
    { id: 'printer',    label: '3D Printer',        icon: 'printer' },
    { id: 'wheels',     label: 'Wheels',            icon: 'wheels' },
    { id: 'simulation', label: 'Simulation',        icon: 'simulation' },
    { id: 'controller', label: 'Controller',        icon: 'controller' },
    { id: 'blueprint',  label: 'Blueprint',         icon: 'blueprint' }
];

export const ingredientsById = Object.fromEntries(
    ingredients.map((i) => [i.id, i])
);
