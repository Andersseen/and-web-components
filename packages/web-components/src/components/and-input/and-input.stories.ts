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
      @andInputChange=${e => console.log('Input value:', e.detail)}
    ></and-input>
    ${args.hasError ? html`<p class="mt-1 text-sm text-destructive">This field has an error.</p>` : ''}
  </div>
`;

export const Default = Template.bind({});
Default.args = {};

export const InAForm = () => html`
  <div style="padding: 20px; max-width: 320px;">
    <form
      @submit=${(e: SubmitEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const output = form.querySelector('#and-input-form-output') as HTMLElement;
        const data: Record<string, FormDataEntryValue> = {};
        new FormData(form).forEach((value, key) => {
          data[key] = value;
        });
        output.textContent = JSON.stringify(data);
      }}
      @reset=${(e: Event) => {
        const form = e.target as HTMLFormElement;
        const output = form.querySelector('#and-input-form-output') as HTMLElement;
        output.textContent = '(reset)';
      }}
    >
      <div class="mb-2">
        <label class="text-sm font-medium" for="and-input-form-username">Username</label>
      </div>
      <and-input id="and-input-form-username" name="username" value="alice" required></and-input>
      <div style="margin-top: 12px; display: flex; gap: 8px;">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
      <pre id="and-input-form-output" style="margin-top: 12px; font-size: 12px;"></pre>
    </form>
  </div>
`;
InAForm.storyName = 'In a form';
