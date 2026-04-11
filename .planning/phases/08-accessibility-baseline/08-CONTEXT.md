# Phase 8: Accessibility Baseline - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Primary user flows are keyboard-usable and expose clear interaction feedback for focus and motion preferences. Specifically: interactive controls display clear focus-visible states using semantic tokens; key flows can be completed by keyboard navigation (Enter/Space/Escape/arrows); motion-heavy interactions respect `prefers-reduced-motion` preferences.

</domain>

<decisions>
## Implementation Decisions

### Focus Visibility Standardization

- **D-01:** All interactive components MUST use the semantic `.focus-ring` CSS class for focus states
- **D-02:** Remove hardcoded `focus:ring-indigo-500` or similar inline focus styles from Accordion, Dropdown, and other primitives
- **D-03:** Focus styles consume `--color-focus-ring` token from `tokens.css` for theme-consistent focus indication

### Keyboard Navigation Depth

- **D-04:** Implement essential keyboard handlers in Dropdown: Enter/Space to open/close, Escape to close, Arrow keys for item navigation
- **D-05:** Implement essential keyboard handlers in Accordion: Enter/Space to toggle open/closed state
- **D-06:** Maintain existing ARIA attributes (`aria-expanded`, `aria-haspopup`, `role="menu"`) - these are correct, just need keyboard support
- **D-07:** Modal focus trapping NOT in scope for this phase (can be added later if needed)

### Reduced-Motion Scope

- **D-08:** Apply `motion-reduce:transition-none` and `motion-reduce:transform-none` Tailwind classes to all transform animations (translateY, scale, hover lift effects)
- **D-09:** Specifically target: reports card hover (`hover:-translate-y-0.5`), sidebar item transitions, dashboard card hover effects
- **D-10:** Keep color-only state changes (hover:bg changes) since these don't cause motion discomfort
- **D-11:** The existing `@media (prefers-reduced-motion: reduce)` in `primitives.css` already handles `.focus-ring` transitions - extend if needed

### Skip Navigation

- **D-12:** Add basic skip-to-content link visible on keyboard focus (Tab)
- **D-13:** Skip link positioned at top of layout, targets main content `<main>` element
- **D-14:** Skip link should be visually hidden by default, visible only on focus

### Scope Exclusions

- **D-15:** Focus trapping in Modal is deferred to a future phase (not this accessibility baseline)
- **D-16:** Complex roving tabindex patterns are out of scope (simple tab order is sufficient for baseline)

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone definition and scope

- `.planning/PROJECT.md` - Current milestone v1.1 goal and target features, specifically ACC-01 and ACC-02
- `.planning/REQUIREMENTS.md` - Phase requirements ACC-01, ACC-02 and success criteria
- `.planning/ROADMAP.md` - Phase 8 boundary, dependencies, and success criteria

### Prior phase context

- `.planning/phases/05-design-tokens-and-primitives/05-CONTEXT.md` - Token definitions including `--color-focus-ring`
- `.planning/phases/07-responsive-layout-hardening/07-CONTEXT.md` - Dropdown/Accordion primitives that need keyboard handlers
- `.planning/phases/11-layout/11-CONTEXT.md` - Desktop shell layout where skip link will be added

### Codebase conventions

- `.planning/codebase/CONVENTIONS.md` - Existing styling and code conventions
- `.planning/codebase/STRUCTURE.md` - Component file locations
- `src/styles/primitives.css` - Existing `.focus-ring` class and reduced-motion media query
- `src/styles/tokens.css` - `--color-focus-ring` token definition
- `src/components/primitives/Dropdown.tsx` - Component needing keyboard handlers
- `src/components/primitives/Accordion.tsx` - Component needing keyboard handlers

</canonical_refs>

<codebase>
## Existing Code Insights

### Reusable Assets

- `src/styles/primitives.css`: `.focus-ring` class (lines 62-73) - already implements focus-visible with token
- `src/styles/primitives.css`: `@media (prefers-reduced-motion: reduce)` (lines 135-139) - base reduced-motion
- `src/components/primitives/Button.tsx`: Uses `focus-ring` + `motion-reduce:transition-none` (reference implementation)
- `src/components/primitives/Input.tsx`: Uses `focus-ring` + `motion-reduce:transition-none` (reference implementation)
- `src/components/primitives/Dropdown.tsx`: Has ARIA but missing keyboard handlers
- `src/components/primitives/Accordion.tsx`: Has ARIA but missing keyboard handlers

### Established Patterns

- Tailwind `focus-ring` utility class already defined in `primitives.css`
- Motion-reduce patterns using `motion-reduce:` prefix already established
- Token system for colors including focus ring already in place

### Integration Points

- Focus standardization: Update Dropdown.tsx and Accordion.tsx to use `.focus-ring` instead of inline `focus:ring-indigo-500`
- Skip link: Add to layout.tsx shell component (from Phase 11)
- Motion reduction: Audit reports.tsx, sidebar.tsx, sidebarItems.tsx, dashboardCard.tsx for hover transform effects
- Keyboard handlers: Add useEffect/useCallback hooks to Dropdown and Accordion for keydown events

</codebase>

<deferred>
## Deferred Ideas

- Modal focus trapping - requires more complex implementation, can be a follow-up
- Complex roving tabindex patterns for nested menus
- Full ARIA menu widget pattern (WAI-ARIA menu role with proper group/separator semantics)
- Live region announcements for dynamic content changes

---

_Phase: 08-accessibility-baseline_
_Context gathered: 2026-04-11_
