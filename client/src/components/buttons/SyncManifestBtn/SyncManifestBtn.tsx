import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosError } from 'axios';
import { RcraApiUserBtn } from 'components/buttons';
import { useProgressTracker } from 'hooks';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { manifestApi } from 'services/manifestApi';
import { addTask, useAppDispatch } from 'store';

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
  const dispatch = useAppDispatch();
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const { inProgress, error } = useProgressTracker({ taskId: taskId });

  useEffect(() => {
    if (setSyncInProgress) setSyncInProgress(inProgress);
  }, [inProgress]);

  return (
    <RcraApiUserBtn
      variant="primary"
      disabled={disabled || !siteId || inProgress}
      className="mx-2"
      onClick={() => {
        if (siteId)
          manifestApi
            .syncManifest(siteId)
            .then((response) => {
              dispatch(
                addTask({
                  taskId: response.data.taskId,
                  status: 'PENDING',
                  taskName: 'Syncing RCRAInfo Profile',
                })
              );
              setTaskId(response.data.taskId);
            })
            // .then((response) => {
            //   toast.info(`Syncing Manifests for ${siteId}`);
            // })
            .catch((error: AxiosError) => toast.error(error.message));
      }}
    >
      {`Sync Manifest `}
      <FontAwesomeIcon icon={faSync} />
    </RcraApiUserBtn>
  );
}
