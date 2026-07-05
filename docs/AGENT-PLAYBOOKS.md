# Agent Playbooks — Step-by-Step Task Recipes

Deterministic recipes for common tasks in this repo. Written for AI agents of
any capability level: follow the steps in order, run every verification command,
and check the Definition of Done before finishing.

**Before any task, always:**

1. Read [AGENTS.md](../AGENTS.md) (hard rules) and skim
   [CODEMAP.md](./CODEMAP.md) (file locations).
2. Run `pnpm install` if `node_modules` is missing.
3. Run `pnpm build:stencil` once — many tests and builds fail confusingly
   without sibling `dist/` folders.

**Golden guardrails (apply to every playbook):**

- Copy an existing sibling as your template; match its structure exactly. Best
  references: headless → `src/button/`, Stencil → `and-button/`, vanilla →
  `vanilla-modal.ts`.
- Never edit generated files: `stencil-generated/**`, component `readme.md`,
  `src/components.d.ts`, `custom-elements.json`, anything in `dist*/`.
- Never add production dependencies without explicit instruction from the user.
- If a verification command fails, fix the failure before moving on — do not
  finish with failing checks and do not delete/skip tests to make them pass.

---

## P1 — Add a new headless component

**Scope:** pure logic, no DOM, no styling.

1. Create `packages/headless-core/src/<name>/<name>.ts`. Copy the structure from
   `packages/headless-core/src/template.ts.example` or `src/button/button.ts`.
2. Required exports: `create<Name>(config?)`, `<Name>Config`, `<Name>State`,
   `<Name>Return`. The return object must have: `state` getter, `subscribe(cb)`,
   `actions: {...}`, and `get*Props()` helpers returning ARIA/data attributes.
3. State lives in `createStore` (import from `../utils/store`). Mutate **only**
   via `store.setState({...})`. Replace nested objects instead of mutating them
   (shallow equality check).
4. Create `packages/headless-core/src/<name>/index.ts` re-exporting everything.
5. Add the export to `packages/headless-core/src/index.ts`.
6. Add a subpath export for `./<name>` in `packages/headless-core/package.json`
   `exports` (copy an existing entry).
7. Write tests in `packages/headless-core/src/<name>/__tests__/<name>.test.ts`
   covering: initial state, each action, subscribe/unsubscribe notification, and
   the props helpers' ARIA output.

**Forbidden:** `document`, `window`, `EventTarget`, framework imports,
`let state = {...}`, importing `@andersseen/headless-components` (self-import).

**Verify:**

```bash
pnpm test:headless
pnpm -C packages/headless-core lint
pnpm build:headless
```

**Definition of Done:** tests pass, build succeeds, module exported from index +
package.json subpath, no DOM/framework imports
(`grep -rn "document\.\|window\.\|@stencil\|@angular" packages/headless-core/src/<name>/`
returns nothing).

---

## P2 — Add a new Stencil component

**Scope:** styled custom element in `packages/web-components`.

1. **Contract first.** Write down (in the PR/commit description): props, events
   (`and<Name><Action>` naming), slots, parts, CSS vars, methods, ARIA roles,
   keyboard map. Use the format in `.github/skills/and-component/SKILL.md`.
2. If behavior is non-trivial (open/close, selection, navigation): make sure a
   headless module exists — if not, do **P1 first**. Never inline state machines
   in `.tsx`.
3. Create folder `packages/web-components/src/components/and-<name>/` with:
   - `and-<name>.tsx` — copy `and-button.tsx` as the skeleton.
     `@Component({ tag: 'and-<name>', shadow: true })` (or
     `shadow: { delegatesFocus: true }` for focusable controls). Wire the
     headless factory in `componentWillLoad()`, subscribe with the `renderTick`
     pattern, unsubscribe in `disconnectedCallback()`. Add `@Watch()` for every
     prop mirrored into headless state.
   - `and-<name>.css` — `:host` block exposing `--<name>-*` custom properties
     with defaults. No utility classes here.
   - `and-<name>.stories.ts` — copy a sibling's stories; cover each
     variant/state.
   - `and-<name>.spec.tsx` — Vitest spec (render, props reflected, events
     emitted, ARIA attributes present).
4. Styling: CVA variant map + `cn()` from `../../utils/cn`. Only semantic token
   classes (`bg-primary`, `text-muted-foreground`); no raw palette classes or
   hex values; z-index only via `var(--and-z-*)`.
5. Export the component from `packages/web-components/src/index.ts` if siblings
   do so.
6. Add the tag to an appropriate `bundles` entry in
   `packages/web-components/stencil.config.ts`.
7. If the component animates open/close: use
   `packages/web-components/src/utils/animation.ts` + an `isClosing` flag so the
   DOM stays mounted during exit animations. Respect `prefers-reduced-motion`
   (motion-core does this — do not bypass it).
8. JSDoc every prop, event, slot, part, and CSS var (feeds generated docs).

**Verify:**

```bash
pnpm build:stencil                          # must succeed; regenerates readme.md, components.d.ts, Angular wrappers
pnpm -C packages/web-components test:spec
pnpm -C packages/web-components lint
pnpm storybook                              # open the new story; check the a11y addon panel
```

**Definition of Done:** build + specs + lint pass; story renders in Storybook
with no a11y-addon violations; all four files exist; component is in a bundle;
keyboard interactions work (tab, arrows, Esc as applicable); focus returns to
trigger on close for overlays.

