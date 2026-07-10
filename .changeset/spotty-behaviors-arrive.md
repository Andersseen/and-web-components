---
'@andersseen/behaviors': minor
---

Add `@andersseen/behaviors`: framework-agnostic DOM behaviors driven by `and-*`
attributes (splitter, drag & drop, tooltip, dialog). Wire them declaratively
with `defineBehaviors()` or imperatively via `createSplitter`,
`createDraggable`, `createDropZone`, `createTooltip`, and `createDialog`. Ships
ESM + CJS with zero runtime dependencies. Migrated from the experimental
`@quartz/web` package with accessibility improvements: tooltips are dismissable
with `Escape` (WCAG 1.4.13), splitter handles get a default `aria-label`, and
dialog focus traps skip `[disabled]` / `[aria-hidden]` controls.
