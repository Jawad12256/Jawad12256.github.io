// 2x2 crafting grid + arrow + live result slot (Spec 12).
//
// Placement: double-click/tap an inventory item (handled in Inventory)
// OR drag an item onto a slot. Removal: double-click/tap a filled slot,
// drag a slot item outside the grid, or focus a slot and press
// Delete/Backspace/Enter. Dropping on a filled slot replaces it. The
// result slot shows the crafted item live when the grid matches.

import { useState } from 'react';

import IngredientIcon from './IngredientIcon';
import ResultIcon from './ResultIcon';
import { ingredientsById } from '../../craft/ingredients';
import { resultSummary } from '../../craft/resolveResult';

function CraftingGrid({
    slots,
    craftableResultId,
    isNewResult,
    onPlace,
    onRemoveSlot,
    onCollect,
    onSlotDragStart
}) {
    const [dropTarget, setDropTarget] = useState(null);

    const readPayload = (event) => {
        try {
            return JSON.parse(
                event.dataTransfer.getData('application/json')
            );
        } catch (e) {
            return null;
        }
    };

    const handleSlotDrop = (index) => (event) => {
        event.preventDefault();
        setDropTarget(null);
        const payload = readPayload(event);
        if (!payload) {
            return;
        }
        if (payload.from === 'inventory') {
            onPlace(payload.ingredientId, index); // place/replace at index
        } else if (payload.from === 'slot' && payload.index !== index) {
            // move within grid: place at target, clear source
            onPlace(slots[payload.index], index);
            onRemoveSlot(payload.index);
        }
    };

    const summary = craftableResultId
        ? resultSummary(craftableResultId)
        : null;

    return (
        <div className="craft-table">
            <div
                className="craft-grid"
                role="group"
                aria-label="Crafting grid"
                // Allow dropping a slot item OUTSIDE onto the grid gutter?
                // Removal-outside is handled at the page level via dragend.
            >
                {slots.map((id, index) => {
                    const ing = id ? ingredientsById[id] : null;
                    return (
                        <div
                            key={index}
                            className={
                                'craft-slot pixel-cell' +
                                (id ? ' craft-slot--filled' : '') +
                                (dropTarget === index
                                    ? ' is-drop-target'
                                    : '')
                            }
                            role="button"
                            tabIndex={0}
                            draggable={Boolean(id)}
                            aria-label={
                                ing
                                    ? `${ing.label} in slot ${index + 1}. Double-click or press Delete to remove.`
                                    : `Empty slot ${index + 1}`
                            }
                            onDragStart={(e) => {
                                e.dataTransfer.effectAllowed = 'move';
                                e.dataTransfer.setData(
                                    'application/json',
                                    JSON.stringify({ from: 'slot', index })
                                );
                                if (onSlotDragStart) {
                                    onSlotDragStart(index);
                                }
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDropTarget(index);
                            }}
                            onDragLeave={() =>
                                setDropTarget((t) =>
                                    t === index ? null : t
                                )
                            }
                            onDrop={handleSlotDrop(index)}
                            onDoubleClick={() => id && onRemoveSlot(index)}
                            onKeyDown={(e) => {
                                if (
                                    id &&
                                    (e.key === 'Delete' ||
                                        e.key === 'Backspace' ||
                                        e.key === 'Enter')
                                ) {
                                    e.preventDefault();
                                    onRemoveSlot(index);
                                }
                            }}
                        >
                            {ing && (
                                <IngredientIcon
                                    icon={ing.icon}
                                    label={ing.label}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <span className="craft-arrow" aria-hidden="true">
                →
            </span>

            <div
                className={
                    'craft-result-slot pixel-cell' +
                    (summary ? ' craft-result-slot--filled' : '') +
                    (isNewResult ? ' craft-result-slot--new' : '')
                }
                role="button"
                tabIndex={summary ? 0 : -1}
                aria-label={
                    summary
                        ? `Crafted ${summary.title}. Activate to view.`
                        : 'Result slot (empty)'
                }
                onClick={() => summary && onCollect(craftableResultId)}
                onKeyDown={(e) => {
                    if (
                        summary &&
                        (e.key === 'Enter' || e.key === ' ')
                    ) {
                        e.preventDefault();
                        onCollect(craftableResultId);
                    }
                }}
            >
                {summary && (
                    <ResultIcon
                        resultId={craftableResultId}
                        label={summary.title}
                    />
                )}
            </div>
        </div>
    );
}

export default CraftingGrid;
