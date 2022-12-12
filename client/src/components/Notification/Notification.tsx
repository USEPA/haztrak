import React from 'react';
import { Badge, Dropdown } from 'react-bootstrap';
import { useAppSelector } from 'store';

function Notification() {
  const notificationState = useAppSelector((state) => state.notification);
  const numberAlerts = notificationState.alert.length;

  return (
    <div className="mx-3">
      <Dropdown drop="start">
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
        <Dropdown.Menu className="pt-0">
          <Dropdown.Header className="bg-secondary text-white rounded-top mt-n1">
            Dropdown header
          </Dropdown.Header>
          {notificationState.alert.map((alert, index) => {
            return (
              <React.Fragment key={`alertId${index}`}>
                <Dropdown.Item>{alert.message}</Dropdown.Item>
                {index + 1 === numberAlerts ? (
                  <></>
                ) : (
                  <Dropdown.Divider
                    key={`notificationDivider${index}`}
                    className="my-0"
                  />
                )}
              </React.Fragment>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default Notification;
