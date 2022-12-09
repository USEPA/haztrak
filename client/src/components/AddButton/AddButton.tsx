import React from 'react';
import { Button, ButtonProps, Col, Row } from 'react-bootstrap';

/**
 * This little helper just adds a centered button that executes what function you pass.
 * I just got sick of the repetition because I have this button in a lot of places
 * @constructor
 */
function AddButton({ children, onClick }: ButtonProps) {
  return (
    <Row className="d-flex justify-content-center px-5">
      <Col className="text-center">
        <Button variant="success" onClick={onClick}>
          {children}
        </Button>
      </Col>
    </Row>
  );
}

export default AddButton;
