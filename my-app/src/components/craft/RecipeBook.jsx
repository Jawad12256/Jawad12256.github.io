// Recipe Book lightbox (Spec 12). A labelled button opens an overlay
// containing the discovery grid (locked silhouettes + hints, unlocked
// entries open the existing ContentModal). The discovery COUNT stays
// visible on the page outside the lightbox (rendered by the Craft page).

import { useCallback, useEffect, useRef } from 'react';

import DiscoveryBook from './DiscoveryBook';

function RecipeBook({ open, onClose, discoveredSet, attempts, onOpenItem }) {
    const dialogRef = useRef(null);
    const previouslyFocused = useRef(null);

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (!open) {
            return undefined;
        }
        previouslyFocused.current = document.activeElement;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);
        if (dialogRef.current) {
            dialogRef.current.focus();
        }
        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener('keydown', handleKeyDown);
            if (
                previouslyFocused.current &&
                typeof previouslyFocused.current.focus === 'function'
            ) {
                previouslyFocused.current.focus();
            }
        };
    }, [open, handleKeyDown]);

    if (!open) {
        return null;
    }

    return (
        <div className="recipe-book-overlay" onClick={onClose}>
            <div
                className="recipe-book"
                role="dialog"
                aria-modal="true"
                aria-label="Recipe Book"
                tabIndex={-1}
                ref={dialogRef}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="recipe-book__close"
                    aria-label="Close Recipe Book"
                    onClick={onClose}
                >
                    ×
                </button>

                <DiscoveryBook
                    discoveredSet={discoveredSet}
                    attempts={attempts}
                    onOpen={onOpenItem}
                />
            </div>
        </div>
    );
}

export default RecipeBook;
