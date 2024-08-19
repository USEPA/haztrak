import React, { ReactElement } from 'react';
import { Container } from 'react-bootstrap';
import { IconBaseProps } from 'react-icons';
import { FaGear } from 'react-icons/fa6';

interface HtSpinnerProps extends IconBaseProps {
  center?: boolean;
}

export function HtSpinner({ className, size, center, ...props }: HtSpinnerProps): ReactElement {
  const spinner = (
    <FaGear
      data-testid="spinner"
      className={`text-muted tw-bg-transparent ${className} tw-animate-spin`}
      size={size ?? 20}
      {...props}
    />
  );

  const centerWrapper = (children: ReactElement) => (
    <Container
      fluid={center}
      className={center ? 'd-flex justify-content-center align-items-center m-5' : ''}
    >
      {children}
    </Container>
  );

  return center ? centerWrapper(spinner) : spinner;
}
