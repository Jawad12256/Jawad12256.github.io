// Ingredient inventory (Spec 12). Place into the grid by double-click/
// tap (accessible/touch) or by dragging onto a slot (desktop pointer).
// Single click no longer places. Enter = place (keyboard equivalent).

import IngredientIcon from './IngredientIcon';
import { ingredients } from '../../craft/ingredients';

function Inventory({ onPlace }) {
    return (
        <div className="craft-inventory">
            {ingredients.map((ing) => (
                <div
                    className="craft-ingredient"
                    key={ing.id}
                    role="button"
                    tabIndex={0}
                    draggable
                    aria-label={`${ing.label}. Double-click or press Enter to add to the grid, or drag onto a slot.`}
                    onDoubleClick={() => onPlace(ing.id)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onPlace(ing.id);
                        }
                    }}
                    onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'copy';
                        e.dataTransfer.setData(
                            'application/json',
                            JSON.stringify({
                                from: 'inventory',
                                ingredientId: ing.id
                            })
                        );
                    }}
                >
                    <span className="craft-ingredient__icon">
                        <IngredientIcon icon={ing.icon} label={ing.label} />
                    </span>
                    <span className="craft-ingredient__label">
                        {ing.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default Inventory;
