import { zodResolver } from '@hookform/resolvers/zod';
import { HtForm } from 'components/UI';
import React, { useEffect } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { login, selectUserState, useAppDispatch, useAppSelector } from 'store';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Username Required').min(8),
  password: z.string().min(1, 'Password Required').min(8),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const userState = useAppSelector(selectUserState);
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    // redirect to home if already logged in
    if (userState.user?.username) {
      navigation('/');
    }
  }, [userState.user?.username]);

  function onSubmit({ username, password }: LoginSchema) {
    return dispatch(login({ username, password }));
  }

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
        {isSubmitting && <span className="spinner-border spinner-border-sm mr-1" />}
        Login
      </button>
      {userState.error && (
        <div className="alert alert-danger mt-3 mb-0">{String(userState.error)}</div>
      )}
    </HtForm>
  );
}
