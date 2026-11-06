import { HashRouter, Routes, Route } from 'react-router-dom';

import { ModalProvider } from './context/ModalContext';
import AppShell from './layout/AppShell';
import GlobalModal from './components/GlobalModal';
import Home from './pages/Home';
import Gallery from './pages/Gallery';

function App() {
    return (
        <HashRouter>
            <ModalProvider>
                <AppShell>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/gallery" element={<Gallery />} />
                    </Routes>
                </AppShell>

                <GlobalModal />
            </ModalProvider>
        </HashRouter>
    );
}

export default App;
