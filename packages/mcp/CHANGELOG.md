# @andersseen/mcp

## 0.1.1

### Patch Changes

- Regenerated the catalog against `@andersseen/web-components@0.4.0`
  (`CATALOG_VERSION` `2026-07-23`). Without this release the server would keep
  serving pre-0.4.0 metadata, which is the one thing it exists to get right —
  assistants would suggest an API that no longer matches the shipped components.
  Picked up:
  - `and-button`: the new `form` property, and the corrected description
    explaining that `type="submit"` / `type="reset"` are honoured explicitly
    (the real `<button>` is inside the shadow root, so implicit form submission
    never reaches the enclosing `<form>`).
  - `and-modal`: the new `label`, `closeOnEscape`, `closeOnOverlayClick` and
    `hideClose` properties, the `show()` / `hide()` methods, and the `overlay` /
    `container` / `content` / `close-button` CSS parts.
  - `and-input`: the `input` CSS part.

## 0.1.0

### Minor Changes

- eaf7b01: Add `@andersseen/mcp`: a Model Context Protocol (stdio) server that
  lets AI assistants (Claude, Cursor, Windsurf, VS Code, GitHub Copilot, …)
  query the And Web Components catalog and generate correct, framework-specific
  usage snippets (`html` / `react` / `vue` / `angular`). Run it with
  `npx -y @andersseen/mcp`.

  The catalog is generated from `@andersseen/web-components`'
  `custom-elements.json`, so it always matches the shipped components.
