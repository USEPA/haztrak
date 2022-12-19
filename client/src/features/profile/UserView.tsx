import React from 'react';
import { Container } from 'react-bootstrap';
import { UserState } from 'types/store';

interface ProfileViewProps {
  profile: UserState;
}

function UserView({ profile }: ProfileViewProps) {
  return (
    <>
      <Container>
        <h4>Username</h4>
        <p>{profile.user}</p>
      </Container>
    </>
  );
}

export default UserView;
