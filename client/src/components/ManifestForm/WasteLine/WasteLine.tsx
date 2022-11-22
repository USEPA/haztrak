import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
}

function WasteLine({ show, handleClose }: Props) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Col>
          <Row>
            <Modal.Title>Add a Waste Line</Modal.Title>
          </Row>
          <Row>
            <i>
              <small>
                A waste line should be added to the uniform hazardous waste for
                each unique waste stream.
              </small>
            </i>
          </Row>
        </Col>
      </Modal.Header>
      {/*Todo: add WasteLineForm component to be added */}
      {/*  here (should include the modal body and footer)*/}
      <Modal.Body>
        <p>waste line form will go here</p>
      </Modal.Body>
    </Modal>
  );
}

export default WasteLine;
