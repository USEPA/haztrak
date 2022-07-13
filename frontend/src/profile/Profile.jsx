import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { getUser } from '../_store';

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const profile = useSelector((state) => state.user);

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
