import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'and-carousel-item',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class AndCarouselItem {
  /** Accessible label for this slide. */
  @Prop() label: string;

  render() {
    return (
      <Host
        role="group"
        aria-roledescription="slide"
        aria-label={this.label}
        style={{ display: 'block', flexShrink: '0', width: '100%' }}
      >
        <slot />
      </Host>
    );
  }
}
