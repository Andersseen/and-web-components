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

- [x] **R1.2 — Native form participation for `and-input`** _(done 2026-07-14 ·
      TD-12 · playbook **P9** step 0)_ Turned out `and-input` already uses light
      DOM (`scoped: true`), so its inner `<input>` is a real descendant of the
      wrapping `<form>` — `FormData`, `required` validation, and Enter-to-submit
      already worked natively, verified live in a browser. `shadow: true` +
      `ElementInternals` would have broken that (and risked double-submitting
      the field, since `name` is reflected onto both host and inner input).
      Implemented instead: a `reset` listener on `this.el.closest('form')`
      (added in `connectedCallback`, removed in `disconnectedCallback`) so the
      component's internal state resyncs after a native `form.reset()`. Added
      spec tests + an "In a form" Storybook story (submit/reset, prints
      `FormData`). P9 and TD-12 corrected to reflect this. **DoD:** met — see
      P9. Changeset: `minor` for `@andersseen/web-components`.

- [x] **R1.3 — Native form participation for `and-select`** _(done 2026-07-16 ·
      TD-12 · playbook **P9** step 0)_ The 2026-07-14 note above was wrong:
      verified by reading `and-select.tsx` (and confirmed live in a browser via
      Playwright) that it already renders `scoped: true` (light DOM) with a
      hidden `<input type="hidden">` mirroring `value` — the same shape as
      `and-input`, not the "custom widget with no real nested form control"
      shape. `shadow: true` + `ElementInternals` was never needed and would have
      broken the working `FormData` mechanism. `<fieldset disabled>` already
      works natively too (verified: the trigger `<button>` picks up real
      browser-level disabled inheritance, `:disabled` CSS applies, clicks are
      suppressed — confirmed by Playwright itself refusing to click it). The one
      genuine gap, and it's worse than `and-input`'s: Stencil re-stamps the
      hidden input's `value` **attribute** on every selection change, which
      drags its native reset-default along with it, so `form.reset()` was a
      complete no-op (restored the _last selected_ value, not the true default)
      — verified live before the fix. Fixed with the same "listen for `reset` on
      `this.el.closest('form')`" pattern as `and-input` (P9 step 0), plus a new
      `setSelectedValue` headless action (unlike `selectValue`, it doesn't
      require a matching option, needed to restore "no selection"). Added spec
      tests + an "In a form" Storybook story (submit/reset/fieldset- disabled).
      Changeset: `minor` for `@andersseen/web-components` and
      `@andersseen/headless-components`. Closes TD-12 for existing components;
      keep TD-12/P9 step 0 as the required first check for future controls —
      this is now the _second_ time assuming the shadow-DOM shape without
      checking the actual code would have been wrong.

- [x] **R1.4 — Debt-register hygiene** _(done 2026-07-14)_ TD-4 marked resolved;
      TD-9 narrowed; TD-12…TD-15 added; CONTEXT §8 de-duplicated into a pointer;
      P9 playbook added; this file created.

## R2 — Next: close the adoption gaps

- [x] **R2.1 — `and-switch`** _(done 2026-07-16 · TD-13 · playbooks P1 → P2 +
      P9)_ Headless module first (`packages/headless-core/src/switch/`,
      `createSwitch`), then the Stencil component. **P9 step 0 check paid off
      again** (third time in a row): rather than assuming the "no nestable
      native control surface" path from P9's original note, built it around a
      real `<input type="checkbox" role="switch">` in light DOM (`scoped: true`,
      like `and-input`/`and-select`) — the visible track/thumb are two sibling
      `<span>`s styled purely via Tailwind `peer-checked:`/`peer-disabled:`/
      `peer-focus-visible:` variants keyed off the checkbox's own native state,
      and wrapping everything in a `<label>` gives click-to-toggle for free.
      Verified live in a browser via Playwright: `FormData` includes/excludes
      the value correctly on checked/unchecked, `form.reset()` restores the
      default (same `reset`-listener pattern as `and-input`/`and-select`),
      `<fieldset disabled>` disables it natively, and Space toggles it when
      focused — all with zero `ElementInternals` code. Added spec tests + an "In
      a form" Storybook story + a docs page (`apps/docs/.../switch.mdx`). Also
      added the durable "docs page + sidebar entry" requirement to playbook P2
      (step 9) so F4–F7 don't have to be told separately. Smallest of the
      missing form controls — establishes the pattern the rest (checkbox, radio,
      slider) should try first before assuming `ElementInternals`.
- [ ] **R2.2 — `and-checkbox`** _(TD-13 · P1 → P2 + P9; include indeterminate
      state in the headless model)_
