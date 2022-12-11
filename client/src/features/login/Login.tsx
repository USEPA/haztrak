import React, { ReactElement, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { login } from 'redux/store';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import useTitle from '../../hooks/useTitle';

interface Inputs {
  username: string;
  password: string;
}

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

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) {
      navigation('/');
    }
  }, [authUser]);

  // form validation rules
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>(formOptions);

  // const { errors, isSubmitting } = formState;

  function onSubmit({ username, password }: Inputs) {
    return dispatch(login({ username, password }));
  }

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <p className="h1 mb-4 text-center">
        <i className="fa-solid fa-truck-fast pe-2" />
        Haztrak
      </p>
      <div className="card" id="login-card">
        <h4 className="card-header bg-primary text-light">Login</h4>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group>
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control
                id="username"
                type="text"
                placeholder={'wary-walrus-123'}
                {...register('username', {})}
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.username?.message}</div>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="password">Password</Form.Label>
              <input
                id="password"
                type="password"
                placeholder="MyP@ssword123"
                {...register('password', {})}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </Form.Group>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary m-2"
            >
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm mr-1" />
              )}
              Login
            </button>
            {authError && (
              <div className="alert alert-danger mt-3 mb-0">{authError}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
