// Discovery Book: all craftable results, locked (silhouette + escalating
// hint) or unlocked (title + hero thumbnail, opens the existing modal).
// Derives entirely from recipe data + existing records (no duplication).

import { recipes } from '../../craft/recipes';
import { resultSummary } from '../../craft/resolveResult';
import { escalatedHint } from '../../craft/craftingEngine';

function DiscoveryBook({ discoveredSet, attempts, onOpen }) {
    const total = recipes.length;
    const found = recipes.filter((r) => discoveredSet.has(r.id)).length;

    return (
        <div className="discovery-book">
            <div className="discovery-book__header">
                <h3 className="craft__title">Discovery Book</h3>
                <span className="discovery-progress">
                    {found} / {total} discovered
                </span>
            </div>

            <div className="discovery-grid">
                {recipes.map((recipe) => {
                    const unlocked = discoveredSet.has(recipe.id);
                    const summary = resultSummary(recipe.result);

                    if (unlocked && summary) {
                        return (
                            <button
                                type="button"
                                key={recipe.id}
                                className="discovery-entry discovery-entry--unlocked"
                                onClick={() => onOpen(summary.item)}
                                aria-label={`Open ${summary.title}`}
                            >
                                {summary.heroImage ? (
                                    <img
                                        className="discovery-entry__thumb"
                                        src={summary.heroImage.src}
                                        alt={summary.heroImage.alt || summary.title}
                                        loading="lazy"
                                    />
                                ) : (
                                    <span className="discovery-entry__thumb discovery-entry__thumb--locked">
                                        ✦
                                    </span>
                                )}
                                <span className="discovery-entry__title">
                                    {summary.title}
                                </span>
                            </button>
                        );
                    }

                    // Locked: silhouette + escalating hint.
                    const hint = escalatedHint(
                        recipe,
                        attempts[recipe.id] || 0
                    );
                    return (
                        <div
                            key={recipe.id}
                            className="discovery-entry discovery-entry--locked"
                        >
                            <span className="discovery-entry__thumb discovery-entry__thumb--locked">
                                ?
                            </span>
                            <span className="discovery-entry__title">
                                ? ? ?
                            </span>
                            <span className="discovery-entry__hint">
                                {hint}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DiscoveryBook;
