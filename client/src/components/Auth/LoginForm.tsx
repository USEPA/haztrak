import { zodResolver } from '@hookform/resolvers/zod';
import { HtForm, HtSpinner } from 'components/UI';
import React, { useEffect, useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  selectAuthenticated,
  setCredentials,
  useAppDispatch,
  useAppSelector,
  useLoginMutation,
} from 'store';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Username Required').min(8),
  password: z.string().min(1, 'Password Required').min(8),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const isAuthenticated = useAppSelector(selectAuthenticated);
  const [login, { error, isLoading }] = useLoginMutation();
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigation('/');
    }
  }, [isAuthenticated]);

  async function onSubmit({ username, password }: LoginSchema) {
    try {
      const response = await login({ username, password }).unwrap();
      if (response) {
        dispatch(setCredentials({ token: response.key }));
      } else {
        setLoginError('something went wrong');
      }
    } catch (error) {
      setLoginError('unable to log in with the provided credentials');
    }
  }

  useEffect(() => {
    if (error) {
      setLoginError('Error logging in');
    }
  }, [error]);

  return (
    <HtForm onSubmit={handleSubmit(onSubmit)}>
      <HtForm.Group>
        <FloatingLabel controlId="username" label="Username">
          <Form.Control
            type="text"
            placeholder={'Username'}
            {...register('username', {})}
            className={errors.username && 'is-invalid'}
          />
        </FloatingLabel>
        <div className="invalid-feedback">{errors.username?.message}</div>
      </HtForm.Group>
      <HtForm.Group>
        <FloatingLabel controlId="password" label="Password">
          <Form.Control
            type="password"
            placeholder="Password"
            {...register('password', {})}
            className={errors.password && 'is-invalid'}
          />
        </FloatingLabel>
        <div className="invalid-feedback">{errors.password?.message}</div>
      </HtForm.Group>
      <button type="submit" disabled={isSubmitting} className="btn btn-primary m-2">
        <span>Login </span>
        {isLoading && <HtSpinner size="lg" className="text-reset" />}
      </button>
      {loginError && <div className="alert alert-danger mt-3 mb-0">{loginError}</div>}
    </HtForm>
  );
}
