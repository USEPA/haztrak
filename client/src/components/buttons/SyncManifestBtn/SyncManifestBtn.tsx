import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosError } from 'axios';
import { RcraApiUserBtn } from 'components/buttons';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { manifestApi } from 'services/manifestApi';

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
              toast.info(`Syncing Manifests for ${siteId}`);
            })
            .catch((error: AxiosError) => toast.error(error.message));
      }}
    >
      {`Sync Manifest `}
      <FontAwesomeIcon icon={faSync} />
    </RcraApiUserBtn>
  );
}
