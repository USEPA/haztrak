import HtCard from 'components/HtCard';
import HtDropdown from 'components/HtDropdown';
import useHtAPI from 'hooks/useHtAPI';
import React, { ReactElement } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
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
 * GET and Display details of the hazardous waste site specified in the URL
 * @constructor
 */
function SiteDetails(): ReactElement {
  let { siteId } = useParams();
  const [siteData, loading, error] = useHtAPI<Site>(`trak/site/${siteId}`);

  return (
    <>
      <HtCard>
        <HtCard.Header title={siteId}>
          <HtDropdown links={[{ name: 'hello', path: '#/blah/' }]} />
        </HtCard.Header>
        <HtCard.Body>
          {loading ? (
            <HtCard.Spinner message="Loading site details..." />
          ) : siteData ? (
            <>{renderSiteDetail(siteData)}</>
          ) : (
            <p>{error?.message}</p>
          )}
        </HtCard.Body>
      </HtCard>
    </>
  );
}

export default SiteDetails;
