import { Component, Prop, h, Host, Event, EventEmitter, Listen } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-modal',
  styleUrls: ['my-modal.css', '../../global/global.css'],
  shadow: true,
})
export class MyModal {
  @Prop({ reflect: true, mutable: true }) open: boolean = false;
  @Event() myClose: EventEmitter<void>;

  @Listen('keydown', { target: 'window' })
  handleKeyDown(ev: KeyboardEvent) {
    if (this.open && ev.key === 'Escape') {
      this.close();
    }
  }

  close() {
    this.myClose.emit();
    this.open = false;
  }

  render() {
    if (!this.open) return <Host />;

    return (
      <Host>
        {/* Backdrop */}
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => this.close()} />

        {/* Modal Container */}
        <div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            class={cn(
              'fixed z-50 grid w-full max-w-lg gap-t-gap border bg-background p-t-gap-lg shadow-lg pointer-events-auto',
              'animate-in fade-in zoom-in-95 duration-200',
              'sm:rounded-lg',
            )}
          >
            <div class="flex flex-col gap-t-gap">
              <slot></slot>
              <button
                class="absolute right-t-gap top-t-gap rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                onClick={() => this.close()}
              >
                <my-icon name="close" class="h-4 w-4" />
                <span class="sr-only">Close</span>
              </button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
