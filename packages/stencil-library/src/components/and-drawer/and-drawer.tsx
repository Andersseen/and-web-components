import { Component, Prop, h, Host, Event, EventEmitter, Watch, Listen } from '@stencil/core';
import { createDrawer, type DrawerPlacement } from '@andersseen/headless-core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'and-drawer',
  styleUrls: ['and-drawer.css', '../../global/global.css'],
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

    return (
      <Host>
        <div class={cn('drawer-backdrop', this.open ? 'open' : '')} {...overlayProps} onClick={() => this.drawerLogic.handleOverlayClick()} />
        <div class={cn('drawer-content', `drawer-${this.placement}`, this.open ? 'open' : '')} {...contentProps}>
          <div class="drawer-header">
            <slot name="header"></slot>
          </div>
          <button class="drawer-close" onClick={() => this.drawerLogic.actions.close()} {...closeButtonProps}>
            <and-icon name="close" class="h-4 w-4" />
            <span class="sr-only">Close</span>
          </button>
          <div class="mt-4">
            <slot></slot>
          </div>
          <div class="drawer-footer mt-4">
            <slot name="footer"></slot>
          </div>
        </div>
      </Host>
    );
  }
}
