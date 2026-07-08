import { cva, type VariantProps } from 'class-variance-authority';
import type { DropdownPlacement } from './and-dropdown';

export const dropdownTriggerVariants = cva(
  [
    'inline-flex w-full items-center justify-between gap-x-2',
    'rounded-md px-3 py-3 sm:py-2 text-sm font-medium shadow-sm',
    'ring-1 ring-inset transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground ring-border hover:bg-accent',
        primary: 'bg-primary text-primary-foreground ring-primary hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground ring-secondary hover:bg-secondary/80',
        ghost: 'bg-transparent text-foreground ring-transparent hover:bg-accent',
        outline: 'border border-border bg-background text-foreground hover:bg-accent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const menuClass = [
  'absolute z-50 min-w-[8rem]',
  'overflow-hidden rounded-md border border-border',
  'bg-popover p-1 shadow-md transition-opacity',
].join(' ');

export const menuPlacementClass: Record<DropdownPlacement, string> = {
  bottom: 'left-0 top-full mt-2 origin-top-left',
  top: 'left-0 bottom-full mb-2 origin-bottom-left',
  left: 'right-full top-0 mr-2 origin-right',
  right: 'left-full top-0 ml-2 origin-left',
};

export const menuItemClass = [
  'relative flex w-full cursor-pointer select-none items-center rounded-sm text-sm',
  'outline-none transition-colors px-3 py-3 sm:py-1.5',
  'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
].join(' ');

export type DropdownVariantProps = VariantProps<typeof dropdownTriggerVariants>;
