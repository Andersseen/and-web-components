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
- [x] **R2.7a — Browser e2e for and-select / and-modal / form-participation**
      _(done 2026-08-28 · TD-15 · medium)_ New `packages/web-components/e2e/`
      Playwright suite (Chromium + Firefox + WebKit) running against the _built_
      `dist/components/all.js` bundle via a small dependency-free static server
      (`e2e/serve.mjs`), not Storybook — cheaper to start, no iframe layer, and
      matches "prefer testing built package output". Covers: `and-select`
      required/disabled FormData + real constraint validation, keyboard nav,
      outside-click; `and-modal` focus trap incl. slotted content, Tab/Shift+Tab
      loop, Escape, focus restoration, body scroll lock, background `inert`,
      accessible-name correctness;
      `and-input`/`and-switch`/`and-button type="submit"/"reset"` form
      participation. `@axe-core/playwright` scans each fixture's rendered state.
      Wired into `.github/workflows/ci-cd.yml` as job `e2e-web-components`
      (`needs: build-and-test`), so it runs on every PR — whether it's a GitHub
      _required_ status check depends on branch protection settings outside this
      repo's files, not verified/set this session. Found and fixed three real
      bugs along the way (not visible to mock-doc `.spec.tsx` tests):
      and-select's `required`/`disabled` mirror control gap (TD-12 addendum),
      and-modal's `aria-label="Dialog"` fallback and its
      `aria-labelledby`-across-shadow-boundary failure, and and-select's
      mouse-click-doesn't-close-the-menu asymmetry with keyboard Enter. Also
      surfaced TD-29 (axe/fieldset-disabled contrast false positive, documented
      and narrowly excluded, not a real defect). **DoD met** for the components
      above; **not yet done** for the rest — see R2.7b.
