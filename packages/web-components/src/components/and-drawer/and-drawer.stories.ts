import { html } from 'lit';

export default {
  title: 'Components/Drawer',
  component: 'and-drawer',
  argTypes: {
    open: { control: 'boolean' },
    placement: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    showClose: { control: 'boolean' },
  },
  args: {
    open: false,
    placement: 'right',
    showClose: true,
  },
};

const Template = args => {
  return html`
    <div style="padding: 20px;">
      <and-button
        @andButtonClick=${() => {
          document.querySelector('and-drawer').open = true;
        }}
      >
        Open Drawer
      </and-button>

      <and-drawer
        ?open=${args.open}
        placement=${args.placement}
        ?show-close=${args.showClose}
        @andDrawerClose=${() => console.log('Drawer closed')}
        @andDrawerOpen=${() => console.log('Drawer opened')}
      >
        <span slot="header" class="text-lg font-semibold">Drawer Title</span>
        <div class="py-4">
          <p class="text-sm text-foreground">This is the drawer content. It slides in from the specified placement.</p>
        </div>
        <span slot="footer" class="flex justify-end gap-2">
          <and-button
            variant="outline"
            @andButtonClick=${() => {
              document.querySelector('and-drawer').open = false;
            }}
            >Cancel</and-button
          >
          <and-button
            @andButtonClick=${() => {
              document.querySelector('and-drawer').open = false;
            }}
            >Save</and-button
          >
        </span>
      </and-drawer>
    </div>
  `;
};

export const Default = Template.bind({});
Default.args = {};

export const PlacementLeft = Template.bind({});
PlacementLeft.args = {
  placement: 'left',
};

export const PlacementBottom = Template.bind({});
PlacementBottom.args = {
  placement: 'bottom',
};
