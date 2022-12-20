import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { UserState } from 'types/store';

interface ProfileViewProps {
  profile: UserState;
}

function UserProfile({ profile }: ProfileViewProps) {
  return (
    <>
      <Container>
        <h4>Username</h4>
        <p>{profile.user}</p>
        <div className="mx-1 d-flex flex-row-reverse">
          <Button variant="success">Edit</Button>
        </div>
      </Container>
    </>
  );
}

export default UserProfile;
