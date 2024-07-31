import { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import {
  selectTask,
  selectTaskCompletion,
  TaskStatus,
  updateTask,
  useAppDispatch,
  useAppSelector,
  useGetTaskStatusQuery,
} from 'store';

interface UseProgressTrackerConfig {
  taskId: string | undefined;
  // @ts-expect-error - ToDO fix
  reduxAction?: UnknownAction | ThunkAction<unknown, unknown, unknown, unknown>;
  pollingInterval?: number;
  showMessages?: boolean;
}

interface TaskStatusResponse<T> extends Omit<TaskStatus, 'result'> {
  result: T;
}

interface UseProgressTrackerReturn<T> {
  data?: TaskStatusResponse<T>;
  inProgress: boolean;
  error?: unknown;
}

/**
 * useProgressTracker hook tracks the progress of a long-running task on the server
 * optionally dispatches a redux action or async thunk after the task completes
 */
export function useProgressTracker<T>({
  taskId,
  reduxAction,
  pollingInterval,
}: UseProgressTrackerConfig): UseProgressTrackerReturn<T> {
  const dispatch = useAppDispatch();
  const taskComplete = useAppSelector(selectTaskCompletion(taskId));
  const [inProgress, setInProgress] = useState<boolean>(taskId !== undefined);
  const [data, setData] = useState<TaskStatusResponse<T> | undefined>(undefined);
  const [error, setError] = useState<unknown | undefined>(
    useAppSelector(selectTask(taskId))?.status === 'FAILURE'
  );

  const failTask = (queryError: unknown) => {
    setInProgress(false);
    dispatch(updateTask({ taskId: taskId, status: 'FAILURE', complete: true }));
    setError('Task failed');
    setError(queryError ?? 'Task failed');
  };

  const {
    data: queryData,
    error: queryError,
    // @ts-expect-error - if taskId is undefined, the query is skipped
  } = useGetTaskStatusQuery(taskId, {
    pollingInterval: pollingInterval ?? 3000,
    skip: !inProgress || taskId === undefined,
  });

  // If we get a response from the server, update the task status
  useEffect(() => {
    if (queryData) {
      if (queryData.status === 'SUCCESS') {
        setData(queryData as TaskStatusResponse<T>);
        setInProgress(false);
        dispatch(updateTask({ ...queryData, taskId: taskId, complete: true }));
      } else if (queryData?.status === 'FAILURE') {
        failTask(queryData);
      } else {
        setInProgress(true);
        dispatch(updateTask({ ...queryData, taskId: taskId }));
      }
    }
  }, [queryData]);

  useEffect(() => {
    if (queryError) {
      failTask(queryError);
    }
  }, [queryError]);

  // If taskId defined, the task is not set to complete, mark inProgress as true
  useEffect(() => {
    if (!inProgress && !taskComplete && taskId !== undefined) {
      setInProgress(true);
    }
  }, [taskId]);

  useEffect(() => {
    if (taskComplete) {
      if (reduxAction) dispatch(reduxAction);
      setInProgress(false);
    }
  }, [taskComplete, taskId]);

  return { data, inProgress, error } as const;
}
