import { cva } from 'class-variance-authority';

export const tabsContentVariants = cva(
  ['mt-2', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'].join(' '),
);
