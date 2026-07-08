import { cva } from 'class-variance-authority';

export const controlVariants = cva('block w-full');

export const labelVariants = cva('block text-sm font-medium text-foreground mb-1.5');

export const requiredMarkVariants = cva('ml-0.5 text-destructive');

export const messageVariants = cva('mt-1.5 text-xs', {
  variants: {
    error: {
      true: 'text-destructive',
      false: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    error: false,
  },
});
