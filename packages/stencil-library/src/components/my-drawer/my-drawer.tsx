import { Component, Prop, h, Host, Event, EventEmitter, Watch } from '@stencil/core';
import { cn } from '../../utils/utils';

export type DrawerPlacement = 'top' | 'bottom' | 'left' | 'right';

@Component({
  tag: 'my-drawer',
  styleUrls: ['my-drawer.css', '../../global/global.css'],
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

  @Watch('open')
  openHandler(newValue: boolean) {
    if (newValue) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  private handleBackdropClick = () => {
    this.open = false;
    this.myClose.emit();
  };

  private handleCloseClick = () => {
    this.open = false;
    this.myClose.emit();
  };

  render() {
    return (
      <Host>
        <div class={cn('drawer-backdrop', this.open ? 'open' : '')} onClick={this.handleBackdropClick} />
        <div class={cn('drawer-content', `drawer-${this.placement}`, this.open ? 'open' : '')}>
          <div class="drawer-header">
            <slot name="header"></slot>
          </div>
          <button class="drawer-close" onClick={this.handleCloseClick}>
            <my-icon name="close" class="h-4 w-4" />
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
