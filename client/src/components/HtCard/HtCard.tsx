import React, { ReactElement } from 'react';
import { Card } from 'react-bootstrap';
import ErrorBoundary from '../ErrorBoundary';

interface Props {
  id?: string;
  children?: any;
  className?: string;
}

interface HeaderProps {
  id?: string;
  title?: string;
  children?: any;
}

interface SpinnerProps {
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
function HtCard(props: Props): ReactElement {
  return (
    <div id={props.id} className="my-3 shadow-lg bg-light rounded">
      {props.children}
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
HtCard.Header = function (props: HeaderProps): ReactElement {
  return (
    <Card.Header className="bg-primary text-light rounded-top">
      <div className="d-flex justify-content-between p-1 px-2 py-1">
        <div className="fw-bold h5">{props.title}</div>
        <div>{props.children}</div>
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
    <Card.Footer className="bg-gray">
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
  if (typeof props.className === undefined) {
    props.className = '';
  }
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
 * @constructor
 * @example
 * <HtCard.Body>
 *   <HtCard.Spinner message="loading..."/>
 * </HtCard.Body>
 */
HtCard.Spinner = function ({ message }: SpinnerProps): ReactElement {
  return (
    <>
      <h4 className="d-flex justify-content-center text-muted bg-transparent p-1 py-3">
        <i className="fa-solid fa-spin fa-circle-notch"></i>
        &nbsp;&nbsp;{message}
      </h4>
    </>
  );
};

export default HtCard;
