import logo from '/assets/img/haztrak-logos/high-resolution/png/haztrak-high-resolution-logo-black-on-transparent-background.png';

import { Button, Col, Container, Row, Stack } from 'react-bootstrap';
import { FaPen, FaSitemap } from 'react-icons/fa';
import { FaFileLines } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { FeatureDescription } from '~/components/legacyUi';

export function RegisterHero() {
  return (
    <Container fluid className="text-center px-4 py-5 bg-light tw-h-full">
      <img
        src={logo}
        alt="haztrak logo, hazardous waste tracking made easy."
        width="auto"
        height={100}
        className="my-3"
      />
      <h1 className="display-5 fw-bold mb-0 ">Focus on Waste Management</h1>
      <h2 className="display-6 fw-semibold pt-0">Let us Handle the paperwork</h2>
      <Col lg={6} className="mx-auto">
        <p className="lead my-2">
          The Resource Conservation and Recovery Act (RCRA) is complicated enough; don't make it
          more complicated with outdated hazardous waste management practices. Start electronically
          manifesting your waste shipments and take control of your data.
        </p>
        <Stack direction="horizontal" gap={3} className="d-flex justify-content-center">
          <Button variant="primary" size="lg">
            Learn More
          </Button>
          <Link to={'/login'}>
            <Button variant="outline-success" size="lg">
              Sign Up
            </Button>
          </Link>
        </Stack>
      </Col>
      <Row className="my-5 text-start pt-5" lg={3} xs={1}>
        <Col>
          <FeatureDescription title="Manifest" iconElement={<FaFileLines />}>
            <p>
              Leverage the power of integration with EPA while creating, updating, or deleting
              electronic hazardous waste manifests to accurately capture the waste shipment.
            </p>
          </FeatureDescription>
        </Col>
        <Col>
          <FeatureDescription title="e-Sign" iconElement={<FaPen />}>
            <p>
              Sign your electronic manifests to signify custody exchange without ever logging into
              EPA's e-Manifest system.
            </p>
          </FeatureDescription>
        </Col>
        <Col>
          <FeatureDescription title="Manage" iconElement={<FaSitemap />}>
            <p>
              Organize sites to match company structure and give personnel the access and tools to
              get the job done with ease.
            </p>
          </FeatureDescription>
        </Col>
      </Row>
    </Container>
  );
}
