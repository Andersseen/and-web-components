import { homedir } from 'os';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

interface MCPServer {
  value: string;
  url: string;
}

export class VSCodeInstaller {
  name = 'VS Code';
  installUrl = 'https://code.visualstudio.com/';

  private getSettingsPath(): string {
    return join(homedir(), '.vscode', 'settings.json');
  }

  async isInstalled(): Promise<boolean> {
    // Check for vscode command
    try {
      const home = homedir();
      const vscodePaths = [
        join(home, '.vscode'),
        '/Applications/Visual Studio Code.app',
        join(home, 'Applications', 'Visual Studio Code.app'),
      ];

      return vscodePaths.some(path => existsSync(path));
    } catch {
      return false;
    }
  }

  async install(servers: MCPServer[]): Promise<void> {
    const settingsPath = this.getSettingsPath();

    // Read existing settings or create new
    let settings: any = {};
    if (existsSync(settingsPath)) {
      try {
        const content = readFileSync(settingsPath, 'utf-8');
        settings = JSON.parse(content);
      } catch {
        settings = {};
      }
    }

    // Ensure mcp.servers exists
    if (!settings['mcp.servers']) {
      settings['mcp.servers'] = {};
    }

    // Add/update MCP servers
    servers.forEach(server => {
      const serverName = server.value.replace(/[@/]/g, '-');
      settings['mcp.servers'][serverName] = {
        url: server.url,
      };
    });

    // Write settings
    writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  }
}
