import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Tooltip',
  component: 'and-tooltip',
  argTypes: {
    content: { control: 'text' },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    openDelay: { control: 'number' },
    closeDelay: { control: 'number' },
  },
  args: {
    content: 'Add to library',
    placement: 'top',
    openDelay: 0,
    closeDelay: 0,
  },
};

const Template = args => html`
  <div style="padding: 100px; display: flex; justify-content: center;">
    <and-tooltip content=${ifDefined(args.content)} placement=${ifDefined(args.placement)} open-delay=${args.openDelay} close-delay=${args.closeDelay}>
      <and-button variant="outline" size="icon">
        <and-icon name="plus"></and-icon>
      </and-button>
    </and-tooltip>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};

export const Bottom = Template.bind({});
Bottom.args = {
  placement: 'bottom',
};
