# Phase 11: layout - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-09T00:00:00Z
**Phase:** 11-layout
**Areas discussed:** Estructura global

---

## Estructura global

| Option                            | Description                                            | Selected |
| --------------------------------- | ------------------------------------------------------ | -------- |
| Sidebar fija + header + contenido | Patron de app de escritorio con navegacion persistente | ✓        |
| Header + menu colapsable          | Menos presencia lateral constante                      |          |
| Navegacion por tabs               | Simplifica visualmente, menos escalable en admin       |          |

**User's choice:** Sidebar fija + header + contenido.
**Notes:** Mantener paradigma de escritorio.

| Option                          | Description                          | Selected |
| ------------------------------- | ------------------------------------ | -------- |
| Columna lateral opcional        | Aside solo cuando modulo lo necesite | ✓        |
| Integrado en contenido          | Sin columna lateral dedicada         |          |
| Siempre visible en todas vistas | Patron forzado en toda la app        |          |

**User's choice:** Columna lateral opcional.
**Notes:** Mantener `asideContent` reusable.

| Option                 | Description                            | Selected |
| ---------------------- | -------------------------------------- | -------- |
| Sidebar y header fijos | Ambos persistentes al hacer scroll     |          |
| Solo sidebar fija      | Header scrollea, nav lateral permanece | ✓        |
| Todo scrollea          | Menor persistencia de navegacion       |          |

**User's choice:** Solo sidebar fija.
**Notes:** Header no fijo global.

| Option                   | Description                                           | Selected |
| ------------------------ | ----------------------------------------------------- | -------- |
| Ancho maximo unificado   | Misma caja de contenido principal en todas las vistas | ✓        |
| Ancho libre por pantalla | Flexibilidad por modulo                               |          |
| Unificar parcialmente    | Solo en algunas pantallas                             |          |

**User's choice:** Ancho maximo unificado.
**Notes:** Buscar consistencia cross-screen.

---

## the agent's Discretion

- Definir valor tecnico exacto del max-width unificado.
- Ajustes de grid/shell para preservar aside opcional sin degradar densidad visual.

## Deferred Ideas

- Ajustes profundos para mobile/responsive quedan fuera de esta fase.
