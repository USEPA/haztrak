import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from 'services';
import { Button, Row, Col, Container, Table } from 'react-bootstrap';
import HtCard from 'components/HtCard';
import HtTooltip from 'components/HtTooltip';

interface SiteManifest {
  generator: string[];
  transporter: string[];
  tsd: string[];
}

function manifestTable(manifest: string[], title: string): JSX.Element | null {
  if (manifest.length === 0) {
    return null;
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
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {manifest.map((mtn, i) => {
              return (
                <tr key={i}>
                  <td>{mtn}</td>
                  <td>status</td>
                  <td>
                    <HtTooltip text={`View: ${mtn}`}>
                      <Link to={`/manifest/${mtn}/view`}>
                        <i className="fa-solid fa-eye"></i>
                      </Link>
                    </HtTooltip>
                  </td>
                  <td>
                    <HtTooltip text={`Edit ${mtn}`}>
                      <Link to={`/manifest/${mtn}/edit`}>
                        <i className="fa-solid fa-file-lines"></i>
                      </Link>
                    </HtTooltip>
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

function SiteManifests(): JSX.Element {
  let params = useParams();
  const [loading, setLoading] = useState(false);
  const [siteManifest, setSiteManifest] = useState<SiteManifest | undefined>(
    undefined
  );

  useEffect(() => {
    setLoading(true);
    api
      .get(`trak/site/${params.siteId}/manifest`, null)
      .then((response) => {
        setSiteManifest(response as SiteManifest);
      })
      .then(() => setLoading(false));
  }, [params.siteId]);

  return (
    <>
      <Container className="py-2">
        <Row className="d-flex justify-content-between">
          <Col className="d-flex justify-content-start">
            <h2>{params.siteId}</h2>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button variant="success">
              <Link
                className="text-decoration-none text-white"
                to={`/manifest/new/edit`}
              >
                New Manifest
              </Link>
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
          {siteManifest ? (
            manifestTable(siteManifest.generator, 'Generator')
          ) : (
            <></>
          )}
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
