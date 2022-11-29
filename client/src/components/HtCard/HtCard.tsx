import React, { ReactElement, ReactNode } from 'react';
import { Card } from 'react-bootstrap';
import ErrorBoundary from '../ErrorBoundary';
import HtSpinner from '../HtSpinner';

interface Props {
  id?: string;
  children?: ReactNode;
  className?: string;
}

interface HeaderProps extends Props {
  title?: string;
}

interface SpinnerProps extends Props {
  message?: string;
}

/**
 * Card with haztrak styling, yeah baby
 * @param {{children: ReactElement }} props react props
 * @constructor
 * @example
 * <HtCard>
 *   <HtCard.Header title="Card Title!">{top right dropdown button}<HtCard.Header>
 *   <HtCard.Body>Hello World!<HtCard.Body>
 *   <HtCard.Footer>submit button here<HtCard.Footer>
 * </HtCard>
 */
function HtCard({ id, children, className }: Props): ReactElement {
  return (
    <div id={id} className={`my-3 shadow-lg bg-light rounded ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card header with Haztrak styling
 * @param {{title: String, children: ReactElement}} props react props
 * @constructor
 * @example
 * <HtCard>
 *   <HtCard.Header title="Card Title!">{top right dropdown button}<HtCard.Header>
 * </HtCard>
 */
HtCard.Header = function ({
  children,
  className,
  title,
}: HeaderProps): ReactElement {
  return (
    <Card.Header className={`bg-primary text-light rounded-top ${className}`}>
      <div className="d-flex justify-content-between p-1 px-2 py-1">
        <div className="fw-bold h5">{title}</div>
        <div>{children}</div>
      </div>
    </Card.Header>
  );
};

/**
 * Card footer with Haztrak styling
 * @param {{children: ReactElement}} props react props
 * @constructor
 * @example
 * <HtCard>
 *   <HtCard.Footer>Put button here!<HtCard.Footer>
 * </HtCard>
 */
HtCard.Footer = function (props: Props): ReactElement {
  return (
    <Card.Footer className={`bg-gray ${props.className}`}>
      <div className="d-flex justify-content-start gap-2">{props.children}</div>
    </Card.Footer>
  );
};

/**
 * Card body with Haztrak styling
 * @param {{children: ReactElement}} props react props
 * @constructor
 * @example
 * <HtCard>
 *   <HtCard.Body>Hello World!<HtCard.Body>
 * </HtCard>
 */
HtCard.Body = function (props: Props): ReactElement {
  // if (typeof props.className === undefined) {
  //   props.className = '';
  // }
  return (
    <Card.Body className={props.className ? `${props.className}` : ''}>
      <ErrorBoundary>
        <div className="p-3">{props.children}</div>
      </ErrorBoundary>
    </Card.Body>
  );
};

/**
 * Card spinner to use while asynchronous promise is in pending state
 * @param {{message: String}} message string to render next to spinner
 * @param {{classname: String}} string class attributes to pass
 * @constructor
 * @example
 * <HtCard.Body>
 *   <HtCard.Spinner message="loading..."/>
 * </HtCard.Body>
 */
HtCard.Spinner = function ({ message, className }: SpinnerProps): ReactElement {
  return <HtSpinner message={message} className={className} />;
};

export default HtCard;
