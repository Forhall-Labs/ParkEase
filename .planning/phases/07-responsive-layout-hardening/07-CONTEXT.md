# Phase 7: Responsive Layout Hardening - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Ensure Reports and primary screens remain usable on narrow viewports with intentional overflow behavior. This phase focuses on making key screens and controls adapt without overlap, clipping, or broken interactions when viewport width is reduced. Specifically: Reports filters and action controls do not overlap at supported breakpoints; primary screens retain core interactions on narrow widths without clipped key actions; wide tables use intentional horizontal scrolling and preserve readable column labels.
</domain>

<decisions>
## Implementation Decisions

### Breakpoint Strategy

- **D-01:** Use Tailwind CSS default breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px) for consistency with existing codebase
- **D-02:** Apply responsive modifiers based on content needs rather than arbitrary values, leveraging existing utility-first approach

### Report Filters and Controls

- **D-03:** Convert filters and action controls area to a dropdown menu or accordion component when viewport is below lg breakpoint (1024px)
- **D-04:** Prioritize keeping essential filter controls visible while moving less frequently used filters to the dropdown
- **D-05:** Ensure dropdown/accordion maintains accessibility and keyboard navigability

### Table Handling in Narrow Viewports

- **D-06:** Implement intentional horizontal scrolling for wide data tables (vehicles, reports, etc.) when container width is insufficient
- **D-07:** Preserve table header visibility and readability during horizontal scroll
- **D-08:** Apply this pattern consistently across all wide tables in primary screens (Reports, Vehicles, Parameters, Users)

### the agent's Discretion

- Specific breakpoint values for individual components when defaults need adjustment
- Exact animation/duration for dropdown/accordion transitions
- Visual indicators for horizontal scroll availability (scroll hints, fade effects)
- Whether to implement sticky headers for tables during horizontal scroll
  </decisions>

<specifics>
## Specific Ideas

- The application is desktop-first but must adapt to various desktop screen sizes and window configurations
- Reports view filters should remain accessible but not obstruct table content on smaller screens
- Vehicle table should maintain column readability while allowing horizontal scroll to access all data
- Sidebar from Phase 11 (layout) should be considered when calculating available viewport width
  </specifics>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone definition and scope

- `.planning/PROJECT.md` - Current milestone v1.1 goal and target features, specifically RESP-01 and RESP-02 requirements
- `.planning/REQUIREMENTS.md` - Phase requirements RESP-01, RESP-02, and UIX-01
- `.planning/ROADMAP.md` - Phase 7 boundary, dependencies, and success criteria
- `.planning/STATE.md` - Current position and active phase context

### Codebase conventions and architecture

- `.planning/codebase/CONVENTIONS.md` - Existing styling and code conventions to preserve
- `.planning/codebase/STRUCTURE.md` - Current project layout for understanding component organization
- `.planning/codebase/ARCHITECTURE.md` - Renderer/main boundaries and integration constraints
- `.planning/phases/05-design-tokens-and-primitives/05-CONTEXT.md` - Design tokens and primitives foundation
- `.planning/phases/06-cross-screen-visual-consistency/06-CONTEXT.md` - Visual consistency patterns to maintain
- `.planning/phases/11-layout/11-CONTEXT.md` - Desktop shell layout considerations (sidebar width, header behavior)
  </canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/layout/layout.tsx` - Main layout component with existing responsive sidebar behavior (lg:flex-row)
- `src/App.tsx` - Root application showing Tailwind responsive usage (sm:, lg: modifiers)
- `src/components/UI/dashboard.tsx` - Dashboard view with responsive grid (sm:grid-cols-2, xl:grid-cols-3)
- `src/components/primitives/` - Reusable UI components (Button, Card, etc.) that should inherit responsive behaviors
- `src/components/UI/reports.tsx` - Reports table that will need responsive treatment
- `src/components/vehiclesResumeTable.tsx` - Vehicle table requiring horizontal scroll solution

### Established Patterns

- Utility-first styling with Tailwind CSS is already common throughout the codebase
- Responsive design patterns exist using sm:, md:, lg:, xl: prefixes on class names
- Container-based layout approach with max-width constraints (max-w-6xl in App.tsx, max-w-[1180px] in layout.tsx)
- Flexbox and Grid layouts are used for responsive behavior
- Theme-aware styling through `theme` prop and `isLight` boolean

### Integration Points

- Responsive behaviors should be consistent with existing layout.tsx sidebar behavior (lg:sticky lg:w-[296px])
- Table implementations should maintain existing styling patterns while adding overflow handling
- Dropdown/accordion for filters should follow existing UI component patterns from primitives/
- Any new responsive utilities should integrate with existing token system from Phase 5
  </code_context>

<deferred>
## Deferred Ideas

- Vertical stacking of table rows as alternative to horizontal scroll (considered but chose to preserve tabular data format)
- Collapsible sidebar for ultra-narrow viewpoints (deferred to Phase 11 layout considerations)
- Dynamic breakpoint adjustment based on actual content width rather than fixed pixel values
- Touch-optimized interactions for potential tablet use (out of scope for desktop-first focus)
  </deferred>
