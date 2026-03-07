import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Accordion',
  component: 'and-accordion',
  argTypes: {
    allowMultiple: { control: 'boolean' },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    allowMultiple: false,
    orientation: 'vertical',
    disabled: false,
  },
};

const Template = args => html`
  <div style="max-width: 400px; padding: 20px;">
    <and-accordion ?allow-multiple=${args.allowMultiple} orientation=${ifDefined(args.orientation)} ?disabled=${args.disabled}>
      <and-accordion-item value="item-1">
        <and-accordion-trigger>Can I use this in React?</and-accordion-trigger>
        <and-accordion-content> Yes, these are standard Web Components and can be used in React, Vue, Angular, or vanilla HTML. </and-accordion-content>
      </and-accordion-item>

      <and-accordion-item value="item-2">
        <and-accordion-trigger>Is it accessible?</and-accordion-trigger>
        <and-accordion-content> Yes. It adheres to the WAI-ARIA design pattern using the Headless Components library. </and-accordion-content>
      </and-accordion-item>

      <and-accordion-item value="item-3">
        <and-accordion-trigger>Can I disable it?</and-accordion-trigger>
        <and-accordion-content> Yes, you can disable individual items or the entire accordion. </and-accordion-content>
      </and-accordion-item>
    </and-accordion>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};
