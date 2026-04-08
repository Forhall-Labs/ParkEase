# Parqueo Parroquial San Marcos

## What This Is

A Windows desktop application for managing a parking lot. Built with Vite + Electron for Windows deployment, using SQLite for local data storage with no internet requirement. Users can manage vehicle entries/exits, calculate parking fees with Costa Rican pricing rules, and generate reports.

## Core Value

A simple, offline parking lot management system that handles vehicle tracking, automatic fee calculation with local currency rounding, and provides reporting capabilities.

## Requirements

### Validated

- ✓ User login system — existing
- ✓ Dashboard with summary display — existing

### Active

- [ ] USR-01: User can create, edit, and delete user accounts
- [ ] USR-02: User can authenticate with username and password
- [ ] VEHI-01: User can register vehicle entry with Costa Rican plate format
- [ ] VEHI-02: System stores entry date/time, owner name, and status "P" (Parked)
- [ ] VEHI-03: User can select parked vehicle and record exit
- [ ] VEHI-04: System calculates parking fee based on duration
- [ ] VEHI-05: Pricing uses 10 colones per minute after first hour
- [ ] VEHI-06: Hourly rate is stored in parameter table
- [ ] VEHI-07: Fee is rounded to next 50 colones (Costa Rican rounding)
- [ ] REPT-01: User can generate daily reports
- [ ] REPT-02: User can generate weekly reports
- [ ] REPT-03: User can generate monthly reports
- [ ] REPT-04: User can generate yearly reports

### Out of Scope

- Cloud/sync functionality — offline-only operation
- Multiple parking locations — single location
- API integrations — no external services
- Mobile app — Windows desktop only

## Context

**Technology Stack:**

- Frontend: React 19 + Vite + TypeScript
- Desktop: Electron 41
- Database: SQLite (better-sqlite3)
- UI: Material UI + TailwindCSS
- Build: electron-builder for Windows .exe

**Plate Format Rules:**

- Regular vehicles: 3 letters + 3-4 digits (e.g., BNX-799)
- Motorcycles: MOT + 6 digits (e.g., MOT-123456)
- Light trucks: CL + 6 digits (e.g., CL-123456)

**Pricing Rules:**

- First hour: Included in hourly rate from parameter table
- After first hour: 10 colones per minute
- Rounding: Round up to nearest 50 colones
  - 820 → 850
  - 970 → 1000

## Constraints

- **Tech**: Vite + Electron + SQLite — Already established in codebase
- **Platform**: Windows desktop only — No cross-platform requirement
- **Network**: Fully offline — No internet connectivity needed
- **Data**: Local SQLite storage — Single-user desktop application

## Key Decisions

| Decision             | Rationale                             | Outcome   |
| -------------------- | ------------------------------------- | --------- |
| SQLite for storage   | Simple, file-based, no setup required | — Pending |
| Electron for desktop | Required for Windows .exe deployment  | — Pending |
| Costa Rican rounding | Local currency convention             | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):

1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):

1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

_Last updated: 2025-04-08 after project initialization_
