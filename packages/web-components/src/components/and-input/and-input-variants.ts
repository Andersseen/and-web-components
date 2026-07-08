import { cva, type VariantProps } from 'class-variance-authority';

export const inputVariants = cva(
  [
    'flex h-11 sm:h-10 w-full rounded-md border border-input bg-background',
    'px-3 py-2 text-sm font-sans shadow-sm',
    'transition-all duration-fast ring-offset-background',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      hasError: {
        true: 'border-destructive focus-visible:ring-destructive',
        false: '',
      },
    },
    defaultVariants: {
      hasError: false,
    },
  },
);

export type InputVariantProps = VariantProps<typeof inputVariants>;
