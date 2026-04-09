# Technology Stack

**Analysis Date:** 2026-04-09

## Languages

**Primary:**
- TypeScript 5.9.x - Renderer and Electron source in `src/` and `electron/` with project references in `tsconfig.json`.

**Secondary:**
- JavaScript (generated/runtime artifacts) - Electron build output in `dist-electron/` and package/tooling config in `commitlint.config.cjs`.
- CSS (Tailwind-driven utility styling) - Global styles in `src/index.css` and utility classes in React components like `src/App.tsx`.

## Runtime

**Environment:**
- Node.js 20 in CI and build runners (`.github/workflows/ci.yml`, `.github/workflows/build.yml`).
- Electron 41 runtime for desktop app shell (`package.json`, `electron/main.ts`).
- Chromium renderer via Electron + React (`electron/main.ts`, `src/main.tsx`).

**Package Manager:**
- npm (scripts and lockfile usage in `package.json` and `package-lock.json`).
- Lockfile: present (`package-lock.json`).

## Frameworks

**Core:**
- React 19 (`react`, `react-dom`) for renderer UI in `src/` (`package.json`, `src/main.tsx`).
- Electron 41 for desktop process model and secure preload bridge (`package.json`, `electron/main.ts`, `electron/preload.ts`).
- MUI + Emotion (`@mui/material`, `@emotion/react`, `@emotion/styled`) as component/styling dependencies (`package.json`).

**Testing:**
- Not detected. No Jest/Vitest/Playwright/Cypress config files found; CI currently runs lint + type-check only (`.github/workflows/ci.yml`).

**Build/Dev:**
- Vite 8 as dev server and bundle tool (`package.json`, `vite.config.ts`).
- `vite-plugin-electron` and `vite-plugin-electron-renderer` for Electron main/preload integration with Vite (`package.json`, `vite.config.ts`).
- TypeScript project builds via `tsc -b` and per-target configs (`package.json`, `tsconfig.app.json`, `tsconfig.electron.json`, `tsconfig.node.json`).
- Electron Builder for Windows packaging (`package.json`, `.github/workflows/build.yml`).
- Electron Rebuild for native module rebuild (`@electron/rebuild` dependency and workflow step in `.github/workflows/build.yml`).

## Key Dependencies

**Critical:**
- `electron` - App runtime and process isolation model (`electron/main.ts`, `electron/preload.ts`).
- `better-sqlite3` - Local persistent storage and migrations (`electron/database/db.ts`, `electron/repositories/*.ts`).
- `bcryptjs` - Password hashing and verification in local auth flow (`electron/service/user.service.ts`).
- `react` / `react-dom` - UI rendering (`src/main.tsx`, `src/App.tsx`).

**Infrastructure:**
- `vite` + `@vitejs/plugin-react` - Dev/build pipeline (`vite.config.ts`).
- `typescript` + `typescript-eslint` + `eslint` - Static checks and linting (`tsconfig*.json`, `eslint.config.js`, `package.json`).
- `prettier` + `lint-staged` + `husky` - formatting and pre-commit automation (`.prettierrc`, `package.json`, `.husky/`).
- `electron-builder` - distributable packaging (`package.json`, `.github/workflows/build.yml`).

## Configuration

**Environment:**
- Development window URL uses `process.env.VITE_DEV_SERVER_URL` in `electron/main.ts`.
- No `.env` files detected at repository root (shell glob check returned no matches).
- GitHub Actions uses `GH_TOKEN` for release packaging in `.github/workflows/build.yml`.

**Build:**
- Vite + Electron dual-entry build config in `vite.config.ts` (`electron/main.ts` and `electron/preload.ts` entries).
- TypeScript target partitioning across renderer/node/electron configs in `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.electron.json`.
- Lint rules in `eslint.config.js`; formatting rules in `.prettierrc`; commit policy in `commitlint.config.cjs`.

## Platform Requirements

**Development:**
- Node.js/npm toolchain with native module support for `better-sqlite3` and Electron rebuild (`package.json`, `.github/workflows/build.yml`).
- Local Electron dev startup expects Vite dev server on port 5173 (`vite.config.ts`, `electron/main.ts`).

**Production:**
- Desktop distribution target explicitly automated for Windows `.exe` artifacts (`.github/workflows/build.yml`).
- Local SQLite file stored under Electron user data path as `psm.db` (`electron/database/db.ts`).

---

*Stack analysis: 2026-04-09*
