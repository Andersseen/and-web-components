import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/MenuList',
  component: 'and-menu-list',
  argTypes: {
    ariaMenuLabel: { control: 'text' },
  },
  args: {
    ariaMenuLabel: 'Main Menu',
  },
};

const Template = args => html`
  <div style="padding: 20px; max-width: 250px; background: white; border: 1px solid #e2e8f0; border-radius: 8px;">
    <and-menu-list aria-menu-label=${ifDefined(args.ariaMenuLabel)}>
      <li class="px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-default rounded-sm text-sm">Dashboard</li>
      <li class="px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-default rounded-sm text-sm">Analytics</li>
      <li class="px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-default rounded-sm text-sm text-muted-foreground opacity-50" aria-disabled="true">
        Settings (Disabled)
      </li>
      <li class="px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-default rounded-sm text-sm">Profile</li>
    </and-menu-list>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};
