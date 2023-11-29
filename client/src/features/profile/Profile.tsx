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
  ProfileSlice,
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
  const profile: ProfileSlice | undefined = useAppSelector(selectRcraProfile);
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
        <Row xs={1} lg={2} className="my-3 gap-2">
          <Col>
            <HtCard title="User Information" className="h-100 my-2">
              <HtCard.Body>
                <UserInfoForm user={user} profile={profile} />
              </HtCard.Body>
            </HtCard>
          </Col>
          <Col>
            <HtCard title="My Organization" className="h-100 my-2">
              <HtCard.Body>{profile.org && <UserOrg profile={profile} />}</HtCard.Body>
            </HtCard>
          </Col>
        </Row>
        <Row>
          <Col>
            <HtCard title="RCRAInfo Profile">
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
