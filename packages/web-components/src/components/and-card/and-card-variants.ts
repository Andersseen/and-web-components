import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-md transition-shadow duration-normal',
  {
    variants: {
      variant: {
        default: 'border-border',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive',
        elevated: 'shadow-lg border-border',
        outline: 'shadow-none border-border',
        ghost: 'border-transparent shadow-none',
      },
      padded: {
        true: 'p-4 sm:p-6',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padded: false,
    },
  },
);

export type CardVariantProps = VariantProps<typeof cardVariants>;
