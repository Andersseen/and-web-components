import { cva } from 'class-variance-authority';

export const menuListVariants = cva(['flex flex-col gap-0.5 p-1', 'rounded-md', 'text-foreground font-sans'].join(' '));

export const menuListItemVariants = cva(
  [
    'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
    'transition-colors duration-normal',
    'text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring',
  ].join(' '),
);
