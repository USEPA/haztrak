import React from 'react';
import { Button, ButtonProps } from 'react-bootstrap';

interface HtFloatingActionBtnProps extends ButtonProps {
  position?: 'bottom-left' | 'bottom-right';
  extended?: boolean;
  component?: any;
}

export function FloatingActionBtn({
  position,
  extended,
  children,
  className,
  component,
  ...props
}: HtFloatingActionBtnProps) {
  const positionClasses =
    position === undefined || position === 'bottom-right'
      ? 'position-fixed bottom-0 end-0 m-5'
      : 'position-fixed bottom-0 start-0 m-5';
  const defaultClasses = `p-3 rounded-5 shadow bg-gradient ${extended ? 'px-4' : ''}`;

  // This allows us to pass in an existing button component that will be turned into a floating action button
  if (component) {
    const childWithProps = React.cloneElement(component, {
      ...props,
      className: `${defaultClasses} ${className} ${component.props.className}`,
    });
    return <div className={positionClasses}>{childWithProps}</div>;
  }

  return (
    <div className={positionClasses}>
      <Button {...props} className={`${defaultClasses} ${className}`}>
        {children}
      </Button>
    </div>
  );
}
