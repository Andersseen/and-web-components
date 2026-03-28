# @andersseen/mcp-cli

Interactive CLI to install @andersseen MCP (Model Context Protocol) servers for
AI agents like Claude, Cursor, and VS Code.

## 🚀 Quick Start

```bash
# Run without installing
npx @andersseen/mcp

# Or install globally
npm install -g @andersseen/mcp-cli
andersseen-mcp
```

## ✨ Features

- **🎯 Interactive Setup** - Select which MCP servers to install
- **🤖 Multi-Agent Support** - Configure Claude, Cursor, VS Code
- **⚡ Quick Install** - Use `-y` flag for defaults
- **📋 Manual Setup** - Get JSON config for custom setup
- **🔄 Updates** - Easily add/remove MCP servers

## 📦 Available MCP Servers

| Package                           | Description                  | Tools   |
| --------------------------------- | ---------------------------- | ------- |
| `@andersseen/web-components`      | 20+ accessible UI components | 4 tools |
| `@andersseen/headless-components` | Framework-agnostic logic     | 3 tools |
| `@andersseen/icon`                | 70+ tree-shakeable icons     | 3 tools |
| `@andersseen/motion`              | Animation utilities          | 2 tools |
| `@andersseen/layout`              | CSS layout patterns          | 2 tools |

## 🎯 Usage

### Interactive Mode (Recommended)

```bash
npx @andersseen/mcp
```

This will:

1. Show list of available MCP servers
2. Let you select multiple servers
3. Choose your AI agent (Claude, Cursor, VS Code)
4. Automatically configure the agent

### Quick Install

Install Web Components + Claude Desktop with defaults:

```bash
npx @andersseen/mcp --yes
# or
npx @andersseen/mcp -y
```

### Manual Configuration

Get JSON configuration for manual setup:

```bash
npx @andersseen/mcp
# Select "Manual Setup" as agent
```

## 🤖 Supported AI Agents

### Claude Desktop

**Config location:**

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

**Installation:**

1. Run `npx @andersseen/mcp`
2. Select your MCP servers
3. Choose "Claude Desktop"
4. Restart Claude if it's running
5. Look for the 🔧 MCP indicator

### Cursor

**Config locations:**

- Project: `.cursor/mcp.json`
- Global: `~/.cursor/mcp.json`

**Installation:**

1. Run `npx @andersseen/mcp`
2. Select your MCP servers
3. Choose "Cursor"
4. The CLI will configure both project and global settings
5. Restart Cursor

### VS Code

**Config location:**

- `~/.vscode/settings.json`

**Requirements:**

- Install
  [MCP extension](https://marketplace.visualstudio.com/items?itemName=mcp.vscode-mcp)
  for VS Code

**Installation:**

1. Run `npx @andersseen/mcp`
2. Select your MCP servers
3. Choose "VS Code"
4. Reload VS Code window

## 💡 Example Usage

Once installed, you can ask your AI agent:

```
"How do I create a modal with a form using @andersseen components?"
```

The agent will:

1. Call `webcomponents_get_info` for `and-modal`
2. Get all props, slots, and events
3. Generate complete React/HTML code
4. Show installation instructions

```
"Search for an icon that represents 'download'"
```

The agent will:

1. Call `icon_search` with query "download"
2. Find matching icons
3. Generate usage code

## 📋 CLI Options

```bash
Usage: andersseen-mcp [options]

Interactive setup for AI agent integrations

Options:
  -V, --version   output the version number
  -y, --yes       Skip prompts and use defaults (Web Components + Claude)
  -h, --help      display help for command
```

## 🔧 Troubleshooting

### "Command not found"

Install globally or use npx:

```bash
npm install -g @andersseen/mcp-cli
# or
npx @andersseen/mcp
```

### "Agent not detected"

The CLI checks common installation paths. If your agent is installed in a custom
location:

1. Choose "Manual Setup" in the CLI
2. Copy the JSON configuration
3. Paste it into your agent's config file manually

### "MCP not working in agent"

1. Restart your AI agent completely
2. Check that the config file was created:
   - Claude: Look for 🔧 icon in the UI
   - Cursor: Check `.cursor/mcp.json` exists
   - VS Code: Check MCP extension is installed

### Update MCP servers

Run the CLI again to add or remove servers:

```bash
npx @andersseen/mcp
```

## 🏗️ Development

```bash
cd packages/mcp-cli
npm install
npm run dev
```

## 📄 License

MIT

## 🔗 Links

- [GitHub Repository](https://github.com/Andersseen/and-web-components)
- [npm Package](https://www.npmjs.com/package/@andersseen/mcp-cli)
- [Documentation](https://github.com/Andersseen/and-web-components/tree/main/packages/mcp-cli)

---

Made with ❤️ by [@andersseen](https://github.com/Andersseen)
