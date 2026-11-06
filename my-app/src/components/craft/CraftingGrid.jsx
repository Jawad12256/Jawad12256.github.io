// 2x2 crafting grid. Slots hold ingredient ids (or null). Clicking a
// filled slot removes it. Craft / Clear actions below.

import IngredientIcon from './IngredientIcon';
import { ingredientsById } from '../../craft/ingredients';

function CraftingGrid({ slots, onRemoveSlot, onCraft, onClear }) {
    return (
        <div>
            <div className="craft-table">
                <div className="craft-grid" role="group"
                    aria-label="Crafting grid">
                    {slots.map((id, index) => {
                        const ing = id ? ingredientsById[id] : null;
                        return (
                            <button
                                type="button"
                                key={index}
                                className={
                                    'craft-slot pixel-cell' +
                                    (id ? ' craft-slot--filled' : '')
                                }
                                onClick={() => id && onRemoveSlot(index)}
                                aria-label={
                                    ing
                                        ? `Remove ${ing.label} from slot ${index + 1}`
                                        : `Empty slot ${index + 1}`
                                }
                            >
                                {ing && (
                                    <IngredientIcon
                                        icon={ing.icon}
                                        label={ing.label}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="craft-actions">
                <button
                    type="button"
                    className="craft-button"
                    onClick={onCraft}
                >
                    Craft
                </button>
                <button
                    type="button"
                    className="craft-button craft-button--secondary"
                    onClick={onClear}
                >
                    Clear
                </button>
            </div>
        </div>
    );
}

export default CraftingGrid;
