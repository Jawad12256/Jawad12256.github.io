import Navbar from '../components/Navbar';
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