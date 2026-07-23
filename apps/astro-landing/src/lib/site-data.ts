/**
 * Build-time facts about the workspace.
 *
 * Everything the landing page claims about the ecosystem — component counts,
 * icon counts, animation counts, package versions — is derived here from the
 * real packages instead of being typed by hand. Hand-typed numbers drift: the
 * page was advertising "24+ components / 70+ icons / 10 animations" while the
 * packages actually shipped 39 / 86 / 135.
 *
 * This module runs on the server during `astro build` only.
 */
import { readFile } from 'node:fs/promises';
import { ALL_ICONS } from '@andersseen/icon';

const workspaceFile = (relativePath: string): URL => new URL(`../../../../${relativePath}`, import.meta.url);

const readJson = async <T>(relativePath: string): Promise<T | null> => {
  try {
    return JSON.parse(await readFile(workspaceFile(relativePath), 'utf-8')) as T;
  } catch {
    return null;
  }
};

const readText = async (relativePath: string): Promise<string> => {
  try {
    return await readFile(workspaceFile(relativePath), 'utf-8');
  } catch {
    return '';
  }
};

// ── Counts ────────────────────────────────────────────────────────────────

/** Every `and-*` custom element tag declared in the generated manifest. */
const countCustomElements = async (): Promise<number> => {
  const manifest = await readJson<{
    modules?: { declarations?: { tagName?: string }[] }[];
  }>('packages/web-components/custom-elements.json');

  if (!manifest?.modules) {
    return 0;
  }

  const tags = new Set<string>();
  for (const module of manifest.modules) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.tagName) {
        tags.add(declaration.tagName);
      }
    }
  }

  return tags.size;
};

/** Distinct `and-motion="…"` values understood by @andersseen/motion. */
const countAnimations = async (): Promise<number> => {
  const css = await readText('packages/motion-core/src/core.css');
  const matches = css.match(/\[and-motion='[a-z0-9-]+'\]/g) ?? [];
  return new Set(matches).size;
};

export const iconNames: string[] = Object.keys(ALL_ICONS).sort();

export const counts = {
  components: await countCustomElements(),
  icons: iconNames.length,
  animations: await countAnimations(),
};

// ── Packages ──────────────────────────────────────────────────────────────

export type PackageGroup = 'core' | 'frameworks' | 'tooling';

export interface EcosystemPackage {
  dir: string;
  name: string;
  icon: string;
  subtitle: string;
  description: string;
  tags: string[];
  group: PackageGroup;
  version: string;
}

/**
 * Curated presentation metadata. The `version` is *not* listed here — it is
 * read from each package's package.json so the page can never advertise a
 * version that was never released.
 */
