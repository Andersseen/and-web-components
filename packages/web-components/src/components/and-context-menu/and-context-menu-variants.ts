import { cva } from 'class-variance-authority';

export const contextMenuPanelVariants = cva(
  [
    'absolute z-50 min-w-[8rem] overflow-hidden',
    'rounded-md border border-border',
    'bg-popover text-popover-foreground',
    'shadow-md',
    'transition-opacity duration-normal',
  ].join(' '),
);
