import { html } from 'lit';

export default {
  title: 'Components/Select',
  component: 'and-select',
  argTypes: {
    placeholder: { control: 'text' },
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    hasError: { control: 'boolean' },
  },
  args: {
    placeholder: 'Choose a framework',
    value: '',
    disabled: false,
    required: false,
    hasError: false,
  },
};

const OPTIONS = [
  { text: 'Angular', value: 'angular' },
  { text: 'React', value: 'react' },
  { text: 'Vue', value: 'vue' },
  { text: 'Svelte', value: 'svelte' },
  { text: 'Solid (Disabled)', value: 'solid', disabled: true },
];

const Template = args => html`
  <div style="padding: 20px; max-width: 320px;">
    <div class="mb-2">
      <label class="text-sm font-medium">Framework</label>
    </div>
    <and-select
      .options=${OPTIONS}
      placeholder=${args.placeholder}
      value=${args.value}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?has-error=${args.hasError}
      @andSelectChange=${e => console.log('Selected value:', e.detail)}
    ></and-select>
    ${args.hasError ? html`<p class="mt-1 text-sm text-destructive">Please select an option.</p>` : ''}
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
        const output = form.querySelector('#and-select-form-output') as HTMLElement;
        const data: Record<string, FormDataEntryValue> = {};
        new FormData(form).forEach((value, key) => {
          data[key] = value;
        });
        output.textContent = JSON.stringify(data);
      }}
      @reset=${(e: Event) => {
        const form = e.target as HTMLFormElement;
        const output = form.querySelector('#and-select-form-output') as HTMLElement;
        output.textContent = '(reset)';
      }}
    >
      <fieldset id="and-select-form-fieldset" style="border: 0; padding: 0;">
        <div class="mb-2">
          <label class="text-sm font-medium" for="and-select-form-framework">Framework</label>
        </div>
        <and-select
          id="and-select-form-framework"
          name="framework"
          .options=${OPTIONS}
          value="react"
          required
        ></and-select>
      </fieldset>
      <label style="display: flex; align-items: center; gap: 6px; font-size: 0.875rem; margin-top: 12px;">
        <input
          type="checkbox"
          onchange=${(e: Event) => {
            const checkbox = e.target as HTMLInputElement;
            const fieldset = checkbox
              .closest('form')
              ?.querySelector('#and-select-form-fieldset') as HTMLFieldSetElement;
            if (fieldset) fieldset.disabled = checkbox.checked;
          }}
        />
        Disable the fieldset (tests native disabled-inheritance, no extra wiring needed)
      </label>
      <div style="margin-top: 12px; display: flex; gap: 8px;">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
      <pre id="and-select-form-output" style="margin-top: 12px; font-size: 12px;"></pre>
    </form>
  </div>
`;
InAForm.storyName = 'In a form';
