---
inclusion: always
---

# Project Structure and Coding Conventions

## Existing project organisation

The application currently uses a structure broadly organised as:

src/
  assets/
  components/
  data/
  layout/
  pages/
  styles/
  utils/

Respect the existing structure. Inspect the current repository
before creating, moving or renaming files.

## Responsibilities

- assets/: Images, videos and other static media.
- components/: Reusable UI components.
- data/: Portfolio content and structured data.
- layout/: Shared application layout.
- pages/: Page-level components.
- styles/: Global styles, component styles and design tokens.
- utils/: Reusable helper functions.

## Data conventions

When standardising or extending portfolio data:

- Use stable kebab-case IDs.
- Use consistent field names across similar data types.
- Use arrays for technologies, skills and images.
- Use an object for links.
- Avoid placeholder values represented by empty strings.
- Keep project descriptions and experience descriptions factual.

Preferred image representation:

{
  src: imageImport,
  alt: "Description of the image",
  caption: "Optional caption"
}

Prefer consistent categories and types across records.

Do not silently discard existing information when normalising
the data model.

## Component conventions

- Prefer functional React components.
- Use React hooks where appropriate.
- Keep components focused on a clear responsibility.
- Avoid duplicating UI logic between similar components.
- Keep portfolio content in data files rather than hardcoding
  it into presentation components.

## Important architectural intentions

### Content modals

Projects, experience items and gallery images should be able
to open a reusable, centralised content modal.

The modal should support the appropriate content type and
display relevant descriptions, images and links.

### Gallery

The gallery should derive its content from existing project
and experience image collections.

Do not create a second copy of the same image assets or
maintain a separate manually duplicated gallery dataset.

### Crafting Mode

Crafting Mode should reference existing project IDs rather
than duplicating project descriptions or content.

Keep game-specific logic separate from the main portfolio
presentation components.