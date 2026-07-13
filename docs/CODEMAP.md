# CODEMAP — Where Everything Lives

Fast lookup table for contributors and AI agents. Format: _"I want to … → touch
these files."_ Architecture and rationale: [SSD.md](./SSD.md). Step-by-step
recipes: [AGENT-PLAYBOOKS.md](./AGENT-PLAYBOOKS.md). Hard rules:
[AGENTS.md](../AGENTS.md).

## Task → Files

| I want to…                                                                          | Files/dirs to touch                                                                                                                                                | Never touch                                                            |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Add/change **component behavior** (state, keyboard, ARIA)                           | `packages/headless-core/src/<component>/<component>.ts` + `__tests__/`                                                                                             | Anything DOM-related in headless-core                                  |
| Add/change a **styled UI component**                                                | `packages/web-components/src/components/and-<name>/` (`.tsx`, `.css`, `.stories.ts`, `.spec.tsx`) + `stencil.config.ts` (`bundles`)                                | `readme.md` (generated), `src/components.d.ts` (generated)             |
| Add a **vanilla (zero-dep) component**                                              | `packages/vanilla-components/src/components/vanilla-<name>.ts` + `.test.ts` + export in `src/index.ts`                                                             | Adding any production dependency                                       |
| Add/change an **`and-*` attribute behavior** (splitter, drag-drop, tooltip, dialog) | `packages/behaviors/src/<behavior>/` (`create-*.ts`, `types.ts`, `*.test.ts`, `index.ts`) + register attrs in `src/define-behaviors.ts` + export in `src/index.ts` | Adding any production dependency                                       |
| Add an **icon**                                                                     | `packages/icon-library/src/icons.ts` (SVG const) + `src/registry.ts` if registry list changes                                                                      | —                                                                      |
| Add/change an **animation preset**                                                  | `packages/motion-core/src/core.css` (keyframes) + `motion-controller.ts` / `motion-player.ts`                                                                      | —                                                                      |
| Add a **layout/typography utility**                                                 | `packages/layout-core/src/_*.scss`                                                                                                                                 | —                                                                      |
| Add/adjust a **design token**                                                       | `packages/web-components/tailwind.config.js` **and** `packages/web-components/src/global/themes.css` (both, always)                                                | —                                                                      |
| Add a **theme**                                                                     | `packages/web-components/themes/<name>.css` + subpath export in `packages/web-components/package.json`                                                             | —                                                                      |
| Change **global styles / dark mode / palettes**                                     | `packages/web-components/src/global/{themes,palettes,document,animations,component-base}.css`                                                                      | —                                                                      |
| Wire an **`animated` prop** into a component                                        | `packages/web-components/src/utils/animation.ts` + the component `.tsx` (use `isClosing` flag)                                                                     | —                                                                      |
| Change **focus trap** behavior                                                      | `packages/web-components/src/utils/focus-trap.ts`                                                                                                                  | —                                                                      |
| Change **class merging / variants** helpers                                         | `packages/web-components/src/utils/cn.ts`, CVA maps live inside each component `.tsx`                                                                              | —                                                                      |
| Change the **Astro integration**                                                    | `packages/astro/src/integration.ts`                                                                                                                                | —                                                                      |
| Change **Angular wrappers**                                                         | Regenerate by building Stencil (`pnpm build:stencil`)                                                                                                              | `packages/angular-components/src/lib/stencil-generated/**` (generated) |
| Update the **demo app**                                                             | `apps/angular-workspace/projects/demo-app/`                                                                                                                        | —                                                                      |
| Update the **landing page**                                                         | `apps/astro-landing/src/` (`sections/`, `components/`, `pages/`)                                                                                                   | `apps/astro-landing/.astro/` (generated)                               |
| Change **Storybook** setup/theme                                                    | `packages/web-components/.storybook/` (`main.ts`, `preview.ts`, `AndersseenTheme.ts`, `Introduction.mdx`)                                                          | `storybook-static/` (build output)                                     |
| Change **CI / deploys**                                                             | `.github/workflows/{ci-cd,release,deploy-demo,deploy-landing}.yml`, `.github/scripts/`                                                                             | —                                                                      |
| Change **release config**                                                           | `.changeset/config.json`, root `package.json` scripts                                                                                                              | —                                                                      |
| Change **lint/format**                                                              | root + per-package `eslint.config.mjs`, `.prettierrc.json`, `lint-staged` in root `package.json`                                                                   | —                                                                      |

## Package cheat sheet

| npm name                          | Directory                                  | Kind                  | Build command                            |
| --------------------------------- | ------------------------------------------ | --------------------- | ---------------------------------------- |
| `@andersseen/headless-components` | `packages/headless-core`                   | TS lib (ESM+CJS)      | `pnpm build:headless`                    |
| `@andersseen/web-components`      | `packages/web-components`                  | Stencil               | `pnpm build:stencil` (builds deps first) |
| `@andersseen/vanilla-components`  | `packages/vanilla-components`              | TS lib, zero deps     | `pnpm build:vanilla`                     |
| `@andersseen/behaviors`           | `packages/behaviors`                       | TS lib (ESM+CJS)      | `pnpm build:behaviors`                   |
| `@andersseen/icon`                | `packages/icon-library`                    | TS lib                | `pnpm build:icons`                       |
| `@andersseen/motion`              | `packages/motion-core`                     | TS lib + CSS          | `pnpm build:motion`                      |
| `@andersseen/layout`              | `packages/layout-core`                     | SCSS → CSS            | `pnpm build:layout`                      |
| `@andersseen/astro`               | `packages/astro`                           | Astro integration     | (tsc via package script)                 |
| `@andersseen/angular-components`  | `packages/angular-components`              | Generated Angular lib | `pnpm build:angular`                     |
| — (app)                           | `apps/angular-workspace/projects/demo-app` | Angular app           | `pnpm build:angular`                     |
| — (app)                           | `apps/astro-landing`                       | Astro site            | `pnpm build:astro`                       |

## Key single files

| File                                                               | Why it matters                                                                          |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `packages/headless-core/src/utils/store.ts`                        | `StateStore` — the reactive core. Read before touching any headless module.             |
| `packages/headless-core/src/template.ts.example`                   | Canonical headless module shape.                                                        |
| `packages/web-components/src/components/and-button/and-button.tsx` | Reference Stencil component (renderTick, CVA, a11y host-role handling).                 |
| `packages/web-components/stencil.config.ts`                        | Output targets, component bundles, PostCSS/Tailwind wiring, Angular wrapper generation. |
| `packages/web-components/vitest.config.mts`                        | Test projects (`spec` / `integration`); aliases require icon-library to be built.       |
| `packages/web-components/src/utils/animation.ts`                   | The only sanctioned way to wire `animated` props.                                       |
| `scripts/fix-esm-extensions.cjs`                                   | Post-tsc ESM extension fixer used by all plain-TS packages.                             |
| `.github/skills/and-component/SKILL.md`                            | Full component-authoring workflow + quality checklist (with `references/`).             |

## Verification commands (run from repo root)

```bash
pnpm build:stencil                              # build headless+icons+motion+stencil (needed before stencil tests)
pnpm test:headless                              # headless unit tests
pnpm -C packages/web-components test:spec       # stencil component specs
pnpm -C packages/vanilla-components test        # vanilla tests
pnpm -C packages/motion-core test               # motion tests
pnpm lint && pnpm format:check                  # quality gates (CI runs these)
pnpm storybook                                  # visual check at localhost:6006
```
