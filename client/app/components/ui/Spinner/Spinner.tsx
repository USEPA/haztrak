import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { FaGear } from 'react-icons/fa6';
import { cn } from '~/lib/utils';

const spinnerVariants = cva('tw-flex-col tw-items-center tw-justify-center', {
  variants: {
    show: {
      true: 'tw-flex',
      false: 'tw-hidden',
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva('tw-text-reset tw-animate-spin', {
  variants: {
    size: {
      sm: 'tw-size-6',
      md: 'tw-size-8',
      lg: 'tw-size-24',
      xl: 'tw-size-32',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface SpinnerContentProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Spinner({ size, show, children, className }: SpinnerContentProps) {
  return (
    <span className={spinnerVariants({ show })}>
      <FaGear className={cn(loaderVariants({ size }), className)} />
      {children}
    </span>
  );
}