- [ ] **R2.3 — `and-textarea`** _(TD-13 · P2 + P9; reuse the `input` headless
      module if its state model fits — decide in the PR, don't fork logic
      blindly)_
- [ ] **R2.4 — `and-radio-group` + `and-radio`** _(TD-13 · P1 → P2 + P9; roving
      tabindex keyboard model lives in headless)_
- [ ] **R2.5 — `and-slider`** _(TD-13 · P1 → P2 + P9; hardest — arrow/home/end
      keys, `aria-valuenow/min/max`, RTL)_
- [x] **R2.6 — Docs site skeleton** _(done 2026-07-16 · TD-14 · medium-large)_
      `apps/docs` (Astro Starlight, dogfooding `@andersseen/astro`) exists and
      exceeds the original DoD: ~70 pages covering all 24+ components plus
      headless/motion/icon/layout/behaviors/vanilla/skills/framework-adapters.
      Closed via [PLAN.md](./PLAN.md) phase F0: fixed the broken
      `sidebar.test.ts` (pointed at `sidebar.config.mjs`, where the sidebar
      actually lives) and wired `pnpm test:docs` + `pnpm -C apps/docs build`
      into the `build-and-test` job in `ci-cd.yml`. **DoD met:** site builds in
      CI, deploys (`deploy-docs.yml`), covers all components. TD-14 closed in
      SSD §15; new TD-16 (hand-synced API tables) registered there, to be closed
      by PLAN F1.
- [ ] **R2.7 — Browser e2e for interactive components** _(TD-15 · medium)_
      Playwright suite (new `packages/web-components/e2e/` or reuse the
      astro-landing setup) running against built Storybook: modal focus trap,
      select keyboard nav, dropdown dismiss, tabs arrows, drawer Esc. **DoD:**
      suite runs in CI on PRs; failures block merge.
- [ ] **R2.8 — File the upstream TD-11 issue** _(small · no code)_ Open a GitHub
      issue on `stenciljs/output-targets` with the eager `defineCustomElementFn`
      analysis from SSD §15 TD-11 (it is complete and verifiable). Link the
      issue back into TD-11.
- [x] **R2.9 — Make Tailwind optional at the consumer end (works with SASS _or_
      with Tailwind)** _(done 2026-07-21 · medium)_ Added `themes/tokens.css`
      (default palette + style theme, pure `:root` custom properties, zero
      `@tailwind`) and `src/global/elements.css` (`@tailwind     utilities` only
      — no Preflight, no `body` rule), compiled separately from `document.css`
      by a new `scripts/build-elements-css.mjs` (Stencil's `globalStyle` only
      supports one entry file) and wired into the package `build` script. Added
      `tailwind-preset.js`, a shareable preset carrying the `theme.extend`
      (colors, `borderRadius`, `borderWidth`, `t-gap` spacing) that used to live
      only in `tailwind.config.js` — the internal config now does
      `presets: [require('./tailwind-preset.js')]` so the two can never drift,
      and consumers do
      `presets: [require('@andersseen/web-components/tailwind-preset')]` to get
      `bg-primary`/`rounded-lg`/`t-gap-*` resolving to the library's own tokens.
      Added `./tokens.css`, `./elements.css`, `./tailwind-preset` package
      exports; `style.css` unchanged for backwards compat. Documented both paths
      in new `apps/docs` guide `guides/styling-integration`. **DoD met:**
      verified live — `elements.css` build output has no Preflight/`body` rule
      (grep-checked) and still emits the real utility classes;
      `tailwind.config.js` resolves through the preset with `require()`;
      compiled `style.css` still produces correct `.bg-primary`/`.rounded-md`
      rules through the preset indirection. Changeset added (`minor`,
      `@andersseen/web-components`).
