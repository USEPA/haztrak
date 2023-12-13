import { NewManifestBtn } from 'components/Manifest';
import { HtButton, HtCard } from 'components/UI';
import { useTitle } from 'hooks';
import React, { ReactElement } from 'react';
import { Accordion, Button, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { htApi } from 'services';
import { addAlert, addTask, useAppDispatch } from 'store';
import {
  GeneratorStatusAreaChart,
  ManifestCountBarChart,
  ManifestStatusPieChart,
} from 'components/Charts';

/** Dashboard page for logged-in user*/
export function Dashboard(): ReactElement {
  useTitle(`Haztrak`, false, true);
  const dispatch = useAppDispatch();

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
      <Row xs={1} lg={2}>
        <Col className="my-3">
          <HtCard title="Calculated Status" className="p-2">
            <GeneratorStatusAreaChart />
          </HtCard>
        </Col>
        <Col className="my-3">
          <HtCard title="Manifest by Status" className="p-2">
            <ManifestStatusPieChart />
          </HtCard>
        </Col>
      </Row>
      <Row>
        <Col>
          <HtCard title="Manifest count" className="p-2">
            <ManifestCountBarChart />
          </HtCard>
        </Col>
      </Row>
    </Container>
  );
}
