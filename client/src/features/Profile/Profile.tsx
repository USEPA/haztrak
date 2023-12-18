import { UserOrg } from 'components/Org';
import { RcraProfile } from 'components/RcraProfile';
import { HtCard, HtSpinner } from 'components/UI';
import { UserInfoForm } from 'components/User';
import { useTitle } from 'hooks';
import React, { ReactElement } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useGetProfileQuery, useGetRcrainfoProfileQuery, useGetUserQuery } from 'store';

/**
 * Display user profile, including their Haztrak information, their organization,
 * and their RCRAInfo profile.
 * @constructor
 */
export function Profile(): ReactElement {
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
  const { data: user, isLoading: userLoading } = useGetUserQuery();
  const { data: rcrainfoProfile } = useGetRcrainfoProfileQuery('testuser1');
  const isLoading = profileLoading || userLoading;
  useTitle('Profile');

  if (isLoading ?? !user ?? !profile) {
    return <HtSpinner center />;
  }

  return (
    <>
      <Container fluid className="py-2">
        <Row className="d-flex justify-content-start">
          <h1 className="fw-bold">Profile</h1>
        </Row>
        <Row className="my-3">
          <Col xs={12} lg={6} className="my-3">
            <HtCard title="User Information" className="h-100 my-2">
              <HtCard.Body>
                <UserInfoForm user={user} profile={profile} />
              </HtCard.Body>
            </HtCard>
          </Col>
          <Col xs={12} lg={6} className="my-3">
            <HtCard title="My Organization" className="h-100 my-2">
              <HtCard.Body>{profile.org && <UserOrg profile={profile} />}</HtCard.Body>
            </HtCard>
          </Col>
        </Row>
        <Row>
          <Col>
            <HtCard title="RCRAInfo Profile">
              <HtCard.Body>
                {rcrainfoProfile && <RcraProfile profile={rcrainfoProfile} />}
              </HtCard.Body>
            </HtCard>
          </Col>
        </Row>
      </Container>
    </>
  );
}
