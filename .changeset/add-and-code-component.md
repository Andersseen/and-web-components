---
'@andersseen/web-components': minor
---

Add lightweight `and-code` component for command snippets

- Introduces `<and-code>`: a small, dependency-free code/command display block.
- Supports `value`, `language` (bash/shell/npm/yarn/pnpm/text), `theme`
  (dark/light), `copyable`, `show-prompt`, and `height` props.
- Includes one-click clipboard copy with `andCodeCopy` event.
- Ships with Stencil spec tests and Storybook stories.
