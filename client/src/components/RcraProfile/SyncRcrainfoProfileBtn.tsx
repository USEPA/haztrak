import { RcraApiUserBtn } from 'components/Rcrainfo';
import React, { useEffect } from 'react';
import { addTask, updateTask, useAppDispatch, useSyncRcrainfoProfileMutation } from 'store';

interface SyncRcrainfoProfileBtnProps {
  taskId?: string;
  setTaskId: (taskId: string) => void;
}

export function SyncRcrainfoProfileBtn({ taskId, setTaskId }: SyncRcrainfoProfileBtnProps) {
  const dispatch = useAppDispatch();
  const [syncRcrainfoProfile, { data, error, isLoading }] = useSyncRcrainfoProfileMutation();

  useEffect(() => {
    if (data) {
      dispatch(
        addTask({
          taskId: data.taskId,
          status: 'PENDING',
          taskName: 'Syncing RCRAInfo Profile',
        })
      );
      setTaskId(data.taskId);
    }
    if (error) {
      dispatch(updateTask({ taskId: taskId, status: 'FAILURE', complete: true }));
    }
  }, [data, error, isLoading]);

  return (
    <RcraApiUserBtn
      className="mx-2"
      variant="primary"
      onClick={() => {
        syncRcrainfoProfile();
      }}
    >
      Sync Site Permissions
    </RcraApiUserBtn>
  );
}
