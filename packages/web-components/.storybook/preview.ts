import { setCustomElementsManifest } from '@storybook/web-components-vite';
import customElements from '../custom-elements.json';

// Initialize the web components
import { defineCustomElements } from '../loader';

defineCustomElements();

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
