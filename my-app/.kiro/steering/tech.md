---
inclusion: always
---

# Technology Stack and Constraints

## Existing stack

The project is an existing React application using JavaScript,
JSX and CSS.

Inspect the actual repository and package.json before making
assumptions about the build system, installed dependencies,
scripts or deployment configuration.

Do not migrate the application to TypeScript, Next.js, Vite
or another framework unless explicitly requested.

## Architecture

- Prefer client-side React components.
- Keep the application static and suitable for static hosting.
- Use the existing CSS architecture and design tokens.
- Reuse existing libraries and dependencies where possible.
- Avoid introducing dependencies without a clear justification.
- Prefer simple, maintainable implementations over unnecessary
  abstractions.

## Hosting

The same application must be deployable to:

1. GitHub Pages — the permanent personal portfolio.
2. AWS Amplify — the temporary hackathon deployment.

Do not create separate application implementations for these hosts.

Be careful with routing, asset paths, base paths and build
configuration so that both deployments work correctly.

## Build and validation

Inspect package.json to identify the available scripts.

Use the existing build command to validate changes, provided
that a build script exists.

Do not invent or replace build scripts without first explaining
why the change is needed.

Resolve build errors before considering a task complete.

## Assets

- Reuse existing images and videos wherever possible.
- Preserve the current asset organisation unless there is a
  clear reason to change it.
- Verify asset import paths against actual filenames.
- Do not duplicate images simply to support another section.
- Ensure images have meaningful alt text where appropriate.

## Restrictions

Do not:
- Introduce a backend or database.
- Add unnecessary AWS services.
- Add secrets or credentials to source code.
- Deploy publicly without explicit approval.
- Delete or replace existing assets without approval.