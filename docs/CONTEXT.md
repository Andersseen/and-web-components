# CONTEXT.md — Verified Repo Snapshot (do not re-analyze)

**Purpose:** this file transfers everything a previous agent session already
verified by reading the actual code, so a new session (possibly a smaller model)
can start working immediately **without re-exploring the repo**. Trust these
facts unless a file you open contradicts them; if it does, update this file.

**Snapshot date:** 2026-07-08 · branch `main`, dirty (wrapper move + event
rename in progress). **Companion docs:** [SSD.md](./SSD.md) (architecture spec)
· [CODEMAP.md](./CODEMAP.md) (task→files) ·
[AGENT-PLAYBOOKS.md](./AGENT-PLAYBOOKS.md) (recipes) · [PLAN.md](./PLAN.md)
(phased work plan) · [../AGENTS.md](../AGENTS.md) (hard rules).

---

## 1. What this repo is

pnpm-workspace monorepo for the `@andersseen/*` web-component ecosystem. Layers:
`headless-core` (pure TS state machines, no DOM) → `web-components` (StencilJS,
Shadow DOM, Tailwind v3 + CVA) → generated Angular wrappers + Astro integration.
Parallel `vanilla-components` (zero-dep Custom Elements on the same headless
core). Satellites: `icon` (87 SVG icons), `motion` (animations), `layout`
(SCSS→CSS attribute utilities). Deploys 3 Cloudflare Pages sites (storybook /
landing / demo).

## 2. Toolchain (verified)

- pnpm `10.30.1` pinned via `packageManager` in root `package.json`. Workspace
  globs: `packages/*`, `apps/*` (**not** `apps/*/projects/*`).
- Node 22 in all CI workflows. No `engines` field exists. README claims Node
  18+.
- TypeScript 5.9, Stencil ^4.43, Vitest 4, Storybook 10 (with v8 leftovers, see
  §8), ESLint 10 flat config, Prettier 3, Husky + lint-staged (Prettier only),
  Changesets 2, wrangler ^3.99 (root devDep).

## 3. Packages (all verified from package.json files)

| npm name                          | dir                           | version | notes                                                                            |
| --------------------------------- | ----------------------------- | ------- | -------------------------------------------------------------------------------- | ------------------------ |
| `@andersseen/headless-components` | `packages/headless-core`      | 0.1.2   | ESM+CJS via 2×tsc + `scripts/fix-esm-extensions.cjs`; per-module subpath exports |
| `@andersseen/web-components`      | `packages/web-components`     | 0.0.8   | Stencil; deps: headless, icon, motion (workspace) + cva, clsx, tailwind-merge    |
| `@andersseen/vanilla-components`  | `packages/vanilla-components` | 0.0.1   | zero production deps (hard rule); motion via dynamic import only                 |
| `@andersseen/icon`                | `packages/icon-library`       | —       | 87 `export const` icons in `src/icons.ts` + `registry.ts`                        |
| `@andersseen/motion`              | `packages/motion-core`        | —       | `MotionController`/`initMotion` + `createMotionPlayer`; `src/core.css`           |
| `@andersseen/layout`              | `packages/layout-core`        | —       | pure SCSS → CSS, no JS                                                           |
| `@andersseen/astro`               | `packages/astro`              | —       | integration injects registration scripts; options `components: 'all'             | string[]`, `icons: bool` |
| `@andersseen/angular-components`  | `packages/angular-components` | 0.0.1   | Generated Angular standalone directives; first-class workspace package           |
| `@andersseen/react-components`    | `packages/react-components`   | 0.0.1   | Generated React wrappers; first-class workspace package                          |
| `@andersseen/vue-components`      | `packages/vue-components`     | 0.0.1   | Generated Vue 3 wrappers; first-class workspace package                          |
| `@andersseen/astro-landing` (app) | `apps/astro-landing`          | private | Astro + Playwright e2e                                                           |
| `angular-workspace` (app)         | `apps/angular-workspace`      | private | Angular CLI workspace: demo-app only (angular-components moved to packages)      |

