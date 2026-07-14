# ROADMAP — Prioritized Work Plan

**Purpose:** the ordered backlog for this repo. Any agent (or human) asked to
"improve the repo", "continue the roadmap", or "fix what's pending" should pick
the **first unchecked item**, execute it following the linked playbook, verify
the Definition of Done, then update this file (check the box, add one line to
the CONTEXT.md session log) and SSD §15 if a TD item is affected.

**Rules for executing a roadmap item:**

1. Read [CONTEXT.md](./CONTEXT.md) first — do not re-analyze the repo.
2. One item per session/PR. Do not batch unrelated items.
3. Every item lists its verification commands — all must pass before done.
4. New/changed behavior needs a changeset (`pnpm changeset`, playbook P7) if it
   touches a published package. Docs/CI-only changes need no changeset.
5. If an item turns out bigger than expected, split it: finish a shippable
   slice, add the remainder as a new unchecked sub-item here.

Related: debt register
[SSD.md §15](./SSD.md#15-known-gaps-and-technical-debt-register) (TD-IDs
referenced below) · recipes [AGENT-PLAYBOOKS.md](./AGENT-PLAYBOOKS.md) (P-IDs
referenced below).

---

## R1 — Now: credibility & correctness (do these first, in order)

- [x] **R1.1 — Complete the CI test matrix** _(done 2026-07-14 · TD-9 · small ·
      CI-only)_ Added to the `build-and-test` job in
      `.github/workflows/ci-cd.yml`, after `pnpm -C packages/motion-core test`:
      `pnpm test:behaviors`, `pnpm -C packages/icon-library test`,
      `pnpm -C packages/layout-core test`,
      `pnpm -C packages/angular-components test`,
      `pnpm -C packages/react-components test`,
      `pnpm -C packages/vue-components test`. All run after `pnpm build:all`.
      **DoD:** all six commands run green locally after `pnpm build:all`; TD-9
      closed in SSD §15.

- [ ] **R1.2 — Native form participation for `and-input`** _(TD-12 · medium ·
      playbook **P9**)_ `formAssociated: true` + `@AttachInternals()`,
      `setFormValue` on every value change, Enter → `form.requestSubmit()`,
      `formResetCallback`, `formDisabledCallback`, "In a form" Storybook story.
      **DoD:** per P9. Changeset: `minor` for `@andersseen/web-components`.

- [ ] **R1.3 — Native form participation for `and-select`** _(TD-12 · medium ·
      playbook **P9**)_ Same as R1.2 minus implicit submission (no
      Enter-to-submit for listbox-style controls). Closing this item closes
      TD-12 for existing components; keep TD-12 noted as a requirement for
      future controls.

- [x] **R1.4 — Debt-register hygiene** _(done 2026-07-14)_ TD-4 marked resolved;
      TD-9 narrowed; TD-12…TD-15 added; CONTEXT §8 de-duplicated into a pointer;
      P9 playbook added; this file created.

## R2 — Next: close the adoption gaps

- [ ] **R2.1 — `and-switch`** _(TD-13 · playbooks P1 → P2, form-associated per
      P9 from day one)_ Headless module first
      (`packages/headless-core/src/switch/`), then Stencil component. Smallest
      of the missing form controls — establishes the pattern the rest will copy.
- [ ] **R2.2 — `and-checkbox`** _(TD-13 · P1 → P2 + P9; include indeterminate
      state in the headless model)_
- [ ] **R2.3 — `and-textarea`** _(TD-13 · P2 + P9; reuse the `input` headless
      module if its state model fits — decide in the PR, don't fork logic
      blindly)_
- [ ] **R2.4 — `and-radio-group` + `and-radio`** _(TD-13 · P1 → P2 + P9; roving
      tabindex keyboard model lives in headless)_
- [ ] **R2.5 — `and-slider`** _(TD-13 · P1 → P2 + P9; hardest — arrow/home/end
      keys, `aria-valuenow/min/max`, RTL)_
- [ ] **R2.6 — Docs site skeleton** _(TD-14 · medium-large)_ New `apps/docs`
      (Astro Starlight, dogfooding `@andersseen/astro`). Phase 1 = one page per
      component rendering the **generated** `readme.md` API tables plus a
      hand-written usage example; deploy to Cloudflare Pages like the other two
      apps. **DoD:** site builds in CI, deploys, and covers all 24+ components.
- [ ] **R2.7 — Browser e2e for interactive components** _(TD-15 · medium)_
      Playwright suite (new `packages/web-components/e2e/` or reuse the
      astro-landing setup) running against built Storybook: modal focus trap,
      select keyboard nav, dropdown dismiss, tabs arrows, drawer Esc. **DoD:**
      suite runs in CI on PRs; failures block merge.
- [ ] **R2.8 — File the upstream TD-11 issue** _(small · no code)_ Open a GitHub
      issue on `stenciljs/output-targets` with the eager `defineCustomElementFn`
      analysis from SSD §15 TD-11 (it is complete and verifiable). Link the
      issue back into TD-11.

## R3 — Later: maturity

- [ ] **R3.1 — Path to 1.0.** Write `docs/STABILITY.md`: which packages/APIs are
      frozen, breaking-change policy, deprecation window. Then a coordinated
      `1.0.0` changeset for core + headless once R1/R2 form items are shipped.
- [ ] **R3.2 — Visual regression** _(TD-15 second half)_ Playwright screenshot
      assertions for representative components across the 6 palettes × 2 modes
      (light/dark), against built Storybook.
- [ ] **R3.3 — High-value complex components:** combobox (filterable), date
      picker, data table. Each is its own multi-session project: headless state
      machine first, spec'd in an ADR before code.
- [ ] **R3.4 — SSR story.** Investigate Stencil hydrate / Declarative Shadow DOM
      for Astro + Angular SSR consumers; write findings as an ADR in SSD §14
      before implementing anything.
- [ ] **R3.5 — TD-11 real fix** once (if) upstream ships deferred registration:
      regenerate wrappers, restore the 1.7 MB → realistic bundle budget in
      `angular.json`.

---

## Deliberately NOT on the roadmap

- Migrating Stencil to Tailwind v4 — incompatible with the per-component Shadow
  DOM pipeline (see AGENTS.md); revisit only if Stencil's PostCSS story changes.
- Rewriting wrappers by hand to work around TD-11 — upstream problem.
- Adding more satellite packages — breadth is the current risk, not the gap.

## Changelog of this file

| Date       | Change                                    |
| ---------- | ----------------------------------------- |
| 2026-07-14 | Created (R1–R3 seeded from repo analysis) |
