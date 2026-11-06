import { useMemo } from 'react';

import Section from '../components/Section';
import { getGalleryImages } from '../utils/galleryImages';
import { useModal } from '../context/ModalContext';

function Gallery() {
    const { openItem } = useModal();
    const images = useMemo(() => getGalleryImages(), []);

    return (
        <Section
            id="gallery"
            eyebrow="// GALLERY"
            title="A visual tour of my work."
        >
            <div className="gallery-masonry">
                {images.map(({ image, item }, index) => (
                    <button
                        type="button"
                        className="gallery-item"
                        key={`${item.id}-${index}`}
                        onClick={() => openItem(item)}
                        aria-label={`Open ${item.title}`}
                    >
                        <img
                            src={image.src}
                            alt={image.alt || item.title}
                            loading="lazy"
                        />

                        {image.caption && (
                            <span className="gallery-item__caption">
                                {image.caption}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </Section>
    );
}

export default Gallery;
