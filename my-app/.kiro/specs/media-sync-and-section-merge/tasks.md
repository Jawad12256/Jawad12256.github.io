# Spec 8 — Media Sync, Captions, Icon Sizing, Section Merge — Tasks

Executed as a batch once approved. The `build-after-spec-task` hook runs
`npm run build` after each task. Stage files explicitly; `git add` and
`git commit` as SEPARATE commands.

---

- [ ] 1. Rewrite achievements.js media (f1is, uksdc, srobo)
  - Remove all broken old imports (.png names, winner, mpdthruster,
    photobioreactor, old technicaldrawing). Add current files.
  - f1is: hero/bandsaw/cfd/fea/technicaldrawing keep captions; add
    stand, track (placeholder captions); drop winner; heroImage → hero.
  - uksdc: hero keeps caption; drop removed files; add certificates,
    elevatorrobots, highlights (placeholders); heroImage → hero.
  - srobo (student-robotics): add all (hero, giraffery1, buildingrobot,
    oldrobot, community, robotinaction video) with placeholders;
    heroImage → hero; keep existing article link.
  - _Requirements: 1, 2, 3, 4_

- [ ] 2. Populate experience.js media
  - Add imports for internship-trivyal, internship-cyphon, tutoring,
    academic-representative.
  - Trivyal nested: hero/trivyalintro/trivyal (heroImage → hero).
  - Cyphon nested: architecturediagram/interns/livedemo (heroImage →
    interns, tunable).
  - tutoring: hero/slides (heroImage → hero).
  - academic-representative: hero/jawad (heroImage → hero).
  - Internship ROLE: leave without dedicated hero (flat panel) per
    design default unless owner says otherwise (note in PR).
  - All images get alt + caption (placeholders where needed).
  - _Requirements: 2, 3, 4_

- [ ] 3. Populate events.js media
  - Add imports for iosdc and interfaith-iftar.
  - iosdc: hero/assembly/details/rfp (heroImage → hero).
  - interfaith-iftar: title (hero), donutsale, hall1, hall2, highlights
    (video). heroImage → title.jpg.
  - Placeholder alt/captions where needed.
  - _Requirements: 2, 3, 4_

- [ ] 4. Add headphonesstand to the 3d-printing project (projects.js)
  - Import headphonesstand.jpg; add an images entry with placeholder
    alt/caption. Hero stays hero.png.
  - _Requirements: 2, 4_

- [ ] 5. Add AWS credential images (credentials.js)
  - Import aws-certification hero.jpg + certification.jpg; add heroImage
    → hero; add images array with alt + captions.
  - _Requirements: 5_

- [ ] 6. Enlarge the icon buttons ~50% (components.css)
  - Scale `.link-button` padding/font-size and `svg` size (~1em → 1.5em)
    so buttons are ~50% larger; consistent in modal + contact.
  - _Requirements: 6_

- [ ] 7. Merge Credentials into the Competitions/Awards section
  - In Home.jsx, replace the two sections with one (id="achievements",
    title "Certifications, competitions, and awards") rendering
    credential cards then achievement cards in one grid; renumber
    eyebrows (01 Projects, 02 Experience, 03 combined, 04 Events, 05
    Contact). Reconcile the nav link/label. No data lost; cards open
    correct modal content.
  - _Requirements: 7_

- [ ] 8. Validate and no-regression check
  - `npm run build` + `CI=true npm run build` succeed; asset cross-check
    shows ZERO missing imports (new resolve, broken old gone).
  - Confirm every affected record has heroImage + populated images with
    non-empty alt/caption; merged section renders both card types; nav
    resolves; icon buttons larger.
  - State no-live-browser limitation; note captions are placeholders for
    owner review; flag the internship-role-hero default and tunable
    choices.
  - _Requirements: 8.2, 8.3, 8.4_

- [ ] 9. Commit, push, open PR
  - Stage explicitly; `git add` then `git commit` separately; push to
    `rework`; open PR into `main`. Report the PR link and list the
    placeholder captions the owner should review.
  - _Requirements: (process)_
