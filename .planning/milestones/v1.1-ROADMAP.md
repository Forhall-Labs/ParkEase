# Roadmap: Parqueo Parroquial San Marcos

**Created:** 2025-04-08
**Last Updated:** 2026-04-11
**Milestone:** v1.1 UX Refinement and Consistency
**Active Phases:** 6
**v1.1 Requirements:** 11

## Milestones

- Complete: v1.0 MVP (Phases 1-4)
- In progress: v1.1 UX Refinement and Consistency (Phases 5-9)

## Phases

- [ ] **Phase 5: Design Tokens and Primitives** - Define semantic tokens and reusable UI building blocks for the milestone screens.
- [ ] **Phase 6: Cross-Screen Visual Consistency** - Align headers, cards, controls, and reports table readability across primary views.
- [ ] **Phase 7: Responsive Layout Hardening** - Ensure key screens and controls adapt without overlap, clipping, or broken interactions.
- [ ] **Phase 8: Accessibility Baseline** - Deliver clear focus visibility and keyboard-first usability with reduced-motion support.
- [ ] **Phase 9: Theme Quality Parity** - Raise light-mode quality and contrast parity with dark mode on key screens.

## Phase Details

### Phase 5: Design Tokens and Primitives

**Goal**: A shared UI foundation exists so milestone screens use consistent semantics for spacing, color, radius, and type.
**Depends on**: Phase 4
**Requirements**: TOKN-01, TOKN-02
**Success Criteria** (what must be TRUE): 1. Semantic tokens for color, spacing, radius, and typography are defined and referenced in the codebase. 2. Primary milestone screens consume reusable primitives instead of ad-hoc local styling for repeated UI patterns. 3. New UI work in milestone scope can be composed from shared primitives without visual regression.
**Plans**: 2 plans

- [x] 05-01-PLAN.md - Semantic token foundation and token-backed primitive CSS layer
- [x] 05-02-PLAN.md - Reusable primitive components and adoption proof in Reports + Dashboard
      **UI hint**: yes

### Phase 6: Cross-Screen Visual Consistency

**Goal**: Primary screens present a consistent visual language and reports table content is easier to scan.
**Depends on**: Phase 5
**Requirements**: UIX-02, UIX-03
**Success Criteria** (what must be TRUE): 1. Dashboard, Vehicles, Users, Parameters, and Reports share consistent header, card, and control treatment. 2. Reports transaction table hierarchy makes row content and key values readable at a glance. 3. Spacing and control alignment are uniform across the main sections of each primary view.
**Plans**: 2 plans

- [ ] 06-01-PLAN.md - Base visual contracts for header/actions and reports table scanability
- [ ] 06-02-PLAN.md - Cross-screen alignment for Dashboard, Vehicles, Users, and Settings with visual verification
      **UI hint**: yes

### Phase 7: Responsive Layout Hardening

**Goal**: Reports and primary screens remain usable on narrow viewports with intentional overflow behavior.
**Depends on**: Phase 6
**Requirements**: UIX-01, RESP-01, RESP-02
**Success Criteria** (what must be TRUE): 1. Reports filters and action controls do not overlap at supported breakpoints. 2. Primary screens retain core interactions on narrow widths without clipped key actions. 3. Wide tables use intentional horizontal scrolling and preserve readable column labels.
**Plans**: TBD
**UI hint**: yes

### Phase 8: Accessibility Baseline

**Goal**: Primary user flows are keyboard-usable and expose clear interaction feedback for focus and motion preferences.
**Depends on**: Phase 7
**Requirements**: ACC-01, ACC-02
**Success Criteria** (what must be TRUE): 1. Interactive controls in primary views display clear focus-visible states. 2. Key flows can be completed by keyboard navigation without pointer-only steps. 3. Motion-heavy interactions respect reduced-motion preferences.
**Plans**: 2 plans

- [x] 08-01-PLAN.md — Focus visibility + keyboard handlers in Dropdown/Accordion primitives
- [x] 08-02-PLAN.md — Reduced-motion for transforms + skip-to-content link
      **Status**: Complete ✓
      **UI hint**: yes

