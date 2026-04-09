# Roadmap: Parqueo Parroquial San Marcos

**Created:** 2025-04-08
**Phases:** 4
**Requirements:** 32 (all v1)

## Phase Overview

| #   | Phase                       | Goal                                                                          | Requirements                                                                    | Success Criteria |
| --- | --------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------- |
| 1   | User Management & Dashboard | Complete user authentication system and enhance dashboard                     | USR-01, USR-02, USR-03, USR-04, USR-05, DASH-01, DASH-02, DASH-03               | 8 (Complete)     |
| 2   | Vehicle Entry & Parameters  | Implement vehicle registration with plate validation and parameter management | VEHI-01, VEHI-02, VEHI-03, VEHI-04, VEHI-05, VEHI-06, PARA-01, PARA-02, PARA-03 | 9 (Complete)     |
| 3   | Vehicle Exit & Payment      | 1/1 | Complete    | 2026-04-09 |
| 4   | Reports                     | Implement reporting system for daily, weekly, monthly, and yearly revenue     | REPT-01, REPT-02, REPT-03, REPT-04, REPT-05, REPT-06                            | 6                |

---

## Phase 3: Vehicle Exit & Payment

### Plans

- [x] 03-01-PLAN.md — Vehicle exit with fee calculation and checkout modal

---

## Phase 1: User Management & Dashboard

**Goal:** Complete user authentication system with full CRUD operations and enhance dashboard with real-time statistics.

### Requirements

- USR-01: User can create new user accounts with username and password
- USR-02: User can edit existing user account information
- USR-03: User can delete user accounts
- USR-04: User can authenticate with username and password
- USR-05: User session persists across application restarts
- DASH-01: Dashboard displays summary of current parked vehicles count
- DASH-02: Dashboard displays today's revenue total
- DASH-03: Dashboard displays total vehicles served today

### Success Criteria

1. User can create a new account with username (unique) and password
2. User can edit their own account details
3. Admin can delete user accounts
4. User can log in with valid credentials
5. Invalid login shows error message
6. Session persists after application restart
7. Dashboard shows accurate parked vehicles count
8. Dashboard shows today's revenue and vehicle count

### Notes

**UI hint:** yes

---

## Phase 2: Vehicle Entry & Parameters

**Goal:** Implement vehicle registration with Costa Rican plate format validation and parameter management.

### Requirements

- VEHI-01: User can register vehicle entry with Costa Rican plate format
- VEHI-02: System stores entry date and time automatically
- VEHI-03: User can enter owner name when registering vehicle
- VEHI-04: System sets vehicle status to "P" (Parked) upon entry
- VEHI-05: User can view list of all currently parked vehicles
- VEHI-06: System validates plate format based on vehicle type
- PARA-01: Hourly rate is stored in parameter table
- PARA-02: First hour cost is stored in parameter table
- PARA-03: User can view and edit parameter values

### Success Criteria (Complete)

1. User can register vehicle with BNX-799 format (regular vehicle)
2. User can register vehicle with MOT-123456 format (motorcycle)
3. User can register vehicle with CL-123456 format (light truck)
4. Entry time is automatically recorded
5. Owner name is captured and stored
6. Status is set to "P" upon entry
7. Parked vehicles list shows all active parkings
8. Invalid plate format shows validation error
9. Parameter values can be viewed and edited

### Notes

**UI hint:** yes

---

## Phase 3: Vehicle Exit & Payment

**Goal:** Implement exit processing with automatic fee calculation using Costa Rican rounding rules.

### Requirements

- VEHI-07: User can select parked vehicle to record exit
- VEHI-08: System records exit date and time automatically
- VEHI-09: System calculates parking duration (exit time - entry time)
- VEHI-10: System calculates parking fee using hourly rate for first hour
- VEHI-11: System calculates 10 colones per minute after first hour
- VEHI-12: System rounds total fee up to nearest 50 colones
- VEHI-13: User can view calculated fee before confirming exit
- VEHI-14: System updates vehicle status to reflect completed payment

### Success Criteria

1. User can select vehicle from parked list
2. Exit time is automatically recorded
3. Duration is calculated correctly
4. First hour uses hourly rate from parameters
5. Additional time uses 10 colones/minute rate
6. 820 colones rounds to 850
7. 970 colones rounds to 1000
8. User sees fee breakdown before payment
9. Status updates after payment

### Notes

**UI hint:** yes

---

## Phase 4: Reports

**Goal:** Implement reporting system for daily, weekly, monthly, and yearly revenue analysis.

### Requirements

- REPT-01: User can generate daily revenue reports
- REPT-02: User can generate weekly revenue reports
- REPT-03: User can generate monthly revenue reports
- REPT-04: User can generate yearly revenue reports
- REPT-05: Reports display date range, total vehicles, and total revenue
- REPT-06: Reports can be viewed in the application

### Success Criteria

1. Daily report shows all transactions for selected date
2. Weekly report aggregates 7 days of data
3. Monthly report shows full month summary
4. Yearly report shows annual overview
5. Each report shows total vehicles and total revenue
6. Reports are displayed in application UI

### Notes

**UI hint:** yes

---

_Roadmap created: 2025-04-08_
