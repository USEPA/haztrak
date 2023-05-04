import { HtCard } from 'components/Ht';
import { Manifest, ManifestForm } from 'components/Manifest';
import { SiteSelect, SiteTypeSelect } from 'components/Manifest/SiteSelect';
import { RcraSite } from 'components/RcraSite';
import { useTitle } from 'hooks';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { RootState, useAppSelector } from 'store';
import { RcraProfileState } from 'store/rcraProfileSlice/rcraProfile.slice';

export function ManifestNew() {
  useTitle('New Manifest');
  const { siteId } = useParams();
  const [manifestingSiteType, setManifestingSiteType] = useState<
    'generator' | 'designatedFacility' | 'transporter' | undefined
  >(undefined);
  const { rcraSites } = useAppSelector<RcraProfileState>((state: RootState) => state.rcraProfile);
  let userSite = null;
  if (rcraSites) {
    if (siteId) {
      userSite = rcraSites[siteId].site.handler;
    }
  }
  const [manifestingSite, setManifestingSite] = useState<RcraSite | null>(userSite);
  const { control } = useForm();
  if (!manifestingSiteType || !manifestingSite) {
    return (
      <HtCard>
        <HtCard.Body>
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
