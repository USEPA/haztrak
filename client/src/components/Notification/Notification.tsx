import React from 'react';
import { Badge, Dropdown } from 'react-bootstrap';
import { useAppSelector } from 'store';

function Notification() {
  const selector = useAppSelector((state) => state.notification);
  const numberAlerts = selector.alert.length;
  console.log(numberAlerts);

  return (
    <div className="mx-3">
      <Dropdown>
        <Dropdown.Toggle
          className="bg-transparent border-0 text-primary"
          bsPrefix="p-0"
        >
          <i className="fa-regular fa-envelope fa-lg"></i>
          <Badge pill bg="danger px-1" bsPrefix="badge badge-top-right">
            {numberAlerts < 9 ? `${numberAlerts}` : '9+'}
          </Badge>
          <span className="visually-hidden">unread messages</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default Notification;
