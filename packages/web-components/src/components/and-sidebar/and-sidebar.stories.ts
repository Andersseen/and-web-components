import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Sidebar',
  component: 'and-sidebar',
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'floating', 'glass'],
    },
    collapsed: { control: 'boolean' },
    itemVariant: {
      control: 'select',
      options: ['default', 'underline', 'filled'],
    },
  },
  args: {
    variant: 'default',
    collapsed: false,
    itemVariant: 'default',
  },
};

const Template = args => html`
  <div style="display: flex; height: 500px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #f8fafc;">
    <and-sidebar
      variant=${ifDefined(args.variant)}
      ?collapsed=${args.collapsed}
      item-variant=${ifDefined(args.itemVariant)}
      .items=${[
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'analytics', label: 'Analytics', icon: 'bar-chart' },
        { id: 'settings', label: 'Settings', icon: 'settings', section: 'bottom' },
        { id: 'help', label: 'Help & Support', icon: 'help-circle', section: 'bottom' },
      ]}
      @andSidebarItemClick=${e => console.log('Sidebar item clicked:', e.detail)}
    >
      <div slot="header" class="font-bold text-lg px-2">Acme Admin</div>
    </and-sidebar>
    <main class="flex-1 p-6">
      <h1 class="text-2xl font-bold mb-4">Main Content Area</h1>
      <p class="text-muted-foreground">Select an item from the sidebar to view its content.</p>
    </main>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};

export const Collapsed = Template.bind({});
Collapsed.args = {
  collapsed: true,
};
