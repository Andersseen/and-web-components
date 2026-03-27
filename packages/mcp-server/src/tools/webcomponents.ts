/**
 * Web Components Tools
 * Herramientas MCP para @andersseen/web-components
 */

export const webComponentsTools = [
  {
    name: 'webcomponents_list',
    description: 'Lista todos los componentes web disponibles',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'webcomponents_get_info',
    description: 'Obtiene información de un componente web',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string' as const,
          description: 'Nombre del componente (ej: and-button, and-modal)',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'webcomponents_generate_html',
    description: 'Genera código HTML para usar un componente',
    inputSchema: {
      type: 'object' as const,
      properties: {
        component: {
          type: 'string' as const,
          description: 'Nombre del componente',
        },
        props: {
          type: 'object' as const,
          description: 'Propiedades del componente',
        },
      },
      required: ['component'],
    },
  },
  {
    name: 'webcomponents_installation_guide',
    description: 'Obtiene guía de instalación y setup',
    inputSchema: {
      type: 'object' as const,
      properties: {
        framework: {
          type: 'string' as const,
          enum: ['html', 'react', 'vue', 'angular', 'cdn'],
          description: 'Framework o método de instalación',
        },
      },
      required: ['framework'],
    },
  },
];

// Datos de componentes web
const webComponents = [
  {
    tag: 'and-button',
    name: 'Button',
    category: 'Form',
    description: 'Botón con múltiples variantes y estados',
    props: [
      {
        name: 'variant',
        type: 'string',
        default: 'default',
        options: ['default', 'primary', 'secondary', 'ghost', 'outline', 'destructive', 'link'],
      },
      { name: 'size', type: 'string', default: 'default', options: ['default', 'sm', 'lg', 'icon'] },
      { name: 'disabled', type: 'boolean', default: false },
      { name: 'loading', type: 'boolean', default: false },
    ],
    slots: ['default'],
    events: ['andButtonClick'],
  },
  {
    tag: 'and-modal',
    name: 'Modal',
    category: 'Overlay',
    description: 'Modal/Dialog accesible',
    props: [{ name: 'open', type: 'boolean', default: false }],
    slots: ['default'],
    events: ['andClose'],
  },
  {
    tag: 'and-drawer',
    name: 'Drawer',
    category: 'Overlay',
    description: 'Panel lateral deslizable',
    props: [
      { name: 'open', type: 'boolean', default: false },
      { name: 'placement', type: 'string', default: 'left', options: ['left', 'right', 'top', 'bottom'] },
      { name: 'showClose', type: 'boolean', default: true },
    ],
    slots: ['header', 'default', 'footer', 'close-icon'],
    events: ['andDrawerClose', 'andDrawerOpen'],
  },
  {
    tag: 'and-accordion',
    name: 'Accordion',
    category: 'Layout',
    description: 'Acordeón colapsable',
    props: [
      { name: 'type', type: 'string', default: 'single', options: ['single', 'multiple'] },
      { name: 'collapsible', type: 'boolean', default: false },
      { name: 'value', type: 'string', default: '' },
    ],
    subcomponents: ['and-accordion-item', 'and-accordion-trigger', 'and-accordion-content'],
  },
  {
    tag: 'and-tabs',
    name: 'Tabs',
    category: 'Layout',
    description: 'Pestañas con navegación por teclado',
    props: [{ name: 'value', type: 'string', default: '' }],
    subcomponents: ['and-tabs-list', 'and-tabs-trigger', 'and-tabs-content'],
  },
  {
    tag: 'and-dropdown',
    name: 'Dropdown',
    category: 'Form',
    description: 'Menú desplegable',
    props: [
      { name: 'items', type: 'array', default: [] },
      { name: 'label', type: 'string', default: 'Options' },
      { name: 'placement', type: 'string', default: 'bottom', options: ['top', 'bottom', 'left', 'right'] },
      { name: 'closeOnSelect', type: 'boolean', default: true },
    ],
    events: ['andDropdownSelect', 'andDropdownOpenChange'],
  },
  {
    tag: 'and-select',
    name: 'Select',
    category: 'Form',
    description: 'Selector de opciones',
    props: [
      { name: 'options', type: 'array', default: [] },
      { name: 'placeholder', type: 'string', default: 'Select an option' },
      { name: 'disabled', type: 'boolean', default: false },
    ],
    events: ['andSelectChange'],
  },
  {
    tag: 'and-input',
    name: 'Input',
    category: 'Form',
    description: 'Campo de entrada de texto',
    props: [
      {
        name: 'type',
        type: 'string',
        default: 'text',
        options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
      },
      { name: 'placeholder', type: 'string', default: '' },
      { name: 'value', type: 'string', default: '' },
      { name: 'disabled', type: 'boolean', default: false },
      { name: 'readonly', type: 'boolean', default: false },
    ],
    events: ['andInputChange', 'andInputFocus', 'andInputBlur'],
  },
  {
    tag: 'and-card',
    name: 'Card',
    category: 'Layout',
    description: 'Contenedor de tarjeta',
    props: [],
    subcomponents: ['and-card-header', 'and-card-title', 'and-card-description', 'and-card-content', 'and-card-footer'],
  },
  {
    tag: 'and-navbar',
    name: 'Navbar',
    category: 'Navigation',
    description: 'Barra de navegación responsive',
    props: [
      { name: 'items', type: 'array', default: [] },
      { name: 'variant', type: 'string', default: 'default', options: ['default', 'filled', 'floating', 'glass'] },
      { name: 'position', type: 'string', default: 'static', options: ['static', 'sticky', 'fixed'] },
      { name: 'activeItem', type: 'string', default: '' },
    ],
    slots: [
      'start',
      'brand',
      'center',
      'main',
      'nav',
      'end',
      'actions',
      'mobile-title',
      'mobile-nav',
      'mobile-actions',
    ],
    events: ['navItemClick', 'navLinkClick', 'mobileMenuChange', 'responsiveStageChange'],
  },
  {
    tag: 'and-sidebar',
    name: 'Sidebar',
    category: 'Navigation',
    description: 'Barra lateral de navegación',
    props: [
      { name: 'items', type: 'array', default: [] },
      { name: 'variant', type: 'string', default: 'default', options: ['default', 'filled', 'floating', 'glass'] },
      { name: 'activeItem', type: 'string', default: 'home' },
      { name: 'collapsed', type: 'boolean', default: false },
    ],
    slots: ['header', 'footer', 'bottom'],
    events: ['itemClick', 'toggleCollapse'],
  },
  {
    tag: 'and-carousel',
    name: 'Carousel',
    category: 'Media',
    description: 'Carrusel de imágenes/contenido',
    props: [
      { name: 'autoplay', type: 'boolean', default: false },
      { name: 'interval', type: 'number', default: 3000 },
      { name: 'label', type: 'string', default: 'Carousel' },
    ],
    subcomponents: ['and-carousel-item'],
    events: ['andSlideChange'],
  },
  {
    tag: 'and-toast',
    name: 'Toast',
    category: 'Feedback',
    description: 'Notificaciones toast',
    methods: ['present'],
  },
  {
    tag: 'and-tooltip',
    name: 'Tooltip',
    category: 'Feedback',
    description: 'Tooltip con posicionamiento',
    props: [
      { name: 'content', type: 'string', default: '' },
      { name: 'placement', type: 'string', default: 'top', options: ['top', 'bottom', 'left', 'right'] },
      { name: 'openDelay', type: 'number', default: 0 },
      { name: 'closeDelay', type: 'number', default: 0 },
    ],
    slots: ['content'],
  },
  {
    tag: 'and-alert',
    name: 'Alert',
    category: 'Feedback',
    description: 'Alerta/Notificación',
    props: [{ name: 'variant', type: 'string', default: 'default', options: ['default', 'destructive'] }],
  },
  {
    tag: 'and-badge',
    name: 'Badge',
    category: 'Data Display',
    description: 'Insignia/etiqueta',
    props: [
      {
        name: 'variant',
        type: 'string',
        default: 'default',
        options: ['default', 'secondary', 'destructive', 'outline'],
      },
    ],
  },
  {
    tag: 'and-breadcrumb',
    name: 'Breadcrumb',
    category: 'Navigation',
    description: 'Migas de pan',
    subcomponents: ['and-breadcrumb-item'],
  },
  {
    tag: 'and-pagination',
    name: 'Pagination',
    category: 'Navigation',
    description: 'Paginación',
    props: [
      { name: 'currentPage', type: 'number', default: 1 },
      { name: 'totalPages', type: 'number', default: 1 },
      { name: 'siblingCount', type: 'number', default: 1 },
    ],
  },
  {
    tag: 'and-icon',
    name: 'Icon',
    category: 'Data Display',
    description: 'Icono SVG',
    props: [
      { name: 'name', type: 'string', required: true },
      { name: 'size', type: 'number', default: 24 },
    ],
  },
  {
    tag: 'and-context-menu',
    name: 'Context Menu',
    category: 'Overlay',
    description: 'Menú contextual (clic derecho)',
  },
];

