import { NewManifestBtn } from 'components/buttons/NewManifestBtn';
import { HtCard } from 'components/Ht';
import React, { ReactElement, useState } from 'react';
import { Col, Container, Dropdown, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useTitle, useHtAPI } from 'hooks';
import { SyncManifestBtn } from 'components/buttons';
import { MtnTable, MtnDetails } from 'components/Mtn';

/**
 * Fetch and display all the manifest tracking number (MTN) known by haztrak
 * @constructor
 */
export function ManifestList(): ReactElement {
  let { siteId } = useParams();
  useTitle(`${siteId || ''} Manifest`);
  const [pageSize, setPageSize] = useState(10);

  let getUrl = 'trak/mtn';
  if (siteId) {
    getUrl = `trak/mtn/${siteId}`;
  }

  const [mtnList, loading, error] = useHtAPI<Array<MtnDetails>>(getUrl);

  if (error) {
    console.error(error.message);
    throw error;
  }

  return (
    <>
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
    </>
  );
}
