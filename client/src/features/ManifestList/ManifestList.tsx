import { NewManifestBtn } from 'components/Manifest';
import { MtnTable } from 'components/Mtn';
import { SyncManifestBtn } from 'components/Rcrainfo';
import { HtCard, HtSpinner } from 'components/UI';
import { useTitle } from 'hooks';
import React, { ReactElement, useState } from 'react';
import { Container, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetMTNQuery } from 'store';

/**
 * Fetch and display all the manifest tracking number (MTN) known by haztrak
 * @constructor
 */
export function ManifestList(): ReactElement {
  let { siteId } = useParams();
  useTitle(`${siteId || ''} Manifest`);
  const [pageSize, setPageSize] = useState(10);
  const [syncInProgress, setSyncInProgress] = useState(false);

  const { data, isLoading, error } = useGetMTNQuery(siteId, {
    pollingInterval: syncInProgress ? 1000 : 0,
  });

  return (
    <Container fluid className="py-2">
      <h1 className="h2 ms-0">{siteId ?? 'Your Manifests'}</h1>
      <Row className="px-5 py-2">
        <Stack direction="horizontal" gap={2} className="d-flex justify-content-end px-0 mx-0">
          <SyncManifestBtn
            siteId={siteId}
            disabled={!siteId}
            syncInProgress={syncInProgress}
            setSyncInProgress={setSyncInProgress}
          />
          <NewManifestBtn siteId={siteId} />
        </Stack>
      </Row>
      <Row className="px-5">
        <HtCard>
          <HtCard.Body>
            {isLoading ? (
              <HtSpinner />
            ) : data ? (
              <MtnTable manifests={data} pageSize={pageSize} />
            ) : (
              <></>
            )}
          </HtCard.Body>
        </HtCard>
      </Row>
    </Container>
  );
}
