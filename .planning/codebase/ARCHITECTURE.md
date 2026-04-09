# Architecture

**Analysis Date:** 2026-04-09

## Pattern Overview

**Overall:** Layered desktop application (Electron main + preload bridge + React renderer) with SQLite persistence.

**Key Characteristics:**
- Process boundary is explicit: renderer cannot access Node APIs directly; it uses `window.electronAPI` exposed from `electron/preload.ts`.
- Main-process IPC handlers are organized by domain (`users`, `vehicles`, `parameters`, `session`, `settings`).
- Backend domain logic follows handler -> service -> repository -> SQLite flow under `electron/`.

## Layers

**Renderer UI Layer:**
- Purpose: Present UI, collect user input, and call bridge APIs.
- Location: `src/`
- Contains: React components, layout shell, hooks, i18n, shared types.
- Depends on: `window.electronAPI`, browser APIs, React.
- Used by: End users through Electron BrowserWindow.
- Evidence: `src/main.tsx`, `src/App.tsx`, `src/layout/layout.tsx`, `src/components/UI/users.tsx`, `src/hooks/useLogin.ts`.

**Preload Bridge Layer:**
- Purpose: Define the safe contract between renderer and main process.
- Location: `electron/preload.ts`
- Contains: `contextBridge.exposeInMainWorld('electronAPI', ...)`, IPC invoke wrappers, DTO/type exports.
- Depends on: Electron `ipcRenderer`.
- Used by: Renderer (`src/*`) through global `window.electronAPI` type contract in `src/types/electron-api.d.ts`.

**Main Process Orchestration Layer:**
- Purpose: App lifecycle, window creation, DB bootstrap, and IPC registration.
- Location: `electron/main.ts`
- Contains: `app.whenReady`, `createWindow`, `register*Handlers` calls.
- Depends on: Electron app/window APIs and all handler modules.
- Used by: Electron runtime startup.

**IPC Handler Layer:**
- Purpose: Receive IPC calls, validate basic input shape, route to services.
- Location: `electron/handlers/`
- Contains: Domain handlers for users, vehicles, parameters, settings, session.
- Depends on: Domain services and shared models.
- Used by: Preload-exposed API methods.
- Evidence: `electron/handlers/user.handler.ts`, `electron/handlers/vehicle.handler.ts`, `electron/handlers/session.handler.ts`, `electron/handlers/setting.handler.ts`, `electron/handlers/parameter.handler.ts`.

**Service Layer:**
- Purpose: Business rules and domain-level validations.
- Location: `electron/service/`
- Contains: Login/password logic, duplicate checks, checkout/report orchestration, setting operations.
- Depends on: Repository functions and model types.
- Used by: IPC handlers.
- Evidence: `electron/service/user.service.ts`, `electron/service/vehicle.service.ts`, `electron/service/setting.service.ts`, `electron/service/parameter.service.ts`.

**Repository/Data Access Layer:**
- Purpose: SQL statements and persistence operations.
- Location: `electron/repositories/`
- Contains: CRUD/read-model queries over `better-sqlite3`.
- Depends on: DB singleton provider and model types.
- Used by: Services.
- Evidence: `electron/repositories/user.repository.ts`, `electron/repositories/parameter.repository.ts`, `electron/repositories/setting.repository.ts`, `electron/repositories/vehcile.repository.ts`.

**Database Layer:**
- Purpose: Open DB file, configure pragmas, run migrations.
- Location: `electron/database/db.ts`
- Contains: Singleton DB instance, migration registry (`001`..`004`), schema creation.
- Depends on: Electron `app.getPath('userData')`, `better-sqlite3`.
- Used by: Repositories and session handler.

## Data Flow

**Flow: Login and Session Restore**

