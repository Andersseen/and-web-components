import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Badge',
  component: 'and-badge',
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
  args: {
    variant: 'default',
  },
};

const Template = args => html`
  <div style="padding: 20px; display: flex; gap: 8px;">
    <and-badge variant=${ifDefined(args.variant)}> Badge Text </and-badge>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
};

export const Destructive = Template.bind({});
Destructive.args = {
  variant: 'destructive',
};

export const Outline = Template.bind({});
Outline.args = {
  variant: 'outline',
};
