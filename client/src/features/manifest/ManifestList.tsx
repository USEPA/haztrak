import { HtSpinner } from 'components/Ht';
import React, { ReactElement } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import useHtAPI from 'hooks/useHtAPI';
import useTitle from 'hooks/useTitle';
import SyncManifestBtn from 'components/SyncManifestBtn';
import MtnTable from 'components/MtnTable';

interface ManifestDetails {
  mtn: string;
  status: string;
}

interface SiteManifest {
  generator: Array<ManifestDetails>;
  transporter: Array<ManifestDetails>;
  tsd: Array<ManifestDetails>;
}

/**
 * Fetch and display all the manifest tracking number (MTN) known by haztrak
 * @constructor
 */
function ManifestList(): ReactElement {
  let { siteId } = useParams();
  useTitle(`${siteId || ''} Manifest`);
  const navigate = useNavigate();

  let getUrl = 'trak/manifest';
  if (siteId) {
    getUrl = `trak/site/${siteId}/manifest`;
  }

  const [manifests, loading, error] = useHtAPI<SiteManifest>(getUrl);

  if (error) throw error;

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
          {manifests ? MtnTable(manifests.tsd, 'Designated Receiving Facility') : <></>}
          {manifests ? MtnTable(manifests.generator, 'Generator') : <></>}
          {manifests ? MtnTable(manifests.transporter, 'Transporter') : <></>}
        </Col>
      </Container>
    </>
  );
}

export default ManifestList;
