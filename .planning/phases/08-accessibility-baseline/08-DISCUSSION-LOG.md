# Phase 8: Accessibility Baseline - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-11
**Phase:** 08-accessibility-baseline
**Areas discussed:** Focus standardization, Keyboard navigation, Reduced-motion, Skip navigation

---

## Focus Standardization

| Option                           | Description                                                                     | Selected |
| -------------------------------- | ------------------------------------------------------------------------------- | -------- |
| Estandarizar a .focus-ring       | Todos los componentes usan .focus-ring semántico. Consistente, usa tokens.      | ✓        |
| Permitir ambos                   | Permitir .focus-ring Y Tailwind inline para flexibilidad. Requiere convención.  |          |
| Mínimo - solo nuevos componentes | Solo primitivas nuevas usan .focus-ring. Existentes se actualizan gradualmente. |          |

**User's choice:** Estandarizar a .focus-ring
**Notes:** User wants full consistency across all interactive elements.

---

## Keyboard Navigation Depth

| Option              | Description                                                                       | Selected |
| ------------------- | --------------------------------------------------------------------------------- | -------- |
| Handlers esenciales | Enter/Space togglean, Escape cierra menús. Arrow keys en Dropdown. Mínimo viable. | ✓        |
| Completo            | Handlers + focus trapping en Modal + roving tabindex en menús. Más trabajo.       |          |
| Mínimo - solo aria  | Solo corregir aria attributes existentes. Sin handlers nuevos.                    |          |

**User's choice:** Handlers esenciales
**Notes:** Balance between accessibility improvement and implementation effort.

---

## Reduced-Motion Scope

| Option                   | Description                                                              | Selected |
| ------------------------ | ------------------------------------------------------------------------ | -------- |
| Transforms + transitions | translateY, hover lift, scale. Mantiene colores/estados. Balance.        | ✓        |
| Solo transitions         | Solo timing transitions. Transformaciones menores ok.                    |          |
| Todo motion-reduce       | Todos los efectos motion. Más seguro pero puede afectar feedback visual. |          |

**User's choice:** Transforms + transitions
**Notes:** User wants to disable motion-heavy animations while keeping color state changes.

---

## Skip Navigation

| Option         | Description                                                              | Selected |
| -------------- | ------------------------------------------------------------------------ | -------- |
| Sí - básico    | Skip link visible en focus que lleva al main content. Simple y efectivo. | ✓        |
| Sí - múltiples | Skip a contenido principal, skip a navegación. Más opciones.             |          |
| No             | No agregar skip links. Navegación desktop es rápida.                     |          |

**User's choice:** Sí - básico
**Notes:** Basic skip link is sufficient for desktop app accessibility baseline.

---

## Summary

All four areas discussed and decisions captured:

1. **Focus:** Standardize to `.focus-ring` semantic class across all components
2. **Keyboard:** Implement essential handlers (Enter/Space/Escape/arrows) in Dropdown and Accordion
3. **Motion:** Apply reduced-motion to transforms and transitions, keep color changes
4. **Skip:** Add basic skip-to-content link visible on keyboard focus

---

_Phase: 08-accessibility-baseline_
_Discussion completed: 2026-04-11_
