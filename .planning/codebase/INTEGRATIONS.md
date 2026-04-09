# External Integrations

**Analysis Date:** 2026-04-09

## APIs & External Services

**Desktop Runtime Boundary (Electron IPC):**
- Electron IPC request/response channels between renderer and main process.
  - SDK/Client: `electron` (`ipcMain`, `ipcRenderer`, `contextBridge`) from `electron/handlers/*.ts` and `electron/preload.ts`.
  - Auth: Not applicable (local process boundary).
  - Evidence:
    - Channel registration in `electron/handlers/user.handler.ts`, `electron/handlers/vehicle.handler.ts`, `electron/handlers/parameter.handler.ts`, `electron/handlers/session.handler.ts`, `electron/handlers/setting.handler.ts`.
    - Secure renderer API exposure in `electron/preload.ts` via `contextBridge.exposeInMainWorld('electronAPI', ...)`.

**External HTTP/SaaS Services:**
- Not detected.
  - No axios/fetch-based remote API usage detected in `src/` or `electron/`.
  - No SDK imports detected for Stripe/Supabase/Firebase/AWS/GCP/Azure/Sentry/PostHog.

## Data Storage

**Databases:**
- SQLite (embedded local DB) via `better-sqlite3`.
  - Connection: local file path `join(app.getPath('userData'), 'psm.db')` in `electron/database/db.ts`.
  - Client: `better-sqlite3` direct queries + repository wrappers in `electron/repositories/*.ts`.
  - Startup/migrations:
    - Initialization in `electron/main.ts` (`initDatabase()` before window creation).
    - Migrations and pragmas in `electron/database/db.ts` (`journal_mode=WAL`, `foreign_keys=ON`).

**File Storage:**
- Local filesystem only (Electron user data directory used for DB file).
  - `electron/database/db.ts`.

**Caching:**
- No dedicated cache service detected.
  - Runtime UI state is in React hooks; language/theme persisted in browser storage (`src/i18n.ts`, `src/App.tsx`).

## Authentication & Identity

**Auth Provider:**
- Custom local username/password auth.
  - Implementation:
    - Login and password checks in `electron/service/user.service.ts`.
    - Password hashing with `bcryptjs` in `electron/service/user.service.ts`.
    - Session persistence in SQLite table `psm_sessions` via `electron/handlers/session.handler.ts`.

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry/Bugsnag/Rollbar integration files/imports found).

**Logs:**
- Console logging in main and handlers/services.
  - Examples: startup error log in `electron/main.ts`, migration logs in `electron/database/db.ts`, operation errors in UI components such as `src/components/UI/settings.tsx`.

## CI/CD & Deployment

**Hosting:**
- Desktop app distribution workflow (not web hosting focused).
  - Windows build pipeline in `.github/workflows/build.yml` producing `.exe` artifacts.

**CI Pipeline:**
- GitHub Actions.
  - `ci.yml`: install, lint, type-check on push/PR (`.github/workflows/ci.yml`).
  - `build.yml`: Windows package build on tag/manual dispatch (`.github/workflows/build.yml`).

## Environment Configuration

**Required env vars:**
- `VITE_DEV_SERVER_URL` consumed by Electron main process for dev loading (`electron/main.ts`).
- `GH_TOKEN` used in GitHub Actions build for packaging/publishing permissions (`.github/workflows/build.yml`).

**Secrets location:**
- GitHub Actions secrets/context for CI (`${{ secrets.GITHUB_TOKEN }}` in `.github/workflows/build.yml`).
- No repository-root `.env` files detected from root-level glob check.

## Internationalization (i18n)

**i18n Layer:**
- In-repo dictionary-based i18n module (no external i18n service).
  - Translation dictionary and language helpers in `src/i18n.ts`.
  - Bootstrapped via `initI18n()` in `src/App.tsx`.
  - Runtime language switching via `setLanguage()` and `localStorage` in `src/components/UI/settings.tsx` and `src/i18n.ts`.
  - Translation consumption via `t('...')` across UI modules including `src/components/UI/reports.tsx`, `src/components/UI/users.tsx`, `src/components/UI/parameters.tsx`, and `src/layout/layout.tsx`.

## Webhooks & Callbacks

**Incoming:**
- None detected.

**Outgoing:**
- None detected.

---

*Integration audit: 2026-04-09*
