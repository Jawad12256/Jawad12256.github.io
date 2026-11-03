function IdentityMarquee({ items }) {
    const repeatedItems = [...items, ...items];

    return (
        <div className="identity-marquee">
            <div className="identity-marquee__track">
                {repeatedItems.map((item, index) => (
                    <div
                        className="identity-card"
                        key={`${item}-${index}`}
                    >
                        <span className="identity-card__text">
                            {item}
                        </span>
                        <span
                            className="identity-card__divider"
                            aria-hidden="true"
                        >
                            {'//'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default IdentityMarquee;