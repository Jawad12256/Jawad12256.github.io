import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Section from '../components/Section';
import Inventory from '../components/craft/Inventory';
import CraftingGrid from '../components/craft/CraftingGrid';
import RecipeBook from '../components/craft/RecipeBook';
import CraftNotifications from '../components/craft/CraftNotifications';
import MasterCrafterCelebration
    from '../components/craft/MasterCrafterCelebration';
import { SoundOnIcon, SoundOffIcon } from '../components/icons/BrandIcons';

import { recipes } from '../craft/recipes';
import { evaluate } from '../craft/craftingEngine';
import { resolveResult } from '../craft/resolveResult';
import { useCraftingState } from '../craft/useCraftingState';
import { useSound } from '../craft/useSound';
import { useModal } from '../context/ModalContext';

const EMPTY_SLOTS = [null, null, null, null];
const TOAST_MS = 4000;

function Craft() {
    const { openItem } = useModal();
    const { play, muted, toggleMute } = useSound();
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
    const [bookOpen, setBookOpen] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [showCelebration, setShowCelebration] = useState(false);
    const toastId = useRef(0);
    const draggingSlot = useRef(null);

    // --- live evaluation ---
    const result = useMemo(
        () => evaluate(slots.filter(Boolean), recipes, attempts),
        [slots, attempts]
    );
    const craftableRecipe =
        result.type === 'success' ? result.recipe : null;

    // Record a near-miss attempt (drives escalating Recipe Book hints)
    // once per distinct close combination, so repeated identical grids
    // don't inflate the counter. Keyed by the close recipe + grid.
    const lastCloseKey = useRef(null);
    useEffect(() => {
        if (result.type === 'close' && result.recipe) {
            const key =
                result.recipe.id + ':' + slots.filter(Boolean).sort().join('+');
            if (lastCloseKey.current !== key) {
                lastCloseKey.current = key;
                recordAttempt(result.recipe.id);
            }
        } else if (result.type !== 'close') {
            lastCloseKey.current = null;
        }
    }, [result, slots, recordAttempt]);
    const craftableResultId = craftableRecipe
        ? craftableRecipe.result
        : null;
    const isNewResult =
        craftableRecipe && !discoveredSet.has(craftableRecipe.id);

    // --- one-time Master Crafter celebration ---
    useEffect(() => {
        if (masterCrafterEarned && !masterCrafterCelebrated) {
            setShowCelebration(true);
            play('masterCrafter');
        }
    }, [masterCrafterEarned, masterCrafterCelebrated, play]);

    // --- toast lifecycle ---
    const pushToast = useCallback(
        (resultId, title) => {
            const id = ++toastId.current;
            setToasts((t) => [...t, { id, resultId, title }]);
            play('notifIn');
            setTimeout(() => {
                play('notifOut');
                setTimeout(
                    () => setToasts((t) => t.filter((x) => x.id !== id)),
                    300
                );
            }, TOAST_MS);
        },
        [play]
    );

    // --- grid mutations ---
    const placeIngredient = useCallback(
        (ingredientId, index) => {
            let placed = false;
            setSlots((prev) => {
                const next = [...prev];
                if (typeof index === 'number') {
                    next[index] = ingredientId; // place/replace at index
                    placed = true;
                } else {
                    const empty = next.findIndex((s) => s === null);
                    if (empty === -1) {
                        return prev; // grid full
                    }
                    next[empty] = ingredientId;
                    placed = true;
                }
                return next;
            });
            if (placed) {
                play('clearClicked');
            }
        },
        [play]
    );

    const removeSlot = useCallback(
        (index) => {
            setSlots((prev) => {
                if (!prev[index]) {
                    return prev;
                }
                const next = [...prev];
                next[index] = null;
                return next;
            });
            play('clearClicked');
        },
        [play]
    );

    // Track which slot is being dragged (set by the grid on dragstart).
    const handleSlotDragStartTrack = useCallback((index) => {
        draggingSlot.current = index;
    }, []);

    // Drag a grid item OUTSIDE the grid (dropped nowhere valid) removes
    // it: a document-level dragend fallback checks the drop effect.
    useEffect(() => {
        const onDragEnd = (e) => {
            if (
                draggingSlot.current !== null &&
                e.dataTransfer &&
                e.dataTransfer.dropEffect === 'none'
            ) {
                removeSlot(draggingSlot.current);
            }
            draggingSlot.current = null;
        };
        document.addEventListener('dragend', onDragEnd);
        return () => document.removeEventListener('dragend', onDragEnd);
    }, [removeSlot]);

    // --- collect a crafted result ---
    const collect = useCallback(
        (resultId) => {
            if (!craftableRecipe) {
                return;
            }
            const item = resolveResult(resultId);
            if (isNewResult) {
                discover(craftableRecipe.id);
                play('achievementGet');
                pushToast(resultId, item ? item.title : 'a project');
            }
            if (item) {
                openItem(item);
            }
        },
        [craftableRecipe, isNewResult, discover, play, pushToast, openItem]
    );

    const closeCelebration = () => {
        setShowCelebration(false);
        markCelebrated();
    };

    const handleReset = () => {
        // eslint-disable-next-line no-alert
        if (
            window.confirm(
                'Reset all crafting progress? This cannot be undone.'
            )
        ) {
            reset();
            setSlots(EMPTY_SLOTS);
        }
    };

    const discoveredCount = recipes.filter((r) =>
        discoveredSet.has(r.id)
    ).length;

    return (
        <Section
            id="craft"
            eyebrow="// CRAFTING MODE"
            title="Craft my projects."
        >
            <div className="craft">
                <div className="craft__toolbar">
                    <p className="craft__intro">
                        Design Engineering is about combining disciplines
                        to build something new. Drag or double-click
                        ingredients into the grid (order doesn't matter).
                    </p>

                    <button
                        type="button"
                        className="craft-button craft-button--secondary craft-mute"
                        onClick={toggleMute}
                        aria-pressed={muted}
                        aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
                    >
                        {muted ? <SoundOffIcon /> : <SoundOnIcon />}
                    </button>
                </div>

                {/* Inventory (2x4) and crafting grid side by side */}
                <div className="craft__build">
                    <Inventory onPlace={placeIngredient} />

                    <CraftingGrid
                        slots={slots}
                        craftableResultId={craftableResultId}
                        isNewResult={isNewResult}
                        onPlace={placeIngredient}
                        onRemoveSlot={removeSlot}
                        onCollect={collect}
                        onSlotDragStart={handleSlotDragStartTrack}
                    />
                </div>

                <div className="craft__progress-row">
                    <span className="discovery-progress">
                        {discoveredCount} / {recipes.length} discovered
                    </span>
                    <button
                        type="button"
                        className="craft-button"
                        onClick={() => setBookOpen(true)}
                    >
                        Recipe Book
                    </button>
                    {masterCrafterEarned && (
                        <span className="discovery-progress">
                            ★ Master Crafter
                        </span>
                    )}
                </div>

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

            <RecipeBook
                open={bookOpen}
                onClose={() => setBookOpen(false)}
                discoveredSet={discoveredSet}
                attempts={attempts}
                onOpenItem={openItem}
            />

            <CraftNotifications toasts={toasts} />

            {showCelebration && (
                <MasterCrafterCelebration onClose={closeCelebration} />
            )}
        </Section>
    );
}

export default Craft;
