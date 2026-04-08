# Architecture

**Analysis Date:** 2026-04-08

## Pattern Overview

**Overall:** Electron + React with Service-Repository Pattern

**Key Characteristics:**

- Electron main process handles all data operations (no direct database access from renderer)
- Service layer encapsulates business logic (login, validation, password hashing)
- Repository layer handles raw SQL queries via better-sqlite3
- IPC communication via contextBridge with type-safe API
- Migration-based database schema management

## Layers

**Frontend (Renderer) - React:**

- Purpose: UI rendering and user interaction
- Location: `src/`
- Contains: Components, hooks, types, mock data
- Depends on: `window.electronAPI` exposed via preload
- Used by: End users via Electron BrowserWindow

**Electron Main Process:**

- Purpose: Backend logic, database operations, window management
- Location: `electron/`
- Contains: Handlers, services, repositories, models, database

**IPC Handler Layer:**

- Purpose: Bridges IPC channel names to service functions
- Location: `electron/handlers/`
- Contains: `user.handler.ts`, `vehicle.handler.ts`, `parameter.handler.ts`
- Depends on: Service layer
- Used by: Preload script (called via ipcRenderer.invoke)

**Service Layer:**

- Purpose: Business logic, validation, data transformation
- Location: `electron/service/`
- Contains: `user.service.ts`, `vehicle.service.ts`, `parameter.service.ts`
- Depends on: Repository layer
- Used by: Handler layer

**Repository Layer:**

- Purpose: Raw SQL queries and database operations
- Location: `electron/repositories/`
- Contains: `user.repository.ts`, `vehcile.repository.ts`, `parameter.repository.ts`
- Depends on: Database layer
- Used by: Service layer

**Database Layer:**

- Purpose: SQLite connection management and migrations
- Location: `electron/database/db.ts`
- Contains: Connection singleton, migration runner
- Uses: `better-sqlite3`

**Preload Layer:**

- Purpose: Exposes safe IPC API to renderer
- Location: `electron/preload.ts`
- Contains: Type definitions, contextBridge API
- Exposes: `window.electronAPI`

## Data Flow

**Login Flow:**

1. User fills login form in React (`src/App.tsx`)
2. `useLogin` hook calls `window.electronAPI.users.login(dto)` (preload bridge)
3. `ipcRenderer.invoke('users:login', dto)` sends to main process
4. `user.handler.ts` receives: `ipcMain.handle('users:login', ...)`
5. Handler calls `login(dto)` from `user.service.ts`
6. Service validates, hashes passwords with bcrypt, calls repository
7. Repository executes SQL: `SELECT * FROM psm_users WHERE user_username = ?`
8. Result flows back up through layers to React state

**Vehicle Registration Flow:**

1. User submits vehicle form
2. React calls `window.electronAPI.vehicles.create(dto)`
3. IPC → handler → service → repository → database
4. Service runs business logic (validations)
5. Repository inserts: `INSERT INTO psm_vehicles ...`
6. Returns `{ success: true, id: n }` to UI

## Key Abstractions

**SafeUser:**

- Purpose: User object without password field
- Examples: `electron/models/user.model.ts`, `src/types/electron-api.d.ts`
- Pattern: TypeScript utility type `Omit<User, 'user_password'>`

**DTOs (Data Transfer Objects):**

- Purpose: Type-safe input for create/update operations
- Examples: `CreateUserDto`, `UpdateUserDto`, `LoginDto`
- Pattern: TypeScript interfaces in model files

**MutationResult:**

- Purpose: Standard response for write operations
- Pattern: `{ success: boolean; message?: string; id?: number }`

## Entry Points

**Main Electron Process:**

- Location: `electron/main.ts`
- Triggers: App launch via `app.whenReady()`
- Responsibilities: Initialize database, register IPC handlers, create BrowserWindow

**React Entry:**

- Location: `src/main.tsx`
- Triggers: BrowserWindow loads React app
- Responsibilities: Mount React root, render `<App />`

**App Component:**

- Location: `src/App.tsx`
- Triggers: User interaction (login), theme toggle
- Responsibilities: Render login form or dashboard based on auth state

## Error Handling

**Strategy:** Result objects with success flag and optional message

**Patterns:**

- Service functions return `{ success: boolean; message?: string; id?: number }`
- Login hook catches errors and sets error state for UI display
- Preload checks for `window.electronAPI` existence before calling

## Cross-Cutting Concerns

**Logging:** Console logging in main process (`console.log`, `console.error`)

**Validation:**

- Duplicate checking in service layer (username, email uniqueness)
- Input validation in `useLogin` hook (required fields)
- SQLite CHECK constraints for enum fields (user_status, vehicle status)

**Authentication:**

- bcrypt password hashing in service layer
- Legacy plaintext password support with auto-migration
- Session stored in React state (no JWT - desktop app, single user context)

---

_Architecture analysis: 2026-04-08_
