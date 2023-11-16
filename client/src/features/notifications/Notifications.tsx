import winkingRobot from '/static/robot-wink.jpg';
import { HtCard } from 'components/Ht';
import { NotificationRow } from 'components/Notification';
import { useTitle } from 'hooks';
import React from 'react';
import { Col, Container, Table } from 'react-bootstrap';
import { HtNotification, selectNotifications, useAppSelector } from 'store';

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
                  <h3>You're all caught up!</h3>
                  <img src={winkingRobot} alt="happy robot" width={200} height={'auto'} />
                </div>
              ) : (
                <Table hover>
                  <thead>
                    <tr>
                      <th className="col-8">Task</th>
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
