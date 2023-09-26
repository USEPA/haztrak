import { HtSpinner } from 'components/Ht';
import { ManifestForm } from 'components/Manifest';
import { Manifest } from 'components/Manifest/manifestSchema';
import { useHtApi, useTitle } from 'hooks';
import React from 'react';
import { useParams } from 'react-router-dom';

export function ManifestDetails() {
  const { mtn, action, siteId } = useParams();
  useTitle(`${mtn}`);
  const [manifestData, loading, error] = useHtApi<Manifest>(`manifest/${mtn}`);

  let readOnly = true;
  if (action === 'edit') {
    readOnly = false;
  }

  if (error) throw error;

  return loading ? (
    <HtSpinner />
  ) : manifestData ? (
    <ManifestForm
      manifestData={manifestData}
      readOnly={readOnly}
      manifestingSiteID={siteId}
      mtn={mtn}
    />
  ) : (
    <></>
  );
}
