import { RcraSiteDetails } from 'components/RcraSite';
import { HtCard } from 'components/Ht';
import { useHtAPI } from 'hooks';
import React, { ReactElement } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SyncManifestBtn } from 'components/buttons';
import { Container, Button } from 'react-bootstrap';
import { HaztrakSite } from 'components/HaztrakSite';

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
  const [siteData, loading, error] = useHtAPI<HaztrakSite>(`site/${siteId}`);
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
