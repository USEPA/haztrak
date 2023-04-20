import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export function NotificationBtn() {
  const notificationState = useAppSelector((state) => state.notification);
  const numberAlerts = notificationState.notifications.length;
  const alertsExists: boolean = numberAlerts > 0;

  return (
    <div className="mx-3 px-2 position-relative d-inline-block">
      <Link to={'/notifications'}>
        <Button
          className={`bg-transparent border-0 ${alertsExists ? 'text-primary' : 'text-muted'}`}
        >
          <div>
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
          </div>
          {numberAlerts > 0 ? (
            <Badge
              pill
              bg="danger"
              aria-label="unread messages"
              className="position-absolute mx-1 pe-2"
            >
              {numberAlerts < 9 ? `${numberAlerts}` : '9+'}
              <span className="visually-hidden">unread messages</span>
            </Badge>
          ) : (
            <></>
          )}
        </Button>
      </Link>
    </div>
  );
}
