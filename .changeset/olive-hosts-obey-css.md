---
'@andersseen/web-components': patch
---

Stop `component-base.css` from silently overriding each component's own `:host`
display.

Stencil concatenates `styleUrls` in array order, and nine components listed
`../../global/component-base.css` _after_ their own stylesheet — so the base
sheet's closing `:host { display: block }` won the cascade against whatever the
component had just declared. `and-button`, `and-context-menu`, `and-dropdown`
and `and-switch` asked for `inline-block` and rendered as full-width blocks;
`and-modal` and `and-drawer` asked for `display: contents` and rendered as block
boxes, adding a phantom item inside flex/grid parents. (`and-badge`,
`and-card-header` and `and-card-footer` were saved by a utility class on the
host, so they change nothing visually, but their declarations were just as
dead.)

The base stylesheet now comes first in all nine, so a component's own `:host`
rule wins. `src/__tests__/host-display.test.ts` enforces the ordering for any
component declaring a non-`block` host display.

Note for consumers: buttons, dropdowns, context menus and switches are now
inline-level again, so adjacent ones flow on the same line instead of stacking.
`and-button` also documents how to get a full-width button (`class="w-full"`, or
`::part(button)`), since there is no `full` prop.
