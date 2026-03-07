import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Breadcrumb',
  component: 'and-breadcrumb',
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    size: 'md',
  },
};

const Template = args => html`
  <div style="padding: 20px;">
    <and-breadcrumb size=${ifDefined(args.size)}>
      <li><a href="#" class="hover:underline">Home</a></li>
      <li><span class="mx-2">/</span></li>
      <li><a href="#" class="hover:underline">Library</a></li>
      <li><span class="mx-2">/</span></li>
      <li class="text-foreground" aria-current="page">Data</li>
    </and-breadcrumb>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};

export const Small = Template.bind({});
Small.args = {
  size: 'sm',
};

export const Large = Template.bind({});
Large.args = {
  size: 'lg',
};
