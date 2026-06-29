# Directory Structure

## Root Level

- `package.json` - Project metadata, dependencies, scripts
- `tsconfig.json` - TypeScript project references
- `vite.config.ts` - Vite configuration
- `electron/` - Electron main process and related files
- `src/` - React application source code
- `.planning/` - Project planning and documentation
- `.github/` - GitHub workflows and templates
- `.opencode/` - OpenCode agent configurations

## Electron Main Process (`electron/`)

- `main.ts` - Electron application entry point
- `preload.ts` - Secure context bridge to renderer
- `handlers/` - IPC handlers for main/renderer communication
  - `parameter.handler.ts`
  - `vehicle.handler.ts`
  - `user.handler.ts`
  - `setting.handler.ts`
  - `session.handler.ts`
- `models/` - TypeScript interfaces for data models
  - `parameter.model.ts`
  - `vehicle.model.ts`
  - `user.model.ts`
- `repositories/` - Data access layer using repository pattern
  - `parameter.repository.ts`
  - `vehcile.repository.ts` (note: typo in filename)
  - `setting.repository.ts`
  - `user.repository.ts`
- `service/` - Business logic layer
  - `parameter.service.ts`
  - `vehicle.service.ts`
  - `setting.service.ts`
  - `user.service.ts`
- `database/` - Database initialization and connection
  - `db.ts` - SQLite database setup

## React Application (`src/`)

- `main.tsx` - React application entry point
- `App.tsx` - Root application component
- `index.css` - Global CSS styles
- `i18n.ts` - Internationalization configuration
- `hooks/` - Custom React hooks
  - `useLogin.ts` - Authentication hook
- `components/` - UI components organized by type/function
  - `UI/` - High-level UI sections and pages
    - `dashboard.tsx` - Dashboard view
    - `reports.tsx` - Reports view
    - `settings.tsx` - Settings view
    - `users.tsx` - User management view
    - `Modal.tsx` - Unified modal component
    - `sidebar.tsx` - Navigation sidebar
  - `sidebarItems.tsx` - Sidebar navigation items
  - `vehiclesResumeTable.tsx` - Vehicle listing table
  - `dashboardCard.tsx` - Dashboard summary cards
  - `clock.tsx` - Time display component
  - `primitives/` - Low-level reusable components
    - `Button.tsx`
    - `Input.tsx`
    - `Card.tsx`
    - `SectionHeader.tsx`
    - `StatusBadge.tsx`
    - `index.ts` - Export barrel
- `styles/` - CSS styling files
  - `primitives.css` - Styles for primitive components
  - `tokens.css` - Design tokens (colors, spacing, etc.)
- `data/` - Mock data for development/testing
  - `mockVehicle.data.ts`
  - `mockDashboardCard.data.ts`
- `types/` - TypeScript declarations
  - `electron-api.d.ts` - Electron API types for renderer
- `vite-env.d.ts` - Vite environment types

## Configuration Files

- `tsconfig.node.json` - Node.js TypeScript configuration
- `tsconfig.electron.json` - Electron main process TypeScript config
- `tsconfig.app.json` - Renderer process TypeScript config
- `eslint.config.js` - ESLint configuration
- `commitlint.config.cjs` - Commit message linting config
- `.prettierrc` - Prettier code formatting config
- `scripts/ci-test-gate.mjs` - Custom CI test validation script

## Planning Documentation (`.planning/`)

- `codebase/` - Codebase mapping documents (this directory)
- `phases/` - GSD phase documentation
  - `12-ci-cd/` - CI/CD phase documentation
  - `10-quiero-que-agregues-una-fase-para-poder-editar-como-se-manej/` - Edit handling phase
- `CONTEXT.md` - Current session context
- `PROJECT.md` - Project overview
- `REQUIREMENTS.md` - Project requirements
- `ROADMAP.md` - Project roadmap
- `MILESTONES.md` - Project milestones
- `STATE.md` - Project state tracking
- `config.json` - GSD workflow configuration

## Key Naming Conventions

- TypeScript files: `.ts` extension
- React components: `.tsx` extension
- Constants and types: PascalCase
- Functions and variables: camelCase
- Files: kebab-case for most, camelCase for some component files
- Directories: kebab-case
- Repository files: `{entity}.repository.ts`
- Service files: `{entity}.service.ts`
- Model files: `{entity}.model.ts`
- Handler files: `{entity}.handler.ts`
- Test files: Not explicitly observed in structure
