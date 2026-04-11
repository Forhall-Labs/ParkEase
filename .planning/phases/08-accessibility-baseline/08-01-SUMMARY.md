---
phase: 08-accessibility-baseline
plan: '01'
subsystem: accessibility
tags:
  - focus-ring
  - keyboard-navigation
  - dropdown
  - accordion
  - primitives
dependency_graph:
  requires:
    - .planning/phases/05-design-tokens-and-primitives/05-CONTEXT.md
  provides:
    - src/components/primitives/Dropdown.tsx
    - src/components/primitives/Accordion.tsx
  affects:
    - src/styles/primitives.css
tech_stack:
  added:
    - useCallback hooks for keyboard handlers
    - useEffect for global Escape key handling
    - .focus-ring semantic class adoption
  patterns:
    - Keyboard-first component design
    - Semantic focus class instead of inline styles
key_files:
  created: []
  modified:
    - src/components/primitives/Dropdown.tsx
    - src/components/primitives/Accordion.tsx
decisions:
  - Use .focus-ring semantic class from primitives.css instead of inline focus:ring-indigo-500
  - Add Enter/Space to toggle, Escape to close, Arrow keys to open dropdown
  - Add role="button" and tabIndex={0} for keyboard accessibility
  - Preserve existing ARIA attributes (aria-expanded, aria-haspopup, role="menu")
metrics:
  duration: 10 minutes
  completed: 2026-04-11
  tasks_completed: 2
  files_modified: 2
---

# Phase 8 Plan 1: Focus Visibility and Keyboard Handlers

## Summary

Updated Dropdown and Accordion primitives with semantic focus styles and keyboard handlers per D-01 through D-07 from the accessibility baseline context.

## Changes Applied

### Dropdown.tsx

- **Focus styles:** Replaced inline `focus:ring-indigo-500 focus:ring-offset-2` with `.focus-ring` semantic class
- **Keyboard handlers:** Added Enter/Space to toggle, Escape to close, ArrowDown/ArrowUp to open menu
- **Accessibility:** Added `tabIndex={0}`, `role="button"`, wired `onKeyDown` handler
- **Visual:** Added rotating chevron icon when open
- **Global escape:** Added useEffect to close dropdown on Escape keypress from anywhere

### Accordion.tsx

- **Focus styles:** Replaced inline `focus:ring-indigo-500 focus:ring-offset-2` with `.focus-ring` semantic class
- **Keyboard handlers:** Added Enter/Space to toggle, ArrowDown/ArrowUp optional toggle
- **Accessibility:** Added `tabIndex={0}`, `role="button"`, wired `onKeyDown` handler
- **Visual:** Added rotation animation to chevron icon
- **Global escape:** Added useEffect to close accordion on Escape keypress

## Verification

- grep confirms `.focus-ring` class in both Dropdown.tsx and Accordion.tsx
- grep confirms `onKeyDown` handler in both components
- TypeScript compilation passes without errors
- Both components preserve existing ARIA attributes (aria-expanded, aria-haspopup, aria-controls)

## Deviations from Plan

None - plan executed exactly as written.

---

_Summary created: 2026-04-11_
