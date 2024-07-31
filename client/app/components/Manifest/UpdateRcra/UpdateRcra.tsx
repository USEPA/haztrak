import { HtSpinner } from '~/components/UI';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { addAlert, useAppDispatch, useGetTaskStatusQuery } from '~/store';

interface UpdateRcraProps {
  taskId: string;
}

/**
 * UpdateRcra is a component that will poll the server for the status of an asynchronous task and
 * display that status to the user. If the task is successful, the user will be redirected to the
 * manifest view page.
 * @param taskId
 * @constructor
 */
export function UpdateRcra({ taskId }: UpdateRcraProps) {
  const dispatch = useAppDispatch();
  const [status, setStatus] = React.useState<'SUCCESS' | 'FAILURE' | 'PENDING' | undefined>(
    undefined
  );

  const { data, error } = useGetTaskStatusQuery(taskId, {
    pollingInterval: 3000,
    skip: status === 'SUCCESS' || status === 'FAILURE',
  });

  useEffect(() => {
    if (data?.status === 'SUCCESS') {
      setStatus('SUCCESS');
      dispatch(addAlert({ message: 'RCRAInfo updated', type: 'success' }));
    } else if (data?.status === 'FAILURE') {
      dispatch(addAlert({ message: 'Error updating RCRAInfo', type: 'error' }));
      setStatus('FAILURE');
    }
  }, [data, error]);

  if (status === 'SUCCESS') {
    let resp = data?.result;
    if (typeof resp === 'string') {
      resp = JSON.parse(resp);
    }
    // @ts-expect-error - ToDo fix
    return <Navigate to={`/manifest/${resp.manifestTrackingNumber}/view`} />;
  } else if (status === 'FAILURE') {
    return <></>;
  } else {
    return (
      <div className="overlay-spinner">
        <HtSpinner center className="text-light" />
      </div>
    );
  }
}
