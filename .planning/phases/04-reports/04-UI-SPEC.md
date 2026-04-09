---
phase: 04
slug: reports
status: approved
shadcn_initialized: false
preset: not applicable
created: 2026-04-09
---

# Phase 04 - UI Design Contract

> Visual and interaction contract for frontend phase 04 (Reports). This contract locks layout, typography, color, spacing, and copy behavior before planning/execution.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | Material UI + TailwindCSS utilities |
| Icon library | inline SVG (no external icon package) |
| Font | system sans stack (existing app baseline) |

---

## Screen Contract (Phase Decisions Binding)

- Dedicated Reports screen in sidebar navigation (not embedded in Dashboard or Vehicles).
- Report periods available in-view: daily, weekly, monthly, yearly.
- Daily default: selected date = today on first load.
- Period model: rolling windows anchored to selected date:
  - Daily: selected day
  - Weekly: selected day minus 6 days through selected day
  - Monthly: selected day minus 29 days through selected day
  - Yearly: selected day minus 364 days through selected day
- Every period must show both:
  - Summary metrics (date range, total vehicles, total revenue)
  - Detailed transaction rows for the period
- Empty state for any period with no rows:
  - Summary still rendered with totals at 0
  - Dedicated no-data message and next-step hint

---

## Spacing Scale

Declared values (all multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, compact badges |
| sm | 8px | Input internal spacing, stacked metadata |
| md | 16px | Default card/table section spacing |
| lg | 24px | Panel padding and section separation |
| xl | 32px | Primary block spacing between filter/summary/table |
| 2xl | 48px | Major screen spacing on desktop |
| 3xl | 64px | Page-level breathing room for large layouts |

Exceptions: none

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 14px | 400 | 1.5 |
| Label | 12px | 600 | 1.4 |
| Heading | 20px | 600 | 1.3 |
| Display | 32px | 600 | 1.2 |

Rules:
- Summary metric values use Display role.
- Table headers use Label role.
- Empty-state heading uses Heading role; helper text uses Body role.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | #020617 (dark) / #fafaf9 (light) | App background surfaces and page shell |
| Secondary (30%) | #0f172a (dark) / #f5f5f4 (light) | Cards, table containers, sidebar panels |
| Accent (10%) | #22d3ee | Active period selector, primary action, key metric highlights |
| Destructive | #f43f5e | Remove/reset destructive controls only |

Accent reserved for:
- Active period chip/tab
- Primary report action (refresh/generate)
- Highlighted metric emphasis

Never use accent for:
- Passive table borders
- Body text
- Generic backgrounds

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | "Actualizar reporte" |
| Empty state heading | "No hay transacciones para este periodo" |
| Empty state body | "Ajusta la fecha o vuelve a intentar cuando existan salidas registradas." |
| Error state | "No se pudo cargar el reporte. Verifica la fecha seleccionada e intenta de nuevo." |
| Destructive confirmation | "Limpiar filtros": "Esta accion restaurara el periodo por defecto." |

Language rule:
- Respect current app language setting (es/en); Spanish strings above are source-of-truth defaults.
- English translation must preserve intent, not word-by-word literalness.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not required |
| third-party registry | none | not applicable |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-04-09
