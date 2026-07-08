import { setCustomElementsManifest } from '@storybook/web-components-vite';
import customElements from '../custom-elements.json';
import { registerAllIcons } from '@andersseen/icon';

// Initialize the web components
import { defineCustomElements } from '../loader';

defineCustomElements();
registerAllIcons();

setCustomElementsManifest(customElements);
import '../src/global/global.css';
import '../../motion-core/dist/style.css';
import '../../layout-core/dist/layout.css';

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
