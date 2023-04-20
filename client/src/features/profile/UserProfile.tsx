import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { RcraProfileState } from 'store/rcraProfileSlice/rcraProfile.slice';

interface ProfileViewProps {
  profile: RcraProfileState;
}

export function UserProfile({ profile }: ProfileViewProps) {
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
