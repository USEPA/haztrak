import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import htApi from 'services';

interface SyncManifestProps {
  siteId: string;
  disabled?: boolean;
}

/**
 * Button for initiating a task to pull manifests from RCRAInfo
 * @constructor
 */
function SyncManifestBtn({ siteId, disabled }: SyncManifestProps) {
  const [syncingMtn, setSyncingMtn] = useState(false);

  if (!siteId || disabled) {
    disabled = true;
  }

  return (
    <Button
      variant="primary"
      disabled={disabled}
      className="mx-2"
      onClick={() => {
        setSyncingMtn(!syncingMtn);
        htApi
          .post('/trak/site/manifest/sync', { siteId: `${siteId}` })
          .then((r) => console.log(r))
          .catch((reason) => console.log(reason));
      }}
    >
      {/*Sync <FontAwesomeIcon icon="sync" spin={syncingMtn} />*/}
      Sync Manifest
    </Button>
  );
}

export default SyncManifestBtn;
