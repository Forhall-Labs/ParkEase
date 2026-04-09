# Phase 2: Vehicle Entry & Parameters - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-08
**Phase:** 02-vehicle-entry-parameters
**Mode:** discuss
**Areas discussed:** Plate validation, Vehicle type selection, Parameter UI, Default rate handling, Reference generation

---

## Plate Validation

| Option              | Description                                                         | Selected |
| ------------------- | ------------------------------------------------------------------- | -------- |
| Real-time on blur   | Validate immediately on blur - show error if format doesn't match   | ✓        |
| On form submit      | Validate on submit - check all fields together, show errors in form |          |
| Auto-format on blur | Let user type freely, auto-format on blur                           |          |
| You decide          |                                                                     |          |

**User's choice:** Real-time on blur
**Notes:** User wants immediate feedback when plate format is invalid

---

## Vehicle Type Selection

| Option                  | Description                                                        | Selected |
| ----------------------- | ------------------------------------------------------------------ | -------- |
| Dropdown selection      | Show dropdown with Regular/Motorcycle/Light Truck options          |          |
| Auto-detect from prefix | Detect type from plate prefix (BNX, MOT, CL) - no selection needed | ✓        |
| Separate forms          | Separate tabs or forms for each vehicle type                       |          |
| You decide              |                                                                    |          |

**User's choice:** Auto-detect from prefix

---

## Parameter UI

| Option                   | Description                                                  | Selected |
| ------------------------ | ------------------------------------------------------------ | -------- |
| Simple edit form         | Simple edit form with hourly rate and first hour cost fields | ✓        |
| History with audit trail | History table showing past values with timestamps            |          |
| Change confirmation      | Show both current and proposed values, require confirmation  |          |
| You decide               |                                                              |          |

**User's choice:** Simple edit form (deferred to agent)

---

## Default Rate Handling

| Option                 | Description                                      | Selected |
| ---------------------- | ------------------------------------------------ | -------- |
| Fallback to 1000 CRC   | Use 1000 CRC as default if no rate is configured |          |
| Block until configured | Block vehicle entry until rate is configured     |          |
| Warning + manual entry | Show warning but allow entry with manual rate    | ✓        |
| You decide             |                                                  |          |

**User's choice:** Warning + manual entry
**Notes:** Allows flexibility for the operator

---

## Reference Generation

| Option                     | Description                                            | Selected |
| -------------------------- | ------------------------------------------------------ | -------- |
| Auto-generated (read-only) | Auto-generate VEH-XXXXX, user can copy but cannot edit | ✓        |
| Auto-generate with edit    | Generate VEH-XXXXX as default, allow user to edit      |          |
| Manual entry required      | User must enter reference manually                     |          |
| You decide                 |                                                        |          |

**User's choice:** Auto-generated (read-only)

---

## the agent's Discretion

Areas where user said "you decide" or deferred to the agent:

- Parameter UI: Exact styling and layout details
- Validation error messages: Specific text in Spanish/English
- Warning dialog: Color scheme and styling
