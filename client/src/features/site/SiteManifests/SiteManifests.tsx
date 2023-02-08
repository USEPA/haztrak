import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HtCard from 'components/HtCard';
import HtSpinner from 'components/HtSpinner';
import HtTooltip from 'components/HtTooltip';
import React, { ReactElement, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useHtAPI from 'hooks/useHtAPI';
import useTitle from 'hooks/useTitle';
import htApi from 'services';

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
 * Returns a card with a table of manifests
 * @param manifest
 * @param title
 */
// ToDo refactor to component
function manifestTable(
  manifest: Array<ManifestDetails>,
  title: string
): ReactElement | null {
  if (manifest.length === 0) {
    // ToDo add something here that says 'this site has no known manifests'
    return <></>;
  }
  return (
    <HtCard>
      <HtCard.Header title={title} />
      <HtCard.Body>
        <Table hover>
          <thead>
            <tr>
              <th>Manifest Tracking Number</th>
              <th>Status</th>
              <th className="d-flex justify-content-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {manifest.map(({ mtn, status }, i) => {
              return (
                <tr key={i}>
                  <td>{mtn}</td>
                  <td>{status}</td>
                  <td>
                    <div className="d-flex justify-content-evenly">
                      <HtTooltip text={`View: ${mtn}`}>
                        <Link
                          to={`/manifest/${mtn}/view`}
                          aria-label={`viewManifest${mtn}`}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </Link>
                      </HtTooltip>
                      <HtTooltip text={`Edit ${mtn}`}>
                        <Link
                          to={`/manifest/${mtn}/edit`}
                          aria-label={`editManifest${mtn}`}
                        ></Link>
                      </HtTooltip>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </HtCard.Body>
    </HtCard>
  );
}

/**
 * Fetch and display all the manifests, known by haztrak, associated with a site.
 * @constructor
 */
function SiteManifests(): ReactElement {
  let { siteId } = useParams();
  useTitle(`${siteId} Manifest`);
  const navigate = useNavigate();
  const [syncingMtn, setSyncingMtn] = useState(false);

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
            <Button
              variant="primary"
              className="mx-2"
              onClick={() => {
                setSyncingMtn(!syncingMtn);
                htApi
                  .post('/trak/manifest/sync', { siteId: `${siteId}` })
                  .then((r) => console.log(r))
                  .catch((reason) => console.log(reason));
                console.log('ToDo: send request');
              }}
            >
              Sync <FontAwesomeIcon icon="sync" spin={syncingMtn} />
            </Button>
            <Button variant="success" onClick={() => navigate('/manifest/new/edit')}>
              New
            </Button>
          </Col>
        </Row>
      </Container>
      <Container>
        <Col>
          {siteManifest ? (
            manifestTable(siteManifest.tsd, 'Designated Receiving Facility')
          ) : (
            <></>
          )}
          {siteManifest ? manifestTable(siteManifest.generator, 'Generator') : <></>}
          {siteManifest ? (
            manifestTable(siteManifest.transporter, 'Transporter')
          ) : (
            <></>
          )}
        </Col>
      </Container>
    </>
  );
}

export default SiteManifests;
