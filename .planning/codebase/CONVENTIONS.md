# Coding Conventions

**Analysis Date:** 2026-04-09

## Naming Patterns

**Files:**
- React component files use lowercase or camelCase names in `src/components/` (examples: `src/components/dashboardCard.tsx`, `src/components/vehiclesResumeTable.tsx`).
- UI screen files use lowercase names in `src/components/UI/` (examples: `src/components/UI/dashboard.tsx`, `src/components/UI/reports.tsx`).
- Electron backend files follow `<domain>.<layer>.ts` naming in `electron/` (examples: `electron/repositories/user.repository.ts`, `electron/service/user.service.ts`, `electron/handlers/user.handler.ts`).
- Existing typo is part of current codebase and should be preserved unless explicitly refactoring: `electron/repositories/vehcile.repository.ts`.

**Functions:**
- Functions and hooks use camelCase (examples: `useLogin`, `registerVehicleHandlers`, `normalizeReportDate`, `getAllUsers`).
- Handler registration pattern is `register<Domain>Handlers` in `electron/handlers/*.ts`.
- Query functions in repositories follow verb + entity naming (examples in `electron/repositories/user.repository.ts`: `findAllUsers`, `createUser`, `updateUserPassword`).

**Variables:**
- Local variables and state use camelCase (`activePath`, `selectedRange`, `todayRevenue` in `src/App.tsx` and `src/components/UI/reports.tsx`).
- DB-backed DTO/model properties intentionally use snake_case to mirror SQLite column names (examples in `electron/models/user.model.ts` and `src/types/electron-api.d.ts`: `user_username`, `veh_ingress_date`, `par_tax`).

**Types:**
- Interfaces and type aliases use PascalCase (`SafeUser`, `LoginResponse`, `ReportPeriod`, `VehicleReportResult` in `src/types/electron-api.d.ts`).
- DTO names use `Dto` suffix (`CreateUserDto`, `UpdateVehicleDto` in `electron/models/user.model.ts`, `electron/preload.ts`).
- Result payloads often standardize to `{ success, message?, id? }` (`MutationResult` in `src/types/electron-api.d.ts`).

## Code Style

**Formatting:**
- Formatter: Prettier configured in `.prettierrc`.
- Key settings from `.prettierrc`:
  - `semi: true`
  - `singleQuote: true`
  - `tabWidth: 2`
  - `trailingComma: "es5"`
  - `printWidth: 100`

