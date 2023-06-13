import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { HaztrakUser } from 'store/userSlice/user.slice';

interface UserProfileProps {
  user: HaztrakUser;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <>
      <Container>
        <Row>
          <Col>
            <h4>Username</h4>
            <p>{user.username}</p>
            <h4>Email</h4>
            <p>{user.email}</p>
          </Col>
          <Col>
            <h4>First Name</h4>
            <p>{user.firstName}</p>
            <h4>Last Name</h4>
            <p>{user.lastName}</p>
          </Col>
        </Row>
        <div className="mx-1 d-flex flex-row-reverse">
          <Button variant="success">Edit</Button>
        </div>
      </Container>
    </>
  );
}
