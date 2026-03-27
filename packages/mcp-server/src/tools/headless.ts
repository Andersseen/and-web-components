/**
 * Headless Core Tools
 * Herramientas MCP para @andersseen/headless-components
 */

export const headlessTools = [
  {
    name: 'headless_list_components',
    description: 'Lista todos los componentes headless disponibles',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'headless_get_component',
    description: 'Obtiene información detallada de un componente headless',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string' as const,
          description: 'Nombre del componente (ej: button, modal, accordion)',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'headless_generate_code',
    description: 'Genera código de uso para un componente headless',
    inputSchema: {
      type: 'object' as const,
      properties: {
        component: {
          type: 'string' as const,
          description: 'Nombre del componente',
        },
        language: {
          type: 'string' as const,
          enum: ['typescript', 'javascript'],
          description: 'Lenguaje de salida',
        },
      },
      required: ['component', 'language'],
    },
  },
];

// Datos de componentes headless
const headlessComponents = [
  {
    name: 'button',
    description: 'Headless button with loading and disabled states',
    functions: ['createButton'],
    state: ['disabled', 'loading'],
    actions: ['setDisabled', 'setLoading'],
  },
  {
    name: 'modal',
    description: 'Accessible modal/dialog with focus trap support',
    functions: ['createModal'],
    state: ['isOpen', 'disabled'],
    actions: ['open', 'close', 'toggle', 'setDisabled'],
  },
  {
    name: 'accordion',
    description: 'Collapsible accordion with keyboard navigation',
    functions: ['createAccordion'],
    state: ['value', 'disabled'],
    actions: ['expand', 'collapse', 'toggle', 'expandAll', 'collapseAll'],
  },
  {
    name: 'dropdown',
    description: 'Dropdown menu with positioning and keyboard support',
    functions: ['createDropdown'],
    state: ['isOpen', 'selectedItem'],
    actions: ['open', 'close', 'toggle', 'selectItem', 'clearSelection'],
  },
  {
    name: 'drawer',
    description: 'Slide-out drawer panel',
    functions: ['createDrawer'],
    state: ['isOpen', 'placement'],
    actions: ['open', 'close', 'toggle', 'setPlacement'],
  },
  {
    name: 'navbar',
    description: 'Navigation bar with responsive behavior',
    functions: ['createNavbar'],
    state: ['activeItem', 'mobileMenuOpen'],
    actions: ['setActiveItem', 'openMobileMenu', 'closeMobileMenu', 'toggleMobileMenu'],
  },
  {
    name: 'sidebar',
    description: 'Collapsible sidebar navigation',
    functions: ['createSidebar'],
    state: ['activeItem', 'collapsed'],
    actions: ['setActiveItem', 'toggleCollapsed'],
  },
  {
    name: 'tabs',
    description: 'Tab panel with keyboard navigation',
    functions: ['createTabs'],
    state: ['activeTab', 'disabled'],
    actions: ['setActiveTab', 'disableTab', 'enableTab'],
  },
  {
    name: 'tooltip',
    description: 'Tooltip with positioning and delays',
    functions: ['createTooltip'],
    state: ['isVisible'],
    actions: ['show', 'hide', 'toggle'],
  },
  {
    name: 'toast',
    description: 'Toast notification manager',
    functions: ['createToastManager'],
    state: ['toasts'],
    actions: ['present', 'dismiss', 'dismissAll'],
  },
  {
    name: 'alert',
    description: 'Alert dialog with actions',
    functions: ['createAlert'],
    state: ['isOpen'],
    actions: ['open', 'close', 'confirm', 'cancel'],
  },
  {
    name: 'breadcrumb',
    description: 'Breadcrumb navigation',
    functions: ['createBreadcrumb'],
    state: ['items', 'activeIndex'],
    actions: ['addItem', 'removeItem', 'setActive'],
  },
  {
    name: 'carousel',
    description: 'Carousel/slider with autoplay',
    functions: ['createCarousel'],
    state: ['activeIndex', 'slideCount', 'isPlaying'],
    actions: ['next', 'prev', 'goTo', 'play', 'pause'],
  },
  {
    name: 'pagination',
    description: 'Pagination component',
    functions: ['createPagination'],
    state: ['currentPage', 'totalPages'],
    actions: ['goToPage', 'next', 'prev', 'first', 'last'],
  },
  {
    name: 'context-menu',
    description: 'Right-click context menu',
    functions: ['createContextMenu'],
    state: ['isOpen', 'position'],
    actions: ['open', 'close', 'toggle'],
  },
];

export function handleHeadlessTool(name: string, args: any): any {
  switch (name) {
    case 'headless_list_components':
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              headlessComponents.map(c => ({
                name: c.name,
                description: c.description,
              })),
              null,
              2,
            ),
          },
        ],
      };

    case 'headless_get_component':
      const component = headlessComponents.find(c => c.name === args.name);
      if (!component) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Componente "${args.name}" no encontrado. Componentes disponibles: ${headlessComponents
                .map(c => c.name)
                .join(', ')}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(component, null, 2),
          },
        ],
      };

    case 'headless_generate_code':
      return {
        content: [
          {
            type: 'text' as const,
            text: generateHeadlessCode(args.component, args.language),
          },
        ],
      };

    default:
      throw new Error(`Unknown headless tool: ${name}`);
  }
}

function generateHeadlessCode(component: string, language: 'typescript' | 'javascript'): string {
  const comp = headlessComponents.find(c => c.name === component);
  if (!comp) return `// Componente ${component} no encontrado`;

  const functionName = comp.functions[0];
  const isTS = language === 'typescript';

  return `// ${comp.description}
${isTS ? "import { createButton } from '@andersseen/headless-components';" : "const { createButton } = require('@andersseen/headless-components');"}

// Crear instancia del componente
const ${component} = ${functionName}({
  ${comp.state.map(s => `  // ${s}: valor inicial`).join('\n')}
});

// Acceder al estado
console.log(${component}.state);

// Usar acciones
${comp.actions.map(a => `// ${component}.actions.${a}();`).join('\n')}

// Props para elementos HTML
const triggerProps = ${component}.getTriggerProps();
const contentProps = ${component}.getContentProps();`;
}
