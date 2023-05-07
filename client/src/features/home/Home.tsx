import { useTitle } from 'hooks';
import React, { ReactElement, useEffect, useState } from 'react';
import { Col, Row, Toast, ToastContainer } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RootState, useAppDispatch, useAppSelector } from 'store';
import { getExampleTask } from 'store/notificationSlice/notification.slice';
import { getProfile } from 'store/rcraProfileSlice';
import { UserState } from 'store/userSlice/user.slice';
import { HtButton, HtCard } from 'components/Ht';

/**
 * Home page for logged-in user, currently does not really include anything
 * @constructor
 */
export function Home(): ReactElement {
  useTitle(`Haztrak`, false, true);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector<UserState>((state: RootState) => state.user);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // get user profile information when the user changes
    dispatch(getProfile());
  }, [user]);

  return (
    <div>
      <ToastContainer position={'top-end'}>
        <Toast show={showWelcome} onClose={() => setShowWelcome(!showWelcome)}>
          <Toast.Header className="d-flex justify-content-between">Welcome</Toast.Header>
          <Toast.Body>
            <p>
              Haztrak is an overkill proof of concept web application that shows how waste
              management systems can interface with the EPA's{' '}
              <Link to={'https://epa.gov/e-manifest'} target="_blank">
                e-Manifest system
              </Link>{' '}
              to electronically track hazardous waste.
            </p>
            <p>
              <Link to="https://usepa.github.io/haztrak/" target="_blank">
                check out our documentation{' '}
              </Link>
              for more info!
            </p>
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <HtCard>
        <HtCard.Header title="Overview" />
        <HtCard.Body>
          <Row>
            <Col>
              <h3 className="fw-bold d-flex justify-content-center">
                <Link to={'/manifest/in-transit'}>Placeholder</Link>
              </h3>
              <p className="d-flex justify-content-center">Manifests in transit</p>
            </Col>
            <Col>
              <h3 className="fw-bold d-flex justify-content-center">
                <Link to={'/manifest/ready-for-signature'}>Placeholder</Link>
              </h3>
              <p className="d-flex justify-content-center">Ready for Signature</p>
            </Col>
            <Col>
              <h3 className="fw-bold d-flex justify-content-center">
                <Link to={'/manifest/received'}>Placeholder</Link>
              </h3>
              <p className="d-flex justify-content-center">Received</p>
            </Col>
          </Row>
        </HtCard.Body>
      </HtCard>
      <HtButton
        align="start"
        onClick={() => {
          dispatch(getExampleTask());
        }}
      >
        Click me
      </HtButton>
    </div>
  );
}