- [x] **R2.7b — Browser e2e for the remaining interactive components** _(done
      2026-08-30 · TD-15 first half now fully closed · medium)_ Extended
      `packages/web-components/e2e/` (same infra/pattern as R2.7a — Playwright
      against the built `dist/components/all.js` bundle, Chromium + Firefox +
      WebKit) to `and-dropdown`, `and-tabs`, `and-accordion`, `and-tooltip`,
      `and-carousel`, `and-menu-list` + `and-context-menu` (one combined
      fixture, per the task's grouping guidance), and `and-drawer`: 8 new
      fixtures, 8 new spec files (161 new tests × 3 browsers), plus 8 new axe
      scans of representative active states (open dropdown, selected/disabled
      tab, expanded accordion, visible tooltip, paused-autoplay carousel, open
      menu-list + context-menu, open drawer) appended to `e2e/axe.spec.ts`.
      Investigating each component's actual current implementation (headless +
      Stencil + existing spec/story) before writing tests — per the task brief,
      not inventing behavior from ARIA-APG expectations — surfaced 12 real,
      browser-only defects invisible to mock-doc `.spec.tsx` tests, all fixed
      with regression coverage (browser E2E + updated/added headless unit tests)
      and one `major`+`minor` changeset: a systemic Stencil
      boolean→`aria-*`-attribute serialization bug hit 5 headless modules
      (`dropdown`/`accordion`/`tooltip`/`menu-list`/`drawer`, all silently
      emitting invalid/missing ARIA state); `and-tabs`'s per-tab `disabled`
      blocked clicks but not keyboard activation and never set `aria-disabled`;
      `<and-tabs orientation="vertical">` never propagated to
      `<and-tabs-list>`'s own disconnected `orientation` prop; `and-drawer` had
      the exact same "bare `requestAnimationFrame` races Stencil's commit"
      initial-focus bug already fixed on `and-modal` in R2.11, plus a separate
      re-entrancy bug that skipped `restoreFocus()` on every internal-close path
      (Escape/overlay/close-button — only an externally set `open` prop worked),
      plus an invented empty-string fallback name inconsistent with
      `and-modal`'s "no accessible name" precedent; `and-menu-list` (and,
      transitively, the standalone `and-menu-item`, same engine) was completely
      unreachable by sequential Tab navigation in its documented "items
      provided, focus managed for you" mode, and even after fixing that,
      arrow-key navigation moved the ARIA/tabindex state but not real DOM focus
      (a `ref`-callback assumption that doesn't hold across Stencil re-renders);
      `and-dropdown`'s disabled items had no `aria-disabled`, which is why axe
      correctly flagged their dimmed text as a real contrast violation;
      `and-accordion-trigger`'s `aria-controls` pointed at an `id` in a
      _different_ shadow tree (`and-accordion-content` is a sibling Stencil
      component) and could never resolve — the identical root cause as the
      `and-modal` `aria-labelledby` fix, this time caught as a critical
      `aria-valid-attr-value` axe violation; and `and-menu-list` shipped
      `aria-menu-label` as its public attribute name, which is not a real ARIA
      attribute and is a critical `aria-valid-attr` violation — renamed to
      `menu-label` (breaking, `major` changeset for
      `@andersseen/web-components`), matching `and-context-menu`'s existing
      correct convention. Also fixed three stale JSDoc `@example`s
      (`and-dropdown`/`and-context-menu`/`and-menu-list`) showing an
      `items='[...]'` HTML-attribute-string form that actually crashes at
      runtime; `items` has always been property-only. **Deliberately not fixed,
      registered as new debt instead:** `and-carousel`'s `getSlideProps()`
      `aria-hidden` (marking inactive slides for AT) is computed by the headless
      module but never wired into `and-carousel-item.tsx` — doing so needs the
      same parent→child prop- injection plumbing `and-tabs`/`and-accordion`
      already use, which is larger than a targeted fix (TD-33). A pre-existing,
      intermittent Firefox-only axe `color-contrast` failure on `and-select`'s
      open listbox option text was found (reproduced on a clean `main` checkout
      before this session's changes, so not introduced here) and is
      `and-select`/R2.7a territory, out of this item's scope (TD-34). **DoD
      met:** suite runs in CI on PRs (already wired as the `e2e-web-components`
      job, unchanged); 261/261 e2e tests green across Chromium + Firefox +
      WebKit in the same run (`CI=true`);
      `pnpm     -C packages/web-components test:spec` 144/144;
      `pnpm test:headless` 310/310 (was 308 — 2 net-new roving-focus tests
      replacing/covering the old always-`-1` assertions); `pnpm lint` clean (0
      errors). TD-15's browser-e2e half is now fully closed for all
      originally-listed components; its visual-regression half stays open under
      R3.2 — see the SSD.md TD-15 addendum for the precise split.
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

- [x] **R2.15 — Cross-package audit follow-ups** _(done 2026-07-23 ·
      TD-23…TD-27)_ Audited every package outside `web-components` by running
      them, not reading them. Fixed: `StateStore` returned a fresh frozen object
      on every `state` read, breaking React's `useSyncExternalStore` contract
      and `===` memoisation everywhere else (now cached, invalidated on real
      change); `@andersseen/vanilla-components` threw
      `HTMLElement is not defined` on bare import and `initMotion()` /
      `defineBehaviors()` threw `document is not defined` in Node (all four
      packages now import and run clean server-side); `vanilla-modal` had no
      keyboard, no focus management and no scroll lock — and permanently
      destroyed its slotted content when the element was moved in the DOM,
      because `connectedCallback` re-read `childNodes` into its content backup
      on every re-insertion (content now held in a DocumentFragment captured
      once); `prefers-reduced-motion` was read once in the `MotionController`
      constructor so the JS and CSS layers could disagree (now tracked live);
      unregistered icon names rendered an empty box in silence (now a one-time
      dev warning, tree-shaking unaffected — re-verified at 306 B for one icon
      vs 11.4 KB for all). Published `@andersseen/behaviors/overlay`
      (`calculatePosition` with flip-on-collision, now accepting a plain size so
      it works with no DOM) and declared `sideEffects` on four packages.
      `vanilla-components` dropped 1.0.0 → 0.0.2 (0.0.1 is already taken on
      npm), marked experimental in its README, and added to the Changesets
      ignore list. **Verification:** the new `store.test.ts` fails 5/7 and the
      new `vanilla-modal` regressions fail 6/14 against the previous code;
      suites now 300 headless / 136 stencil / 18 vanilla / 36 behaviors,
      `pnpm build:all` and `pnpm lint` clean.

- [ ] **R2.16 — Consume `behaviors/overlay` from `web-components`** _(TD-24 →
      unblocks TD-18 · High)_ The positioning and modal primitives are now
      public and tested; `web-components` still ships its own weaker copies. Add
      `@andersseen/behaviors` to the package-boundary table in AGENTS.md, then
      migrate `and-select`, `and-dropdown`, `and-tooltip`, `and-context-menu`
      and `and-menu-list` onto portal-based positioning. Pair with R2.13.

- [ ] **R2.17 — Retire `@andersseen/vanilla-components@1.0.0` on npm** _(TD-23 ·
      small · no code, decision required)_ The repo now says `0.0.2`, but
      `1.0.0` is still the published `latest`. Two options, and the trade-off is
      a permanent one: **(a) unpublish** —
      `npm unpublish '@andersseen/vanilla-components@1.0.0'` removes it, but the
      version number `1.0.0` can then never be used again for this package; that
      is the exact tombstone that already pushed
      `angular`/`react`/`vue-components` permanently onto the `0.x` line. **(b)
      deprecate** —
      `npm deprecate '@andersseen/vanilla-components@1.0.0'     'Published in error; experimental package, tracks 0.0.x. Use     @andersseen/web-components.'`
      keeps it installable so no existing lockfile 404s, and shows a warning on
      install. Publishing `0.0.2` does **not** require either. Whichever is
      chosen, finish with
      `npm dist-tag add @andersseen/vanilla-components@0.0.2 latest`.

- [ ] **R2.18 — Package metadata audit: publint + AreTheTypesWrong** _(TD-30 ·
      medium)_ Run `publint` and `@arethetypeswrong/cli` against every
      publishable package, with particular attention to
      `packages/react-components` and `packages/vue-components` (generated by
      Stencil output targets, module-format never independently verified) —
      don't advertise a `require` condition for a file that's actually ESM
      unless dual-package support is real and intentional. Fix all meaningful
      findings; add both checks to CI (`ci-cd.yml`) so future metadata drift
      fails the build. **DoD:** both tools run clean (or findings are fixed) for
      every package in `.changeset/config.json`'s publishable set; both wired
      into CI.
- [ ] **R2.19 — Package-consumer smoke tests from packed tarballs** _(TD-31 ·
      large)_ `pnpm pack` (or equivalent) every publishable package into a real
      `.tgz`, install those tarballs — not `workspace:*` — into small disposable
      fixture apps (`fixtures/vanilla`, `fixtures/angular`, `fixtures/react`,
      `fixtures/vue`, `fixtures/astro`), and verify: install succeeds, ESM
      import works, custom elements register, TypeScript types resolve, styles
      import, subpath exports resolve, production build succeeds. Keep fixtures
      minimal — they exist to validate distribution, not to become demo apps.
      **DoD:** fixtures build against real tarballs in CI; a broken
      export/type/style regression fails the build.
- [ ] **R2.20 — Gate release on package validation** _(TD-32 · small, depends on
      R2.18 + R2.19)_ `release.yml` currently runs `pnpm     build:all` then
      `changesets/action` with no validation gate between them. Once R2.18/R2.19
      exist, require both to pass before `changeset     publish` runs, so a
      package that fails publint/attw or the consumer smoke tests can never
      reach npm. **DoD:** a deliberately broken package export fails
      `release.yml` before `changeset publish`.
- [ ] **R2.21 — Framework adapter peer-range and module-format audit**
      _(medium)_ Angular: determine whether `angular-components` genuinely
      requires its currently-pinned Angular peer major, or whether a wider
      supported range (covering the Angular versions actually tested, including
      newer majors already in use elsewhere in this repo) is correct — don't
      blindly widen without a real consumer build test against each supported
      major. React: verify events, boolean-prop passing, refs, and generated
      TypeScript types against a real consumer build. Vue: verify events,
      boolean-prop passing, and generated types against a real consumer build.
      **DoD:** a documented, deliberate peer range per adapter backed by a real
      build test, not just a version bump.
- [x] **R2.22 — TD-28 release-policy hardening** _(done 2026-08-31 · TD-28 ·
      medium)_ Reproduced the wrapper-`1.0.0` bug deterministically against the
      real `@changesets/assemble-release-plan` engine in disposable fixtures,
      confirmed the root cause (`shouldBumpMajor()` unconditionally forces a
      major bump on any `peerDependencies`-linked dependent when the peer's own
      release is minor/major, and the wrappers' exact-pinned `workspace:*` peer
      range could never satisfy `onlyUpdatePeerDependentsWhenOutOfRange`'s
      out-of-range check), and fixed it by adding a Changesets `fixed` group
      (`web-components` + the three wrappers) with
      `onlyUpdatePeerDependentsWhenOutOfRange: true` and widening the wrapper
      peer ranges to `workspace:>=0.4.0 <1.0.0`. Added
      `scripts/validate-release-policy.mjs` (static guard) and
      `scripts/release-policy/release-plan.test.mjs` (exercises the real
      Changesets CLI against disposable fixtures — patch/minor simulations, a
      reproduction of the pre-fix bug, validator self-tests), wired into
      `ci-cd.yml` and `release.yml` via `pnpm validate:release-policy` /
      `pnpm test:release-policy`. **DoD met:** both patch and minor
      `web-components` release-plan simulations produce matched, non-`1.0.0`
      wrapper versions; deliberately forcing a wrapper to `1.0.0` or breaking
      the fixed group fails validation. See SSD TD-28/ADR-5/§13 invariants
      #15–18 and AGENT-PLAYBOOKS P7.

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

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-07-14 | Created (R1–R3 seeded from repo analysis)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 2026-07-15 | [PLAN.md](./PLAN.md) created — phase ordering now lives there (F0–F12); R-item DoDs here remain authoritative                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 2026-07-21 | R2.9 (Tailwind-optional consumption: tokens.css/elements.css/tailwind-preset) and R2.10 (theme token contract + runtime theme-switching parity fix) added and completed same day                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 2026-08-28 | R2.7 split into R2.7a (done) / R2.7b; added R2.18–R2.21 (packaging validation, consumer tarball fixtures, release-safety gating, adapter peer/module audit) covering the phases scoped out of the correctness-slice-+-e2e-gate session                                                                                                                                                                                                                                                                                                                                                                                                      |
| 2026-08-30 | R2.7b done — browser e2e for dropdown/tabs/accordion/tooltip/carousel/menu-list+context-menu/drawer; 12 real defects found and fixed (systemic ARIA boolean-serialization bug, tabs disabled-tab/orientation gaps, drawer focus-race + focus-restoration + invented-name bugs, menu-list Tab-unreachability + focus-follows-tabindex bugs, dropdown/accordion missing-`aria-disabled`/unresolvable-`aria-controls`, menu-list's invalid `aria-menu-label` attribute name); added TD-33 (carousel per-slide `aria-hidden` never wired up) and TD-34 (pre-existing, intermittent Firefox-only axe contrast flake on and-select, out of scope) |
| 2026-08-31 | R2.22 added and completed same day — TD-28 release-policy hardening (Changesets `fixed` group + `onlyUpdatePeerDependentsWhenOutOfRange` + widened wrapper peer ranges, plus `validate:release-policy`/`test:release-policy` guards in CI and release.yml)                                                                                                                                                                                                                                                                                                                                                                                  |
