import { useReveal } from '../hooks/useReveal';

function Section({ id, eyebrow, title, children }) {
    const [ref, shown] = useReveal();

    return (
        <section
            id={id}
            className={'section reveal' + (shown ? ' reveal--shown' : '')}
            ref={ref}
        >

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
