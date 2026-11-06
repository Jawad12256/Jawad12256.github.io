// Renders a single media entry of the canonical shape
// { src, alt, caption? }. Chooses <video> for video sources, a styled
// "open in new tab" link for PDFs (documents don't render as images),
// and <img> otherwise — so project/experience media "just works".

import { ArticleIcon } from './icons/BrandIcons';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];

function isVideo(src) {
    if (typeof src !== 'string') {
        return false;
    }
    const lower = src.toLowerCase();
    return VIDEO_EXTENSIONS.some((ext) => lower.includes(ext));
}

function isPdf(src) {
    return typeof src === 'string' && src.toLowerCase().includes('.pdf');
}

function MediaItem({ image }) {
    if (!image || !image.src) {
        return null;
    }

    const { src, alt = '', caption } = image;

    // PDFs can't render as <img>; present a styled link that opens in a
    // new tab. Generic for any .pdf entry.
    if (isPdf(src)) {
        return (
            <figure className="media-item media-item--doc">
                <a
                    className="media-doc"
                    href={src}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <ArticleIcon />
                    <span className="media-doc__label">
                        {caption || alt || 'Open document (PDF)'}
                    </span>
                    <span className="media-doc__hint">
                        Opens in a new tab
                    </span>
                </a>
            </figure>
        );
    }

    return (
        <figure className="media-item">
            {isVideo(src) ? (
                <video
                    className="media-item__media"
                    src={src}
                    controls
                    preload="metadata"
                    aria-label={alt}
                />
            ) : (
                <img
                    className="media-item__media"
                    src={src}
                    alt={alt}
                    loading="lazy"
                />
            )}

            {caption && (
                <figcaption className="media-item__caption">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}

export default MediaItem;
