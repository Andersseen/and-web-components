import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Tabs',
  component: 'and-tabs',
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    activationMode: {
      control: 'select',
      options: ['automatic', 'manual'],
    },
  },
  args: {
    orientation: 'horizontal',
    activationMode: 'automatic',
  },
};

const Template = args => html`
  <div style="padding: 20px; max-width: 600px;">
    <and-tabs
      default-value="account"
      orientation=${ifDefined(args.orientation)}
      activation-mode=${ifDefined(args.activationMode)}
      @andTabChange=${e => console.log('Tab changed to:', e.detail)}
    >
      <and-tabs-list>
        <and-tabs-trigger value="account">Account</and-tabs-trigger>
        <and-tabs-trigger value="password">Password</and-tabs-trigger>
        <and-tabs-trigger value="settings" disabled>Settings</and-tabs-trigger>
      </and-tabs-list>

      <and-tabs-content value="account" class="p-4 border border-t-0 border-border rounded-b-md">
        <h3 class="text-lg font-medium">Account Settings</h3>
        <p class="text-sm text-muted-foreground mt-2">Make changes to your account here. Click save when you're done.</p>
      </and-tabs-content>

      <and-tabs-content value="password" class="p-4 border border-t-0 border-border rounded-b-md">
        <h3 class="text-lg font-medium">Password</h3>
        <p class="text-sm text-muted-foreground mt-2">Change your password here. After saving, you'll be logged out.</p>
      </and-tabs-content>

      <and-tabs-content value="settings" class="p-4 border border-t-0 border-border rounded-b-md"> Settings Content </and-tabs-content>
    </and-tabs>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};
