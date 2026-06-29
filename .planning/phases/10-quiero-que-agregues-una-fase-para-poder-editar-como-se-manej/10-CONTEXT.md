# Phase 10: Tarifas parametrizadas y seleccion en ingreso - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Habilitar gestion de tarifas con nombre y monto en Configuracion, incluyendo una tarifa general por defecto, y usar esas tarifas al ingresar vehiculos para que el cobro inicial no dependa de un unico parametro fijo.

</domain>

<decisions>
## Implementation Decisions

### Modelo de tarifa

- **D-01:** Cada tarifa debe tener `nombre` y `monto` como datos principales de negocio.
- **D-02:** Las tarifas no se eliminan ni se inactivan.
- **D-03:** Las tarifas existentes se pueden editar (nombre y monto).

### Tarifa general (default)

- **D-04:** Debe existir una tarifa marcada como general/default.
- **D-05:** La tarifa general se crea y edita igual que cualquier otra tarifa.
- **D-06:** Solo puede existir una tarifa general al mismo tiempo.

### Seleccion de tarifa al ingresar vehiculo

- **D-07:** El ingreso de vehiculo se maneja con seleccion manual de tarifa en la UI.
- **D-08:** Si el operador no selecciona una tarifa, se asigna automaticamente la tarifa general/default.

### UX en Configuracion

- **D-09:** La gestion de tarifas se mantiene en una tabla unica que incluye todas las tarifas, incluida la general.
- **D-10:** La tarifa general se define con selector unico por fila (accion explicita para marcar una sola como general).
- **D-11:** La tabla conserva acciones operativas de crear y editar.

### the agent's Discretion

- Ajustes exactos de copy, iconografia y micro-interacciones en la tabla de tarifas.
- Detalles tecnicos de migracion de datos desde el modelo actual (`par_quantity`/`par_tax`) al nuevo esquema, respetando compatibilidad del sistema existente.

</decisions>

<specifics>
## Specific Ideas

- Referencia explicita del usuario: "tarifa moto cuesta 600 colones" como ejemplo de tarifas nombradas por tipo.
- La tarifa general debe actuar como respaldo automatico cuando no se seleccione tarifa en el ingreso.

</specifics>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product and scope

- `.planning/ROADMAP.md` - Phase 10 entry and dependency chain.
- `.planning/PROJECT.md` - Offline-first constraints and current milestone context.
- `.planning/REQUIREMENTS.md` - Baseline parameter requirement history and active milestone constraints.
- `.planning/STATE.md` - Current execution context and roadmap evolution notes.

### Existing parameter and vehicle flow implementation

- `src/components/UI/settings.tsx` - Current in-app parameter management UI now hosted under Configuracion.
- `src/components/vehiclesResumeTable.tsx` - Vehicle ingress flow, current default-rate behavior, and checkout calculation inputs.
- `src/types/electron-api.d.ts` - Renderer IPC contracts for parameters and vehicles.

### Electron data and IPC layers

- `electron/preload.ts` - Exposed typed IPC methods used by renderer for parameter and vehicle operations.
- `electron/handlers/parameter.handler.ts` - Parameter IPC endpoints.
- `electron/service/parameter.service.ts` - Parameter business logic layer.
- `electron/repositories/parameter.repository.ts` - Parameter persistence queries.
- `electron/models/parameter.model.ts` - Current parameter domain model shape.
- `electron/repositories/vehcile.repository.ts` - Vehicle persistence including stored `veh_tax` values.
- `electron/database/db.ts` - SQLite schema/migration source for parameter and vehicle tables.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/components/UI/settings.tsx`: already contains table + modal patterns for creating/editing parameters inside Configuracion.
- `src/components/vehiclesResumeTable.tsx`: already loads parameters and pre-fills `veh_tax`, making it the natural integration point for tariff selection/default fallback.
- `src/types/electron-api.d.ts` + `electron/preload.ts`: existing typed IPC contract pattern to extend safely.

### Established Patterns

- Electron layered flow is stable: handler -> service -> repository -> SQLite.
- DTO fields use snake_case to mirror DB columns; this convention should stay for compatibility.
- Renderer forms follow `useState` + modal submit + reload pattern already used in Users/Settings/Parameters.

### Integration Points

- UI: Configuracion rates tab in `src/components/UI/settings.tsx` and vehicle ingress form in `src/components/vehiclesResumeTable.tsx`.
- IPC: `parameters:*` contract in `electron/preload.ts` and `src/types/electron-api.d.ts`.
- Data model: parameter model/repository/schema under `electron/models/parameter.model.ts`, `electron/repositories/parameter.repository.ts`, and `electron/database/db.ts`.

</code_context>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

_Phase: 10-quiero-que-agregues-una-fase-para-poder-editar-como-se-manej_
_Context gathered: 2026-04-09_
