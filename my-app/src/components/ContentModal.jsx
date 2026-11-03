// Single reusable content modal (Spec 2 keystone).
//
// Renders any normalised ContentItem (project, experience, achievement,
// event, credential) through one implementation. Dependency-free:
// React portal + hooks. Handles empty images/links gracefully and shows
// nested experience sub-projects in a "Projects within this role"
// subsection.

import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import MediaItem from './MediaItem';

// Human-friendly labels for known link keys; unknown keys fall back to
// the key itself (prettified).
const LINK_LABELS = {
    github: 'GitHub',
    makerworld: 'MakerWorld',
    article: 'Read article',
    credential: 'Verify credential',
    linkedin: 'LinkedIn',
    linkedinTrivyal: 'LinkedIn: Trivyal',
    linkedinCyphon: 'LinkedIn: Cyphon'
};

const prettifyKey = (key) =>
    key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (c) => c.toUpperCase());

function Chips({ label, items }) {
    if (!items || items.length === 0) {
        return null;
    }
    return (
        <div className="modal__chips-group">
            <h4 className="modal__chips-label">{label}</h4>
            <div className="modal__chips">
                {items.map((item) => (
                    <span className="modal__chip" key={item}>
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}

function LinksList({ links }) {
    const entries = Object.entries(links || {}).filter(
        ([, url]) => Boolean(url)
    );
    if (entries.length === 0) {
        return null;
    }
    return (
        <div className="modal__links">
            {entries.map(([key, url]) => (
                <a
                    key={key}
                    className="modal__link"
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    {LINK_LABELS[key] || prettifyKey(key)}
                </a>
            ))}
        </div>
    );
}

function MetaLines({ item }) {
    const lines = [];
    const meta = item.meta || {};

    if (item.type === 'achievement') {
        if (meta.award) lines.push(['Award', meta.award]);
        if (meta.recognition) lines.push(['Recognition', meta.recognition]);
    }
    if (item.type === 'credential') {
        if (meta.issuer) lines.push(['Issuer', meta.issuer]);
    }
    if (item.type === 'experience') {
        if (meta.organisation) lines.push(['Organisation', meta.organisation]);
    }

    if (lines.length === 0) {
        return null;
    }
    return (
        <dl className="modal__meta">
            {lines.map(([term, value]) => (
                <div className="modal__meta-row" key={term}>
                    <dt>{term}</dt>
                    <dd>{value}</dd>
                </div>
            ))}
        </dl>
    );
}

function SubItem({ item }) {
    return (
        <div className="modal__subitem">
            <h4 className="modal__subitem-title">{item.title}</h4>
            {item.description && (
                <p className="modal__subitem-desc">{item.description}</p>
            )}
            <Chips label="Technologies" items={item.technologies} />
            <Chips label="Skills" items={item.skills} />
            {item.images.length > 0 && (
                <div className="modal__media-grid">
                    {item.images.map((image, index) => (
                        <MediaItem key={index} image={image} />
                    ))}
                </div>
            )}
            <LinksList links={item.links} />
        </div>
    );
}

function ContentModal({ item, onClose }) {
    const dialogRef = useRef(null);
    const previouslyFocused = useRef(null);

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                onClose();
                return;
            }
            // Basic focus trap.
            if (event.key === 'Tab' && dialogRef.current) {
                const focusable = dialogRef.current.querySelectorAll(
                    'a[href], button, video, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) {
                    return;
                }
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === last
                ) {
                    event.preventDefault();
                    first.focus();
                }
            }
        },
        [onClose]
    );

    // Open side effects: scroll lock, focus capture/move, keydown listener.
    useEffect(() => {
        if (!item) {
            return undefined;
        }

        previouslyFocused.current = document.activeElement;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        document.addEventListener('keydown', handleKeyDown);

        // Move focus into the dialog.
        if (dialogRef.current) {
            dialogRef.current.focus();
        }

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
            // Restore focus to the triggering element where practical.
            if (
                previouslyFocused.current &&
                typeof previouslyFocused.current.focus === 'function'
            ) {
                previouslyFocused.current.focus();
            }
        };
    }, [item, handleKeyDown]);

    if (!item) {
        return null;
    }

    const titleId = `modal-title-${item.id}`;
    const hasImages = item.images && item.images.length > 0;
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return createPortal(
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                ref={dialogRef}
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className="modal__close"
                    aria-label="Close"
                    onClick={onClose}
                >
                    ×
                </button>

                <header className="modal__header">
                    {item.subtitle && (
                        <p className="modal__eyebrow">{item.subtitle}</p>
                    )}
                    <h2 id={titleId} className="modal__title">
                        {item.title}
                    </h2>
                </header>

                <div className="modal__body">
                    <MetaLines item={item} />

                    {item.description && (
                        <p className="modal__description">
                            {item.description}
                        </p>
                    )}

                    <Chips label="Technologies" items={item.technologies} />
                    <Chips label="Skills" items={item.skills} />

                    {hasImages && (
                        <div className="modal__media-grid">
                            {item.images.map((image, index) => (
                                <MediaItem key={index} image={image} />
                            ))}
                        </div>
                    )}

                    {hasSubItems && (
                        <section className="modal__subitems">
                            <h3 className="modal__subitems-title">
                                Projects within this role
                            </h3>
                            {item.subItems.map((sub) => (
                                <SubItem key={sub.id} item={sub} />
                            ))}
                        </section>
                    )}

                    <LinksList links={item.links} />
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ContentModal;
