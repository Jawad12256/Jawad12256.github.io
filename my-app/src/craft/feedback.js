// Flavour + fallback feedback for combinations that don't craft a
// project (Spec 11). PLACEHOLDER flavour text for owner review. This is
// game-flavour only; it never claims a craft succeeded and never states
// project facts (those come from the real data via ContentModal).

export const GENERIC_FALLBACK =
    "Those don't combine into anything... yet. Try a different mix!";

// Keyed by the sorted-multiset of ingredient ids. "Meaningful but no
// project" combinations get a contextual nudge rather than the generic
// fallback.
const FLAVOUR = {
    'code+code': 'Twice the code, but what are we actually building?',
    'wires+wires': 'A tangle of wires needs something to connect.',
    'cad+cad': 'Two models... maybe add a way to make them real.',
    'controller+controller':
        'Two controllers — great for co-op, but not a project on their own.',
    'printer+printer':
        'Two printers running hot, but nothing modelled to print.',
    'simulation+simulation':
        'Simulations all the way down — try pairing one with some code.',
    'blueprint+blueprint':
        'Plenty of plans, now bring a tool or material into the mix.',
    'wheels+wheels':
        'Wheels need a chassis and some control to go anywhere.'
};

const key = (ids) => [...ids].filter(Boolean).sort().join('+');

export function flavourFor(placedIds) {
    return FLAVOUR[key(placedIds)] || null;
}
