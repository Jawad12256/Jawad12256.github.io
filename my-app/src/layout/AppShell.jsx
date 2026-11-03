import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

function AppShell({ children }) {
    return (
        <>
            <Navbar />

            <main>
                {children}
            </main>

            <Footer />
        </>
    );
}

export default AppShell;