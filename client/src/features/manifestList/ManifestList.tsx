import { SyncManifestBtn } from 'components/buttons';
import { NewManifestBtn } from 'components/buttons/NewManifestBtn';
import { HtCard } from 'components/Ht';
import { MtnDetails, MtnTable } from 'components/Mtn';
import { useHtApi, useTitle } from 'hooks';
import React, { ReactElement, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

/**
 * Fetch and display all the manifest tracking number (MTN) known by haztrak
 * @constructor
 */
export function ManifestList(): ReactElement {
  let { siteId } = useParams();
  useTitle(`${siteId || ''} Manifest`);
  const [pageSize, setPageSize] = useState(10);

  let getUrl = 'rcra/mtn';
  if (siteId) {
    getUrl = `rcra/mtn/${siteId}`;
  }

  const [mtnList, loading, error] = useHtApi<Array<MtnDetails>>(getUrl);

  if (error) {
    console.error(error.message);
    throw error;
  }

  return (
    <Container className="py-2">
      <Container className="py-2">
        <Row className="d-flex justify-content-between">
          <Col className="d-flex justify-content-start">
            <h2>{siteId}</h2>
          </Col>
          <Col className="d-flex justify-content-end" xl>
            <SyncManifestBtn siteId={siteId} disabled={!siteId} />
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
