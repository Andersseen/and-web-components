import { cva } from 'class-variance-authority';

export const tabsListVariants = cva(
  ['flex flex-row w-full h-10 items-center rounded-md', 'bg-muted p-1 text-muted-foreground'].join(' '),
);
