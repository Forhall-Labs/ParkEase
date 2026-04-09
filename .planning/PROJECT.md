# Parqueo Parroquial San Marcos

## What This Is

A desktop parking management application built with Electron + React + TypeScript, designed for offline operation with local SQLite storage. It covers user/session management, vehicle entry and exit flows, tariff configuration, and operational reporting.

## Core Value

A simple, offline parking lot management system that handles vehicle tracking, automatic fee calculation with local currency rounding, and reporting capabilities for day-to-day operations.

## Requirements

### Validated

- ✓ USR-01, USR-02, USR-03, USR-04, USR-05: User lifecycle + authentication flow
- ✓ DASH-01, DASH-02, DASH-03: Dashboard occupancy/revenue/activity metrics
- ✓ VEHI-01, VEHI-02, VEHI-03, VEHI-04, VEHI-05, VEHI-06: Vehicle entry and validation
- ✓ PARA-01, PARA-02, PARA-03: Parameter configuration and persistence
- ✓ VEHI-07, VEHI-08, VEHI-09, VEHI-10, VEHI-11, VEHI-12, VEHI-13, VEHI-14: Exit, fee calculation, payment completion
- ✓ REPT-01, REPT-02, REPT-03, REPT-04, REPT-05, REPT-06: Daily/weekly/monthly/yearly reporting with totals and UI views

### Active

- [ ] No active v1 requirements pending.

### Out of Scope

- Cloud synchronization / multi-tenant access
- Multi-location parking management
- Public API integrations and online dependencies
- Mobile client application

## Context

**Technology Stack:**

- Frontend: React + TypeScript + Tailwind CSS
- Desktop: Electron (main, preload, renderer boundaries)
- Database: SQLite via better-sqlite3
- Build Tooling: Vite + TypeScript project references
- Quality Gate: ESLint + TypeScript build checks

**Plate Format Rules:**

- Regular vehicles: 3 letters + 3-4 digits (example: BNX-799)
- Motorcycles: MOT + 6 digits (example: MOT-123456)
- Light trucks: CL + 6 digits (example: CL-123456)

**Pricing Rules:**

- First hour: Uses configured rate from parameters
- After first hour: 10 colones per minute
- Rounding: Round up to nearest 50 colones (example: 820 -> 850)

## Constraints

- Offline-first local operation
- Local SQLite database as source of truth
- Desktop-first usage model
- Keep IPC contract typed between preload and renderer

## Key Decisions

| Decision | Rationale | Outcome |
| --- | --- | --- |
| SQLite for storage | File-based, low-operational overhead, offline-ready | Implemented |
| Electron architecture | Required desktop packaging and local process control | Implemented |
| Typed preload bridge | Prevent renderer/main contract drift | Implemented |
| Rolling report windows | Predictable period behavior from selected date | Implemented |
| Costa Rican rounding model | Local billing expectation | Implemented |

## Evolution

This document should evolve at phase transitions and milestone boundaries.

**During new milestone planning:**

1. Move newly approved items to Active.
2. Keep completed scope in Validated with requirement IDs.
3. Track architectural decisions that affect execution.
4. Update constraints if runtime or deployment assumptions change.

---

_Last updated: 2026-04-09 after v1 execution and planning artifact refresh_
