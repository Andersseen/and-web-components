import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Control',
  component: 'and-control',
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Bio',
    hint: 'Max 200 characters',
    required: false,
  },
};

const Template = args => html`
  <div style="padding: 20px; max-width: 320px;">
    <and-control
      label=${ifDefined(args.label)}
      hint=${ifDefined(args.hint)}
      error=${ifDefined(args.error)}
      ?required=${args.required}
    >
      <textarea
        rows="3"
        style="width: 100%; box-sizing: border-box; padding: 8px; border-radius: 6px; border: 1px solid #d0d0d0; font: inherit;"
      ></textarea>
    </and-control>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};

export const WithError = Template.bind({});
WithError.args = {
  error: 'Bio is required',
};

export const Required = Template.bind({});
Required.args = {
  required: true,
};

export const WithNativeSelect = Template.bind({});
WithNativeSelect.args = {
  label: 'Country',
  hint: '',
};
WithNativeSelect.render = args => html`
  <div style="padding: 20px; max-width: 320px;">
    <and-control label=${ifDefined(args.label)} error=${ifDefined(args.error)} ?required=${args.required}>
      <select
        style="width: 100%; box-sizing: border-box; padding: 8px; border-radius: 6px; border: 1px solid #d0d0d0; font: inherit;"
      >
        <option value="">Choose a country</option>
        <option value="us">United States</option>
        <option value="es">Spain</option>
      </select>
    </and-control>
  </div>
`;
