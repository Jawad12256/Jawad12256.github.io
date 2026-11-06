# Spec 8 — Media Sync, Captions, Icon Sizing, Section Merge — Design

## Overview

Wire the owner's new/renamed media into the data layer with correct hero
images and captions, add AWS credential images, enlarge icon buttons,
and merge Credentials into the Competitions/Awards section. Data-heavy;
no new dependencies; reuses existing conventions.

Principle for captions: preserve existing captions and re-match them to
the correct (possibly renamed) files; for genuinely new media, write
plainly descriptive best-guess alt/caption placeholders (no fabricated
facts) for the owner to refine.

---

## Per-record asset → caption mapping

### Projects — 3d-printing (projects.js)

Existing imports mostly valid; `hero.png` unchanged. New file:
`headphonesstand.jpg`.
- Keep existing entries/captions.
- ADD import `headphonesstand` and an images entry:
  alt "3D-printed headphone stand", caption placeholder e.g.
  "A headphone stand I designed and printed." (owner to refine).
- heroImage stays `printingHero` (hero.png).

### Achievements — f1is (achievements.js)

Old imports (ALL broken, .png + winner): rewrite.
Disk: hero.jpg, bandsaw.jpg, cfd.png, fea.jpg, technicaldrawing.jpg,
stand.jpg (NEW), track.jpg (NEW).
- Repoint: f1isHero→hero.jpg, bandsaw→bandsaw.jpg, cfd→cfd.png,
  fea→fea.jpg, technicaldrawing→technicaldrawing.jpg.
- REMOVE `winner` import + its images entry (file gone).
- Preserve captions for hero/bandsaw/cfd/fea/technicaldrawing (re-matched
  to same logical images).
