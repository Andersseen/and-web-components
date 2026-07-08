import { cva, type VariantProps } from 'class-variance-authority';

export const codeBlockVariants = cva(
  [
    'relative overflow-x-auto rounded-lg border font-mono text-sm',
    'flex items-start gap-t-gap-sm',
    'border-border bg-muted text-foreground',
  ].join(' '),
);

export const copyButtonVariants = cva(
  [
    'absolute right-t-gap-sm top-t-gap-sm rounded p-1 transition-colors',
    'hover:bg-foreground/10 text-foreground',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  ].join(' '),
);

export const promptVariants = cva('select-none opacity-60 text-muted-foreground');

export type CodeBlockVariantProps = VariantProps<typeof codeBlockVariants>;
