import { Component, Host, h, Prop } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/utils';

const stackVariants = cva('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
});

@Component({
  tag: 'my-stack',
  styleUrls: ['my-stack.css', '../../global/global.css'],
  shadow: true,
})
export class MyStack {
  /**
   * The direction of the stack.
   */
  @Prop() direction: 'row' | 'column' | 'row-reverse' | 'column-reverse' = 'column';

  /**
   * The gap between items.
   */
  @Prop() gap: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

  /**
   * How items are aligned along the cross axis.
   */
  @Prop() align: 'start' | 'center' | 'end' | 'stretch' | 'baseline' = 'stretch';

  /**
   * How items are justified along the main axis.
   */
  @Prop() justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' = 'start';

  /**
   * Whether items should wrap to the next line.
   */
  @Prop() wrap: boolean = false;

  render() {
    return (
      <Host
        class={cn(
          stackVariants({
            direction: this.direction,
            gap: this.gap,
            align: this.align,
            justify: this.justify,
            wrap: this.wrap,
          }),
        )}
      >
        <slot></slot>
      </Host>
    );
  }
}
