# Roadmap: Parqueo Parroquial San Marcos

**Created:** 2025-04-08
**Last Updated:** 2026-04-09
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
**Plans**: TBD
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
**Plans**: TBD
**UI hint**: yes

### Phase 9: Theme Quality Parity

**Goal**: Light and dark themes provide comparable readability and visual quality across key screens.
**Depends on**: Phase 8
**Requirements**: THEM-01, THEM-02
**Success Criteria** (what must be TRUE): 1. Light theme quality on key screens is visually consistent and polished relative to dark theme. 2. Text, surfaces, and interactive states maintain readable contrast in both themes. 3. Theme switching does not degrade spacing, hierarchy, or control clarity on key screens.
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase                              | Plans Complete | Status      | Completed |
| ---------------------------------- | -------------- | ----------- | --------- |
| 5. Design Tokens and Primitives    | 0/2            | Planned     | -         |
| 6. Cross-Screen Visual Consistency | 0/0            | Not started | -         |
| 7. Responsive Layout Hardening     | 0/0            | Not started | -         |
| 8. Accessibility Baseline          | 0/0            | Not started | -         |
| 9. Theme Quality Parity            | 0/0            | Not started | -         |

### Phase 10: quiero que agregues una fase para poder editar como se manejan los parametros, los parametros ahora deben de tener la opcion de poner por ejemplo, tarifa moto cuesta 600 colones, y cuando se ingresa un vehiculo poder seleccionar la tarifa que debamos usar

**Goal:** Configuración gestiona tarifas nombradas con una tarifa general única y el ingreso de vehículos permite seleccionar tarifa manual con fallback automático a la general.
**Requirements**: RATE-01, RATE-02
**Depends on:** Phase 9
**Plans:** 2 plans

Plans:

- [ ] 10-01-PLAN.md — Modelo/IPC/migración para tarifas nombradas con default único y sin eliminación
- [ ] 10-02-PLAN.md — UX de tarifas en Configuración + selección/fallback de tarifa en ingreso de vehículo

---

_Roadmap updated: 2026-04-09 for milestone v1.1_
