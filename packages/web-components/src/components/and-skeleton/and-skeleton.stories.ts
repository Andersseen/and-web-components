import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Skeleton',
  component: 'and-skeleton',
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'circle', 'text'],
    },
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: {
    variant: 'default',
    width: '200px',
    height: '16px',
  },
};

const Template = args => html`
  <div style="padding: 20px;">
    <and-skeleton
      variant=${ifDefined(args.variant)}
      width=${ifDefined(args.width)}
      height=${ifDefined(args.height)}
    ></and-skeleton>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};

export const Circle = Template.bind({});
Circle.args = { variant: 'circle', width: '48px', height: '48px' };

export const Text = Template.bind({});
Text.args = { variant: 'text', width: '100%', height: '12px' };
