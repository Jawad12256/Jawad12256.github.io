// Shared platform link button: renders a recognisable icon for a link
// key, with clarifying text where the platform alone is ambiguous.
// Used by both the ContentModal and the Contact section.

import {
    GitHubIcon,
    LinkedInIcon,
    CubeIcon,
    EmailIcon,
    ArticleIcon,
    CredentialIcon,
    ExternalIcon
} from './icons/BrandIcons';

// key -> { Icon, label (also the accessible name), showLabel }
// showLabel=false → icon-only button (label still used for aria-label).
const LINK_CONFIG = {
    github: { Icon: GitHubIcon, label: 'GitHub', showLabel: false },
    linkedin: { Icon: LinkedInIcon, label: 'LinkedIn', showLabel: false },
    makerworld: { Icon: CubeIcon, label: 'MakerWorld', showLabel: false },
    email: { Icon: EmailIcon, label: 'Email', showLabel: false },

    // Ambiguous / needs clarification → icon + text
    article: { Icon: ArticleIcon, label: 'Read article', showLabel: true },
    credential: {
        Icon: CredentialIcon,
        label: 'Verify credential',
        showLabel: true
    },
    linkedinTrivyal: {
        Icon: LinkedInIcon,
        label: 'Trivyal',
        showLabel: true
    },
    linkedinCyphon: {
        Icon: LinkedInIcon,
        label: 'Cyphon',
        showLabel: true
    }
};

const prettify = (key) =>
    key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (c) => c.toUpperCase());

function LinkButton({ linkKey, href }) {
    if (!href) {
        return null;
    }

    const config = LINK_CONFIG[linkKey];
    const Icon = config ? config.Icon : ExternalIcon;
    const label = config ? config.label : prettify(linkKey);
    const showLabel = config ? config.showLabel : true;

    const isEmail = linkKey === 'email';
    const resolvedHref = isEmail ? `mailto:${href}` : href;

    const externalProps = isEmail
        ? {}
        : { target: '_blank', rel: 'noreferrer noopener' };

    return (
        <a
            className="link-button"
            href={resolvedHref}
            aria-label={label}
            {...externalProps}
        >
            <Icon />
            {showLabel && <span>{label}</span>}
        </a>
    );
}

export default LinkButton;
