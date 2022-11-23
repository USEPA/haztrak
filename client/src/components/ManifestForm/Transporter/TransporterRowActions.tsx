import React from 'react';
import { Button } from 'react-bootstrap';
import { UseFieldArrayRemove } from 'react-hook-form';

interface Props {
  order: number;
  removeTransporter: UseFieldArrayRemove;
}

function TransporterRowActions({ order, removeTransporter }: Props) {
  return (
    <div className="d-flex justify-content-between mx-0">
      <Button
        className="m-0 p-0 bg-transparent border-0"
        onClick={() => console.log('hello')}
      >
        <i className="text-primary fas fa-arrow-circle-up fa-lg"></i>
      </Button>
      <Button
        className="m-0 p-0 bg-transparent border-0"
        onClick={() => console.log('hello')}
      >
        <i className="text-primary fas fa-arrow-circle-down fa-lg"></i>
      </Button>
      <Button
        className="m-0 p-0 bg-transparent border-0"
        onClick={() => {
          removeTransporter(order);
        }}
      >
        <i className="text-danger fas fa-times-circle fa-lg"></i>
      </Button>
    </div>
  );
}

export default TransporterRowActions;