## 4. Component inventory (verified by listing dirs)

- **Stencil components (24 folders in
  `packages/web-components/src/components/`):** accordion, alert, badge,
  breadcrumb, button, card, carousel, code, context-menu, control, drawer,
  dropdown, icon, input, menu-list, modal, navbar, pagination, select, sidebar,
  skeleton, tabs, toast, tooltip. `and-code` now has source, spec, and story.
- **Headless modules (19 in `packages/headless-core/src/`):** accordion, alert,
  breadcrumb, button, carousel, context-menu, drawer, dropdown, input, machine,
  menu, menu-list, modal, navbar, select, sidebar, tabs, toast, tooltip (+
  `types/common.ts`, `utils/store.ts`, `utils/id.ts`, `template.ts.example`).
- **Vanilla components (3):** vanilla-button, vanilla-accordion, vanilla-modal
  (each with colocated `.test.ts`).
- README component table lists all **24** components; synced in Phase 3 and
  again 2026-07-13 (added `and-control`).

## 5. Key architecture facts

- `StateStore` (`headless-core/src/utils/store.ts`): Set-based pub/sub, NOT
  EventTarget (breaks Stencil mock-doc). `state` getter returns frozen shallow
  copy. `setState(partial)` does per-key shallow reference equality and **skips
  notify if nothing changed** → mutating nested objects won't notify; replace
  them.
- Stencil pattern (reference: `and-button.tsx`): create headless factory in
  `componentWillLoad()`, subscribe with `renderTick` `@State()` counter,
  unsubscribe in `disconnectedCallback()`, `@Watch()` forwards prop changes to
  headless actions. CVA variant maps + `cn()` (`src/utils/cn.ts`). `and-button`
  also hoists host `role`/`tabindex` onto inner element (nested-interactive a11y
  fix) and auto-adds `rel="noopener noreferrer"` for `target="_blank"`.
- `stencil.config.ts`: `globalStyle: src/global/document.css`;
  `buildEs5: false`; explicit `bundles` grouping components (new components must
  be added to a bundle); output targets: `dist` (+`../loader`),
  `dist-custom-elements` (`auto-define-custom-elements`, then
  `scripts/generate-all-barrel.cjs` builds `components/all`), `docs-readme`,
  `docs-custom-elements-manifest`, `angularOutputTarget` → writes to
  `packages/angular-components/src/lib/stencil-generated/` (never hand-edit).
- Tailwind **v3** in web-components via `@stencil-community/postcss` (do NOT
  migrate to v4 — incompatible with per-component Shadow DOM pipeline). Apps use
  Tailwind v4.
- Tokens: bare HSL triplets (`--primary: 243 75% 59%`) consumed as
  `hsl(var(--primary))`; new tokens must go in BOTH `tailwind.config.js` and
  `src/global/themes.css`. Global CSS files: `document.css`, `global.css`,
  `themes.css`, `palettes.css`, `animations.css`, `component-base.css`. 10
  prebuilt themes in `packages/web-components/themes/` exported as package
  subpaths.
- Animations wired through `packages/web-components/src/utils/animation.ts` (+
  `animation-config.ts`, `focus-trap.ts` in same utils dir); exit animations use
  `isClosing` flag to keep DOM mounted.

## 6. Build & test facts

- Build order: headless → icons → motion → web-components; vanilla needs
  headless+motion; layout independent; angular last. Root scripts:
  `build:stencil` (first 4), `build:all` (everything),
  `build:headless|icons|motion|layout|vanilla|angular`.
- `packages/web-components/vitest.config.mts`: two projects — `spec`
  (`src/**/*.spec.{ts,tsx}`, `environment: 'stencil'`) and `integration`
  (`src/__tests__/`, node). **Alias maps `@andersseen/icon` →
  `../icon-library/dist/index.js`** ⇒ must run `pnpm build:stencil` (or at least
  build icons) before stencil tests. `scripts/ensure-built.cjs` guards
  `pnpm test` only.
