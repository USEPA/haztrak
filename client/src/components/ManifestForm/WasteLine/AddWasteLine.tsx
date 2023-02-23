import React from 'react';
import { Col, Row } from 'react-bootstrap';
import WasteLineForm from './WasteLineForm';
import { UseFieldArrayAppend } from 'react-hook-form';
import { Manifest } from 'types';
import { WasteLine } from 'types/WasteLine';
import { HtModal } from 'components/Ht';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
  currentWastes?: Array<WasteLine>;
  appendWaste: UseFieldArrayAppend<Manifest, 'wastes'>;
}

/**
 * WasteLine is solely responsible for displaying the WasteLineForm in a
 * pleasant to look at modal.
 * @constructor
 */
function AddWasteLine({ show, handleClose, appendWaste, currentWastes }: Props) {
  return (
    <HtModal showModal={show ? show : false} handleClose={handleClose} dialogClassName="modal-90w">
      <HtModal.Header closeButton>
        <Col>
          <Row>
            <HtModal.Title title="Add Waste Line" />
          </Row>
          <Row>
            <i>
              <small>A waste line should be added for each unique waste stream.</small>
            </i>
          </Row>
        </Col>
      </HtModal.Header>
      <HtModal.Body>
        <WasteLineForm
          appendWaste={appendWaste}
          currentWastes={currentWastes}
          handleClose={handleClose}
        />
      </HtModal.Body>
    </HtModal>
  );
}

export default AddWasteLine;
