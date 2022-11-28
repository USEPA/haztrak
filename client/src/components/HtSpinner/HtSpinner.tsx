import React, { ReactElement } from 'react';

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
        <i className="fa-solid display-2 fa-spin fa-circle-notch"></i>
        &nbsp;&nbsp;{message}
      </p>
    </>
  );
}

export default HtSpinner;
