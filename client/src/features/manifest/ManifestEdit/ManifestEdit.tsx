import React, { ReactElement, useEffect } from 'react';
import { Manifest } from 'types';
import { useParams } from 'react-router-dom';
import ManifestForm from 'components/ManifestForm/ManifestForm';

interface Props {
  manifest?: Manifest;
}

type ManifestParams = {
  mtn?: string;
};

/**
 * Used for editing a manifest via ManifestForm, the mtn to edit is known from
 * the MTN entered into the URL
 * @constructor
 */
function ManifestEdit(props: Props): ReactElement {
  // we can get the desired manifest tracking number from the URL
  const { mtn } = useParams<ManifestParams>();
  // Todo: get the manifest (by mtn) if it already exists in Haztrak

  useEffect(() => {
    console.log(`manifest to check for: ${mtn}`);
  }, [mtn]);
  return <ManifestForm />;
}

export default ManifestEdit;
