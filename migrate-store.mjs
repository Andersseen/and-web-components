import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const files = [
  'accordion/accordion.ts',
  'alert/alert.ts',
  'breadcrumb/breadcrumb.ts',
  'context-menu/context-menu.ts',
  'drawer/drawer.ts',
  'dropdown/dropdown.ts',
  'menu-list/menu-list.ts',
  'navbar/navbar.ts',
  'sidebar/sidebar.ts',
  'tabs/tabs.ts',
  'toast/toast.ts',
  'tooltip/tooltip.ts',
];

const srcDir = path.join(__dirname, 'packages/headless-core/src');

for (const rel of files) {
  const filePath = path.join(srcDir, rel);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add import
  const lines = content.split('\n');
  let firstImportIdx = lines.findIndex(l => l.trim().startsWith('import'));
  if (firstImportIdx === -1) {
    firstImportIdx = 0;
  }
  lines.splice(firstImportIdx, 0, "import { createStore } from '../utils/store';");
  content = lines.join('\n');

  // 2. Update top JSDoc
  const firstClose = content.indexOf('*/');
  if (firstClose !== -1) {
    const beforeClose = content.slice(0, firstClose);
    if (!/reactive/i.test(beforeClose)) {
      content =
        content.slice(0, firstClose) +
        ' *\n * Now reactive: subscribe to state changes from any framework.\n ' +
        content.slice(firstClose);
    }
  }

  // 3. Replace declaration
  content = content.replace(/let state:\s*(\w+)\s*=\s*\{/, 'const store = createStore<$1>({');

  // 4. Replace reads: state. -> store.state.
  content = content.replace(/\bstate\./g, 'store.state.');

  // 5. Replace single-line mutations (and simple multi-line without nested braces)
  content = content.replace(/store\.state\s*=\s*\{\s*\.{3}store\.state\s*,\s*([^}]+)\};/g, 'store.setState({ $1 });');

  // 6. Replace multi-line mutations for breadcrumb (has nested braces inside map)
  if (rel === 'breadcrumb/breadcrumb.ts') {
    content = content.replace(
      `    store.state = {
      ...store.state,
      items: store.state.items.map((item) => ({
        ...item,
        current: item.id === itemId,
      })),
    };`,
      `    store.setState({
      items: store.state.items.map((item) => ({
        ...item,
        current: item.id === itemId,
      })),
    });`,
    );
  }

  // 7. Replace get state() block
  const newStateBlock = `get state() {
      return store.state;
    },
    subscribe: callback => {
      return store.subscribe(state => callback(state));
    },`;
  content = content.replace(/get state\(\) \{[\s\S]*?Object\.freeze\([\s\S]*?\);\s*\},/, newStateBlock);

  // 8. Add subscribe to return interface
  content = content.replace(
    /(state: Readonly<(\w+)>;)(\n\s*\n)/,
    `$1\n\n  /**\n   * Subscribe to state changes. Returns unsubscribe function.\n   */\n  subscribe: (callback: (state: Readonly<$2>) => void) => () => void;$3`,
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Migrated', rel);
}
