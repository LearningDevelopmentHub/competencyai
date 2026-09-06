# PRODUCT DELIVERABLE — CompetencyAI

This file contains packaging instructions and a short manifest for the final product deliverable.

Summary
- Repository: LearningDevelopmentHub/competencyai
- Branches with features: gd2..gd6 (see branches in repo)
- This package contains source code, seed scripts, and UI assets. It does NOT include node_modules or 3rd-party binaries.

What you will get when you run the packaging script below
- A git bundle containing ALL refs (branches + tags) — `competencyai-all-branches.bundle`
- A source tar.gz of the chosen branch (default: gd6/reporting-analytics) — `competencyai-<branch>-<date>.tar.gz`
- SHA256 checksums for the produced artifacts

Files included in the source tar.gz
- All tracked files at the branch tip (apps/, packages/, config, scripts, seed scripts).
- Node-level lockfiles (pnpm-lock.yaml) are included but node_modules are not.

How to create the final package (recommended, local machine)

1) Clone the repo (or use existing clone):

   git clone https://github.com/LearningDevelopmentHub/competencyai.git
   cd competencyai

2) Make sure you have the latest refs:

   git fetch --all --prune

3) Run the packaging script in this repo (package.sh) — it will create two artifacts:

   # make executable once
   chmod +x scripts/package.sh
   # run, specify branch if you want (default: gd6/reporting-analytics)
   scripts/package.sh gd6/reporting-calibration

4) After the script finishes you'll have:

   - dist/competencyai-all-branches.bundle
   - dist/competencyai-<branch>-YYYYMMDD.tar.gz
   - dist/sha256sum.txt

5) Verify checksum before sharing:

   sha256sum --check dist/sha256sum.txt

6) How to restore from the bundle on the recipient side:

   # create a fresh clone from the bundle
   git clone repo.bundle repo-from-bundle
   cd repo-from-bundle
   git branch -a

Notes about secrets & production
- This deliverable does NOT include production secrets or CI tokens. If you need a production-ready release, secure credentials must be provided via environment variable configuration or a secrets manager.

Support
- If you want, I can:
  - Create the bundle on a CI runner and upload it to a GitHub Release for you to download, or
  - Produce a .zip (instead of tar.gz) if you prefer, or
  - Provide a prebuilt docker-compose bundle containing DB + services (requires larger disk and time).

---

Manifest (short)
- Branches: gd2..gd6 (features for Competency dictionary to Reporting & Analytics)
- UI: Next.js app under apps/web, Tailwind + Inter font, theme (light/dark)
- API: NestJS app under apps/api with Prisma for DB interactions
- DB seeds: packages/db/prisma/seed*.ts (kf38, job-architecture, assessment, learning-development, reports)

If you want me to create the final bundle on a CI runner and attach it as a GitHub release asset, reply: "Create release bundle" and I'll prepare a release draft (you must confirm and provide permission to create releases on the repo if needed).