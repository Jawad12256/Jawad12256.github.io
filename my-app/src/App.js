import { HashRouter, Routes, Route } from 'react-router-dom';

import { ModalProvider } from './context/ModalContext';
import AppShell from './layout/AppShell';
import GlobalModal from './components/GlobalModal';
import Background from './components/Background';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Craft from './pages/Craft';

function App() {
    return (
        <HashRouter>
            <ModalProvider>
                <Background />

                <AppShell>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/craft" element={<Craft />} />
                    </Routes>
                </AppShell>

                <GlobalModal />
            </ModalProvider>
        </HashRouter>
    );
}

export default App;
