import { faPen, faRecycle, faSignature, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NewManifestBtn } from 'components/Manifest';
import { FeatureDescription, HtButton, HtCard } from 'components/UI';
import { useTitle } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { Accordion, Button, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { htApi } from 'services';
import {
  addAlert,
  addTask,
  getRcraProfile,
  selectUserName,
  useAppDispatch,
  useAppSelector,
} from 'store';

/**
 * Dashboard page for logged-in user
 * @constructor
 */
export function Dashboard(): ReactElement {
  useTitle(`Haztrak`, false, true);
  const dispatch = useAppDispatch();
  const userName = useAppSelector(selectUserName);

  useEffect(() => {
    // get user profile information when the user changes
    dispatch(getRcraProfile());
  }, [userName]);

  const launchExampleTask = async () => {
    const response = await htApi.get<{ taskId: string }>('/task/example');
    dispatch(
      addTask({
        taskId: response.data.taskId,
        status: 'PENDING',
        taskName: 'Example Long Running Task',
      })
    );
  };

  return (
    <Container className="py-2 pt-3">
      <Row className="my-3">
        <Accordion className="px-0">
          <Accordion.Item eventKey={'0'}>
            <Accordion.Header title="Getting Started">Welcome, let's get started</Accordion.Header>
            <Accordion.Body>
              <Row>
                <h3>Features</h3>
                <hr />
                <Col className="text-center">
                  <NewManifestBtn />
                  <p>
                    Create your first electronic manifest to track hazardous waste without ever
                    logging into EPA's RCRAInfo system
                  </p>
                </Col>
                <Col className="text-center">
                  <Link to={'/profile'}>
                    <Button variant="info text-light">Profile</Button>
                  </Link>
                  <p>
                    Update your Profile with your RCRAInfo API ID & key so you can electronically
                    manifest your waste through e-Manifest.
                  </p>
                </Col>
                <Col className="text-center">
                  <Link to={'/site'}>
                    <Button variant="dark">My Sites</Button>
                  </Link>
                  <p>View your site's information, check that EPA has the right information.</p>
                </Col>
              </Row>
              <h3>Alerts</h3>
              <hr />
              <Row className="align-content-start">
                <Col className="text-center">
                  <HtButton
                    onClick={() => {
                      launchExampleTask();
                    }}
                  >
                    Long Running Tasks
                  </HtButton>
                  <p>Check out what a long running task will look like</p>
                </Col>
                <Col className="text-center">
                  <HtButton
                    variant="danger"
                    onClick={() => {
                      dispatch(
                        addAlert({
                          message: 'Oh No!',
                          autoClose: 1000,
                          type: 'warning',
                        })
                      );
                    }}
                  >
                    Show Warning
                  </HtButton>
                  <p>Check out what an alert will look like</p>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
      <Row className="my-3">
        <HtCard title="Manifests">
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
      </Row>
    </Container>
  );
}
