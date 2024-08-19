import React, { useEffect, useState } from 'react';
import { FaSync } from 'react-icons/fa';
import { RcraApiUserBtn } from '~/components/Rcrainfo/buttons/RcraApiUserBtn/RcraApiUserBtn';
import { useProgressTracker } from '~/hooks';
import { addTask, updateTask, useAppDispatch, useSyncEManifestMutation } from '~/store';

interface SyncManifestProps {
  siteId?: string;
  disabled?: boolean;
  syncInProgress?: boolean;
  setSyncInProgress?: (inProgress: boolean) => void;
}

/**
 * Button for initiating a task to pull manifests from RCRAInfo for a given site
 * The button will be disabled if siteId (the EPA ID number) is not provided
 * @constructor
 */
export function SyncManifestBtn({
  siteId,
  disabled,
  setSyncInProgress,
  syncInProgress,
}: SyncManifestProps) {
  const [syncSiteManifest, { data, error }] = useSyncEManifestMutation();
  const dispatch = useAppDispatch();
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const { inProgress } = useProgressTracker({ taskId: taskId });

  useEffect(() => {
    if (setSyncInProgress) setSyncInProgress(inProgress);
  }, [inProgress]);

  useEffect(() => {
    if (data?.taskId) {
      dispatch(
        addTask({
          taskId: data.taskId,
          status: 'PENDING',
          taskName: `Syncing ${siteId}'s manifests`,
        })
      );
      setTaskId(data.taskId);
    }
  }, [data]);

  useEffect(() => {
    if (error && taskId) {
      dispatch(
        updateTask({
          taskId: taskId,
          status: 'FAILURE',
        })
      );
    }
  }, [error]);

  return (
    <RcraApiUserBtn
      variant="secondary"
      disabled={disabled || !siteId || inProgress}
      onClick={() => {
        if (siteId) syncSiteManifest(siteId);
      }}
    >
      {`Sync Manifest `}
      <FaSync className={syncInProgress ? 'tw-spin' : ''} />
    </RcraApiUserBtn>
  );
}
