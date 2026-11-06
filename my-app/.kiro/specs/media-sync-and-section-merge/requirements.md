# Spec 8 — Media Sync, Caption Authoring, Icon Sizing, Section Merge

## Introduction

The owner has committed a large batch of new/renamed media assets. This
spec wires those assets into the data layer (imports + image objects +
hero images + alt/caption text), adds the AWS credential images,
enlarges the brand-icon buttons, and merges the Credentials section into
the Competitions/Awards section.

Full data-mutation permission applies for this spec. Gallery and
Crafting Mode remain on hold.

### Owner instructions (verbatim intent)

1. Wire all new media in the affected asset folders into the JS data
   files, handling imports and the repetitive image-object boilerplate.
2. Some existing files were renamed (notably which image is "hero").
   Account for the renames; fix broken imports to old filenames.
3. In every record, the hero image shown on the first-class card must
   be that record's hero, and its caption must follow it correctly.
4. Captions are the main complexity: match existing captions to the
   correct (possibly renamed) files, and write NEW best-guess alt +
   caption placeholders for new media. The owner will review/edit
   captions afterwards, so placeholders are acceptable for genuinely
   new/unclear media (clearly reasonable guesses, nothing fabricated as
   fact).
5. The AWS credential now has images — reflect this in the data
   structure (credentials previously had none).
6. Make the brand-icon link buttons ~50% bigger than current.
7. Merge the "Certifications and qualifications" section into the
   "Competitions and awards" section as a single section, e.g.
   "Certifications, competitions, and awards".

### Verified asset inventory (current `main`, after the owner's commit)

- `3d-printing/`: bambu.jpg, headphonesstand.jpg (NEW), hero.png,
  makerworld.jpg, phonestand1.jpg, phonestand2.jpg, printing.mp4
- `academic-representative/` (NEW folder): hero.jpg, jawad.jpeg
- `aws-certification/` (NEW folder): certification.jpg, hero.jpg
- `f1is/`: bandsaw.jpg, cfd.png, fea.jpg, hero.jpg, stand.jpg (NEW),
  technicaldrawing.jpg, track.jpg (NEW)  — NOTE: old imports referenced
  .png names and `winner.png` which no longer exist (BROKEN).
- `interfaith-iftar/`: donutsale.jpg (NEW), hall1.jpeg (NEW),
  hall2.jpeg (NEW), highlights.mp4 (NEW), title.jpg
- `iosdc/` (NEW folder): assembly.jpg, details.jpg, hero.jpg, rfp.jpg
- `internship-trivyal/` (NEW folder): hero.jpg, trivyalintro.jpg,
  trivyal.jpg
- `internship-cyphon/` (NEW folder): architecturediagram.jpg,
  interns.jpg, livedemo.jpg
- `srobo/` (NEW folder): buildingrobot.jpeg, community.jpeg,
  giraffery1.jpeg, hero.jpg, oldrobot.jpeg, robotinaction.mp4
- `tutoring/` (NEW folder): hero.jpg, slides.jpg
- `uksdc/`: certificates.jpg, elevatorrobots.jpeg, hero.jpg,
  highlights.jpeg — NOTE: old imports referenced .png names
  (mpdthruster/photobioreactor/technicaldrawing) which no longer exist
  (BROKEN).

### Current data state (relevant)

- `achievements.js`: imports OLD f1is/uksdc `.png` filenames that no
  longer exist → build-breaking until rewritten; `student-robotics`
  has `images: []`.
- `experience.js`: internship role, nested `trivyal`/`cyphon`,
  `tutoring`, `academic-representative` all have `images: []`.
- `events.js`: `iosdc` and `interfaith-iftar` have `images: []`.
- `credentials.js`: `aws-cloud-practitioner` has NO images field and no
  hero image.
- `.link-button` padding `var(--space-2) var(--space-4)`, icon `1em`.
- Home sections: Credentials (03) and Achievements (04) are separate;
  nav links to `#achievements`.

---

## Requirements

### Requirement 1 — Fix broken/renamed asset imports

**User story:** As the portfolio owner, I want the data files to import
assets that actually exist, so the build is not broken by renamed/
removed files.

#### Acceptance criteria

1. WHEN the data files are built THEN every asset import SHALL resolve to
   a file that exists on disk with the correct name and extension.
2. WHEN old f1is/uksdc `.png` imports (and `winner`, `mpdthruster`,
   `photobioreactor`, old `technicaldrawing`) no longer exist THEN they
   SHALL be removed or repointed to the correct current files.
3. WHEN existing image objects referenced a now-removed file THEN they
   SHALL be updated to a current file or removed, WITHOUT leaving a
   dangling/broken reference.
4. WHEN `npm run build` (including `CI=true`) runs THEN it SHALL succeed
   with zero unresolved asset imports.

### Requirement 2 — Wire new media into every affected record

**User story:** As the portfolio owner, I want all the new media present
in each record's images array, so they appear in the modal.

#### Acceptance criteria

1. WHEN each affected record is updated THEN its `images` array SHALL
   include an entry for each new asset in that record's folder, using
   the canonical `{ src, alt, caption }` shape.
