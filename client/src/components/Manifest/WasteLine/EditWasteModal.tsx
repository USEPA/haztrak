import { HtModal } from 'components/Ht';
import { ManifestContext, ManifestContextType } from 'components/Manifest/ManifestForm';
import { Manifest } from 'components/Manifest/manifestSchema';
import { WasteLine } from 'components/Manifest/WasteLine/wasteLineSchema';
import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { UseFieldArrayReturn } from 'react-hook-form';
import { WasteLineForm } from './WasteLineForm';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
  currentWastes: Array<WasteLine>;
  wasteForm: UseFieldArrayReturn<Manifest, 'wastes'>;
}

/**
 * WasteLine is solely responsible for displaying the WasteLineForm in a
 * pleasant to look at modal.
 * @constructor
 */
export function EditWasteModal({ show, handleClose, currentWastes, wasteForm }: Props) {
  const { editWasteLineIndex, setEditWasteLineIndex } =
    useContext<ManifestContextType>(ManifestContext);
  let waste: WasteLine | undefined = undefined;
  if (editWasteLineIndex !== undefined) {
    waste = currentWastes[editWasteLineIndex];
  }
  let lineNumber: number;
  if (editWasteLineIndex !== undefined) {
    lineNumber = editWasteLineIndex + 1;
  } else {
    lineNumber = currentWastes.length + 1;
  }

  const handleCloseAndReset = () => {
    setEditWasteLineIndex(undefined);
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
          wasteForm={wasteForm}
          lineNumber={lineNumber}
          waste={waste}
          handleClose={handleCloseAndReset}
        />
      </HtModal.Body>
    </HtModal>
  );
}
