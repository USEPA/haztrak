import { ManifestForm } from 'components/Manifest';
import { Manifest } from 'components/Manifest/manifestSchema';
import { HtSpinner } from 'components/UI';
import { useHtApi, useTitle } from 'hooks';
import React from 'react';
import { useParams } from 'react-router-dom';

export function ManifestDetails() {
  const { mtn, action, siteId } = useParams();
  useTitle(`${mtn}`);
  const [manifestData, loading, error] = useHtApi<Manifest>(`rcra/manifest/${mtn}`);

  let readOnly = true;
  if (action === 'edit') {
    readOnly = false;
  }

  if (error) {
    // TODO: add global error handling via redux
    return (
      <div className="text-danger">
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
      </div>
    );
  }

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
    <div className="text-danger">
      <h2>Something went wrong</h2>
    </div>
  );
}