2. WHEN assets are imported THEN imports SHALL be added for each new file
   with sensible variable names.
3. WHEN a folder contains a video (e.g. `printing.mp4`,
   `highlights.mp4`, `robotinaction.mp4`) THEN it SHALL be included as an
   image-array entry (the MediaItem renderer handles video) with an
   appropriate caption.
4. WHEN records that previously had `images: []` now have media (tutoring,
   academic-representative, iosdc, interfaith-iftar, srobo, trivyal,
   cyphon, internship role) THEN those arrays SHALL be populated.
5. WHEN assets are wired THEN no asset SHALL be assigned to a record it
   does not belong to.

### Requirement 3 — Correct hero images and captions

**User story:** As the portfolio owner, I want each record's hero image
to be the designated hero asset with the correct caption following it.

#### Acceptance criteria

1. WHEN a record's folder contains a `hero.*` file THEN that record's
   `heroImage` SHALL point to it (the hero shown on the first-class
   card).
2. WHEN a record has a `heroImage` AND the same hero also appears in its
   `images` array THEN the caption on the hero entry SHALL correctly
   describe the hero image (not a stale caption from a previously
   different hero).
3. WHEN captions existed for images that were NOT renamed THEN those
   captions SHALL be preserved and matched to the correct file.
4. WHEN the hero file was swapped (a different image is now "hero") THEN
   captions SHALL be re-matched so each caption describes the image it
   now sits with.

### Requirement 4 — Alt/caption authoring for new media

**User story:** As the portfolio owner, I want best-guess alt and
caption text on new media as a starting point I can edit later.

#### Acceptance criteria

1. WHEN new media lacks an obvious caption THEN a reasonable, clearly-
   descriptive placeholder alt and caption SHALL be written based on the
   filename and record context (e.g. `interns.jpg` → "The intern team").
2. WHEN placeholder captions are written THEN they SHALL NOT assert
   specific unverifiable facts as if confirmed; they SHALL be plainly
   descriptive so the owner can refine them.
3. WHEN every image entry is written THEN it SHALL have both `alt` and
   `caption` populated (no empty strings), consistent with the data
   conventions.

### Requirement 5 — AWS credential images

**User story:** As the portfolio owner, I want the AWS credential to
show its images, so the credential modal has media like other records.

#### Acceptance criteria

1. WHEN the `aws-cloud-practitioner` credential is updated THEN it SHALL
   gain a `heroImage` and an `images` array sourced from the
   `aws-certification/` folder (hero.jpg, certification.jpg).
2. WHEN the credential images are added THEN the normalisation layer and
   ContentModal SHALL render them without code changes (the credential
   adapter already passes images through).
3. WHEN the credential images are added THEN the credential card SHALL
   show the hero image like other cards.

### Requirement 6 — Larger icon buttons

**User story:** As a visitor, I want the platform icon buttons to be
about 50% bigger, so they are easier to see and tap.

#### Acceptance criteria

1. WHEN the brand-icon link buttons render THEN they SHALL be
   approximately 50% larger than their current size (icon size and/or
   padding and font-size scaled up accordingly).
2. WHEN enlarged THEN they SHALL remain consistent between the modal and
   the Contact section and SHALL keep the accent-pill styling and
   spacing balance.
3. WHEN enlarged THEN layout SHALL not break (wrapping remains sensible).

### Requirement 7 — Merge Certifications into Competitions/Awards

**User story:** As the portfolio owner, I want certifications and
competitions/awards presented as one section.

#### Acceptance criteria

1. WHEN the page renders THEN there SHALL be a SINGLE combined section
   titled something like "Certifications, competitions, and awards"
   (exact wording confirmed in design) instead of separate Credentials
   and Achievements sections.
2. WHEN the combined section renders THEN it SHALL display BOTH the
   credential cards and the achievement cards in one grid (order chosen
   in design, e.g. credentials first or interleaved by relevance).
3. WHEN sections are merged THEN eyebrow numbering SHALL be renumbered
   sequentially and the nav link SHALL still resolve to a valid section
   id (update the nav/anchor accordingly).
4. WHEN merged THEN no credential or achievement data SHALL be lost, and
   each card SHALL still open the correct content in the modal.

### Requirement 8 — Reuse, consistency, no regression, accuracy

#### Acceptance criteria

1. WHEN changes are made THEN they SHALL reuse the existing data/
   component/CSS architecture; no new runtime dependency.
2. WHEN implementation is complete THEN `npm run build` (incl. `CI=true`)
   SHALL succeed with zero unresolved imports/assets.
3. WHEN implementation is complete THEN all sections, the modal (with
   working media scroll), nav, footer, marquee and card heroes SHALL
   function.
4. WHEN captions/alt are authored THEN no fabricated factual claim
   (specific names, results, dates not evidenced) SHALL be stated;
   descriptive placeholders only, for owner review.
5. WHEN unrelated backlog items (Gallery, Crafting Mode) are noticed
   THEN they SHALL NOT be implemented here.
