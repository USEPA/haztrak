import React from 'react';
import { Badge, Button, Dropdown } from 'react-bootstrap';
import { removeMsg, useAppDispatch, useAppSelector } from 'store';

function Notification() {
  const notificationState = useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();
  const numberAlerts = notificationState.alert.length;

  return (
    <div className="mx-3">
      <Dropdown drop="start" className="shadow">
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
        <Dropdown.Menu className="pt-0 alert-mw">
          <Dropdown.Header className="bg-primary text-white rounded-top mt-n1">
            Notification Center
          </Dropdown.Header>
          {notificationState.alert.map((alert, index) => {
            return (
              <React.Fragment key={`alertId${index}`}>
                <Dropdown.ItemText className="text-nowrap">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="me-5 text-truncate">{alert.message}</div>
                    <Button
                      variant="success"
                      className="btn-circle"
                      onClick={() => dispatch(removeMsg(alert))}
                    >
                      <i className="fas fa-check fa-lg text-white"></i>
                    </Button>
                  </div>
                </Dropdown.ItemText>
                {/* If it's the last one, do not include a divider */}
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
