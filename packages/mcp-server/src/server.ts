import { headlessTools, handleHeadlessTool } from './tools/headless';
import { webComponentsTools, handleWebComponentsTool } from './tools/webcomponents';
import { iconTools, handleIconTool } from './tools/icons';
import { motionTools, handleMotionTool } from './tools/motion';
import { layoutTools, handleLayoutTool } from './tools/layout';

/**
 * MCP Server para @andersseen libraries
 * Unifica todas las herramientas en un solo servidor
 */

// Combinar todas las herramientas
const allTools = [...headlessTools, ...webComponentsTools, ...iconTools, ...motionTools, ...layoutTools];

// Mapeo de handlers
const toolHandlers: Record<string, (name: string, args: any) => any> = {
  // Headless tools
  headless_list_components: handleHeadlessTool,
  headless_get_component: handleHeadlessTool,
  headless_generate_code: handleHeadlessTool,

  // Web Components tools
  webcomponents_list: handleWebComponentsTool,
  webcomponents_get_info: handleWebComponentsTool,
  webcomponents_generate_html: handleWebComponentsTool,
  webcomponents_installation_guide: handleWebComponentsTool,

  // Icon tools
  icon_list: handleIconTool,
  icon_search: handleIconTool,
  icon_get_usage: handleIconTool,

  // Motion tools
  motion_list_animations: handleMotionTool,
  motion_generate_code: handleMotionTool,

  // Layout tools
  layout_list_patterns: handleLayoutTool,
  layout_generate_code: handleLayoutTool,
};

/**
 * Maneja la solicitud de listado de herramientas
 */
export async function handleListTools(): Promise<any> {
  return {
    tools: allTools,
  };
}

/**
 * Maneja la llamada a una herramienta
 */
export async function handleCallTool(name: string, args: any): Promise<any> {
  const handler = toolHandlers[name];

  if (!handler) {
    throw new Error('Tool not found: ' + name);
  }

  return handler(name, args);
}

/**
 * Obtiene información del servidor
 */
export function getServerInfo(): any {
  return {
    name: '@andersseen/mcp-server',
    version: '0.1.0',
    description: 'MCP Server for @andersseen libraries',
    libraries: [
      { name: 'headless-components', tools: headlessTools.length },
      { name: 'web-components', tools: webComponentsTools.length },
      { name: 'icon', tools: iconTools.length },
      { name: 'motion', tools: motionTools.length },
      { name: 'layout', tools: layoutTools.length },
    ],
    totalTools: allTools.length,
  };
}
