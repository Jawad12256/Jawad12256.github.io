function Section({ id, eyebrow, title, children }) {
    return (
        <section id={id} className="section">

            <div className="container">

                <p className="section__eyebrow">
                    {eyebrow}
                </p>

                <h2 className="section__title">
                    {title}
                </h2>

                <div className="section__content">
                    {children}
                </div>

            </div>

        </section>
    );
}

export default Section;