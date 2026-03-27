import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { program } from 'commander';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { ClaudeInstaller } from './installers/claude.js';
import { CursorInstaller } from './installers/cursor.js';
import { VSCodeInstaller } from './installers/vscode.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get version from package.json
const packageJson = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

// Available MCP servers
const MCP_SERVERS = [
  {
    name: '🎨 @andersseen/web-components',
    value: 'web-components',
    description: 'Web Components - 20+ accessible UI components',
    url: 'https://andersseen-mcp.tu-usuario.workers.dev/mcp',
  },
  {
    name: '⚙️  @andersseen/headless-components',
    value: 'headless-components',
    description: 'Headless Components - Framework-agnostic logic',
    url: 'https://andersseen-headless-mcp.tu-usuario.workers.dev/mcp',
  },
  {
    name: '🎯 @andersseen/icon',
    value: 'icon',
    description: 'Icon Library - 70+ tree-shakeable icons',
    url: 'https://andersseen-icon-mcp.tu-usuario.workers.dev/mcp',
  },
  {
    name: '✨ @andersseen/motion',
    value: 'motion',
    description: 'Motion - Animation utilities',
    url: 'https://andersseen-motion-mcp.tu-usuario.workers.dev/mcp',
  },
  {
    name: '📐 @andersseen/layout',
    value: 'layout',
    description: 'Layout - CSS layout patterns',
    url: 'https://andersseen-layout-mcp.tu-usuario.workers.dev/mcp',
  },
];

// Available AI agents
const AI_AGENTS = [
  {
    name: '🤖 Claude Desktop',
    value: 'claude',
    description: 'Anthropic Claude Desktop app',
  },
  {
    name: '💫 Cursor',
    value: 'cursor',
    description: 'Cursor code editor',
  },
  {
    name: '🔷 VS Code',
    value: 'vscode',
    description: 'Visual Studio Code with MCP extension',
  },
  {
    name: '📝 Manual Setup',
    value: 'manual',
    description: 'Show configuration for manual setup',
  },
];

program
  .name('andersseen-mcp')
  .description('Install @andersseen MCP servers for AI agents')
  .version(packageJson.version)
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(async options => {
    console.log(chalk.bold.cyan('\n🚀 @andersseen MCP Installer\n'));
    console.log(chalk.gray('Interactive setup for AI agent integrations\n'));

    try {
      if (options.yes) {
        await quickInstall();
      } else {
        await interactiveInstall();
      }
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

async function interactiveInstall() {
  // Step 1: Select MCP servers
  const { selectedServers } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedServers',
      message: chalk.bold('Which MCP servers would you like to install?'),
      choices: MCP_SERVERS.map(server => ({
        name: `${server.name} ${chalk.gray(server.description)}`,
        value: server.value,
        checked: server.value === 'web-components', // Default checked
      })),
      validate: input => {
        if (input.length === 0) {
          return 'Please select at least one MCP server';
        }
        return true;
      },
    },
  ]);

  console.log(chalk.green(`\n✓ Selected ${selectedServers.length} server(s)`));

  // Step 2: Select AI agent
  const { selectedAgent } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedAgent',
      message: chalk.bold('Which AI agent would you like to configure?'),
      choices: AI_AGENTS.map(agent => ({
        name: `${agent.name} ${chalk.gray(agent.description)}`,
        value: agent.value,
      })),
    },
  ]);

  console.log(chalk.green(`\n✓ Selected: ${AI_AGENTS.find(a => a.value === selectedAgent)?.name}`));

  // Step 3: Confirm installation
  const serversToInstall = MCP_SERVERS.filter(s => selectedServers.includes(s.value));

  console.log(chalk.bold('\n📋 Installation Summary:'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.bold('Servers:'));
  serversToInstall.forEach(server => {
    console.log(`  ${server.name}`);
  });
  console.log(chalk.bold('\nAgent:'));
  console.log(`  ${AI_AGENTS.find(a => a.value === selectedAgent)?.name}`);
  console.log(chalk.gray('─'.repeat(50)));

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Proceed with installation?',
      default: true,
    },
  ]);

  if (!confirm) {
    console.log(chalk.yellow('\n⚠️  Installation cancelled'));
    return;
  }

  // Step 4: Install
  await installServers(serversToInstall, selectedAgent);
}

