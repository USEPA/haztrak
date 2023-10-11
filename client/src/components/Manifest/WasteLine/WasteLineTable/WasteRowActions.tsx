import { faTools, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Manifest } from 'components/Manifest';
import React from 'react';
import { Button } from 'react-bootstrap';
import { UseFieldArrayReturn } from 'react-hook-form';

interface WasteRowActionProps {
  index: number;
  wasteForm: UseFieldArrayReturn<Manifest, 'wastes'>;
  toggleWLModal: () => void;
  setEditWasteLine: (index: number) => void;
}

/**
 * WasteRowActions - actions for controlling wast lines on a manifest
 * @constructor
 */
function WasteRowActions({
  index,
  wasteForm,
  setEditWasteLine,
  toggleWLModal,
}: WasteRowActionProps) {
  return (
    <div className="d-flex justify-content-between mx-0">
      <Button
        title={`remove waste row ${index + 1}`}
        variant="outline-danger"
        style={{ border: 'none' }}
        onClick={() => {
          wasteForm.remove(index);
        }}
      >
        <FontAwesomeIcon icon={faTrash} />
      </Button>
      <Button
        title={`edit waste row ${index + 1}`}
        variant="outline-primary"
        style={{ border: 'none' }}
        onClick={() => {
          setEditWasteLine(index);
          toggleWLModal();
        }}
      >
        <FontAwesomeIcon icon={faTools} />
      </Button>
    </div>
  );
}

export { WasteRowActions };
