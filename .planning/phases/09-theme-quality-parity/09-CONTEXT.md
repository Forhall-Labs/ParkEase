# Phase 9: Theme Quality Parity - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Light and dark themes provide comparable readability and visual quality across key screens. Specifically: light theme quality on key screens is visually consistent and polished relative to dark theme; text, surfaces, and interactive states maintain readable contrast in both themes; theme switching does not degrade spacing, hierarchy, or control clarity on key screens.

</domain>

<decisions>
## Implementation Decisions

### Token Parity Audit

- **D-01:** Audit light theme tokens in `tokens.css` for completeness and visual balance
- **D-02:** Fix any token inconsistencies between light and dark themes
- **D-03:** Ensure surface colors, text colors, borders, and accents are properly balanced for light theme
- **D-04:** Verify `--color-focus-ring` works well on light backgrounds

### Surface Elevation in Light Theme

- **D-05:** Add subtle shadows to cards and panels in light theme for better visual hierarchy
- **D-06:** Light theme shadows should be subtle (e.g., `shadow-sm` or `shadow-slate-200`)
- **D-07:** Maintain contrast between surface layers (app bg, panel bg, card bg) in light theme
- **D-08:** Avoid light theme looking "flat" — use shadows to create depth

### Migration Strategy

- **D-09:** Migrate key primitive components to consume token-based CSS classes instead of inline `isLight ? '...' : '...'` classes
- **D-10:** Target primitives: Card, Button, Input, SectionHeader
- **D-11:** Existing inline classes in other components remain as-is for this phase
- **D-12:** Focus on consistency rather than complete migration

### Scope Exclusions

- **D-13:** Full component migration to token-based CSS is out of scope (too extensive for this phase)
- **D-14:** No structural changes to layouts or component APIs
- **D-15:** Focus on visual polish, not functional changes

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone definition and scope

- `.planning/PROJECT.md` - Current milestone v1.1 goal and target features
- `.planning/REQUIREMENTS.md` - Phase requirements THEM-01, THEM-02
- `.planning/ROADMAP.md` - Phase 9 boundary, dependencies, and success criteria

### Prior phase context

- `.planning/phases/05-design-tokens-and-primitives/05-CONTEXT.md` - Token definitions
- `.planning/phases/06-cross-screen-visual-consistency/06-CONTEXT.md` - Visual consistency patterns
- `.planning/phases/08-accessibility-baseline/08-CONTEXT.md` - Focus ring and accessibility

### Codebase conventions

- `.planning/codebase/CONVENTIONS.md` - Existing styling conventions
- `src/styles/tokens.css` - Current token definitions for both themes
- `src/styles/primitives.css` - Primitive CSS classes
- `src/components/primitives/Card.tsx` - Card component to migrate
- `src/components/primitives/Button.tsx` - Button component to reference
- `src/components/primitives/Input.tsx` - Input component to reference
- `src/components/dashboardCard.tsx` - Dashboard card with theme handling

</canonical_refs>

<codebase>
## Existing Code Insights

### Reusable Assets

- `src/styles/tokens.css`: Token definitions for both themes (dark baseline + light override)
- `src/styles/primitives.css`: Semantic CSS classes for surfaces, text, buttons
- `src/components/primitives/Card.tsx`: Card component needing migration to tokens
- `src/components/dashboardCard.tsx`: Dashboard card with extensive `isLight` handling

### Established Patterns

- Component-level `isLight` checks: `const isLight = theme === 'light';`
- Inline conditional Tailwind classes: `isLight ? 'bg-stone-50' : 'bg-slate-950'`
- 235+ theme-related code locations across codebase
- Tokens defined with CSS variables using `rgb()` format for alpha support

### Integration Points

- Token updates in `tokens.css` automatically apply to all components consuming them
- Shadow additions in light theme should be added to `primitives.css` surface classes
- Key components (Card, Button, Input) are integration points for token migration

</codebase>

<deferred>
## Deferred Ideas

- Full component migration to token-based CSS - too extensive for this phase
- New theme (high contrast, sepia, etc.) - future enhancement
- Theme persistence and auto-detection based on system preference

---

_Phase: 09-theme-quality-parity_
_Context gathered: 2026-04-11_
