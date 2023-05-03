import { ManifestForm } from 'components/Manifest';
import { SiteTypeSelect } from 'components/Manifest/SiteTypeSelect';
import { useTitle } from 'hooks';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

export function ManifestNew() {
  useTitle('New Manifest');
  const { siteId } = useParams();
  const [manifestingSiteType, setManifestingSiteType] = useState<
    'generator' | 'designatedFacility' | 'transporter' | undefined
  >(undefined);
  const { control } = useForm();
  if (manifestingSiteType === undefined) {
    return (
      <SiteTypeSelect
        control={control}
        siteType={manifestingSiteType}
        setSiteType={setManifestingSiteType}
        siteId={siteId}
      />
    );
  }
  return <ManifestForm />;
}
