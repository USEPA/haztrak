import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import htApi from 'services';
import { RcraApiUserBtn } from 'components/buttons';
import { addMsg, useAppDispatch } from 'store';

interface SyncManifestProps {
  siteId?: string;
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
  let active: boolean = siteId ? true : false;
  active = !disabled;

  return (
    <RcraApiUserBtn
      variant="primary"
      disabled={!active}
      className="mx-2"
      onClick={() => {
        setSyncingMtn(!syncingMtn);
        htApi
          .post('/site/manifest/sync', { siteId: `${siteId}` })
          .then(() => {
            dispatch(
              addMsg({
                uniqueId: Date.now(),
                createdDate: new Date().toISOString(),
                message: 'Sync Manifest Task Launched',
                status: 'Info',
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

export default SyncManifestBtn;
