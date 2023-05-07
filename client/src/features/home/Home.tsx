import { faRecycle, faSignature, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NewManifestBtn } from 'components/buttons/NewManifestBtn';
import { useTitle } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
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

  useEffect(() => {
    // get user profile information when the user changes
    dispatch(getProfile());
  }, [user]);

  return (
    <>
      <HtCard>
        <HtCard.Header title="Get Started" />
        <HtCard.Body>
          <Row>
            <Col>
              <div className="text-center">
                <NewManifestBtn />
                <p>
                  Create your first electronic manifest to track hazardous waste without ever
                  logging into EPA's RCRAInfo system
                </p>
              </div>
            </Col>
            <Col className={'bg-black'}></Col>
            <Col className={'bg-warning'}></Col>
          </Row>
        </HtCard.Body>
      </HtCard>
      <HtCard>
        <HtCard.Header title="Manifests" />
        <HtCard.Body>
          <Row>
            <Col>
              <h3 className="fw-bold d-flex justify-content-center">
                <Link to={'/coming-soon'}>
                  <Button variant={'info'} size={'lg'} className="rounded-circle p-3">
                    <FontAwesomeIcon icon={faTruck} size={'2xl'} className="link-light" />
                  </Button>
                </Link>
              </h3>
              <p className="d-flex justify-content-center">Manifests in transit</p>
            </Col>
            <Col>
              <h3 className="fw-bold d-flex justify-content-center">
                <Link to={'/coming-soon'}>
                  <Button variant={'info'} size={'lg'} className="rounded-circle p-3">
                    <FontAwesomeIcon icon={faSignature} size={'2xl'} className="link-light" />
                  </Button>
                </Link>
              </h3>
              <p className="d-flex justify-content-center">Ready for Signature</p>
            </Col>
            <Col>
              <h3 className="fw-bold d-flex justify-content-center">
                <Link to={'/coming-soon'}>
                  <Button variant={'info'} size={'lg'} className="rounded-circle p-3">
                    <FontAwesomeIcon icon={faRecycle} size={'2xl'} className="link-light" />
                  </Button>
                </Link>
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
    </>
  );
}
