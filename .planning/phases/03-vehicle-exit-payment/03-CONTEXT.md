# Phase 3: Vehicle Exit & Payment - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Implementar salida de vehículos con cálculo automático de tarifa usando reglas de redondeo costarricenses. El usuario selecciona un vehículo estacionado, el sistema registra la hora de salida, calcula la duración y la tarifa, permite editar el monto, y actualiza el estado del vehículo a "S" (Salido).

</domain>

<decisions>
## Implementation Decisions

### Fee display

- **D-01:** Mostrar breakdown completo en el modal de checkout (hora de ingreso, hora de salida, monto editable)

### Fee calculation

- **D-02:** Cálculo de tarifa: primera hora = tarifa de parámetros, después 10 colones por minuto
- **D-03:** Redondeo: redondear hacia arriba al múltiplo más cercano de 50 colones (ej: 820 → 850, 970 → 1000)

### Manual override

- **D-04:** El campo editable permite cualquier valor (mayor o menor que el calculado)

### the agent's Discretion

- Diseño UI exacto del modal de checkout
- Validaciones adicionales de negocio
- Mensajes de error

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements

- `.planning/REQUIREMENTS.md` — VEHI-07 a VEHI-14

### Codebase

- `src/components/vehiclesResumeTable.tsx` — Componente de tabla de vehículos con checkout modal
- `electron/service/vehicle.service.ts` — Lógica de checkout (vehicleCheckout)
- `electron/repositories/vehcile.repository.ts` — Repository con checkoutVehicle

</canonical_refs>

\n## Existing Code Insights

### Reusable Assets

- `src/components/UI/Modal.tsx`: Componente Modal existente con ConfirmModal
- `src/i18n.ts`: Sistema de traducciones ES/EN

### Established Patterns

- Checkout modal ya existe en vehiclesResumeTable.tsx con estado `checkoutModal`
- La tabla ya tiene columna de acciones con botones de checkout, reimprimir, eliminar

### Integration Points

- `vehicle.service.ts:vehicleCheckout()` acepta `total` opcional como override
- El handler `vehicles:checkout` IPC pasa el total al servicio

</code_context>

<specifics>
## Specific Ideas

- El modal de checkout existente debe modificarse para mostrar breakdown completo
- La función calculateTotalValue() en el frontend necesita cambiarse para usar 10 colones/min después de primera hora
- El redondeo CR debe implementarse: Math.ceil(total / 50) \* 50

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 03-vehicle-exit-payment_
_Context gathered: 2026-04-09_
