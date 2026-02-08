import { Component, Prop, h, Host } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border p-t-gap [&>svg~*]:pl-t-gap-lg [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-t-gap [&>svg]:top-t-gap [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

@Component({
  tag: 'my-alert',
  styleUrls: ['my-alert.css', '../../global/global.css'],
  shadow: true,
})
export class MyAlert {
  @Prop({ reflect: true }) variant: 'default' | 'destructive' = 'default';

  render() {
    return (
      <Host role="alert" class={cn(alertVariants({ variant: this.variant }))}>
        <slot name="icon"></slot>
        <div class="text-sm [&_p]:leading-relaxed">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
