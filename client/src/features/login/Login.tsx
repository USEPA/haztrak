import logo from 'assets/haztrak-logos/low-resolution/svg/haztrak-low-resolution-logo-black-on-transparent-background.svg';
import { LoginForm } from 'components/Auth';
import { HtCard } from 'components/UI';
import { useTitle } from 'hooks';
import React, { ReactElement } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

/**
 * Haztrak Login component, redirects if user is already logged in
 * @constructor
 */
export function Login(): ReactElement {
  useTitle('Login');

  return (
    <Container className="py-3 ">
      <Row xs={12} className="d-flex justify-content-center">
        <img
          src={logo}
          alt="haztrak logo, hazardous waste tracking made easy."
          width="auto"
          height={100}
          className="my-3"
        />
      </Row>
      <Row className="d-flex justify-content-center">
        <Col xs={10} md={8} lg={6}>
          <HtCard>
            <HtCard.Header title="Sign In" />
            <HtCard.Body>
              <LoginForm />
            </HtCard.Body>
          </HtCard>
        </Col>
      </Row>
    </Container>
  );
}
