import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Input',
  component: 'and-input',
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search'],
    },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    hasError: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    type: 'text',
    placeholder: 'Enter text here...',
    disabled: false,
    required: false,
    hasError: false,
  },
};

const Template = args => html`
  <div style="padding: 20px; max-width: 300px;">
    <div class="mb-2">
      <label class="text-sm font-medium">Username</label>
    </div>
    <and-input
      type=${ifDefined(args.type)}
      placeholder=${ifDefined(args.placeholder)}
      value=${ifDefined(args.value)}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?has-error=${args.hasError}
      label=${ifDefined(args.label)}
      @andInput=${e => console.log('Input value:', e.detail)}
    ></and-input>
    ${args.hasError ? html`<p class="mt-1 text-sm text-destructive">This field has an error.</p>` : ''}
  </div>
`;

export const Default = Template.bind({});
Default.args = {};
