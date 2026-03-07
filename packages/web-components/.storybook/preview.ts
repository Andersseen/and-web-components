import { setCustomElementsManifest } from '@storybook/web-components';
import { defineCustomElements } from '../loader';
import customElements from '../custom-elements.json';

setCustomElementsManifest(customElements);
import '../src/global/global.css';
import '../../motion-core/dist/style.css';
import '../../layout-core/dist/layout.css';

// Initialize the web components
defineCustomElements();

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
