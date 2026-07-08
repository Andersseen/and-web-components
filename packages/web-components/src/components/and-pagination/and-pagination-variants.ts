import { cva } from 'class-variance-authority';

export const pageButtonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-md text-sm font-medium',
    'transition-colors bg-transparent text-foreground border border-transparent cursor-pointer',
    'disabled:opacity-50 disabled:pointer-events-none',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'h-11 w-11 sm:h-10 sm:w-10',
  ].join(' '),
  {
    variants: {
      active: {
        true: 'bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground',
        false: '',
      },
      isNav: {
        true: 'w-auto px-3',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      isNav: false,
    },
  },
);
