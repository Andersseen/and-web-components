import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Alert',
  component: 'and-alert',
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'info'],
    },
    dismissible: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    dismissible: false,
  },
};

const Template = args => html`
  <div style="max-width: 500px; padding: 20px;">
    <and-alert variant=${ifDefined(args.variant)} ?dismissible=${args.dismissible} @andDismiss=${() => console.log('Alert dismissed')}>
      <and-icon name="info" slot="icon" class="h-4 w-4"></and-icon>
      <p>This is an alert message checking the various variants!</p>
    </and-alert>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};

export const Destructive = Template.bind({});
Destructive.args = {
  variant: 'destructive',
};

export const Success = Template.bind({});
Success.args = {
  variant: 'success',
};

export const Dismissible = Template.bind({});
Dismissible.args = {
  dismissible: true,
};