- **Test coverage (counted 2026-07-08):**
  - headless: **19 of 19 non-util modules tested**.
  - stencil specs: **23/23** (`and-code` spec added in wrapper move session).
  - stories: **23/23** (`and-code` story added in wrapper move session).
  - e2e: ~~3 `*.e2e.ts` files~~ removed in Phase 4 (deprecated Puppeteer tests).
- Husky pre-commit = `pnpm exec lint-staged` = **Prettier only** (AGENTS.md
  previously claimed ESLint too — inaccurate).

## 7. CI/CD & release facts (verified from workflow files)

- `.github/workflows/ci-cd.yml` (push main/develop, PR→main): lint → `build:all`
  → `test:headless` → stencil `test:spec` → vanilla tests → motion tests →
  upload artifacts (now includes `packages/angular-components/dist/`,
  `packages/react-components/dist/`, `packages/vue-components/dist/`) → deploy
  Storybook to CF Pages (main/develop).
- `.github/workflows/release.yml` (push main): `pnpm build:all`, then
  `changesets/action@v1` (version PR titled "chore: version packages" / publish
  with `NPM_TOKEN`).
- `.github/workflows/deploy-demo.yml` and `deploy-landing.yml` (push main):
  `pnpm deploy:cloudflare:actions` / `pnpm deploy:landing:actions`.
- `.changeset/config.json`: ignores `@andersseen/astro-landing`,
  `angular-workspace`; includes the new `@andersseen/angular-components`,
  `@andersseen/react-components`, and `@andersseen/vue-components`;
  `updateInternalDependencies: patch`; access public.
- Secrets required: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
  `NPM_TOKEN`.
- `.github/DEPLOYMENT.md` reflects the 4 real workflow files and the Changesets
  release flow (updated in Phase 3).
- Root `package.json` no longer has legacy `publish:headless` /
  `publish:web-components` scripts. The only publish path is Changesets via
  `release.yml`.

## 8. Verified issues / debt (full register: SSD.md §15, TD-1…TD-10)

1. **TD-4 (high):** ~~legacy publish scripts bypass Changesets~~ removed in
   Phase 2.
2. **TD-5 (high):** ~~`@andersseen/angular-components` outside workspace +
   Changesets; publishing path undocumented.~~ Resolved in wrapper move session
   (2026-07-08): moved to `packages/angular-components`, added React/Vue
   wrappers, all built by `build:all` and released via Changesets.
3. **TD-3 (high):** ~~test gaps listed in §6 for headless carousel/input/menu~~
   covered in Phase 6; remaining gaps are Stencil specs and stories.
4. **TD-7 (medium):** ~~`packages/web-components` devDeps mix Storybook 10 with
   `@storybook/manager-api`/`@storybook/theming` v8; leftover `jest`,
   `jest-cli`, `@types/jest`, `puppeteer`, `lit`~~ cleaned up in Phase 4 (kept
   `lit`; root `wrangler@^3.99` bump remains optional).
5. **TD-1/TD-2 (medium):** ~~README table and DEPLOYMENT.md drift~~ fixed in
   Phase 3.
6. **TD-6 (low):** tracked `.DS_Store` (root + `packages/`), `.DS_Store` not
   gitignored; one-off codemods `migrate-store.mjs`, `refactor-stories.mjs` at
   repo root; local clutter `debug-storybook.log`, `storybook-static/`,
   `playwright-report/` (ignored, untracked).
7. **TD-8 (medium):** no root `LICENSE` (only
   `packages/web-components/LICENSE`), no `CONTRIBUTING.md`, no `engines`.
8. **TD-9 (medium):** ~~CI missing vanilla/motion tests; pre-commit is
   Prettier-only~~ fixed in Phase 5.
9. **TD-10 (low):** ~~event naming inconsistent.~~ Resolved in wrapper move
   session (2026-07-08): all events now follow `and<Component><Action>`
   (`andButtonClick`, `andModalClose`, `andInputChange`, etc.). Ambiguous legacy
   names (`andInput`, `andBlur`, `andClose`, `navItemClick`, `navLinkClick`,
   `tabTriggerClick`, etc.) were renamed and all references updated.

