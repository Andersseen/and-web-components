# PLAN.md — Phased Execution Plan ("make it pro")

**Created:** 2026-07-15, from a full review of `apps/docs` and repo state.
**Purpose:** phase-by-phase work plan. Each phase is sized for **one agent
session** and is self-contained: a new session given only
[CONTEXT.md](./CONTEXT.md) + this file + "do phase FN" has everything it needs.
Phases may also be chained in one session ("do F0 then F1") — finish and verify
one before starting the next.

**Relationship to [ROADMAP.md](./ROADMAP.md):** ROADMAP remains the prioritized
backlog and maps to TD-IDs in
[SSD.md §15](./SSD.md#15-known-gaps-and-technical-debt-register). This plan is
the _execution encoding_ of that backlog plus the 2026-07-15 docs review
findings. Every phase lists which R-item / TD-ID it closes; when a phase
completes, update those files too (see protocol below). If this plan and ROADMAP
ever disagree on priority, this plan wins for phase ordering; ROADMAP wins for
_what counts as done_ (DoD text).

---

## Session protocol (follow for every phase)

1. Read [CONTEXT.md](./CONTEXT.md) first — **do not re-analyze the repo.** Hard
   rules live in [../AGENTS.md](../AGENTS.md); recipes in
   [AGENT-PLAYBOOKS.md](./AGENT-PLAYBOOKS.md) (P-IDs referenced below).
2. Execute the phase's steps. Always `pnpm`, never npm/yarn. Never edit
   generated files (`stencil-generated/**`, component `readme.md`,
   `src/components.d.ts`, `custom-elements.json`).
3. Run **every** verification command listed — all must pass.
4. Changes to a published package need a changeset (`pnpm changeset`, playbook
   P7). Docs-app/CI-only changes do not.
5. Close out: check the phase box here; check the R-item box in ROADMAP.md and
   update SSD §15 if a TD-ID is affected; append one line to the CONTEXT.md §11
   session log.
6. If a phase turns out bigger than expected, ship a working slice, then add the
   remainder as a new sub-item under the phase (unchecked).

**Baseline verification gate for anything touching `packages/*`:** `pnpm lint` +
the affected package's tests + `pnpm build:stencil`.

---

## Phase index & dependency notes

| Phase | What                                             | Size | Closes            | Depends on     |
| ----- | ------------------------------------------------ | ---- | ----------------- | -------------- |
| F0    | Hygiene: fix broken docs test, docs in CI        | S    | R2.6, TD-14       | —              |
| F1    | Auto-generate docs API tables                    | M    | TD-16 (new in F0) | F0             |
| F2    | `and-select` form participation                  | M    | R1.3, TD-12       | —              |
| F3    | `and-switch`                                     | M    | R2.1 (TD-13)      | F2 recommended |
| F4    | `and-checkbox`                                   | M    | R2.2 (TD-13)      | F3             |
| F5    | `and-textarea`                                   | M    | R2.3 (TD-13)      | F3             |
| F6    | `and-radio-group` + `and-radio`                  | M–L  | R2.4 (TD-13)      | F4             |
| F7    | `and-slider`                                     | L    | R2.5 (TD-13)      | F3             |
| F8    | Docs guides (theming, a11y, packages) + homepage | M    | docs-review item  | F0             |
| F9    | Live-example single-source + llms.txt            | S–M  | docs-review item  | F1             |
| F10   | Browser e2e for interactive components           | M    | R2.7, TD-15 (½)   | —              |
| F11   | Visual regression                                | M    | R3.2, TD-15 (½)   | F10            |
| F12   | Stability policy + path to 1.0                   | M    | R3.1              | F2–F7          |

Chaining guidance: F0 is a quick win — prepend it to any session. **Do F1 before
F3–F7** so the five new components get auto-generated API doc tables instead of
adding five more hand-synced ones. F8/F9 are independent of the component work
and can slot anywhere after their deps. F3 establishes the form-control pattern
the rest copy — don't parallelize F3 with F4–F7.

---

## F0 — Hygiene: fix broken docs test, wire docs app into CI

- [x] Status — done 2026-07-16

**Why:** `pnpm test:docs` **fails on `main` today** (verified 2026-07-15), the
docs app's tests run in no CI workflow, and ROADMAP/SSD still claim the docs
site doesn't exist.

**Steps:**

1. Fix `apps/docs/src/__tests__/sidebar.test.ts`: it regex-scans
   `astro.config.mjs` for `slug: '...'` entries, but the sidebar moved to
   `apps/docs/sidebar.config.mjs` (imported by the astro config) — so the "every
   content page is listed in the sidebar" assertion sees zero sidebar slugs and
   fails. Point `configPath` at `sidebar.config.mjs` and update the assertion
   messages that still say "astro.config.mjs".
2. Add docs steps to the `build-and-test` job in `.github/workflows/ci-cd.yml`,
   after the existing package test steps (the job already ran `pnpm build:all`,
   so sibling `dist/` folders exist):
   - `pnpm test:docs` (pure-fs vitest, no build needed)
   - `pnpm -C apps/docs build` (verifies the site builds; do NOT use
     `pnpm build:docs` here — it would rebuild half the workspace)
   - Optional sub-item (add only if CI minutes allow): a separate job running
     `npx playwright install --with-deps chromium` +
     `pnpm -C apps/docs test:e2e`. Note its Playwright `webServer` re-runs
     `pnpm build && pnpm preview`.
3. Bookkeeping — the docs site exists and exceeds the R2.6 skeleton:
   - ROADMAP.md: check off **R2.6** with a note ("shipped as apps/docs, ~70
     pages; closed via PLAN F0").
   - SSD §15: mark **TD-14 resolved** (per-component docs site exists at
     `apps/docs`, deployed via `deploy-docs.yml`).
   - SSD §15: add **TD-16** (Medium, Docs): _docs API tables are hand-copied
     from the generated per-component `readme.md` files (see the `<small>`
     footer on e.g. `apps/docs/src/content/docs/components/button.md`) — they
     WILL drift as components evolve. Fix = PLAN F1._

**Verification:** `pnpm test:docs` green · `pnpm -C apps/docs build` green
(build the workspace deps first once: `pnpm build:docs`) · YAML of `ci-cd.yml`
parses (`node -e "..."` or push to a branch and watch CI).

**DoD:** docs tests green locally and running in CI on PRs; R2.6/TD-14/TD-16
bookkeeping done; no changeset needed (no published package touched).

---

## F1 — Auto-generate docs API tables (closes TD-16)

- [x] Status — done 2026-07-16

**Why:** every `apps/docs/src/content/docs/components/*.md` page carries
hand-pasted Properties/Events tables copied from
`packages/web-components/src/components/<name>/readme.md` (Stencil `docs-readme`
output, checked in, regenerated on every stencil build). Manual sync across 24+
components is guaranteed drift. This is the highest-leverage docs fix, and it
must land **before** F3–F7 add five more components.

**Steps:**

1. Build an Astro component `apps/docs/src/components/ApiTables.astro` that at
   build time reads `packages/web-components/src/components/<tag>/readme.md`,
   extracts the generated sections (`## Properties`, `## Events`, `## Methods`,
   `## Slots`, `## Shadow Parts`, `## CSS Custom Properties` — whichever exist),
   renders them, and throws (fails the build) if the file is missing. Parsing
   the generated markdown tables is enough; don't over-engineer.
2. Handle the known exception: a handful of **compound components** have
   colliding `docs-readme` output (see the note on the docs homepage `index.mdx`
   and the Accordion page). For those, keep an explicit `fallback` slot/prop on
   `ApiTables` that renders hand-written tables, and list which components use
   it in a comment — everything else must use the generated path.
3. Convert the component pages from `.md` to `.mdx`, replace each hand-pasted
   table block + its `<small>Generated from…</small>` footer with
   `<ApiTables tag="and-button" />`. Keep the prose and live examples as-is.
   (`sidebar.test.ts` already accepts `.mdx`.)
4. Confirm `pnpm -C apps/docs build` runs after web-components is built (it does
   in `build:docs` and in CI post-`build:all`) so the readme files are current.

**Verification:** `pnpm build:docs` green · `pnpm test:docs` green ·
`pnpm test:e2e:docs` green (the Button e2e asserts the live example still
renders) · `grep -r "keep this table in sync" apps/docs/src/content` returns
nothing.

**DoD:** zero hand-maintained API tables outside the documented compound-
component fallback list; TD-16 marked resolved in SSD §15; no changeset.

---

## F2 — `and-select` native form participation (R1.3, closes TD-12)

- [x] Status — done 2026-07-16

**The plan text below was wrong and is kept only as a record of what NOT to
assume.** It said `and-select` renders a `<button>` + ARIA listbox with no real
nested form control, so it needs `shadow: true` + `@AttachInternals()`. Reading
`and-select.tsx` (and verifying live in a browser) showed it already renders
`scoped: true` (light DOM) with a hidden `<input type="hidden">` mirroring
`value` — the same shape as `and-input`, already covered by P9 step 0's first
bullet. Implementing the shadow-DOM rewrite as originally written would have
broken the working `FormData` mechanism. The actual gap: native `form.reset()`
was a complete no-op (Stencil re-stamps the hidden input's `value` attribute on
every selection, dragging its reset-default along with it), fixed with the same
`reset`-listener pattern as `and-input`, plus a new headless `setSelectedValue`
action for the "reset to no selection" case. See ROADMAP R1.3 and
AGENT-PLAYBOOKS P9 for the corrected, detailed writeup — both updated as part of
this phase. Added spec tests + an "In a form" Storybook story
(submit/reset/fieldset-disabled).

**Verification:** `pnpm -C packages/headless-core test` · `pnpm build:stencil` ·
`pnpm -C packages/web-components test:spec` · `pnpm lint` — all green. Manually
verified in a real browser via Playwright (not just Storybook): built
`dist/index.js`, drove a live form — confirmed `FormData` included the value,
confirmed `form.reset()` was broken before the fix and correct after, confirmed
`<fieldset disabled>` already disabled the trigger natively (Playwright itself
refused to click it).

**DoD:** ROADMAP R1.3 DoD; TD-12 closed in SSD §15 (keep the "P9 step 0 first"
rule for future controls — this is the second confirmed case of the light-DOM
shape); changeset `minor` for `@andersseen/web-components` **and**
`@andersseen/headless-components`;
`apps/docs/src/content/docs/components/select.mdx` prose updated to mention
`form.reset()` / `fieldset[disabled]` support.

---

## F3–F7 — Missing form controls (R2.1–R2.5, close TD-13)

One phase per component, **in this order** (effort/value, per TD-13):

- [ ] **F3 — `and-switch`** (R2.1) — smallest; establishes the pattern.
- [ ] **F4 — `and-checkbox`** (R2.2) — include indeterminate state in the
      headless model.
- [ ] **F5 — `and-textarea`** (R2.3) — decide in the PR whether the existing
      `input` headless module's state model fits; don't fork logic blindly.
- [ ] **F6 — `and-radio-group` + `and-radio`** (R2.4) — roving tabindex keyboard
      model lives in headless.
- [ ] **F7 — `and-slider`** (R2.5) — hardest: arrow/home/end keys,
      `aria-valuenow/min/max`, RTL.

**Recipe for each (same every time):**

1. **Headless module first** — playbook **P1**:
   `packages/headless-core/src/<name>/` + tests (keep the 19/19-tested invariant
   alive).
2. **Stencil component** — playbook **P2**: CVA variant map + `cn()`,
   subscribe/unsubscribe pattern per the `and-button` reference, **add the new
   component to a bundle in `stencil.config.ts`** (hard requirement), spec
   test + Storybook story.
3. **Form-associated from day one** — playbook **P9, step 0 first**: decide
   light-DOM (`scoped: true`, like `and-input`) vs `shadow: true` +
   `ElementInternals` (like `and-select` after F2) _before_ writing the
   component. Switch/checkbox/radio/slider have no nestable native control
   surface → expect the ElementInternals path; textarea may go light-DOM like
   input.
4. **Docs page** — NEW requirement not yet in P2 (the playbook predates
   `apps/docs`): add `apps/docs/src/content/docs/components/<name>.md(x)` using
   `<ApiTables>` from F1, plus a sidebar entry in
   `apps/docs/sidebar.config.mjs`. `pnpm test:docs` enforces the pairing.
5. Changesets: `minor` for `@andersseen/headless-components` and
   `@andersseen/web-components`.

**Verification (each phase):** `pnpm lint` · `pnpm test:headless` ·
`pnpm build:stencil` · `pnpm -C packages/web-components test:spec` ·
`pnpm test:docs` · manual Storybook form check (FormData, reset, disabled).

**DoD (each phase):** matching R2.x DoD in ROADMAP; after F7, close TD-13 in SSD
§15. During F3, update playbook P2 to add the docs-page step (step 4 above) so
the requirement is durable.

---

## F8 — Docs guides + homepage cleanup

- [ ] Status

**Why:** the docs "Guides" section has exactly one page (Getting Started). The
library's strongest selling points — theming and accessibility — have no guide,
and with 12 packages a newcomer can't tell what to install. The homepage
`index.mdx` "Status" section is internal maintenance talk ("expand as needed")
on a public marketing page.

**Steps:**

1. `guides/theming.md(x)`: document `and-theme` / `and-color` / `and-mode`
   attributes, the 10 prebuilt themes in `packages/web-components/themes/`
   (package subpaths), and the HSL-triplet token system. Include a **live
   theme/palette switcher** (a small inline script setting attributes on a demo
   container — same pattern as the astro.config theme-sync script).
2. `guides/accessibility.md`: what the headless core guarantees (keyboard
   models, focus traps, ARIA wiring), per-component keyboard reference table,
   the `and-button` host-role-hoisting behavior, `aria-label` guidance for
   icon-only controls.
3. `guides/which-package.md`: decision guide — web-components vs
   vanilla-components vs headless-components vs behaviors vs adapters — one
   scenario per package tier (reuse the "Package Roles" tiers from the root
   README / SSD §1.1; link, don't duplicate).
4. Homepage `index.mdx`: delete the "Status" section (its content belongs in
   repo docs, and after F0 it's stale anyway); replace with a compact
   tier-overview linking the three guides.
5. Add the three pages to `sidebar.config.mjs` under Guides.

**Verification:** `pnpm build:docs` · `pnpm test:docs` · `pnpm test:e2e:docs`
(homepage e2e asserts title/hero only — should survive; update if it asserted
Status text).

**DoD:** three guides live and linked from Getting Started; homepage has no
internal-status prose; no changeset.

---

## F9 — Live-example single-source + llms.txt (optional polish)

- [ ] Status

**Steps:**

1. Build `apps/docs/src/components/LiveExample.astro` that takes one HTML
   snippet and renders BOTH the live demo (inside `.and-live-example`) and the
   highlighted code block — killing the current copy-paste duplication between
   demo and code fence on every component page.
2. Migrate a pilot set (Button + two more pages), document the pattern in a
   comment; migrate the rest opportunistically (don't force all ~70 pages in one
   session — it's mechanical; a follow-up sub-item is fine).
3. llms.txt: evaluate the `starlight-llms-txt` community plugin; if it's
   unmaintained or misbehaves with this Starlight version, write a small
   build-time script emitting `public/llms.txt` from the content collection
   instead. Fits the brand — this repo ships `@andersseen/skills` for AI agents.

**Verification:** `pnpm build:docs` · `pnpm test:e2e:docs` (Button live-example
assertion is the regression guard) · `curl` the built `dist/llms.txt`.

---

## F10 — Browser e2e for interactive components (R2.7, TD-15 first half)

- [ ] Status

Follow **ROADMAP R2.7**: Playwright suite (new `packages/web-components/e2e/` or
reuse an existing app's setup) against **built Storybook**: modal focus trap,
select keyboard nav (after F2!), dropdown dismiss, tabs arrow keys, drawer Esc.
Wire into CI on PRs; failures block merge.

**Verification / DoD:** per R2.7 — suite green locally and in CI.

---

## F11 — Visual regression (R3.2, TD-15 second half)

- [ ] Status

Follow **ROADMAP R3.2**: Playwright screenshot assertions for representative
components across the 6 palettes × 2 modes against built Storybook. Requires
F10's harness. Store baselines in-repo; document the update flow
(`--update-snapshots`) in the workflow file. Close TD-15 in SSD §15 when done.

---

## F12 — Stability policy + path to 1.0 (R3.1)

- [ ] Status

Follow **ROADMAP R3.1**: write `docs/STABILITY.md` (frozen APIs, breaking-change
policy, deprecation window), then a coordinated `1.0.0` changeset for core +
headless. **Gate:** only after F2–F7 (form controls are what make the library
adoptable; don't stamp 1.0 before them). Also verify — and document in
STABILITY.md — the actual npm publish state of every public package (CONTEXT §10
flags this as never verified).

---

## Deliberately NOT in this plan

Same exclusions as ROADMAP.md (Tailwind v4 migration, hand-rewriting Angular
wrappers around TD-11, new satellite packages) plus:

- Docs versioning/i18n — premature before 1.0 (F12).
- Interactive props playgrounds in docs — nice-to-have; revisit after F9.

## Changelog of this file

| Date       | Change                                              |
| ---------- | --------------------------------------------------- |
| 2026-07-15 | Created (F0–F12) from docs review + ROADMAP R-items |
