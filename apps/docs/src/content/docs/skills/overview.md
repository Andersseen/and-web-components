---
title: Skills — Overview
description:
  Installable AI agent skills (Claude Code and compatible tools) for the
  Andersseen ecosystem — one focused skill per library, plus an orchestrator.
---

`@andersseen/skills` isn't a runtime dependency you import — it's a CLI that
copies ready-made **AI agent skill** files (`SKILL.md`) into your project's
`.claude/skills/`, teaching a coding agent how to use each Andersseen package
correctly: real package names, verified APIs, no invented props. One focused
skill per library, plus an orchestrator that routes between them. Works with any
agent that reads the `.claude/skills/` convention (Claude Code, and compatible
tools) — zero runtime dependencies, Node built-ins only.

## Quick start

```bash
# Interactive: pick skills, then choose install or download
npx @andersseen/skills

# Install everything (orchestrator + all libraries)
npx @andersseen/skills add --all

# Add just what you need
npx @andersseen/skills add andersseen web-components icon
```

`pnpm dlx @andersseen/skills …` and `yarn dlx @andersseen/skills …` work the
same way.

## The two modes

| Mode         | Command flag        | Destination            | Use when                                |
| ------------ | ------------------- | ---------------------- | --------------------------------------- |
| **Install**  | _(default)_         | `./.claude/skills/`    | Activate immediately for your agent     |
| **Download** | `--download` / `-d` | `./andersseen-skills/` | Review the `SKILL.md` before activating |

## Available skills

| Skill                       | Alias            | Library                           |
| --------------------------- | ---------------- | --------------------------------- |
| `andersseen`                | `orchestrator`   | Ecosystem router (start here)     |
| `andersseen-web-components` | `web-components` | `@andersseen/web-components`      |
| `andersseen-headless-core`  | `headless-core`  | `@andersseen/headless-components` |
| `andersseen-icon`           | `icon`           | `@andersseen/icon`                |
| `andersseen-motion`         | `motion`         | `@andersseen/motion`              |
| `andersseen-layout`         | `layout`         | `@andersseen/layout`              |
| `andersseen-behaviors`      | `behaviors`      | `@andersseen/behaviors`           |

```bash
npx @andersseen/skills list   # print the same table with descriptions
```

Names accept either form — the full folder name (`andersseen-web-components`) or
the short alias (`web-components`), matched case-insensitively. `all` (or `*`)
selects every skill.

## Commands

```
npx @andersseen/skills                       Interactive picker
npx @andersseen/skills list                  List available skills
npx @andersseen/skills add <name...>         Install into ./.claude/skills/
npx @andersseen/skills add --all             Install every skill
npx @andersseen/skills add <name> --download Download into ./andersseen-skills/

Options: -d/--download  -a/--all  -f/--force  -h/--help
```

Installing skips a target folder that already exists unless `--force` is passed
— safe to re-run `add` without clobbering a skill you've since customized
locally.

## Recommended: start with the orchestrator

Install `andersseen` alongside the per-library skills. It decides **which**
library fits a task and defers to the focused skill, so the agent reaches for
the right package instead of guessing:

```bash
npx @andersseen/skills add andersseen web-components headless-core icon motion layout behaviors
# ≡ npx @andersseen/skills add --all
```

## How a skill is discovered

Each `SKILL.md` starts with frontmatter the CLI reads to build the picker and
the `list` output:

```md
---
name: andersseen-web-components
description:
  'Use ready-made, styled Andersseen UI custom elements
  (@andersseen/web-components). Load when placing or wiring and-* elements —
  and-button, and-card, and-modal, … Trigger phrases: and-* component,
  andersseen web component, stencil custom element, shadow dom UI, design
  tokens.'
---
```

`name` becomes the folder name copied into `.claude/skills/`; the alias shown in
the table above is just that name with the `andersseen-` prefix stripped.
`description` is what your agent actually reads to decide _when_ to load the
skill — it's written as a dense list of trigger phrases and concrete API names
on purpose, not prose, since that's what a model matches a task against before
it ever opens the file.

## Next steps

Each skill's own `SKILL.md` covers its library in depth once installed — these
docs pages are the human-readable equivalent of the same verified information.
