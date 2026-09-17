import { registerAllIcons } from './index';

/**
 * Side-effectful entrypoint for CDN / no-bundler usage: importing this module
 * registers every bundled icon immediately.
 *
 * Never imported by the package's main entry (`index.ts`) — npm consumers
 * using `import { registerIcons } from '@andersseen/icon'` keep full
 * tree-shaking. This file exists purely for
 * `<script type="module" src=".../@andersseen/icon/dist/browser.js"></script>`
 * (jsDelivr/unpkg) or an explicit `import '@andersseen/icon/browser'`, to
 * make `<and-icon>` usable from a CDN with no build step.
 */
registerAllIcons();
