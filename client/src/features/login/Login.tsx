import { zodResolver } from '@hookform/resolvers/zod';
import { HtCard, HtForm } from 'components/Ht';
import React, { ReactElement, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { login, useAppDispatch, useAppSelector } from 'store';
import { useNavigate } from 'react-router-dom';
import { useTitle } from 'hooks';
import { selectUser } from 'store/userSlice';
import { z } from 'zod';
import { Col, Container, Form, Row } from 'react-bootstrap';
import logo from 'assets/haztrak-logos/low-resolution/svg/haztrak-low-resolution-logo-black-on-transparent-background.svg';

const loginSchema = z.object({
  username: z.string().min(1, 'Username Required').min(8),
  password: z.string().min(1, 'Password Required').min(8),
});

type LoginSchema = z.infer<typeof loginSchema>;

/**
 * Haztrak Login component, redirects if user is already logged in
 * @constructor
 */
export function Login(): ReactElement {
  useTitle('Login');
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navigation = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    // redirect to home if already logged in
    if (user.user) {
      navigation('/');
    }
  }, [user.user]);

  function onSubmit({ username, password }: LoginSchema) {
    return dispatch(login({ username, password }));
  }

  return (
    <Container className="d-flex justify-content-center m-5">
      <Col className="m-5">
        <Row className="d-flex justify-content-center">
          <img
            src={logo}
            alt="haztrak logo, hazardous waste tracking made easy."
            width="auto"
            height={100}
            className="my-3"
          />
        </Row>
        <Row>
          <HtCard>
            <HtCard.Header title="login" />
            <HtCard.Body>
              <HtForm onSubmit={handleSubmit(onSubmit)}>
                <HtForm.Group>
                  <HtForm.Label htmlFor="username">Username</HtForm.Label>
                  <Form.Control
                    id="username"
                    type="text"
                    placeholder={'wary-walrus-123'}
                    {...register('username', {})}
                    className={errors.username && 'is-invalid'}
                  />
                  <div className="invalid-feedback">{errors.username?.message}</div>
                </HtForm.Group>
                <HtForm.Group>
                  <HtForm.Label htmlFor="password">Password</HtForm.Label>
                  <Form.Control
                    id="password"
                    type="password"
                    placeholder="MyP@ssword123"
                    {...register('password', {})}
                    className={errors.password && 'is-invalid'}
                  />
                  <div className="invalid-feedback">{errors.password?.message}</div>
                </HtForm.Group>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary m-2">
                  {isSubmitting && <span className="spinner-border spinner-border-sm mr-1" />}
                  Login
                </button>
                {user.error && (
                  <div className="alert alert-danger mt-3 mb-0">{String(user.error)}</div>
                )}
              </HtForm>
            </HtCard.Body>
          </HtCard>
        </Row>
      </Col>
    </Container>
  );
}
