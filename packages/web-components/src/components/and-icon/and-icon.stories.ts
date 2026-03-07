import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Icon',
  component: 'and-icon',
  argTypes: {
    name: {
      control: 'text',
      description: 'Icon name. Example: "plus", "chevron-down", "close"',
    },
    size: { control: 'number' },
    color: { control: 'color' },
    strokeWidth: { control: 'number' },
  },
  args: {
    name: 'plus',
    size: 24,
    color: 'currentColor',
    strokeWidth: 2,
  },
};

const Template = args => html`
  <div style="padding: 20px; color: #666;">
    <and-icon name=${ifDefined(args.name)} size=${ifDefined(args.size)} color=${ifDefined(args.color)} stroke-width=${ifDefined(args.strokeWidth)}></and-icon>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};
