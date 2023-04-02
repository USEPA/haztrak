import HandlerDetails from 'components/HandlerDetails';
import { HtCard } from 'components/Ht';
import useHtAPI from 'hooks/useHtAPI';
import React, { ReactElement } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Site } from 'types/handler';
import { SyncManifestBtn } from 'components/buttons';
import { Container, Button } from 'react-bootstrap';

/**
 * GET and Display details of the hazardous waste site specified in the URL
 * @constructor
 */
function SiteDetails(): ReactElement {
  let { siteId } = useParams();
  const [siteData, loading, error] = useHtAPI<Site>(`site/${siteId}`);
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
            <HandlerDetails handler={siteData.handler} />
          ) : (
            <></>
          )}
        </HtCard.Body>
      </HtCard>
    </Container>
  );
}

export default SiteDetails;
