// Sidebar navigation for the docs site, split out of astro.config.mjs since
// it's by far the fastest-growing part of that file — one entry per page,
// across every package this site documents (24+ components, 18 headless
// factories, and a handful of pages per product-core package).
export const sidebar = [
  {
    label: 'Guides',
    items: [
      { label: 'Getting Started', slug: 'guides/getting-started' },
      { label: 'Styling Integration', slug: 'guides/styling-integration' },
      { label: 'Theming & Tokens', slug: 'guides/theming-tokens' },
    ],
  },
  {
    label: 'Components',
    items: [
      { label: 'Accordion', slug: 'components/accordion' },
      { label: 'Alert', slug: 'components/alert' },
      { label: 'Badge', slug: 'components/badge' },
      { label: 'Breadcrumb', slug: 'components/breadcrumb' },
      { label: 'Button', slug: 'components/button' },
      { label: 'Card', slug: 'components/card' },
      { label: 'Carousel', slug: 'components/carousel' },
      { label: 'Code', slug: 'components/code' },
      { label: 'Context Menu', slug: 'components/context-menu' },
      { label: 'Control', slug: 'components/control' },
      { label: 'Drawer', slug: 'components/drawer' },
      { label: 'Dropdown', slug: 'components/dropdown' },
      { label: 'Icon', slug: 'components/icon' },
      { label: 'Input', slug: 'components/input' },
      { label: 'Menu List', slug: 'components/menu-list' },
      { label: 'Modal', slug: 'components/modal' },
      { label: 'Navbar', slug: 'components/navbar' },
      { label: 'Pagination', slug: 'components/pagination' },
      { label: 'Select', slug: 'components/select' },
      { label: 'Sidebar', slug: 'components/sidebar' },
      { label: 'Skeleton', slug: 'components/skeleton' },
      { label: 'Switch', slug: 'components/switch' },
      { label: 'Tabs', slug: 'components/tabs' },
      { label: 'Toast', slug: 'components/toast' },
      { label: 'Tooltip', slug: 'components/tooltip' },
    ],
  },
  {
    // Foundation tier (see root README's "Package Roles"): pure state
    // machines/a11y logic, zero DOM, powers both web-components and
    // vanilla-components internally.
    label: 'Headless Core',
    items: [
      { label: 'Overview', slug: 'headless/overview' },
      { label: 'Primitives', slug: 'headless/primitives' },
      { label: 'Button', slug: 'headless/button' },
      { label: 'Accordion', slug: 'headless/accordion' },
      { label: 'Tabs', slug: 'headless/tabs' },
      { label: 'Dropdown', slug: 'headless/dropdown' },
      { label: 'Modal', slug: 'headless/modal' },
      { label: 'Drawer', slug: 'headless/drawer' },
      { label: 'Tooltip', slug: 'headless/tooltip' },
      { label: 'Toast', slug: 'headless/toast' },
      { label: 'Input', slug: 'headless/input' },
      { label: 'Select', slug: 'headless/select' },
      { label: 'Alert', slug: 'headless/alert' },
      { label: 'Navbar', slug: 'headless/navbar' },
      { label: 'Sidebar', slug: 'headless/sidebar' },
      { label: 'Breadcrumb', slug: 'headless/breadcrumb' },
      { label: 'Carousel', slug: 'headless/carousel' },
      { label: 'Menu List', slug: 'headless/menu-list' },
      { label: 'Context Menu', slug: 'headless/context-menu' },
    ],
  },
  {
    // Everything below is "product core" (root README) — usable
    // standalone, without web-components — each gets its own
    // top-level group rather than nesting under Components.
    label: 'Motion',
    items: [
      { label: 'Overview', slug: 'motion/overview' },
      { label: 'Imperative Player', slug: 'motion/imperative-player' },
      { label: 'Recipes', slug: 'motion/recipes' },
    ],
  },
  {
    label: 'Icon',
    items: [{ label: 'Overview', slug: 'icon/overview' }],
  },
  {
    label: 'Layout',
    items: [
      { label: 'Overview', slug: 'layout/overview' },
      { label: 'Flex', slug: 'layout/flex' },
      { label: 'Grid', slug: 'layout/grid' },
      { label: 'Spacing', slug: 'layout/spacing' },
      { label: 'Typography', slug: 'layout/typography' },
      { label: 'Recipes', slug: 'layout/recipes' },
    ],
  },
  {
    label: 'Behaviors',
    items: [
      { label: 'Overview', slug: 'behaviors/overview' },
      { label: 'Splitter', slug: 'behaviors/splitter' },
      { label: 'Tooltip', slug: 'behaviors/tooltip' },
      { label: 'Dialog', slug: 'behaviors/dialog' },
      { label: 'Drag & Drop', slug: 'behaviors/drag-drop' },
      { label: 'Recipes', slug: 'behaviors/recipes' },
    ],
  },
  {
    label: 'Vanilla Components',
    items: [{ label: 'Overview', slug: 'vanilla/overview' }],
  },
  {
    label: 'Skills',
    items: [{ label: 'Overview', slug: 'skills/overview' }],
  },
  {
    // Framework adapters (root README tier): thin, mostly-generated
    // wrappers around web-components, grouped together the same way
    // the README groups them.
    label: 'Framework Adapters',
    items: [
      { label: 'Astro', slug: 'framework-adapters/astro' },
      { label: 'Angular', slug: 'framework-adapters/angular' },
      { label: 'React', slug: 'framework-adapters/react' },
      { label: 'Vue', slug: 'framework-adapters/vue' },
    ],
  },
];
