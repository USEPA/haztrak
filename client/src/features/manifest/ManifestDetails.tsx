import { HtSpinner } from 'components/Ht';
import ManifestForm from 'components/ManifestForm';
import useHtAPI from 'hooks/useHtAPI';
import useTitle from 'hooks/useTitle';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Manifest } from 'types/manifest';

function ManifestDetails() {
  const { mtn, action, siteId } = useParams();
  useTitle(`${mtn}`);
  const [manifestData, loading, error] = useHtAPI<Manifest>(`trak/manifest/${mtn}`);

  let readOnly = true;
  if (action === 'edit') {
    readOnly = false;
  }

  if (error) throw error;

  return loading ? (
    <HtSpinner />
  ) : manifestData ? (
    <ManifestForm manifestData={manifestData} readOnly={readOnly} siteId={siteId} mtn={mtn} />
  ) : (
    <></>
  );
}

export default ManifestDetails;
