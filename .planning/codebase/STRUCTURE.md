# Codebase Structure

**Analysis Date:** 2026-04-08

## Directory Layout

```
parqueo-parroquial-san-marcos/
├── electron/                    # Electron main process (backend)
│   ├── database/                # Database connection and migrations
│   ├── handlers/                # IPC handlers (channel → service)
│   ├── models/                  # TypeScript interfaces and DTOs
│   ├── repositories/            # SQL query layer
│   ├── service/                 # Business logic layer
│   ├── main.ts                  # Electron entry point
│   └── preload.ts               # Context bridge API
├── src/                         # React frontend (renderer)
│   ├── components/              # React components
│   ├── data/                    # Mock data for development
│   ├── hooks/                   # Custom React hooks
│   ├── layout/                  # Layout components
│   ├── styles/                  # CSS styles
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   ├── App.tsx                  # Main React component
│   ├── main.tsx                 # React entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── dist/                        # Build output (frontend)
├── dist-electron/               # Build output (electron)
└── package.json                 # Project configuration
```

## Directory Purposes

**electron/database:**

- Purpose: SQLite database management
- Contains: `db.ts` - connection singleton, migrations, schema definitions
- Key files: `db.ts`

**electron/handlers:**

- Purpose: IPC channel registration
- Contains: `user.handler.ts`, `vehicle.handler.ts`, `parameter.handler.ts`
- Pattern: Each handler registers multiple `ipcMain.handle()` listeners

**electron/models:**

- Purpose: TypeScript type definitions
- Contains: `user.model.ts`, `vehicle.model.ts`, `parameter.model.ts`
- Key files: `user.model.ts` - defines `User`, `SafeUser`, `CreateUserDto`, `UpdateUserDto`

**electron/repositories:**

- Purpose: Raw SQL queries
- Contains: `user.repository.ts`, `vehcile.repository.ts`, `parameter.repository.ts`
- Pattern: Export functions that execute prepared statements

**electron/service:**

- Purpose: Business logic
- Contains: `user.service.ts`, `vehicle.service.ts`, `parameter.service.ts`
- Pattern: Service functions call repository functions, apply validation/transformation

**src/components:**

- Purpose: React UI components
- Contains: `UI/dashboard.tsx`, `UI/sidebar.tsx`, `dashboardCard.tsx`, etc.
- Key files: `UI/dashboard.tsx` - main dashboard panel

**src/hooks:**

- Purpose: Custom React hooks for stateful logic
- Contains: `useLogin.ts` - login form state and submission
- Key files: `useLogin.ts`

**src/types:**

- Purpose: Frontend type definitions
- Contains: `electron-api.d.ts` - mirrors preload API types
- Key files: `electron-api.d.ts`

## Key File Locations

**Entry Points:**

- `electron/main.ts`: Electron app startup, database init, handler registration
- `src/main.tsx`: React app mount with StrictMode
- `src/App.tsx`: Root component, renders login or dashboard

**Configuration:**

- `package.json`: Dependencies, scripts, Electron config
- `vite.config.ts`: Vite + Electron integration
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.electron.json`: TypeScript configs

**Core Logic:**

- `electron/service/user.service.ts`: Login, user CRUD, password hashing
- `electron/repositories/user.repository.ts`: SQL for users table
- `electron/database/db.ts`: SQLite migrations and connection

**Testing:**

- No test files detected in this codebase

## Naming Conventions

**Files:**

- TypeScript interfaces: `*.model.ts` (e.g., `user.model.ts`)
- Services: `*.service.ts` (e.g., `user.service.ts`)
- Repositories: `*.repository.ts` (e.g., `user.repository.ts`)
- Handlers: `*.handler.ts` (e.g., `user.handler.ts`)
- Components: PascalCase with extension (e.g., `dashboard.tsx`, `DashboardCard.tsx`)
- Hooks: `use*.ts` (e.g., `useLogin.ts`)
- Types: `*.d.ts` for global types

**Directories:**

- Backend layers: lowercase with dots (`database`, `handlers`, `repositories`)
- Frontend: lowercase (`components`, `hooks`, `types`)

**Database:**

- Tables: `psm_*` prefix (e.g., `psm_users`, `psm_vehicles`)
- Columns: snake_case with prefix (e.g., `user_id`, `user_username`)
- Migrations: `001_*`, `002_*`, etc.

## Where to Add New Code

**New Feature (Backend):**

1. Add model types in `electron/models/*.model.ts`
2. Add repository functions in `electron/repositories/*.repository.ts`
3. Add service logic in `electron/service/*.service.ts`
4. Register IPC handlers in `electron/handlers/*.handler.ts`

**New Feature (Frontend):**

1. Add component in `src/components/`
2. Add hook if needed in `src/hooks/`
3. Add types in `src/types/`
4. Update preload API in `electron/preload.ts`

**New Database Table:**

1. Add migration function in `electron/database/db.ts`
2. Add model in `electron/models/`
3. Add repository functions in `electron/repositories/`
4. Add service in `electron/service/`
5. Add handler in `electron/handlers/`
6. Add API to preload in `electron/preload.ts`

**Utilities:**

- Shared helpers: `src/utils/` (not currently used heavily)

---

_Structure analysis: 2026-04-08_
