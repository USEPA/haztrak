import { UserOrg } from 'components/Org';
import { RcraProfile } from 'components/RcraProfile';
import { HtCard } from 'components/UI';
import { UserInfoForm } from 'components/User';
import { useTitle } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import {
  getRcraProfile,
  HaztrakUser,
  ProfileState,
  selectRcraProfile,
  selectUser,
  useAppDispatch,
  useAppSelector,
} from 'store';

/**
 * Display user profile, including their Haztrak information, their organization,
 * and their RCRAInfo profile.
 * @constructor
 */
export function Profile(): ReactElement {
  const dispatch = useAppDispatch();
  const profile: ProfileState | undefined = useAppSelector(selectRcraProfile);
  const user: HaztrakUser | undefined = useAppSelector(selectUser);
  useTitle('Profile');

  if (!user) {
    return <div>loading...</div>;
  }

  useEffect(() => {
    dispatch(getRcraProfile());
  }, [profile.user]);

  return (
    <>
      <Container fluid className="py-2">
        <Row className="d-flex justify-content-start">
          <h1 className="fw-bold">Profile</h1>
        </Row>
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={11} lg={10} xl={8} className="justify-content-center">
            <HtCard>
              <HtCard.Header title="User Profile" />
              <HtCard.Body>
                <Container>
                  <UserInfoForm user={user} profile={profile} />
                  {profile.org && <UserOrg profile={profile} />}
                </Container>
              </HtCard.Body>
            </HtCard>
            <HtCard>
              <HtCard.Header title="RCRAInfo Profile" />
              <HtCard.Body>
                {profile.rcrainfoProfile && <RcraProfile profile={profile.rcrainfoProfile} />}
              </HtCard.Body>
            </HtCard>
          </Col>
        </Row>
      </Container>
    </>
  );
}
