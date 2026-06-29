# Architecture Overview

## Architectural Pattern

- **Electron Main/Renderer Process Separation** - Traditional Electron architecture
  - Main process: Handles system-level operations, database access, native integrations
  - Renderer process: React application UI running in Chromium
  - Inter-process communication (IPC) implied through preload script

## Layered Architecture

1. **Presentation Layer** (`src/components/`, `src/App.tsx`)
   - React components organized by feature and UI type
   - Separation between dashboard, vehicles, settings, reports views
   - Shared primitives (Button, Input, Card, etc.) in `src/components/primitives/`

2. **Application Layer** (`src/hooks/`, `src/i18n.ts`)
   - Custom React hooks (e.g., useLogin)
   - Cross-cutting concerns like internationalization

3. **Domain/Business Logic Layer** (Inferred from Electron structure)
   - Repository pattern implemented in Electron main process
   - Service layer separating business logic from data access
   - Model definitions representing core entities

4. **Data Access Layer** (`electron/database/`, `electron/repositories/`)
   - Database connection and initialization
   - Repository classes for each entity type (User, Vehicle, Parameter, Setting)
   - Direct SQLite operations through better-sqlite3

## Key Abstractions

- **Repository Pattern** - Each entity has a repository handling data operations
- **Service Layer** - Business logic orchestrates repository operations
- **Model Definitions** - TypeScript interfaces defining entity shapes
- **Electron Preload Script** - Secure bridge between renderer and main processes
- **Custom Hooks** - Encapsulate reusable stateful logic in React components

## Entry Points

- **Main Process**: `electron/main.ts` - Application lifecycle, window creation
- **Preload Script**: `electron/preload.ts` - Context bridge exposing safe APIs to renderer
- **Renderer Process**: `src/main.tsx` - React application entry point
- **Vite Config**: `vite.config.ts` - Build and development server configuration

## Data Flow

1. User interacts with React UI in renderer process
2. UI events trigger custom hooks or direct service calls
3. Services invoke repository methods for data operations
4. Repositories perform SQLite operations via better-sqlite3
5. Results flow back up the chain to update React state
6. Cross-process communication (if needed) handled through preload exposed APIs

## Concurrency & Threading

- Main process handles database operations (potentially blocking)
- Renderer process runs React UI (single-threaded but async-friendly)
- Heavy operations should be off-loaded to avoid blocking UI
- No explicit worker threads or clustering observed

## scalability considerations

- Designed as single-user desktop application
- SQLite limitations apply (concurrent writes, database size)
- Electron memory usage typical of Chromium-based apps
- Horizontal scaling not applicable (desktop install model)

## Key Files by Responsibility

- **App Lifecycle**: `electron/main.ts`
- **Database**: `electron/database/db.ts`
- **Repositories**: `electron/repositories/*.repository.ts`
- **Services**: `electron/service/*.service.ts`
- **Models**: `electron/models/*.model.ts`
- **UI Components**: `src/components/**/*.tsx`
- **Styles**: `src/styles/*.css`, `src/index.css`
- **Configuration**: `package.json`, `tsconfig*.json`, `vite.config.ts`
