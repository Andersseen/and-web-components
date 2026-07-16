# CONTEXT.md — Verified Repo Snapshot (do not re-analyze)

**Purpose:** this file transfers everything a previous agent session already
verified by reading the actual code, so a new session (possibly a smaller model)
can start working immediately **without re-exploring the repo**. Trust these
facts unless a file you open contradicts them; if it does, update this file.

**Snapshot date:** 2026-07-15 · branch `main`, clean. **Companion docs:**
[SSD.md](./SSD.md) (architecture spec) · [CODEMAP.md](./CODEMAP.md) (task→files)
· [AGENT-PLAYBOOKS.md](./AGENT-PLAYBOOKS.md) (recipes) ·
[ROADMAP.md](./ROADMAP.md) (prioritized backlog) · [PLAN.md](./PLAN.md)
(**phased execution plan F0–F12, recreated 2026-07-15** — sessions told to "do
phase FN" start there) · [../AGENTS.md](../AGENTS.md) (hard rules).

---

## 1. What this repo is

pnpm-workspace monorepo for the `@andersseen/*` web-component ecosystem. Layers:
`headless-core` (pure TS state machines, no DOM) → `web-components` (StencilJS,
Shadow DOM, Tailwind v3 + CVA) → generated Angular wrappers + Astro integration.
Parallel `vanilla-components` (zero-dep Custom Elements on the same headless
core). Satellites: `icon` (87 SVG icons), `motion` (animations), `layout`
(SCSS→CSS attribute utilities). Deploys 4 Cloudflare Pages sites (storybook /
landing / demo / docs — see §4.1).

## 2. Toolchain (verified)

- pnpm `10.30.1` pinned via `packageManager` in root `package.json`. Workspace
  globs: `packages/*`, `apps/*` (**not** `apps/*/projects/*`).
- Node 22 in all CI workflows. Root `package.json` declares
  `"engines": { "node": ">=20" }`; README says Node v20+.
- TypeScript 5.9, Stencil ^4.43, Vitest 4, Storybook 10 (with v8 leftovers, see
  §8), ESLint 10 flat config, Prettier 3, Husky + lint-staged (Prettier only),
  Changesets 2, wrangler ^3.99 (root devDep).

## 3. Packages (all verified from package.json files)

Versions below verified 2026-07-14; they drift fast — trust `package.json` over
this column.

| npm name                          | dir                           | version | notes                                                                                            |
| --------------------------------- | ----------------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| `@andersseen/headless-components` | `packages/headless-core`      | 0.1.3   | ESM+CJS via 2×tsc + `scripts/fix-esm-extensions.cjs`; per-module subpath exports                 |
| `@andersseen/web-components`      | `packages/web-components`     | 0.2.0   | Stencil; deps: headless, icon, motion (workspace) + cva, clsx, tailwind-merge                    |
| `@andersseen/vanilla-components`  | `packages/vanilla-components` | 0.1.0   | zero production deps (hard rule); motion via dynamic import only                                 |
| `@andersseen/behaviors`           | `packages/behaviors`          | 0.1.0   | attribute-driven DOM behaviors (splitter, drag-drop, tooltip, dialog); zero production deps      |
| `@andersseen/icon`                | `packages/icon-library`       | 0.0.3   | 87 `export const` icons in `src/icons.ts` + `registry.ts`                                        |
| `@andersseen/motion`              | `packages/motion-core`        | 0.1.1   | `MotionController`/`initMotion` + `createMotionPlayer`; `src/core.css`                           |
| `@andersseen/layout`              | `packages/layout-core`        | 0.0.1   | pure SCSS → CSS, no JS                                                                           |
| `@andersseen/astro`               | `packages/astro`              | 0.0.1   | integration injects registration scripts; options `components: 'all' \| string[]`, `icons: bool` |
| `@andersseen/angular-components`  | `packages/angular-components` | 0.2.0   | Generated Angular standalone directives; first-class workspace package                           |
| `@andersseen/react-components`    | `packages/react-components`   | 0.2.0   | Generated React wrappers; first-class workspace package                                          |
| `@andersseen/vue-components`      | `packages/vue-components`     | 0.2.0   | Generated Vue 3 wrappers; first-class workspace package                                          |
| `@andersseen/skills`              | `packages/skills`             | 0.0.1   | installable AI agent skills + `and-skills` CLI; no build step                                    |
| `@andersseen/astro-landing` (app) | `apps/astro-landing`          | private | Astro + Playwright e2e                                                                           |
| `angular-workspace` (app)         | `apps/angular-workspace`      | private | Angular CLI workspace: demo-app only (angular-components moved to packages)                      |
| `@andersseen/docs` (app)          | `apps/docs`                   | private | Astro Starlight docs site (~70 pages, all packages) — full facts in §4.1                         |

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

## 4.1 Docs app (`apps/docs`) — verified 2026-07-15

- Astro 5 + Starlight ^0.37, dogfoods `@andersseen/astro`. Content in
  `src/content/docs/`: 24 component pages, 19 headless pages, plus motion (3) /
  icon (1) / layout (6) / behaviors (6) / vanilla (1) / skills (1) /
  framework-adapters (4) / guides (1, Getting Started only) / splash
  `index.mdx`.
- Sidebar lives in `apps/docs/sidebar.config.mjs` (split out of
  `astro.config.mjs`, which imports it).
- `astro.config.mjs` has two local mechanisms (both well-commented in-file): a
  `productCoreInit()` integration that page-injects imports and exposes
  `window.andHeadless` / `window.andMotion` / `window.andBehaviors` (+
  side-effect import of vanilla-components) for the live examples; and a head
  script mirroring Starlight's `data-theme` onto `and-mode` (palette set to
  `indigo-rose`).
