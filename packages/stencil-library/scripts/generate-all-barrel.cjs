#!/usr/bin/env node
/**
 * Generates dist/components/all.js — a barrel that re-exports every
 * custom element so consumers can do:
 *
 *   import "@andersseen/web-components/components/all";   // everything
 *
 * Run automatically after `stencil build` via the "postbuild" npm script.
 */

const fs = require("fs");
const path = require("path");

const componentsDir = path.resolve(__dirname, "../dist/components");

const files = fs
  .readdirSync(componentsDir)
  .filter((f) => f.startsWith("and-") && f.endsWith(".js"))
  .sort();

const banner = `/**
 * @andersseen/web-components — register ALL custom elements at once.
 *
 * Usage (import everything):
 *   import "@andersseen/web-components/components/all";
 *
 * For tree-shaking, import individual components instead:
 *   import "@andersseen/web-components/components/and-navbar.js";
 *   import "@andersseen/web-components/components/and-button.js";
 *
 * AUTO-GENERATED — do not edit. Run "pnpm build" to regenerate.
 */\n`;

const imports = files.map((f) => `import "./${f}";`).join("\n");

fs.writeFileSync(
  path.join(componentsDir, "all.js"),
  banner + "\n" + imports + "\n",
);

console.log(`✓ Generated components/all.js (${files.length} components)`);
