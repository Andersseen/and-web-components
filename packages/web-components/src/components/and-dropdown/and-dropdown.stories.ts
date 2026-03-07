import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Dropdown',
  component: 'and-dropdown',
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'ghost', 'outline'],
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    label: { control: 'text' },
    closeOnSelect: { control: 'boolean' },
  },
  args: {
    variant: 'outline',
    placement: 'bottom',
    label: 'Actions',
    closeOnSelect: true,
  },
};

const Template = args => html`
  <div style="padding: 100px; display: flex; justify-content: center;">
    <and-dropdown
      variant=${ifDefined(args.variant)}
      placement=${ifDefined(args.placement)}
      label=${ifDefined(args.label)}
      ?close-on-select=${args.closeOnSelect}
      .items=${[
        { text: 'Profile', value: 'profile' },
        { text: 'Settings', value: 'settings' },
        { text: 'Billing (Disabled)', value: 'billing', disabled: true },
        { text: 'Logout', value: 'logout' },
      ]}
      @andDropdownSelect=${e => console.log('Dropdown selected:', e.detail)}
    ></and-dropdown>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};

export const PrimaryVariant = Template.bind({});
PrimaryVariant.args = {
  variant: 'primary',
  label: 'Primary Actions',
};