export function handleWebComponentsTool(name: string, args: any): any {
  switch (name) {
    case 'webcomponents_list':
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              webComponents.map(c => ({
                tag: c.tag,
                name: c.name,
                category: c.category,
                description: c.description,
              })),
              null,
              2,
            ),
          },
        ],
      };

    case 'webcomponents_get_info':
      const component = webComponents.find(
        c => c.tag === args.name || c.name.toLowerCase() === args.name.toLowerCase(),
      );
      if (!component) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Componente "${args.name}" no encontrado. Usa webcomponents_list para ver los disponibles.`,
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

    case 'webcomponents_generate_html':
      return {
        content: [
          {
            type: 'text' as const,
            text: generateWebComponentHTML(args.component, args.props || {}),
          },
        ],
      };

    case 'webcomponents_installation_guide':
      return {
        content: [
          {
            type: 'text' as const,
            text: getInstallationGuide(args.framework),
          },
        ],
      };

    default:
      throw new Error(`Unknown web components tool: ${name}`);
  }
}

function generateWebComponentHTML(tag: string, props: any): string {
  const comp = webComponents.find(c => c.tag === tag || c.tag.replace('and-', '') === tag);
  if (!comp) return `<!-- Componente ${tag} no encontrado -->`;

  const propsString = Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : '';
      }
      return `${key}="${value}"`;
    })
    .filter(Boolean)
    .join(' ');

  const hasDefaultSlot = comp.slots?.includes('default') ?? true;

  let html = '<!-- ' + comp.description + ' -->\n';
  html += '<' + comp.tag;
  if (propsString) html += ' ' + propsString;

  if (hasDefaultSlot) {
    html += '>\n  Content here\n</' + comp.tag + '>';
  } else {
    html += ' />';
  }

  html += '\n\n<script type="module">\n';
  html += "  import { defineCustomElements } from '@andersseen/web-components/loader';\n";
  html += '  defineCustomElements();\n';
  html += '</script>';

  return html;
}

function getInstallationGuide(framework: string): string {
  const guides: Record<string, string> = {
    html: `# Instalación en HTML/Vanilla JS

