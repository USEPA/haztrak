import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as React from 'react';

import { cn } from '~/lib/utils';

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'tw-shrink-0 tw-bg-border',
      orientation === 'horizontal' ? 'tw-h-[1px] tw-w-full' : 'tw-h-full tw-w-[1px]',
      className
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
