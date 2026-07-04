import { cva, type VariantProps } from 'class-variance-authority';

export const skeletonVariants = cva('animate-pulse bg-muted', {
  variants: {
    variant: {
      default: 'rounded-md',
      circle: 'rounded-full',
      text: 'rounded-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type SkeletonVariantProps = VariantProps<typeof skeletonVariants>;
