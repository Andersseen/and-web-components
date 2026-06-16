const fs = require('node:fs');
const path = require('node:path');

const roots = process.argv.slice(2);

if (roots.length === 0) {
  console.error('Usage: node scripts/fix-esm-extensions.cjs <dist-dir> [...]');
  process.exit(1);
}

const specifierPattern =
  /\b(from\s*['"]|import\s*\(\s*['"])(\.\.?\/[^'"]+)(['"]\s*\)?)/g;

const hasKnownExtension = specifier => path.extname(specifier) !== '';

const resolveSpecifier = (filePath, specifier) => {
  if (hasKnownExtension(specifier)) {
    return specifier;
  }

  const basePath = path.resolve(path.dirname(filePath), specifier);

  if (fs.existsSync(`${basePath}.js`)) {
    return `${specifier}.js`;
  }

  if (fs.existsSync(path.join(basePath, 'index.js'))) {
    return `${specifier}/index.js`;
  }

  return specifier;
};

const walk = dir => {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
};

for (const root of roots) {
  const rootPath = path.resolve(root);
  for (const filePath of walk(rootPath)) {
    if (!filePath.endsWith('.js')) {
      continue;
    }

    const source = fs.readFileSync(filePath, 'utf8');
    const fixed = source.replace(specifierPattern, (match, prefix, specifier, suffix) => {
      return `${prefix}${resolveSpecifier(filePath, specifier)}${suffix}`;
    });

    if (fixed !== source) {
      fs.writeFileSync(filePath, fixed);
    }
  }
}
