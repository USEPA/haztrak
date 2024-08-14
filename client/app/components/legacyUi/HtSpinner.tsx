import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import React, { ReactElement } from 'react';
import { Container } from 'react-bootstrap';

interface HtSpinnerProps extends Omit<FontAwesomeIconProps, 'icon'> {
  center?: boolean;
  icon?: IconProp;
}

export function HtSpinner({ className, size, center, ...props }: HtSpinnerProps): ReactElement {
  const defaultCLasses = 'bg-transparent text-muted';

  const spinner = (
    <FontAwesomeIcon
      icon={faGear}
      className={`${defaultCLasses} ${className}`}
      spin
      size={size ?? '6x'}
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
