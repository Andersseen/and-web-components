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
