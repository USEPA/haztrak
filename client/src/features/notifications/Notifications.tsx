import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HtCard } from 'components/Ht';
import { NotificationRow } from 'components/Notification';
import { useTitle } from 'hooks';
import React from 'react';
import { Col, Container, Table } from 'react-bootstrap';
import { useAppSelector } from 'store';
import { HtNotification, selectNotifications } from 'store/notificationSlice/notification.slice';

/**
 * Table showing the user's current notifications
 * @constructor
 */
export function Notifications() {
  useTitle('Notifications');
  const notifications: Array<HtNotification> = useAppSelector(selectNotifications);

  return (
    <>
      <Container className="py-2">
        <Col>
          <HtCard>
            <HtCard.Header title="Notifications"></HtCard.Header>
            <HtCard.Body>
              {notifications.length === 0 ? (
                <div className="text-center">
                  <h3>Nothing to see here, you're all caught up!</h3>
                  <FontAwesomeIcon className="text-info" icon={faFaceSmile} size={'6x'} />
                </div>
              ) : (
                <Table hover>
                  <thead>
                    <tr>
                      <th className="col-8">Message</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Time Completed</th>
                      <th className="text-center">Clear</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((notification) => {
                      return (
                        <NotificationRow key={notification.uniqueId} notification={notification} />
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </HtCard.Body>
          </HtCard>
        </Col>
      </Container>
    </>
  );
}
