# Requirements: Parqueo Parroquial San Marcos

**Defined:** 2025-04-08
**Core Value:** A simple, offline parking lot management system that handles vehicle tracking, automatic fee calculation with local currency rounding, and provides reporting capabilities.

## v1 Requirements

### User Management

- [x] **USR-01**: User can create new user accounts with username and password
- [x] **USR-02**: User can edit existing user account information
- [x] **USR-03**: User can delete user accounts
- [x] **USR-04**: User can authenticate with username and password
- [x] **USR-05**: User session persists across application restarts

### Vehicle Entry

- [x] **VEHI-01**: User can register vehicle entry with Costa Rican plate format (BNX-799 for regular, MOT-123456 for motorcycle, CL-123456 for light truck)
- [x] **VEHI-02**: System stores entry date and time automatically
- [x] **VEHI-03**: User can enter owner name when registering vehicle
- [x] **VEHI-04**: System sets vehicle status to "P" (Parked) upon entry
- [x] **VEHI-05**: User can view list of all currently parked vehicles
- [x] **VEHI-06**: System validates plate format based on vehicle type

### Vehicle Exit & Payment

- [ ] **VEHI-07**: User can select parked vehicle to record exit
- [ ] **VEHI-08**: System records exit date and time automatically
- [ ] **VEHI-09**: System calculates parking duration (exit time - entry time)
- [ ] **VEHI-10**: System calculates parking fee using hourly rate from parameter table for first hour
- [ ] **VEHI-11**: System calculates additional fee at 10 colones per minute after first hour
- [ ] **VEHI-12**: System rounds total fee up to nearest 50 colones (Costa Rican rounding: 820→850, 970→1000)
- [ ] **VEHI-13**: User can view calculated fee before confirming exit
- [ ] **VEHI-14**: System updates vehicle status to reflect completed payment

### Parameters

- [x] **PARA-01**: Hourly rate is stored in parameter table and can be configured
- [x] **PARA-02**: First hour cost is stored in parameter table and can be configured
- [x] **PARA-03**: User can view and edit parameter values

### Reports

- [ ] **REPT-01**: User can generate daily revenue reports showing vehicles served and total income
- [ ] **REPT-02**: User can generate weekly revenue reports
- [ ] **REPT-03**: User can generate monthly revenue reports
- [ ] **REPT-04**: User can generate yearly revenue reports
- [ ] **REPT-05**: Reports display date range, total vehicles, and total revenue
- [ ] **REPT-06**: Reports can be viewed in the application

### Dashboard

- [x] **DASH-01**: Dashboard displays summary of current parked vehicles count
- [x] **DASH-02**: Dashboard displays today's revenue total
- [x] **DASH-03**: Dashboard displays total vehicles served today

## v2 Requirements

### Reports

- **REPT-07**: Reports can be exported to PDF
- **REPT-08**: Reports can be printed

### Vehicle Management

- **VEHI-15**: User can view history of all vehicle transactions
- **VEHI-16**: User can search vehicles by plate number

## Out of Scope

| Feature                    | Reason                          |
| -------------------------- | ------------------------------- |
| Cloud sync                 | Offline-only operation required |
| Multiple parking locations | Single location parking lot     |
| API integrations           | No external services needed     |
| Mobile app                 | Windows desktop only            |
| Real-time notifications    | Not required for v1             |
| QR code scanning           | Manual plate entry sufficient   |

## Traceability

| Requirement | Phase   | Status   |
| ----------- | ------- | -------- |
| USR-01      | Phase 1 | Complete |
| USR-02      | Phase 1 | Complete |
| USR-03      | Phase 1 | Complete |
| USR-04      | Phase 1 | Complete |
| USR-05      | Phase 1 | Complete |
| VEHI-01     | Phase 2 | Complete |
| VEHI-02     | Phase 2 | Complete |
| VEHI-03     | Phase 2 | Complete |
| VEHI-04     | Phase 2 | Complete |
| VEHI-05     | Phase 2 | Complete |
| VEHI-06     | Phase 2 | Complete |
| VEHI-07     | Phase 3 | Pending  |
| VEHI-08     | Phase 3 | Pending  |
| VEHI-09     | Phase 3 | Pending  |
| VEHI-10     | Phase 3 | Pending  |
| VEHI-11     | Phase 3 | Pending  |
| VEHI-12     | Phase 3 | Pending  |
| VEHI-13     | Phase 3 | Pending  |
| VEHI-14     | Phase 3 | Pending  |
| PARA-01     | Phase 2 | Complete |
| PARA-02     | Phase 2 | Complete |
| PARA-03     | Phase 2 | Complete |
| REPT-01     | Phase 4 | Pending  |
| REPT-02     | Phase 4 | Pending  |
| REPT-03     | Phase 4 | Pending  |
| REPT-04     | Phase 4 | Pending  |
| REPT-05     | Phase 4 | Pending  |
| REPT-06     | Phase 4 | Pending  |
| DASH-01     | Phase 1 | Complete |
| DASH-02     | Phase 1 | Complete |
| DASH-03     | Phase 1 | Complete |

**Coverage:**

- v1 requirements: 32 total
- Mapped to phases: 32
- Unmapped: 0 ✓

---

_Requirements defined: 2025-04-08_
_Last updated: 2025-04-08 after initial definition_
