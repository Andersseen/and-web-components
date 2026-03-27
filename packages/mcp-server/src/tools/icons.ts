/**
 * Icon Library Tools
 * Herramientas MCP para @andersseen/icon
 */

export const iconTools = [
  {
    name: 'icon_list',
    description: 'Lista todos los iconos disponibles',
    inputSchema: {
      type: 'object' as const,
      properties: {
        category: {
          type: 'string' as const,
          description: 'Filtrar por categoría (opcional)',
        },
      },
    },
  },
  {
    name: 'icon_search',
    description: 'Busca iconos por nombre o palabra clave',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string' as const,
          description: 'Término de búsqueda',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'icon_get_usage',
    description: 'Obtiene código de uso para un icono',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string' as const,
          description: 'Nombre del icono',
        },
        size: {
          type: 'number' as const,
          description: 'Tamaño en píxeles (default: 24)',
        },
      },
      required: ['name'],
    },
  },
];

// Categorías de iconos con ejemplos
const iconCategories: Record<string, string[]> = {
  navigation: [
    'menu',
    'close',
    'arrow-left',
    'arrow-right',
    'arrow-up',
    'arrow-down',
    'chevron-left',
    'chevron-right',
    'chevron-up',
    'chevron-down',
    'home',
    'back',
    'forward',
  ],
  actions: [
    'plus',
    'minus',
    'check',
    'x',
    'trash',
    'edit',
    'copy',
    'download',
    'upload',
    'refresh',
    'search',
    'filter',
    'sort',
    'more-horizontal',
    'more-vertical',
  ],
  communication: ['mail', 'message', 'phone', 'send', 'share', 'link', 'attachment', 'bell', 'notification'],
  media: ['play', 'pause', 'stop', 'volume', 'volume-x', 'image', 'video', 'music', 'mic', 'camera'],
  status: [
    'info',
    'warning',
    'alert-circle',
    'alert-triangle',
    'check-circle',
    'x-circle',
    'help-circle',
    'question',
    'star',
    'heart',
  ],
  files: ['file', 'file-text', 'folder', 'folder-open', 'archive', 'paperclip'],
  layout: ['grid', 'list', 'layout', 'sidebar', 'maximize', 'minimize', 'fullscreen', 'exit-fullscreen'],
  social: ['github', 'twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'twitch'],
};

// Lista completa de iconos
const allIcons = Object.values(iconCategories).flat();

export function handleIconTool(name: string, args: any): any {
  switch (name) {
    case 'icon_list':
      if (args.category) {
        const icons = iconCategories[args.category] || [];
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  category: args.category,
                  count: icons.length,
                  icons: icons,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                total: allIcons.length,
                categories: Object.keys(iconCategories).map(cat => ({
                  name: cat,
                  count: iconCategories[cat].length,
                  examples: iconCategories[cat].slice(0, 5),
                })),
              },
              null,
              2,
            ),
          },
        ],
      };

    case 'icon_search':
      const query = args.query.toLowerCase();
      const matches = allIcons.filter(icon => icon.toLowerCase().includes(query));
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                query: args.query,
                matches: matches,
                count: matches.length,
              },
              null,
              2,
            ),
          },
        ],
      };

    case 'icon_get_usage':
      const iconName = args.name;
      const size = args.size || 24;

      const categories =
        Object.entries(iconCategories)
          .filter(([_, icons]) => icons.includes(iconName))
          .map(([cat]) => '- ' + cat)
          .join('\n') || '- General';

      const responseText =
        '## Uso del icono "' +
        iconName +
        '"\n\n' +
        '### HTML/Web Components\n' +
        '```html\n' +
        '<and-icon name="' +
        iconName +
        '" size="' +
        size +
        '" ></and-icon >\n' +
        '```\n\n' +
        '### React (con wrappers)\n' +
        '```tsx\n' +
        "import { AndIcon } from '@andersseen/react-components';\n\n" +
        '<AndIcon name="' +
        iconName +
        '" size={' +
        size +
        '} />\n' +
        '```\n\n' +
        '### TypeScript (import directo)\n' +
        '```ts\n' +
        'import { ' +
        toPascalCase(iconName) +
        " } from '@andersseen/icon';\n\n" +
        '// Obtener SVG como string\n' +
        'const svg = ' +
        toPascalCase(iconName) +
        ';\n' +
        '```\n\n' +
        '### Headless\n' +
        '```ts\n' +
        '// Los iconos pueden usarse en componentes headless\n' +
        '// a través de la propiedad icon\n' +
        'const button = createButton({\n' +
        "  icon: '" +
        iconName +
        "',\n" +
        '});\n' +
        '```\n\n' +
        '### Categorías\n' +
        categories;

      return {
        content: [
          {
            type: 'text' as const,
            text: responseText,
          },
        ],
      };

    default:
      throw new Error('Unknown icon tool: ' + name);
  }
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
