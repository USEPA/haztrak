import { HtCard } from 'components/Ht';
import { ManifestForm } from 'components/Manifest';
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
  const [manifestingSite, setManifestingSite] = useState<RcraSite | null>(null);
  const { control } = useForm();
  console.log(manifestingSite);
  if (!manifestingSiteType || !siteId) {
    return (
      <HtCard>
        <HtCard.Body>
          {siteId ? null : (
            <>
              <SiteSelect
                control={control}
                selectedSite={manifestingSite}
                setSelectedSite={setManifestingSite}
              />
            </>
          )}
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
  return <ManifestForm />;
}
