# PLAN.md — Phased Improvement Plan

Fixes everything in the debt register ([SSD.md §15](./SSD.md), summarized in
[CONTEXT.md §8](./CONTEXT.md)). Designed so **each phase fits in one fresh agent
session**: small scope, low context, clear verification. Doing few things per
session — but done well — beats doing many things halfway.

## How to run a phase (session protocol)

1. Start a fresh session. Give the agent: `docs/CONTEXT.md` + the single phase
   section below (copy-paste it).
2. The agent does **only** that phase. Anything discovered out of scope → add a
   note to the "Parking lot" at the bottom, don't fix it.
3. Every phase ends with: run the phase's **Verify** commands, then update this
   file (check the boxes, set status) and append one line to the Session log in
   `CONTEXT.md`.
4. If a phase changes facts recorded in `CONTEXT.md` or `SSD.md` (e.g. removes a
   script, fixes coverage), update those docs in the same session — that's part
   of the phase.
5. Commit per phase (`chore:`/`fix:`/`test:`/`docs:` prefix). Don't mix phases
   in one commit.

**Recommended order:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10. Phases 1–5 are
independent quick wins; 6–8 are test work; 9–10 need a human decision first.

| Phase | Theme                                                   | Risk   | Status    |
| ----- | ------------------------------------------------------- | ------ | --------- |
| 1     | Repo hygiene & governance                               | none   | ☑ done    |
| 2     | Release safety (kill legacy publish path)               | low    | ☑ done    |
| 3     | Documentation sync                                      | none   | ☑ done    |
| 4     | Dependency cleanup (Storybook v8/v10 mix, dead deps)    | medium | ☑ done    |
| 5     | CI completeness & pre-commit truth                      | low    | ☑ done    |
| 6     | Headless test coverage (carousel, input, menu)          | low    | ☑ done    |
| 7     | Stencil specs — batch 1 (static components)             | low    | ☑ done    |
| 8     | Stencil specs — batch 2 (interactive) + missing stories | medium | ☑ done \* |
| 9     | Angular package integration (decision needed)           | high   | ☐ pending |
| 10    | Event naming convention (decision needed)               | low    | ☐ pending |

---

## Phase 1 — Repo hygiene & governance (TD-6, TD-8)

**Goal:** clean tracked junk, add the missing governance files. Zero behavior
change.

- [x] `git rm --cached .DS_Store packages/.DS_Store` and add `.DS_Store` to root
      `.gitignore`.
- [x] Delete one-off codemods `migrate-store.mjs` and `refactor-stories.mjs`
      from repo root (they were single-use migration scripts; git history
      preserves them).
- [x] Add root `LICENSE` (MIT, copyright Andersseen — mirror
      `packages/web-components/LICENSE`).
- [x] Add `"engines": { "node": ">=20" }` to root `package.json` (CI uses 22;
      README says 18+ — align README to 20+ while at it, or leave README to
      Phase 3).
- [x] Optional: add a minimal `CONTRIBUTING.md` that just points to `README.md`,
      `AGENTS.md`, and `docs/`.

**Verify:** `git ls-files | grep -i ds_store` → empty ·
`pnpm lint && pnpm format:check` pass · `pnpm build:stencil` still succeeds.
**Definition of Done:** no tracked OS junk; LICENSE + engines exist; nothing
else changed.

---

## Phase 2 — Release safety (TD-4)

**Goal:** one and only one publish path (Changesets via CI).

- [x] Remove `publish:headless` and `publish:web-components` scripts from root
      `package.json` (they use `--no-git-checks` and a hardcoded `/private/tmp`
      npm cache — bypassing Changesets risks version drift). If the owner wants
      an emergency hatch, rename to `publish:emergency:*` with a `echo WARNING`
      prefix instead of deleting.
- [x] Confirm `release.yml` remains the only publish trigger; grep the repo for
      other `pnpm publish` / `npm publish` invocations (check
      `.github/scripts/deploy.sh` too) and remove/flag any found.
- [x] Update `docs/SSD.md` §11.2 and `docs/CONTEXT.md` §7 to reflect the
      removal.

**Verify:**
`grep -rn "pnpm publish\|npm publish" package.json .github/ scripts/` → only
Changesets-managed usage remains · `pnpm lint` passes. **Definition of Done:**
direct-publish scripts gone (or explicitly marked emergency-only), docs updated.

---

## Phase 3 — Documentation sync (TD-1, TD-2)

**Goal:** make README and DEPLOYMENT.md tell the truth. No code changes.

- [x] README component table: add `and-code`, `and-select`, `and-skeleton`
      (verify the live list against
      `ls packages/web-components/src/components/`).
- [x] README package table + structure diagram: add
      `@andersseen/vanilla-components` and `@andersseen/astro`; mention
      `apps/astro-landing`'s Playwright e2e.
