# Phase 5: Design Tokens and Primitives - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Define semantic design tokens and reusable UI primitives that support milestone v1.1 UX goals. This phase delivers shared foundations only. Large per-screen restyling belongs to later phases.

</domain>

<decisions>
## Implementation Decisions

### Token model and source of truth
- **D-01:** Use semantic tokens (not raw palette names) for surfaces, text, border, accent, focus, and feedback states.
- **D-02:** Keep token definitions centralized and framework-friendly so both existing Tailwind utility usage and component classes can consume them.
- **D-03:** Token scope includes color, spacing scale, radius scale, and typography roles required by milestone screens.

### Primitive components scope
- **D-04:** Create or standardize primitives for Button, Input, Card/Panel, SectionHeader, and StatusBadge patterns used repeatedly in current screens.
- **D-05:** Primitives must expose theme-aware variants for light and dark modes.
- **D-06:** Primitive API should prefer simple variant props over one-off inline class overrides.

### Adoption strategy
- **D-07:** This phase includes partial integration proof in at least one core screen, enough to validate primitives without full cross-screen migration.
- **D-08:** Existing screens can keep legacy styles temporarily where migration risk is high; follow-up consistency happens in later phases.

### the agent's Discretion
- Exact token naming schema and file placement details.
- Whether primitives are implemented as wrappers around existing elements or new reusable components.
- Internal class composition strategy as long as semantic tokens stay authoritative.

</decisions>

<specifics>
## Specific Ideas

- Prioritize readability and spacing consistency before decorative effects.
- Avoid UI overlaps and clipping regressions while introducing tokens/primitives.
- Keep reports UI improvements compatible with the new token layer.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone definition and scope
- `.planning/PROJECT.md` - Current milestone v1.1 goal and target features.
- `.planning/REQUIREMENTS.md` - Phase requirements TOKN-01 and TOKN-02 plus milestone constraints.
- `.planning/ROADMAP.md` - Phase 5 boundary, dependencies, and success criteria.
- `.planning/STATE.md` - Current position and active phase context.

### Codebase conventions and architecture
- `.planning/codebase/CONVENTIONS.md` - Existing styling and code conventions to preserve.
- `.planning/codebase/STRUCTURE.md` - Current project layout for placing token/primitives files.
- `.planning/codebase/ARCHITECTURE.md` - Renderer/main boundaries and integration constraints.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/dashboardCard.tsx`: existing card-like component that can inform primitive panel/card API.
- `src/components/UI/reports.tsx`: current reference for recent UX direction and control patterns.
- `src/index.css`: current global style entrypoint for introducing shared token variables.

### Established Patterns
- Utility-first styling is already common in renderer UI files.
- Theme toggles are already consumed through `theme` props and conditional class branches.
- i18n string usage is centralized in `src/i18n.ts` and should not be coupled to style primitives.

### Integration Points
- Token definitions should be globally available from `src/index.css` or a shared style module imported there.
- Primitive components should live under existing component structure and be consumable by Reports, Dashboard, Vehicles, and Users screens.
- Adoption validation can start with the Reports screen and one additional high-traffic view.

</code_context>

<deferred>
## Deferred Ideas

- PDF/export and print styling refinements are outside this phase.
- New product capabilities (history search, cloud sync, notifications) remain out of milestone scope.

</deferred>

---

*Phase: 05-design-tokens-and-primitives*
*Context gathered: 2026-04-09*
