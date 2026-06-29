# Phase 6: Cross-Screen Visual Consistency - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Alinear el lenguaje visual entre Dashboard, Vehiculos, Usuarios, Parametros/Configuracion y Reportes para que headers, cards/paneles y controles se comporten con patrones consistentes, y mejorar la escaneabilidad de la tabla de Reportes.

</domain>

<decisions>
## Implementation Decisions

### Patron de encabezados

- **D-01:** Todas las pantallas principales usan estructura base: titulo + subtitulo + acciones.
- **D-02:** La accion principal del encabezado se ubica a la derecha como regla de consistencia.
- **D-03:** Esta fase se implementa con enfoque desktop-first fijo (no optimizacion para movil dentro de este alcance).

### Densidad y superficies

- **D-04:** Estandar visual de densidad media balanceada para cards/paneles.
- **D-05:** Unificar borde, radio y sombra de superficies en todas las pantallas objetivo.
- **D-06:** Reusar primitives y tokens existentes (Phase 5) como base obligatoria para esa unificacion.

### Tabla de reportes (UIX-02)

- **D-07:** Prioridad visual en columnas Placa, Tarifa y Fechas (ingreso/salida).
- **D-08:** Aplicar patron fijo de legibilidad: encabezado sticky + zebra rows + hover suave.
- **D-09:** Mantener la mejora dentro de escaneabilidad visual, sin cambiar capacidades funcionales de reportes.

### Estandar de acciones

- **D-10:** Adoptar reglas de Material Design como directriz de consistencia de controles.
- **D-11:** Implementar jerarquia Material 3 tonal para acciones (Filled / Outlined / Text) con estados consistentes.

### the agent's Discretion

- Mapeo exacto de cada accion existente a variante Material 3 (por ejemplo, decidir que botones quedan Filled vs Outlined por contexto).
- Ajustes finos de espaciado/tipografia por pantalla, manteniendo D-01 a D-11.

</decisions>

<specifics>
## Specific Ideas

- Directriz explicita del usuario: la app debe mantenerse para uso de escritorio y no orientarse a flujo movil en esta fase.
- Directriz explicita del usuario: seguir Material Design y concretarlo en Material 3 tonal.

</specifics>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product scope and requirements

- `.planning/ROADMAP.md` - Goal and success criteria for Phase 6 (UIX-02, UIX-03).
- `.planning/REQUIREMENTS.md` - Requirement definitions for cross-screen consistency and reports readability.
- `.planning/PROJECT.md` - Milestone v1.1 UX objective and desktop-first constraints.
- `.planning/STATE.md` - Current milestone execution position.

### Prior locked context

- `.planning/phases/05-design-tokens-and-primitives/05-CONTEXT.md` - Locked token/primitives foundation to reuse in Phase 6.

### Existing implementation targets

- `src/components/UI/reports.tsx` - Current advanced visual baseline and report table behavior.
- `src/components/UI/users.tsx` - Users screen header/table/actions pattern needing alignment.
- `src/components/UI/dashboard.tsx` - Dashboard shell and cards panel entry points for consistency.
- `src/components/vehiclesResumeTable.tsx` - Vehicles table/modal/actions and control density patterns.
- `src/components/UI/settings.tsx` - Configuration/Parameters surface and actions style currently in use.

### Architecture/conventions guidance

- `.planning/codebase/CONVENTIONS.md` - Styling, typing, and implementation conventions.
- `.planning/codebase/STRUCTURE.md` - File placement and integration points.
- `.planning/codebase/STACK.md` - Active frontend stack (React + Tailwind + MUI dependencies).

### Design system guidance

- No local Material Design spec file is present in this repository.
- Apply Material 3 tonal hierarchy (Filled / Outlined / Text) as a locked decision from this phase discussion.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/components/primitives/*`: Button, Input, Card, SectionHeader, StatusBadge already available from Phase 5.
- `src/components/UI/reports.tsx`: existing canonical pattern for structured header + control shell + improved table readability.
- `src/components/dashboardCard.tsx`: reusable card style for side metrics panel.

### Established Patterns

- Theme variations are handled with `theme` prop and `isLight` branching per component.
- i18n labels are centralized via `t()` in `src/i18n.ts`.
- Screen modules in `src/components/UI/` contain most top-level layout patterns to standardize.

### Integration Points

- Cross-screen alignment work lands primarily in `src/components/UI/dashboard.tsx`, `src/components/UI/users.tsx`, `src/components/UI/settings.tsx`, `src/components/UI/reports.tsx`, and `src/components/vehiclesResumeTable.tsx`.
- App-level navigation shell in `src/layout/layout.tsx` must preserve compatibility while visual language is unified.

</code_context>

<deferred>
## Deferred Ideas

- Full responsive/mobile optimization remains out of this phase and belongs to responsive hardening work.

</deferred>

---

_Phase: 06-cross-screen-visual-consistency_
_Context gathered: 2026-04-09_
