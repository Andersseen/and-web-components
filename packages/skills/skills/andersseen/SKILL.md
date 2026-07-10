---
name: andersseen
description:
  'Orchestrator for the Andersseen front-end ecosystem. Use this to decide WHICH
  Andersseen library to reach for and route to its focused skill before writing
  code. Trigger phrases: andersseen, @andersseen, and-* component, andersseen
  design system, which andersseen package, build a UI with andersseen, headless
  logic, icon, motion animation, layout attributes, attribute behaviors,
  progressive enhancement, splitter, drag and drop, tooltip, dialog. Routes to:
  andersseen-web-components, andersseen-headless-core, andersseen-icon,
  andersseen-motion, andersseen-layout, andersseen-behaviors.'
---

# Andersseen — ecosystem orchestrator

You are working in a project that uses the **Andersseen** front-end ecosystem: a
set of small, framework-agnostic libraries that compose. Your job in this skill
is to **pick the right library for the task and defer to its focused skill**
instead of guessing an API.

Each library is documented by a dedicated skill (one library, one skill). Load
the matching skill's guidance before generating code for that library. If a
sibling skill is not installed, tell the user how to add it (see _Install_).

## Routing table — task → library → skill

| The user wants to…                                                                    | Library                           | Skill                       |
| ------------------------------------------------------------------------------------- | --------------------------------- | --------------------------- |
| Drop styled, ready-made UI (`<and-button>`, `<and-modal>`, …)                         | `@andersseen/web-components`      | `andersseen-web-components` |
| Build a **custom** UI but reuse state/a11y/keyboard logic                             | `@andersseen/headless-components` | `andersseen-headless-core`  |
| Render or register SVG icons (`<and-icon>`, `getIcon`)                                | `@andersseen/icon`                | `andersseen-icon`           |
| Animate on scroll/hover/tap via HTML attributes                                       | `@andersseen/motion`              | `andersseen-motion`         |
| Compose layout & typography with `and-layout` / `and-text`                            | `@andersseen/layout`              | `andersseen-layout`         |
| Enhance existing HTML with `and-*` behaviors (splitter, drag & drop, tooltip, dialog) | `@andersseen/behaviors`           | `andersseen-behaviors`      |

## How the layers relate

```
headless-core   →  pure TS state machines + ARIA + keyboard (no DOM, no CSS)
     ↓
web-components  →  Stencil custom elements (Shadow DOM) built ON headless-core + icon
```

`icon`, `motion`, and `layout` are independent satellites usable from any
framework or from plain HTML.

## Decision guide

1. **Need a component that already exists?** (button, card, modal, tabs, drawer,
   navbar, select, input…) → use `web-components`. Do **not** re-implement it
   with headless-core.
2. **Building something the library doesn't ship, but that needs correct
   open/close, focus, keyboard, or ARIA?** → use `headless-core` and provide
   your own markup/styles.
3. **Just icons?** → `icon`. Remember `registerIcons(COMPONENT_ICONS)` is
   required whenever `web-components` is used.
4. **Just motion/entrance animation?** → `motion` (attribute-driven, respects
   `prefers-reduced-motion`).
5. **Just layout/spacing/typography without a utility framework?** → `layout`.
6. **Enhancing existing HTML in place** with resizable splitters, HTML5 drag &
   drop, hover/focus tooltips, or modal dialogs — no framework, no new custom
   element? → `behaviors` (attribute-driven `defineBehaviors()` or imperative
   `create*`). Distinct from `headless-core` (pure logic, no DOM) and from
   vanilla custom elements (new tags).

You can combine several — e.g. `web-components` + `icon` + `motion`. When you
do, follow each library's own skill rules; never invent props, classes, or
attributes that a skill does not document.

## Global rules for every Andersseen library

- Use the **real package names** exactly: `@andersseen/web-components`,
  `@andersseen/headless-components`, `@andersseen/icon`, `@andersseen/motion`,
  `@andersseen/layout`, `@andersseen/behaviors`.
- Only use public props, slots, events, attributes, and exported functions that
  the relevant skill documents. Never target internal Shadow DOM parts.
- Prefer design-token CSS variables over hardcoded colors.
- Clean up: call the `cleanup()`/`destroy()` handles that a library returns when
  unmounting SPA views.

## Install

Skills are distributed via the `@andersseen/skills` CLI:

```bash
# install the orchestrator + everything
npx @andersseen/skills add --all

# or add just the ones you need
npx @andersseen/skills add andersseen web-components icon

# download to ./andersseen-skills/ to review before activating
npx @andersseen/skills add layout --download
```

Runtime packages install normally, e.g.:

```bash
npm i @andersseen/web-components @andersseen/icon
```
