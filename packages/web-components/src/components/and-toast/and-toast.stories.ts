import { html } from 'lit';

export default {
  title: 'Components/Toast',
  component: 'and-toast',
  argTypes: {},
  args: {},
};

const Template = () => {
  return html`
    <div style="padding: 20px; text-align: center;">
      <and-toast></and-toast>
      <div class="flex flex-wrap gap-2 justify-center">
        <and-button
          @andButtonClick=${() => {
            document.querySelector('and-toast').present('This is a default toast.', 'default');
          }}
          >Default Toast</and-button
        >

        <and-button
          variant="outline"
          @andButtonClick=${() => {
            document.querySelector('and-toast').present('Information message.', 'info');
          }}
          >Info Toast</and-button
        >

        <and-button
          variant="outline"
          @andButtonClick=${() => {
            document.querySelector('and-toast').present('Action successful.', 'success');
          }}
          >Success Toast</and-button
        >

        <and-button
          variant="outline"
          @andButtonClick=${() => {
            document.querySelector('and-toast').present('Warning: almost empty.', 'warning');
          }}
          >Warning Toast</and-button
        >

        <and-button
          variant="destructive"
          @andButtonClick=${() => {
            document.querySelector('and-toast').present('An error occurred!', 'error');
          }}
          >Error Toast</and-button
        >
      </div>
    </div>
  `;
};

export const Default = Template.bind({});
Default.args = {};
