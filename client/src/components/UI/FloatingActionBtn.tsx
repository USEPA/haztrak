import React from 'react';
import { Button, ButtonProps } from 'react-bootstrap';

interface HtFloatingActionBtnProps extends ButtonProps {
  position?: 'bottom-left' | 'bottom-right';
  extended?: boolean;
}

export function FloatingActionBtn({
  position,
  extended,
  children,
  className,
  ...props
}: HtFloatingActionBtnProps) {
  const positionClasses =
    position === undefined || position === 'bottom-right'
      ? 'position-fixed bottom-0 end-0 m-5'
      : 'position-fixed bottom-0 start-0 m-5';
  const defaultClasses = `p-2 rounded-5 ${extended ? 'px-4' : ''}`;
  return (
    <div className={positionClasses}>
      <Button {...props} className={`${defaultClasses} ${className}`}>
        {children}
      </Button>
    </div>
  );
}
