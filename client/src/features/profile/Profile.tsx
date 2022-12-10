import React, { ReactElement, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { getUser } from 'redux/store';
import useTitle from 'hooks/useTitle';

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
      <Row className="justify-content-center">
        <Col xs md={10} lg={9} xl={8}>
          <Card className="shadow-lg">
            <Card.Header className="bg-primary">
              <p className="h4 text-light">{user} Profile</p>
            </Card.Header>
            <Card.Body className="bg-white">
              hello this is a card body
              <p className="fw-bold">RCRAInfo API ID</p>
              <p>{profile.rcraAPIID}</p>
              <p className="fw-bold">Phone Number</p>
              <p>{profile.phoneNumber}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
