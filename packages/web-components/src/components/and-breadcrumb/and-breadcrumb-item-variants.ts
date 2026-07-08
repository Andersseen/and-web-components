import { cva, type VariantProps } from 'class-variance-authority';

export const breadcrumbItemVariants = cva('inline-flex items-center font-sans transition-colors', {
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

export const separatorSizeMap: Record<string, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export type BreadcrumbItemVariantProps = VariantProps<typeof breadcrumbItemVariants>;
