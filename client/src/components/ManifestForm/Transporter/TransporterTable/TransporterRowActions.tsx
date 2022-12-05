import React from 'react';
import { Button } from 'react-bootstrap';
import { UseFieldArrayRemove, UseFieldArraySwap } from 'react-hook-form';

interface TranRowActionProps {
  index: number;
  length: number;
  removeTransporter: UseFieldArrayRemove;
  swapTransporter: UseFieldArraySwap;
}

function TransporterRowActions({
  index,
  removeTransporter,
  swapTransporter,
  length,
}: TranRowActionProps) {
  console.log(index);
  console.log(length);
  return (
    <div className="d-flex justify-content-between mx-0">
      {/* Move Transporter up (towards the front of the transporter list) */}
      <Button
        disabled={index === 0}
        className="m-0 p-0 bg-transparent border-0"
        onClick={() => {
          swapTransporter(index, index - 1);
        }}
      >
        <i className="text-primary fas fa-arrow-circle-up fa-lg"></i>
      </Button>
      {/* Move Transporter down (towards the back of the transporter list) */}
      <Button
        disabled={index + 1 === length}
        className="m-0 p-0 bg-transparent border-0"
        onClick={() => {
          swapTransporter(index, index + 1);
        }}
      >
        <i className="text-primary fas fa-arrow-circle-down fa-lg"></i>
      </Button>
      {/* Remove Transporter */}
      <Button
        className="m-0 p-0 bg-transparent border-0"
        onClick={() => {
          removeTransporter(index);
        }}
      >
        <i className="text-danger fas fa-times-circle fa-lg"></i>
      </Button>
    </div>
  );
}

export { TransporterRowActions };
