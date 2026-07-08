import { cva, type VariantProps } from 'class-variance-authority';

export const selectVariants = cva(
  [
    'inline-flex h-10 w-full items-center rounded-md border border-border bg-background',
    'px-3 py-2 pr-10 text-sm font-sans text-left text-foreground shadow-sm',
    'cursor-pointer',
    'transition-all duration-fast ring-offset-background',
    'hover:bg-accent/60 hover:text-accent-foreground',
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

export type SelectVariantProps = VariantProps<typeof selectVariants>;
