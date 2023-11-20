import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useGetTaskStatusQuery } from 'store';
import { LongRunningTask, updateTask } from 'store/notification.slice';

export interface NotificationProps {
  task: LongRunningTask;
}

export function ProgressTracker({ task }: NotificationProps) {
  const dispatch = useAppDispatch();
  const shouldPoll = task.complete === undefined ? true : !task.complete;
  const [pollServer, setPollServer] = useState<boolean>(shouldPoll);
  let [status, setStatus] = useState<string>(task.status);
  const taskId = task.taskId;

  const { data, isLoading, error } = useGetTaskStatusQuery(taskId, {
    pollingInterval: 3000,
    skip: taskId === undefined || !pollServer,
  });

  useEffect(() => {
    if (data) {
      if (status === 'SUCCESS' || status === 'FAILURE') {
        dispatch(updateTask({ ...data, taskId: taskId, complete: true }));
      } else {
        dispatch(updateTask({ ...data, taskId: taskId }));
      }
    }
    if (error || status === 'FAILURE') {
      dispatch(updateTask({ ...task, status: 'FAILURE', complete: true }));
    }
  }, [status, error, data]);

  if (shouldPoll) {
    const id = toast.loading(task.taskName, { toastId: taskId });
    if (data && data.status === 'SUCCESS') {
      setPollServer(false);
      setStatus('SUCCESS');
      toast.update(id, {
        render: 'Success!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        toastId: taskId,
        closeOnClick: true,
      });
    }
    if (error) {
      setPollServer(false);
      setStatus('FAILURE');
      toast.update(id, {
        render: 'Error!',
        type: 'error',
        isLoading: false,
        toastId: taskId,
        autoClose: 3000,
        closeOnClick: true,
      });
    }
  }

  return <></>;
}
