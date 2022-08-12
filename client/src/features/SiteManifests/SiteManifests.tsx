import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services';
import {Container, Table} from 'react-bootstrap';
import HtCard from '../../components/HtCard';
import HtTooltip from '../../components/HtTooltip';

interface SiteManifest {
  generator: string[];
  transporter: string[];
  tsd: string[];
}

function manifestTable(manifest: string[]) {
  return (
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
  );
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

  return (
    <>
      <Container>
        <HtCard>
          <HtCard.Header title="Designated Receiving Facility"/>
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
