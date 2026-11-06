// Subtle decorative background (Spec 13 — experiment, isolated so it can
// be cleanly removed: delete this file, its base.css @import, and the
// single mount in App). Fixed to the viewport, behind all content, and
// non-interactive. Visuals live entirely in background.css.

function Background() {
    return (
        <div className="bg-flair" aria-hidden="true">
            <span className="bg-flair__spark bg-flair__spark--left" />
            <span className="bg-flair__spark bg-flair__spark--right" />
        </div>
    );
}

export default Background;
