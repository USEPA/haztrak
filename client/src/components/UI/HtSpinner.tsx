import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import React, { ReactElement } from 'react';

interface HtSpinnerProps extends Omit<FontAwesomeIconProps, 'icon'> {
  className?: string;
}

export function HtSpinner({ className, size }: HtSpinnerProps): ReactElement {
  const defaultCLasses = 'text-muted bg-transparent';
  return (
    <>
      <FontAwesomeIcon
        icon={faGear}
        className={`${defaultCLasses} ${className}`}
        spin
        size={size ?? '2xl'}
      />
    </>
  );
}
