import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import history from 'utils';
import { login } from 'app/store';
import { useAppDispatch, useAppSelector } from 'app/hooks';

interface Inputs {
  username: string;
  password: string;
}

/**
 * Haztrak Login component, redirects if user is already logged in
 * @returns {JSX.Element}
 * @constructor
 */
function Login() {
  const dispatch = useAppDispatch();
  const useSelector = useAppSelector;
  const authUser = useSelector((state) => state.user.user);
  const authError = useSelector((state) => state.user.error);

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) {
      // @ts-ignore
      history.navigate('/');
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
      <div className="card" id="login-card">
        <h4 className="card-header bg-primary text-light">Login</h4>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                {...register('username')}
                className={`form-control ${
                  errors.username ? 'is-invalid' : ''
                }`}
              />
              <div className="invalid-feedback">{errors.username?.message}</div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
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