1. UI captures credentials in `src/App.tsx` and `src/hooks/useLogin.ts`.
2. Hook calls `window.electronAPI.users.login(...)` from preload contract (`electron/preload.ts`).
3. Preload sends IPC invoke `users:login` to main process.
4. `electron/handlers/user.handler.ts` routes to `login` in `electron/service/user.service.ts`.
5. Service queries repository (`findUserByUsername`) in `electron/repositories/user.repository.ts`, validates status/password, and returns safe DTO.
6. Renderer stores session by calling `window.electronAPI.session.save(...)`; `electron/handlers/session.handler.ts` persists single row in `psm_sessions`.
7. On app load, `useLogin` calls `session:restore` to hydrate current user from SQLite-backed session table.

**Flow: Vehicle Reporting**

1. Reports UI requests report data via `window.electronAPI.vehicles.getReport(...)` (used by `src/components/UI/reports.tsx`).
2. Preload invokes IPC `vehicles:getReport` (`electron/preload.ts`).
3. `electron/handlers/vehicle.handler.ts` normalizes date and period.
4. Handler delegates to `getReport` in `electron/service/vehicle.service.ts`.
5. Service delegates SQL report query to `electron/repositories/vehcile.repository.ts`.
6. Result DTO returns through IPC to renderer for table/chart rendering.

**State Management:**
- UI state is component-local with React hooks (`useState`, `useEffect`) in `src/App.tsx` and feature components.
- Authentication/session state is persisted in SQLite table `psm_sessions` and restored at boot through IPC.
- No centralized client-side state library is used.

## Key Abstractions

**Electron API Contract (`window.electronAPI`):**
- Purpose: Stable typed boundary for renderer-side calls.
- Examples: `electron/preload.ts`, `src/types/electron-api.d.ts`.
- Pattern: Namespace-by-domain (`users`, `vehicles`, `parameters`, `session`, `settings`) with Promise-based methods.

**Domain DTOs and Models:**
- Purpose: Define payload shape across IPC, service, and repository boundaries.
- Examples: `electron/models/user.model.ts`, `electron/models/vehicle.model.ts`, `electron/models/parameter.model.ts`.
- Pattern: `Create*Dto`, `Update*Dto`, result envelopes (`{ success, message, id }`).

**Repository Query Modules:**
- Purpose: Keep SQL out of handlers/services.
- Examples: `electron/repositories/user.repository.ts`, `electron/repositories/vehcile.repository.ts`.
- Pattern: One module per domain table and query set.

## Entry Points

**Desktop App Entry Point:**
- Location: `electron/main.ts`
- Triggers: Electron runtime startup.
- Responsibilities: Start DB, register IPC handlers, create BrowserWindow, load Vite dev URL or built HTML.

**Renderer Entry Point:**
- Location: `src/main.tsx`
- Triggers: BrowserWindow loads renderer bundle.
- Responsibilities: Mount React root and render `App`.

**Security Boundary Entry Point:**
- Location: `electron/preload.ts`
- Triggers: BrowserWindow preload execution before renderer scripts.
- Responsibilities: Expose minimal IPC API via `contextBridge`.

## Error Handling

**Strategy:** Return structured result objects for expected domain failures and use try/catch in handlers for non-critical failures.

**Patterns:**
- Service-level validation returns `{ success: false, message }` (see `electron/service/user.service.ts` and `electron/service/vehicle.service.ts`).
- Defensive fallback in handlers for aggregations/report input normalization (see `electron/handlers/vehicle.handler.ts`).
- Startup failure path logs and exits app (`electron/main.ts`).

## Cross-Cutting Concerns

**Logging:**
- Uses `console.log` and `console.error` in main process startup/migrations (`electron/main.ts`, `electron/database/db.ts`).

**Validation:**
- Implemented mainly in services (duplicate checks, status checks, password checks).
- Lightweight handler-level normalization for report period/date (`electron/handlers/vehicle.handler.ts`).

**Authentication:**
- Username/password verification in `electron/service/user.service.ts` using `bcryptjs`.
- Session persistence and restore in `electron/handlers/session.handler.ts` with SQLite table `psm_sessions`.

---

*Architecture analysis: 2026-04-09*
