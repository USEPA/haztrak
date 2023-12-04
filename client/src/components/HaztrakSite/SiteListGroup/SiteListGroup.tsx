import { HaztrakSite } from 'components/HaztrakSite/haztrakSiteSchema';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { SiteListItem } from 'components/HaztrakSite/SiteListItem/SiteListItem';
import { SiteFilterForm } from 'components/HaztrakSite/SiteFilter/SiteFilterForm';
import React, { useState } from 'react';
import winkingRobot from '/assets/img/robot/robot-wink.jpg';

interface SiteListGroupProps {
  sites: Array<HaztrakSite>;
}

export function SiteListGroup({ sites }: SiteListGroupProps) {
  const [filteredSites, setFilteredSites] = useState(sites);

  return (
    <>
      <Row className="pb-3 d-flex justify-content-end">
        <Col xs={8} sm={6} md={4}>
          <SiteFilterForm sites={sites} setFilteredSites={setFilteredSites} />
        </Col>
      </Row>
      {filteredSites.length === 0 ? (
        <Container fluid>
          <Col className="d-flex justify-content-center">
            <img
              src={winkingRobot}
              alt="winking robot"
              width={200}
              height={'auto'}
              className="d-flex justify-content-center"
            />
          </Col>
          <h4 className="text-center">No sites matched that search</h4>
        </Container>
      ) : (
        <ListGroup numbered as="ol">
          {filteredSites.map((site) => {
            return <SiteListItem key={site.handler.epaSiteId} site={site} />;
          })}
        </ListGroup>
      )}
    </>
  );
}
