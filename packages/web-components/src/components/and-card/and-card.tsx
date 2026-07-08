import { Component, Host, h, Prop } from '@stencil/core';
import { cn } from '../../utils/cn';
import { cardVariants, type CardVariantProps } from './and-card-variants';

/**
 * Generic content container. Purely presentational — compose it with
 * `and-card-header`, `and-card-title`, `and-card-description`,
 * `and-card-content`, and `and-card-footer` for the standard layout, or
 * use it alone with `padded="true"` for simple content.
 *
 * @example
 * ```html
 * <and-card>
 *   <and-card-header>
 *     <and-card-title>Title</and-card-title>
 *     <and-card-description>Supporting text</and-card-description>
 *   </and-card-header>
 *   <and-card-content>Body content</and-card-content>
 * </and-card>
 * ```
 */
@Component({
  tag: 'and-card',
  styleUrls: ['and-card.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndCard {
  /** Visual variant of the card. */
  @Prop({ reflect: true }) variant: CardVariantProps['variant'] = 'default';

  /**
   * Add built-in padding to the card.
   * Use `true` for simple content without sub-components.
   * Defaults to `false` so sub-components (header/content/footer) manage their own spacing.
   */
  @Prop({ reflect: true }) padded: boolean = false;

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string = '';

  render() {
    return (
      <Host class={cn(cardVariants({ variant: this.variant, padded: this.padded }), this.customClass)}>
        <slot />
      </Host>
    );
  }
}
