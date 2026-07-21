#!/usr/bin/env node
/**
 * stdio entry point for the And Web Components MCP server.
 *
 * Runs the server over stdin/stdout so any MCP client (Claude Desktop/Code,
 * Cursor, Windsurf, VS Code, GitHub Copilot, …) can launch it with:
 *
 *   npx -y @andersseen/mcp
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server';

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Never write to stdout here — it is the JSON-RPC channel. Logs go to stderr.
  console.error('and-web-components MCP server running on stdio');
}

main().catch(error => {
  console.error('Fatal error starting and-web-components MCP server:', error);
  process.exit(1);
});
