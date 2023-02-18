import { HtSpinner } from 'components/Ht';
import React, { ReactElement } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import useHtAPI from 'hooks/useHtAPI';
import useTitle from 'hooks/useTitle';
import SyncManifestBtn from 'components/SyncManifestBtn';
import MtnTable from 'components/MtnTable';
import { MtnDetails } from 'types/Manifest/Manifest';

/**
 * Fetch and display all the manifest tracking number (MTN) known by haztrak
 * @constructor
 */
function ManifestList(): ReactElement {
  let { siteId } = useParams();
  useTitle(`${siteId || ''} Manifest`);
  const navigate = useNavigate();

  let getUrl = 'trak/mtn';
  if (siteId) {
    getUrl = `trak/mtn/${siteId}`;
    // getUrl = `trak/mtn`;
  }

  const [manifests, loading, error] = useHtAPI<Array<MtnDetails>>(getUrl);

  if (error) {
    console.error(error.message);
    throw error;
  }

  if (loading) {
    return <HtSpinner />;
  }

  return (
    <>
      <Container className="py-2">
        <Row className="d-flex justify-content-between">
          <Col className="d-flex justify-content-start">
            <h2>{siteId}</h2>
          </Col>
          <Col className="d-flex justify-content-end">
            <SyncManifestBtn siteId={siteId ? siteId : ''} />
            <Button variant="success" onClick={() => navigate('./new')}>
              New
            </Button>
          </Col>
        </Row>
      </Container>
      <Container>
        <Col>
          {manifests ? (
            <MtnTable title={`${siteId || 'Your'} Manifests`} manifests={manifests} />
          ) : (
            <></>
          )}
        </Col>
      </Container>
    </>
  );
}

export default ManifestList;
