# @andersseen/skills

Installable **AI agent skills** for the Andersseen ecosystem — one focused skill
per library, plus an orchestrator that routes between them. Works with any agent
that reads `.claude/skills/` (Claude Code, and compatible tools).

Each skill teaches an agent how to use **one** library correctly (real package
names, verified APIs, no invented props), so you can install only what your
project needs.

## Quick start

```bash
# Interactive: pick skills, then choose install or download
npx @andersseen/skills

# Install everything (orchestrator + all libraries)
npx @andersseen/skills add --all

# Add just what you need
npx @andersseen/skills add andersseen web-components icon
```

`pnpm dlx @andersseen/skills …` and `yarn dlx @andersseen/skills …` work too.

## The two modes

| Mode         | Command flag        | Destination            | Use when                              |
| ------------ | ------------------- | ---------------------- | ------------------------------------- |
| **Install**  | _(default)_         | `./.claude/skills/`    | Activate immediately for your agent   |
| **Download** | `--download` / `-d` | `./andersseen-skills/` | Review the SKILL.md before activating |

## Available skills

| Skill                       | Alias            | Library                           |
| --------------------------- | ---------------- | --------------------------------- |
| `andersseen`                | `orchestrator`   | Ecosystem router (start here)     |
| `andersseen-web-components` | `web-components` | `@andersseen/web-components`      |
| `andersseen-headless-core`  | `headless-core`  | `@andersseen/headless-components` |
| `andersseen-icon`           | `icon`           | `@andersseen/icon`                |
| `andersseen-motion`         | `motion`         | `@andersseen/motion`              |
| `andersseen-layout`         | `layout`         | `@andersseen/layout`              |

```bash
npx @andersseen/skills list   # print the same table with descriptions
```

## Commands

```
npx @andersseen/skills                       Interactive picker
npx @andersseen/skills list                  List available skills
npx @andersseen/skills add <name...>         Install into ./.claude/skills/
npx @andersseen/skills add --all             Install every skill
npx @andersseen/skills add <name> --download Download into ./andersseen-skills/

Options: -d/--download  -a/--all  -f/--force  -h/--help
```

Names accept the full folder name (`andersseen-web-components`) or the short
alias (`web-components`). `all` selects everything.

## Recommended: start with the orchestrator

Install `andersseen` alongside the per-library skills. It decides **which**
library fits a task and defers to the focused skill — so the agent reaches for
the right package instead of guessing.

```bash
npx @andersseen/skills add andersseen web-components headless-core icon motion layout
# ≡ npx @andersseen/skills add --all
```
