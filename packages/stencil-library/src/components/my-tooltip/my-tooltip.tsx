import { Component, Host, h, Prop, State, Element } from '@stencil/core';

@Component({
  tag: 'my-tooltip',
  styleUrl: 'my-tooltip.css',
  shadow: true,
})
export class MyTooltip {
  @Element() el: HTMLElement;

  @Prop() content: string;
  @Prop() placement: 'top' | 'right' | 'bottom' | 'left' = 'top';

  @State() visible: boolean = false;
  @State() actualPlacement: string = 'top';

  private show() {
    this.visible = true;
    this.calculatePosition();
  }

  private hide() {
    this.visible = false;
  }

  private calculatePosition() {
    requestAnimationFrame(() => {
      const tooltip = this.el.shadowRoot.querySelector('.tooltip-content') as HTMLElement;
      if (!tooltip) return;

      const rect = this.el.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const margin = 8;

      let top = 0;
      let left = 0;

      switch (this.placement) {
        case 'top':
          top = rect.top - tooltipRect.height - margin;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + margin;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.left - tooltipRect.width - margin;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.right + margin;
          break;
      }

      // Boundary checks (basic flipping if off-screen)
      if (top < 0 && this.placement === 'top') {
        top = rect.bottom + margin; // flip to bottom
      }
      if (left < 0 && this.placement === 'left') {
        left = rect.right + margin; // flip to right
      }
      if (left + tooltipRect.width > window.innerWidth && this.placement === 'right') {
        left = rect.left - tooltipRect.width - margin; // flip to left
      }
      // Note: Full collisions logic (like Popper.js) is more complex, this is a basic implementation as requested.

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    });
  }

  render() {
    return (
      <Host onMouseEnter={() => this.show()} onMouseLeave={() => this.hide()} onFocusin={() => this.show()} onFocusout={() => this.hide()}>
        <div class="relative inline-block">
          <slot></slot>

          <div
            class={{
              'tooltip-content fixed z-[9999] px-2 py-1 text-xs font-medium text-white bg-black rounded shadow-sm whitespace-nowrap transition-opacity duration-200 pointer-events-none': true,
              'opacity-0 invisible': !this.visible,
              'opacity-100 visible': this.visible,
            }}
            role="tooltip"
          >
            {this.content || <slot name="content"></slot>}
          </div>
        </div>
      </Host>
    );
  }
}
