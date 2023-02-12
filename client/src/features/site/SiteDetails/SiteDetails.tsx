import HandlerDetails from 'components/HandlerDetails';
import HtCard from 'components/HtCard';
import useHtAPI from 'hooks/useHtAPI';
import React, { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { Site } from 'types/Handler';
import SyncManifestBtn from 'components/SyncManifestBtn';
import { Container } from 'react-bootstrap';

/**
 * GET and Display details of the hazardous waste site specified in the URL
 * @constructor
 */
function SiteDetails(): ReactElement {
  let { siteId } = useParams();
  const [siteData, loading, error] = useHtAPI<Site>(`trak/site/${siteId}`);

  if (error) throw error;
  return (
    <Container className="py-3">
      <div className="mx-1 d-flex flex-row-reverse">
        <SyncManifestBtn siteId={siteId ? siteId : ''} />
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
