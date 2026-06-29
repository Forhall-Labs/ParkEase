# Technology Stack

## Languages

- TypeScript (primary language)
- JavaScript (for some configuration files)
- JSON (package.json, tsconfig, etc.)
- CSS/Tailwind CSS (styling)

## Runtime & Platform

- Node.js (version 22+ as per CI configuration)
- Electron (version ^41.1.1) - Desktop application framework
- Vite (^8.0.1) - Build tool and development server

## Frontend Framework

- React (^19.2.4) - UI library
- React DOM (^19.2.4) - DOM rendering for React
- @vitejs/plugin-react (^6.0.1) - Vite plugin for React

## UI Component Library

- @mui/material (^9.0.0) - Material UI components
- @emotion/react (^11.14.0) & @emotion/styled (^11.14.1) - Styling for MUI

## Styling

- Tailwind CSS (^4.2.2) via @tailwindcss/vite
- PostCSS (implicit through Tailwind)
- CSS modules (via vite-plugin-electron-renderer)

## State Management

- React Context API (implied from hooks usage)
- Custom hooks (e.g., useLogin.ts)

## Build Tools & Dev Dependencies

- TypeScript (~5.9.3) with typescript-eslint
- ESLint (^9.39.4) with plugins:
  - eslint-config-prettier
  - eslint-plugin-react-hooks
  - eslint-plugin-react-refresh
- Prettier (^3.8.1) for code formatting
- Husky (^9.1.7) for git hooks
- Lint-staged (^16.4.0) for pre-commit linting
- Commitlint (^20.5.0) for commit message validation
- Vite plugins:
  - vite-plugin-electron (^0.29.1)
  - vite-plugin-electron-renderer (^0.14.6)
- ESBuild (^0.27.7) for fast bundling

## Database

- Better SQLite3 (^12.8.0) - Embedded SQLite database
- Types: @types/better-sqlite3 (^7.6.13)

## Security & Utilities

- Bcryptjs (^3.0.3) - Password hashing
- Types: @types/bcryptjs (^2.4.6)

## Electron Specific

- @electron/rebuild (^4.0.3) - Rebuild native Electron modules
- Electron Builder (^26.8.1) - Packaging and distribution

## Configuration Files

- package.json - Project metadata and dependencies
- tsconfig.json - TypeScript configuration with project references
- tsconfig.node.json - Node.js specific TypeScript config
- tsconfig.electron.json - Electron main process TypeScript config
- tsconfig.app.json - Renderer process TypeScript config
- vite.config.ts - Vite configuration
- electron-builder configuration in package.json.build
- eslint.config.js - ESLint configuration
- commitlint.config.cjs - Commitlint configuration
- .prettierrc - Prettier configuration
