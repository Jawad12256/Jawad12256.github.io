---
inclusion: always
---

# Development Workflow

## 1. Understand before changing

Before modifying the application:

- Inspect the relevant existing files.
- Check package.json and the lockfile.
- Understand the current component and data architecture.
- Verify that referenced assets actually exist.
- Identify existing functionality that must be preserved.

The repository is the source of truth. Older prompts, screenshots
and ZIP snapshots may not represent the latest implementation.

## 2. Work incrementally

Use Kiro Specs for substantial features.

Follow the sequence:
1. Requirements
2. Design
3. Tasks
4. Implementation
5. Validation

Do not begin implementation before the requirements and design
have been reviewed.

Keep tasks small enough to review and test independently.

Do not implement unrelated improvements simply because they
are noticed during another task.

## 3. Human review

Pause for review:
- After requirements have been generated.
- After the technical design has been generated.
- After the task list has been generated.
- At meaningful implementation milestones.

Explain important architectural decisions and trade-offs.

Ask before making substantial changes to the existing architecture.

## 4. Validation

After implementation tasks:
- Run the available build command.
- Check for broken imports and missing assets.
- Check browser console errors where practical.
- Verify responsive behaviour.
- Verify that existing functionality remains intact.

Never claim that a feature works without testing it.

## 5. Content accuracy

Do not invent:
- Personal achievements
- Project results
- Technologies used
- Individual contributions to team projects
- Dates or qualifications

Clearly distinguish individual contributions from team outcomes.

Ask for missing factual information rather than guessing.

## 6. Git and deployment safety

Do not:
- Commit changes without permission.
- Push changes without permission.
- Deploy to GitHub Pages without permission.
- Deploy to AWS Amplify without permission.
- Delete AWS resources or alter billing-related settings.

Keep GitHub Pages and AWS Amplify deployment configurations
compatible throughout development.