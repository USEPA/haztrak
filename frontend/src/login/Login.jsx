import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import history from '../helpers';
import { login } from '../store';
// import userSlice from '../store/user.slice';

// import { authActions } from '../store';

function Login() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.user.user);
  const authError = useSelector((state) => state.user.error);

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) {
      history.navigate('/');
    }
  }, []);

  // form validation rules
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit({ username, password }) {
    return dispatch(login({username, password}));
  }

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <div className="card">
        <h4 className="card-header bg-primary text-light">Login</h4>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Username</label>
              <input
                name="username"
                type="text"
                {...register('username')}
                className={`form-control ${
                  errors.username ? 'is-invalid' : ''
                }`}
              />
              <div className="invalid-feedback">{errors.username?.message}</div>
            </div>
            <div className="form-group">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label>Password</label>
              <input
                name="password"
                type="password"
                {...register('password')}
                className={`form-control ${
                  errors.password ? 'is-invalid' : ''
                }`}
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary m-2"
            >
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm mr-1"/>
              )}
              Login
            </button>
            {authError && (
              <div className="alert alert-danger mt-3 mb-0">
                {authError.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
