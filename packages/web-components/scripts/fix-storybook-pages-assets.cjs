const fs = require('node:fs');
const path = require('node:path');

const storybookStaticDir = path.resolve(__dirname, '..', 'storybook-static');

const shims = {
  'runtime.js': "import './sb-manager/runtime.js';\n",
  'common-manager-bundle.js':
    "import './sb-addons/storybook-core-server-presets-0/common-manager-bundle.js';\n",
  'manager-bundle.js': [
    "import './sb-addons/a11y-1/manager-bundle.js';",
    "import './sb-addons/docs-2/manager-bundle.js';",
    "import './sb-addons/storybook-3/manager-bundle.js';",
    '',
  ].join('\n'),
};

if (!fs.existsSync(storybookStaticDir)) {
  throw new Error(`Storybook output directory not found: ${storybookStaticDir}`);
}

for (const [fileName, contents] of Object.entries(shims)) {
  fs.writeFileSync(path.join(storybookStaticDir, fileName), contents);
}

