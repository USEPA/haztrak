import React from "react";
import {Card, Container} from "react-bootstrap";

const Profile = () => {
  return (
    <Container className="col-lg-10 p-5">
      <Card className="my-5 shadow-lg">
        <Card.Header className="bg-primary text-light">Profile</Card.Header>
        <Card.Body>
          card body
        </Card.Body>
      </Card>
      <Card className="my-5 shadow-lg">
        <Card.Header className="bg-primary text-light">My Sites</Card.Header>
        <Card.Body>
          card body
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Profile
