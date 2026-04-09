# Requirements: Parqueo Parroquial San Marcos

**Defined:** 2025-04-08
**Last Updated:** 2026-04-09
**Core Value:** A simple, offline parking lot management system that handles vehicle tracking, automatic fee calculation with local currency rounding, and reporting capabilities.

## Validated Baseline (v1.0)

- [x] **USR-01** to **USR-05**: User management and authentication
- [x] **VEHI-01** to **VEHI-06**: Vehicle entry and validation
- [x] **VEHI-07** to **VEHI-14**: Vehicle exit, fee calculation, and payment completion
- [x] **PARA-01** to **PARA-03**: Parameter management
- [x] **REPT-01** to **REPT-06**: Revenue reporting in-app
- [x] **DASH-01** to **DASH-03**: Dashboard operational indicators

## Milestone v1.1 Requirements

### Visual Consistency

- [ ] **UIX-01**: Reports filters and action controls maintain non-overlapping layout across supported breakpoints.
- [ ] **UIX-02**: Reports transaction table readability is improved with clearer hierarchy, spacing, and scanability.
- [ ] **UIX-03**: Dashboard, Vehicles, Users, Parameters, and Reports share consistent UI patterns for headers, cards, and controls.

### Accessibility

- [ ] **ACC-01**: Interactive controls expose clear focus-visible states in all primary views.
- [ ] **ACC-02**: Key user flows support keyboard navigation and honor reduced-motion preference.

### Responsive Hardening

- [ ] **RESP-01**: Primary screens adapt cleanly to narrow viewports without breaking core interactions.
- [ ] **RESP-02**: Critical controls avoid clipping/overflow; wide data tables use intentional horizontal scroll behavior.

### Design Tokens and Reusability

- [ ] **TOKN-01**: Semantic design tokens are defined for color, spacing, radius, and typography.
- [ ] **TOKN-02**: Reusable UI primitives/components are applied in primary milestone screens.

### Theming

- [ ] **THEM-01**: Light theme visual quality reaches parity with dark theme on key screens.
- [ ] **THEM-02**: Theme contrast and readability meet baseline quality in both light and dark modes.

### CI/CD

- [ ] **CICD-01**: Pull requests and pushes to `main`/`dev` run a blocking CI quality gate with lint, type-check, build, and formal tests contract.
- [ ] **CICD-02**: Local Husky pre-push remains mandatory and aligned with the same CI publishability gate.
- [ ] **CICD-03**: Tags `v*` trigger Windows CD draft releases on GitHub with installer `.exe` and portable `.zip` assets.
- [ ] **CICD-04**: Main branch merge governance requires approved PR flow, with PR assignment automation attempted and non-blocking human fallback.

## Future Requirements

- **REPT-07**: Reports can be exported to PDF.
- **REPT-08**: Reports can be printed.
- **VEHI-15**: User can view history of all vehicle transactions.
- **VEHI-16**: User can search vehicles by plate number.

## Out of Scope (v1.1)

| Feature                   | Reason                                    |
| ------------------------- | ----------------------------------------- |
| Cloud sync                | Offline-first operation remains required  |
| Multi-location management | Current deployment is single-site         |
| Public API integrations   | Not needed for this milestone             |
| Mobile app                | Desktop-first delivery remains the target |

## Traceability

| Requirement | Phase    | Status  |
| ----------- | -------- | ------- |
| UIX-01      | Phase 7  | Planned |
| UIX-02      | Phase 6  | Planned |
| UIX-03      | Phase 6  | Planned |
| ACC-01      | Phase 8  | Planned |
| ACC-02      | Phase 8  | Planned |
| RESP-01     | Phase 7  | Planned |
| RESP-02     | Phase 7  | Planned |
| TOKN-01     | Phase 5  | Planned |
| TOKN-02     | Phase 5  | Planned |
| THEM-01     | Phase 9  | Planned |
| THEM-02     | Phase 9  | Planned |
| CICD-01     | Phase 12 | Planned |
| CICD-02     | Phase 12 | Planned |
| CICD-03     | Phase 12 | Planned |
| CICD-04     | Phase 12 | Planned |

---

_Requirements updated: 2026-04-09 for milestone v1.1_
