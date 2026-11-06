// Derives a flat, images-only collection for the Gallery page from the
// existing records (no separate/duplicated gallery dataset). Each entry
// pairs an image with the normalised ContentItem to open when clicked.
//
// Per owner preference, this file keeps its OWN isVideo check rather
// than importing a shared helper.

import {
    projects,
    experience,
    achievements,
    events,
    credentials
} from '../data';

import {
    normaliseProject,
    normaliseExperience,
    normaliseAchievement,
    normaliseEvent,
    normaliseCredential
} from './normaliseContent';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
const isVideo = (src) =>
    typeof src === 'string' &&
    VIDEO_EXTENSIONS.some((ext) => src.toLowerCase().includes(ext));

// Returns: [{ image: { src, alt, caption? }, item: ContentItem }]
export function getGalleryImages() {
    const out = [];

    const addImages = (normItem, images) => {
        (images || []).forEach((image) => {
            if (image && image.src && !isVideo(image.src)) {
                out.push({ image, item: normItem });
            }
        });
    };

    projects.forEach((p) => {
        const n = normaliseProject(p);
        addImages(n, n.images);
    });

    experience.forEach((e) => {
        const n = normaliseExperience(e);
        addImages(n, n.images);
        // Nested sub-project images (e.g. Trivyal/Cyphon) open the PARENT
        // experience record's modal, per owner decision.
        (n.subItems || []).forEach((sub) => addImages(n, sub.images));
    });

    achievements.forEach((a) => {
        const n = normaliseAchievement(a);
        addImages(n, n.images);
    });

    events.forEach((ev) => {
        const n = normaliseEvent(ev);
        addImages(n, n.images);
    });

    credentials.forEach((c) => {
        const n = normaliseCredential(c);
        addImages(n, n.images);
    });

    return out;
}
