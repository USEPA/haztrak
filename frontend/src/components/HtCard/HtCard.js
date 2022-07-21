import React from 'react';
import { Card } from 'react-bootstrap';

function HtCard(props) {
  return <div className="m-5 shadow-lg">{props.children}</div>;
}

HtCard.Header = function (props) {
  return (
    <Card.Header className="bg-primary text-light">
      <div className="d-flex justify-content-between">
        <div className="fw-bold h5">{props.title}</div>
        <div>{props.children}</div>
      </div>
    </Card.Header>
  );
};

HtCard.Footer = function (props) {
  return (
    <Card.Footer className="bg-gray">
      <div className="d-flex justify-content-start gap-2">{props.children}</div>
    </Card.Footer>
  );
};

HtCard.Body = function (props) {
  return <Card.Body className="bg-light">{props.children}</Card.Body>;
};

HtCard.Spinner = function ({ message }) {
  return (
    <h4 className="d-flex justify-content-center text-muted">
      <i className="fa-solid fa-spin fa-circle-notch"></i>
      &nbsp;&nbsp;{message}
    </h4>
  );
};

export default HtCard;
