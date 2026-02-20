import { Component, Prop, h, Host, Event, EventEmitter, Watch, Listen } from '@stencil/core';
import { createDrawer, type DrawerPlacement } from '@andersseen/headless-core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'and-drawer',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyDrawer {
  /**
   * Whether the drawer is open.
   */
  @Prop({ reflect: true, mutable: true }) open: boolean = false;

  /**
   * The direction the drawer slides in from.
   */
  @Prop() placement: DrawerPlacement = 'left';

  /**
   * Emitted when the drawer is closed (backdrop click or close button).
   */
  @Event() myClose: EventEmitter<void>;

  private drawerLogic: any;

  componentWillLoad() {
    this.drawerLogic = createDrawer({
      defaultOpen: this.open,
      placement: this.placement,
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
      this.drawerLogic.actions.open();
      document.body.style.overflow = 'hidden';
    } else {
      this.drawerLogic.actions.close();
      document.body.style.overflow = '';
    }
  }

  @Watch('placement')
  placementHandler(newValue: DrawerPlacement) {
    this.drawerLogic.actions.setPlacement(newValue);
  }

  @Listen('keydown', { target: 'window' })
  handleKeyDown(ev: KeyboardEvent) {
    this.drawerLogic.handleKeyDown(ev);
  }

  render() {
    const overlayProps = this.drawerLogic.getOverlayProps();
    const contentProps = this.drawerLogic.getContentProps();
    const closeButtonProps = this.drawerLogic.getCloseButtonProps();

    const placementClasses = {
      left: 'top-0 left-0 bottom-0 w-[85vw] sm:w-80 border-r border-border -translate-x-full',
      right: 'top-0 right-0 bottom-0 w-[85vw] sm:w-80 border-l border-border translate-x-full',
      top: 'top-0 left-0 right-0 h-auto max-h-[50%] border-b border-border -translate-y-full',
      bottom: 'bottom-0 left-0 right-0 h-auto max-h-[50%] border-t border-border translate-y-full',
    };

    return (
      <Host style={{ display: 'contents' }}>
        <div
          class={cn(
            'fixed inset-0 z-50 bg-foreground/80 opacity-0 pointer-events-none transition-opacity duration-300',
            this.open ? 'opacity-100 pointer-events-auto' : '',
          )}
          {...overlayProps}
          onClick={() => this.drawerLogic.handleOverlayClick()}
        />
        <div
          class={cn(
            'fixed z-50 bg-background p-6 shadow-xl transition-transform duration-300 ease-in-out',
            placementClasses[this.placement],
            this.open ? 'translate-x-0 translate-y-0' : '',
          )}
          {...contentProps}
        >
          <div class="flex flex-col gap-1.5 text-center sm:text-left">
            <slot name="header"></slot>
          </div>
          <button
            class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            onClick={() => this.drawerLogic.actions.close()}
            {...closeButtonProps}
          >
            <and-icon name="close" class="h-4 w-4" />
            <span class="sr-only">Close</span>
          </button>
          <div class="mt-4">
            <slot></slot>
          </div>
          <div class="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2">
            <slot name="footer"></slot>
          </div>
        </div>
      </Host>
    );
  }
}
