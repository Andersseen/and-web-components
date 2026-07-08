import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva(
  [
    'relative w-full rounded-lg border p-t-gap',
    '[&>svg~*]:pl-t-gap-lg [&>svg+div]:translate-y-[-3px]',
    '[&>svg]:absolute [&>svg]:left-t-gap [&>svg]:top-t-gap [&>svg]:text-foreground',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        success: 'border-success/50 text-success dark:border-success [&>svg]:text-success',
        warning: 'border-warning/50 text-warning dark:border-warning [&>svg]:text-warning',
        info: 'border-info/50 text-info dark:border-info [&>svg]:text-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const dismissButtonClass = [
  'absolute right-t-gap top-t-gap rounded-sm opacity-70',
  'ring-offset-background transition-opacity',
  'hover:opacity-100',
  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
].join(' ');

export type AlertVariantProps = VariantProps<typeof alertVariants>;
