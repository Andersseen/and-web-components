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
  registerIcons,      // add one or more icons to the registry
  registerAllIcons,   // register every available icon (use in dev/prototyping only)
  getIcon,            // retrieve SVG string by name
  hasIcon,            // check if an icon is registered
  getRegisteredIconNames, // list all currently registered names
} from '@andersseen/icon';
\`\`\`

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
- Always call registerIcons (or registerAllIcons) before using any \`and-icon\` or getIcon().
- In production builds use selective registration — import only what you need.
- The \`name\` attribute value in HTML must exactly match the key used in registerIcons().
- Do not hard-code SVG markup; always use the registry.
- COMPONENT_ICONS must always be registered when using @andersseen/web-components.
`;
