import ManifestForm from 'components/ManifestForm';
import useTitle from 'hooks/useTitle';
import React from 'react';

function ManifestNew() {
  useTitle('New Manifest');

  return <ManifestForm />;
}

export default ManifestNew;
