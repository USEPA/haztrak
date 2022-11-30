import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import WasteLineForm from './WasteLineForm';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
}

function WasteLine({ show, handleClose }: Props) {
  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
      <Modal.Header closeButton>
        <Col>
          <Row>
            <Modal.Title>Add Waste Line</Modal.Title>
          </Row>
          <Row>
            <i>
              <small>
                A waste line should be added for each unique waste stream.
              </small>
            </i>
          </Row>
        </Col>
      </Modal.Header>
      <Modal.Body>
        <WasteLineForm />
      </Modal.Body>
    </Modal>
  );
}

export default WasteLine;