const packageCatalog: Omit<EcosystemPackage, 'version'>[] = [
  {
    dir: 'web-components',
    name: '@andersseen/web-components',
    icon: 'box',
    subtitle: 'UI components',
    description:
      'Accessible, themeable custom elements — buttons, modals, drawers, dropdowns, carousels, tabs, toasts, tooltips and more. Shadow DOM, so your CSS and theirs never collide.',
    tags: ['Custom Elements', 'Shadow DOM', 'A11y'],
    group: 'core',
  },
  {
    dir: 'layout-core',
    name: '@andersseen/layout',
    icon: 'layout',
    subtitle: 'CSS layouts',
    description:
      'Attribute-driven layout and typography: grid, flex, spacing and text scales with responsive breakpoints. Zero JavaScript — pure CSS.',
    tags: ['Zero JS', 'Responsive', 'Attribute API'],
    group: 'core',
  },
  {
    dir: 'motion-core',
    name: '@andersseen/motion',
    icon: 'activity',
    subtitle: 'Animations',
    description:
      'Declarative CSS animations triggered on enter, hover or tap via IntersectionObserver, with configurable duration, delay and easing. Honours prefers-reduced-motion.',
    tags: ['CSS Keyframes', 'IntersectionObserver', 'Reduced motion'],
    group: 'core',
  },
  {
    dir: 'icon-library',
    name: '@andersseen/icon',
    icon: 'star',
    subtitle: 'SVG icons',
    description:
      'Hand-drawn SVG icon set with tree-shakeable ESM exports and a global registry for on-demand loading. Import three icons or all of them.',
    tags: ['Tree-shakeable', 'SVG', 'Registry'],
    group: 'core',
  },
  {
    dir: 'headless-core',
    name: '@andersseen/headless-components',
    icon: 'sliders',
    subtitle: 'Headless logic',
    description:
      'Pure state machines for accordion, dropdown, modal, tabs, toast and friends. No DOM, no styles — bring your own renderer.',
    tags: ['No DOM', 'State machines', 'TypeScript'],
    group: 'core',
  },
  {
    dir: 'behaviors',
    name: '@andersseen/behaviors',
    icon: 'move',
    subtitle: 'DOM behaviors',
    description:
      'Progressive enhancement for HTML you already have: splitter, drag & drop, tooltip and dialog, wired up by and-* attributes.',
    tags: ['Progressive', 'Attribute API', 'No framework'],
    group: 'core',
  },
  {
    dir: 'angular-components',
    name: '@andersseen/angular-components',
    icon: 'code',
    subtitle: 'Angular wrappers',
    description: 'Generated standalone Angular directives with typed inputs and outputs over the same custom elements.',
    tags: ['Standalone', 'Typed'],
    group: 'frameworks',
  },
  {
    dir: 'react-components',
    name: '@andersseen/react-components',
    icon: 'code',
    subtitle: 'React wrappers',
    description: 'Generated React components with typed props and real event handlers instead of manual ref wiring.',
    tags: ['RSC-friendly', 'Typed'],
    group: 'frameworks',
  },
  {
    dir: 'vue-components',
    name: '@andersseen/vue-components',
    icon: 'code',
    subtitle: 'Vue wrappers',
    description: 'Generated Vue components with typed props and v-model-friendly bindings.',
    tags: ['SFC', 'Typed'],
    group: 'frameworks',
  },
  {
    dir: 'astro',
    name: '@andersseen/astro',
    icon: 'app-window',
    subtitle: 'Astro integration',
    description: 'One-line integration that registers the elements and injects the stylesheets for an Astro site.',
    tags: ['Integration', 'SSR-safe'],
    group: 'frameworks',
  },
  {
    dir: 'mcp',
    name: '@andersseen/mcp',
    icon: 'terminal',
    subtitle: 'MCP server',
    description:
      'Serves the live component catalog to AI assistants over the Model Context Protocol, generated from the real custom-elements manifest.',
    tags: ['Claude', 'Cursor', 'VS Code'],
    group: 'tooling',
  },
  {
    dir: 'skills',
    name: '@andersseen/skills',
    icon: 'book-open',
    subtitle: 'Agent skills',
    description:
      'Installable, per-library skills for coding agents. Teach your assistant one package at a time instead of the whole ecosystem.',
    tags: ['Claude Code', 'Per-package'],
    group: 'tooling',
  },
  {
    dir: 'vanilla-components',
    name: '@andersseen/vanilla-components',
    icon: 'circle-dot',
    subtitle: 'Zero-dependency build',
    description:
      'Experimental proof of concept: the same headless core rendered as plain custom elements with no build-time framework at all.',
    tags: ['Experimental', 'Zero deps'],
    group: 'tooling',
  },
];

const readVersion = async (dir: string): Promise<string> => {
  const pkg = await readJson<{ version?: string }>(`packages/${dir}/package.json`);
  return pkg?.version ? `v${pkg.version}` : 'unreleased';
};

export const packages: EcosystemPackage[] = await Promise.all(
  packageCatalog.map(async entry => ({ ...entry, version: await readVersion(entry.dir) })),
);

export const packageGroups: { id: PackageGroup; label: string; blurb: string }[] = [
  {
    id: 'core',
    label: 'Core',
    blurb: 'The libraries that do the work. Each one is independent — take one, take all six.',
  },
  {
    id: 'frameworks',
    label: 'Frameworks',
    blurb: 'Thin, generated bindings so the same elements feel native in your framework of choice.',
  },
  {
    id: 'tooling',
    label: 'Tooling',
    blurb: 'How your editor and your AI assistant learn what this ecosystem can actually do.',
  },
];

export const packagesByGroup = (group: PackageGroup): EcosystemPackage[] =>
  packages.filter(entry => entry.group === group);

// ── Links ─────────────────────────────────────────────────────────────────

export const links = {
  github: 'https://github.com/Andersseen/and-web-components',
  docs: 'https://docs.andersseen.dev',
  storybook: 'https://and-web-components-storybook.pages.dev',
  npm: 'https://www.npmjs.com/org/andersseen',
};
