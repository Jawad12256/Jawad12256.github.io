// Content normalisation layer (Spec 2).
//
// Pure adapter functions that map each differently-shaped portfolio
// record onto one consistent `ContentItem` shape, so a single reusable
// ContentModal can render any record type.
//
// Conventions (per .kiro steering and Spec 1 data-conventions):
// - Never discard source fields: anything not mapped to a core property
//   is preserved under `meta`.
// - Never fabricate content: empty images/links pass through as [] / {}.
// - These are read-only views; the source data files are not mutated.
//
// ContentItem shape:
// {
//   id, type, title, subtitle,
//   shortDescription, description,
//   technologies: [], skills: [],
//   images: [{ src, alt, caption? }],
//   links: { name: url },
//   meta: { ...type-specific preserved fields },
//   subItems: [ ContentItem ]   // e.g. nested experience sub-projects
// }

const asArray = (value) => (Array.isArray(value) ? value : []);
const asObject = (value) =>
    value && typeof value === 'object' ? value : {};

const joinMeta = (parts) => parts.filter(Boolean).join(' · ');

// Video detection mirrors MediaItem's logic, so hero fallback never
// picks a video source as a card thumbnail.
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
const isVideoSrc = (src) =>
    typeof src === 'string' &&
    VIDEO_EXTENSIONS.some((ext) => src.toLowerCase().includes(ext));

// Resolve a single hero image for a card:
//   1. an explicit `record.heroImage` if provided, else
//   2. the first non-video entry in `images`, else
//   3. null (card renders a tasteful image-less state).
// Never borrows an image from another record and never fabricates one.
const resolveHeroImage = (record) => {
    if (record.heroImage && record.heroImage.src) {
        return record.heroImage;
    }
    const firstStill = asArray(record.images).find(
        (img) => img && img.src && !isVideoSrc(img.src)
    );
    return firstStill || null;
};

export function normaliseProject(project) {
    return {
        id: project.id,
        type: 'project',
        title: project.title,
        heroImage: resolveHeroImage(project),
        subtitle: joinMeta([project.type, project.year]),
        shortDescription: project.shortDescription || '',
        description: project.description || '',
        technologies: asArray(project.technologies),
        skills: asArray(project.skills),
        images: asArray(project.images),
        links: asObject(project.links),
        meta: {
            category: project.category,
            year: project.year,
            type: project.type,
            featured: project.featured
        },
        subItems: []
    };
}

export function normaliseExperience(experience) {
    return {
        id: experience.id,
        type: 'experience',
        title: experience.role,
        heroImage: resolveHeroImage(experience),
        subtitle: joinMeta([
            experience.organisation,
            experience.period
        ]),
        shortDescription: experience.shortDescription || '',
        description: experience.description || '',
        technologies: asArray(experience.technologies),
        skills: asArray(experience.skills),
        images: asArray(experience.images),
        links: asObject(experience.links),
        meta: {
            organisation: experience.organisation,
            role: experience.role,
            period: experience.period,
            type: experience.type
        },
        // Nested sub-projects (e.g. Trivyal / Cyphon) are kept WITHIN the
        // role, conveying technical depth without promoting them to the
        // top-level Projects grid.
        subItems: asArray(experience.projects).map(normaliseProject)
    };
}

export function normaliseAchievement(achievement) {
    return {
        id: achievement.id,
        type: 'achievement',
        title: achievement.title,
        heroImage: resolveHeroImage(achievement),
        subtitle: joinMeta([
            achievement.category,
            achievement.year
        ]),
        shortDescription: achievement.shortDescription || '',
        description: achievement.description || '',
        technologies: [],
        skills: asArray(achievement.skills),
        images: asArray(achievement.images),
        links: asObject(achievement.links),
        meta: {
            category: achievement.category,
            year: achievement.year,
            award: achievement.award,
            recognition: achievement.recognition
        },
        subItems: []
    };
}

export function normaliseEvent(event) {
    return {
        id: event.id,
        type: 'event',
        title: event.title,
        heroImage: resolveHeroImage(event),
        subtitle: joinMeta([event.role, event.year]),
        shortDescription: event.shortDescription || '',
        description: event.description || '',
        technologies: [],
        skills: asArray(event.skills),
        images: asArray(event.images),
        links: asObject(event.links),
        meta: {
            shortTitle: event.shortTitle,
            role: event.role,
            year: event.year
        },
        subItems: []
    };
}

export function normaliseCredential(credential) {
    // Fold the verification URL into the standard links representation so
    // the modal's generic link rendering handles it; retain the raw value
    // in meta so nothing is discarded.
    const links = asObject(credential.links);
    const mergedLinks = credential.credentialUrl
        ? { ...links, credential: credential.credentialUrl }
        : links;

    return {
        id: credential.id,
        type: 'credential',
        title: credential.title,
        heroImage: resolveHeroImage(credential),
        subtitle: joinMeta([credential.issuer, credential.year]),
        shortDescription: credential.shortDescription || '',
        description: credential.description || '',
        technologies: [],
        skills: asArray(credential.skills),
        images: asArray(credential.images),
        links: mergedLinks,
        meta: {
            issuer: credential.issuer,
            year: credential.year,
            category: credential.category,
            credentialUrl: credential.credentialUrl
        },
        subItems: []
    };
}

const normalisersByType = {
    project: normaliseProject,
    experience: normaliseExperience,
    achievement: normaliseAchievement,
    event: normaliseEvent,
    credential: normaliseCredential
};

// Dispatcher for convenience when the type is known.
export function normalise(type, record) {
    const fn = normalisersByType[type];
    if (!fn) {
        throw new Error(`Unknown content type: ${type}`);
    }
    return fn(record);
}
