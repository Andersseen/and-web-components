import { homedir } from 'os';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';

interface MCPServer {
  value: string;
  url: string;
}

export class CursorInstaller {
  name = 'Cursor';
  installUrl = 'https://cursor.sh/';

  private getConfigPath(): string {
    return join(process.cwd(), '.cursor', 'mcp.json');
  }

  private getGlobalConfigPath(): string {
    return join(homedir(), '.cursor', 'mcp.json');
  }

  async isInstalled(): Promise<boolean> {
    // Check for cursor command
    try {
      // Simple check: look for cursor in common paths
      const home = homedir();
      const cursorPaths = [
        join(home, '.cursor'),
        join(home, 'Applications', 'Cursor.app'),
        '/Applications/Cursor.app',
        join(home, 'AppData', 'Local', 'Programs', 'cursor'),
      ];

      return cursorPaths.some(path => existsSync(path));
    } catch {
      return false;
    }
  }

  async install(servers: MCPServer[]): Promise<void> {
    // Install in current project
    const configPath = this.getConfigPath();
    const configDir = join(configPath, '..');

    // Ensure .cursor directory exists
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }

    // Read existing config or create new
    let config: any = {};
    if (existsSync(configPath)) {
      try {
        const content = readFileSync(configPath, 'utf-8');
        config = JSON.parse(content);
      } catch {
        config = {};
      }
    }

    // Ensure mcpServers exists
    if (!config.mcpServers) {
      config.mcpServers = {};
    }

    // Add/update MCP servers
    servers.forEach(server => {
      const serverName = server.value.replace(/[@/]/g, '-');
      config.mcpServers[serverName] = {
        url: server.url,
      };
    });

    // Write config
    writeFileSync(configPath, JSON.stringify(config, null, 2));

    // Also update global config
    await this.installGlobal(servers);
  }

  private async installGlobal(servers: MCPServer[]): Promise<void> {
    const configPath = this.getGlobalConfigPath();
    const configDir = join(configPath, '..');

    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }

    let config: any = {};
    if (existsSync(configPath)) {
      try {
        const content = readFileSync(configPath, 'utf-8');
        config = JSON.parse(content);
      } catch {
        config = {};
      }
    }

    if (!config.mcpServers) {
      config.mcpServers = {};
    }

    servers.forEach(server => {
      const serverName = server.value.replace(/[@/]/g, '-');
      config.mcpServers[serverName] = {
        url: server.url,
      };
    });

    writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
}
