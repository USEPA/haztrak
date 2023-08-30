import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { WasteLineForm } from './WasteLineForm';
import { UseFieldArrayReturn } from 'react-hook-form';
import { Manifest } from 'components/Manifest/manifestSchema';
import { WasteLine } from 'components/Manifest/WasteLine/wasteLineSchema';
import { HtModal } from 'components/Ht';
import { ManifestContext, ManifestContextType } from 'components/Manifest/ManifestForm';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
  currentWastes: Array<WasteLine>;
  wasteArrayMethods: UseFieldArrayReturn<Manifest, 'wastes'>;
}

/**
 * WasteLine is solely responsible for displaying the WasteLineForm in a
 * pleasant to look at modal.
 * @constructor
 */
export function EditWasteModal({ show, handleClose, currentWastes, wasteArrayMethods }: Props) {
  const { editWasteLine } = useContext<ManifestContextType>(ManifestContext);
  // const waste = editWasteLine ? currentWastes[editWasteLine] : undefined;
  const waste = currentWastes[editWasteLine];
  const lineNumber = editWasteLine ? editWasteLine : currentWastes.length + 1;
  console.log('currentWaste', currentWastes);
  console.log('waste', waste);
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
          wasteArrayMethods={wasteArrayMethods}
          lineNumber={lineNumber}
          waste={waste}
          handleClose={handleClose}
        />
      </HtModal.Body>
    </HtModal>
  );
}
