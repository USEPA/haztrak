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
  const { editWasteLine, setEditWasteLine } = useContext<ManifestContextType>(ManifestContext);
  let waste: WasteLine | undefined = undefined;
  if (editWasteLine !== undefined) {
    waste = currentWastes[editWasteLine];
  }
  let lineNumber = undefined;
  if (editWasteLine !== undefined) {
    lineNumber = editWasteLine;
  } else {
    lineNumber = currentWastes.length;
  }

  const handleCloseAndReset = () => {
    setEditWasteLine(undefined);
    handleClose();
  };

  return (
    <HtModal
      showModal={show ? show : false}
      handleClose={handleCloseAndReset}
      dialogClassName="modal-90w"
    >
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
          handleClose={handleCloseAndReset}
        />
      </HtModal.Body>
    </HtModal>
  );
}
