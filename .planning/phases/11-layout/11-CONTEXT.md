# Phase 11: layout - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Definir y aplicar la estructura global de layout para toda la app de escritorio, incluyendo distribucion base de sidebar, header y contenido principal, con reglas de ancho y presencia de panel lateral opcional.

</domain>

<decisions>
## Implementation Decisions

### Estructura base global

- **D-01:** El layout global usa Sidebar fija + header + contenido principal.
- **D-02:** La navegacion lateral permanece visible y fija como referencia primaria en flujo de escritorio.

### Panel lateral de apoyo

- **D-03:** El panel lateral de metricas/cards se mantiene como columna opcional (no obligatoria en todas las pantallas).
- **D-04:** El contenido principal conserva prioridad; el aside se muestra solo cuando el modulo lo requiere.

### Comportamiento de scroll

- **D-05:** Solo la sidebar permanece fija durante scroll en pantallas largas.
- **D-06:** El header no se fija globalmente (scrollea con el contenido).

### Ancho y contencion del contenido

- **D-07:** Se adopta un ancho maximo estandar unificado para el contenido principal en todas las pantallas.
- **D-08:** La consistencia de ancho se aplica a Dashboard, Vehiculos, Usuarios, Configuracion y Reportes.

### the agent's Discretion

- Valor exacto del `max-width` global y puntos de ajuste fino para evitar clipping en tablas sin romper la decision de ancho unificado.
- Ajuste tecnico del grid principal para mantener sidebar fija + aside opcional sin regresiones visuales.

</decisions>

<specifics>
## Specific Ideas

- Direccion explicita del usuario: mantener patron de app escritorio con sidebar fija y no cambiar a navegacion tipo tabs.
- Direccion explicita del usuario: mantener aside de metricas como opcion reusable, no como bloque obligatorio en todas las vistas.

</specifics>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product scope and constraints

- `.planning/ROADMAP.md` - Phase 11 definition (`layout`) and dependency after Phase 10.
- `.planning/PROJECT.md` - Desktop-first constraint and milestone UX direction.
- `.planning/REQUIREMENTS.md` - Milestone UX requirements that layout must support indirectly.
- `.planning/STATE.md` - Current project position and roadmap evolution.

### Prior locked decisions

- `.planning/phases/06-cross-screen-visual-consistency/06-CONTEXT.md` - Existing visual consistency decisions to preserve while restructuring layout.
- `.planning/phases/10-quiero-que-agregues-una-fase-para-poder-editar-como-se-manej/10-CONTEXT.md` - Recent UI flow changes in Settings/Vehicles that must remain compatible with new global layout.

### Current layout implementation

- `src/layout/layout.tsx` - Main shell with sidebar, header card, content area and optional aside.
- `src/components/UI/sidebar.tsx` - Sidebar visual/structural behavior and fixed-column pattern.
- `src/App.tsx` - Screen routing and `asideContent` usage contract.
- `src/index.css` - Global root sizing and overflow baseline.

### Codebase guidance

- `.planning/codebase/CONVENTIONS.md` - Styling and component conventions.
- `.planning/codebase/STRUCTURE.md` - File placement and integration points.
- `.planning/codebase/STACK.md` - Active stack constraints (React + Tailwind + Electron desktop runtime).

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/layout/layout.tsx`: already centralizes global shell and supports `asideContent` as optional right column.
- `src/components/UI/sidebar.tsx`: encapsulates navigation panel and can remain fixed without changing screen components.
- `src/components/primitives/*`: established UI primitives from previous phases that can keep visual consistency after layout adjustments.

### Established Patterns

- Desktop-first operation is a core project constraint and already reflected in current shell composition.
- Screen content is injected through `Layout` children from `src/App.tsx`, so global layout changes can be centralized.
- Theme handling is shared via `theme` prop and must remain intact after layout restructuring.

### Integration Points

- `src/layout/layout.tsx` is the primary integration point for fixed sidebar behavior, header scrolling behavior, and unified content max width.
- `src/App.tsx` controls where `asideContent` appears; it must remain compatible with optional-aside decision.
- Major screens (`src/components/UI/*.tsx` and `src/components/vehiclesResumeTable.tsx`) must conform to the new global width contract.

</code_context>

<deferred>
## Deferred Ideas

- Deep responsive/mobile layout adaptation is deferred (belongs to responsive-focused work, not this scoped desktop layout phase).

</deferred>

---

_Phase: 11-layout_
_Context gathered: 2026-04-09_
