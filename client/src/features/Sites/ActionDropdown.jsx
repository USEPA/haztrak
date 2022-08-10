import React from 'react';
import { Dropdown } from 'react-bootstrap';

function SiteActions() {
  return (
    <Dropdown>
      <Dropdown.Toggle className="bg-transparent ht-ellipsis shadow-none">
        <i className="fas fa-ellipsis-v fa-sm fa-fw h5 mb-0"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SiteActions;
