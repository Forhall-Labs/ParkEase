# Coding Conventions

**Analysis Date:** 2026-04-08

## Naming Patterns

**Files:**

- PascalCase for components: `src/components/UI/dashboard.tsx`
- camelCase for utilities/hooks: `src/hooks/useLogin.ts`
- kebab-case for data files: `src/data/mockDashboardCard.data.ts`

**Functions:**

- camelCase: `function toSafeUser()`, `function setField()`
- PascalCase for React components: `export function Dashboard()`, `export function useLogin()`

**Variables:**

- camelCase: `const [form, setForm]`, `const isLoading`, `const error`
- Prefix interfaces with descriptive name: `interface LoginForm`, `interface DashboardProps`

**Types:**

- Interface naming: `User`, `SafeUser`, `LoginDto`, `CreateUserDto`
- Type aliases for unions: `type SafeUser = Omit<User, 'user_password'>`

## Code Style

**Formatting:**

- Tool: Prettier (enforced via lint-staged in `package.json`)
- Config: Not explicitly present in root (uses default Prettier settings)
- ESLint runs with `--fix` before Prettier in pre-commit hook

**Linting:**

- Tool: ESLint 9.x with flat config (`eslint.config.js`)
- Extends: `@eslint/js`, `typescript-eslint`, `react-hooks`, `react-refresh`
- Strict mode enabled in TypeScript (`tsconfig.app.json`, `tsconfig.electron.json`)
- Rules enforced: noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch

**Indentation:** 2 spaces (default Prettier/ESLint for TypeScript)

## Import Organization

**Order:**

1. React/standard library imports: `import { useState } from 'react'`
2. External dependencies: `import bcrypt from 'bcryptjs'`
3. Internal modules (relative): `import { ... } from '../service/user.service.js'`
4. Path alias imports: `import { ... } from '@/components/...'`

**Path Aliases:**

- `@` alias configured in `vite.config.ts`: maps to `src/`
- Example: `import type { SafeUser } from '../types/electron-api'` (relative, not aliased)

**Extensions:**

- TypeScript files: `.ts`, `.tsx`
- Imports include `.js` extension for ESM compatibility in Electron (e.g., `'../service/user.service.js'`)

## Error Handling

**Strategy:** Return objects with success flag rather than throwing

**Patterns:**

```typescript
// Service layer returns typed response
export function login(dto: LoginDto): LoginResponse {
  if (!user) {
    return { success: false, message: 'Credenciales inválidas.' };
  }
  return { success: true, user: toSafeUser(user) };
}

// Frontend handles response
const response = await window.electronAPI.users.login(form);
if (!response.success || !response.user) {
  setError(response.message ?? 'No se pudo iniciar sesión.');
  return;
}
```

**Error Types:**

- Validation errors: Return `{ success: false, message: string }`
- Not found: Return `{ success: false, message: 'Usuario no encontrado.' }`
- Frontend catches exceptions: `catch (err) { const message = err instanceof Error ? err.message : String(err); }`

## Logging

**Framework:** Console (no structured logger)

**Patterns:**

- Migration success: `console.log('✓ Migration applied: ${name}')` in `electron/database/db.ts`
- Startup errors: `console.error('Failed to start Electron app:', err)` in `electron/main.ts`
- No production logging infrastructure

**When to Log:**

- Database migrations (informational)
- Fatal startup failures (error level via console.error)
- No runtime business logic logging

## Comments

**When to Comment:**

- Author attribution: `// @author AleLeonMarin` in `src/App.tsx`
- Section dividers: `// ─── Helpers ──────────────────────────────────────────────────────────────────`
- Complex logic: Fallback for legacy plaintext passwords explicitly documented

**JSDoc/TSDoc:**

- Not used in codebase
- No `@param`, `@returns` annotations
- Types are self-documenting via TypeScript interfaces

## Function Design

**Size:** Medium - functions typically 20-50 lines

**Parameters:**

- Use interfaces/DTOs for multiple params: `function login(dto: LoginDto)`
- Primitive params for single values: `function getUserById(id: number)`
- Avoid excessive parameter lists

**Return Values:**

- Explicit return types on all functions
- Union types for success/failure: `{ success: boolean; user?: SafeUser; message?: string }`
- Void for mutations: `function deactivateUser(id: number): number` (returns affected rows)

## Module Design

**Exports:**

- Named exports for services/repositories: `export function findUserById(...)`
- Named exports for React components: `export function Dashboard(...)`
- Default export for App entry point: `export default App;`

**Barrel Files:**

- Not used - each module imported directly via relative paths
- No index files to re-export from directories

---

_Convention analysis: 2026-04-08_