### Phase 9: Theme Quality Parity

**Goal**: Light and dark themes provide comparable readability and visual quality across key screens.
**Depends on**: Phase 8
**Requirements**: THEM-01, THEM-02
**Success Criteria** (what must be TRUE): 1. Light theme quality on key screens is visually consistent and polished relative to dark theme. 2. Text, surfaces, and interactive states maintain readable contrast in both themes. 3. Theme switching does not degrade spacing, hierarchy, or control clarity on key screens.
**Plans**: 2 plans

- [x] 09-01-PLAN.md — Token parity audit, light theme fixes, surface elevation with shadows
- [x] 09-02-PLAN.md — Primitive component token verification, DashboardCard improvements
      **UI hint**: yes

## Progress

| Phase                              | Plans Complete | Status   | Completed |
| ---------------------------------- | -------------- | -------- | --------- |
| 5. Design Tokens and Primitives    | 2/2            | Complete | ✓         |
| 6. Cross-Screen Visual Consistency | 2/2            | Complete | ✓         |
| 7. Responsive Layout Hardening     | 2/2            | Complete | ✓         |
| 8. Accessibility Baseline          | 2/2            | Complete | ✓         |
| 9. Theme Quality Parity            | 2/2            | Complete | ✓         |
| 10. Rate Management                | 2/2            | Complete | ✓         |
| 11. Layout                         | 2/2            | Complete | ✓         |
| 12. CI/CD                          | 2/2            | Complete | ✓         |
| 13. Documentation Fix              | 1/1 | Complete    | 2026-04-11 |

### Phase 10: quiero que agregues una fase para poder editar como se manejan los parametros, los parametros ahora deben de tener la opcion de poner por ejemplo, tarifa moto cuesta 600 colones, y cuando se ingresa un vehiculo poder seleccionar la tarifa que debamos usar

**Goal:** Configuración gestiona tarifas nombradas con una tarifa general única y el ingreso de vehículos permite seleccionar tarifa manual con fallback automático a la general.
**Requirements**: RATE-01, RATE-02
**Depends on:** Phase 9
**Plans:** 2 plans

Plans:

- [x] 10-01-PLAN.md — Modelo/IPC/migración para tarifas nombradas con default único y sin eliminación
- [x] 10-02-PLAN.md — UX de tarifas en Configuración + selección/fallback de tarifa en ingreso de vehículo

### Phase 11: layout

**Goal:** El shell global de escritorio mantiene sidebar fija, header con scroll natural y un ancho maximo de contenido consistente en las pantallas principales.
**Requirements**: UIX-03
**Depends on:** Phase 10
**Plans:** 2 plans

Plans:

- [ ] 11-01-PLAN.md — Shell global con sidebar fija, header no sticky y contrato de ancho maximo unificado
- [ ] 11-02-PLAN.md — Alineacion de pantallas principales al contrato de layout y verificacion visual integral

### Phase 12: CI/CD

**Goal:** Flujo CI/CD garantiza calidad bloqueante antes de merge y publica releases draft de Windows con instalador y portable zip por tags de versión.
**Requirements**: CICD-01, CICD-02, CICD-03, CICD-04
**Depends on:** Phase 11
**Plans:** 2 plans

Plans:

- [x] 12-01-PLAN.md — Gate de CI publicable (lint+tsc+build+test contract) y alineación de pre-push Husky
- [x] 12-02-PLAN.md — Release draft por tags con .exe + portable.zip, auto-asignación PR no bloqueante y runbook de branch protection

### Phase 13: Documentation Fix

**Goal:** Add missing VERIFICATION.md files and fix SUMMARY.md frontmatter for v1.1 phases.
**Depends on:** Phase 12
**Plans:** 1/1 plans complete

Plans:

- [x] 13-01-PLAN.md — Add VERIFICATION.md files and fix requirements_completed frontmatter

---

_Roadmap updated: 2026-04-09 for milestone v1.1_
