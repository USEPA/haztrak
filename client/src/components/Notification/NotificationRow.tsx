import { faCircleNotch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { HaztrakAlert, removeAlert, useAppDispatch, useGetTaskStatusQuery } from 'store';

interface NotificationRowProps {
  notification: HaztrakAlert;
}

/**
 * Notification Table row, returns info on one Notification object in the redux state.
 * Responsible for retrieving information about long-running tasks and displaying the results.
 * @constructor
 */
export function NotificationRow({ notification }: NotificationRowProps) {
  const dispatch = useAppDispatch();
  const pollingIntervalMs = 5000;
  const [skip, setSkip] = useState(true);

  // Poll the back end to check on the status of background running tasks
  const { data, isLoading, error } = useGetTaskStatusQuery(notification.id, {
    pollingInterval: pollingIntervalMs,
    skip: skip,
  });

  if (error) {
    setSkip(true);
  }

  const doneDate = new Date(data?.doneDate ? data.doneDate : '').toLocaleTimeString();

  return (
    <>
      {isLoading || !data ? (
        ''
      ) : (
        <tr key={notification.id}>
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
              onClick={() => dispatch(removeAlert(notification))}
            >
              <FontAwesomeIcon icon={faTrash} size="lg" className="text-danger" />
            </Button>
          </td>
        </tr>
      )}
    </>
  );
}
