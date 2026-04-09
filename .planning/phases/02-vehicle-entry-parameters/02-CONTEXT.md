# Phase 2: Vehicle Entry & Parameters - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement vehicle registration with Costa Rican plate format validation and parameter management. User can register vehicle entry with plate validation, system stores entry date/time automatically, and parameter values can be configured for pricing.

VEHI-01 through VEHI-06, PARA-01 through PARA-03 are in scope. VEHI-07+ (exit/payment) is Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Plate Validation

- **D-01:** Validate plate format in real-time on blur — show error immediately if format doesn't match selected vehicle type
- **D-02:** Support three plate formats: BNX-799 (regular), MOT-123456 (motorcycle), CL-123456 (light truck)

### Vehicle Type Selection

- **D-03:** Auto-detect vehicle type from plate prefix — no manual selection needed
  - BNX, XYZ, ABC → Regular vehicle
  - MOT → Motorcycle
  - CL → Light truck

### Parameter UI

- **D-04:** Simple edit form with hourly rate and first hour cost fields
- **D-05:** Parameters stored in SQLite parameter table (already exists in schema)

### Default Rate Handling

- **D-06:** Show warning but allow entry with manual rate if no rate is configured
- **D-07:** Default fallback rate of 1000 CRC if nothing configured

### Reference Generation

- **D-08:** Auto-generate VEH-XXXXX reference (read-only, user can copy but not edit)
- **D-09:** Generate random 5-digit number: VEH-10000 to VEH-99999

### the agent's Discretion

- Exact validation error messages in Spanish/English
- Color scheme for validation error states
- Warning dialog styling for rate configuration

</decisions>

<specifics>
## Specific Ideas

- Plate validation pattern: `BNX-799` format for regular, `MOT-123456` for motorcycle, `CL-123456` for light truck
- Auto-detect from prefix: first 3 characters determine vehicle type

</specifics>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Vehicle Entry

- `src/components/vehiclesResumeTable.tsx` — Existing vehicle form UI
- `electron/models/vehicle.model.ts` — Vehicle data model

### Parameters

- `electron/models/parameter.model.ts` — Parameter data model
- `electron/repositories/parameter.repository.ts` — Parameter persistence

### i18n

- `src/i18n.ts` — Translation system for UI labels

[No external specs — requirements are fully captured in decisions above]

</canonical_refs>

td

## Existing Code Insights

### Reusable Assets

- `vehiclesResumeTable.tsx`: Already has vehicle entry form with plate, owner, reference fields
- `i18n.ts`: Translation system with ES/EN support already integrated

### Established Patterns

- Material UI + TailwindCSS for UI components
- SQLite database with repository pattern
- Electron IPC for main/renderer communication

### Integration Points

- Vehicle form in Dashboard → already connects to `window.electronAPI.vehicles.create()`
- Parameters form in UI/parameters.tsx → already connects to `window.electronAPI.parameters.*`

</code_context>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

_Phase: 02-vehicle-entry-parameters_
_Context gathered: 2026-04-08_
