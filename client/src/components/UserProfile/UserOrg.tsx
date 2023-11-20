import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MyOrgSites } from 'components/UserProfile/MyOrgSites';
import { MySitePermissions } from 'components/UserProfile/MySitePermissions';
import React from 'react';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { ProfileState } from 'store';
import { HaztrakProfileOrg } from 'store/profileSlice/profile.slice';

interface MandatoryOrgProfile extends ProfileState {
  org: HaztrakProfileOrg;
}

interface UserOrgProps {
  profile: MandatoryOrgProfile;
}

export function UserOrg({ profile }: UserOrgProps) {
  return (
    <>
      <Row>
        <hr />
        <h3 className="text-center">Organization</h3>
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
            <MySitePermissions sites={profile.sites} />
          </Tab>
          <Tab title="Other Sites in My Organization" eventKey="orgSites">
            <MyOrgSites org={profile.org} />
          </Tab>
        </Tabs>
      </Row>
    </>
  );
}
