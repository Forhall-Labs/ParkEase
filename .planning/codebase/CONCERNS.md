# Codebase Concerns

**Analysis Date:** 2026-04-09

## Tech Debt

**[High] Build artifacts committed and not ignored (`dist-electron`)**
- Issue: Generated Electron output is stored in source control and `.gitignore` does not exclude `dist-electron`.
- Files: `.gitignore`, `dist-electron/main.js`, `dist-electron/preload.js`, `dist-electron/database/db.js`
- Impact: Source/build drift risk, noisy diffs, accidental regression from stale generated code, larger review surface.
- Fix approach: Add `dist-electron/` to `.gitignore`, remove generated artifacts from git, and regenerate only in CI/release.

**[High] Duplicate contract definitions for renderer-electron API**
- Issue: API types are duplicated in two places with overlapping declarations.
- Files: `electron/preload.ts`, `src/types/electron-api.d.ts`
- Impact: Interface drift can produce runtime breakages that TypeScript does not catch across process boundary.
- Fix approach: Keep a single shared type source (for example, under `shared/`), import into both preload and renderer.

**[Medium] Typo-based module naming debt (`vehcile`)**
- Issue: Vehicle repository filename is misspelled and referenced broadly.
- Files: `electron/repositories/vehcile.repository.ts`, `electron/service/vehicle.service.ts`, `dist-electron/repositories/vehcile.repository.js`
- Impact: Reduced discoverability, higher onboarding friction, future rename risk across many imports.
- Fix approach: Rename to `vehicle.repository.ts` with a coordinated symbol/file rename.

**[Medium] Large UI/bridge files increase change risk**
- Issue: Several files are very large and combine multiple responsibilities.
- Files: `src/components/vehiclesResumeTable.tsx`, `src/components/UI/reports.tsx`, `src/components/UI/settings.tsx`, `electron/preload.ts`
- Impact: Harder reviews, increased regression chance, brittle merges.
- Fix approach: Split by feature slices (table sections/hooks/components), keep preload as thin bridge + per-domain modules.

## Known Bugs

**[High] Empty update payload can generate invalid SQL**
- Symptoms: Update operations can construct `UPDATE ... SET  WHERE ...` when DTO has zero keys.
- Files: `electron/repositories/user.repository.ts`, `electron/repositories/parameter.repository.ts`, `electron/repositories/vehcile.repository.ts`
- Trigger: Any IPC caller sending an empty object to update handlers.
- Workaround: Validate DTO non-empty in service/handler before invoking repository updates.

**[Medium] Silent error swallowing in stats endpoints masks failures**
- Symptoms: Dashboard endpoints return `0` values when SQL/runtime errors occur.
- Files: `electron/handlers/vehicle.handler.ts`
- Trigger: Any DB error during stats/revenue/today count queries.
- Workaround: Log structured error and return explicit failure status instead of forcing zero.

## Security Considerations

**[Critical] Legacy plaintext password acceptance remains enabled**
- Risk: Accounts with plaintext passwords are still accepted during login fallback.
- Files: `electron/service/user.service.ts`
- Current mitigation: Passwords are migrated to bcrypt upon successful plaintext login.
- Recommendations: Remove plaintext fallback behind one-time migration script; enforce bcrypt-only auth path.

**[High] SQL field-name injection vector via dynamic update builders**
- Risk: Dynamic SQL column list is built from untrusted object keys.
- Files: `electron/repositories/user.repository.ts`, `electron/repositories/parameter.repository.ts`, `electron/repositories/vehcile.repository.ts`
- Current mitigation: Values are parameterized, but column names are not allowlisted.
- Recommendations: Use explicit allowlists for updatable fields and reject unknown keys before query construction.

**[High] Session PII persisted locally in clear text**
- Risk: Session table stores user identity and email in plain SQLite rows.
- Files: `electron/handlers/session.handler.ts`, `electron/database/db.ts`
- Current mitigation: Local-only DB path (`app.getPath('userData')`) and no password in session row.
- Recommendations: Store minimal session token only, encrypt sensitive local payloads, and add expiration/rotation policy.