- [x] **R2.10 — Theme token contract + fix runtime theme-switching parity (no
      6th theme)** _(done 2026-07-21 · medium)_ Investigation corrected the
      original premise: `playful` wasn't under-designed — `themes/styles/*.css`
      (the static per-theme import files) already had the full ~36-token
      treatment (navbar/sidebar/carousel dimensions, motion timings, focus ring,
      overlay blur). The actual bug was that `src/global/themes.css` — the
      `[and-theme='…']` attribute-selector blocks that back the **documented,
      runtime** theming API (`<html and-theme="playful">` from
      `guides/getting-started`) — only ever set 6 of those ~36 tokens. So the
      one mechanism consumers are told to use produced a far weaker effect than
      the static import path. Fixed by syncing all four `themes.css` variants
      (compact/playful/retro/elegant, plus the default `:root`) to the same
      token values as their `themes/styles/*.css` counterparts, preserving the
      existing `[and-theme]`/`[data-theme]`/`:host-context()` triplication
      (Safari compat). Also switched `borderRadius` (`rounded-md`/`rounded-sm`)
      in `tailwind-preset.js` from fixed `-2px`/`-4px` offsets to a proportional
      `calc(var(--radius) * 0.75 / 0.5)` ramp, so themes with a larger
      `--radius` (e.g. `playful`) differentiate their radius steps instead of
      flattening; unchanged at the default `--radius: 0.5rem` and still `0` at
      every step for `retro` (`--radius: 0`) — no regression. Added
      `guides/theming-tokens` (full token reference + the
      `[and-theme="brand"] { --primary; --radius; … }` layering recipe, the
      shadcn/Radix override model) to `apps/docs`, linked from
      `getting-started`. **DoD met:** verified live via a built-`dist` HTML page
      screenshotted in a real browser — `and-navbar` height/padding/border now
      visibly differs across `default`/`playful`/`retro`/`compact` when only the
      `and-theme` attribute changes (previously near-identical); compiled
      `[and-theme='playful']` block confirmed to carry all 36 declarations, up
      from 6. Changeset added (`minor`, `@andersseen/web-components`).

- [x] **R2.11 — P0 correctness pass on modal / drawer / button** _(done
      2026-07-23 · TD-15-adjacent)_ Five defects found by driving the built
      `dist/` in a real browser rather than reading the specs, all now covered
      by regression tests: (1) `and-button type="submit"` never submitted its
      form (the real `<button>` is in shadow DOM, so it has no form owner) — now
      resolves the form and calls `requestSubmit()`/`reset()`, plus a new `form`
      prop; (2) the modal/drawer focus trap was a flat
      `shadowRoot.querySelectorAll()` that saw neither slotted content nor
      nested shadow roots, so Shift+Tab from the first field escaped the dialog
      — rewritten to walk the composed tree, with deep-activeElement tracking
      and stray-focus recovery; (3) `andModalClose` fired twice with `animated`
      and focus was never restored on that path; (4) the modal had no body
      scroll lock and no inert background (both now reference-counted in
      `utils/overlay-page.ts`, and the drawer's leaky `body.style.overflow = ''`
      reset was replaced with it); (5) every modal announced as "Dialog" — added
      a `label` prop plus automatic `aria-labelledby` adoption of a slotted
      heading, and stopped `createModal` inventing a generic name. Also surfaced
      `closeOnEscape`, `closeOnOverlayClick`, `hideClose`, `show()`/`hide()`,
      and the first CSS parts. **Verification:** the new
      `src/utils/focus-trap.spec.tsx` fails 5/5 against the previous
      implementation and passes 5/5 against the new one; full suite 136 specs
      (was 117) + 293 headless, `pnpm lint` clean (62 pre-existing warnings
      unchanged). Changeset: `minor` for `@andersseen/web-components` and
      `@andersseen/headless-components`.

- [ ] **R2.12 — CSS parts across the remaining components** _(TD-17 · High ·
      medium)_ 22 components still expose no `::part()` surface. Settle a naming
      convention first (it becomes public API at 1.0), then apply it component
      by component and document it. Do this **before** R3.1's freeze.

- [ ] **R2.13 — Popovers must escape `overflow: hidden`** _(TD-18 · High ·
      medium-large)_ `and-select`, `and-dropdown`, `and-tooltip`,
      `and-context-menu`, `and-menu-list` are all clipped by any scrolling or
      overflow-hidden ancestor. Prefer the `popover` attribute + CSS anchor
      positioning (top layer, no portal bookkeeping), keeping the existing
      placement math as the fallback path. Needs a browser-support decision
      recorded as an ADR in SSD §14.

- [ ] **R2.14 — RTL support** _(TD-20 · Medium · mechanical but wide)_ Replace
      the 39 hard-coded directional utilities with logical properties and add an
      RTL story/e2e case. Cheaper now than after the 1.0 freeze.

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

| Date       | Change                                                                                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-07-14 | Created (R1–R3 seeded from repo analysis)                                                                                                                                        |
| 2026-07-15 | [PLAN.md](./PLAN.md) created — phase ordering now lives there (F0–F12); R-item DoDs here remain authoritative                                                                    |
| 2026-07-21 | R2.9 (Tailwind-optional consumption: tokens.css/elements.css/tailwind-preset) and R2.10 (theme token contract + runtime theme-switching parity fix) added and completed same day |
