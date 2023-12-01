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
    <Container fluid className="bg-light vh-100 align-items-center py-5 d-flex">
      <div className="m-auto" style={{ maxWidth: 330 }}>
        <img
          src={logo}
          alt="haztrak logo, hazardous waste tracking made easy."
          width="auto"
          height={100}
          className="my-3"
        />
        <h1 className="h3 mb-3 text-start">Please Sign In</h1>
        <LoginForm />
      </div>
    </Container>
  );
}
