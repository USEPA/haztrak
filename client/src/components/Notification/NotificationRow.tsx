import { faCircleNotch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button } from 'react-bootstrap';
import { removeNotification, useAppDispatch } from 'store';
import { HtNotification } from 'store/notificationSlice/notification.slice';
import { useGetTaskStatusQuery } from 'store';

interface NotificationRowProps {
  notification: HtNotification;
}

/**
 * Notification Table row, returns info on one Notification object in the redux state.
 * Responsible for retrieving information about long-running tasks and displaying the results.
 * @constructor
 */
export function NotificationRow({ notification }: NotificationRowProps) {
  const dispatch = useAppDispatch();
  const pollingIntervalMs = 5000;

  // Poll the back end to check on the status of background running tasks
  const { data, isLoading } = useGetTaskStatusQuery(notification.uniqueId, {
    pollingInterval: pollingIntervalMs,
  });

  const doneDate = new Date(data?.doneDate ? data.doneDate : '').toLocaleTimeString();

  return (
    <>
      {isLoading || !data ? (
        ''
      ) : (
        <tr key={notification.uniqueId}>
          <td className="col-8">{data.taskName}</td>
          <td className="text-center">
            {data.status === 'PENDING' || data.status === 'STARTED' ? (
              <FontAwesomeIcon spin icon={faCircleNotch} />
            ) : (
              data.status
            )}
          </td>
          <td className="text-truncate">{doneDate}</td>
          <td className="text-center">
            <Button
              className="bg-transparent border-0"
              onClick={() => dispatch(removeNotification(notification))}
            >
              <FontAwesomeIcon icon={faTrash} size="lg" className="text-danger" />
            </Button>
          </td>
        </tr>
      )}
    </>
  );
}
