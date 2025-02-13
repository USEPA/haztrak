import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useProgressTracker } from '~/hooks';
import { LongRunningTask } from '~/store';

export interface NotificationProps {
  task: LongRunningTask;
}

export function ProgressTracker({ task }: NotificationProps) {
  const taskId = task.taskId;
  const { data, inProgress, error } = useProgressTracker({ taskId: taskId });

  useEffect(() => {
    const toastId = toast.loading(task.taskName, { toastId: taskId });
    if (!inProgress) {
      if (data && data.status === 'SUCCESS') {
        toast.update(toastId, {
          render: 'Success!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          toastId: taskId,
          closeOnClick: true,
        });
      }
    }
    if (error) {
      toast.update(toastId, {
        render: 'Error!',
        type: 'error',
        isLoading: false,
        toastId: taskId,
        autoClose: 3000,
        closeOnClick: true,
      });
    }
  }, [data, inProgress, error, taskId]);

  return <></>;
}
