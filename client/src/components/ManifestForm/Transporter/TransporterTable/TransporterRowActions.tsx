import React from 'react';
import { Button } from 'react-bootstrap';
import { UseFieldArrayRemove, UseFieldArraySwap } from 'react-hook-form';

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
        // If first transporter, disable move up button and color gray
        disabled={isFirst}
        className={`${
          isFirst ? 'text-secondary' : 'text-primary'
        } m-0 p-0 border-0 bg-transparent`}
        onClick={() => {
          swapTransporter(index, index - 1);
        }}
      >
        <i className="fas fa-arrow-circle-up fa-xl"></i>
      </Button>
      {/* Move Transporter down (towards the back of the transporter list) */}
      <Button
        id={`transporter-down-button-${index}`}
        // If last transporter, disable move down button and color gray
        disabled={isLast}
        className={`${
          isLast ? 'text-secondary' : 'text-primary'
        } m-0 p-0 border-0 bg-transparent`}
        onClick={() => {
          swapTransporter(index, index + 1);
        }}
      >
        <i className="fas fa-arrow-circle-down fa-xl"></i>
      </Button>
      {/* Remove Transporter */}
      <Button
        className="text-danger m-0 p-0 bg-transparent border-0"
        onClick={() => {
          removeTransporter(index);
        }}
      >
        <i className="fas fa-times-circle fa-xl"></i>
      </Button>
    </div>
  );
}

export { TransporterRowActions };