## Opción 1: CDN (Rápido)
<script type="module" src="https://unpkg.com/@andersseen/web-components@latest/dist/web-components/web-components.esm.js"></script>

## Opción 2: npm
npm install @andersseen/web-components

# Uso
<script type="module">
  import { defineCustomElements } from '@andersseen/web-components/loader';
  defineCustomElements();
</script>

<and-button variant="primary">Click me</and-button>`,

    react: `# Instalación en React

npm install @andersseen/web-components

# Uso con React
import { defineCustomElements } from '@andersseen/web-components/loader';

defineCustomElements();

function App() {
  return (
    <and-button variant="primary">
      Click me
    </and-button>
  );
}

# O usa los wrappers de React
npm install @andersseen/react-components

import { AndButton } from '@andersseen/react-components';

function App() {
  return <AndButton variant="primary">Click me</AndButton>;
}`,

    vue: `# Instalación en Vue

npm install @andersseen/web-components

# main.ts
import { defineCustomElements } from '@andersseen/web-components/loader';
defineCustomElements();

# Uso en template
<template>
  <and-button variant="primary">Click me</and-button>
</template>`,

    angular: `# Instalación en Angular

npm install @andersseen/web-components
npm install @andersseen/angular-components

# app.module.ts
import { AngularComponentsModule } from '@andersseen/angular-components';

@NgModule({
  imports: [AngularComponentsModule],
})
export class AppModule {}

# Uso en template
<and-button variant="primary">Click me</and-button>`,

    cdn: `# Uso rápido con CDN

<!DOCTYPE html>
<html>
<head>
  <script type="module" 
    src="https://unpkg.com/@andersseen/web-components@latest/dist/web-components/web-components.esm.js">
  </script>
  <link rel="stylesheet" 
    href="https://unpkg.com/@andersseen/web-components@latest/themes/default.css">
</head>
<body>
  <and-button variant="primary">Hello World</and-button>
</body>
</html>`,
  };

  return guides[framework] || guides.html;
}