**[Medium] Electron renderer sandbox is disabled**
- Risk: Reduced defense-in-depth if renderer is compromised.
- Files: `electron/main.ts`
- Current mitigation: `contextIsolation: true` and `nodeIntegration: false` are enabled.
- Recommendations: Enable `sandbox: true` and test preload compatibility.

## Performance Bottlenecks

**[Medium] Repeated full scans for report/stat queries**
- Problem: Queries filter using `DATE(veh_egress_date)` and no indexes are defined for egress/status filters.
- Files: `electron/handlers/vehicle.handler.ts`, `electron/repositories/vehcile.repository.ts`, `electron/database/db.ts`
- Cause: Function-wrapped date filtering and absent supporting indexes.
- Improvement path: Add indexes on `veh_status`, `veh_egress_date`, and potentially computed/date-normalized column; avoid function-wrapped filter where possible.

**[Medium] Unpaginated fetches for growing datasets**
- Problem: APIs load full tables for users/vehicles/parameters.
- Files: `electron/repositories/user.repository.ts`, `electron/repositories/vehcile.repository.ts`, `electron/repositories/parameter.repository.ts`
- Cause: `SELECT *` endpoints without pagination limits.
- Improvement path: Add page/limit/sort contracts and UI pagination/virtualization.

## Fragile Areas

**[High] Migration application is not atomic per release boot**
- Files: `electron/database/db.ts`
- Why fragile: Migration execution and migration-record inserts are not wrapped in a transaction.
- Safe modification: Wrap per-migration or full migration batch in transaction and fail-fast with rollback.
- Test coverage: No automated migration failure/recovery tests detected.

**[High] Session save does delete-then-insert without transaction**
- Files: `electron/handlers/session.handler.ts`
- Why fragile: Failure between delete and insert can leave app without session unexpectedly.
- Safe modification: Use transaction for clear+insert or `INSERT ... ON CONFLICT` strategy with single-row key.
- Test coverage: No session persistence tests detected.

## Scaling Limits

**[Medium] Single local SQLite with synchronous access model**
- Current capacity: Suitable for single-desktop, low concurrency, moderate dataset.
- Limit: Large tables and report-heavy usage will degrade due to full scans and synchronous query model.
- Scaling path: Add indexes and pagination now; if multi-user/remote requirements emerge, migrate to client-server API + managed DB.

## Dependencies at Risk

**[Medium] Native Electron + `better-sqlite3` upgrade coupling**
- Risk: Electron major updates can break native module rebuilds.
- Impact: Build/runtime failures in packaged app.
- Migration plan: Pin compatible Electron/native versions, add CI matrix for rebuild/package validation, keep `@electron/rebuild` path tested.

## Missing Critical Features

**[High] No role-based authorization model across IPC commands**
- Problem: IPC handlers expose full CRUD operations without role checks.
- Blocks: Separation of duties, least-privilege operation, auditable admin-only actions.

**[Medium] No explicit audit trail for destructive actions**
- Problem: Deletes/updates are not audit-logged.
- Blocks: Traceability for operational incidents and data disputes.

## Test Coverage Gaps

**[Critical] Automated tests are effectively absent**
- What's not tested: Auth flows, session persistence, repository update guards, IPC handlers, migration behavior, reporting queries.
- Files: `package.json`, `electron/service/user.service.ts`, `electron/handlers/session.handler.ts`, `electron/database/db.ts`, `electron/handlers/vehicle.handler.ts`
- Risk: Regressions ship undetected in security/correctness-critical paths.
- Priority: High

**[High] No integration tests for preload-to-IPC contracts**
- What's not tested: `window.electronAPI` method signatures and runtime behavior across renderer/main boundary.
- Files: `electron/preload.ts`, `src/types/electron-api.d.ts`, `electron/handlers/*.ts`
- Risk: Runtime contract drift and broken UI operations after refactors.
- Priority: High

---

*Concerns audit: 2026-04-09*
