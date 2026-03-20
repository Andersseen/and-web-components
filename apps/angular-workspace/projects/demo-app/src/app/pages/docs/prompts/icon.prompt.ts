export const ICON_PROMPT = `\
CONTEXT: @andersseen/icon

## Library profile
Framework-agnostic SVG string registry.
Tree-shakable icon constants + runtime registration functions.
Used internally by \`and-icon\` in @andersseen/web-components.
Can also be consumed standalone to render SVGs in any framework.

## Install
\`\`\`
npm i @andersseen/icon
\`\`\`

## Core API
\`\`\`ts
import {
  registerIcons,
  registerAllIcons,
  getIcon,
  hasIcon,
  getRegisteredIconNames,
  getRegisteredIconCount,
} from '@andersseen/icon';
\`\`\`

Verified behavior:
- Registry is global (window/globalThis) under \`__AND_ICONS_REGISTRY__\`.
- \`registerIcons\` merges entries into that global Map.
- \`getIcon(name)\` returns SVG string or \`undefined\` if not registered.

## Setup options

### Option A — register all icons (prototyping / small apps)
\`\`\`ts
import { registerAllIcons } from '@andersseen/icon';
registerAllIcons();
\`\`\`

### Option B — tree-shakable selective registration (production recommended)
\`\`\`ts
import { registerIcons, HOME, CLOSE, SEARCH, COMPONENT_ICONS } from '@andersseen/icon';

// Register only icons required by and-* components (always required when using web-components)
registerIcons(COMPONENT_ICONS);

// Register additional icons your app needs
registerIcons({ home: HOME, close: CLOSE, search: SEARCH });
\`\`\`

## COMPONENT_ICONS
This named export is a pre-built record containing all icons that the
\`@andersseen/web-components\` package uses internally (chevron, close, check, spinner, etc.).
Always include it when using the web-components package.

## Using registered icons
\`\`\`ts
// Get raw SVG string
const svg = getIcon('home');  // returns SVG string or undefined

// Guard before use
if (!hasIcon('home')) {
  console.warn('Icon "home" is not registered');
}

console.log(getRegisteredIconNames());
console.log(getRegisteredIconCount());

// Render inline in a framework
// Angular:
// <span [innerHTML]="getIcon('home')"></span>
// Pure HTML:
// element.innerHTML = getIcon('home') ?? '';
\`\`\`

## With and-icon (web component)
After registration, use the icon by name via the \`name\` prop:
\`\`\`html
<and-icon name="home" size="20"></and-icon>
<and-icon name="sparkles" size="16" color="hsl(var(--primary))"></and-icon>
<and-icon name="arrow-right" size="24" stroke-width="1.5"></and-icon>
\`\`\`

## Icon naming convention
All exported constants follow SCREAMING_SNAKE_CASE.
Registration keys (and \`name\` prop values) follow kebab-case.

\`\`\`ts
import { ARROW_RIGHT, CHECK_CIRCLE, LOADING_SPINNER } from '@andersseen/icon';
registerIcons({
  'arrow-right': ARROW_RIGHT,
  'check-circle': CHECK_CIRCLE,
  'loading-spinner': LOADING_SPINNER,
});
\`\`\`

## Rules for LLM output
- Always register icons before rendering \`and-icon\` or calling \`getIcon\`.
- In production prefer selective registration; avoid \`registerAllIcons\` unless demo/prototype.
- Keep \`and-icon name\` exactly aligned with registry keys.
- Do not inline random SVG literals in generated code when registry can be used.
- Register \`COMPONENT_ICONS\` whenever @andersseen/web-components is used.
`;
