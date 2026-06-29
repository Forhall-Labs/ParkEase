# ParkEase (Parqueo Parroquial San Marcos)

## What This Is

A desktop parking management application built with Electron + React + TypeScript, designed for offline operation with local SQLite storage. Named "ParkEase" with the full name "Parqueo Parroquial San Marcos". Covers user/session management, vehicle entry and exit flows, tariff configuration, and operational reporting.

## Core Value

A simple, offline parking lot management system that handles vehicle tracking, automatic fee calculation with local currency rounding, and reporting capabilities for day-to-day operations.

## Current State

**v1.1 shipped** — UX Refinement and Consistency milestone complete.

### What Shipped in v1.1

- Design tokens and reusable UI primitives
- Cross-screen visual consistency with Material 3 hierarchy
- Responsive layout hardening for narrow viewports
- Accessibility baseline (focus states, keyboard nav, reduced-motion)
- Light/dark theme parity
- Named tariff system with auto-fallback
- Desktop shell with fixed sidebar and centered content
- CI/CD pipeline with quality gates and draft releases

## Validated Requirements

| Milestone | Requirements                                                                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.0 MVP  | USR-01 to USR-05, VEHI-01 to VEHI-14, PARA-01 to PARA-03, REPT-01 to REPT-06, DASH-01 to DASH-03                                                   |
| v1.1      | TOKN-01, TOKN-02, UIX-01, UIX-02, UIX-03, RESP-01, RESP-02, ACC-01, ACC-02, THEM-01, THEM-02, RATE-01, RATE-02, CICD-01, CICD-02, CICD-03, CICD-04 |

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

| Decision                   | Rationale                                            | Outcome     |
| -------------------------- | ---------------------------------------------------- | ----------- |
| SQLite for storage         | File-based, low-operational overhead, offline-ready  | Implemented |
| Electron architecture      | Required desktop packaging and local process control | Implemented |
| Typed preload bridge       | Prevent renderer/main contract drift                 | Implemented |
| Rolling report windows     | Predictable period behavior from selected date       | Implemented |
| Costa Rican rounding model | Local billing expectation                            | Implemented |

## Evolution

This document should evolve at phase transitions and milestone boundaries.

**During new milestone planning:**

1. Move newly approved items to Active.
2. Keep completed scope in Validated with requirement IDs.
3. Track architectural decisions that affect execution.
4. Update constraints if runtime or deployment assumptions change.

---

_Last updated: 2026-04-11 after v1.1 milestone completion_
