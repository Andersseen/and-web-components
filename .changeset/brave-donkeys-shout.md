---
'@andersseen/web-components': minor
'@andersseen/headless-components': minor
---

Fix five accessibility and form-participation defects found by driving the built
components in a real browser. All are verified by new regression tests (the
focus-trap suite fails 5/5 against the previous implementation).

**`and-button` now participates in forms.** The real `<button>` lives in the
component's shadow root, so it has no form owner and implicit submission never
reached the enclosing `<form>` — `type="submit"` was silently inert. The click
handler now resolves the associated form and calls `requestSubmit()` /
`reset()`, preserving native constraint validation and the cancellable `submit`
event. Adds a `form` prop mirroring the native `form` attribute.

**The modal/drawer focus trap now spans slotted content.** It was a flat
`shadowRoot.querySelectorAll()`, which sees neither slotted light-DOM content
nor focusables nested inside another component's shadow root — in practice the
trap collapsed to "the close button" and Shift+Tab from the first field escaped
the dialog into the page behind it. The trap now walks the composed tree (slots
and nested shadow roots), tracks the deep active element so `delegatesFocus`
components compare correctly, pulls stray focus back in, and prefers
`[autofocus]`. Hidden-ness is no longer decided by `offsetParent`, which is
always null for the `position: fixed` content of an overlay.

**`andModalClose` now fires exactly once per close.** The close sequence wrote
`open`, which re-entered the `@Watch` and started a second close — emitting the
event twice and replaying the exit animation when `animated` was set. Focus
restoration, which never ran on the animated path, now runs on every path.

**Modal now locks body scroll and makes the background `inert`.** Both are
reference-counted / self-restoring so nested overlays don't clobber each other's
cleanup; the drawer's previous `body.style.overflow = ''` reset leaked a
scrollable body as soon as a second overlay was involved. Scrollbar width is
compensated so the page doesn't shift.

**Modals are no longer all announced as "Dialog".** `and-modal` gains `label`,
and when it is unset a slotted heading is adopted as `aria-labelledby`
automatically. `createModal` no longer invents a generic `aria-label` — it now
omits the attribute unless a label is configured, so an unnamed dialog fails an
audit instead of passing one while announcing nothing useful.

Also in this release:

- `and-modal` exposes `closeOnEscape`, `closeOnOverlayClick` and `hideClose`
  props (the headless logic already supported the first two, but nothing
  surfaced them), plus `show()` / `hide()` methods.
- `and-modal`, `and-button` and `and-input` expose CSS `part`s (`overlay`,
  `container`, `content`, `close-button`, `button`, `link`, `input`) so
  consumers can restyle internals through the shadow boundary.
- `createInput` emits ARIA state attributes as the strings `'true'`/`'false'`
  instead of booleans. A boolean `true` serialised to `aria-required=""`, which
  is not a valid ARIA boolean and was read as the default (false). `and-input`
  no longer renders empty `aria-label` / `aria-describedby` attributes.
