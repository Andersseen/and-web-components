import { Component, h, Host, Prop } from '@stencil/core';

/**
 * One slide inside an `and-carousel`. Must be a direct child — the parent
 * counts `and-carousel-item` children on load to size the track.
 *
 * @example
 * ```html
 * <and-carousel-item label="Slide 1">Content</and-carousel-item>
 * ```
 */
@Component({
  tag: 'and-carousel-item',
  styleUrl: '../../global/component-base.css',
  shadow: true,
})
export class AndCarouselItem {
  /** Accessible label announced for this slide (e.g. "Slide 1 of 3" context). */
  @Prop() label: string = '';

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
