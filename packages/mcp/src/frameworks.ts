/**
 * Per-framework naming + usage-snippet generation.
 *
 * The wrappers for every framework are generated 1:1 from the same Stencil
 * components, so a tag like `and-button` maps to:
 *   - HTML   : `<and-button>`                 (@andersseen/web-components)
 *   - React  : `<AndButton>`                  (@andersseen/react-components)
 *   - Vue    : `<AndButton>`                  (@andersseen/vue-components)
 *   - Angular: `<and-button>` + `AndButton`   (@andersseen/angular-components)
 */

import type { Attribute, Component, Framework } from './types';

export const FRAMEWORKS: Framework[] = ['html', 'react', 'vue', 'angular'];

interface FrameworkInfo {
  label: string;
  pkg: string;
  install: string[];
}

export const FRAMEWORK_INFO: Record<Framework, FrameworkInfo> = {
  html: {
    label: 'HTML / Web Components',
    pkg: '@andersseen/web-components',
    install: [
      'npm install @andersseen/web-components @andersseen/icon',
      '',
      '// Register every element + icon once, at app startup:',
      "import { defineAllCustomElements } from '@andersseen/web-components';",
      "import { registerAllIcons } from '@andersseen/icon';",
      "import '@andersseen/web-components/style.css';",
      'defineAllCustomElements();',
      'registerAllIcons();',
    ],
  },
  react: {
    label: 'React',
    pkg: '@andersseen/react-components',
    install: [
      'npm install @andersseen/react-components',
      '',
      "import '@andersseen/web-components/style.css';",
      "import { AndButton } from '@andersseen/react-components';",
    ],
  },
  vue: {
    label: 'Vue',
    pkg: '@andersseen/vue-components',
    install: [
      'npm install @andersseen/vue-components',
      '',
      "import '@andersseen/web-components/style.css';",
      "import { AndButton } from '@andersseen/vue-components';",
    ],
  },
  angular: {
    label: 'Angular',
    pkg: '@andersseen/angular-components',
    install: [
      'npm install @andersseen/angular-components',
      '',
      "// Import styles once (e.g. in styles.css): @import '@andersseen/web-components/style.css';",
      "// Components are standalone — add them to a component's `imports` array:",
      "import { AndButton } from '@andersseen/angular-components';",
    ],
  },
};

/** Parse a CEM union type like `"a" | "b"` into its string literals. */
function unionLiterals(type: string): string[] {
  const matches = type.match(/"([^"]+)"|'([^']+)'/g);
  if (!matches) return [];
  return matches.map(m => m.replace(/['"]/g, ''));
}

interface ExampleValue {
  kind: 'boolean' | 'number' | 'string';
  value: string; // stringified literal for booleans/numbers, raw text for strings
}

function exampleValue(attr: Attribute): ExampleValue {
  const type = attr.type;
  if (/\bboolean\b/.test(type)) return { kind: 'boolean', value: 'true' };
  if (/\bnumber\b/.test(type)) {
    const def = attr.default && /^-?\d/.test(attr.default) ? attr.default : '0';
    return { kind: 'number', value: def };
  }
  const literals = unionLiterals(type);
  if (literals.length > 0) return { kind: 'string', value: literals[0] };
  const def = attr.default?.replace(/['"]/g, '');
  return { kind: 'string', value: def && def !== 'undefined' ? def : 'value' };
}

/** Pick the most illustrative attributes (enums/booleans/defaults first). */
function pickAttributes(component: Component, limit = 3): Attribute[] {
  const scored = [...component.attributes].map(attr => {
    let score = 0;
    if (attr.type.includes('|')) score += 3;
    if (/\bboolean\b/.test(attr.type)) score += 2;
    if (attr.default) score += 1;
    return { attr, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.attr);
}

function renderAttr(attr: Attribute, framework: Framework): string | null {
  const ex = exampleValue(attr);
  switch (framework) {
    case 'html':
      if (ex.kind === 'boolean') return ex.value === 'true' ? attr.name : null;
      return `${attr.name}="${ex.value}"`;
    case 'react':
      if (ex.kind === 'string') return `${attr.field}="${ex.value}"`;
      return `${attr.field}={${ex.value}}`;
    case 'vue':
      if (ex.kind === 'string') return `${attr.name}="${ex.value}"`;
      return `:${attr.name}="${ex.value}"`;
    case 'angular':
      if (ex.kind === 'string') return `${attr.field}="${ex.value}"`;
      return `[${attr.field}]="${ex.value}"`;
  }
}

function renderEvent(eventName: string, framework: Framework): string | null {
  const pascal = eventName.charAt(0).toUpperCase() + eventName.slice(1);
  switch (framework) {
    case 'html':
      return null; // handled via addEventListener, shown separately
    case 'react':
      return `on${pascal}={handleEvent}`;
    case 'vue':
      return `@${eventName}="handleEvent"`;
    case 'angular':
      return `(${eventName})="handleEvent($event)"`;
  }
}

function elementTag(component: Component, framework: Framework): string {
  return framework === 'react' ? component.name : component.tag;
}

export interface UsageResult {
  framework: Framework;
  package: string;
  import?: string;
  snippet: string;
}

/** Build an import statement (none for plain HTML templates). */
export function importLine(component: Component, framework: Framework): string | undefined {
  const info = FRAMEWORK_INFO[framework];
  switch (framework) {
    case 'html':
      return undefined;
    case 'react':
    case 'vue':
      return `import { ${component.name} } from '${info.pkg}';`;
    case 'angular':
      return `import { ${component.name} } from '${info.pkg}'; // add to a standalone component's imports: []`;
  }
}

/** Build a representative usage snippet for a component in a given framework. */
export function buildUsage(component: Component, framework: Framework): UsageResult {
  const tag = elementTag(component, framework);
  const attrs = pickAttributes(component)
    .map(a => renderAttr(a, framework))
    .filter((v): v is string => v !== null);

  const primaryEvent = component.events[0]?.name;
  const eventAttr = primaryEvent ? renderEvent(primaryEvent, framework) : null;
  if (eventAttr) attrs.push(eventAttr);

  const openParts = [tag, ...attrs].join(' ');
  const children = component.parent ? '' : '\n  <!-- content -->\n';
  const lines: string[] = [];

  if (framework === 'html') {
    lines.push(`<${openParts}>${children}</${tag}>`);
    if (primaryEvent) {
      lines.push('');
      lines.push('// Listen for the event imperatively:');
      lines.push(`el.addEventListener('${primaryEvent}', (e) => { /* ... */ });`);
    }
  } else {
    // JSX/Vue/Angular templates use HTML-style comments only in Vue/Angular.
    const child = framework === 'react' ? (component.parent ? '' : '\n  {/* content */}\n') : children;
    lines.push(`<${openParts}>${child}</${tag}>`);
  }

  return {
    framework,
    package: FRAMEWORK_INFO[framework].pkg,
    import: importLine(component, framework),
    snippet: lines.join('\n'),
  };
}
