# Data Conventions & Deferred SPA-Fallback Notes

Produced by Spec 1 (build-and-deployment-baseline). These are reference
notes for future specs — especially the content-modal and gallery work.

## Canonical data shapes

All portfolio records (projects, experience items, achievements, events,
credentials) share these conventions for media and links.

### Image object

```js
{
  src: importedAsset,   // REQUIRED — an ES import of a file in src/assets
  alt: "Description",    // REQUIRED — meaningful alt text
  caption: "Optional"    // OPTIONAL — omit the key entirely when not used
}
```

### Image collection

```js
images: [ /* zero or more image objects, in display order */ ]
```

- An empty `images: []` is valid and expected for records whose media
  has not been added yet (e.g. `trivyal`, `cyphon`, several experience
  and event items). These will be populated later by the owner.

### Links

```js
links: { /* zero or more named links; use {} when there are none */ }
```

## Defensive-iteration convention (REQUIRED of future consumers)

To guarantee that adding images later needs **no code change**, any
component that renders record media/links MUST:

1. Treat `images` as a possibly-empty array and render by mapping over
   it — never index `images[0]` without a guard.
2. Treat `links` as a possibly-empty object and render only the keys
   that are present.
3. Render `caption` conditionally (it may be absent).
4. Never fabricate a placeholder image, caption, or link when content is
   absent. Missing content renders as nothing, not as invented filler.

Because an empty array maps to nothing and a populated array maps to its
items, a record can go from `images: []` to a populated list — using the
image object shape above — with zero changes to consuming code.

> Note: In the current codebase, `ProjectCard` does not read `images` or
> `links` at all, so empty collections already cause no issue today. The
> convention above exists so the next spec's modal/gallery honour it from
> the start.

## Deferred SPA-fallback plan (NOT implemented yet)

No client-side router exists today, so no fallback is wired. When
routing is introduced in a later spec, apply BOTH:

- **GitHub Pages:** add a `404.html` that redirects unmatched paths to
  `index.html` (the standard CRA/GH-Pages SPA redirect), plus a
  `.nojekyll` file so Jekyll does not strip `_`-prefixed build assets.
- **AWS Amplify:** add a rewrite rule (200) mapping unmatched routes to
  `/index.html`.

These are intentionally NOT added now, because an unused 404 redirect
during this baseline phase could mask genuine 404s.

## Base-path note (verified in Spec 1)

The production build emits root-relative asset URLs (`/static/...`),
confirmed by inspecting `build/index.html` ("hosted at /"). Because this
is a user-pages repository (`jawad12256.github.io`) served from the
domain root, and Amplify also serves from its app root, the same build
works on both hosts with no per-host base-path change.

> Caveat: if a custom domain with a subpath, or a project-pages subpath,
> is ever introduced, the `homepage` value and base path must be
> revisited.
