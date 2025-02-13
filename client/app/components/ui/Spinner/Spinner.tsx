import { VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';
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
  asChild?: boolean;
}

type SpinnerElement = React.ElementRef<'span'>;

const Spinner = React.forwardRef<SpinnerElement, SpinnerContentProps>(
  ({ size, show, children, className, asChild, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(spinnerVariants({ show }), className)} {...props}>
        {asChild && children ? (
          React.cloneElement(children as React.ReactElement, {
            className: cn(loaderVariants({ size }), children),
          })
        ) : (
          <>
            <FaGear className={cn(loaderVariants({ size }), className)} data-testid="spinner" />
            {children}
          </>
        )}
      </span>
    );
  }
);

Spinner.displayName = 'Spinner';

export { Spinner };
