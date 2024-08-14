import React from 'react';
import { Button, ButtonProps } from 'react-bootstrap';

interface HtButtonProps extends ButtonProps {
  horizontalAlign?: 'start' | 'center' | 'end' | boolean;
}

/** HazTrak button, simple button wrapper with some syntactic sugar.*/
export function HtButton({ horizontalAlign, ...props }: HtButtonProps) {
  const defaultWrapperClasses = horizontalAlign
    ? horizontalAlign === true
      ? `text-center`
      : `text-${horizontalAlign}`
    : '';
  return (
    <div className={defaultWrapperClasses}>
      <Button {...props}>{props.children}</Button>
    </div>
  );
}
