import { html } from 'lit';

export default {
  title: 'Components/ContextMenu',
  component: 'and-context-menu',
  argTypes: {
    open: { control: 'boolean' },
  },
  args: {
    open: false,
  },
};

const Template = args => html`
  <div style="padding: 50px; display: flex; justify-content: center; align-items: center; min-height: 300px; border: 1px dashed #ccc; border-radius: 8px;">
    <and-context-menu ?open=${args.open} @andContextMenuOpenChange=${e => console.log('Context menu open:', e.detail)}>
      <div slot="trigger" class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">Right click here</div>
      <div class="p-1">
        <div class="px-2 py-1.5 text-sm font-semibold">Actions</div>
        <div class="h-px bg-border my-1"></div>
        <div class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground">Edit</div>
        <div class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground">Duplicate</div>
        <div class="h-px bg-border my-1"></div>
        <div
          class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          Delete
        </div>
      </div>
    </and-context-menu>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};
