import { ThunkAction } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { selectTask, selectTaskCompletion } from 'store/notification.slice';

export function useUpdateAfterTask({
  taskId,
  reduxAction,
}: {
  taskId: string | undefined;
  reduxAction: ThunkAction<any, any, any, any>;
}) {
  const taskComplete = useAppSelector(selectTaskCompletion(taskId));
  const dispatch = useAppDispatch();
  const [inProgress, setInProgress] = useState<boolean>(taskId !== undefined);
  const error: boolean = useAppSelector(selectTask(taskId))?.status === 'FAILURE';

  useEffect(() => {
    if (!inProgress && !taskComplete && taskId !== undefined) {
      setInProgress(true);
    }
  }, [taskId]);

  useEffect(() => {
    if (taskComplete) {
      dispatch(reduxAction);
      setInProgress(false);
    }
  }, [taskComplete, taskId]);

  return [inProgress, error] as const;
}
