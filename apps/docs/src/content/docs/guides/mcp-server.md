---
title: MCP Server (AI assistants)
description:
  Let Claude, Cursor, Copilot and other AI assistants query the component
  catalog and generate correct code.
---

[`@andersseen/mcp`](https://github.com/Andersseen/and-web-components/tree/main/packages/mcp)
is a [Model Context Protocol](https://modelcontextprotocol.io) server for And
Web Components. When you connect it to an AI assistant (Claude, Cursor,
Windsurf, VS Code, GitHub Copilot, …), the assistant can look up the **real**
component API and generate **correct, framework-specific** code — instead of
guessing attributes, events, or selectors.

The catalog is generated from the library's own `custom-elements.json`, so it
always matches the components you actually have installed.

## Run it

No install step — it runs on your machine over stdio:

```bash
npx -y @andersseen/mcp
```

## Connect your assistant

### Claude Code / Claude Desktop

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "and-web-components": {
      "command": "npx",
      "args": ["-y", "@andersseen/mcp"]
    }
  }
}
```

### Cursor / Windsurf

Add to `.cursor/mcp.json` (same shape as above).

### VS Code

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "and-web-components": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@andersseen/mcp"]
    }
  }
}
```

## What your assistant can do

Once connected, the assistant has these tools:

- **`list_components`** — list the components (top-level with their
  sub-components, or every tag).
- **`get_component`** — full metadata for a tag: attributes (with types and
  defaults), events, public methods, slots, and CSS parts.
- **`get_usage_example`** — a ready-to-paste import + snippet for a component in
  `html`, `react`, `vue`, or `angular`.
- **`get_install_info`** — which `@andersseen/*` package to install and how to
  register it, per framework.
- **`get_theme_info`** — color palettes, style presets, and dark-mode setup.
- **`get_project_info`** — project overview, package list, naming conventions.

It also exposes `component://{tag}`, `theme://info`, and `project://info`
resources, plus `generate-component` and `troubleshooting` prompts.

## Example

Ask your assistant something like _"add an And Web Components modal to my React
app"_ and, behind the scenes, `get_usage_example` returns:

```jsx
import { AndModal } from '@andersseen/react-components';

<AndModal animated={true} open={true} onAndModalClose={handleEvent}>
  {/* content */}
</AndModal>;
```

Because the same Stencil components back every framework, the assistant maps a
tag like `and-modal` to the right selector automatically: `<and-modal>` in
HTML/Vue/Angular, `<AndModal>` in React.
