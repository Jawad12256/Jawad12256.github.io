function Footer() {
    return (
        <footer className="footer">
            <div className="container">

                <p>
                    © {new Date().getFullYear()} Jawad Uddin
                </p>

                <p>
                    Built with React.
                </p>

            </div>
        </footer>
    );
}

export default Footer;