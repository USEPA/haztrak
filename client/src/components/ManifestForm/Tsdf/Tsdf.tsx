import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
}

function Tsdf({ show, handleClose }: Props) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Col>
          <Row>
            <Modal.Title>Designated Facility</Modal.Title>
          </Row>
          <Row>
            <i>
              <small>
                The Treatment, Storage, or Disposal Facility the waste will
                shipped to.
              </small>
            </i>
          </Row>
        </Col>
      </Modal.Header>
      {/*Todo: add TsdfForm component to be added */}
      {/*  here (should include the below modal body and footer)*/}
      <Modal.Body>
        <p>TSDF form will show here</p>
      </Modal.Body>
    </Modal>
  );
}

export default Tsdf;
