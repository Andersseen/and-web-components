import { html } from 'lit';

export default {
  title: 'Components/Modal',
  component: 'and-modal',
  argTypes: {
    open: { control: 'boolean' },
  },
  args: {
    open: false,
  },
};

const Template = args => {
  return html`
    <div style="padding: 50px; text-align: center;">
      <and-button
        @andButtonClick=${() => {
          document.querySelector('and-modal').open = true;
        }}
      >
        Open Modal
      </and-button>

      <and-modal ?open=${args.open} @andClose=${() => console.log('Modal closed')}>
        <div class="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 class="text-lg font-semibold leading-none tracking-tight">Are you absolutely sure?</h2>
          <p class="text-sm text-muted-foreground">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
        </div>
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
          <and-button
            variant="outline"
            @andButtonClick=${() => {
              document.querySelector('and-modal').open = false;
            }}
            >Cancel</and-button
          >
          <and-button
            variant="destructive"
            @andButtonClick=${() => {
              document.querySelector('and-modal').open = false;
            }}
            >Continue</and-button
          >
        </div>
      </and-modal>
    </div>
  `;
};

export const Default = Template.bind({});
Default.args = {};
