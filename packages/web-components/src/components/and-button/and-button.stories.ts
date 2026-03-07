import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Button',
  component: 'and-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    href: { control: 'text' },
  },
  args: {
    variant: 'default',
    size: 'default',
    disabled: false,
    loading: false,
  },
};

const Template = args => html`
  <div style="padding: 20px; display: flex; gap: 8px;">
    <and-button
      variant=${ifDefined(args.variant)}
      size=${ifDefined(args.size)}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      href=${ifDefined(args.href)}
      @andButtonClick=${() => console.log('Button clicked')}
    >
      ${args.size === 'icon' ? html`<and-icon name="plus"></and-icon>` : 'Button'}
    </and-button>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};
