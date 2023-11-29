import { Manifest, ManifestForm } from 'components/Manifest';
import { RcraSiteType } from 'components/Manifest/manifestSchema';
import { SiteSelect, SiteTypeSelect } from 'components/Manifest/SiteSelect';
import { RcraSite } from 'components/RcraSite';
import { HtCard } from 'components/UI';
import { useTitle } from 'hooks';
import React, { useState } from 'react';
import { Col, Container, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { siteByEpaIdSelector, useAppSelector } from 'store';

/**
 * NewManifest component allows a user to create a new electronic manifest.
 * It requires that the site the user is drafting the manifest for is specified,
 * if haztrak cannot determine the site, the user will be prompted to select the site before
 * presenting the manifest form.
 * @constructor
 */
export function NewManifest() {
  useTitle('New Manifest');
  const { control } = useForm();
  const { siteId } = useParams();
  const rcraSite = useAppSelector(siteByEpaIdSelector(siteId));
  const [manifestingSite, setManifestingSite] = useState<RcraSite | undefined>(rcraSite);
  const [selectedSiteType, setSelectedSiteType] = useState<RcraSiteType | undefined>(
    rcraSite?.siteType === 'Generator' ? rcraSite.siteType : undefined
  );
  const [manifestingSiteType, setManifestingSiteType] = useState<RcraSiteType | undefined>(
    rcraSite?.siteType
  );

  const handleSiteChange = (site: any) => {
    setManifestingSite(site);
    setManifestingSiteType(site.siteType);
    if (site.siteType === 'Generator') {
      setSelectedSiteType(site.siteType);
    }
  };

  if (!selectedSiteType || !manifestingSite) {
    // If the manifesting site's role on the manifest can't be automatically determined, ask the user.
    return (
      <Container fluid className="py-3 d-flex justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <HtCard title="Select a Site">
            <HtCard.Body>
              <Form>
                <p>Which site are you starting a manifest as?</p>
                <SiteSelect
                  control={control}
                  value={manifestingSite}
                  handleChange={handleSiteChange}
                />
                <SiteTypeSelect
                  control={control}
                  siteType={manifestingSiteType}
                  value={selectedSiteType}
                  handleChange={setSelectedSiteType}
                  disabled={!manifestingSite}
                />
              </Form>
            </HtCard.Body>
          </HtCard>
        </Col>
      </Container>
    );
  }
  // pass the site as the selected handler type as an initial value to the new Manifest
  const newManifestData: Partial<Manifest> =
    selectedSiteType === 'Generator'
      ? { generator: manifestingSite }
      : selectedSiteType === 'Transporter'
      ? { transporters: [{ ...manifestingSite, order: 1 }] }
      : selectedSiteType === 'Tsdf'
      ? { designatedFacility: manifestingSite }
      : {};

  return <ManifestForm manifestData={newManifestData} />;
}
