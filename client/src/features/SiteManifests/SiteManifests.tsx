import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services';
import { Container, Table } from 'react-bootstrap';
import HtCard from '../../components/HtCard';

interface SiteManifest {
  generator: string[];
  transporter: string[];
  tsd: string[];
}

function SiteManifests() {
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

  function manifestTable(manifest: string[]) {
    return (
      <Table hover>
        <thead>
          <tr>
            <th>Manifest Tracking Number</th>
          </tr>
        </thead>
        <tbody>
          {manifest.map((mtn, i) => {
            return (
              <tr key={i}>
                <td>{mtn}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  return (
    <>
      <Container>
        <HtCard>
          <HtCard.Header title="Designated Receiving Facility" />
          <HtCard.Body>
            {siteManifest ? (
              manifestTable(siteManifest.tsd)
            ) : (
              <p>no manifest</p>
            )}
          </HtCard.Body>
        </HtCard>
        <HtCard>
          <HtCard.Header title="Generator" />
          <HtCard.Body>
            {siteManifest ? (
              manifestTable(siteManifest.generator)
            ) : (
              <p>no manifest</p>
            )}
          </HtCard.Body>
        </HtCard>
        <HtCard>
          <HtCard.Header title="Transporter" />
          <HtCard.Body>
            {siteManifest ? (
              manifestTable(siteManifest.transporter)
            ) : (
              <p>no manifest</p>
            )}
          </HtCard.Body>
        </HtCard>
      </Container>
    </>
  );
}

export default SiteManifests;
