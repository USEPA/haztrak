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
  const defaultCLasses = 'text-muted bg-transparent';
  return (
    <Container
      fluid
      className={center ? 'd-flex justify-content-center align-items-center m-5' : ''}
    >
      <FontAwesomeIcon
        icon={faGear}
        className={`${defaultCLasses} ${className}`}
        spin
        size={size ?? '6x'}
        {...props}
      />
    </Container>
  );
}