- [x] README "24+ components" claim → use the real count.
- [x] README prerequisites: align Node version with the `engines` field from
      Phase 1.
- [x] Rewrite `.github/DEPLOYMENT.md` to match reality: 4 workflow files
      (`ci-cd.yml`, `release.yml`, `deploy-demo.yml`, `deploy-landing.yml`),
      Changesets release flow (no "version bump commit"), correct job list. Keep
      the local-deploy and troubleshooting sections (still valid).
- [x] README "Publishing to npm" section: describe the Changesets flow
      (`pnpm changeset` → merge → version PR → publish), not manual
      `pnpm release`.

**Verify:** every component named in the README table has a matching folder;
every script named in docs exists in root `package.json`; every workflow
described exists in `.github/workflows/`. **Definition of Done:** zero
references to nonexistent scripts/jobs/flows in README + DEPLOYMENT.md.

---

## Phase 4 — Dependency cleanup (TD-7)

**Goal:** remove version-mix time bombs in `packages/web-components`
devDependencies. **Medium risk — verify Storybook thoroughly.**

- [x] Remove `@storybook/manager-api@^8` and `@storybook/theming@^8`; in
      Storybook 10 these APIs are provided by the `storybook` core package —
      update imports in `.storybook/manager.ts` and
      `.storybook/AndersseenTheme.ts` to `storybook/manager-api` /
      `storybook/theming` (check current SB10 docs for exact specifiers).
- [x] Remove unused test leftovers: `jest`, `jest-cli`, `@types/jest`,
      `puppeteer` (first
      `grep -rn "from 'jest\|require('jest\|puppeteer" packages/web-components/src`
      and check `*.e2e.ts` files — if the 3 e2e files import puppeteer/jest,
      either delete those e2e files in this phase or keep the deps and only note
      it in the parking lot; do NOT leave half).
- [x] Check whether `lit` devDep is actually used
      (`grep -rn "from 'lit'" packages/web-components`); remove if not
      (Storybook web-components framework may need it — if so, keep and comment
      why in SSD).
- [ ] Optional (separate commit): bump root `wrangler` ^3 → ^4 and run one
      manual deploy command in dry-run/verify mode.
- [x] `pnpm install` to refresh lockfile.

**Verify:** `pnpm -C packages/web-components build` ·
`pnpm -C packages/web-components test:spec` · `pnpm build-storybook` succeeds
**and** `pnpm storybook` renders stories with the custom theme intact ·
`pnpm lint`. **Definition of Done:** no v8 Storybook packages in the tree
(`pnpm why @storybook/manager-api` → not found), no unused test frameworks,
Storybook builds and looks unchanged.

---

## Phase 5 — CI completeness & pre-commit truth (TD-9)

**Goal:** CI tests everything that has tests; hooks do what docs claim.

- [x] `ci-cd.yml`: after the stencil spec step, add steps:
      `pnpm -C packages/vanilla-components test` and
      `pnpm -C packages/motion-core test`.
