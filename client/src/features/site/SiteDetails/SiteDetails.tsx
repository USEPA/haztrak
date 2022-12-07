import HtCard from 'components/HtCard';
import HtDropdown from 'components/HtDropdown';
import React, { ReactElement, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import htApi from 'services';
import { Site } from 'types/Handler';

function renderSiteDetail({ siteHandler }: Site): ReactElement {
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
 * Display details of the selected site model
 * @constructor
 */
function SiteDetails(): ReactElement {
  // pull parameter ID from the URL
  let params = useParams();
  const [siteData, setSiteData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    htApi
      .get(`trak/site/${params.siteId}`)
      .then((response) => {
        setLoading(false);
        setSiteData(response.data);
      })
      .catch(setError);
  }, [params.siteId]);

  return (
    <>
      <HtCard>
        <HtCard.Header title={params.siteId}>
          <HtDropdown links={[{ name: 'hello', path: '#/blah/' }]} />
        </HtCard.Header>
        <HtCard.Body>
          {loading ? (
            <HtCard.Spinner message="Loading site details..." />
          ) : siteData ? (
            <>{renderSiteDetail(siteData)}</>
          ) : (
            <p>{error}</p>
          )}
        </HtCard.Body>
      </HtCard>
    </>
  );
}

export default SiteDetails;
