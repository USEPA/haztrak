import { HtCard } from 'components/Ht';
import { Manifest, ManifestForm } from 'components/Manifest';
import { SiteSelect, SiteTypeSelect } from 'components/Manifest/SiteSelect';
import { RcraSite } from 'components/RcraSite';
import { useTitle } from 'hooks';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState, useAppSelector } from 'store';
import { RcraProfileState, getSiteByEpaId } from 'store/rcraProfileSlice/rcraProfile.slice';

export function ManifestNew() {
  useTitle('New Manifest');
  const { siteId } = useParams();
  const [manifestingSiteType, setManifestingSiteType] = useState<
    'generator' | 'designatedFacility' | 'transporter' | undefined
  >(undefined);
  const rcraSite = useAppSelector(getSiteByEpaId(siteId));
  const [manifestingSite, setManifestingSite] = useState<RcraSite | undefined | null>(rcraSite);
  const { control } = useForm();
  // If the site that needs to start a manifest, or its role on the manifest
  // can't be determined, ask the user.
  if (!manifestingSiteType || !manifestingSite) {
    return (
      <HtCard>
        <HtCard.Body>
          <p>Which site are you starting a manifest as?</p>
          <SiteSelect
            control={control}
            selectedSite={manifestingSite}
            setSelectedSite={setManifestingSite}
          />
          <SiteTypeSelect
            control={control}
            siteType={manifestingSiteType}
            setSiteType={setManifestingSiteType}
            siteId={siteId}
          />
        </HtCard.Body>
      </HtCard>
    );
  }
  // pass the site as the selected handler type as an initial value to the new Manifest
  const newManifestData: Partial<Manifest> =
    manifestingSiteType === 'generator'
      ? { generator: manifestingSite }
      : manifestingSiteType === 'transporter'
      ? { transporters: [{ ...manifestingSite, order: 1 }] }
      : manifestingSiteType === 'designatedFacility'
      ? { designatedFacility: manifestingSite }
      : {};

  return <ManifestForm manifestData={newManifestData} />;
}
