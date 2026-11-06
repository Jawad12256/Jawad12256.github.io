// Renders the single, app-wide ContentModal driven by ModalContext.
// Mounted once in App so any page can open it via useModal().

import ContentModal from './ContentModal';
import { useModal } from '../context/ModalContext';

function GlobalModal() {
    const { activeItem, closeModal } = useModal();
    return <ContentModal item={activeItem} onClose={closeModal} />;
}

export default GlobalModal;
