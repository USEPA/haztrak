import { ManifestForm } from 'components/Manifest';
import { useTitle } from 'hooks';
import React from 'react';

export function ManifestNew() {
  useTitle('New Manifest');

  return <ManifestForm />;
}
