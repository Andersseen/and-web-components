import { cva } from 'class-variance-authority';
import type { ToastPosition } from '@andersseen/headless-components';

export const toastVariants = cva(
  [
    'pointer-events-auto flex w-full max-w-md items-center justify-between',
    'space-x-t-gap overflow-hidden rounded-md border p-t-gap shadow-lg transition-all',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive: 'bg-destructive text-destructive-foreground border-destructive',
        success: 'bg-background text-foreground border-success',
        error: 'bg-destructive text-destructive-foreground border-destructive',
        info: 'bg-background text-foreground border-info',
        warning: 'bg-background text-foreground border-warning',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const dismissButtonVariants = cva(
  [
    'ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center',
    'rounded-md p-0.5 opacity-50 transition-opacity',
    'hover:opacity-100',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  ].join(' '),
);

export const positionClasses: Record<ToastPosition, string> = {
  'top-right': 'top-t-gap right-t-gap items-end',
  'top-left': 'top-t-gap left-t-gap items-start',
  'bottom-right': 'bottom-t-gap right-t-gap items-end',
  'bottom-left': 'bottom-t-gap left-t-gap items-start',
  'top-center': 'top-t-gap left-1/2 -translate-x-1/2 items-center',
  'bottom-center': 'bottom-t-gap left-1/2 -translate-x-1/2 items-center',
};
