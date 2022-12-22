import HtCard from 'components/HtCard';
import RcraProfile from 'features/profile/RcraProfile';
import UserProfile from 'features/profile/UserProfile';
import useTitle from 'hooks/useTitle';
import React, { ReactElement, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'store';
import { getProfile } from 'store/rcraProfileSlice';
import { RcraProfileState } from 'types/store';

/**
 * Display user profile
 * @constructor
 */
function Profile(): ReactElement {
  const dispatch = useAppDispatch();
  const profile = useAppSelector<RcraProfileState>((state) => state.rcraProfile);
  useTitle('Profile');

  useEffect(() => {
    dispatch(getProfile());
  }, [profile.user]);

  return (
    <>
      <Container className="py-2">
        <Row className="d-flex justify-content-start">
          <h1 className="fw-bold">Profile</h1>
        </Row>
      </Container>
      <Container fluid className="py-3 d-flex justify-content-center">
        <Col xs={12} md={11} lg={10} xl={8} className="justify-content-center">
          <HtCard>
            <HtCard.Header title="User Profile" />
            <HtCard.Body>
              <UserProfile profile={profile} />
            </HtCard.Body>
          </HtCard>
          <HtCard>
            <HtCard.Header title="RCRAInfo Profile" />
            <HtCard.Body>
              <RcraProfile profile={profile} />
            </HtCard.Body>
          </HtCard>
        </Col>
      </Container>
    </>
  );
}

export default Profile;
