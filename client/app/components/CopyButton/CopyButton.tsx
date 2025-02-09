import React from 'react';
import { LuCopy } from 'react-icons/lu';
import { Button } from '~/components/ui';
import { ButtonProps } from '~/components/ui/Button/Button';
import { addAlert, useAppDispatch } from '~/store';

interface CopyButtonProps extends ButtonProps {
  copyText: string;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ copyText, children, ...props }, ref) => {
    const dispatch = useAppDispatch();

    const onClick = () => {
      navigator.clipboard.writeText(copyText);
      dispatch(
        addAlert({
          message: 'Copied to clipboard',
          type: 'success',
          id: `copy-success-${copyText}`,
        })
      );
    };

    return (
      <Button variant="link" ref={ref} {...props} onClick={onClick}>
        {children}
        <LuCopy className="tw-ml-2 tw-size-4" />
      </Button>
    );
  }
);
