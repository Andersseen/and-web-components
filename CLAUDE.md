# CLAUDE.md

Read these, in this order, before making changes:

1. [AGENTS.md](./AGENTS.md) — hard rules, package boundaries, forbidden
   patterns.
2. [docs/CODEMAP.md](./docs/CODEMAP.md) — where every kind of change lives
   ("task → files" table).
3. [docs/AGENT-PLAYBOOKS.md](./docs/AGENT-PLAYBOOKS.md) — step-by-step recipes
   with verification commands for common tasks (new component, new icon, bug
   fix, release).
4. [docs/SSD.md](./docs/SSD.md) — full architecture spec, contracts, ADRs, and
   invariants (§13 is a self-check list).

Quick facts:

- pnpm 10 monorepo (`packages/*`, `apps/*`). Node 22. Always `pnpm`, never
  npm/yarn.
- Layers: `headless-core` (pure TS logic, no DOM) → `web-components` (Stencil,
  Shadow DOM, Tailwind v3 + CVA) → generated Angular wrappers / Astro
  integration. `vanilla-components` = zero-dependency Custom Elements on the
  same headless core.
- Run `pnpm build:stencil` once per session before Stencil tests — they need
  sibling `dist/` folders.
- Verification gate for any change: `pnpm lint`, the affected package's tests,
  and `pnpm build:stencil` if you touched `packages/*`.
- Never edit generated files: `stencil-generated/**`, component `readme.md`,
  `src/components.d.ts`, `custom-elements.json`.
- Releases go through Changesets (`pnpm changeset`); never publish directly.
