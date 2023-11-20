import { faRecycle, faSignature, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NewManifestBtn } from 'components/buttons/NewManifestBtn';
import { HtButton, HtCard } from 'components/Ht';
import { useTitle } from 'hooks';
import React, { ReactElement, useEffect, useState } from 'react';
import { Accordion, Button, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { htApi } from 'services';
import {
  getRcraProfile,
  selectUserName,
  useAppDispatch,
  useAppSelector,
  useGetTaskStatusQuery,
} from 'store';

/**
 * Home page for logged-in user
 * @constructor
 */
export function Home(): ReactElement {
  useTitle(`Haztrak`, false, true);
  const dispatch = useAppDispatch();
  const userName = useAppSelector(selectUserName);
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const [taskComplete, setTaskComplete] = useState<boolean>(true);

  useEffect(() => {
    // get user profile information when the user changes
    dispatch(getRcraProfile());
  }, [userName]);

  const launchExampleTask = async () => {
    const response = await htApi.get<{ taskId: string }>('/task/example');
    console.log(response);
    setTaskComplete(false);
    setTaskId(response.data.taskId);
  };

  // @ts-ignore
  const { data, isLoading, error } = useGetTaskStatusQuery(taskId, {
    pollingInterval: 3000,
    skip: taskId === undefined || taskComplete,
  });

  console.log(data, isLoading, error);
  // setTaskComplete(data?.status === 'SUCCESS' || data?.status === 'FAILURE');

  if (taskId) {
    const id = toast.loading('Loading...', { toastId: taskId });
    if (data && !taskComplete && data.status === 'SUCCESS') {
      setTaskComplete(true);
      toast.update(id, {
        render: 'Success!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        toastId: taskId,
      });
    }
  }

  return (
    <Container className="py-2">
      <HtCard>
        <Accordion>
          <Accordion.Item eventKey={'0'}>
            <Accordion.Header title="Getting Started">Welcome, let's get started</Accordion.Header>
            <Accordion.Body>
              <Row>
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
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
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
      <Row className="align-content-start">
        <HtButton
          onClick={() => {
            launchExampleTask();
          }}
        >
          Click me
        </HtButton>
        <HtButton
          variant="danger"
          onClick={() => {
            toast.error('OH NO!');
          }}
        >
          Show Alert
        </HtButton>
      </Row>
    </Container>
  );
}
