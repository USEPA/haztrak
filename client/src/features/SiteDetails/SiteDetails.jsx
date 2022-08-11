import React from 'react';
import HtCard from '../../components/HtCard';
import { useParams } from 'react-router-dom';
import SiteDetailActions from './ActionDropdown';
import { useEffect, useState } from 'react';
import api from '../../services';
import { Col, Row } from 'react-bootstrap';

function renderSiteDetail({ siteHandler }) {
  const sa = siteHandler.siteAddress;
  const ma = siteHandler.mailingAddress;
  const siteAddress = `${sa.streetNumber} ${sa.address1}, ${sa.city} ${sa.state.code} ${sa.zip}`;
  const mailAddress = `${ma.streetNumber} ${ma.address1}, ${ma.city} ${ma.state.code} ${ma.zip}`;
  return (
    <>
      <b>Name</b>
      <Row>
        <Col>
          <p>{siteHandler.name}</p>
        </Col>
        <Col>
          <p>
            Can e-Sign:{' '}
            {siteHandler.hasRegisteredEmanifestUser ? (
              <i className="align-text-bottom text-success fa-solid fa-circle-check"></i>
            ) : (
              <i className="align-text-bottom text-danger fa-solid fa-circle-xmark"></i>
            )}
          </p>
        </Col>
      </Row>
      <hr />
      <b>Site Address</b>
      <p>{siteAddress}</p>
      <b>Mail Address</b>
      <p>{mailAddress}</p>
    </>
  );
}

/**
 * Display details of the selected Site model
 * @returns {JSX.Element}
 * @constructor
 */
function SiteDetails() {
  // pull parameter Id from the URL
  let params = useParams();
  const [siteData, setSiteData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`trak/site/${params.siteId}`, null)
      .then((response) => {
        setSiteData(response);
      })
      .then(() => setLoading(false))
      .catch(setError);
  }, [params.siteId]);

  return (
    <>
      <HtCard>
        <HtCard.Header title={params.siteId}>
          <SiteDetailActions />
        </HtCard.Header>
        <HtCard.Body>
          {loading ? (
            <HtCard.Spinner />
          ) : siteData ? (
            <>{renderSiteDetail(siteData)}</>
          ) : (
            <p>error</p>
          )}
        </HtCard.Body>
      </HtCard>
    </>
  );
}

export default SiteDetails;
