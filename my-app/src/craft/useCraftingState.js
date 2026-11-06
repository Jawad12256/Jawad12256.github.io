// Crafting Mode state + localStorage persistence (Spec 11).
//
// Persists discovered recipes, per-recipe near-miss attempt counts, and
// whether the Master Crafter celebration has been shown. Resilient:
// malformed/absent storage -> empty state; unknown saved IDs ignored;
// the CURRENT recipe data is the source of truth.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { recipes, requiredRecipeIds } from './recipes';

const STORAGE_KEY = 'craft:v1';

const EMPTY = {
    discovered: [],
    attempts: {},
    masterCrafterCelebrated: false
};

const validRecipeIds = new Set(recipes.map((r) => r.id));

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return { ...EMPTY };
        }
        const parsed = JSON.parse(raw);
        // Validate against CURRENT recipes; drop unknown IDs.
        const discovered = Array.isArray(parsed.discovered)
            ? parsed.discovered.filter((id) => validRecipeIds.has(id))
            : [];
        const attempts =
            parsed.attempts && typeof parsed.attempts === 'object'
                ? Object.fromEntries(
                      Object.entries(parsed.attempts).filter(([id]) =>
                          validRecipeIds.has(id)
                      )
                  )
                : {};
        return {
            discovered,
            attempts,
            masterCrafterCelebrated:
                Boolean(parsed.masterCrafterCelebrated)
        };
    } catch (e) {
        // Unavailable or malformed storage → behave as no saved progress.
        return { ...EMPTY };
    }
}

function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        // Ignore write failures (e.g. storage disabled/full).
    }
}

export function useCraftingState() {
    const [state, setState] = useState(loadState);

    useEffect(() => {
        saveState(state);
    }, [state]);

    const discover = useCallback((recipeId) => {
        if (!validRecipeIds.has(recipeId)) {
            return;
        }
        setState((s) =>
            s.discovered.includes(recipeId)
                ? s
                : { ...s, discovered: [...s.discovered, recipeId] }
        );
    }, []);

    const recordAttempt = useCallback((recipeId) => {
        if (!validRecipeIds.has(recipeId)) {
            return;
        }
        setState((s) => ({
            ...s,
            attempts: {
                ...s.attempts,
                [recipeId]: (s.attempts[recipeId] || 0) + 1
            }
        }));
    }, []);

    const markCelebrated = useCallback(() => {
        setState((s) => ({ ...s, masterCrafterCelebrated: true }));
    }, []);

    const reset = useCallback(() => {
        setState({ ...EMPTY });
    }, []);

    // Derived: is every REQUIRED recipe discovered?
    const discoveredSet = useMemo(
        () => new Set(state.discovered),
        [state.discovered]
    );
    const masterCrafterEarned = useMemo(
        () => requiredRecipeIds.every((id) => discoveredSet.has(id)),
        [discoveredSet]
    );

    return {
        discovered: state.discovered,
        discoveredSet,
        attempts: state.attempts,
        masterCrafterEarned,
        masterCrafterCelebrated: state.masterCrafterCelebrated,
        discover,
        recordAttempt,
        markCelebrated,
        reset
    };
}