- [x] Decide pre-commit scope (pick one, document it):
  - (a) add ESLint to lint-staged
    (`"*.{ts,tsx}": ["eslint --fix", "prettier --write"]`) — matches what
    AGENTS.md claims; slower commits; or
  - (b) keep Prettier-only and fix the AGENTS.md sentence ("Husky runs Prettier;
    run `pnpm lint` yourself before pushing").
  - Default recommendation: **(b)** — CI already gates lint, and (a) can be slow
    on Stencil files.
- [x] Update `AGENTS.md` "Common Mistakes" item 5 accordingly.

**Verify:** YAML valid (`npx yaml-lint` or push to a branch and watch Actions) ·
run both new test commands locally first — they must pass before adding them to
CI (vanilla/motion need `pnpm build:headless` + `pnpm build:motion` built first;
confirm `build:all` earlier in the job covers this). **Definition of Done:** CI
runs headless + stencil + vanilla + motion tests; hook behavior and docs agree.

---

## Phase 6 — Headless test coverage (TD-3a)

**Goal:** Vitest tests for the 3 untested headless modules. One module at a
time; if the session runs long, finishing fewer modules well is fine — update
the checkboxes honestly.

- [x] `packages/headless-core/src/carousel/__tests__/carousel.test.ts`
- [x] `packages/headless-core/src/input/__tests__/input.test.ts`
- [x] `packages/headless-core/src/menu/__tests__/menu.test.ts`

For each: read the module first; copy the structure of a good sibling test (e.g.
`tabs` or `dropdown` tests). Cover: initial state (defaults + config overrides),
every action, subscribe/unsubscribe semantics, `get*Props()` ARIA output, edge
cases (bounds on carousel index, disabled input, empty menu). **Test observed
behavior — if you find a real bug, do not silently change the module: write the
failing test, note it in the Parking lot, and skip-with-comment if needed.**

**Verify:** `pnpm test:headless` all green · coverage of the three modules
visible in `pnpm -C packages/headless-core test:coverage`. **Definition of
Done:** 19/19 headless modules have tests (update CONTEXT.md §6).

---

## Phase 7 — Stencil specs, batch 1: static components (TD-3b)

**Goal:** specs for the low-interactivity components. Template: any existing
sibling `.spec.tsx` (e.g. `and-button.spec.tsx`).

- [x] `and-badge.spec.tsx` — renders, variant classes applied, slot content
      projected.
- [x] `and-card.spec.tsx` — variant/padded classes applied, slot projected.
- [x] `and-breadcrumb.spec.tsx` — nav/ol render with ARIA roles and custom
      label, size variants and slot projection.
- [x] `and-pagination.spec.tsx` — page buttons render, current page marked,
      `andPageChange` emitted on page change, disabled prev/next at bounds.

**Precondition:** `pnpm build:stencil` once. **Verify:**
`pnpm -C packages/web-components test:spec` green · `pnpm lint`. **Definition of
Done:** 4 new spec files pass; no source changes (bugs found → Parking lot).

---

## Phase 8 — Stencil specs, batch 2: interactive + missing stories (TD-3b/c)

**Goal:** specs for the interactive remainder, plus the 2 missing stories. These
need keyboard/ARIA assertions — read the component and its headless module
first.

- [x] `and-carousel.spec.tsx` — slide navigation, indicators, events.
- [x] `and-context-menu.spec.tsx` — opens on contextmenu event, closes on
      Esc/outside, ARIA menu roles.
- [x] `and-menu-list.spec.tsx` — roles, selection event, disabled items.
- [ ] `and-code.spec.tsx` — **blocked:**
      `packages/web-components/src/components/and-code/and-code.tsx` does not
      exist (only `readme.md`).
- [x] `and-skeleton.stories.ts`.
- [ ] `and-code.stories.ts` — **blocked:** no `and-code` component source.

**Verify:** `pnpm -C packages/web-components test:spec` green ·
`pnpm build-storybook` succeeds · open Storybook and check the two new stories +
a11y addon panel. **Definition of Done:** 23/23 components have specs, 23/23
have stories (update CONTEXT.md §6 and SSD.md §10).

---

## Phase 9 — Angular package integration (TD-5) — ⚠ needs owner decision first

**Goal:** give `@andersseen/angular-components` a sanctioned
versioning/publishing path. **Ask the user which option before implementing.**

Options to present:

- **A (recommended, larger):** move the library into the pnpm workspace — add
  `apps/angular-workspace/projects/*` to `pnpm-workspace.yaml` (or relocate the
  lib to `packages/angular-components`), keep `ng build` as its build script,
  remove it from `.changeset/config.json` ignore-list implications, wire
  `release.yml` to build it before publish. Risks: Angular CLI expects its
  workspace layout; `ng-packagr` output dir handling; `angularOutputTarget`
  paths in `stencil.config.ts` must be updated if relocated.
- **B (smaller):** keep it outside; add an explicit `publish:angular` CI job
  (manual `workflow_dispatch`) that runs `pnpm build:angular` and publishes
  `dist/angular-components`; document the flow in DEPLOYMENT.md and SSD §5.8.

Either way: document the decision as ADR-7 in `docs/SSD.md` §14.

**Verify (A):** `pnpm install` clean, `pnpm build:all` green, `changeset status`
lists the package. **(B):** dry-run the publish job
(`pnpm -C ... pack --dry-run`). **Definition of Done:** a documented, repeatable
publish path exists; ADR-7 written; CONTEXT.md §3/§8 updated.

---

## Phase 10 — Event naming convention (TD-10) — needs owner decision

**Goal:** one authoritative event-naming rule. Today: skill docs say
`and<Action>` (`andOpen`), but `and-button` emits `andButtonClick`.

- [ ] Inventory actual event names:
      `grep -rn "@Event()" packages/web-components/src/components/ -A1`.
- [ ] Present the split to the owner and pick a rule (recommendation: **keep
      existing names as-is** — renaming is a breaking change for consumers — and
      declare the rule _for new events only_: short-form `and<Action>` unless
      ambiguous when bubbling, e.g. click events may embed the component name).
- [ ] Write the chosen rule in exactly one place (SSD §7), and make
      `AGENTS.md` + `.github/skills/and-component/SKILL.md` reference it instead
      of restating examples that conflict.

**Verify:** grep shows docs no longer contradict each other. **Definition of
Done:** single documented rule; no consumer-facing renames unless the owner
explicitly approves a major bump.

---

## Parking lot

Out-of-scope discoveries land here (date + one line). Next planning session
triages them into phases.

- (empty)
