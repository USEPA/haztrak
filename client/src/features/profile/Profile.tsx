import React, { ReactElement, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { Col, Container, Row } from 'react-bootstrap';
import { getUser } from 'store/store';
import useTitle from 'hooks/useTitle';
import HtCard from '../../components/HtCard';

/**
 * Display user profile
 * @constructor
 */
function Profile(): ReactElement {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const profile = useAppSelector((state) => state.user);
  useTitle('Profile');

  useEffect(() => {
    dispatch(getUser());
  }, [user]);

  return (
    <Container fluid className="py-3">
      <h1 className="fw-bold">Profile</h1>
      <Row className="justify-content-center">
        <Col xs md={10} lg={9} xl={8}>
          <HtCard className="shadow-lg">
            <HtCard.Header title={`${user}`} />
            <HtCard.Body>
              hello this is a card body
              <p className="fw-bold">RCRAInfo API ID</p>
              <p>{profile.rcraAPIID}</p>
              <p className="fw-bold">Phone Number</p>
              <p>{profile.phoneNumber}</p>
            </HtCard.Body>
          </HtCard>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
