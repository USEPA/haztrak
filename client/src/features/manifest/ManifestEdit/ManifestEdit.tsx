import ManifestForm from 'components/ManifestForm/ManifestForm';
import React, { ReactElement, useEffect } from 'react';
import { useParams } from 'react-router-dom';

type ManifestParams = {
  mtn?: string;
};

/**
 * Used for editing a manifest via ManifestForm, existing manifest should be retrieved from server
 * @constructor
 */
function ManifestEdit(): ReactElement {
  // we can get the desired manifest tracking number from the URL
  const { mtn } = useParams<ManifestParams>();

  useEffect(() => {
    // ToDo: use URL parameter to get existing manifest object and pass to ManifestForm
  }, [mtn]);
  return <ManifestForm />;
}

export default ManifestEdit;
