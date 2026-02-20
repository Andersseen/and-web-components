import { Component, Host, h, Prop } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/utils';

const cardVariants = cva('rounded-lg border bg-card text-card-foreground shadow-md transition-shadow duration-normal p-t-gap', {
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
  tag: 'and-card',
  styleUrls: ['and-card.css', '../../global/global.css'],
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
