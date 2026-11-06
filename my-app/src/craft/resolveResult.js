// Resolves a crafting recipe `result` ID to a normalised ContentItem
// using the EXISTING data + normalisers, so crafted/discovered results
// open the same ContentModal as the portfolio. No duplicated content.

import {
    projects,
    experience,
    achievements
} from '../data';

import {
    normaliseProject,
    normaliseExperience,
    normaliseAchievement
} from '../utils/normaliseContent';

// resultId -> normalised ContentItem (or null if not found).
export function resolveResult(resultId) {
    const project = projects.find((p) => p.id === resultId);
    if (project) {
        return normaliseProject(project);
    }

    const exp = experience.find((e) => e.id === resultId);
    if (exp) {
        return normaliseExperience(exp);
    }

    const achievement = achievements.find((a) => a.id === resultId);
    if (achievement) {
        return normaliseAchievement(achievement);
    }

    return null;
}

// Lightweight display info for a result (title + hero image) without
// opening the modal — used by the Discovery Book entries.
export function resultSummary(resultId) {
    const item = resolveResult(resultId);
    if (!item) {
        return null;
    }
    return {
        id: item.id,
        title: item.title,
        heroImage: item.heroImage || null,
        item
    };
}
