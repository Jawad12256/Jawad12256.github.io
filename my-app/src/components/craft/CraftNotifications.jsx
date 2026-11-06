// Advancement-style craft notifications (Spec 12). A fixed top-right
// stack of toasts; each shows the crafted item and auto-dismisses. The
// Craft page owns the queue and removal timing (and the in/out sounds);
// this component just renders the current toasts.

import ResultIcon from './ResultIcon';

function CraftNotifications({ toasts }) {
    if (!toasts || toasts.length === 0) {
        return null;
    }

    return (
        <div className="craft-toasts" aria-live="polite">
            {toasts.map((toast) => (
                <div
                    className={
                        'craft-toast' +
                        (toast.exiting ? ' craft-toast--exiting' : '')
                    }
                    key={toast.id}
                >
                    <span className="craft-toast__icon">
                        <ResultIcon
                            resultId={toast.resultId}
                            label={toast.title}
                        />
                    </span>
                    <span className="craft-toast__body">
                        <span className="craft-toast__eyebrow">
                            Item crafted!
                        </span>
                        <span className="craft-toast__title">
                            {toast.title}
                        </span>
                    </span>
                </div>
            ))}
        </div>
    );
}

export default CraftNotifications;
