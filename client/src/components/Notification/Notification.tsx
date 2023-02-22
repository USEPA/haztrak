import React from 'react';
import { Badge, Button, Dropdown } from 'react-bootstrap';
import { removeMsg, useAppDispatch, useAppSelector } from 'store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEnvelope } from '@fortawesome/free-solid-svg-icons';

function Notification() {
  const notificationState = useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();
  const numberAlerts = notificationState.alert.length;

  return (
    <div className="mx-3">
      <Dropdown drop="start" className="shadow">
        <Dropdown.Toggle className="bg-transparent border-0 text-primary" bsPrefix="p-0">
          <FontAwesomeIcon icon={faEnvelope} size="lg" />
          <Badge
            pill
            bg="danger px-1"
            bsPrefix="badge badge-top-right"
            aria-label="unread Messages"
          >
            {numberAlerts > 0 ? (numberAlerts < 9 ? `${numberAlerts}` : '9+') : null}
          </Badge>
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
                      <FontAwesomeIcon icon={faCheck} size="lg" className="text-white" />
                    </Button>
                  </div>
                </Dropdown.ItemText>
                {/* If it's the last one, do not include a divider */}
                {index + 1 === numberAlerts ? (
                  <></>
                ) : (
                  <Dropdown.Divider key={`notificationDivider${index}`} className="my-0" />
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
