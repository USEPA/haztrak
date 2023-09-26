import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement } from 'react';

interface SpinnerProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'lg' | 'xs' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x';
}

export function HtSpinner({ message, className, size }: SpinnerProps): ReactElement {
  return (
    <>
      <p className={`h4 d-flex justify-content-center text-muted bg-transparent p-1 py-3 `}>
        <FontAwesomeIcon icon={faGear} className={`${className}`} spin size={size ?? '2xl'} />
        <span className="sr-only">{message ? message : 'Loading...'}</span>
      </p>
    </>
  );
}
