import { cva } from 'class-variance-authority';

export const overlayVariants = cva('and-modal-backdrop fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm');

export const contentVariants = cva(
  [
    'and-modal-content relative z-50 grid w-full max-w-lg gap-4 border border-border bg-background p-6 shadow-lg pointer-events-auto',
    'rounded-lg',
  ].join(' '),
);

export const closeButtonVariants = cva(
  [
    'absolute right-4 top-4 rounded-sm opacity-70',
    'ring-offset-background transition-opacity',
    'hover:opacity-100',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    'disabled:pointer-events-none',
  ].join(' '),
);
