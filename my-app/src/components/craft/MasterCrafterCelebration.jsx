// One-time Master Crafter celebration overlay. Rendered by the Craft
// page only when the achievement is newly earned (not on revisit).

function MasterCrafterCelebration({ onClose }) {
    return (
        <div
            className="master-crafter"
            role="dialog"
            aria-modal="true"
            aria-label="Master Crafter achievement unlocked"
            onClick={onClose}
        >
            <div
                className="master-crafter__card"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="master-crafter__title">
                    MASTER CRAFTER!
                </p>
                <p className="master-crafter__text">
                    You discovered every recipe and crafted the full
                    breadth of my Design Engineering work. Nicely done —
                    that's exactly the spirit of combining disciplines to
                    build something new.
                </p>
                <button
                    type="button"
                    className="craft-button"
                    onClick={onClose}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default MasterCrafterCelebration;
