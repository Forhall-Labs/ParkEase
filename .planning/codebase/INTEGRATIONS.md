# External Integrations

## Database

- **SQLite** via better-sqlite3 package
  - Local file-based database stored in `%APPDATA%/parqueo-parroquial-san-marcos/psm.db` on Windows
  - No external database server required - embedded solution
  - Tables and schema managed through electron repository layer

## Authentication System

- **Custom authentication** - No third-party auth providers
  - Password-based login with bcryptjs hashing
  - Session management through electron main process
  - User roles and permissions handled internally

## Communication & APIs

- **No external REST APIs** - Application is self-contained
  - All data operations happen locally via SQLite
  - No integration with external services for core functionality
  - No webhook integrations

## File System & OS Integration

- **Node.js filesystem access** through Electron
  - App data storage in platform-appropriate locations:
    - Windows: `%APPDATA%/parqueo-parroquial-san-marcos/`
    - macOS: `$HOME/Library/Application Support/parqueo-parroquial-san-marcos/`
    - Linux: `$HOME/.config/parqueo-parroquial-san-marcos/`
  - Electron main process handles file operations and system interactions

## Development & CI/CD Integrations

- **GitHub Actions** - CI/CD pipeline
  - Automated testing on push and pull requests
  - Release automation on version tags
  - Node 22 environment for builds
  - Quality gate enforcement through `npm run ci:verify`
- **npm** - Package management
  - Dependency management and script execution
  - Lockfile-based reproducible builds
- **Electron Builder** - Application packaging
  - Creates Windows installers (.exe) and portable versions (.zip)
  - Configured to avoid implicit publishing
  - Generates draft releases on version tags

## Testing Integrations

- **CI Test Gate** - Custom testing script
  - `scripts/ci-test-gate.mjs` - Custom test validation script
  - Integrated into `npm run ci:verify` and `npm run test:ci`
  - Ensures quality standards before allowing releases

## Internationalization

- **Basic i18n setup** - Limited internationalization support
  - `src/i18n.ts` - Translation file
  - Appears to be foundational but may not be fully implemented

## Missing Integrations

Notable absence of:

- Cloud storage or backup solutions
- Telemetry or analytics services
- Error reporting integrations (Sentry, etc.)
- External notification services (email, SMS)
- Third-party UI component libraries beyond MUI
- Advanced state management solutions (Redux, Zustand, etc.)