---

## P3 — Add a new vanilla component

1. Create `packages/vanilla-components/src/components/vanilla-<name>.ts`. Copy
   `vanilla-modal.ts` structure: a class extending `HTMLElement`, consuming the
   headless factory for state + ARIA props.
2. Match the attribute/event API of the equivalent Stencil component when one
   exists.
3. Animations: only via dynamic `import('@andersseen/motion')` when the
   `animated` attribute is present — see `src/utils/motion-loader.ts`. Never a
   static import.
4. Register/export in `packages/vanilla-components/src/index.ts`.
5. Add `vanilla-<name>.test.ts` next to the component.

**Verify:**

```bash
pnpm -C packages/vanilla-components test
pnpm build:vanilla
grep -A3 '"dependencies"' packages/vanilla-components/package.json   # must stay empty/absent
```

---

## P4 — Add an icon

1. Add the SVG string constant in `packages/icon-library/src/icons.ts` following
   the existing naming (`export const iconName = '<svg ...>'` style — copy a
   neighbor exactly).
2. SVG requirements: `currentColor` for strokes/fills (themeable), `viewBox`
   present, no width/height hardcoding, no inline styles.
3. Register it wherever siblings are registered (check `src/registry.ts` and
   `src/index.ts`).

**Verify:** `pnpm build:icons && pnpm -C packages/icon-library lint`. Then
confirm it renders: any story using `<and-icon name="...">` in Storybook.

---

## P5 — Add a design token or theme

**Token:** add to **both** `packages/web-components/tailwind.config.js` (as
`hsl(var(--token))`) **and** `packages/web-components/src/global/themes.css`
(light + `.dark` values). One without the other is a bug.

**Theme:** create `packages/web-components/themes/<name>.css` copying an
existing theme file (same variable set, light + dark), then add the subpath
export in `packages/web-components/package.json`
(`"./<name>": "./themes/<name>.css"`).

**Verify:** `pnpm build:stencil && pnpm storybook` — toggle the theme in a story
and check both light and dark modes.

---

## P6 — Fix a bug in an existing component

1. Reproduce first: find or write a failing test (`.spec.tsx` for Stencil,
   `__tests__` for headless) **before** changing code.
2. Decide the correct layer: behavior/state/keyboard bugs → `headless-core`;
   rendering/styling/DOM bugs → `web-components`/`vanilla-components`. Fixing
   behavior in the rendering layer is wrong even if it works.
3. Apply the minimal fix; do not refactor surrounding code in the same change.
4. If the fix changes headless behavior, check **both** rendering layers
   (Stencil + vanilla) for the same symptom.

**Verify:** the previously failing test now passes; full package test suite
passes; `pnpm build:stencil` still succeeds.

---

## P7 — Prepare a release entry

1. After your change is complete and verified, run `pnpm changeset`.
2. Select **only** the packages you actually modified (workspace dependents get
   patched automatically).
3. Bump type: `patch` = fix/internal, `minor` = new component/prop/feature,
   `major` = breaking API change (renamed prop/event, removed export).
4. Write the changeset description as a changelog entry for consumers (what
   changed and how to use it), not a commit message.
5. Commit the generated `.changeset/*.md` file with your change. **Never** run
   `pnpm release` or the `publish:*` scripts locally — CI publishes.

---

## P8 — Update documentation

- Public usage docs → root `README.md` (keep the component table in sync with
  `packages/web-components/src/components/`).
- Architecture/contracts → `docs/SSD.md` (update the relevant section, including
  the debt register §15).
- Agent rules → `AGENTS.md`. File locations → `docs/CODEMAP.md`. Recipes → this
  file.
- Never hand-edit generated docs (component `readme.md`,
  `custom-elements.json`).

---

## Common failure modes and their real causes

| Symptom                                                                | Real cause                                                                                                    | Fix                                                                            |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Stencil spec tests fail with unresolved `@andersseen/icon`             | Sibling packages not built (vitest aliases point at `../icon-library/dist/`)                                  | `pnpm build:stencil` first                                                     |
| Component renders but never updates after headless state change        | Missing `renderTick` subscription                                                                             | Subscribe in `componentWillLoad()`, increment a `@State()` counter             |
| Subscriber not notified after `setState`                               | Passed the same object reference for a nested key (shallow equality)                                          | Replace nested objects, don't mutate                                           |
| Styles missing in Shadow DOM                                           | Utility classes placed in `and-<name>.css` instead of the CVA map, or token missing from `tailwind.config.js` | Classes live in `.tsx` via CVA; tokens in both config + themes.css             |
| `EventTarget is not defined` / weird test env errors in headless tests | Someone used `EventTarget`/DOM in headless-core                                                               | Use `StateStore`; remove DOM usage                                             |
| Angular wrappers out of date / missing new component                   | Wrappers are generated at Stencil build time                                                                  | `pnpm build:stencil`, never edit `stencil-generated/`                          |
| Husky blocks commit                                                    | Prettier formatting on staged files                                                                           | `pnpm format`, restage                                                         |
| `pnpm build:all` fails in `build:angular` with memory errors           | Angular build is heavy                                                                                        | Retry; `NODE_OPTIONS=--max-old-space-size=8192` (already set for `start:demo`) |
| e2e (`*.e2e.ts`) fails or won't run                                    | Stencil/Puppeteer e2e is deprecated in this repo                                                              | Do not write new e2e; cover with `.spec.tsx`                                   |
