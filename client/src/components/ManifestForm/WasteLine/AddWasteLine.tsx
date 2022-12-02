import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import WasteLineForm from './WasteLineForm';
import { UseFieldArrayAppend } from 'react-hook-form';
import { Manifest } from 'types';
import { WasteLine } from 'types/WasteLine';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
  currentWastes?: Array<WasteLine>;
  appendWaste: UseFieldArrayAppend<Manifest, 'wastes'>;
}

/**
 * WasteLine is solely responsible for displaying the WasteLineForm in a
 * pleasant to look at modal.
 * @param show
 * @param handleClose
 * @constructor
 */
function AddWasteLine({
  show,
  handleClose,
  appendWaste,
  currentWastes,
}: Props) {
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

export default AddWasteLine;
