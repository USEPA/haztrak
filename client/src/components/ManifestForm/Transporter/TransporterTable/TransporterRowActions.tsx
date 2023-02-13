import React from 'react';
import { Button } from 'react-bootstrap';
import { UseFieldArrayRemove, UseFieldArraySwap } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faTimes } from '@fortawesome/free-solid-svg-icons';

interface TranRowActionProps {
  index: number;
  length: number;
  removeTransporter: UseFieldArrayRemove;
  swapTransporter: UseFieldArraySwap;
}

/**
 * TransporterRowActions uses index and length to disable and display
 * different actions for eah row, expected to be part of a mapped table or list.
 * @param index
 * @param removeTransporter
 * @param swapTransporter
 * @param length
 * @constructor
 */
function TransporterRowActions({
  index,
  removeTransporter,
  swapTransporter,
  length,
}: TranRowActionProps) {
  const isFirst = index === 0;
  const isLast = index + 1 === length;
  return (
    <div className="d-flex justify-content-between mx-0">
      {/* Move Transporter up (towards the front of the transporter list) */}
      <Button
        title={`move-transporter-${index}-up-button`}
        // If first transporter, disable move up button and color gray
        disabled={isFirst}
        variant={isFirst ? 'secondary' : 'primary'}
        className="btn-circle"
        onClick={() => {
          swapTransporter(index, index - 1);
        }}
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </Button>
      {/* Move Transporter down (towards the back of the transporter list) */}
      <Button
        title={`move-transporter-${index}-down-button`}
        // If last transporter, disable move down button and color gray
        disabled={isLast}
        variant={isLast ? 'secondary' : 'primary'}
        className="btn-circle"
        onClick={() => {
          swapTransporter(index, index + 1);
        }}
      >
        <FontAwesomeIcon icon={faArrowDown} />
      </Button>
      <Button
        title={`remove-transporter-${index}-button`}
        className="btn-circle"
        variant="danger"
        onClick={() => {
          removeTransporter(index);
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </Button>
    </div>
  );
}

export { TransporterRowActions };
