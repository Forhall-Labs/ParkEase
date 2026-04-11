# Code Conventions

## Language & Formatting

- **TypeScript** - Strict typing enabled via tsconfig configurations
- **Formatter**: Prettier (^3.8.1) - Enforced via lint-staged and husky pre-commit hooks
- **Linting**: ESLint (^9.39.4) with React-specific plugins
- **Line Endings**: LF (Unix-style) - Standard for cross-platform consistency
- **Character Encoding**: UTF-8 (implied by modern tooling)

## Import Organization

- **Relative Paths**: Used for local imports (e.g., `../components/Button`)
- **Alias Imports**: Not observed - direct relative paths preferred
- **Order**:
  1. External packages (react, @mui/material, etc.)
  2. Internal absolute paths (not used)
  3. Relative paths (components, hooks, styles, types)
- **Type-only Imports**: Using `import type` when appropriate (modern TypeScript)

## Naming Conventions

### Files & Directories

- **Components**: PascalCase with `.tsx` extension (e.g., `Button.tsx`)
- **Utility/Hooks**: camelCase with `.ts` extension (e.g., `useLogin.ts`)
- **Styles**: camelCase or kebab-case with `.css` extension
- **Tests**: Not explicitly observed in structure
- **Config Files**: kebab-case or descriptive names (e.g., `vite.config.ts`)

### Variables & Functions

- **Variables**: camelCase (e.g., `isLoading`, `userData`)
- **Functions**: camelCase (e.g., `handleClick`, `fetchData`)
- **Constants**: UPPER_SNAKE_CASE (observed in some contexts)
- **Boolean Variables**: Prefixed with `is`, `has`, `should` (e.g., `isVisible`, `hasErrors`)

### Types & Interfaces

- **Types**: PascalCase (e.g., `UserType`, `VehicleData`)
- **Interfaces**: PascalCase with `I` prefix not used; direct naming (e.g., `User`, `Vehicle`)
- **Enums**: PascalCase (observed in MUI usage)
- **Generic Types**: Single uppercase letters (T, U, K, V) or descriptive (TData, TResponse)

### React Specific

- **Component Names**: PascalCase (e.g., `DashboardCard`, `Sidebar`)
- **Props**: camelCase (e.g., `onClick`, `isActive`)
- **Event Handlers**: Prefixed with `handle` or `on` (e.g., `handleClick`, `onSubmit`)
- **State Variables**: Often paired with setter (`[state, setState]`)
- **Custom Hooks**: Prefixed with `use` (e.g., `useLogin`, `useForm`)

## Code Style Patterns

### React Components

- **Function Components**: Preferred over class components
- **Arrow Functions**: Used for concise component definitions
- **Explicit Return Types**: Often omitted for components (inferred)
- **Fragment Usage**: `<>` and `</>` for wrapperless groups
- **Conditional Rendering**: Ternary operators and logical AND (`&&`)
- **List Keys**: Stable IDs used when mapping arrays

### TypeScript Usage

- **Strict Null Checks**: Enabled via tsconfig
- **Explicit Returns**: Function return types often specified
- **Object Typing**: Interfaces preferred for complex objects
- **Array Typing**: Explicit generic types (e.g., `Array<User>` or `User[]`)
- **Optional Properties**: `?` notation used judiciously
- **Union Types**: Used for props variants (especially with MUI components)

### Error Handling

- **Try/Catch**: Used in asynchronous operations (especially database)
- **Error Boundaries**: Not explicitly observed in React tree
- **Custom Error Types**: Not prominently used
- **Validation**: Input validation before database operations
- **User Feedback**: Error states shown in UI (implied from component structure)

### Async/Await

- **Preferred Pattern**: async/await over .then() chains
- **Error Handling**: Try/catch blocks around async operations
- **Loading States**: UI shows loading indicators during async ops

## Module Organization

### Feature Organization

- **Domain-based**: Features grouped by entity (users, vehicles, settings)
- **Horizontal Layering**: Components, hooks, styles separated by type
- **Barrel Exports**: `index.ts` files used for clean imports (primitives/)

### Separation of Concerns

- **UI vs Logic**: Components focused on presentation, hooks on logic
- **State Management**: Local component state vs custom hooks for shared state
- **Styling**: CSS modules or component-scoped styles preferred
- **Constants**: Not centralized; values often inline or in components

## Commenting Practices

- **JSDoc**: Used for complex functions and exports
- **TODO Comments**: Present for future work items
- **Inline Comments**: Used sparingly for clarification
- **License Headers**: Not observed in source files

## Configuration Conventions

### package.json Scripts

- **Build**: `npm run build` (lint + typecheck + vite build)
- **Dev**: `npm run dev` (vite dev server)
- **Preview**: `npm run preview` (vite preview)
- **Test**: `npm run test:ci` (custom test gate)
- **Lint**: `npm run lint` (eslint check)
- **Typecheck**: `npm run typecheck` (typescript check)
- **Win Build**: `npm run build:win` (electron builder for windows)

### Commit Messages

- **Conventional Commits**: Enforced via commitlint
- **Types**: feat, fix, docs, style, refactor, perf, test, chore, ci
- **Scopes**: Optional scope specification (e.g., `feat(auth): add login`)

## Security Practices

- **Environment Variables**: Not observed (desktop app doesn't use .env)
- **Secrets Management**: No secrets in codebase (local SQLite only)
- **Input Sanitization**: Implied validation before database operations
- **XSS Protection**: React's automatic escaping provides baseline protection

## Performance Considerations

- **Bundle Size**: Monitored implicitly through build process
- **Lazy Loading**: Not observed (small application size)
- **Memoization**: React.memo, useMemo, useCallback used where beneficial
- **Virtual Scrolling**: Not implemented for large lists (current data volume low)

## Testing Conventions

- **Test Framework**: Not explicitly configured in package.json
- **Test Files**: No `.test.*` or `*.test.*` files observed
- **Testing Approach**: CI test gate suggests integration/end-to-end testing focus
- **Mock Data**: Used in development (`src/data/` directory)
