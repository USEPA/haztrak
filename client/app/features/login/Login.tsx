import React, { ReactElement, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import { LoginForm } from '~/components/Auth';
import { useAuth, useTitle } from '~/hooks';
import logo from '/assets/img/haztrak-logos/low-resolution/svg/haztrak-low-resolution-logo-black-on-transparent-background.svg';

/**
 * Haztrak Login component, redirects if user is already logged in
 * @constructor
 */
export function Login(): ReactElement {
  useTitle('Login');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from ? location.state.from : '/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