**Linting:**
- Linter: ESLint flat config in `eslint.config.js` with `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.
- Scope: `**/*.{ts,tsx}` only (`eslint.config.js`), so plain `.js/.jsx` files are outside primary lint coverage.
- Ignores: `dist`, `dist-electron`, `.github`, `.opencode`.
- Quality implications:
  - Mixed quote style exists (`src/components/clock.tsx` uses double quotes while most files use single quotes), but `lint-staged` auto-runs `prettier --write` for `src/**/*.{ts,tsx}` from `package.json`.

## Import Organization

**Order:**
1. External packages first (`react`, `electron`, `bcryptjs`).
2. Internal modules second (relative imports like `../repositories/user.repository.js`, `../../i18n`).
3. Type-only imports are explicitly marked with `import type` when used (examples: `src/hooks/useLogin.ts`, `electron/service/user.service.ts`).

**Path Aliases:**
- Vite alias `@` -> `src` is configured in `vite.config.ts`.
- Current source primarily uses relative imports rather than alias imports.

## Error Handling

**Patterns:**
- Renderer-side async calls use `try/catch/finally` with local error state (`src/hooks/useLogin.ts`, `src/components/UI/users.tsx`, `src/components/UI/reports.tsx`).
- Electron service layer returns structured failure objects instead of throwing for domain validation (`electron/service/user.service.ts`, `electron/service/vehicle.service.ts`).
- Defensive fallbacks are used around optional DB queries in handlers (`electron/handlers/vehicle.handler.ts` catches failures and returns default `0` metrics).
- Hard startup preconditions throw explicit errors when invariant is broken (`electron/database/db.ts` in `getDatabase`).

## Logging

**Framework:** console

**Patterns:**
- Error logs are written with `console.error(...)` in renderer/electron utility paths (examples: `src/components/UI/settings.tsx`, `src/components/vehiclesResumeTable.tsx`, `electron/main.ts`).
- Migration progress logs use `console.log(...)` (`electron/database/db.ts`).
- No centralized logger abstraction detected.

## Comments

**When to Comment:**
- Comments are sparse and mostly used to separate sections or explain specific decisions (examples: section banners in `electron/service/user.service.ts`, migration section comments in `electron/database/db.ts`).
- Some files include author header comments (examples: `src/App.tsx`, `src/components/UI/users.tsx`, `src/components/UI/reports.tsx`).

**JSDoc/TSDoc:**
- Not a standard pattern in application code; no regular JSDoc/TSDoc blocks detected in `src/` or `electron/`.

## Function Design

**Size:**
- Functions are generally medium-size in service/repository layers (`electron/service/user.service.ts`, `electron/repositories/user.repository.ts`).
- Large component rendering functions exist in UI screens (`src/App.tsx`, `src/components/UI/reports.tsx`, `src/components/UI/users.tsx`).

**Parameters:**
- Strongly typed params are standard in TypeScript files (examples: `handleSubmit(event: FormEvent<HTMLFormElement>)` in `src/App.tsx`, `getUserById(id: number)` in `electron/service/user.service.ts`).
- Optional args used for partial updates and optional IPC fields (`total?: string`, `selectedDate?: string`).

**Return Values:**
- Repository functions return concrete entity arrays/rows or numeric DB change counts (`electron/repositories/user.repository.ts`).
- Service layer returns domain result objects to support predictable UI messaging (`electron/service/user.service.ts`, `electron/service/vehicle.service.ts`).
- Hooks/components return React state APIs and JSX respectively (`src/hooks/useLogin.ts`, `src/App.tsx`).

## Module Design

**Exports:**
- Named exports are dominant for services, repositories, and screen components (`electron/service/*.ts`, `src/components/UI/*.tsx`).
- Default exports are used selectively for app shell/utility components (`src/components/clock.tsx`, `src/main.tsx`).

**Barrel Files:**
- Not used as a broad pattern; modules are imported directly from concrete file paths.

## Typing Practices

- TypeScript `strict` mode is enabled across app, node/vite config, and electron builds (`tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.electron.json`).
- Additional compile-time guards enabled: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`; app/node configs also enforce `noUncheckedSideEffectImports`.
- Cross-process typing is maintained with shared contracts via `src/types/electron-api.d.ts` and preload signatures in `electron/preload.ts`.
- Type-only imports are used to avoid runtime import overhead and clarify intent (`import type` usage in `src/hooks/useLogin.ts`, `electron/service/user.service.ts`).
- Database row types rely on `as Type` assertions after `better-sqlite3` calls (`electron/repositories/*.ts`), so future phases should keep SQL column names synchronized with model interfaces.

## Build Quality Gates

- Local gate 1: pre-commit hook runs `lint-staged` (`.husky/pre-commit`) and `package.json` applies `eslint --fix` + `prettier --write` on staged `src/**/*.{ts,tsx}`.
- Local gate 2: commit message hook enforces Conventional Commits via commitlint (`.husky/commit-msg`, `commitlint.config.cjs`).
- Local gate 3: pre-push hook executes full build (`.husky/pre-push` -> `npm run build`).
- Build script itself enforces chained checks (`package.json`: `build` = `npm run lint && tsc -b && vite build`).
- CI gate: `.github/workflows/ci.yml` runs `npm run lint` and `npx tsc --noEmit` on pushes/PRs to `main` and `dev`.
- Release gate: `.github/workflows/build.yml` builds Windows installer on tags and performs `electron-rebuild` for native module compatibility.

## Actionable Guidance For Future Phases

- Keep snake_case DTO fields when crossing Electron/SQLite boundaries to avoid mapper code in every repository/service call.
- Prefer adding new domain logic in `electron/service/<domain>.service.ts` and keep `electron/handlers/*.ts` focused on IPC validation and delegation.
- Add or update shared IPC types in `src/types/electron-api.d.ts` whenever preload or service contracts change.
- Keep renderer `try/catch/finally` handling for all `window.electronAPI` calls, and map domain failures to user-facing messages.
- Expand lint coverage to include `electron/**/*.ts` and non-`src` TS files if stricter quality enforcement is needed in upcoming phases.

---

*Convention analysis: 2026-04-09*
