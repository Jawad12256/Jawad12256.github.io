import { Link, useNavigate, useLocation } from 'react-router-dom';

const SECTIONS = [
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'achievements', label: 'Awards' },
    { id: 'contact', label: 'Contact' }
];

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Scroll to an in-page section. If we're not on the home route,
    // navigate home first, then scroll once it has rendered.
    const goToSection = (id) => (event) => {
        event.preventDefault();
        const scroll = () => {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        };
        if (location.pathname !== '/') {
            navigate('/');
            // allow the home page to mount before scrolling
            setTimeout(scroll, 50);
        } else {
            scroll();
        }
    };

    return (
        <nav className="navbar">
            <div className="container navbar__inner">

                <Link to="/" className="navbar__logo">
                    JAWAD<span>.</span>
                </Link>

                <div className="navbar__links">
                    {SECTIONS.map((section) => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            onClick={goToSection(section.id)}
                        >
                            {section.label}
                        </a>
                    ))}

                    <Link to="/gallery">Gallery</Link>
                    <Link to="/craft">Craft</Link>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;
