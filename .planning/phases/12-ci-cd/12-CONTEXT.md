# Phase 12: CI/CD - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Definir e implementar un flujo CI/CD para la app Electron que valide calidad antes de merge, y que genere/publicque artefactos de distribucion Windows en GitHub Releases (draft), manteniendo integracion con los hooks locales de Husky.

</domain>

<decisions>
## Implementation Decisions

### Estrategia de ramas y aprobacion

- **D-01:** El merge a `main` se permite solo mediante Pull Request aprobado (no push directo operativo).
- **D-02:** CI debe ejecutarse sobre PR hacia `main` y validar tambien cambios en `dev` como parte del flujo actual.
- **D-03:** Se intentara auto-asignacion de PR a bot/Copilot si GitHub lo permite; si no, se usa fallback a asignacion/revision humana sin bloquear el resto del pipeline.

### Gates de calidad en CI

- **D-04:** Los checks bloqueantes de merge incluyen `lint + tsc + build + tests`.
- **D-05:** Aunque hoy no exista suite completa, la fase debe dejar preparado el contrato para que `tests` sea gate formal cuando se configure (sin perder los gates actuales).
- **D-06:** El objetivo de CI es verificar que el estado del repo sea publicable y no solo que compile parcialmente.

### Publicacion CD y versionado

- **D-07:** CD se dispara por tags `v*` y crea release en modo draft.
- **D-08:** El draft release debe adjuntar dos artefactos: instalador `.exe` y paquete `portable` comprimido en `.zip`.
- **D-09:** El flujo de build/release se mantiene en GitHub Actions y se alinea con el runtime objetivo Windows ya existente.

### Hooks locales (Husky)

- **D-10:** Se conservan como obligatorios los hooks existentes: `.husky/pre-commit`, `.husky/commit-msg`, `.husky/pre-push`.
- **D-11:** El pre-push debe seguir funcionando como barrera local previa a push para reducir fallos en CI.

### the agent's Discretion

- Implementacion exacta de la auto-asignacion (action y permisos) y fallback tecnico cuando el bot no pueda asignarse.
- Estructura exacta del job matrix/separacion de jobs de CI para balancear tiempo de ejecucion vs claridad de fallos.
- Convencion final de nombres de artefactos para release draft mientras incluya `.exe` y `portable.zip`.

</decisions>

<specifics>
## Specific Ideas

- El usuario pide explicitamente: "con CI verificar que todo este bien" y "con CD crear el ejecutable y publicarlo en GitHub".
- El usuario pide publicar tanto instalador `.exe` como variante portable en `.zip`.
- El usuario confirma mantener los hooks actuales en Husky: `pre-commit`, `commit-msg`, `pre-push`.

</specifics>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product scope and phase tracking

- `.planning/ROADMAP.md` — Phase 12 definition (`CI/CD`) and dependency chain.
- `.planning/PROJECT.md` — Desktop/offline constraints and milestone context.
- `.planning/REQUIREMENTS.md` — Current requirement baseline and quality constraints.
- `.planning/STATE.md` — Current execution state and roadmap evolution.

### Existing CI/CD implementation baseline

- `.github/workflows/ci.yml` — Current CI gates (`lint`, `type-check`) and branch triggers.
- `.github/workflows/build.yml` — Current Windows build/release artifact flow for `.exe`.
- `package.json` — Canonical scripts used by local and CI gates (`lint`, `build`, `build:win`).

### Local quality gates and commit discipline

- `.husky/pre-commit` — Local staged quality gate.
- `.husky/commit-msg` — Commit message convention enforcement.
- `.husky/pre-push` — Local pre-push hard gate.
- `commitlint.config.cjs` — Conventional commits policy used by `commit-msg` hook.

### Codebase mapping guidance for planning

- `.planning/codebase/STACK.md` — Runtime/tooling versions and CI environment assumptions.
- `.planning/codebase/INTEGRATIONS.md` — Existing GitHub Actions and release integration context.
- `.planning/codebase/TESTING.md` — Current absence of automated tests and migration implications for gate design.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `.github/workflows/ci.yml`: already provides PR/push validation scaffold with Node setup and dependency cache.
- `.github/workflows/build.yml`: already builds Windows installer with `electron-rebuild` and artifact upload.
- `package.json`: already centralizes executable quality commands (`lint`, `build`, `build:win`) reusable by workflows and hooks.
- `.husky/*`: existing local gate chain already integrated into developer flow.

### Established Patterns

- GitHub Actions is the canonical automation platform in this repo.
- Quality gates currently rely on static checks/build, with no complete test runner wired yet.
- Windows is the primary packaged target in automation.
- Release-trigger pattern via tags already exists and should be extended, not replaced.

### Integration Points

- CI updates land in `.github/workflows/ci.yml` (triggers + required checks).
- CD release updates land in `.github/workflows/build.yml` (draft release + multi-asset publish).
- Any new test gate requires script-level alignment in `package.json` and compatibility with `.husky/pre-push`.

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

_Phase: 12-ci-cd_
_Context gathered: 2026-04-09_