- **API tables on component pages are auto-generated** (as of PLAN F1,
  2026-07-16) via `apps/docs/src/components/ApiTables.astro`, which reads the
  generated `packages/web-components/src/components/<tag>/readme.md` at build
  time. All 24 component pages are `.mdx` and render
  `<ApiTables tag="and-x" />`. The 6 compound components (accordion, breadcrumb,
  card, carousel, menu-list, tabs — multiple `@Component` tags per directory, so
  Stencil's `docs-readme` output collides into one `readme.md`) use
  `<ApiTables tag="and-x" fallback>` with hand-written tables in the slot
  instead. TD-16 closed.
- Tests: `src/__tests__/sidebar.test.ts` (vitest, node env — sidebar↔content
  parity) and `e2e/docs.spec.ts` (Playwright chromium, webServer =
  `pnpm build && pnpm preview` on :4321). **Broken on main as of 2026-07-15:**
  the sidebar test still reads `astro.config.mjs` for slugs, which moved to
  `sidebar.config.mjs`, so 1/3 tests fails — fix is PLAN F0. Neither test runs
  in CI yet (also F0).
- Root scripts: `start:docs:dev`, `build:docs` (builds stencil + motion +
  layout + behaviors + vanilla + astro-integration first), `test:docs`,
  `test:e2e:docs`, `deploy:docs`, `deploy:docs:actions`.
- Deploy: `.github/workflows/deploy-docs.yml` (push main) → CF Pages project
  `and-web-components-docs` (auto-creates the project via CF API if missing);
  `apps/docs/wrangler.jsonc` sets `pages_build_output_dir: dist`.

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
- `.github/workflows/deploy-docs.yml` (push main): `pnpm deploy:docs:actions`
  (see §4.1). The docs app's own tests are NOT in `ci-cd.yml` — PLAN F0.
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

## 8. Verified issues / debt

**Single source of truth:**
[SSD.md §15](./SSD.md#15-known-gaps-and-technical-debt-register) (TD-1…TD-15).
Earlier snapshots kept a full copy of the register here and it drifted twice —
**do not duplicate entries in this file again**; update SSD §15 and, if
priorities change, [ROADMAP.md](./ROADMAP.md).

Open items as of 2026-07-16: **TD-11** (Angular wrapper tree-shaking — upstream
bug, don't try to fix locally), **TD-13** (missing form controls:
checkbox/radio/switch/textarea/slider — High), **TD-15** (no browser e2e /
visual regression). **TD-12 resolved 2026-07-16** — both `and-input` and
`and-select` turned out to already be the light-DOM shape (see P9 step 0); no
component in this repo has yet needed the `shadow: true` + `ElementInternals`
path. **TD-14 resolved** (via PLAN F0) and **TD-16 resolved** (via PLAN F1, docs
API tables now auto-generated by `ApiTables.astro`) — both closed in SSD §15 and
ROADMAP. TD-9 closed 2026-07-14 (CI test matrix complete). TD-7 has one optional
leftover (root `wrangler` v3 bump). Everything else (TD-1…TD-6, TD-8, TD-10) is
resolved.

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

| Date       | Session did                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Phases touched |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| 2026-07-05 | Full repo analysis; created SSD/CODEMAP/PLAYBOOKS/CLAUDE.md/CONTEXT/PLAN                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | —              |
| 2026-07-05 | Phase 1: removed tracked .DS_Store and codemods; added LICENSE, CONTRIBUTING.md, engines, prettier ignores                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 1              |
| 2026-07-05 | Phase 2: removed legacy publish:headless / publish:web-components scripts; updated SSD.md and CONTEXT.md                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 2              |
| 2026-07-05 | Phase 3: synced README and DEPLOYMENT.md with repo reality                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 3              |
| 2026-07-05 | Phase 4: removed Storybook v8 deps and unused test frameworks; deleted deprecated e2e tests; kept lit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 4              |
| 2026-07-05 | Phase 5: added vanilla/motion tests to CI; aligned AGENTS.md with Prettier-only pre-commit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 5              |
| 2026-07-05 | Phase 6: added headless tests for carousel, input, menu; 19/19 modules covered                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 6              |
| 2026-07-05 | Phase 7: added Stencil specs for badge, breadcrumb, card, pagination                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 7              |
| 2026-07-05 | Phase 8: added Stencil specs for carousel, context-menu, menu-list; skeleton story; fixed carousel clamping                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 8              |
| 2026-07-08 | Wrapper architecture: moved Angular to packages/angular-components; added React/Vue wrappers; renamed all events to `and<Component><Action>`; updated docs, CI, and lint config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 9, 10          |
| 2026-07-13 | Fase 1 stabilization: fixed `packages/angular-components` test script (added vitest + public-API smoke test); cleaned 4 lint warnings (motion-player curly, icon registry `any`, navbar/sidebar `no-useless-assignment`); corrected stale `apps/angular-workspace/projects/angular-components` path refs and 23→24 component counts in AGENTS.md/CODEMAP.md/SSD.md/CONTEXT.md; added SSD.md §1.1 "Positioning" and README "Package Roles" sections explaining product core / foundation / adapters tiers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 1              |
| 2026-07-14 | Docs maintenance + planning: marked TD-4 resolved and narrowed TD-9 to the real remaining CI gaps; added TD-12…TD-15 to SSD §15 (form participation, missing form controls, docs site, browser e2e/visual tests); replaced CONTEXT §8 duplicate register with pointer to SSD §15; refreshed §2 engines fact and §3 package versions, added behaviors/skills rows; created docs/ROADMAP.md; added playbook P9 (form-associated components) to AGENT-PLAYBOOKS.md; linked ROADMAP from CLAUDE.md                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | —              |
| 2026-07-15 | Docs review + planning: full review of `apps/docs` and repo state; created [PLAN.md](./PLAN.md) (phases F0–F12: hygiene/CI, docs API-table automation, R1.3, R2.1–R2.5 form controls, guides, e2e, visual regression, 1.0); added §4.1 (docs app facts) + `deploy-docs.yml` to §7; found `apps/docs` sidebar test broken on main (reads astro.config.mjs, slugs moved to sidebar.config.mjs — fix in F0); flagged TD-14 as factually resolved pending F0 bookkeeping                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | —              |
| 2026-07-14 | R1.1: added behaviors/icon-library/layout-core/Angular/React/Vue test steps to `ci-cd.yml`, closing TD-9. R1.2: found (verified live in a browser) that `and-input` already had native form participation via its light-DOM `scoped: true` architecture, so implementing P9's Shadow DOM + `ElementInternals` as originally written would have broken working behavior and risked duplicate `FormData` entries; fixed the real gap instead (resync on native `form.reset()`), added a "In a form" story, and corrected P9/TD-12/ROADMAP to document the light-DOM-vs-custom-widget distinction for future form controls; TD-12 stays open for `and-select` (R1.3)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 2026-07-16 | PLAN F0: fixed `apps/docs/src/__tests__/sidebar.test.ts` (`configPath` now points at `sidebar.config.mjs`, not `astro.config.mjs` — the sidebar moved there and the test was silently seeing zero slugs); `pnpm test:docs` now 3/3 green. Added `pnpm test:docs` + `pnpm -C apps/docs build` steps to `build-and-test` in `ci-cd.yml` (verified YAML parses, docs build green — 68 pages). Closed R2.6/TD-14 (docs site already exceeds original DoD), registered TD-16 (hand-synced API tables) in SSD §15.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | F0             |
| 2026-07-16 | PLAN F1: added `apps/docs/src/components/ApiTables.astro` (build-time, reads generated `packages/web-components/src/components/<tag>/readme.md`, hand-rolled table/Methods parser — deliberately not a markdown-renderer dependency). Converted all 24 `apps/docs/src/content/docs/components/*.md` pages to `.mdx`; 18 single-tag components use `<ApiTables tag="and-x" />`, the 6 compound components (accordion, breadcrumb, card, carousel, menu-list, tabs — multiple `@Component` tags sharing one directory, so Stencil's `docs-readme` output collides into one `readme.md`) use `<ApiTables tag="and-x" fallback>` wrapping the existing hand-written tables. Hit and fixed two bugs along the way: (1) MDX parses `{...}` in unfenced `<script>` blocks as JS expressions — the 7 pages with a live inline `<script>` (drawer, dropdown, context-menu, menu-list, pagination, modal, toast) needed their braces backslash-escaped; the same script duplicated inside a fenced \`\`\`html block was unaffected. (2) `extractSection`'s original regex used `$` under the `m` flag, which matches every line ending, not just end-of-string, silently truncating every section to its header row — replaced with index-based boundary search. Verified: `pnpm test:docs` green, `pnpm -C apps/docs build` green (checked rendered HTML has real table rows, not empty `<tbody>`), `pnpm lint` clean. `pnpm test:e2e:docs` has one pre-existing, unrelated failure (sidebar has two "Button" links — Components and Headless Core — so the getting-started page's exact-match click is ambiguous; confirmed via empty git diff on `sidebar.config.mjs`/`e2e/docs.spec.ts` that this predates this session) — not fixed, out of scope for F0/F1. TD-16 closed in SSD §15. | F1             |
| 2026-07-16 | PLAN F2: read `and-select.tsx` before implementing R1.3's original "needs `shadow: true` + `ElementInternals`" plan and found it already renders `scoped: true` (light DOM) with a hidden `<input type="hidden">` mirroring `value` — same shape as `and-input`, confirmed live in a browser via Playwright (built `dist/index.js`, drove a real `<form>`: `FormData` already included the value; `<fieldset disabled>` already disabled the trigger natively, Playwright itself refused to click it). The one real gap, worse than `and-input`'s: Stencil re-stamps the hidden input's `value` _attribute_ on every selection change, dragging its native reset-default along with it, so `form.reset()` was a complete no-op (verified live before fixing). Fixed with the same `reset`-listener pattern as `and-input` (`and-select.tsx`), plus a new headless `setSelectedValue` action in `packages/headless-core/src/select/select.ts` (unlike `selectValue`, doesn't require a matching option — needed to restore "no selection"). Added spec tests + an "In a form" Storybook story (submit/reset/fieldset-disabled). Corrected ROADMAP R1.3, SSD TD-12, and AGENT-PLAYBOOKS P9 (which had wrongly cited `and-select` as the shadow-DOM-shape example) to record that both form controls investigated so far are the light-DOM shape — no component in this repo has yet needed `ElementInternals`.                                                                                                                                                                                                                                                                                                                                                                     | F2             |
