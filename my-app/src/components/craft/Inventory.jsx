// Ingredient inventory: click a tile to add it to the crafting grid.

import IngredientIcon from './IngredientIcon';
import { ingredients } from '../../craft/ingredients';

function Inventory({ onPick }) {
    return (
        <div className="craft-inventory">
            {ingredients.map((ing) => (
                <button
                    type="button"
                    className="craft-ingredient"
                    key={ing.id}
                    onClick={() => onPick(ing.id)}
                    aria-label={`Add ${ing.label} to the grid`}
                >
                    <span className="craft-ingredient__icon">
                        <IngredientIcon icon={ing.icon} label={ing.label} />
                    </span>
                    <span className="craft-ingredient__label">
                        {ing.label}
                    </span>
                </button>
            ))}
        </div>
    );
}

export default Inventory;
