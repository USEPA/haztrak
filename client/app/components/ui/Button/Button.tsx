import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '~/lib/utils';

const buttonVariants = cva(
  'tw:text-md tw:inline-flex tw:items-center tw:justify-center tw:whitespace-nowrap tw:p-2 tw:font-medium tw:ring-offset-background tw:transition-colors tw:focus-visible:outline-hidden tw:focus-visible:ring-2 tw:focus-visible:ring-ring tw:focus-visible:ring-offset-2 tw:disabled:pointer-events-none tw:disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'tw:bg-primary tw:text-primary-foreground tw:hover:bg-primary/90',
        destructive: 'tw:bg-destructive tw:text-destructive-foreground tw:hover:bg-destructive/90',
        outline:
          'tw:border tw:border-input tw:bg-transparent tw:hover:bg-accent tw:hover:text-accent-foreground',
        secondary: 'tw:bg-secondary tw:text-secondary-foreground tw:hover:bg-secondary/90',
        ghost: 'tw:hover:bg-accent tw:hover:text-accent-foreground',
        link: 'tw:text-primary tw:underline-offset-4 tw:hover:underline',
      },
      size: {
        default: 'tw:h-10',
        sm: 'tw:h-9 tw:px-3',
        lg: 'tw:h-11 tw:px-8',
        icon: 'tw:size-10',
      },
      rounded: {
        false: 'tw:rounded-md',
        true: 'tw:rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
