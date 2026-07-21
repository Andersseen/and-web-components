# @andersseen/skills

## 0.0.2

### Patch Changes

- a8162f2: Documents the new Tailwind-optional styling paths (`tokens.css`,
  `elements.css`, `tailwind-preset`) and clarifies that `and-theme` now has a
  full structural effect (navbar/sidebar/carousel dimensions, motion, focus
  ring), not just radius/spacing, plus the custom-theme override recipe.

## 0.0.1

### Patch Changes

- 0d52ebb: Add `@andersseen/skills`: a zero-dependency CLI to install
  per-library AI agent skills (Claude Code, Cursor, …) into consumer projects.
  Ships one focused skill per library (`andersseen-web-components`,
  `andersseen-headless-core`, `andersseen-icon`, `andersseen-motion`,
  `andersseen-layout`) plus an `andersseen` orchestrator that routes to the
  right one. Supports two modes — install into `.claude/skills/` or download
  into `andersseen-skills/` for review — via
  `npx @andersseen/skills add <name...>`, `--all`, `--download`, or an
  interactive picker.
