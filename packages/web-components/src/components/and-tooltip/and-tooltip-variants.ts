import { cva } from 'class-variance-authority';

export const tooltipVariants = cva(
  [
    'and-tooltip absolute z-50 overflow-hidden rounded-md border border-border',
    'bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md whitespace-nowrap',
  ].join(' '),
  {
    variants: {
      placement: {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
      },
      visible: {
        true: 'opacity-100 visible',
        false: 'opacity-0 invisible pointer-events-none',
      },
    },
    defaultVariants: {
      placement: 'top',
      visible: false,
    },
  },
);
