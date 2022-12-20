import HtCard from 'components/HtCard';
import RcraProfileView from 'features/profile/RcraProfileView';
import UserView from 'features/profile/UserView';
import useTitle from 'hooks/useTitle';
import React, { ReactElement, useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { getUser, useAppDispatch, useAppSelector } from 'store';
import { UserState } from 'types/store';

/**
 * Display user profile
 * @constructor
 */
function Profile(): ReactElement {
  const dispatch = useAppDispatch();
  const profile = useAppSelector<UserState>((state) => state.user);
  useTitle('Profile');

  useEffect(() => {
    dispatch(getUser());
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
              <UserView profile={profile} />
              <div className="mx-1 d-flex flex-row-reverse">
                {/* ToDo: onClick modal-form to add/edit haztrak user information*/}
                <Button variant="success">Edit User Profile</Button>
              </div>
            </HtCard.Body>
          </HtCard>
          <HtCard>
            <HtCard.Header title="RCRAInfo Profile" />
            <HtCard.Body>
              <RcraProfileView profile={profile} />
            </HtCard.Body>
          </HtCard>
        </Col>
      </Container>
    </>
  );
}

export default Profile;
