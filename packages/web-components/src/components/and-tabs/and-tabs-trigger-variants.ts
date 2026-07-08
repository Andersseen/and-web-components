import { cva } from 'class-variance-authority';

export const tabsTriggerVariants = cva(
  [
    'flex flex-1 items-center justify-center rounded-sm text-sm font-medium',
    'transition-all cursor-pointer ring-offset-background',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'px-4 py-3 sm:px-3 sm:py-1.5',
  ].join(' '),
);
