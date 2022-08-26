import React from 'react';
import { Card, Container } from 'react-bootstrap';

interface props {
  children?: any;
}

interface headerProps {
  title?: string;
  children?: any;
}

interface spinnerProps {
  message?: string;
}

/**
 * Card with haztrak styling, yeah baby
 * @param {{children: JSX.Element}} props react props
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <HtCard>
 *   <HtCard.Header title="Card Title!">{top right dropdown button}<HtCard.Header>
 *   <HtCard.Body>Hello World!<HtCard.Body>
 *   <HtCard.Footer>submit button here<HtCard.Footer>
 * </HtCard>
 */
function HtCard(props: props) {
  return (
    <div className="m-5 my-3 shadow-lg bg-light rounded-2">
      {props.children}
    </div>
  );
}

/**
 * Card header with Haztrak styling
 * @param {{title: String, children: JSX.Element}} props react props
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <HtCard>
 *   <HtCard.Header title="Card Title!">{top right dropdown button}<HtCard.Header>
 * </HtCard>
 */
HtCard.Header = function (props: headerProps) {
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
 * @param {{children: JSX.Element}} props react props
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <HtCard>
 *   <HtCard.Footer>Put button here!<HtCard.Footer>
 * </HtCard>
 */
HtCard.Footer = function (props: props) {
  return (
    <Card.Footer className="bg-gray">
      <div className="d-flex justify-content-start gap-2">{props.children}</div>
    </Card.Footer>
  );
};

/**
 * Card body with Haztrak styling
 * @param {{children: JSX.Element}} props react props
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <HtCard>
 *   <HtCard.Body>Hello World!<HtCard.Body>
 * </HtCard>
 */
HtCard.Body = function (props: props) {
  return (
    <Card.Body className="bg-light">
      <Container className="py-2">{props.children}</Container>
    </Card.Body>
  );
};

/**
 * Card spinner to use while asynchronous promise is in pending state
 * @param {{message: String}} message string to render next to spinner
 * @returns {JSX.Element}
 * @constructor
 * @example
 * <HtCard.Body>
 *   <HtCard.Spinner message="loading..."/>
 * </HtCard.Body>
 */
HtCard.Spinner = function ({ message }: spinnerProps) {
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
