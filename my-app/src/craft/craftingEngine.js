// Pure, data-driven crafting engine (Spec 11). No React, no side
// effects — deterministic functions over the recipe data, so the engine
// never needs to change when ingredients/recipes data is edited.

import { GENERIC_FALLBACK, flavourFor } from './feedback';

// Shapeless multiset key: order/position irrelevant.
const multisetKey = (ids) =>
    [...ids].filter(Boolean).sort().join('+');

export function matchRecipe(placedIds, recipes) {
    const k = multisetKey(placedIds);
    return recipes.find((r) => multisetKey(r.ingredients) === k) || null;
}

// Count how many ingredients a placed multiset shares with a recipe
// (multiset intersection size).
function overlapCount(placedIds, recipeIds) {
    const pool = [...recipeIds];
    let shared = 0;
    placedIds.forEach((id) => {
        const idx = pool.indexOf(id);
        if (idx !== -1) {
            shared += 1;
            pool.splice(idx, 1);
        }
    });
    return shared;
}

// A recipe is a "near miss" if the placed combination differs from it by
// exactly one ingredient (same size, one swapped; or off-by-one in
// length while sharing the rest). Returns the closest such recipe.
export function findNearMiss(placedIds, recipes) {
    const placed = placedIds.filter(Boolean);
    let best = null;
    let bestDiff = Infinity;

    recipes.forEach((r) => {
        const shared = overlapCount(placed, r.ingredients);
        // Total "distance" = unmatched placed + unmatched recipe.
        //   add/remove one ingredient  -> diff 1
        //   swap one ingredient        -> diff 2
        const diff =
            placed.length - shared + (r.ingredients.length - shared);
        // Near miss: shares most ingredients and is off by one swap or
        // one addition/removal (diff 1 or 2), but not an exact match
        // (diff 0). Prefer the closest.
        if (shared >= 1 && diff >= 1 && diff <= 2 && diff < bestDiff) {
            best = r;
            bestDiff = diff;
        }
    });

    return best;
}

// 3-tier escalating hint based on how many times this recipe has been
// "nearly" attempted.
export function escalatedHint(recipe, attempts = 0) {
    if (attempts >= 4) {
        const first = recipe.ingredients[0];
        return `So close! One ingredient is "${first}".`;
    }
    if (attempts >= 2) {
        return `Not quite — this recipe needs ${recipe.ingredients.length} ingredients.`;
    }
    return recipe.hint;
}

// Evaluate a grid of placed ingredient ids. `attemptsByRecipe` is a map
// of recipeId -> number of prior near-miss attempts (for hint tiers).
export function evaluate(placedIds, recipes, attemptsByRecipe = {}) {
    const placed = placedIds.filter(Boolean);

    if (placed.length < 2) {
        return {
            type: 'too-few',
            message: 'Place at least two ingredients to craft.'
        };
    }

    const hit = matchRecipe(placed, recipes);
    if (hit) {
        return { type: 'success', recipe: hit };
    }

    const near = findNearMiss(placed, recipes);
    if (near) {
        return {
            type: 'close',
            recipe: near,
            message: escalatedHint(near, attemptsByRecipe[near.id] || 0)
        };
    }

    const flavour = flavourFor(placed);
    if (flavour) {
        return { type: 'flavour', message: flavour };
    }

    return { type: 'generic', message: GENERIC_FALLBACK };
}
