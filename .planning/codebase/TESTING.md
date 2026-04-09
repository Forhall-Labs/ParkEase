# Testing Patterns

**Analysis Date:** 2026-04-09

## Test Framework

**Runner:**
- Not detected in current workspace (`package.json` has no `test` script and no test framework dependency such as Vitest/Jest).
- Config: Not detected (`vitest.config.*`, `jest.config.*`, and `playwright.config.*` are absent).

**Assertion Library:**
- Not applicable currently (no test runner configured).

**Run Commands:**
```bash
npm run lint           # Static analysis gate (present)
npx tsc --noEmit       # Type-check gate (used in CI)
npm run build          # Full build gate (lint + tsc -b + vite build)
```

## Test File Organization

**Location:**
- No test files detected for `*.test.*` or `*.spec.*` under `src/` or `electron/`.

**Naming:**
- Not established yet.

**Structure:**
```
Not detected
```

## Test Structure

**Suite Organization:**
```typescript
// Not detected: no describe/it patterns currently in repository source files.
```

**Patterns:**
- Setup pattern: Not detected
- Teardown pattern: Not detected
- Assertion pattern: Not detected

## Mocking

**Framework:** Not detected

**Patterns:**
```typescript
// Not detected in current codebase.
```

**What to Mock:**
- For future tests, mock `window.electronAPI` in renderer tests (usage in `src/hooks/useLogin.ts`, `src/components/UI/users.tsx`, `src/components/UI/reports.tsx`).
- For Electron service tests, mock or isolate repository calls to avoid brittle DB coupling (`electron/service/user.service.ts`, `electron/service/vehicle.service.ts`).

**What NOT to Mock:**
- Do not mock pure helper logic (date window and normalization logic) where deterministic unit tests can validate behavior directly (`src/components/UI/reports.tsx` helper functions, `electron/handlers/vehicle.handler.ts` report period/date guards).
- Do not over-mock SQL behavior for migration/DB smoke checks; use temporary SQLite files for integration-level repository verification (`electron/database/db.ts`, `electron/repositories/*.ts`).

## Fixtures and Factories

**Test Data:**
```typescript
// Existing non-test data examples that can be promoted into fixture patterns:
// - src/data/mockDashboardCard.data.ts
// - src/data/mockVehicle.data.ts
```

**Location:**
- Current sample/mock-like data lives in `src/data/`, but no formal `fixtures`/`factories` test directory exists.

## Coverage

**Requirements:**
- No automated coverage threshold is enforced.
- No coverage command or reporter detected in `package.json`.

**View Coverage:**
```bash
# Not available yet (no test runner configured).
```

## Test Types

**Unit Tests:**
- Not implemented.
- High-value first targets:
  - `electron/service/vehicle.service.ts` fee calculations and status transitions.
  - `electron/service/user.service.ts` auth branches and duplicate validation.
  - `src/hooks/useLogin.ts` session restore and login error paths.

**Integration Tests:**
- Not implemented.
- High-value first targets:
  - Repository + SQLite interactions in `electron/repositories/user.repository.ts` and `electron/repositories/vehcile.repository.ts`.
  - IPC handler boundary behavior in `electron/handlers/vehicle.handler.ts` and `electron/handlers/user.handler.ts`.

**E2E Tests:**
- Not used (no Playwright/Cypress/Spectron configuration detected).

## Current Quality Gates (Testing Adjacent)

- `npm run build` is a hard local and pre-push gate (`.husky/pre-push`, `package.json`).
- CI (`.github/workflows/ci.yml`) runs lint and type-check only; no test step exists.
- Commit hygiene gates exist via `lint-staged` and commitlint (`.husky/pre-commit`, `.husky/commit-msg`, `commitlint.config.cjs`).

## Realistic Recommendations

- Phase 1 (minimum viable testing):
  - Add Vitest and Testing Library for renderer units.
  - Add `test`, `test:watch`, and `test:coverage` scripts in `package.json`.
  - Add a `vitest.config.ts` with separate environments for browser-like (`jsdom`) and node tests.

- Phase 2 (high-risk backend validation):
  - Add Node-based unit tests for `electron/service/user.service.ts` and `electron/service/vehicle.service.ts`.
  - Add repository integration tests using temporary SQLite DB seeded via `initDatabase` from `electron/database/db.ts`.

- Phase 3 (IPC contract confidence):
  - Add integration tests around `electron/preload.ts` contract shape and handler invocation (`electron/handlers/*.ts`).
  - Assert parity with `src/types/electron-api.d.ts` to avoid drift between preload and renderer types.

- Phase 4 (CI hardening):
  - Update `.github/workflows/ci.yml` to run `npm test -- --run`.
  - Add initial coverage target (for example 60% statements) and ratchet upward per milestone.

## Common Patterns

**Async Testing:**
```typescript
// Recommended pattern for this codebase once Vitest is added:
// await expect(window.electronAPI.users.login(dto)).resolves.toMatchObject({ success: true })
// await expect(loadUsers()).rejects.toThrowError()
```

**Error Testing:**
```typescript
// Recommended pattern for service functions returning domain results:
// expect(login({ user_username: 'x', user_password: 'bad' })).toEqual(
//   expect.objectContaining({ success: false, message: expect.any(String) })
// )
```

## Coverage Summary (Current State)

- Automated tests present: 0 files detected.
- Unit coverage: 0% measured (tooling absent).
- Integration coverage: 0% measured (tooling absent).
- E2E coverage: 0% measured (tooling absent).
- Residual risk: regressions in business logic and IPC contract changes can pass lint/type gates undetected.

---

*Testing analysis: 2026-04-09*
