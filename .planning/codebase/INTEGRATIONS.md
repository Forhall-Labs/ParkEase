# External Integrations

**Analysis Date:** 2026-04-08

## APIs & External Services

**No external APIs detected:**

- No SDK imports for third-party services (Stripe, Supabase, AWS, etc.)
- No REST API clients
- No GraphQL integrations

## Data Storage

**Database:**

- SQLite (via better-sqlite3 12.8.0)
  - Connection: Local file `psm.db` in Electron userData directory
  - Client: better-sqlite3 native driver
  - ORM: None - direct SQL queries in repositories

**File Storage:**

- Local filesystem only
- Database path: `app.getPath('userData')/psm.db`
- Images/assets stored in `src/assets/` (bundled with app)

**Caching:**

- None

## Authentication & Identity

**Auth Provider:**

- Custom implementation
  - User table: `psm_users`
  - Password hashing: bcryptjs (3.0.3)
  - Session: Electron IPC (no web tokens)
  - Login hook: `src/hooks/useLogin.ts`

## Monitoring & Observability

**Error Tracking:**

- None

**Logs:**

- console.log/error in Electron main process
- No external logging service

## CI/CD & Deployment

**Hosting:**

- Desktop application (Electron)
- No web hosting

**CI Pipeline:**

- None detected
- Git hooks: Husky (pre-commit, pre-push)
- Commit linting: commitlint with conventional-changelog

## Environment Configuration

**Required env vars:**

- None (no `.env` file)
- Configuration via code

**Secrets location:**

- None required for local SQLite

## Webhooks & Callbacks

**Incoming:**

- None

**Outgoing:**

- None

---

_Integration audit: 2026-04-08_
