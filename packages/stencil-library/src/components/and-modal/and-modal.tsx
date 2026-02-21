import { Component, Prop, h, Host, Event, EventEmitter, Listen, Watch } from '@stencil/core';
import { createModal } from '@andersseen/headless-components';
import { cn } from '../../utils/utils';

@Component({
  tag: 'and-modal',
  styleUrls: ['and-modal.css', '../../global/global.css'],
  shadow: true,
})
export class MyModal {
  @Prop({ reflect: true, mutable: true }) open: boolean = false;
  @Event() myClose: EventEmitter<void>;

  private modalLogic: any; // Using any temporarily to avoid type issues if types aren't perfectly exported yet, but ideally should be ModalReturn

  componentWillLoad() {
    this.modalLogic = createModal({
      defaultOpen: this.open,
      onOpenChange: isOpen => {
        this.open = isOpen;
        if (!isOpen) {
          this.myClose.emit();
        }
      },
    });
  }

  @Watch('open')
  openHandler(newValue: boolean) {
    if (newValue) {
      this.modalLogic.actions.open();
    } else {
      this.modalLogic.actions.close();
    }
  }

  @Listen('keydown', { target: 'window' })
  handleKeyDown(ev: KeyboardEvent) {
    this.modalLogic.handleKeyDown(ev);
  }

  render() {
    if (!this.open) return <Host />;

    const overlayProps = this.modalLogic.getOverlayProps();
    const contentProps = this.modalLogic.getContentProps();
    const closeButtonProps = this.modalLogic.getCloseButtonProps();

    return (
      <Host>
        {/* Backdrop */}
        <div class="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm animate-in fade-in duration-200" {...overlayProps} onClick={() => this.modalLogic.handleOverlayClick()} />

        {/* Modal Container */}
        <div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
          <div
            class={cn(
              'relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg pointer-events-auto',
              'animate-in fade-in zoom-in-95 duration-200',
              'rounded-lg',
            )}
            {...contentProps}
          >
            <div class="flex flex-col gap-4">
              <slot></slot>
              <button
                class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                onClick={() => this.modalLogic.actions.close()}
                {...closeButtonProps}
              >
                <and-icon name="close" class="h-4 w-4" />
                <span class="sr-only">Close</span>
              </button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
