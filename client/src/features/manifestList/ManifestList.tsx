import { NewManifestBtn } from 'components/Manifest';
import { MtnTable } from 'components/Mtn';
import { SyncManifestBtn } from 'components/Rcrainfo';
import { HtCard } from 'components/UI';
import { useTitle } from 'hooks';
import React, { ReactElement, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
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
    <Container className="py-2">
      <Container className="py-2">
        <Row className="d-flex justify-content-between">
          <Col className="d-flex justify-content-start">
            <h2>{siteId}</h2>
          </Col>
          <Col className="d-flex justify-content-end" xl>
            <SyncManifestBtn
              siteId={siteId}
              disabled={!siteId}
              syncInProgress={syncInProgress}
              setSyncInProgress={setSyncInProgress}
            />
            <NewManifestBtn siteId={siteId} />
          </Col>
        </Row>
        <Row>
          <HtCard>
            <HtCard.Header title={`${siteId || 'Your'} Manifests`}></HtCard.Header>
            <HtCard.Body>
              {isLoading ? (
                <HtCard.Spinner />
              ) : data ? (
                <MtnTable manifests={data} pageSize={pageSize} />
              ) : (
                <></>
              )}
            </HtCard.Body>
          </HtCard>
        </Row>
      </Container>
    </Container>
  );
}
