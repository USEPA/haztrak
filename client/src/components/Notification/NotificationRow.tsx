import { faCircleNotch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button } from 'react-bootstrap';
import { removeNotification, useAppDispatch } from 'store';
import { useGetTaskStatusQuery } from 'store/exampleTask.slice';
import { HtNotification } from 'store/notificationSlice/notification.slice';

interface NotificationRowProps {
  notification: HtNotification;
}

/**
 * Notification Table row, returns info on one Notification object in the redux state.
 * Responsible for retrieving information about long-running tasks and displaying the results.
 * @constructor
 */
function NotificationRow({ notification }: NotificationRowProps) {
  const dispatch = useAppDispatch();
  const createdDate = new Date(notification.createdDate);
  const pollingIntervalMs = 5000;

  // Poll the back end to check on the status of background running tasks
  const { data, isLoading } = useGetTaskStatusQuery(notification.uniqueId, {
    pollingInterval: pollingIntervalMs,
  });

  return (
    <tr key={notification.uniqueId}>
      <td className="col-8">{notification.message}</td>
      <td className="text-center">
        {isLoading || data.taskStatus === 'PENDING' ? (
          <FontAwesomeIcon spin icon={faCircleNotch} />
        ) : (
          notification.status
        )}
      </td>
      <td className="text-truncate">{createdDate.toLocaleTimeString()}</td>
      <td className="text-center">
        <Button
          className="bg-transparent border-0"
          onClick={() => dispatch(removeNotification(notification))}
        >
          <FontAwesomeIcon icon={faTrash} size="lg" className="text-danger" />
        </Button>
      </td>
    </tr>
  );
}

export default NotificationRow;
