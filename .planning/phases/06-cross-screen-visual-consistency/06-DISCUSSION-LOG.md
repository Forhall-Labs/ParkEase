# Phase 6: Cross-Screen Visual Consistency - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-09T00:00:00Z
**Phase:** 06-cross-screen-visual-consistency
**Areas discussed:** Patron de encabezados, Densidad y superficies, Tabla de reportes, Estandar de acciones

---

## Patron de encabezados

| Option                        | Description                                    | Selected |
| ----------------------------- | ---------------------------------------------- | -------- |
| Titulo + subtitulo + acciones | Estructura base uniforme para todas las vistas | ✓        |
| Solo titulo + acciones        | Menos contexto visual en vistas complejas      |          |
| Titulo + metricas             | Puede sobrecargar algunas pantallas            |          |

**User's choice:** Titulo + subtitulo + acciones.
**Notes:** Se prioriza consistencia cross-screen.

| Option               | Description                                           | Selected |
| -------------------- | ----------------------------------------------------- | -------- |
| Siempre a la derecha | Accion principal fija al final del header             |          |
| Siempre debajo       | Mejor para responsive                                 |          |
| Depende por pantalla | Flexible pero menos uniforme                          |          |
| Custom               | "No debe ser adaptado para movil, siempre escritorio" | ✓        |

**User's choice:** Desktop-first fijo; accion principal en patron de escritorio.
**Notes:** La fase no se orienta a adaptar layout movil.

---

## Densidad y superficies

| Option           | Description                       | Selected |
| ---------------- | --------------------------------- | -------- |
| Media balanceada | Legible y eficiente en escritorio | ✓        |
| Compacta         | Mas densidad, menos aire          |          |
| Amplia           | Mas aire, menor densidad util     |          |

**User's choice:** Densidad media balanceada.
**Notes:** Mantener legibilidad sin perder informacion visible.

| Option                  | Description                                              | Selected |
| ----------------------- | -------------------------------------------------------- | -------- |
| Unificar todo           | Mismo borde/radio/sombra en todas las pantallas objetivo | ✓        |
| Solo reportes+dashboard | Cobertura parcial                                        |          |
| Mantener diferencias    | Conserva inconsistencia                                  |          |

**User's choice:** Unificar todas las superficies.
**Notes:** Debe sentirse una sola familia visual.

---

## Tabla de reportes

| Option                  | Description                            | Selected |
| ----------------------- | -------------------------------------- | -------- |
| Placa + Tarifa + Fechas | Mayor jerarquia para escaneo operativo | ✓        |
| ID + Placa              | Enfoque mas tecnico                    |          |
| Todas iguales           | Menor escaneabilidad                   |          |

**User's choice:** Placa + Tarifa + Fechas.
**Notes:** Prioridad operativa para lectura rapida.

| Option                 | Description                    | Selected |
| ---------------------- | ------------------------------ | -------- |
| Sticky + zebra + hover | Patron completo de legibilidad | ✓        |
| Solo zebra + hover     | Mejora parcial                 |          |
| Solo estado actual     | Cambio minimo                  |          |

**User's choice:** Aplicar los tres patrones.
**Notes:** Mejora visual sin cambiar la logica del reporte.

---

## Estandar de acciones

| Option                                         | Description                                | Selected |
| ---------------------------------------------- | ------------------------------------------ | -------- |
| Primario cian, secundario neutro, peligro rojo | Convencion interna actual                  |          |
| Primario por modulo                            | Menos consistencia                         |          |
| Todo neutro                                    | Menos claridad de accion principal         |          |
| Custom                                         | "Debemos seguir reglas de Material Design" | ✓        |

**User's choice:** Seguir Material Design.
**Notes:** La guia de acciones se define por design system, no por colores ad-hoc.

| Option                   | Description                                       | Selected |
| ------------------------ | ------------------------------------------------- | -------- |
| Material 3 tonal         | Filled / Outlined / Text con estados consistentes | ✓        |
| Material 2 clasico       | Jerarquia anterior                                |          |
| Solo look MD, API actual | Ajuste visual parcial                             |          |

**User's choice:** Material 3 tonal.
**Notes:** Queda bloqueado como estandar para botones y estados.

---

## the agent's Discretion

- Mapeo puntual de cada accion actual a variante M3 segun contexto.
- Ajustes micro de spacing y tipografia conservando decisiones bloqueadas.

## Deferred Ideas

- Adaptacion movil completa se difiere a la fase de responsive hardening.
