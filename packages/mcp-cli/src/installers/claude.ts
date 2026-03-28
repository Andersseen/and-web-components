import { homedir, platform } from 'os';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';

interface MCPServer {
  value: string;
  url: string;
}

export class ClaudeInstaller {
  name = 'Claude Desktop';
  installUrl = 'https://claude.ai/download';

  private getConfigPath(): string {
    const home = homedir();

    switch (platform()) {
      case 'darwin':
        return join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
      case 'win32':
        return join(home, 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
      default:
        // Linux
        return join(home, '.config', 'Claude', 'claude_desktop_config.json');
    }
  }

  async isInstalled(): Promise<boolean> {
    const configPath = this.getConfigPath();
    return existsSync(configPath) || this.isAppInstalled();
  }

  private isAppInstalled(): boolean {
    // Check if Claude app exists
    const home = homedir();

    switch (platform()) {
      case 'darwin':
        return existsSync('/Applications/Claude.app');
      case 'win32':
        return existsSync(join(home, 'AppData', 'Local', 'AnthropicClaude', 'Claude.exe'));
      default:
        return existsSync(join(home, '.local', 'share', 'Claude', 'claude'));
    }
  }

  async install(servers: MCPServer[]): Promise<void> {
    const configPath = this.getConfigPath();
    const configDir = join(configPath, '..');

    // Ensure directory exists
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
  }
}
