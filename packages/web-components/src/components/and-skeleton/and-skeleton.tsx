import { Component, Prop, h, Host } from '@stencil/core';

import { cn } from '../../utils/cn';
import { skeletonVariants, type SkeletonVariantProps } from './and-skeleton-variants';

@Component({
  tag: 'and-skeleton',
  styleUrls: ['and-skeleton.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndSkeleton {
  /** Visual shape of the skeleton. */
  @Prop({ reflect: true }) variant: SkeletonVariantProps['variant'] = 'default';

  /** CSS width (e.g. `100px`, `100%`). */
  @Prop({ reflect: true }) width: string = '100%';

  /** CSS height (e.g. `16px`, `1rem`). */
  @Prop({ reflect: true }) height: string = '16px';

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string;

  render() {
    return (
      <Host
        class={cn(skeletonVariants({ variant: this.variant }), this.customClass)}
        style={{ width: this.width, height: this.height }}
        aria-busy="true"
        aria-label="Loading"
      />
    );
  }
}
