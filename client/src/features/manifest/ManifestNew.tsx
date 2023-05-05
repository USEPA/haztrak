import { HtCard } from 'components/Ht';
import { Manifest, ManifestForm } from 'components/Manifest';
import { RcraSiteType } from 'components/Manifest/manifestSchema';
import { SiteSelect, SiteTypeSelect } from 'components/Manifest/SiteSelect';
import { RcraSite } from 'components/RcraSite';
import { useTitle } from 'hooks';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useAppSelector } from 'store';
import { getSiteByEpaId } from 'store/rcraProfileSlice/rcraProfile.slice';

export function ManifestNew() {
  useTitle('New Manifest');
  const { siteId } = useParams();
  const { control } = useForm();
  const rcraSite = useAppSelector(getSiteByEpaId(siteId));
  const [manifestingSite, setManifestingSite] = useState<RcraSite | undefined | null>(rcraSite);
  const [manifestingSiteType, setManifestingSiteType] = useState<RcraSiteType | undefined>();

  if (!manifestingSiteType || !manifestingSite) {
    // If the site that needs to start a manifest, or its role on the manifest
    // can't be determined, ask the user.
    return (
      <HtCard>
        <HtCard.Body>
          <Form>
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
          </Form>
        </HtCard.Body>
      </HtCard>
    );
  }
  // pass the site as the selected handler type as an initial value to the new Manifest
  const newManifestData: Partial<Manifest> =
    manifestingSiteType === 'Generator'
      ? { generator: manifestingSite }
      : manifestingSiteType === 'Transporter'
      ? { transporters: [{ ...manifestingSite, order: 1 }] }
      : manifestingSiteType === 'Tsdf'
      ? { designatedFacility: manifestingSite }
      : {};

  return <ManifestForm manifestData={newManifestData} />;
}
