import { HtCard } from 'components/Ht';
import { RcraProfile } from 'components/RcraProfile';
import { UserProfile } from 'components/UserProfile';
import { ProfileState } from 'store/profileSlice/profile.slice';
import { HaztrakUser, selectUser } from 'store/authSlice/auth.slice';
import { useTitle } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'store';
import { getRcraProfile, selectRcraProfile } from 'store/profileSlice';

/**
 * Display user profile
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
                <UserProfile user={user} profile={profile} />
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
