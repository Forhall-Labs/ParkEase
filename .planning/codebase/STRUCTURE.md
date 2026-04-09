# Codebase Structure

**Analysis Date:** 2026-04-09

## Directory Layout

```text
parqueo-parroquial-san-marcos/
├── src/                    # React renderer application (UI, hooks, layout, client types)
├── electron/               # Electron main/preload and backend domain modules
├── public/                 # Static assets served by Vite
├── dist/                   # Built renderer output (generated)
├── dist-electron/          # Built Electron main/preload/backend output (generated)
├── .planning/              # GSD project planning artifacts and phase history
├── .github/                # Workflows, skills, prompts, and repository automation files
├── package.json            # Scripts and dependency manifest
├── vite.config.ts          # Vite + Electron build orchestration
├── tsconfig*.json          # TS compiler configs per target
└── README.md               # Project-level overview
```

## Directory Purposes

**src:**
- Purpose: Renderer-side code executed in BrowserWindow.
- Contains: `App.tsx`, feature UI modules, layout shell, hooks, i18n, CSS, mock data.
- Key files: `src/main.tsx`, `src/App.tsx`, `src/layout/layout.tsx`, `src/components/UI/reports.tsx`, `src/hooks/useLogin.ts`, `src/types/electron-api.d.ts`.

**electron:**
- Purpose: Main-process backend and bridge.
- Contains: App startup (`main.ts`), preload contract (`preload.ts`), IPC handlers, services, repositories, models, DB bootstrap.
- Key files: `electron/main.ts`, `electron/preload.ts`, `electron/database/db.ts`, `electron/handlers/vehicle.handler.ts`, `electron/service/user.service.ts`, `electron/repositories/vehcile.repository.ts`.

**public:**
- Purpose: Static assets copied by Vite.
- Contains: Public resources consumed at runtime by renderer.
- Key files: `public/vite.svg` (and other static assets present in this folder).

**dist (generated):**
- Purpose: Production renderer bundle.
- Contains: `index.html` and compiled JS/CSS assets.
- Key files: `dist/index.html`, `dist/assets/*`.

**dist-electron (generated):**
- Purpose: Compiled Electron main/preload/backend output.
- Contains: JS outputs mirroring `electron/` structure.
- Key files: `dist-electron/main.js`, `dist-electron/preload.js`, `dist-electron/database/db.js`, `dist-electron/handlers/*.js`.

**.planning:**
- Purpose: Product planning, requirements, roadmap, and phase execution artifacts.
- Contains: Project docs, per-phase context/plans/summaries, generated codebase map docs.
- Key files: `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/config.json`, `.planning/phases/04-reports/04-UI-SPEC.md`.

**.github:**
- Purpose: Repo automation and GSD skill definitions.
- Contains: CI workflows, issue templates, agents, prompts, and skill instructions.
- Key files: `.github/workflows/*`, `.github/skills/gsd-map-codebase/SKILL.md`, `.github/copilot-instructions.md`.

## Key File Locations

**Entry Points:**
- `electron/main.ts`: Electron desktop app lifecycle and BrowserWindow creation.
- `electron/preload.ts`: Renderer-safe API exposure (`window.electronAPI`).
- `src/main.tsx`: React root mount.
- `src/App.tsx`: App shell, auth gate, and section routing.

**Configuration:**
- `package.json`: Runtime/dev dependencies and npm scripts.
- `vite.config.ts`: Vite plugins and Electron build entries.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.electron.json`, `tsconfig.node.json`: TS target separation.
- `eslint.config.js`, `.prettierrc`, `commitlint.config.cjs`: code quality and commit standards.

**Core Logic:**
- `electron/database/db.ts`: SQLite initialization and migrations.
- `electron/handlers/*.ts`: IPC endpoints.
- `electron/service/*.ts`: Business rules.
- `electron/repositories/*.ts`: SQL data access.
- `electron/models/*.ts`: Domain DTOs and entity types.

**Testing:**
- Not detected: no `*.test.*`, `*.spec.*`, or dedicated test directory in current workspace tree.

## Naming Conventions

**Files:**
- Feature/domain files use lowercase with dot suffix by layer: `user.handler.ts`, `vehicle.service.ts`, `parameter.repository.ts`.
- React components are mixed: PascalCase (`src/components/UI/Modal.tsx`) and camel/lowercase (`src/components/clock.tsx`, `src/components/dashboardCard.tsx`).

**Directories:**
- Layer-based backend grouping under `electron/` (`handlers`, `service`, `repositories`, `models`, `database`).
- UI grouping under `src/components/UI/` with shared app shell in `src/layout/` and hooks in `src/hooks/`.

## Where to Add New Code

**New Feature (domain + UI):**
- Renderer view/component: `src/components/UI/`.
- App routing/render switch updates: `src/App.tsx`.
- Electron API contract method: `electron/preload.ts` and `src/types/electron-api.d.ts`.
- Main-process endpoint: `electron/handlers/<domain>.handler.ts`.
- Business logic: `electron/service/<domain>.service.ts`.
- Persistence logic: `electron/repositories/<domain>.repository.ts`.

**New Component/Module:**
- Screen-scoped component: `src/components/UI/`.
- Reusable shared component: `src/components/`.
- Shared shell/navigation behavior: `src/layout/layout.tsx` and `src/components/UI/sidebar.tsx`.

**Utilities:**
- Renderer-only utilities: add under a new `src/utils/` folder (not currently present).
- Main-process utilities: colocate under `electron/` by domain or add `electron/utils/` if cross-domain.

## Planning Artifacts and Workflow Files

**Core Planning Docs:**
- `.planning/PROJECT.md`: Product scope, context, constraints.
- `.planning/REQUIREMENTS.md`: Requirement statements and status.
- `.planning/ROADMAP.md`: Milestones and phase sequence.
- `.planning/STATE.md`: Current planning/execution state.

**Phase Artifacts:**
- Location pattern: `.planning/phases/<phase-name>/`.
- Typical files: `*-CONTEXT.md`, `*-PLAN.md`, `*-SUMMARY.md`, plus optional UAT/review/UI specs.
- Existing examples: `.planning/phases/01-user-management-dashboard/01-01-PLAN.md`, `.planning/phases/03-vehicle-exit-payment/03-UAT.md`, `.planning/phases/04-reports/04-UI-SPEC.md`.

**Codebase Mapping Output:**
- Location: `.planning/codebase/`.
- Intended files include: `ARCHITECTURE.md`, `STRUCTURE.md`, `STACK.md`, `INTEGRATIONS.md`, `CONVENTIONS.md`, `TESTING.md`, `CONCERNS.md`.

## Special Directories

**dist:**
- Purpose: Vite renderer build output.
- Generated: Yes.
- Committed: Yes (present in workspace).

**dist-electron:**
- Purpose: Compiled Electron runtime files.
- Generated: Yes.
- Committed: Yes (present in workspace).

**node_modules:**
- Purpose: Installed dependencies.
- Generated: Yes.
- Committed: No.

**.opencode:**
- Purpose: Local GSD/opencode operational assets and helper resources.
- Generated: Yes/Tool-managed.
- Committed: Typically no (workspace-local tooling folder).

---

*Structure analysis: 2026-04-09*
