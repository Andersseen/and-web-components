# @andersseen/mcp

A [Model Context Protocol](https://modelcontextprotocol.io) server for **And Web
Components**. It lets AI assistants (Claude, Cursor, Windsurf, VS Code, GitHub
Copilot, …) query the real component catalog and generate **correct,
framework-specific** usage snippets — instead of guessing attributes, events, or
selectors.

The catalog is generated from `@andersseen/web-components`'
[`custom-elements.json`](../web-components/custom-elements.json), so it always
matches the shipped components.

## Run it

No install required — it runs on the developer's machine over stdio:

```bash
npx -y @andersseen/mcp
```

## Add it to your AI assistant

### Claude Code / Claude Desktop (`.mcp.json`)

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

### Cursor / Windsurf (`.cursor/mcp.json`)

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

### VS Code (`.vscode/mcp.json`)

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

## What it exposes

### Tools

| Tool                | What it does                                                                 |
| ------------------- | ---------------------------------------------------------------------------- |
| `list_components`   | List components (top-level with sub-components, or every tag).               |
| `get_component`     | Full metadata for a tag: attributes, events, methods, slots, CSS parts.      |
| `get_usage_example` | Ready-to-paste import + snippet for `html` \| `react` \| `vue` \| `angular`. |
| `get_install_info`  | Which `@andersseen/*` package to install and how to register it.             |
| `get_theme_info`    | Color palettes, style presets, dark-mode setup.                              |
| `get_project_info`  | Project overview, package list, naming conventions.                          |

### Resources

- `component://{tag}` — metadata for a single component (listable)
- `theme://info` — theme colors, styles, dark-mode setup
- `project://info` — project overview

### Prompts

- `generate-component` — generate a correct example for a component + framework
- `troubleshooting` — diagnose a common And Web Components problem

## Example

`get_usage_example({ component: "and-modal", framework: "react" })`:

```jsx
import { AndModal } from '@andersseen/react-components';

<AndModal animated={true} open={true} onAndModalClose={handleEvent}>
  {/* content */}
</AndModal>;
```

## How the catalog stays in sync

`custom-elements.json` is a build artifact of `@andersseen/web-components` (not
committed). The committed, published catalog lives in `src/catalog-generated.ts`
and is regenerated on `build` (via the `prebuild` step) whenever the CEM is
present:

```bash
pnpm --filter @andersseen/mcp generate       # rewrite the catalog from the CEM
pnpm --filter @andersseen/mcp check:catalog  # fail if it drifted (CI-friendly)
```

Never hand-edit `src/catalog-generated.ts`.

## Architecture note

The server is transport-agnostic: [`src/server.ts`](./src/server.ts) exports a
`createServer()` factory, and [`src/stdio.ts`](./src/stdio.ts) wires it to
stdin/stdout. The same factory can later be mounted behind an HTTP transport
(e.g. a Cloudflare Worker serving a hosted URL) without touching any tool logic.
