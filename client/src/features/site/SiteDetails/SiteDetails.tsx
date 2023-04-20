import { RcraSiteDetails } from 'components/RcraSiteDetails';
import { HtCard } from 'components/Ht';
import { useHtAPI } from 'hooks';
import React, { ReactElement } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HaztrakSite } from 'types/site';
import { SyncManifestBtn } from 'components/buttons';
import { Container, Button } from 'react-bootstrap';

/**
 * GET and Display details of the Haztrak site including RCRA site details.
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
