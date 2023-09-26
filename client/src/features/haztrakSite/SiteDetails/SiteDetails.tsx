import { SyncManifestBtn } from 'components/buttons';
import { HaztrakSite } from 'components/HaztrakSite';
import { HtCard } from 'components/Ht';
import { RcraSiteDetails } from 'components/RcraSite';
import { useHtApi } from 'hooks';
import React, { ReactElement } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * GET and Display details of the Haztrak site including RCRA site details.
 *
 * This could be expanded to include other information about a haztrak site
 * if, for example, the site also had information relevant to the office of water (OW)
 * of data that's not directly related to any regulatory agency (the site's users).
 * @constructor
 */
export function SiteDetails(): ReactElement {
  let { siteId } = useParams();
  const [siteData, loading, error] = useHtApi<HaztrakSite>(`site/${siteId}`);
  const navigate = useNavigate();

  if (error) throw error;
  return (
    <Container className="py-3">
      <div className="mx-1 d-flex flex-row-reverse">
        <SyncManifestBtn siteId={siteId ? siteId : ''} />
        <Button variant="primary" onClick={() => navigate(`/site/${siteId}/manifest`)}>
          View Manifest
        </Button>
      </div>
      <HtCard>
        <HtCard.Header title={siteId} />
        <HtCard.Body>
          {loading ? (
            <HtCard.Spinner message="Loading site details..." />
          ) : siteData ? (
            <RcraSiteDetails handler={siteData.handler} />
          ) : (
            <></>
          )}
        </HtCard.Body>
      </HtCard>
    </Container>
  );
}
