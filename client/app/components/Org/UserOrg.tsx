import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SiteAccess } from 'components/User/SiteAccess';
import React from 'react';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { ProfileSlice } from 'store';
import { OrgSitesTable } from './OrgSitesTable';

interface UserOrgProps {
  profile: ProfileSlice;
}

export function UserOrg({ profile }: UserOrgProps) {
  if (!profile.org) {
    return <></>;
  }

  return (
    <>
      <Row>
        <Col>
          <h6>
            <b>Name</b>
          </h6>
          <p>{profile.org.name ?? 'My Organization'}</p>
        </Col>
        <Col>
          <h6>
            <b>Integrated with Rcrainfo?</b>
          </h6>
          <p>
            {profile.org.rcrainfoIntegrated ? (
              <span>
                Yes <FontAwesomeIcon icon={faCheck} className="text-success" />
              </span>
            ) : (
              <span>
                No <FontAwesomeIcon icon={faX} className="text-danger" />
              </span>
            )}
          </p>
        </Col>
      </Row>
      <Row>
        <Tabs fill>
          <Tab title="My Sites" eventKey="mySites">
            <SiteAccess sites={profile.sites} />
          </Tab>
          <Tab title="Other Sites in My Organization" eventKey="orgSites">
            <OrgSitesTable org={profile.org} />
          </Tab>
        </Tabs>
      </Row>
    </>
  );
}
