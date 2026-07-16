import { html } from 'lit';

export default {
  title: 'Components/Switch',
  component: 'and-switch',
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    checked: false,
    disabled: false,
    required: false,
    label: 'Enable notifications',
  },
};

const Template = args => html`
  <div style="padding: 20px;">
    <and-switch
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      ?required=${args.required}
      label=${args.label}
      @andSwitchChange=${e => console.log('Checked:', e.detail)}
    ></and-switch>
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
        const output = form.querySelector('#and-switch-form-output') as HTMLElement;
        const data: Record<string, FormDataEntryValue> = {};
        new FormData(form).forEach((value, key) => {
          data[key] = value;
        });
        output.textContent = JSON.stringify(data);
      }}
      @reset=${(e: Event) => {
        const form = e.target as HTMLFormElement;
        const output = form.querySelector('#and-switch-form-output') as HTMLElement;
        output.textContent = '(reset)';
      }}
    >
      <fieldset id="and-switch-form-fieldset" style="border: 0; padding: 0;">
        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.875rem;">
          <and-switch id="and-switch-form-notifications" name="notifications" checked></and-switch>
          Enable notifications
        </label>
      </fieldset>
      <label style="display: flex; align-items: center; gap: 6px; font-size: 0.875rem; margin-top: 12px;">
        <input
          type="checkbox"
          onchange=${(e: Event) => {
            const checkbox = e.target as HTMLInputElement;
            const fieldset = checkbox
              .closest('form')
              ?.querySelector('#and-switch-form-fieldset') as HTMLFieldSetElement;
            if (fieldset) fieldset.disabled = checkbox.checked;
          }}
        />
        Disable the fieldset (tests native disabled-inheritance, no extra wiring needed)
      </label>
      <div style="margin-top: 12px; display: flex; gap: 8px;">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
      <pre id="and-switch-form-output" style="margin-top: 12px; font-size: 12px;"></pre>
    </form>
  </div>
`;
InAForm.storyName = 'In a form';
