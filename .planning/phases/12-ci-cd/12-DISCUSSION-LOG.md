# Phase 12: CI/CD - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-09
**Phase:** 12-ci-cd
**Areas discussed:** Estrategia de ramas, Gates de calidad, Release y versionado, Manejo de secretos/hooks

---

## Seleccion inicial de areas

| Option               | Description                                                  | Selected |
| -------------------- | ------------------------------------------------------------ | -------- |
| Estrategia de ramas  | Cuándo correr CI: PR/push a main-dev y qué bloquear por rama | ✓        |
| Gates de calidad     | Qué debe pasar para aprobar (lint/tsc/build/tests)           | ✓        |
| Release y versionado | Cómo disparar releases y publicar artefactos                 | ✓        |
| Manejo de secretos   | Política de credenciales en CI                               |          |

**User's choice:** Gates de calidad, Release y versionado, Estrategia de ramas + requisito adicional: CI debe verificar todo y CD debe publicar `.exe` + portable, manteniendo hooks de Husky.
**Notes:** Aunque no selecciono explicitamente "Manejo de secretos" al inicio, se capturo dependencia operacional de secretos de GitHub dentro del alcance de CI/CD.

---

## Estrategia de ramas

| Option              | Description                                                                    | Selected |
| ------------------- | ------------------------------------------------------------------------------ | -------- |
| PR+push en main/dev | CI en PR y push sobre ramas clave                                              |          |
| Solo PR             | CI solo en pull_request                                                        |          |
| Solo main           | CI/CD centrado en main                                                         |          |
| Respuesta libre     | "los PR deben de ser asignados a copilot... y publicar a main despues si pasa" | ✓        |

**User's choice:** Merge a `main` despues de pasar PR aprobado; preferencia de asignar PR a Copilot.
**Notes:** Se tradujo a decision implementable: PR aprobado obligatorio + auto-assign bot "si posible".

---

## Gates de calidad

| Option               | Description            | Selected |
| -------------------- | ---------------------- | -------- |
| lint+tsc+build       | Gates bloqueantes base |          |
| lint+tsc             | Gates minimos          |          |
| lint+tsc+build+tests | Gate completo          | ✓        |

**User's choice:** `lint + tsc + build + tests`.
**Notes:** Se mantiene aunque hoy no haya suite completa; planning debe resolver adopcion tecnica sin diluir gate objetivo.

---

## Release y versionado

| Option                   | Description                         | Selected |
| ------------------------ | ----------------------------------- | -------- |
| Tag v\* auto publica     | Release directo publicado           |          |
| Tag v\* en draft         | Release draft para validacion final | ✓        |
| Manual workflow_dispatch | Solo manual                         |          |

**User's choice:** `Tag v* en draft`.
**Notes:** Debe adjuntar `.exe` y `portable.zip` en GitHub Release draft.

---

## Auto-asignacion, assets y husky

| Option                     | Description                            | Selected |
| -------------------------- | -------------------------------------- | -------- |
| Auto-assign bot si posible | Intentar asignar bot y fallback humano | ✓        |
| Reviewer humano fijo       | Sin bot                                |          |
| Sin asignacion automatica  | Solo checks                            |          |

| Option                     | Description           | Selected |
| -------------------------- | --------------------- | -------- |
| .exe + portable zip        | Publicar ambos assets | ✓        |
| Solo .exe                  | Solo instalador       |          |
| .exe + portable folder raw | Carpeta sin comprimir |          |

| Option                | Description                         | Selected |
| --------------------- | ----------------------------------- | -------- |
| pre-commit + pre-push | Hooks minimos recomendados          |          |
| Solo pre-push fuerte  | Una sola barrera                    |          |
| Respuesta libre       | "pre-commit, pre-push y commit-msg" | ✓        |

**User's choice:** Auto-assign si posible, publicar `.exe` + `portable.zip`, y mantener los 3 hooks existentes (`pre-commit`, `pre-push`, `commit-msg`).
**Notes:** Commit-msg queda explicitamente como parte del flujo de calidad local.

---

## the agent's Discretion

- Implementacion tecnica exacta de auto-asignacion y permisos.
- Naming exacto de artefactos en release draft.
- Orquestacion de jobs para balancear tiempo y trazabilidad.

## Deferred Ideas

None.