- ADD stand.jpg, track.jpg with placeholder alt/captions
  (e.g. stand → "The car on its display stand"; track → "The car on the
  race track"). Owner to refine.
- heroImage → hero.jpg (caption "Our F1 in Schools competition entry.").

### Achievements — uksdc (achievements.js)

Old imports (ALL broken): rewrite entirely.
Disk: hero.jpg, certificates.jpg, elevatorrobots.jpeg, highlights.jpeg.
- REMOVE mpdthruster/photobioreactor/technicaldrawing2 imports+entries
  (files gone). The hero caption ("Our National Finals space settlement
  design.") can stay on hero.jpg.
- ADD certificates, elevatorrobots, highlights with placeholder
  alt/captions (e.g. certificates → "Our competition certificates";
  elevatorrobots → "Elevator/construction robot concept";
  highlights → "Highlights from the National Finals"). Owner to refine.
- heroImage → hero.jpg.

### Achievements — student-robotics / srobo (achievements.js)

Currently `images: []`, no hero. NEW folder `srobo/`:
buildingrobot.jpeg, community.jpeg, giraffery1.jpeg, hero.jpg,
oldrobot.jpeg, robotinaction.mp4 (video).
- ADD imports + images entries with placeholder captions
  (hero → "Our robot, Girafferey"; giraffery1 → "Girafferey, our
  competition robot"; buildingrobot → "Building the robot";
  oldrobot → "An earlier iteration of the robot";
  community → "The Student Robotics community";
  robotinaction (video) → "The robot competing in the arena").
- ADD heroImage → hero.jpg.

### Experience — internship role (experience.js)

Role currently `images: []`. NEW media split across two folders for the
sub-projects; the ROLE itself has no dedicated hero folder. Decision:
- The internship role gets a heroImage. Candidates: use
  `internship-trivyal/hero.jpg` OR `aws-certification/hero.jpg`? Neither
  is clearly the ROLE hero. SAFER: give the role a heroImage from the
  most representative available internship asset — propose
  `internship-trivyal/hero.jpg` is Trivyal-specific, so instead leave
  the ROLE heroImage to the normaliser fallback (first non-video image)
  OR assign a sensible one. OPEN QUESTION for owner (see below). Default:
  assign the role heroImage = internship-trivyal/hero.jpg only if owner
  confirms; otherwise role stays image-less hero (flat panel) — the
  sub-projects carry the real media.

> Interim default (stated for owner): leave the internship ROLE without a
> dedicated hero image (flat panel) since no asset is clearly "the
> internship" as a whole; its sub-projects (Trivyal/Cyphon) carry the
> media. Easily changed if the owner wants a specific hero.

### Experience — nested Trivyal (experience.js)

`internship-trivyal/`: hero.jpg, trivyalintro.jpg, trivyal.jpg.
- ADD imports + images: hero ("The Trivyal dashboard"),
  trivyalintro ("Trivyal introduction / landing"),
  trivyal ("The Trivyal application"). heroImage → hero.jpg.
  (These feed the right media pane grouped under "Trivyal".)

### Experience — nested Cyphon (experience.js)

`internship-cyphon/`: architecturediagram.jpg, interns.jpg, livedemo.jpg.
- ADD imports + images: architecturediagram ("Cyphon architecture
  diagram"), interns ("The Cyphon intern team"), livedemo ("Live demo of
  the Cyphon platform"). heroImage → (no hero.* here) first image, i.e.
  architecturediagram OR interns. Propose heroImage → interns.jpg (a
  recognisable team shot) — tunable.

### Experience — tutoring (experience.js)

`tutoring/`: hero.jpg, slides.jpg.
- ADD imports + images: hero ("Tutoring session"),
  slides ("Example tutoring slides / resources"). heroImage → hero.jpg.

### Experience — academic-representative (experience.js)

`academic-representative/`: hero.jpg, jawad.jpeg.
- ADD imports + images: hero ("Representing the Design Engineering
  cohort"), jawad ("Jawad in the academic-rep role"). heroImage →
  hero.jpg.

### Events — iosdc (events.js)

`iosdc/`: assembly.jpg, details.jpg, hero.jpg, rfp.jpg.
- ADD imports + images: hero ("The IOSDC competition"),
  assembly ("Launch assembly introducing the competition"),
  details ("Competition details / brief"),
  rfp ("The request-for-proposal brief"). heroImage → hero.jpg.

### Events — interfaith-iftar (events.js)

`interfaith-iftar/`: donutsale.jpg, hall1.jpeg, hall2.jpeg,
highlights.mp4 (video), title.jpg.
- `title.jpg` exists already (was referenced? no — it was in folder but
  unused). Use title.jpg as hero ("Annual Interfaith Iftar").
- ADD donutsale ("Doughnut fundraising sale"), hall1/hall2 ("The event
  hall during the Iftar"), highlights (video) ("Highlights from the
  evening"). heroImage → title.jpg (or hero if owner prefers; no hero.*
  file here, so title.jpg is the hero).

### Credentials — aws-cloud-practitioner (credentials.js)

`aws-certification/`: certification.jpg, hero.jpg.
- ADD imports; add heroImage → hero.jpg; add images: hero ("AWS
  Certified Cloud Practitioner"), certification ("The AWS certification
  badge/certificate"). The credential adapter already passes images +
  heroImage through.

---

## Change A — Rewrite achievements.js imports/entries

Remove all broken `.png`/`winner`/`mpdthruster`/`photobioreactor`/old
`technicaldrawing` imports; add the current files; rebuild the three
achievement records' `images` arrays and `heroImage`s per the mapping.

## Change B — Populate experience.js

Add imports at top of experience.js for trivyal/cyphon/tutoring/
academic-representative folders; populate the role, nested projects, and
the two standalone experience records' `images`/`heroImage`.

## Change C — Populate events.js

Add imports; populate iosdc and interfaith-iftar.

## Change D — projects.js

Add `headphonesstand` import + images entry to the 3d-printing project.

## Change E — credentials.js

Add aws-certification imports, `heroImage`, and `images`.

## Change F — Larger icon buttons (components.css)

Scale `.link-button` ~50%:
```css
.link-button {
    padding: var(--space-3) var(--space-5);   /* was space-2 / space-4 */
    font-size: var(--text-base);               /* was text-sm */
    gap: var(--space-3);
}
.link-button svg {
    width: 1.5em;   /* was 1em → 50% larger glyph */
    height: 1.5em;
}
```
Applies to modal + contact (shared class). Tunable.

## Change G — Merge Credentials + Achievements (Home.jsx + NavBar)

- Replace the two separate `<Section>`s with ONE:
  - `id="achievements"` (keep this id so the existing nav link resolves),
    eyebrow renumbered, title: "Certifications, competitions, and
    awards."
  - One `card-grid` rendering credentials first, then achievements
    (credentials normalised via `normaliseCredential`, achievements via
    `normaliseAchievement`). Order: credentials then achievements
    (certification reads naturally first); tunable.
- Renumber eyebrows: 01 Projects, 02 Experience, 03 Certifications/
  competitions/awards, 04 Events, 05 Contact.
- Nav: keep "Achievements" linking to `#achievements` OR relabel to
  "Awards"/"Credentials"; design keeps the label "Achievements" → the
  combined section (simplest, still resolves). (Tunable label.)

---

## Validation plan

1. `npm run build` + `CI=true npm run build` → succeed; asset
   cross-check shows ZERO missing (all new imports resolve, all broken
   old ones gone).
2. Confirm every affected record has heroImage + populated images with
   non-empty alt + caption.
3. Confirm merged section renders credentials + achievements, nav link
   resolves, modal opens correct content.
4. Confirm icon buttons larger in modal + contact.
5. No live browser → captions/sizing/merge verified via build + code;
   owner will review caption wording (explicitly a placeholder pass).

---

## Files touched (planned)

| File | Change |
|---|---|
| `src/data/achievements.js` | Rewrite f1is/uksdc imports+images; populate srobo; heroes |
| `src/data/experience.js` | Imports + images for trivyal, cyphon, tutoring, academic-rep; role hero decision |
| `src/data/events.js` | Imports + images for iosdc, interfaith-iftar |
| `src/data/projects.js` | Add headphonesstand to 3d-printing |
| `src/data/credentials.js` | AWS cert heroImage + images |
| `src/pages/Home.jsx` | Merge Credentials+Achievements; renumber eyebrows |
| `src/components/NavBar.jsx` | Reconcile nav label/anchor if needed |
| `src/styles/components.css` | Enlarge `.link-button` ~50% |

## Out of scope (deferred)

- Gallery; Crafting Mode.
- Finalising caption wording (owner review pass).
