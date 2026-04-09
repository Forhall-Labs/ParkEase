# Phase 10: Tarifas parametrizadas y seleccion en ingreso - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-09T00:00:00Z
**Phase:** 10-quiero-que-agregues-una-fase-para-poder-editar-como-se-manej
**Areas discussed:** Modelo de tarifa, Reglas de seleccion, UX en Configuracion

---

## Modelo de tarifa

| Option                   | Description                                | Selected |
| ------------------------ | ------------------------------------------ | -------- |
| Nombre + monto + estado  | Incluye bandera activa/inactiva por tarifa |          |
| Solo monto               | Mantener modelo minimo sin tipo nominal    |          |
| Nombre + monto + recargo | Agregar campos extra desde esta fase       |          |
| Custom                   | "debe ser nombre y el monto"               | ✓        |

**User's choice:** Cada tarifa debe tener nombre y monto.
**Notes:** El usuario descarto complejidad extra en esta fase.

| Option              | Description                                                | Selected |
| ------------------- | ---------------------------------------------------------- | -------- |
| Inactivar           | Mantener historico sin uso para nuevos ingresos            |          |
| Eliminar            | Borrado definitivo                                         |          |
| Editar y reemplazar | Ajustar siempre la misma tarifa                            |          |
| Custom              | "no se debe de eliminar, debe de quedar y no se inactivar" | ✓        |

**User's choice:** No eliminar ni inactivar.
**Notes:** Se prioriza mantener tarifas disponibles y trazables.

| Option                | Description                                                     | Selected |
| --------------------- | --------------------------------------------------------------- | -------- |
| Si, editable          | Permite ajustar nombre/monto con historial de vehiculos intacto | ✓        |
| No, solo crear nuevas | Evita ediciones sobre registros existentes                      |          |

**User's choice:** Si, editable.
**Notes:** La tarifa puede modificarse despues de creada.

---

## Reglas de seleccion

| Option                        | Description                           | Selected |
| ----------------------------- | ------------------------------------- | -------- |
| Seleccion manual obligatoria  | Operador elige tarifa en cada ingreso | ✓        |
| Sugerida por placa + editable | Detecta tipo y sugiere tarifa         |          |
| Automatica por placa          | Asignacion sin intervencion manual    |          |

**User's choice:** Seleccion manual obligatoria.
**Notes:** Control directo en ventanilla.

| Option                       | Description                                                                   | Selected |
| ---------------------------- | ----------------------------------------------------------------------------- | -------- |
| Bloquear ingreso sin tarifas | Impide registrar vehiculos sin tarifa                                         |          |
| Permitir con 0               | Registro sin tarifa valida                                                    |          |
| Autocrear default            | Crear tarifa de respaldo automaticamente                                      |          |
| Custom                       | "debe existir una tarifa general... si no se ingresa tarifa, asignar general" | ✓        |

**User's choice:** Debe existir una tarifa general/default y usarse como fallback cuando no se selecciona una tarifa.
**Notes:** La tarifa general se crea y edita como las demas.

---

## UX en Configuracion

| Option                  | Description                                       | Selected |
| ----------------------- | ------------------------------------------------- | -------- |
| Selector unico por fila | Solo una tarifa puede quedar marcada como general | ✓        |
| Checkbox editable       | Requiere validacion adicional de unicidad         |          |
| Desde formulario        | Campo de general dentro del modal                 |          |

**User's choice:** Selector unico por fila.
**Notes:** Debe ser explicito y visible en tabla.

| Option                 | Description                               | Selected |
| ---------------------- | ----------------------------------------- | -------- |
| Tabla unica            | General y demas tarifas en una sola vista | ✓        |
| Separar general arriba | Bloque destacado + lista secundaria       |          |
| Solo formulario        | Sin tabla de revision completa            |          |

**User's choice:** Tabla unica con crear y editar.
**Notes:** Priorizo operacion diaria centralizada.

---

## the agent's Discretion

- Micro-interacciones visuales de seleccion de tarifa general.
- Estrategia tecnica exacta de migracion del modelo actual de parametros.

## Deferred Ideas

None.
