import { useEffect, useState } from 'react';

import Section from '../components/Section';
import Inventory from '../components/craft/Inventory';
import CraftingGrid from '../components/craft/CraftingGrid';
import DiscoveryBook from '../components/craft/DiscoveryBook';
import MasterCrafterCelebration
    from '../components/craft/MasterCrafterCelebration';

import { recipes } from '../craft/recipes';
import { evaluate } from '../craft/craftingEngine';
import { resolveResult } from '../craft/resolveResult';
import { useCraftingState } from '../craft/useCraftingState';
import { useModal } from '../context/ModalContext';

const EMPTY_SLOTS = [null, null, null, null];

function Craft() {
    const { openItem } = useModal();
    const {
        discoveredSet,
        attempts,
        masterCrafterEarned,
        masterCrafterCelebrated,
        discover,
        recordAttempt,
        markCelebrated,
        reset
    } = useCraftingState();

    const [slots, setSlots] = useState(EMPTY_SLOTS);
    const [feedback, setFeedback] = useState(null);
    const [showCelebration, setShowCelebration] = useState(false);

    // One-time celebration: play only when newly earned.
    useEffect(() => {
        if (masterCrafterEarned && !masterCrafterCelebrated) {
            setShowCelebration(true);
        }
    }, [masterCrafterEarned, masterCrafterCelebrated]);

    const placeIngredient = (ingredientId) => {
        setSlots((prev) => {
            const idx = prev.findIndex((s) => s === null);
            if (idx === -1) {
                return prev; // grid full
            }
            const next = [...prev];
            next[idx] = ingredientId;
            return next;
        });
    };

    const removeSlot = (index) => {
        setSlots((prev) => {
            const next = [...prev];
            next[index] = null;
            return next;
        });
    };

    const clearGrid = () => {
        setSlots(EMPTY_SLOTS);
        setFeedback(null);
    };

    const craft = () => {
        const placed = slots.filter(Boolean);
        const result = evaluate(placed, recipes, attempts);

        if (result.type === 'success') {
            const already = discoveredSet.has(result.recipe.id);
            discover(result.recipe.id);
            const item = resolveResult(result.recipe.result);
            setFeedback({
                type: 'success',
                message: already
                    ? `Crafted ${item ? item.title : 'a project'} again!`
                    : `Discovered ${item ? item.title : 'a project'}!`,
                item
            });
        } else if (result.type === 'close') {
            recordAttempt(result.recipe.id);
            setFeedback({ type: 'close', message: result.message });
        } else {
            setFeedback({ type: result.type, message: result.message });
        }
    };

    const closeCelebration = () => {
        setShowCelebration(false);
        markCelebrated();
    };

    const handleReset = () => {
        // eslint-disable-next-line no-alert
        const ok = window.confirm(
            'Reset all crafting progress? This cannot be undone.'
        );
        if (ok) {
            reset();
            clearGrid();
        }
    };

    return (
        <Section
            id="craft"
            eyebrow="// CRAFTING MODE"
            title="Craft my projects."
        >
            <div className="craft">
                <p className="craft__intro">
                    Design Engineering is about combining disciplines to
                    build something new. Mix ingredients in the grid to
                    discover the projects, experiences and achievements
                    they create. Order doesn't matter — just find the
                    right combination.
                </p>

                <Inventory onPick={placeIngredient} />

                <CraftingGrid
                    slots={slots}
                    onRemoveSlot={removeSlot}
                    onCraft={craft}
                    onClear={clearGrid}
                />

                {feedback && (
                    <div
                        className={
                            'craft-feedback' +
                            (feedback.type === 'success'
                                ? ' craft-feedback--success'
                                : '') +
                            (feedback.type === 'close'
                                ? ' craft-feedback--close'
                                : '')
                        }
                        role="status"
                    >
                        {feedback.message}
                        {feedback.type === 'success' && feedback.item && (
                            <>
                                {' '}
                                <button
                                    type="button"
                                    className="craft-button"
                                    onClick={() => openItem(feedback.item)}
                                >
                                    View project
                                </button>
                            </>
                        )}
                    </div>
                )}

                <DiscoveryBook
                    discoveredSet={discoveredSet}
                    attempts={attempts}
                    onOpen={openItem}
                />

                {masterCrafterEarned && (
                    <p className="discovery-progress">
                        ★ Master Crafter achieved
                    </p>
                )}

                <div className="craft-actions">
                    <button
                        type="button"
                        className="craft-button craft-button--secondary"
                        onClick={handleReset}
                    >
                        Reset progress
                    </button>
                </div>
            </div>

            {showCelebration && (
                <MasterCrafterCelebration onClose={closeCelebration} />
            )}
        </Section>
    );
}

export default Craft;
