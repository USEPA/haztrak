import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { selectNotifications, useAppSelector } from 'store';

export function NotificationBtn() {
  const notifications = useAppSelector(selectNotifications);
  const numberAlerts = notifications.length;
  const alertsExists: boolean = numberAlerts > 0;

  return (
    <div className="mx-3 px-2 position-relative d-inline-block">
      <Link to={'/notifications'}>
        <Button
          className={`bg-transparent border-0 btn-hover-dark rounded-circle ${
            alertsExists ? 'text-primary' : 'text-secondary'
          }`}
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
