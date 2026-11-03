function Navbar() {
    return (
        <nav className="navbar">
            <div className="container navbar__inner">

                <a href="#top" className="navbar__logo">
                    JAWAD<span>.</span>
                </a>

                <div className="navbar__links">
                    <a href="#projects">Projects</a>
                    <a href="#experience">Experience</a>
                    <a href="#achievements">Achievements</a>
                    <a href="#contact">Contact</a>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;