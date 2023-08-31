import React from 'react';
import { Button } from 'react-bootstrap';
import { UseFieldArrayReturn } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTools } from '@fortawesome/free-solid-svg-icons';
import { Manifest } from 'components/Manifest';

interface WasteRowActionProps {
  index: number;
  wasteArrayMethods: UseFieldArrayReturn<Manifest, 'wastes'>;
  toggleWLModal: () => void;
  setEditWasteLine: (index: number) => void;
}

/**
 * WasteRowActions - actions for controlling wast lines on a manifest
 * @constructor
 */
function WasteRowActions({
  index,
  wasteArrayMethods,
  setEditWasteLine,
  toggleWLModal,
}: WasteRowActionProps) {
  return (
    <div className="d-flex justify-content-between mx-0">
      <Button
        title={`remove-waste-${index}-button`}
        variant="danger"
        onClick={() => {
          wasteArrayMethods.remove(index);
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </Button>
      <Button
        onClick={() => {
          setEditWasteLine(index);
          toggleWLModal();
        }}
      >
        <FontAwesomeIcon icon={faTools} className="text-light" />
      </Button>
    </div>
  );
}

export { WasteRowActions };
