import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import htApi from 'services';
import { RcraApiUserBtn } from 'components/buttons';
import { addMsg, useAppDispatch } from 'store';

interface SyncManifestProps {
  siteId: string;
  disabled?: boolean;
}

/**
 * Button for initiating a task to pull manifests from RCRAInfo for a given site
 * The button will be disabled if siteId (the EPA ID number) is not provided
 * @constructor
 */
function SyncManifestBtn({ siteId, disabled }: SyncManifestProps) {
  const [syncingMtn, setSyncingMtn] = useState(false);
  const dispatch = useAppDispatch();

  if (!siteId || disabled) {
    disabled = true;
  }

  return (
    <RcraApiUserBtn
      variant="primary"
      disabled={disabled}
      className="mx-2"
      onClick={() => {
        setSyncingMtn(!syncingMtn);
        htApi
          .post('/trak/site/manifest/sync', { siteId: `${siteId}` })
          .then((r) => console.log(r))
          .then(() => {
            dispatch(
              addMsg({
                uniqueId: Date.now(),
                createdDate: new Date().toISOString(),
                message: 'Sync Manifest Task Launched',
                alertType: 'Info',
                read: false,
                timeout: 5000,
              })
            );
          })
          .catch((reason) => console.log(reason));
      }}
    >
      {`Sync Manifest `}
      <FontAwesomeIcon icon={faSync} />
    </RcraApiUserBtn>
  );
}

export default SyncManifestBtn;
