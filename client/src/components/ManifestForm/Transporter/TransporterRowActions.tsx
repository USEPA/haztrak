import React from 'react';
import { Button } from 'react-bootstrap';

function TransporterRowActions() {
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
        onClick={() => console.log('hello')}
      >
        <i className="text-danger fas fa-times-circle fa-lg"></i>
      </Button>
    </div>
  );
}

export default TransporterRowActions;
