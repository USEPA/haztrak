import { AnyAction, ThunkAction } from '@reduxjs/toolkit';
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

/**
 * useProgressTracker hook tracks the progress of a long-running task on the server
 * optionally dispatches a redux action or async thunk after the task completes
 * @param taskId
 * @param reduxAction
 */
export function useProgressTracker({
  taskId,
  reduxAction,
}: {
  taskId: string | undefined;
  reduxAction?: AnyAction | ThunkAction<any, any, any, any>;
}) {
  const dispatch = useAppDispatch();
  const taskComplete = useAppSelector(selectTaskCompletion(taskId));
  const [inProgress, setInProgress] = useState<boolean>(taskId !== undefined);
  const [data, setData] = useState<TaskStatus | undefined>();
  const error: boolean = useAppSelector(selectTask(taskId))?.status === 'FAILURE';

  // @ts-ignore
  const response = useGetTaskStatusQuery(taskId, {
    pollingInterval: 3000,
    skip: !inProgress || taskId === undefined,
  });

  // If we get a response from the server, update the task status
  useEffect(() => {
    if (response.data) {
      setData(response.data);
      if (response.data.status === 'SUCCESS' || response.data.status === 'FAILURE') {
        setInProgress(false);
        dispatch(updateTask({ ...response.data, taskId: taskId, complete: true }));
      } else {
        setInProgress(true);
        dispatch(updateTask({ ...response.data, taskId: taskId }));
      }
    }
    if (response.error || response.data?.status === 'FAILURE') {
      setInProgress(false);
      dispatch(updateTask({ taskId: taskId, status: 'FAILURE', complete: true }));
    }
  }, [response.data?.status, response.error, response.data]);

  // If taskId defined, the task is not set to complete, mark inProgress as true
  useEffect(() => {
    if (!inProgress && !taskComplete && taskId !== undefined) {
      setInProgress(true);
    }
  }, [taskId]);

  //
  useEffect(() => {
    console.log('taskComplete', taskComplete);
    if (taskComplete) {
      if (reduxAction) dispatch(reduxAction);
      setInProgress(false);
    }
  }, [taskComplete, taskId]);

  return { data, inProgress, error } as const;
}
