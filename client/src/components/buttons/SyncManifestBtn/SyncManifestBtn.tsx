import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RcraApiUserBtn } from 'components/buttons';
import React, { useState } from 'react';
import { manifestApi } from 'services/manifestApi';
import { addAlert, useAppDispatch } from 'store';

interface SyncManifestProps {
  siteId?: string;
  disabled?: boolean;
}

/**
 * Button for initiating a task to pull manifests from RCRAInfo for a given site
 * The button will be disabled if siteId (the EPA ID number) is not provided
 * @constructor
 */
export function SyncManifestBtn({ siteId, disabled }: SyncManifestProps) {
  const [syncingMtn, setSyncingMtn] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <RcraApiUserBtn
      variant="primary"
      disabled={disabled || !siteId || syncingMtn}
      className="mx-2"
      onClick={() => {
        setSyncingMtn(!syncingMtn);
        if (siteId)
          manifestApi
            .syncManifest(siteId)
            .then((response) => {
              dispatch(
                addAlert({
                  id: response.data.taskId,
                  createdDate: new Date().toISOString(),
                  message: `Sync Manifest Task Launched. Task ID: ${response.data.taskId}`,
                  type: 'Info',
                  read: false,
                  timeout: 5000,
                })
              );
            })
            .catch((reason) => console.error(reason));
      }}
    >
      {`Sync Manifest `}
      <FontAwesomeIcon icon={faSync} />
    </RcraApiUserBtn>
  );
}
