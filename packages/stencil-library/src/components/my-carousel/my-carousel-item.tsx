import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'my-carousel-item',
  styleUrl: '../../global/global.css', // Should inherit global styles or define its own
  shadow: true,
})
export class MyCarouselItem {
  render() {
    return (
      <Host style={{ display: 'block', flexShrink: '0', width: '100%' }}>
        <slot></slot>
      </Host>
    );
  }
}
