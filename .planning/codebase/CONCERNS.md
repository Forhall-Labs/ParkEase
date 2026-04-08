# Codebase Concerns

**Analysis Date:** 2026-04-08

## Tech Debt

**Incomplete Feature - Mock Data in Production UI:**

- Issue: The dashboard displays hardcoded mock data instead of real database records
- Files: `src/components/vehiclesResumeTable.tsx`, `src/components/UI/dashboard.tsx`
- Impact: Application appears functional but has no real vehicle management
- Fix approach: Connect the IPC handlers to fetch real data from the database repositories

**Incomplete Feature - Dashboard Cards Panel:**

- Issue: DashboardCardsPanel component is passed to Layout but never rendered
- Files: `src/App.tsx` (line 36 passes asideContent, but Layout may not render it)
- Impact: Statistics panel is missing from the main view
- Fix approach: Verify Layout component renders the asideContent prop

**Typo in Filename:**

- Issue: Repository file has incorrect spelling
- Files: `electron/repositories/vehcile.repository.ts` should be `vehicle.repository.ts`
- Impact: Confusion and potential import errors
- Fix approach: Rename the file to correct spelling

**Incomplete Google Login Button:**

- Issue: Google login button exists in UI but has no functionality
- Files: `src/App.tsx` (lines 173-204)
- Impact: Dead UI element that confuses users
- Fix approach: Implement Google OAuth or remove the button

## Security Considerations

**Plain Text Password Fallback (Critical):**

- Risk: Legacy plain text password comparison still active in login flow
- Files: `electron/service/user.service.ts` (lines 73-83)
- Current mitigation: Falls back to plain text comparison if password isn't bcrypt hash
- Recommendations: Remove plain text fallback entirely after migrating all users to bcrypt

**Insecure Password Migration Pattern:**

- Risk: Successfully logging in with plain text auto-migrates to bcrypt without user confirmation
- Files: `electron/service/user.service.ts` (lines 78-81)
- Current mitigation: None
- Recommendations: Require explicit password reset or force migration on next login with proper auth

**No Rate Limiting on Authentication:**

- Risk: Login endpoint has no protection against brute force attacks
- Files: `electron/handlers/user.handler.ts`
- Current mitigation: None
- Recommendations: Add attempt tracking and lockout after N failed attempts

**No Password Complexity Validation:**

- Risk: Users can set weak passwords during registration
- Files: `electron/service/user.service.ts`
- Current mitigation: None
- Recommendations: Enforce minimum length and complexity requirements

## Known Bugs

**Dashboard Shows Empty/Static Data:**

- Symptoms: Table displays only mock data regardless of actual vehicle count
- Files: `src/components/vehiclesResumeTable.tsx`
- Trigger: Any interaction with the dashboard
- Workaround: None - backend has handlers but frontend uses mock data

**Parameter Table Unused:**

- Issue: psm_parameters table exists in database but pricing/tax uses hardcoded values
- Files: `electron/database/db.ts`, `electron/models/parameter.model.ts`
- Impact: Can't change pricing without code changes
- Fix approach: Integrate parameter service for dynamic pricing

## Performance Bottlenecks

**Missing Database Indexes:**

- Problem: Queries on veh_plate, veh_reference, user_username perform full table scans
- Files: `electron/repositories/vehcile.repository.ts`, `electron/repositories/user.repository.ts`
- Cause: No indexes on frequently queried unique columns
- Improvement path: Add CREATE INDEX statements in migration system

**No Pagination:**

- Problem: findAllVehicles returns all records without limit
- Files: `electron/repositories/vehcile.repository.ts`
- Cause: No pagination support
- Improvement path: Add limit/offset parameters to query methods

## Fragile Areas

**Dynamic SQL Generation:**

- Why fragile: updateVehicle and updateUser use dynamic field construction
- Files: `electron/repositories/vehcile.repository.ts` (lines 66-74), `electron/repositories/user.repository.ts` (lines 42-50)
- Safe modification: Ensure UpdateDto only contains allowed fields, validate against model
- Test coverage: Currently no tests exist

**Database Singleton:**

- Why fragile: Global db instance makes testing and concurrent access risky
- Files: `electron/database/db.ts`
- Safe modification: Use dependency injection for test databases
- Test coverage: No tests to verify database behavior

## Dependencies at Risk

**better-sqlite3:**

- Risk: Native module requires electron-rebuild; may break on OS updates
- Impact: Application won't start if native binding fails
- Migration plan: Consider pure JS alternatives like sql.js or abstract via repository pattern

## Missing Critical Features

**User Session Management:**

- Problem: No logout functionality; user persists in React state only
- Blocks: Can't switch users or securely end session

**Vehicle Actions Not Connected:**

- Problem: Delete, checkout, and reprint buttons have no handlers
- Blocks: Can't actually manage vehicles through the UI

**No Ticket/PDF Generation:**

- Problem: Reimpresión button exists but no printing service implemented
- Blocks: Physical ticket generation for customers

## Test Coverage Gaps

**No Tests Exist:**

- What's not tested: Entire application - no unit, integration, or E2E tests
- Files: All source files
- Risk: Any refactoring or changes could break functionality silently
- Priority: HIGH

---

_Concerns audit: 2026-04-08_
