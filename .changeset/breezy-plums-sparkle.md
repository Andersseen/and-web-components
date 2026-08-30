---
'@andersseen/web-components': minor
'@andersseen/headless-components': minor
---

Fixed real, browser-verified defects found while adding R2.7b's Playwright
coverage for and-dropdown, and-tabs, and-accordion, and-tooltip, and-carousel,
and-menu-list, and-context-menu, and and-drawer:

- **Breaking:** renamed `and-menu-list`'s `ariaMenuLabel` prop /
  `aria-menu-label` attribute to `menuLabel` / `menu-label`. The old name was an
  invalid ARIA attribute (`aria-*` is reserved for the standard vocabulary) and
  was flagged as a critical `aria-valid-attr` violation by axe; the new name
  matches `and-context-menu`'s existing `menuLabel` convention.
- Fixed a systemic bug where several headless modules (`dropdown`, `accordion`,
  `tooltip`, `menu-list`, `drawer`) passed raw JS booleans for `aria-*` props.
  Stencil serializes a boolean passed to a non-native attribute as an HTML
  boolean attribute (`true` → empty-string attribute, `false` → attribute
  removed) instead of the literal `"true"`/`"false"` strings ARIA requires — so
  `aria-expanded`, `aria-disabled`, `aria-hidden`, and `aria-modal` were
  rendering as invalid or missing in real browsers despite looking correct in
  mock-doc specs. All five modules now emit `'true' | 'false'` string literals,
  matching the already-correct pattern in `select.ts`/`tabs.ts`.
- `and-tabs`: a per-tab `disabled` trigger blocked clicks but not
  ArrowKey/Home/End navigation (which auto-activates it in the default
  `automatic` mode) and never reflected `aria-disabled`. Disabled triggers are
  now excluded from keyboard navigation and correctly expose `aria-disabled`.
- `and-tabs`: `<and-tabs orientation="vertical">` never propagated to the child
  `<and-tabs-list>`, which kept its own default and reported
  `aria-orientation="horizontal"` even though arrow-key navigation correctly
  used the vertical direction.
- `and-drawer`: removed the invented `"Drawer"` fallback name so an unlabeled
  drawer gets no accessible name at all (matching `and-modal`'s existing
  behavior) instead of a meaningless empty `aria-label`.
- `and-drawer`: fixed a race where a bare `requestAnimationFrame` could focus
  nothing on open because Stencil hadn't yet committed the "open" render
  (slotted content was still `aria-hidden`) — deferred to `componentDidRender`,
  the same fix already applied to `and-modal`.
- `and-drawer`: focus was never restored to the trigger when closing via Escape,
  the overlay, or the close button (only closing by setting the `open` prop
  externally worked) — a re-entrancy ordering bug in the `open`-prop watcher.
  Fixed by restoring focus directly from the close callback, after releasing the
  background's `inert` state (an inert element cannot be focused).
- `and-menu-list`: with `items` provided (its documented "focus managed for you"
  mode), no item ever got `tabindex="0"`, making the whole menu unreachable by
  sequential Tab navigation — this also silently affected the standalone
  `and-menu-item`, which shares the same engine. Roving focus now defaults to
  the first enabled item.
- `and-menu-list`: arrow-key navigation updated the visual/ARIA "active" state
  but never moved real DOM focus, because the `ref` callback that used to call
  `.focus()` only fires when a list node is first created, not on state-driven
  re-renders of an existing node. Focus now follows the roving tabindex
  explicitly on every keydown.
- `and-dropdown`: disabled menu items had no `aria-disabled`, so axe correctly
  flagged their dimmed, low-contrast text as a real violation (nothing marked
  them as an inactive, contrast-exempt component). Added, matching
  `and-context-menu`'s existing pattern.
- `and-accordion`: removed `aria-controls` from the trigger — it referenced an
  `id` on `and-accordion-content`, a sibling Stencil component in a _different_
  shadow tree, so the ID reference could never resolve (same root cause as the
  `and-modal` `aria-labelledby` fix from R2.11/TD-15; verified live via axe's
  critical `aria-valid-attr-value` violation). `aria-expanded` and DOM adjacency
  still convey the relationship.
- Fixed misleading JSDoc `@example`s on `and-dropdown`, `and-context-menu`, and
  `and-menu-list` that showed `items='[...]'` as an HTML attribute string — that
  crashes at runtime (`this.items.map is not a function`); `items` has always
  been property-only (the generated docs table already said `Attribute: --`).
