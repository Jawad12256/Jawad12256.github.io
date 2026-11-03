// Generic, keyboard-operable summary card used by the non-project
// sections (experience, credentials, achievements, events). Driven by a
// normalised ContentItem; activating it opens the shared ContentModal.

function Card({ item, onClick }) {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
        }
    };

    return (
        <article
            className="card"
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={handleKeyDown}
        >
            {item.subtitle && (
                <span className="card__meta">{item.subtitle}</span>
            )}

            <h3 className="card__title">{item.title}</h3>

            {item.shortDescription && (
                <p className="card__desc">{item.shortDescription}</p>
            )}
        </article>
    );
}

export default Card;
