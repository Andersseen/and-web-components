import { Component, Host, h, Prop } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/utils';

const cardVariants = cva('rounded-xl border bg-card text-card-foreground shadow p-6', {
  variants: {
    variant: {
      default: '',
      destructive: 'border-destructive/50 text-destructive dark:border-destructive',
      elevated: 'shadow-lg bg-card',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

@Component({
  tag: 'my-card',
  styleUrls: ['my-card.css', '../../global/global.css'],
  shadow: true,
})
export class MyCard {
  @Prop() variant: 'default' | 'destructive' = 'default';
  render() {
    return (
      <Host class={cn(cardVariants({ variant: this.variant }))}>
        <slot></slot>
      </Host>
    );
  }
}
