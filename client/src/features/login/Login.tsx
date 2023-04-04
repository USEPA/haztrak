import { zodResolver } from '@hookform/resolvers/zod';
import { HtForm } from 'components/Ht';
import React, { ReactElement, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { login, useAppDispatch, useAppSelector } from 'store';
import { useNavigate } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { z } from 'zod';
import { Form } from 'react-bootstrap';

const loginSchema = z.object({
  username: z.string().min(8),
  password: z.string().min(8),
});

type LoginSchema = z.infer<typeof loginSchema>;

/**
 * Haztrak Login component, redirects if user is already logged in
 * @constructor
 */
function Login(): ReactElement {
  useTitle('Login');
  const dispatch = useAppDispatch();
  const useSelector = useAppSelector;
  const authUser = useSelector((state) => state.user.user);
  const authError = useSelector((state) => state.user.error);
  const navigation = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) {
      navigation('/');
    }
  }, [authUser]);

  function onSubmit({ username, password }: LoginSchema) {
    return dispatch(login({ username, password }));
  }

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <p className="h1 mb-4 text-center">
        <FontAwesomeIcon icon={faTruckFast} className="pe-2" />
        Haztrak
      </p>
      <div className="card" id="login-card">
        <h4 className="card-header bg-primary text-light">Login</h4>
        <div className="card-body">
          <HtForm onSubmit={handleSubmit(onSubmit)}>
            <HtForm.Group>
              <HtForm.Label htmlFor="username">Username</HtForm.Label>
              <Form.Control
                id="username"
                type="text"
                placeholder={'wary-walrus-123'}
                {...register('username', {})}
                className={`${errors.username ? 'is-invalid' : ''}`}
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
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </HtForm.Group>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary m-2">
              {isSubmitting && <span className="spinner-border spinner-border-sm mr-1" />}
              Login
            </button>
            {authError && <div className="alert alert-danger mt-3 mb-0">{authError}</div>}
          </HtForm>
        </div>
      </div>
    </div>
  );
}

export default Login;
