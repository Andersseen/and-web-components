/**
 * Layout Core Tools
 * Herramientas MCP para @andersseen/layout
 */

export const layoutTools = [
  {
    name: 'layout_list_patterns',
    description: 'Lista los patrones de layout disponibles',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'layout_generate_code',
    description: 'Genera código CSS/HTML para un patrón de layout',
    inputSchema: {
      type: 'object' as const,
      properties: {
        pattern: {
          type: 'string' as const,
          description: 'Nombre del patrón (ej: sidebar-layout, card-grid)',
        },
      },
      required: ['pattern'],
    },
  },
];

const layoutPatterns = [
  {
    name: 'sidebar-layout',
    description: 'Layout con sidebar y content area',
    attributes: ['layout="sidebar"', 'sidebar-position="left"'],
  },
  {
    name: 'stack',
    description: 'Stack vertical con gap',
    attributes: ['layout="stack"', 'gap="md"'],
  },
  {
    name: 'cluster',
    description: 'Elementos en fila con wrap',
    attributes: ['layout="cluster"', 'gap="sm"', 'justify="start"'],
  },
  {
    name: 'grid',
    description: 'Grid responsivo',
    attributes: ['layout="grid"', 'columns="3"', 'gap="lg"'],
  },
  {
    name: 'center',
    description: 'Centrado absoluto',
    attributes: ['layout="center"', 'max-width="md"'],
  },
  {
    name: 'cover',
    description: 'Elemento cubriendo todo el viewport',
    attributes: ['layout="cover"'],
  },
];

export function handleLayoutTool(name: string, args: any): any {
  switch (name) {
    case 'layout_list_patterns':
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(layoutPatterns, null, 2),
          },
        ],
      };

    case 'layout_generate_code':
      const pattern = layoutPatterns.find(p => p.name === args.pattern);
      if (!pattern) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Patrón "${args.pattern}" no encontrado.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: `## Patrón: ${pattern.name}
${pattern.description}

### Uso con atributos HTML
\`\`\`html
<div ${pattern.attributes.join(' ')}>
  <!-- Tu contenido aquí -->
</div>
\`\`\`

### CSS alternativo (sin atributos)
\`\`\`css
.my-${pattern.name.replace(/-/g, '_')} {
  /* Implementación CSS del patrón ${pattern.name} */
}
\`\`\`

### Import
\`\`\`ts
import '@andersseen/layout/layout-${pattern.name}.css';
\`\`\``,
          },
        ],
      };

    default:
      throw new Error(`Unknown layout tool: ${name}`);
  }
}
