import React from 'react';
import { LuCopy } from 'react-icons/lu';
import { Button } from '~/components/ui';
import { ButtonProps } from '~/components/ui/Button/Button';

interface CopyButtonProps extends ButtonProps {
  copyText: string;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ copyText, children, ...props }, ref) => {
    return (
      <Button
        variant="link"
        ref={ref}
        {...props}
        onClick={() => {
          navigator.clipboard.writeText(copyText);
        }}
      >
        {children}
        <LuCopy className="tw-ml-2 tw-h-4 tw-w-4" />
      </Button>
    );
  }
);
