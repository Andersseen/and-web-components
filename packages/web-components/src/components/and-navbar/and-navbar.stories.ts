import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Navbar',
  component: 'and-navbar',
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'floating', 'glass'],
    },
    position: {
      control: 'select',
      options: ['static', 'sticky', 'fixed'],
    },
    itemVariant: {
      control: 'select',
      options: ['default', 'underline', 'filled'],
    },
    activeMode: {
      control: 'select',
      options: ['auto', 'route', 'hash', 'scroll', 'manual'],
    },
    routeMatchMode: {
      control: 'select',
      options: ['prefix', 'exact'],
    },
    autoCollapse: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    position: 'static',
    itemVariant: 'default',
    activeMode: 'auto',
    routeMatchMode: 'prefix',
    autoCollapse: true,
  },
};

const Template = args => html`
  <div style="height: 300px; background: #f8fafc; padding: 20px;">
    <and-navbar
      variant=${ifDefined(args.variant)}
      position=${ifDefined(args.position)}
      item-variant=${ifDefined(args.itemVariant)}
      active-mode=${ifDefined(args.activeMode)}
      route-match-mode=${ifDefined(args.routeMatchMode)}
      ?auto-collapse=${args.autoCollapse}
      .items=${[
        { id: 'home', label: 'Home', href: '#' },
        { id: 'products', label: 'Products', href: '#' },
        { id: 'about', label: 'About', href: '#' },
        { id: 'contact', label: 'Contact', href: '#' },
      ]}
      @navItemClick=${e => console.log('Nav item clicked:', e.detail)}
    >
      <span slot="brand" class="font-bold text-lg">Acme Corp</span>
      <div slot="end" class="flex gap-2">
        <and-button variant="ghost" size="sm">Login</and-button>
        <and-button size="sm">Sign Up</and-button>
      </div>
    </and-navbar>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};

export const SlotPriority = () => html`
  <div style="height: 300px; background: #f8fafc; padding: 20px;">
    <and-navbar active-mode="manual" .items=${[{ id: 'home', label: 'Home', href: '/' }]}>
      <span slot="brand" class="font-bold text-lg">Slot First</span>
      <nav slot="nav" style="display:flex; gap:8px;">
        <a href="/" class="px-3 py-1 rounded bg-slate-200 text-slate-900 no-underline">Home</a>
        <a href="/docs" class="px-3 py-1 rounded bg-slate-200 text-slate-900 no-underline">Docs</a>
        <a href="/demo" class="px-3 py-1 rounded bg-slate-200 text-slate-900 no-underline">Demo</a>
      </nav>
      <div slot="end" class="flex gap-2">
        <and-button size="sm">Action</and-button>
      </div>
    </and-navbar>
  </div>
`;
