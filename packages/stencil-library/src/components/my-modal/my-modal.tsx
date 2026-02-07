import { Component, Prop, h, Host, Watch, Event, EventEmitter, Element } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-modal',
  styleUrls: ['my-modal.css', '../../global/global.css'],
  shadow: true,
})
export class MyModal {
  @Element() el: HTMLElement;

  /**
   * Whether the modal is open.
   */
  @Prop({ reflect: true, mutable: true }) open: boolean = false;

  @Event() myClose: EventEmitter<void>;

  private dialog: HTMLDialogElement;

  componentDidLoad() {
    if (this.open) {
      this.dialog?.showModal();
    }
  }

  @Watch('open')
  openHandler(newValue: boolean) {
    if (newValue) {
      this.dialog?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      this.dialog?.close();
      document.body.style.overflow = '';
    }
  }

  handleDialogClick = (e: MouseEvent) => {
    // Close if clicked on backdrop (target is the dialog element itself)
    if (e.target === this.dialog) {
      this.closeModal();
    }
  };

  closeModal = () => {
    this.open = false;
    this.myClose.emit();
  };

  render() {
    return (
      <Host>
        <dialog
          ref={el => (this.dialog = el as HTMLDialogElement)}
          class={cn(
            'bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full max-w-lg',
            'backdrop:bg-black/80 backdrop:backdrop-blur-sm',
            'open:animate-in open:fade-in-0 open:zoom-in-95',
            'closed:animate-out closed:fade-out-0 closed:zoom-out-95',
          )}
          onClick={this.handleDialogClick}
        >
          <div class="flex flex-col gap-4">
            <slot></slot>
            <button
              onClick={this.closeModal}
              class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <my-icon name="close" class="h-4 w-4" />
              <span class="sr-only">Close</span>
            </button>
          </div>
        </dialog>
      </Host>
    );
  }
}
