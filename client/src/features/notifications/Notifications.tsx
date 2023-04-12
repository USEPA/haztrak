import { faCircleNotch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HtCard } from 'components/Ht';
import useTitle from 'hooks/useTitle';
import React from 'react';
import { Button, Col, Container, Table } from 'react-bootstrap';
import { removeMsg, useAppDispatch, useAppSelector } from 'store';
import { NotificationState } from 'store/notificationSlice/notification.slice';

/**
 * Table showing the user's current notifications
 * @constructor
 */
function Notifications() {
  useTitle('Notifications');
  const notificationState: NotificationState = useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();

  return (
    <>
      <Container className="py-2">
        <Col>
          <HtCard>
            <HtCard.Header title="Notifications"></HtCard.Header>
            <HtCard.Body>
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
                    const createdDate = new Date(notification.createdDate);
                    return (
                      <tr key={notification.uniqueId}>
                        <td className="text-truncate">{notification.message}</td>
                        <td className="text-center">
                          {notification.inProgress ? (
                            <FontAwesomeIcon spin icon={faCircleNotch} />
                          ) : (
                            notification.status
                          )}
                        </td>
                        <td className="text-truncate">{createdDate.toLocaleTimeString()}</td>
                        <td className="text-center">
                          <Button
                            className="bg-transparent border-0"
                            onClick={() => dispatch(removeMsg(notification))}
                          >
                            <FontAwesomeIcon icon={faTrash} size="lg" className="text-danger" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </HtCard.Body>
          </HtCard>
        </Col>
      </Container>
    </>
  );
}

export default Notifications;
