import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Card',
  component: 'and-card',
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'elevated', 'outline', 'ghost'],
    },
    padded: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    padded: true,
  },
};

const Template = args => html`
  <div style="padding: 20px; max-width: 400px;">
    <and-card variant=${ifDefined(args.variant)} ?padded=${args.padded}>
      <h3 class="text-lg font-semibold mb-2">Card Title</h3>
      <p class="text-sm text-muted-foreground mb-4">This is some descriptive text inside the card to visually test the paddings and the variant styling.</p>
      <div class="flex gap-2">
        <and-button variant="outline" size="sm">Cancel</and-button>
        <and-button size="sm">Submit</and-button>
      </div>
    </and-card>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};
