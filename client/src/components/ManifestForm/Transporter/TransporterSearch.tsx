import React from 'react';
import TransporterSearchForm from './TransporterSearchForm';
import { Modal, Row, Col } from 'react-bootstrap';
import { UseFieldArrayAppend } from 'react-hook-form';
import { Manifest } from 'types';
import { Transporter } from '../../../types/Transporter/Transporter';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
  currentTransporters?: [Transporter];
  appendTransporter: UseFieldArrayAppend<Manifest, 'transporters'>;
}

function TransporterSearch({
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

export default TransporterSearch;
