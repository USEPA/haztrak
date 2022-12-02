import React from 'react';
import TransporterSearchForm from './TransporterSearchForm';
import { Modal, Row, Col } from 'react-bootstrap';
import { UseFieldArrayAppend } from 'react-hook-form';
import { Handler, Manifest } from 'types';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
  currentTransporters?: Array<Handler>;
  appendTransporter: UseFieldArrayAppend<Manifest, 'transporters'>;
}

function AddTransporter({
  handleClose,
  show,
  appendTransporter,
  currentTransporters,
}: Props) {
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
      <TransporterSearchForm
        handleClose={handleClose}
        tranAppend={appendTransporter}
        currentTransporters={currentTransporters}
      />
    </Modal>
  );
}

export default AddTransporter;
