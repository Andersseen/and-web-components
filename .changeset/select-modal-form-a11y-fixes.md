---
'@andersseen/web-components': patch
'@andersseen/headless-components': patch
---

Fix three real correctness bugs in `and-select` and `and-modal`, found by
driving the built `dist/` output in real browsers (Chromium, Firefox, WebKit)
rather than by reading specs:

- `and-select`: a disabled select (via the `disabled` prop, not just
  `<fieldset disabled>`) could still contribute a stale value to `FormData`, and
  `required` had no real effect at all — the previous hidden
  `<input type="hidden">` form mirror is unconditionally barred from constraint
  validation per the HTML spec, so nothing ever blocked submission or showed
  native validation UI. The mirror is now a visually hidden, focusable native
  `<select>` (`sr-only`, `tabindex="-1"`), which correctly participates in
  `disabled`/`required` constraint validation while staying out of the normal
  tab order. Also fixed: clicking an option with the mouse left the menu open
  (only keyboard `Enter` closed it) — selecting a value now closes the menu the
  same way regardless of input method.
- `and-modal`: an unnamed dialog (no `label` prop, no slotted heading) rendered
  `aria-label="Dialog"`, a generic invented name that let real authoring
  mistakes silently pass accessibility checks. That fallback is removed — an
  unnamed modal now has no accessible name at all, with a one-time console
  warning as a development-time diagnostic. Separately, the existing "adopt a
  slotted heading" mechanism used `aria-labelledby` pointing at the heading's
  `id`, which cannot resolve across the shadow/light DOM boundary in real
  browsers (verified live: the computed accessible name was empty despite a
  "resolved" attribute) — it now reads the heading's text directly into
  `aria-label` instead, which works reliably in every engine and no longer
  mutates the slotted heading's `id`.

A new permanent Playwright suite (`packages/web-components/e2e/`, Chromium +
Firefox + WebKit) plus `@axe-core/playwright` accessibility checks now covers
these fixes and the existing form-participation behavior of `and-input`,
`and-switch`, and `and-button type="submit"/"reset"` in real browsers, runnable
via `pnpm -C packages/web-components test:e2e`.
