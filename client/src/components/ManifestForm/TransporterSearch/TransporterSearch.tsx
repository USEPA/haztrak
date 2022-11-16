import React from 'react';
import TransporterSearchForm from './TransporterSearchForm';
import { Modal, Row, Col } from 'react-bootstrap';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
}

function TransporterSearch({ handleClose, show }: Props) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Col>
          <Row>
            <Modal.Title>Transporter Search</Modal.Title>
          </Row>
          <Row>
            <i>
              <small>
                Type at least three characters to search for known Transporters
              </small>
            </i>
          </Row>
        </Col>
      </Modal.Header>
      <TransporterSearchForm />
    </Modal>
  );
}

export default TransporterSearch;
