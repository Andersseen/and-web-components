import { Component, Prop, h, Host, State, Watch, Event, EventEmitter, Element } from '@stencil/core';
import * as dialog from '@zag-js/dialog';
import { normalizeProps, useMachine } from '@zag-js/core';

@Component({
  tag: 'my-modal',
  styleUrls: ['my-modal.css', '../../global/global.css'],
  shadow: true,
})
export class MyModal {
  @Element() el: HTMLElement;

  @Prop({ reflect: true, mutable: true }) open: boolean = false;
  @Event() myClose: EventEmitter<void>;

  @State() state: any;
  private service: any;

  componentWillLoad() {
    this.service = useMachine(dialog.machine, {
      id: 'dialog',
      open: this.open,
      getRootNode: () => this.el.shadowRoot,
      onOpenChange: details => {
        this.open = details.open;
        if (!details.open) {
          this.myClose.emit();
        }
      },
    });

    this.service.subscribe(state => {
      this.state = state;
    });

    this.service.start();
  }

  @Watch('open')
  handleOpenChange(newValue: boolean) {
    if (!this.service) return;
    const api = dialog.connect(this.service, normalizeProps);
    if (api.open !== newValue) {
      if (newValue) {
        api.setOpen(true);
      } else {
        api.setOpen(false);
      }
    }
  }

  disconnectedCallback() {
    this.service.stop();
  }

  render() {
    const api = dialog.connect(this.service, normalizeProps);

    return (
      <Host {...api.getRootProps()}>
        {api.open && (
          <div
            {...api.getBackdropProps()}
            class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          />
        )}
        {api.open && (
          <div class="fixed inset-0 z-50 flex items-center justify-center">
            <div
              {...api.getPositionerProps()}
              class="fixed z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
              {...api.getContentProps()}
            >
              <div class="flex flex-col gap-4">
                <slot></slot>
                <button
                  {...api.getCloseTriggerProps()}
                  class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                  <my-icon name="close" class="h-4 w-4" />
                  <span class="sr-only">Close</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Host>
    );
  }
}
