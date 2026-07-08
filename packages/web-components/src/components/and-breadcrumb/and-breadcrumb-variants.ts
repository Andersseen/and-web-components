import { cva, type VariantProps } from 'class-variance-authority';

export const breadcrumbVariants = cva('flex items-center text-muted-foreground font-sans', {
  variants: {
    size: {
      sm: 'text-xs gap-1',
      md: 'text-sm gap-1.5',
      lg: 'text-base gap-2',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type BreadcrumbVariantProps = VariantProps<typeof breadcrumbVariants>;
