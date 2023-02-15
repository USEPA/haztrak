import React, { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

interface SpinnerProps {
  message?: string;
  className?: string;
}

function HtSpinner({ message, className }: SpinnerProps): ReactElement {
  return (
    <>
      <p
        className={`h4 d-flex justify-content-center text-muted bg-transparent p-1 py-3 ${className}`}
      >
        <FontAwesomeIcon icon={faCircleNotch} className="display-2" spin />
        &nbsp;&nbsp;{message}
      </p>
    </>
  );
}

export default HtSpinner;
