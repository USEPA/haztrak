import { HtCard } from 'components/Ht';
import { HaztrakUser, selectUser } from 'store/userSlice/user.slice';
import { RcraProfile } from './RcraProfile';
import { UserProfile } from './UserProfile';
import { useTitle } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'store';
import { getProfile, selectRcraProfile } from 'store/rcraProfileSlice';

/**
 * Display user profile
 * @constructor
 */
export function Profile(): ReactElement {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectRcraProfile);
  const user: HaztrakUser | undefined = useAppSelector(selectUser);
  useTitle('Profile');

  if (!user) {
    return <div>loading...</div>;
  }

  useEffect(() => {
    dispatch(getProfile());
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
                <UserProfile user={user} />
              </HtCard.Body>
            </HtCard>
            <HtCard>
              <HtCard.Header title="RCRAInfo Profile" />
              <HtCard.Body>
                <RcraProfile profile={profile} />
              </HtCard.Body>
            </HtCard>
          </Col>
        </Row>
      </Container>
    </>
  );
}
