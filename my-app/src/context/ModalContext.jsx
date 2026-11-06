// Shared content-modal state, lifted out of Home so any page (Home,
// Gallery, ...) can open the single app-wide ContentModal.

import {
    createContext,
    useCallback,
    useContext,
    useState
} from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [activeItem, setActiveItem] = useState(null);

    const openItem = useCallback((item) => setActiveItem(item), []);
    const closeModal = useCallback(() => setActiveItem(null), []);

    return (
        <ModalContext.Provider
            value={{ activeItem, openItem, closeModal }}
        >
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const ctx = useContext(ModalContext);
    if (!ctx) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return ctx;
}
