# Session Context - Parqueo Parroquial San Marcos

## Current Product State

- Electron + React + TypeScript parking app is running in installed mode.
- Main UI work is already integrated: dashboard/vehicles separation, sidebar reorder/icons, modal unification, reports and vehicles layout adjustments.
- User confirmed the app now opens (no more permanent blank screen).

## Phase / Planning State

- Phase 12 (`CI/CD`) was added, discussed, planned, and executed through GSD workflow.
- Phase 12 context files exist under:
  - `.planning/phases/12-ci-cd/12-CONTEXT.md`
  - `.planning/phases/12-ci-cd/12-DISCUSSION-LOG.md`
  - `12-01/12-02 PLAN + SUMMARY` files.

## CI/CD Status Implemented

- CI and build workflows moved to Node 22.
- Quality gate standardized through `npm run ci:verify` and `scripts/ci-test-gate.mjs`.
- CD workflow runs on `v*` tags and creates draft release with:
  - installer `.exe`
  - portable `.zip`
- Build pipeline hardened to avoid implicit electron-builder publish.

## Critical Fixes Applied During Session

1. **npm ci lockfile sync failures**
   - Repeated `EUSAGE` issues fixed by lockfile regeneration and pinning missing emnapi packages.
   - `@emnapi/core` and `@emnapi/runtime` pinned in `devDependencies` to stabilize `npm ci`.

2. **Installed app blank screen**
   - Packaging config updated to explicitly include `dist/**/*` in electron-builder `build.files`.
   - Runtime load path and diagnostics improved in `electron/main.ts`.
   - Verified `app.asar` includes:
     - `/dist/index.html`
     - `/dist/assets/*.js`
     - `/dist/assets/*.css`

## Latest Relevant Commits

- `c0142b5` - `ci(12): enforce quality gate and draft release flow`
- `0b58c06` - `ci: run workflows on Node 22`
- `ed32816` - `fix(ci): sync lockfile for npm ci`
- `25e348c` - `fix: sync source tree to restore CI build`
- `59ce7fc` - `fix(ci): include emnapi lockfile entries`
- `2ba8076` - `fix(cd): prevent implicit publish and enforce release assets`
- `cad103b` - `fix(build): build renderer before electron packaging`
- `a0d1a04` - `fix(runtime): add packaged load diagnostics and bump app version`
- `9546148` - `fix(packaging): include dist assets in asar and improve load path`
- `e3578d5` - `fix(ci): pin emnapi dependencies for stable npm ci`

## Latest Release Tags Created

- `v1.1.0`, `v1.1.1`, `v1.1.2`, `v1.1.3`, `v1.1.4`, `v1.1.5`, `v1.1.6`
- Latest intended stable candidate for CI/CD + packaging fixes: `v1.1.6`.

## Database Location (Windows Installed App)

- DB is not in installation folder.
- SQLite file path:
  - `%APPDATA%\\parqueo-parroquial-san-marcos\\psm.db`
  - Example: `C:\Users\alele\AppData\Roaming\parqueo-parroquial-san-marcos\psm.db`

## Suggested Next Session Actions

1. Validate GitHub Actions run for tag `v1.1.6` (CI + CD green).
2. Confirm draft release contains both assets (`.exe`, portable `.zip`).
3. If user list is empty, bootstrap initial admin user in `psm.db` or add first-run seed flow.
