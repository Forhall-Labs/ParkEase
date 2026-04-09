# Roadmap: Parqueo Parroquial San Marcos

**Created:** 2025-04-08
**Last Updated:** 2026-04-09
**Phases:** 4
**Requirements:** 32 (v1)

## Phase Overview

| # | Phase | Goal | Requirements | Plans | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | User Management & Dashboard | Complete user authentication system and enhance dashboard | USR-01, USR-02, USR-03, USR-04, USR-05, DASH-01, DASH-02, DASH-03 | 2/2 | Complete |
| 2 | Vehicle Entry & Parameters | Implement vehicle registration with plate validation and parameter management | VEHI-01, VEHI-02, VEHI-03, VEHI-04, VEHI-05, VEHI-06, PARA-01, PARA-02, PARA-03 | 2/2 | Complete |
| 3 | Vehicle Exit & Payment | Implement exit processing with automatic fee calculation and payment completion | VEHI-07, VEHI-08, VEHI-09, VEHI-10, VEHI-11, VEHI-12, VEHI-13, VEHI-14 | 1/1 | Complete |
| 4 | Reports | Implement reporting system for daily, weekly, monthly, and yearly revenue analysis | REPT-01, REPT-02, REPT-03, REPT-04, REPT-05, REPT-06 | 2/2 | Complete |

---

## Phase 1: User Management & Dashboard

**Goal:** Complete user authentication system with full CRUD operations and dashboard statistics.

### Plans

- [x] 01-01-PLAN.md - User management and authentication implementation
- [x] 01-02-PLAN.md - Dashboard metrics and UI integration

### Success Criteria

1. User CRUD implemented and functional.
2. Authentication works with persisted session behavior.
3. Dashboard shows parked vehicles, daily revenue, and served count.

---

## Phase 2: Vehicle Entry & Parameters

**Goal:** Implement vehicle registration with Costa Rican plate validation and parameter management.

### Plans

- [x] 02-01-PLAN.md - Vehicle entry, validation, and persistence
- [x] 02-02-PLAN.md - Parameter management and configuration screens

### Success Criteria

1. Vehicle entry supports required plate formats.
2. Entry metadata is stored correctly with parked status.
3. Parameters can be viewed and updated.

---

## Phase 3: Vehicle Exit & Payment

**Goal:** Implement exit processing with automatic fee calculation using Costa Rican rounding rules.

### Plans

- [x] 03-01-PLAN.md - Vehicle exit with fee calculation and checkout flow

### Success Criteria

1. Exit time and duration are calculated correctly.
2. Fee calculation applies hourly and per-minute rules.
3. Total rounds up to nearest 50 colones.
4. User confirms payment and vehicle status is updated.

---

## Phase 4: Reports

**Goal:** Implement reporting system for daily, weekly, monthly, and yearly revenue analysis.

### Plans

- [x] 04-01-PLAN.md - Backend report query logic, rolling-window period rules, and typed IPC contract
- [x] 04-02-PLAN.md - Dedicated reports UI, navigation wiring, and in-app report rendering states

### Success Criteria

1. Daily, weekly, monthly, and yearly report generation works.
2. Reports display date range, vehicles count, and revenue total.
3. Reports are available in the application UI with navigation entry.

---

## Current Milestone Status

- Milestone v1.0 scope is implemented across all planned phases.
- Planning artifacts were refreshed on 2026-04-09, including `.planning/codebase/` mapping.
- Next milestone planning can start from current state without additional backfill.

---

_Roadmap updated: 2026-04-09_