## 9. What was created in the analysis session (2026-07-05)

- `docs/SSD.md` — full spec (16 sections, ADR-1…6, invariants §13, debt register
  §15).
- `docs/CODEMAP.md` — task→files lookup + package cheat sheet + verification
  commands.
- `docs/AGENT-PLAYBOOKS.md` — recipes P1–P8 + failure-modes table.
- `CLAUDE.md` — entry pointer (reading order + quick facts).
- `AGENTS.md` — only change: added links to the docs above at the top.
- `docs/CONTEXT.md` + `docs/PLAN.md` — this file and the phased plan.

## 10. NOT yet analyzed (don't assume — verify if needed)

- Internals of `apps/angular-workspace/projects/demo-app` and
  `apps/astro-landing/src` (only structure listed).
- `packages/layout-core` SCSS internals; `packages/icon-library/src/registry.ts`
  details.
- `.storybook/` config contents; `.github/scripts/analyze-bundle.js` and
  `deploy.sh`.
- Whether `@andersseen/vanilla-components` / `@andersseen/astro` have ever been
  published to npm.
- Root `eslint.config.mjs` contents; per-package eslint configs.

## 11. Session log (append one line per work session)

| Date       | Session did                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Phases touched |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| 2026-07-05 | Full repo analysis; created SSD/CODEMAP/PLAYBOOKS/CLAUDE.md/CONTEXT/PLAN                                                                                                                                                                                                                                                                                                                                                                                                                                 | —              |
| 2026-07-05 | Phase 1: removed tracked .DS_Store and codemods; added LICENSE, CONTRIBUTING.md, engines, prettier ignores                                                                                                                                                                                                                                                                                                                                                                                               | 1              |
| 2026-07-05 | Phase 2: removed legacy publish:headless / publish:web-components scripts; updated SSD.md and CONTEXT.md                                                                                                                                                                                                                                                                                                                                                                                                 | 2              |
| 2026-07-05 | Phase 3: synced README and DEPLOYMENT.md with repo reality                                                                                                                                                                                                                                                                                                                                                                                                                                               | 3              |
| 2026-07-05 | Phase 4: removed Storybook v8 deps and unused test frameworks; deleted deprecated e2e tests; kept lit                                                                                                                                                                                                                                                                                                                                                                                                    | 4              |
| 2026-07-05 | Phase 5: added vanilla/motion tests to CI; aligned AGENTS.md with Prettier-only pre-commit                                                                                                                                                                                                                                                                                                                                                                                                               | 5              |
| 2026-07-05 | Phase 6: added headless tests for carousel, input, menu; 19/19 modules covered                                                                                                                                                                                                                                                                                                                                                                                                                           | 6              |
| 2026-07-05 | Phase 7: added Stencil specs for badge, breadcrumb, card, pagination                                                                                                                                                                                                                                                                                                                                                                                                                                     | 7              |
| 2026-07-05 | Phase 8: added Stencil specs for carousel, context-menu, menu-list; skeleton story; fixed carousel clamping                                                                                                                                                                                                                                                                                                                                                                                              | 8              |
| 2026-07-08 | Wrapper architecture: moved Angular to packages/angular-components; added React/Vue wrappers; renamed all events to `and<Component><Action>`; updated docs, CI, and lint config                                                                                                                                                                                                                                                                                                                          | 9, 10          |
| 2026-07-13 | Fase 1 stabilization: fixed `packages/angular-components` test script (added vitest + public-API smoke test); cleaned 4 lint warnings (motion-player curly, icon registry `any`, navbar/sidebar `no-useless-assignment`); corrected stale `apps/angular-workspace/projects/angular-components` path refs and 23→24 component counts in AGENTS.md/CODEMAP.md/SSD.md/CONTEXT.md; added SSD.md §1.1 "Positioning" and README "Package Roles" sections explaining product core / foundation / adapters tiers | 1              |
