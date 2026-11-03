// Renders a single media entry of the canonical shape
// { src, alt, caption? }. Chooses <video> for video sources and <img>
// otherwise, so project/experience .mp4 entries present correctly and
// future-added images "just work" with no code change.

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];

function isVideo(src) {
    if (typeof src !== 'string') {
        return false;
    }
    const lower = src.toLowerCase();
    return VIDEO_EXTENSIONS.some((ext) => lower.includes(ext));
}

function MediaItem({ image }) {
    if (!image || !image.src) {
        return null;
    }

    const { src, alt = '', caption } = image;

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
