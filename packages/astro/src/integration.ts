import type { AstroIntegration } from 'astro';

export interface AndersseenAstroOptions {
  /**
   * Which components to register.
   * - `'all'` (default): registers every component. Convenient but not tree-shakeable.
   * - `string[]`: registers only the listed components, preserving tree-shaking.
   */
  components?: 'all' | string[];

  /**
   * Whether to register all icons automatically.
   * @default true
   */
  icons?: boolean;
}

function toPascalCase(kebab: string): string {
  return kebab
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function generateComponentScript(components: 'all' | string[]): string {
  if (components === 'all') {
    return [`import { defineAllCustomElements } from '@andersseen/web-components';`, `defineAllCustomElements();`].join(
      '\n',
    );
  }

  const aliases = components.map(name => ({
    name,
    alias: `define${toPascalCase(name)}`,
  }));

  const imports = aliases
    .map(
      ({ name, alias }) =>
        `import { defineCustomElement as ${alias} } from '@andersseen/web-components/components/${name}.js';`,
    )
    .join('\n');
  const calls = aliases.map(({ alias }) => `${alias}();`).join('\n');

  return [imports, calls].join('\n');
}

export default function andersseen(options: AndersseenAstroOptions = {}): AstroIntegration {
  const components = options.components ?? 'all';
  const registerIcons = options.icons ?? true;

  return {
    name: '@andersseen/astro',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        injectScript('page', generateComponentScript(components));

        if (registerIcons) {
          injectScript('page', `import { registerAllIcons } from '@andersseen/icon';\nregisterAllIcons();`);
        }
      },
    },
  };
}
