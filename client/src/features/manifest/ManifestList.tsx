import { HtSpinner } from 'components/Ht';
import React, { ReactElement } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import useHtAPI from 'hooks/useHtAPI';
import useTitle from 'hooks/useTitle';
import SyncManifestBtn from 'components/SyncManifestBtn';
import ManifestTable from 'components/ManifestTable';

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
 * Fetch and display all the manifests, known by haztrak, associated with a site.
 * @constructor
 */
function ManifestList(): ReactElement {
  let { siteId } = useParams();
  useTitle(`${siteId} Manifest`);
  const navigate = useNavigate();

  const [siteManifest, loading, error] = useHtAPI<SiteManifest>(
    `trak/site/${siteId}/manifest`
  );

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
          {siteManifest ? (
            ManifestTable(siteManifest.tsd, 'Designated Receiving Facility')
          ) : (
            <></>
          )}
          {siteManifest ? ManifestTable(siteManifest.generator, 'Generator') : <></>}
          {siteManifest ? (
            ManifestTable(siteManifest.transporter, 'Transporter')
          ) : (
            <></>
          )}
        </Col>
      </Container>
    </>
  );
}

export default ManifestList;
