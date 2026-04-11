---
phase: 11-layout
plan: 01
subsystem: ui
tags: [layout, sidebar, shell, tailwind, desktop]

# Dependency graph
requires:
  - phase: 06-cross-screen-visual-consistency
    provides: visual contracts reused by the global shell
provides:
  - Sticky desktop sidebar behavior with independent sidebar scroll.
  - Unified main-content wrapper with `max-w-[1180px]` for all Layout views.
  - Root sizing baseline (`html`, `body`, `#root`) to support consistent `min-h-screen` behavior.
affects: [phase-11-plan-02]

# Tech tracking
tech-stack:
  added: []
  patterns: [desktop-sticky-sidebar, unified-content-width, root-height-baseline]

key-files:
  created: []
  modified:
    - src/layout/layout.tsx
    - src/components/UI/sidebar.tsx
    - src/index.css

key-decisions:
  - 'Sidebar stickiness is applied at the shell column level (`lg:sticky lg:top-0 lg:h-screen`) to keep navigation visible in long desktop flows.'
  - 'Main content now uses a single centered container (`mx-auto w-full max-w-[1180px]`) so all routed screens inherit the same width contract.'

patterns-established:
  - 'Use Layout as the single source of truth for global width constraints; avoid per-screen full-page max-width wrappers.'
  - 'Keep header in normal document flow; only sidebar stays fixed on desktop.'

requirements-completed: [UIX-03]

# Metrics
duration: 24 min
completed: 2026-04-09
---

# Phase 11 Plan 01: Global desktop shell contract Summary

**The desktop shell now keeps sidebar navigation fixed during long scroll while all main views share a single centered content width and a non-sticky header flow.**

## Performance

- **Duration:** 24 min
- **Started:** 2026-04-09T20:45:00Z
- **Completed:** 2026-04-09T21:09:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Applied sticky desktop behavior to the sidebar shell column and enabled independent vertical scrolling inside the sidebar content.
- Introduced a unified main-content wrapper in `Layout` with `mx-auto w-full max-w-[1180px]`.
- Added `height: 100%` baseline to `html`, `body`, and `#root` in global CSS to stabilize viewport sizing.

## Task Commits

Each task was completed and validated inline:

1. **Task 1: Fijar columna de sidebar al viewport en escritorio** - pending commit hash
2. **Task 2: Unificar contencion de ancho maximo y scroll del contenido principal** - pending commit hash

## Files Created/Modified

- `src/layout/layout.tsx` - Added sticky desktop sidebar column and unified max-width wrapper for header/content grid.
- `src/components/UI/sidebar.tsx` - Added desktop-height and internal overflow behavior for long navigation content.
- `src/index.css` - Added root-level `height: 100%` baseline for consistent shell sizing.

## Decisions Made

- Kept header behavior in normal scroll flow (no global sticky/fixed behavior) to align with D-06.
- Kept `Layout` API and `asideContent` contract unchanged so route-level integration remains stable.

## Deviations from Plan

None - plan executed within scope and acceptance criteria.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 11-02 can now validate per-screen wrappers and optional aside behavior on top of the stabilized shell contract.

## Self-Check: PASSED

---

_Phase: 11-layout_
_Completed: 2026-04-09_
