/**
 * Concatenates all animation CSS files into dist/style.css.
 * Cross-platform replacement for the `cat` shell command.
 */
const fs = require('fs');
const path = require('path');

const ANIMATIONS_DIR = path.resolve(__dirname, '../src/animations');
const OUTPUT = path.resolve(__dirname, '../dist/style.css');

// Order matters — base must come first, reduced-motion last
const FILES = [
  '_base.css',
  '_attention-seekers.css',
  '_fading.css',
  '_sliding.css',
  '_zooming.css',
  '_bouncing.css',
  '_flippers.css',
  '_rotating.css',
  '_lightspeed.css',
  '_back.css',
  '_specials.css',
  '_components.css',
  '_reduced-motion.css',
];

const output = FILES
  .map((f) => fs.readFileSync(path.join(ANIMATIONS_DIR, f), 'utf-8'))
  .join('\n');

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, output);
console.log(`✓ Generated dist/style.css (${FILES.length} files merged)`);