async function quickInstall() {
  // Quick install with defaults
  const defaultServers = [MCP_SERVERS[0]]; // web-components only
  const defaultAgent = 'claude';

  console.log(chalk.yellow('\n⚡ Quick Install Mode'));
  console.log(chalk.gray('Using defaults: Web Components + Claude Desktop\n'));

  await installServers(defaultServers, defaultAgent);
}

async function installServers(servers: typeof MCP_SERVERS, agent: string) {
  const spinner = ora('Installing MCP servers...').start();

  try {
    let installer;

    switch (agent) {
      case 'claude':
        installer = new ClaudeInstaller();
        break;
      case 'cursor':
        installer = new CursorInstaller();
        break;
      case 'vscode':
        installer = new VSCodeInstaller();
        break;
      case 'manual':
        spinner.stop();
        showManualSetup(servers);
        return;
      default:
        throw new Error(`Unknown agent: ${agent}`);
    }

    // Check if agent is installed
    spinner.text = 'Checking AI agent installation...';
    const isInstalled = await installer.isInstalled();

    if (!isInstalled) {
      spinner.stop();
      console.log(chalk.yellow(`\n⚠️  ${installer.name} is not installed`));
      console.log(chalk.gray(`Please install ${installer.name} first:`));
      console.log(chalk.cyan(`  ${installer.installUrl}`));
      return;
    }

    // Install MCP servers
    spinner.text = `Configuring ${installer.name}...`;
    await installer.install(servers);

    spinner.succeed(chalk.green(`Successfully configured ${installer.name}!`));

    // Show next steps
    console.log(chalk.bold('\n🎉 Installation Complete!\n'));
    console.log(chalk.bold('Next steps:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('1.'), `Restart ${installer.name} if it's running`);
    console.log(chalk.white('2.'), 'Look for the 🔧 MCP indicator in your AI agent');
    console.log(chalk.white('3.'), 'Start asking about @andersseen components!');
    console.log(chalk.gray('─'.repeat(50)));

    console.log(chalk.bold('\n💡 Example questions you can now ask:'));
    console.log(chalk.cyan('  • "How do I create a modal with a form?"'));
    console.log(chalk.cyan('  • "Show me all available button variants"'));
    console.log(chalk.cyan('  • "Create a login page using and-components"'));
    console.log(chalk.cyan('  • "What icons are available for download?"'));
  } catch (error) {
    spinner.fail(chalk.red('Installation failed'));
    throw error;
  }
}

function showManualSetup(servers: typeof MCP_SERVERS) {
  console.log(chalk.bold('\n📋 Manual Configuration\n'));
  console.log(chalk.gray('Add this configuration to your AI agent:\n'));

  const config = {
    mcpServers: Object.fromEntries(
      servers.map(server => [
        server.value.replace('@andersseen/', '').replace('/', '-'),
        {
          url: server.url,
        },
      ]),
    ),
  };

  console.log(chalk.cyan('Configuration JSON:'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(JSON.stringify(config, null, 2));
  console.log(chalk.gray('─'.repeat(50)));

  console.log(chalk.bold('\nAgent-specific locations:\n'));

  console.log(chalk.bold('Claude Desktop:'));
  console.log(chalk.gray('  ~/Library/Application Support/Claude/claude_desktop_config.json'));
  console.log(chalk.gray('  %APPDATA%\\Claude\\claude_desktop_config.json (Windows)\n'));

  console.log(chalk.bold('Cursor:'));
  console.log(chalk.gray('  .cursor/mcp.json (project-specific)'));
  console.log(chalk.gray('  ~/.cursor/mcp.json (global)\n'));

  console.log(chalk.bold('VS Code:'));
  console.log(chalk.gray('  Settings → MCP → Add Server\n'));
}

program.parse();
