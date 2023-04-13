import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HtCard } from 'components/Ht';
import { NotificationRow } from 'components/Notification';
import useTitle from 'hooks/useTitle';
import React from 'react';
import { Col, Container, Table } from 'react-bootstrap';
import { useAppSelector } from 'store';
import { NotificationState } from 'store/notificationSlice/notification.slice';

/**
 * Table showing the user's current notifications
 * @constructor
 */
function Notifications() {
  useTitle('Notifications');
  const notificationState: NotificationState = useAppSelector((state) => state.notification);

  return (
    <>
      <Container className="py-2">
        <Col>
          <HtCard>
            <HtCard.Header title="Notifications"></HtCard.Header>
            <HtCard.Body>
              {notificationState.notifications.length === 0 ? (
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
                      <th className="text-center">Time</th>
                      <th className="text-center">Clear</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notificationState.notifications.map((notification) => {
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

export default Notifications;
