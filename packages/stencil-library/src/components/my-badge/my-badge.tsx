import { Component, Prop, h, Host } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

@Component({
  tag: 'my-badge',
  styleUrls: ['my-badge.css', '../../global/global.css'],
  shadow: true,
})
export class MyBadge {
  @Prop({ reflect: true }) variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';

  render() {
    return (
      <Host class={cn(badgeVariants({ variant: this.variant }))}>
        <slot></slot>
      </Host>
    );
  }
}
