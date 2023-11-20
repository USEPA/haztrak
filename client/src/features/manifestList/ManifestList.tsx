import { SyncManifestBtn } from 'components/buttons';
import { NewManifestBtn } from 'components/buttons/NewManifestBtn';
import { HtCard } from 'components/Ht';
import { MtnTable } from 'components/Mtn';
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

  let getUrl = 'rcra/mtn';
  if (siteId) {
    getUrl = `rcra/mtn/${siteId}`;
  }

  // const [mtnList, loading, error] = useHtApi<Array<MtnDetails>>(getUrl);

  const { data, isLoading, error } = useGetMTNQuery(siteId, {
    pollingInterval: 1000,
    skip: !syncInProgress,
  });

  const mtnList = data;
  const loading = isLoading;

  if (error) {
    throw error;
  }

  console.log('syncInProgress', syncInProgress);
  console.log('data', data);

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
      </Container>
      <Container>
        <Col>
          <HtCard>
            <HtCard.Header title={`${siteId || 'Your'} Manifests`}></HtCard.Header>
            <HtCard.Body>
              {loading ? (
                <HtCard.Spinner />
              ) : mtnList ? (
                <MtnTable manifests={mtnList} pageSize={pageSize} />
              ) : (
                <></>
              )}
            </HtCard.Body>
          </HtCard>
        </Col>
      </Container>
    </Container>
  );
}
