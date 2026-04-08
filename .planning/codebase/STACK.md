# Technology Stack

**Analysis Date:** 2026-04-08

## Languages

**Primary:**

- TypeScript 5.9.3 - All source code (Electron main process and React frontend)
- JavaScript/JSX - Transpiled output for Electron and browser

**Secondary:**

- HTML/CSS - Entry points and styling

## Runtime

**Environment:**

- Node.js (bundled via Electron 41.1.1)
- Electron runtime for desktop application shell

**Package Manager:**

- npm (package.json based)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**

- React 19.2.4 - Frontend UI framework
- Electron 41.1.1 - Desktop application shell

**UI Library:**

- MUI (Material UI) 9.0.0 - Component library
- Emotion 11.14.0 (react) / 11.14.1 (styled) - Styling engine for MUI

**Build/Dev:**

- Vite 8.0.1 - Build tool and dev server
- vite-plugin-electron 0.29.1 - Electron integration
- vite-plugin-electron-renderer 0.14.6 - Renderer process support
- esbuild 0.27.7 - Fast TypeScript bundler for Electron

**Desktop Packaging:**

- electron-builder 26.8.1 - Windows executable generation
- @electron/rebuild 4.0.3 - Native module rebuilding

**Styling:**

- Tailwind CSS 4.2.2 - Utility-first CSS framework
- @tailwindcss/vite 4.2.2 - Vite integration for Tailwind

## Key Dependencies

**Critical:**

- better-sqlite3 12.8.0 - SQLite database (local storage)
- bcryptjs 3.0.3 - Password hashing
- react-dom 19.2.4 - React DOM renderer

**Infrastructure:**

- @types/node 24.12.2 - Node.js type definitions
- @types/react 19.2.14 - React type definitions
- @types/better-sqlite3 7.6.13 - SQLite type definitions
- @types/bcryptjs 2.4.6 - bcryptjs type definitions

## Configuration

**Environment:**

- No `.env` file detected - Configuration via code
- Database path: `app.getPath('userData')/psm.db` (Electron userData directory)

**Build:**

- `vite.config.ts` - Vite and Electron configuration
- `tsconfig.json` - TypeScript configuration (project references)
- `tsconfig.node.json` - Vite config TypeScript
- `tsconfig.electron.json` - Electron main process TypeScript
- `tsconfig.app.json` - React frontend TypeScript

**Linting/Formatting:**

- `eslint.config.js` - ESLint flat config
- `.prettierrc` - Prettier formatting rules

## Platform Requirements

**Development:**

- Node.js 18+ recommended
- Windows/macOS for development
- `npm run dev` - Start dev server with Electron

**Production:**

- Windows executable via `npm run build:win`
- Application runs as standalone desktop app
- SQLite database stored in user data directory

---

_Stack analysis: 2026-04-08_
